/**
 * Humain Pulse — Machine-Native Clearing Operator
 * Engine (EXACT SPEC)
 */

import type { ActorInput, ActorOutput, Registry } from './types'
import {
  computeSubscores,
  computeMEI,
  computeMLI,
  deriveState,
  computeDelta24h,
} from './formulas'
import { ACTORS } from './data'

// In-memory store for yesterday's MEI values
let yesterdayMEI: Record<string, number> = {}

/**
 * Compute a single actor's output
 */
export function computeActor(input: ActorInput, prevMEI: number | null = null): ActorOutput {
  const MEI = computeMEI(input.sector, input.primitives)
  const MLI = computeMLI(input.sector, input.primitives)
  const state = deriveState(input.primitives)
  const subscores = computeSubscores(input.sector, input.primitives)
  const delta_24h = computeDelta24h(MEI, prevMEI)

  return {
    actor_id: input.actor_id,
    actor_name: input.actor_name,
    slug: input.slug,
    sector: input.sector,
    state,
    MEI,
    MLI,
    delta_24h,
    subscores,
    primitives: input.primitives,
    proofs: input.proofs,
    last_updated_utc: new Date().toISOString(),
  }
}

/**
 * Compute all actors
 */
export function computeAllActors(): ActorOutput[] {
  return ACTORS.map((input) => {
    const prevMEI = yesterdayMEI[input.slug] ?? null
    return computeActor(input, prevMEI)
  })
}

/**
 * Generate registry
 */
export function generateRegistry(): Registry {
  const actors = computeAllActors()
  // Sort by MEI descending
  actors.sort((a, b) => b.MEI - a.MEI)

  return {
    actors,
    generated_utc: new Date().toISOString(),
  }
}

/**
 * Get single actor by slug
 */
export function getActorBySlug(slug: string): ActorOutput | null {
  const input = ACTORS.find((a) => a.slug === slug)
  if (!input) return null

  const prevMEI = yesterdayMEI[slug] ?? null
  return computeActor(input, prevMEI)
}

/**
 * Store today's MEI as yesterday for tomorrow's delta calculation
 */
export function snapshotForTomorrow(): void {
  const actors = computeAllActors()
  yesterdayMEI = {}
  for (const actor of actors) {
    yesterdayMEI[actor.slug] = actor.MEI
  }
}

/**
 * Get summary stats
 */
export function getStats(): {
  total: number
  non_clearable: number
  clearable: number
  settled: number
  avg_mei: number
  avg_mli: number
} {
  const actors = computeAllActors()
  const non_clearable = actors.filter((a) => a.state === 'Non-Clearable').length
  const clearable = actors.filter((a) => a.state === 'Clearable').length
  const settled = actors.filter((a) => a.state === 'Settled').length
  const avg_mei = Math.round(actors.reduce((sum, a) => sum + a.MEI, 0) / actors.length)
  const avg_mli = Math.round(actors.reduce((sum, a) => sum + a.MLI, 0) / actors.length)

  return {
    total: actors.length,
    non_clearable,
    clearable,
    settled,
    avg_mei,
    avg_mli,
  }
}

/**
 * Get actors grouped by sector
 */
export function getActorsBySector(): Record<string, ActorOutput[]> {
  const actors = computeAllActors()
  const bySector: Record<string, ActorOutput[]> = {}

  for (const actor of actors) {
    if (!bySector[actor.sector]) {
      bySector[actor.sector] = []
    }
    bySector[actor.sector].push(actor)
  }

  // Sort each sector by MEI descending
  for (const sector of Object.keys(bySector)) {
    bySector[sector].sort((a, b) => b.MEI - a.MEI)
  }

  return bySector
}
