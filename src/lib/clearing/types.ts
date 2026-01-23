/**
 * Clearing Engine Types
 * Machine-native clearing with deterministic state transitions
 */

// Clearing Status - simplified from conformance
export type ClearingStatus = 'UNSETTLED' | 'PARTIAL' | 'SETTLED'

// Clearing primitives - boolean for deterministic clearing
export interface ClearingPrimitives {
  MID: boolean      // Machine Identity
  EI: boolean       // Exposure Index
  M2M_SE: boolean   // Machine-to-Machine Settlement Endpoint
  LCH: boolean      // Liability Chain
  CSD: boolean      // Control Surface Definition
}

// MEI factors for clearing calculations
export interface ClearingMEIFactors {
  automation_observed: boolean
  number_of_agents: number
  hours_since_last_settlement: number
  uncontrolled_execution_surfaces: number
}

// Core clearing actor
export interface ClearingActor {
  actor_id: string
  name: string
  layer: string
  sector: string
  status: ClearingStatus
  primitives: ClearingPrimitives
  mei_factors: ClearingMEIFactors
  last_settlement: string | null
  created_at: string
}

// Exposure calculation result
export interface ClearingExposure {
  MEI: number  // Machine Exposure Index (calculated)
  MLI: number  // Machine Liability Index (0-100)
}

// Actor with computed exposure
export interface ClearingActorWithExposure {
  actor: ClearingActor
  exposure: ClearingExposure
}

// Clearing event types
export type ClearingEventType =
  | 'RECALCULATION'
  | 'PRIMITIVE_UPDATE'
  | 'SETTLEMENT_ATTEMPT'
  | 'SETTLEMENT_SUCCESS'
  | 'SETTLEMENT_BLOCKED'
  | 'STATUS_CHANGE'

// Clearing event (immutable ledger entry)
export interface ClearingEvent {
  event_id: string
  timestamp: string
  actor_id: string
  event_type: ClearingEventType
  note: string
  mei_before: number
  mei_after: number
  mli_before: number
  mli_after: number
  status_before: ClearingStatus
  status_after: ClearingStatus
}

// Engine state summary
export interface EngineState {
  total_actors: number
  by_status: {
    UNSETTLED: number
    PARTIAL: number
    SETTLED: number
  }
  total_mei: number
  total_mli: number
  average_mei: number
  average_mli: number
  last_recalculation: string | null
  events_count: number
}

// API response types
export interface ActorsResponse {
  actors: ClearingActorWithExposure[]
  count: number
  timestamp: string
}

export interface EventsResponse {
  events: ClearingEvent[]
  count: number
  timestamp: string
}

export interface StateResponse {
  state: EngineState
  timestamp: string
}

// Primitive update request
export interface PrimitiveUpdateRequest {
  actor_id: string
  primitives: Partial<ClearingPrimitives>
}

// Settlement request
export interface SettlementRequest {
  actor_id: string
}

// Settlement response
export interface SettlementResponse {
  success: boolean
  actor_id: string
  note: string
  event?: ClearingEvent
}

// Recalculation response
export interface RecalculationResponse {
  recalculated: number
  events_created: number
  timestamp: string
}
