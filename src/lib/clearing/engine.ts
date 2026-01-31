import type { ActorInput, ActorOutput } from './types'
import { computeExposure, computeMEI, computeMLI, computeD24h, deriveState, simpleHash } from './formulas'
import { ACTORS } from './data'

function computeActorRaw(input: ActorInput, asOf: string): ActorOutput {
  const exposure = computeExposure(input.sector, input.scale_proxy)
  const MEI = computeMEI(input.sector, input.primitives, input.scale_proxy, input.proof_strength)
  const MLI = computeMLI(input.sector, input.primitives, input.scale_proxy, input.proof_strength)
  const d24h = computeD24h(exposure, input.primitives, input.proof_strength)
  return {
    actor_id: input.actor_id,
    actor_name: input.actor_name,
    slug: input.slug,
    sector: input.sector,
    state: deriveState(input.primitives, input.proof_strength),
    MEI,
    MLI,
    exposure,
    d24h,
    proof_handle: input.proof_handle,
    primitives: input.primitives,
    as_of: asOf,
  }
}

function applyTiebreak(actors: ActorOutput[]): ActorOutput[] {
  const tripletKey = (a: ActorOutput) => `${a.MEI}:${a.MLI}:${a.exposure}`
  const groups = new Map<string, ActorOutput[]>()

  for (const a of actors) {
    const key = tripletKey(a)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(a)
  }

  for (const group of groups.values()) {
    if (group.length <= 1) continue
    for (const a of group) {
      const epsilon = (simpleHash(a.actor_name + a.as_of) % 3) - 1
      a.MEI = Math.max(0, Math.min(100, a.MEI + epsilon))
      a.exposure = Math.max(0, Math.min(100, a.exposure + epsilon))
      // MLI unchanged per spec
    }
  }

  // Second pass: if any duplicates remain, shift by index
  const seen = new Set<string>()
  for (const a of actors) {
    let key = tripletKey(a)
    let shift = 0
    while (seen.has(key) && shift < 3) {
      shift++
      a.MEI = Math.max(0, Math.min(100, a.MEI - shift))
      key = tripletKey(a)
    }
    seen.add(key)
  }

  return actors
}

export function computeAllActors(): ActorOutput[] {
  const asOf = new Date().toISOString().split('T')[0]
  const actors = ACTORS.map((input) => computeActorRaw(input, asOf))
  return applyTiebreak(actors)
}

export function getRegistry(): ActorOutput[] {
  const actors = computeAllActors()
  actors.sort((a, b) => b.exposure - a.exposure)
  return actors
}

export function getActorBySlug(slug: string): ActorOutput | null {
  const all = computeAllActors()
  return all.find((a) => a.slug === slug) ?? null
}

export function getStats() {
  const actors = computeAllActors()
  return {
    total: actors.length,
    nonClearable: actors.filter((a) => a.state === 'Non-Clearable').length,
    clearable: actors.filter((a) => a.state === 'Clearable').length,
    settled: actors.filter((a) => a.state === 'Settled').length,
  }
}
