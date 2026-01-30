/**
 * Humain Pulse — Machine-Native Clearing Operator
 */

export type Sector = 'REINSURANCE' | 'AI_LABS' | 'CLOUD' | 'ROBOTICS'

export type State = 'UNSETTLED' | 'PARTIAL' | 'SETTLED' | 'OBSERVED'

export interface Primitives {
  MID: boolean
  EI: boolean
  M2M_SE: boolean
  LCH: boolean
  CSD: boolean
}

export interface ActorInput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  scaleProxy: number
  proof_handle: string | null
  primitives: Primitives
}

export interface ActorOutput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  state: State
  exposure: number
  MEI: number
  MLI: number
  d24h: number
  proof_handle: string | null
  primitives: Primitives
  as_of: string
}
