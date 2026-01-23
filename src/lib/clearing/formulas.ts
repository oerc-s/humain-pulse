/**
 * Clearing Engine Formulas
 * Deterministic calculations for MEI, MLI, and status derivation
 */

import type { ClearingPrimitives, ClearingMEIFactors, ClearingStatus, ClearingExposure } from './types'

/**
 * Calculate Machine Exposure Index (MEI)
 * MEI = AUTOMATION × SCALE × TIME × SURFACE
 *
 * @param factors - MEI calculation factors
 * @returns MEI value (unbounded, typically 0-200+)
 */
export function calculateMEI(factors: ClearingMEIFactors): number {
  const automation = factors.automation_observed ? 5 : 1
  const scale = Math.log10(factors.number_of_agents + 1)
  const time = factors.hours_since_last_settlement / 24
  const surface = factors.uncontrolled_execution_surfaces

  const mei = automation * scale * time * surface

  // Round to 2 decimal places for consistency
  return Math.round(mei * 100) / 100
}

/**
 * Calculate Machine Liability Index (MLI)
 * MLI = COUNT(true primitives) × 20, max 100
 *
 * @param primitives - Boolean primitive states
 * @returns MLI value (0-100)
 */
export function calculateMLI(primitives: ClearingPrimitives): number {
  const truePrimitives = [
    primitives.MID,
    primitives.EI,
    primitives.M2M_SE,
    primitives.LCH,
    primitives.CSD
  ].filter(Boolean).length

  return Math.min(truePrimitives * 20, 100)
}

/**
 * Derive clearing status from MLI
 * MLI < 40  → UNSETTLED
 * 40 ≤ MLI < 80 → PARTIAL
 * MLI ≥ 80 → SETTLED
 *
 * @param mli - Machine Liability Index
 * @returns Clearing status
 */
export function deriveStatus(mli: number): ClearingStatus {
  if (mli < 40) return 'UNSETTLED'
  if (mli < 80) return 'PARTIAL'
  return 'SETTLED'
}

/**
 * Calculate full exposure for an actor
 *
 * @param primitives - Actor's primitive states
 * @param factors - MEI calculation factors
 * @returns Complete exposure calculation
 */
export function calculateExposure(
  primitives: ClearingPrimitives,
  factors: ClearingMEIFactors
): ClearingExposure {
  return {
    MEI: calculateMEI(factors),
    MLI: calculateMLI(primitives)
  }
}

/**
 * Check if actor is eligible for settlement
 * Settlement requires MLI ≥ 80
 *
 * @param mli - Machine Liability Index
 * @returns Whether settlement is allowed
 */
export function canSettle(mli: number): boolean {
  return mli >= 80
}

/**
 * Calculate hours since a given timestamp
 *
 * @param timestamp - ISO timestamp or null
 * @returns Hours elapsed (defaults to 24 if null)
 */
export function hoursSince(timestamp: string | null): number {
  if (!timestamp) return 24 // Default to 24 hours for new actors

  const then = new Date(timestamp).getTime()
  const now = Date.now()
  const hours = (now - then) / (1000 * 60 * 60)

  return Math.max(0, Math.round(hours * 100) / 100)
}

/**
 * Update MEI factors with new time calculation
 *
 * @param factors - Current MEI factors
 * @param lastSettlement - Last settlement timestamp
 * @returns Updated MEI factors
 */
export function updateTimeFactors(
  factors: ClearingMEIFactors,
  lastSettlement: string | null
): ClearingMEIFactors {
  return {
    ...factors,
    hours_since_last_settlement: hoursSince(lastSettlement)
  }
}
