/**
 * Humain Pulse — Machine-Native Clearing Operator
 */

export type Sector = 'REINSURANCE' | 'AI_LABS' | 'CLOUD' | 'ROBOTICS'

export type State = 'Non-Clearable' | 'Clearable' | 'Settled'

export interface Primitives {
  MID: 0 | 1
  M2M_SE: 0 | 1
  LCH: 0 | 1
  CSD: 0 | 1
}

export interface ActorInput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  primitives: Primitives
  proof_strength: 0 | 1 | 2 | 3
  scale_proxy: 1 | 2 | 3
  proof_handle: string
}

export interface ActorOutput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  state: State
  MEI: number
  MLI: number
  exposure: number
  d24h: number
  proof_handle: string
  primitives: Primitives
  as_of: string
}
