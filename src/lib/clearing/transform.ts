/**
 * Clearing Engine Transform
 * Transform existing actors to clearing model
 */

import type { ClearingActor, ClearingPrimitives, ClearingMEIFactors, ClearingStatus } from './types'
import { ACTORS } from '../data'
import { REINSURANCE_ACTORS, type ReinsuranceActor, type PrimitiveState } from '../reinsurance-data'

/**
 * Transform primitive score (0-4) to boolean
 * Score >= 3 → true, else false
 */
function scoreToBoolean(score: number): boolean {
  return score >= 3
}

/**
 * Transform primitive state to boolean
 * PUBLISHED → true, else false
 */
function stateToBoolean(state: PrimitiveState): boolean {
  return state === 'PUBLISHED'
}

/**
 * Transform conformance status to clearing status
 */
function transformConformanceStatus(status: string): ClearingStatus {
  switch (status) {
    case 'CONFORMING':
      return 'SETTLED'
    case 'PARTIALLY_CONFORMING':
    case 'PARTIAL':
      return 'PARTIAL'
    case 'NON_CONFORMING':
    case 'UNSETTLED':
    case 'HUMAN-GATED':
    case 'NON-CLEARABLE':
    default:
      return 'UNSETTLED'
  }
}

/**
 * Generate actor ID from existing ID or slug
 */
function generateActorId(id: string, index: number): string {
  const num = String(index + 1).padStart(4, '0')
  return `HP-ACT-${num}`
}

/**
 * Transform a general actor to clearing model
 */
function transformGeneralActor(actor: (typeof ACTORS)[0], index: number): ClearingActor {
  const primitives: ClearingPrimitives = {
    MID: scoreToBoolean(actor.primitives.MID.score),
    EI: scoreToBoolean(actor.primitives.EI.score),
    M2M_SE: scoreToBoolean(actor.primitives.M2M_SE.score),
    LCH: scoreToBoolean(actor.primitives.LCH.score),
    CSD: scoreToBoolean(actor.primitives.CSD.score)
  }

  // Derive MEI factors from existing data
  const mei_factors: ClearingMEIFactors = {
    automation_observed: actor.scores.MEI > 100,
    number_of_agents: Math.max(1, Math.round(actor.scores.MEI / 10)),
    hours_since_last_settlement: actor.debt.days_non_conforming * 24,
    uncontrolled_execution_surfaces: Math.max(1, Math.round(actor.scores.MEI / 50))
  }

  return {
    actor_id: generateActorId(actor.id, index),
    name: actor.name,
    layer: actor.layer,
    sector: actor.sector,
    status: transformConformanceStatus(actor.status),
    primitives,
    mei_factors,
    last_settlement: null,
    created_at: new Date().toISOString()
  }
}

/**
 * Transform a reinsurance actor to clearing model
 */
function transformReinsuranceActor(actor: ReinsuranceActor, index: number): ClearingActor {
  const primitives: ClearingPrimitives = {
    MID: stateToBoolean(actor.primitives.MID.state),
    EI: stateToBoolean(actor.primitives.EI.state),
    M2M_SE: stateToBoolean(actor.primitives['M2M-SE'].state),
    LCH: stateToBoolean(actor.primitives.LCH.state),
    CSD: stateToBoolean(actor.primitives.CSD.state)
  }

  // Derive MEI factors from reinsurance factors
  const totalFactors = actor.factors.CAP + actor.factors.PORT + actor.factors.SPEED + actor.factors.DEP + actor.factors.GATE
  const mei_factors: ClearingMEIFactors = {
    automation_observed: actor.factors.GATE < 3, // Low gate = more automation
    number_of_agents: Math.max(1, actor.factors.CAP * 10),
    hours_since_last_settlement: 24 * 30, // Default 30 days for reinsurance
    uncontrolled_execution_surfaces: Math.max(1, 5 - actor.factors.GATE)
  }

  return {
    actor_id: generateActorId(actor.slug, index + ACTORS.length),
    name: actor.name,
    layer: 'Capital',
    sector: 'Reinsurance',
    status: transformConformanceStatus(actor.status),
    primitives,
    mei_factors,
    last_settlement: null,
    created_at: new Date().toISOString()
  }
}

/**
 * Transform all existing actors to clearing model
 * Deduplicates by name (general actors take precedence)
 */
export function transformAllActors(): ClearingActor[] {
  const clearingActors: ClearingActor[] = []
  const seenNames = new Set<string>()

  // Transform general actors first
  for (let i = 0; i < ACTORS.length; i++) {
    const actor = ACTORS[i]
    if (!seenNames.has(actor.name)) {
      clearingActors.push(transformGeneralActor(actor, i))
      seenNames.add(actor.name)
    }
  }

  // Transform reinsurance actors (skip duplicates)
  for (let i = 0; i < REINSURANCE_ACTORS.length; i++) {
    const actor = REINSURANCE_ACTORS[i]
    if (!seenNames.has(actor.name)) {
      clearingActors.push(transformReinsuranceActor(actor, i))
      seenNames.add(actor.name)
    }
  }

  return clearingActors
}

/**
 * Get count of actors that will be transformed
 */
export function getTransformCount(): { general: number; reinsurance: number; total: number } {
  const generalNames = new Set(ACTORS.map(a => a.name))
  const reinsuranceOnly = REINSURANCE_ACTORS.filter(a => !generalNames.has(a.name))

  return {
    general: ACTORS.length,
    reinsurance: reinsuranceOnly.length,
    total: ACTORS.length + reinsuranceOnly.length
  }
}
