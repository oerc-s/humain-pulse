/**
 * Humain Pulse — Machine-Native Clearing Operator
 * Deterministic Scoring (EXACT SPEC)
 */

import type { Sector, State, Primitives, Subscores } from './types'

// SECTOR CONSTANTS (EXACT)
const AUTONOMY_LEVEL: Record<Sector, number> = {
  REINSURANCE: 0.40,
  AI_LABS: 1.00,
  CLOUD: 0.70,
  ROBOTICS: 1.00,
}

const SYSTEMIC_CONCENTRATION: Record<Sector, number> = {
  REINSURANCE: 0.85,
  AI_LABS: 0.65,
  CLOUD: 0.90,
  ROBOTICS: 0.55,
}

const LOSS_SURFACE: Record<Sector, number> = {
  REINSURANCE: 0.80,
  AI_LABS: 0.60,
  CLOUD: 0.70,
  ROBOTICS: 0.95,
}

// MEI WEIGHTS BY SECTOR (EXACT)
const MEI_WEIGHTS: Record<Sector, { wA: number; wS: number; wL: number; wP: number }> = {
  REINSURANCE: { wA: 0.10, wS: 0.40, wL: 0.35, wP: 0.15 },
  AI_LABS:     { wA: 0.35, wS: 0.35, wL: 0.20, wP: 0.10 },
  CLOUD:       { wA: 0.20, wS: 0.40, wL: 0.30, wP: 0.10 },
  ROBOTICS:    { wA: 0.35, wS: 0.30, wL: 0.25, wP: 0.10 },
}

/**
 * Clamp value to [min, max]
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Count missing primitives (EXACT)
 */
export function countMissingPrimitives(primitives: Primitives): number {
  let count = 0
  if (!primitives.MID) count++
  if (!primitives.M2M_SE) count++
  if (!primitives.LCH) count++
  if (!primitives.CSD) count++
  return count
}

/**
 * Compute primitive_gap (EXACT)
 * primitive_gap = missing_primitives / 4
 */
export function computePrimitiveGap(primitives: Primitives): number {
  return countMissingPrimitives(primitives) / 4
}

/**
 * Compute subscores (EXACT)
 * A = autonomy_level (sector constant)
 * S = systemic_concentration (sector constant)
 * L = loss_surface (sector constant)
 * P = primitive_gap (computed)
 */
export function computeSubscores(sector: Sector, primitives: Primitives): Subscores {
  return {
    A: Math.round(100 * AUTONOMY_LEVEL[sector]),
    S: Math.round(100 * SYSTEMIC_CONCENTRATION[sector]),
    L: Math.round(100 * LOSS_SURFACE[sector]),
    P: Math.round(100 * computePrimitiveGap(primitives)),
  }
}

/**
 * Compute MEI (EXACT)
 * MEI = CLIP_0_100(round(100*(wA*A + wS*S + wL*L + wP*P)))
 */
export function computeMEI(sector: Sector, primitives: Primitives): number {
  const w = MEI_WEIGHTS[sector]
  const A = AUTONOMY_LEVEL[sector]
  const S = SYSTEMIC_CONCENTRATION[sector]
  const L = LOSS_SURFACE[sector]
  const P = computePrimitiveGap(primitives)

  const raw = w.wA * A + w.wS * S + w.wL * L + w.wP * P
  return clamp(Math.round(100 * raw), 0, 100)
}

/**
 * Compute MLI (EXACT)
 * MLI_raw = 0.55*P + 0.35*L + 0.10*A
 * MLI = CLIP_0_100(round(100*MLI_raw))
 */
export function computeMLI(sector: Sector, primitives: Primitives): number {
  const A = AUTONOMY_LEVEL[sector]
  const L = LOSS_SURFACE[sector]
  const P = computePrimitiveGap(primitives)

  const raw = 0.55 * P + 0.35 * L + 0.10 * A
  return clamp(Math.round(100 * raw), 0, 100)
}

/**
 * Derive state (EXACT)
 * If MID && M2M_SE && LCH && CSD => "Settled"
 * Else if at least 2 primitives => "Clearable"
 * Else => "Non-Clearable"
 */
export function deriveState(primitives: Primitives): State {
  const { MID, M2M_SE, LCH, CSD } = primitives

  if (MID && M2M_SE && LCH && CSD) {
    return 'Settled'
  }

  const count = [MID, M2M_SE, LCH, CSD].filter(Boolean).length
  if (count >= 2) {
    return 'Clearable'
  }

  return 'Non-Clearable'
}

/**
 * Compute delta_24h (EXACT)
 * delta_24h = CLIP_-100_100(round(MEI_today - MEI_yesterday))
 */
export function computeDelta24h(currentMEI: number, yesterdayMEI: number | null): number {
  if (yesterdayMEI === null) return 0
  const delta = currentMEI - yesterdayMEI
  return clamp(Math.round(delta), -100, 100)
}
