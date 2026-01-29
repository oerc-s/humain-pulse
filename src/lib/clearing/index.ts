export type { Sector, State, Band, Primitives, ActorInput, ActorOutput } from './types'
export { computeMEI, computeMLI, deriveState, band, primitiveGap } from './formulas'
export { computeActor, computeAllActors, getLeagueTable, getActorBySlug, getStats } from './engine'
export { ACTORS } from './data'
