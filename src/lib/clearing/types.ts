/**
 * Humain Pulse — Machine-Native Clearing Operator
 */

export type Sector = 'REINSURANCE' | 'AI_LABS' | 'CLOUD' | 'ROBOTICS'

export type State = 'UNSETTLED' | 'PARTIAL' | 'SETTLED' | 'OBSERVED'

export type Band = 'LOW' | 'ELEVATED' | 'CRITICAL'

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
  primitives: Primitives
}

export interface ActorOutput {
  actor_id: string
  actor_name: string
  slug: string
  sector: Sector
  state: State
  MEI: number
  MLI: number
  dMEI_24h: number
  dMLI_24h: number
  mei_band: Band
  mli_band: Band
  primitives: Primitives
  last_updated_utc: string
}
