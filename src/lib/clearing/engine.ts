import type { ActorInput, ActorOutput } from './types'
import { computeMEI, computeMLI, computeExposure, deriveState, computeD24h } from './formulas'
import { ACTORS } from './data'

export function computeActor(input: ActorInput): ActorOutput {
  const MEI = computeMEI(input.sector, input.primitives)
  const MLI = computeMLI(input.sector, input.primitives)
  const exposure = computeExposure(MEI, MLI, input.scaleProxy)
  const d24h = computeD24h(input.scaleProxy)
  return {
    actor_id: input.actor_id,
    actor_name: input.actor_name,
    slug: input.slug,
    sector: input.sector,
    state: deriveState(input.primitives),
    exposure,
    MEI,
    MLI,
    d24h,
    proof_handle: input.proof_handle,
    primitives: input.primitives,
    as_of: new Date().toISOString(),
  }
}

export function computeAllActors(): ActorOutput[] {
  return ACTORS.map(computeActor)
}

export function getRegistry(): ActorOutput[] {
  const actors = computeAllActors()
  actors.sort((a, b) => b.exposure - a.exposure)
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
