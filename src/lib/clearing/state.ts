/**
 * Clearing Engine State Management
 * In-memory state with capped event ledger
 */

import type {
  ClearingActor,
  ClearingActorWithExposure,
  ClearingEvent,
  EngineState
} from './types'
import { calculateExposure, deriveStatus } from './formulas'

// Maximum events to retain in ledger (deterministic = rebuildable)
const MAX_EVENTS = 1000

// In-memory state
let actors: Map<string, ClearingActor> = new Map()
let events: ClearingEvent[] = []
let lastRecalculation: string | null = null
let initialized = false

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const seq = String(events.length + 1).padStart(4, '0')
  return `HP-CLR-${date}-${seq}`
}

/**
 * Initialize state from transformed actors
 */
export function initializeState(clearingActors: ClearingActor[]): void {
  actors.clear()
  for (const actor of clearingActors) {
    actors.set(actor.actor_id, actor)
  }
  initialized = true
}

/**
 * Check if state has been initialized
 */
export function isInitialized(): boolean {
  return initialized
}

/**
 * Get all actors with computed exposure
 */
export function getAllActors(): ClearingActorWithExposure[] {
  return Array.from(actors.values()).map(actor => ({
    actor,
    exposure: calculateExposure(actor.primitive_scores, actor.mei_factors)
  }))
}

/**
 * Get a single actor by ID
 */
export function getActor(actorId: string): ClearingActor | undefined {
  return actors.get(actorId)
}

/**
 * Get actor with computed exposure
 */
export function getActorWithExposure(actorId: string): ClearingActorWithExposure | undefined {
  const actor = actors.get(actorId)
  if (!actor) return undefined

  return {
    actor,
    exposure: calculateExposure(actor.primitive_scores, actor.mei_factors)
  }
}

/**
 * Update an actor in state
 */
export function updateActor(actor: ClearingActor): void {
  actors.set(actor.actor_id, actor)
}

/**
 * Append an event to the ledger (capped)
 */
export function appendEvent(event: Omit<ClearingEvent, 'event_id' | 'timestamp'>): ClearingEvent {
  const fullEvent: ClearingEvent = {
    ...event,
    event_id: generateEventId(),
    timestamp: new Date().toISOString()
  }

  events.push(fullEvent)

  // Maintain cap - remove oldest events if over limit
  if (events.length > MAX_EVENTS) {
    events = events.slice(-MAX_EVENTS)
  }

  return fullEvent
}

/**
 * Get all events (most recent first)
 */
export function getEvents(limit?: number): ClearingEvent[] {
  const sorted = [...events].reverse()
  return limit ? sorted.slice(0, limit) : sorted
}

/**
 * Get events for a specific actor
 */
export function getActorEvents(actorId: string, limit?: number): ClearingEvent[] {
  const actorEvents = events
    .filter(e => e.actor_id === actorId)
    .reverse()
  return limit ? actorEvents.slice(0, limit) : actorEvents
}

/**
 * Set last recalculation timestamp
 */
export function setLastRecalculation(timestamp: string): void {
  lastRecalculation = timestamp
}

/**
 * Get engine state summary
 */
export function getEngineState(): EngineState {
  const allActors = getAllActors()

  const byStatus = {
    UNSETTLED: 0,
    PARTIAL: 0,
    SETTLED: 0
  }

  let totalMEI = 0
  let totalMLI = 0

  for (const { actor, exposure } of allActors) {
    byStatus[actor.status]++
    totalMEI += exposure.MEI
    totalMLI += exposure.MLI
  }

  const count = allActors.length

  return {
    total_actors: count,
    by_status: byStatus,
    total_mei: Math.round(totalMEI * 100) / 100,
    total_mli: Math.round(totalMLI * 100) / 100,
    average_mei: count > 0 ? Math.round((totalMEI / count) * 100) / 100 : 0,
    average_mli: count > 0 ? Math.round((totalMLI / count) * 100) / 100 : 0,
    last_recalculation: lastRecalculation,
    events_count: events.length
  }
}

/**
 * Get total actor count
 */
export function getActorCount(): number {
  return actors.size
}

/**
 * Get events count
 */
export function getEventsCount(): number {
  return events.length
}

/**
 * Clear all state (for testing)
 */
export function clearState(): void {
  actors.clear()
  events = []
  lastRecalculation = null
  initialized = false
}
