/**
 * Clearing Engine Core
 * Recalculation, primitive updates, and settlement execution
 */

import type {
  ClearingActor,
  ClearingActorWithExposure,
  ClearingEvent,
  ClearingPrimitives,
  SettlementResponse,
  RecalculationResponse
} from './types'
import {
  calculateMEI,
  calculateMLIFromScores,
  deriveStatus,
  canSettle,
  updateTimeFactors
} from './formulas'
import {
  CLEARING_NOTES,
  getRecalculationNote,
  getSettlementNote,
  getSettlementCompleteNote,
  getPrimitiveUpdateNote
} from './language'
import {
  getAllActors,
  getActor,
  updateActor,
  appendEvent,
  setLastRecalculation,
  initializeState,
  isInitialized
} from './state'
import { transformAllActors } from './transform'

/**
 * Ensure engine is initialized
 */
export function ensureInitialized(): void {
  if (!isInitialized()) {
    const actors = transformAllActors()
    initializeState(actors)
  }
}

/**
 * Recalculate a single actor's exposure and status
 * Returns event if state changed
 */
export function recalculateActor(actorId: string): ClearingEvent | null {
  ensureInitialized()

  const actor = getActor(actorId)
  if (!actor) return null

  // Calculate current values
  const currentMLI = calculateMLIFromScores(actor.primitive_scores)
  const currentMEI = calculateMEI(actor.mei_factors)
  const currentStatus = actor.status

  // Update time factors
  const updatedFactors = updateTimeFactors(actor.mei_factors, actor.last_settlement)
  const newMEI = calculateMEI(updatedFactors)
  const newMLI = currentMLI // MLI doesn't change from time alone
  const newStatus = deriveStatus(newMLI)

  // Check if anything changed
  const meiChanged = Math.abs(newMEI - currentMEI) > 0.01
  const statusChanged = newStatus !== currentStatus

  if (!meiChanged && !statusChanged) {
    return null // No change, no event
  }

  // Update actor
  const updatedActor: ClearingActor = {
    ...actor,
    mei_factors: updatedFactors,
    status: newStatus
  }
  updateActor(updatedActor)

  // Create event
  const event = appendEvent({
    actor_id: actorId,
    event_type: statusChanged ? 'STATUS_CHANGE' : 'RECALCULATION',
    note: getRecalculationNote(meiChanged),
    mei_before: currentMEI,
    mei_after: newMEI,
    mli_before: currentMLI,
    mli_after: newMLI,
    status_before: currentStatus,
    status_after: newStatus
  })

  return event
}

/**
 * Recalculate all actors
 * Returns summary of changes
 */
export function recalculateAll(): RecalculationResponse {
  ensureInitialized()

  const allActors = getAllActors()
  let eventsCreated = 0

  for (const { actor } of allActors) {
    const event = recalculateActor(actor.actor_id)
    if (event) eventsCreated++
  }

  const timestamp = new Date().toISOString()
  setLastRecalculation(timestamp)

  return {
    recalculated: allActors.length,
    events_created: eventsCreated,
    timestamp
  }
}

/**
 * Update primitives for an actor
 */
export function updatePrimitives(
  actorId: string,
  primitiveUpdates: Partial<ClearingPrimitives>
): ClearingEvent | null {
  ensureInitialized()

  const actor = getActor(actorId)
  if (!actor) return null

  // Calculate current values
  const currentMLI = calculateMLIFromScores(actor.primitive_scores)
  const currentMEI = calculateMEI(actor.mei_factors)
  const currentStatus = actor.status

  // Apply updates
  const newPrimitives: ClearingPrimitives = {
    ...actor.primitives,
    ...primitiveUpdates
  }

  // Calculate new values
  const newMLI = currentMLI // MLI based on scores, not boolean primitives
  const newMEI = currentMEI // MEI doesn't change from primitives alone
  const newStatus = deriveStatus(newMLI)

  // Update actor
  const updatedActor: ClearingActor = {
    ...actor,
    primitives: newPrimitives,
    status: newStatus
  }
  updateActor(updatedActor)

  // Create event
  const event = appendEvent({
    actor_id: actorId,
    event_type: 'PRIMITIVE_UPDATE',
    note: getPrimitiveUpdateNote(),
    mei_before: currentMEI,
    mei_after: newMEI,
    mli_before: currentMLI,
    mli_after: newMLI,
    status_before: currentStatus,
    status_after: newStatus
  })

  return event
}

/**
 * Execute settlement for an actor
 * Resets MEI to 0 if MLI >= 80
 */
export function executeSettlement(actorId: string): SettlementResponse {
  ensureInitialized()

  const actor = getActor(actorId)
  if (!actor) {
    return {
      success: false,
      actor_id: actorId,
      note: CLEARING_NOTES.CLEARING_UNAVAILABLE
    }
  }

  // Calculate current values
  const currentMLI = calculateMLIFromScores(actor.primitive_scores)
  const currentMEI = calculateMEI(actor.mei_factors)
  const currentStatus = actor.status

  // Check if settlement is allowed
  if (!canSettle(currentMLI)) {
    // Log the blocked attempt
    const blockedEvent = appendEvent({
      actor_id: actorId,
      event_type: 'SETTLEMENT_BLOCKED',
      note: CLEARING_NOTES.CLEARING_UNAVAILABLE,
      mei_before: currentMEI,
      mei_after: currentMEI,
      mli_before: currentMLI,
      mli_after: currentMLI,
      status_before: currentStatus,
      status_after: currentStatus
    })

    return {
      success: false,
      actor_id: actorId,
      note: CLEARING_NOTES.CLEARING_UNAVAILABLE,
      event: blockedEvent
    }
  }

  // Execute settlement - reset MEI factors
  const settledTimestamp = new Date().toISOString()
  const newFactors = {
    ...actor.mei_factors,
    hours_since_last_settlement: 0
  }
  const newMEI = calculateMEI(newFactors)
  const newStatus = deriveStatus(currentMLI) // Status based on MLI

  // Update actor
  const updatedActor: ClearingActor = {
    ...actor,
    mei_factors: newFactors,
    status: newStatus,
    last_settlement: settledTimestamp
  }
  updateActor(updatedActor)

  // Create success event
  const event = appendEvent({
    actor_id: actorId,
    event_type: 'SETTLEMENT_SUCCESS',
    note: getSettlementCompleteNote(),
    mei_before: currentMEI,
    mei_after: newMEI,
    mli_before: currentMLI,
    mli_after: currentMLI,
    status_before: currentStatus,
    status_after: newStatus
  })

  return {
    success: true,
    actor_id: actorId,
    note: getSettlementCompleteNote(),
    event
  }
}

/**
 * Get actor with exposure (convenience export)
 */
export function getActorWithExposure(actorId: string): ClearingActorWithExposure | null {
  ensureInitialized()

  const actor = getActor(actorId)
  if (!actor) return null

  return {
    actor,
    exposure: {
      MEI: calculateMEI(actor.mei_factors),
      MLI: calculateMLIFromScores(actor.primitive_scores)
    }
  }
}

/**
 * Get all actors with exposure (convenience export)
 */
export function getAllActorsWithExposure(): ClearingActorWithExposure[] {
  ensureInitialized()
  return getAllActors()
}
