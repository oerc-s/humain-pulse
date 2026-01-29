/**
 * Humain Pulse — Deterministic Scoring
 * Scale: 0–1000
 */

import type { Sector, State, Band, Primitives } from './types'

const AUTONOMY: Record<Sector, number> = {
  REINSURANCE: 0.40, AI_LABS: 1.00, CLOUD: 0.70, ROBOTICS: 1.00,
}

const SYSTEMIC: Record<Sector, number> = {
  REINSURANCE: 0.85, AI_LABS: 0.65, CLOUD: 0.90, ROBOTICS: 0.55,
}

const LOSS: Record<Sector, number> = {
  REINSURANCE: 0.80, AI_LABS: 0.60, CLOUD: 0.70, ROBOTICS: 0.95,
}

const MEI_W: Record<Sector, { wA: number; wS: number; wL: number; wP: number }> = {
  REINSURANCE: { wA: 0.10, wS: 0.40, wL: 0.35, wP: 0.15 },
  AI_LABS:     { wA: 0.35, wS: 0.35, wL: 0.20, wP: 0.10 },
  CLOUD:       { wA: 0.20, wS: 0.40, wL: 0.30, wP: 0.10 },
  ROBOTICS:    { wA: 0.35, wS: 0.30, wL: 0.25, wP: 0.10 },
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function primitiveGap(p: Primitives): number {
  let miss = 0
  if (!p.MID) miss++
  if (!p.EI) miss++
  if (!p.M2M_SE) miss++
  if (!p.LCH) miss++
  if (!p.CSD) miss++
  return miss / 5
}

export function computeMEI(sector: Sector, p: Primitives): number {
  const w = MEI_W[sector]
  const raw = w.wA * AUTONOMY[sector] + w.wS * SYSTEMIC[sector] + w.wL * LOSS[sector] + w.wP * primitiveGap(p)
  return clamp(Math.round(1000 * raw), 0, 1000)
}

export function computeMLI(sector: Sector, p: Primitives): number {
  const raw = 0.55 * primitiveGap(p) + 0.35 * LOSS[sector] + 0.10 * AUTONOMY[sector]
  return clamp(Math.round(1000 * raw), 0, 1000)
}

export function deriveState(p: Primitives): State {
  const count = [p.MID, p.EI, p.M2M_SE, p.LCH, p.CSD].filter(Boolean).length
  if (count === 5) return 'SETTLED'
  if (count >= 2) return 'PARTIAL'
  if (count === 1) return 'OBSERVED'
  return 'UNSETTLED'
}

export function band(v: number): Band {
  if (v <= 300) return 'LOW'
  if (v <= 600) return 'ELEVATED'
  return 'CRITICAL'
}

export function computeDelta(current: number, prev: number | null): number {
  if (prev === null) return 0
  return clamp(Math.round(current - prev), -1000, 1000)
}
