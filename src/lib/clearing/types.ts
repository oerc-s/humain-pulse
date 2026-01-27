/**
 * Humain Pulse — Machine-Native Clearing Operator
 * Type definitions (EXACT SPEC)
 */

export type Sector = 'REINSURANCE' | 'AI_LABS' | 'CLOUD' | 'ROBOTICS'

export type State = 'Non-Clearable' | 'Clearable' | 'Settled'

export interface Primitives {
  MID: boolean
  M2M_SE: boolean
  LCH: boolean
  CSD: boolean
}

export interface Proof {
  title: string
  url: string
  source_type: string
  date: string
}

export interface ActorInput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  primitives: Primitives
  proofs: Proof[]
}

export interface Subscores {
  A: number // autonomy_level
  S: number // systemic_concentration
  L: number // loss_surface
  P: number // primitive_gap
}

export interface ActorOutput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  state: State
  MEI: number
  MLI: number
  delta_24h: number
  subscores: Subscores
  primitives: Primitives
  proofs: Proof[]
  last_updated_utc: string
}

export interface Registry {
  actors: ActorOutput[]
  generated_utc: string
}
