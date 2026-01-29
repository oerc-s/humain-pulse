import type { ActorInput, ActorOutput } from './types'
import { computeMEI, computeMLI, deriveState, band, computeDelta } from './formulas'
import { ACTORS } from './data'

let prevMEI: Record<string, number> = {}
let prevMLI: Record<string, number> = {}

export function computeActor(input: ActorInput): ActorOutput {
  const MEI = computeMEI(input.sector, input.primitives)
  const MLI = computeMLI(input.sector, input.primitives)
  return {
    actor_id: input.actor_id,
    actor_name: input.actor_name,
    slug: input.slug,
    sector: input.sector,
    state: deriveState(input.primitives),
    MEI,
    MLI,
    dMEI_24h: computeDelta(MEI, prevMEI[input.slug] ?? null),
    dMLI_24h: computeDelta(MLI, prevMLI[input.slug] ?? null),
    mei_band: band(MEI),
    mli_band: band(MLI),
    primitives: input.primitives,
    last_updated_utc: new Date().toISOString(),
  }
}

export function computeAllActors(): ActorOutput[] {
  return ACTORS.map(computeActor)
}

export function getLeagueTable(): ActorOutput[] {
  const actors = computeAllActors()
  actors.sort((a, b) => b.MEI - a.MEI)
  return actors
}

export function getActorBySlug(slug: string): ActorOutput | null {
  const input = ACTORS.find((a) => a.slug === slug)
  if (!input) return null
  return computeActor(input)
}

export function getStats() {
  const actors = computeAllActors()
  return {
    total: actors.length,
    unsettled: actors.filter((a) => a.state === 'UNSETTLED').length,
    partial: actors.filter((a) => a.state === 'PARTIAL').length,
    settled: actors.filter((a) => a.state === 'SETTLED').length,
    observed: actors.filter((a) => a.state === 'OBSERVED').length,
  }
}
