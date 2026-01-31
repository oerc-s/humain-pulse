export type { Sector, State, Primitives, ActorInput, ActorOutput } from './types'
export { computeExposure, computeMEI, computeMLI, computeD24h, deriveState, primitiveGap, primSum } from './formulas'
export { computeAllActors, getRegistry, getActorBySlug, getStats } from './engine'
export { ACTORS } from './data'
