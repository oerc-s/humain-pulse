export type { Sector, State, Primitives, ActorInput, ActorOutput } from './types'
export { computeMEI, computeMLI, computeExposure, deriveState, primitiveGap, computeD24h } from './formulas'
export { computeActor, computeAllActors, getRegistry, getActorBySlug, getStats } from './engine'
export { ACTORS } from './data'
