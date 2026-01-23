/**
 * Clearing Engine - Machine-Native Clearing for Humain Pulse
 *
 * Deterministic state transitions, CRON-based enforcement,
 * and economic pressure via state persistence.
 */

// Types
export type {
  ClearingStatus,
  ClearingPrimitives,
  ClearingMEIFactors,
  ClearingActor,
  ClearingExposure,
  ClearingActorWithExposure,
  ClearingEventType,
  ClearingEvent,
  EngineState,
  ActorsResponse,
  EventsResponse,
  StateResponse,
  PrimitiveUpdateRequest,
  SettlementRequest,
  SettlementResponse,
  RecalculationResponse
} from './types'

// Formulas
export {
  calculateMEI,
  calculateMLI,
  deriveStatus,
  calculateExposure,
  canSettle,
  hoursSince,
  updateTimeFactors
} from './formulas'

// Language
export {
  CLEARING_NOTES,
  validateLanguage,
  getSettlementNote,
  getRecalculationNote,
  getStatusChangeNote,
  getPrimitiveUpdateNote,
  getSettlementCompleteNote
} from './language'

// State
export {
  initializeState,
  isInitialized,
  getAllActors,
  getActor,
  updateActor,
  appendEvent,
  getEvents,
  getActorEvents,
  getEngineState,
  getActorCount,
  getEventsCount,
  clearState
} from './state'

// Transform
export {
  transformAllActors,
  getTransformCount
} from './transform'

// Engine
export {
  ensureInitialized,
  recalculateActor,
  recalculateAll,
  updatePrimitives,
  executeSettlement,
  getActorWithExposure,
  getAllActorsWithExposure
} from './engine'
