/**
 * Humain Pulse — Deterministic Scoring
 * Scale: 0–100
 */

import type { Sector, State, Primitives } from './types'

// Sector constants
const AUTONOMY: Record<Sector, number> = {
  REINSURANCE: 0.4, AI_LABS: 1.0, CLOUD: 0.7, ROBOTICS: 1.0,
}

const SYSTEMIC: Record<Sector, number> = {
  REINSURANCE: 0.85, AI_LABS: 0.65, CLOUD: 0.90, ROBOTICS: 0.55,
}

const LOSS_SURFACE: Record<Sector, number> = {
  REINSURANCE: 0.80, AI_LABS: 0.60, CLOUD: 0.70, ROBOTICS: 0.95,
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function primSum(p: Primitives): number {
  return p.MID + p.M2M_SE + p.LCH + p.CSD
}

export function primitiveGap(p: Primitives): number {
  return (4 - primSum(p)) / 4
}

export function computeExposure(sector: Sector, scaleProxy: number): number {
  const scale = scaleProxy / 3
  const raw = 0.30 * AUTONOMY[sector] + 0.30 * SYSTEMIC[sector] + 0.30 * LOSS_SURFACE[sector] + 0.10 * scale
  return Math.round(100 * clamp(raw, 0, 1))
}

export function computeMEI(sector: Sector, p: Primitives, scaleProxy: number, proofStrength: number): number {
  const scale = scaleProxy / 3
  const proof = proofStrength / 3
  const gap = primitiveGap(p)
  const raw = 45 + 35 * gap + 15 * scale + 10 * AUTONOMY[sector] + 10 * SYSTEMIC[sector] - 20 * proof
  return Math.round(clamp(raw, 0, 100))
}

export function computeMLI(sector: Sector, p: Primitives, scaleProxy: number, proofStrength: number): number {
  const scale = scaleProxy / 3
  const proof = proofStrength / 3
  const gap = primitiveGap(p)
  const raw = 50 + 40 * gap + 20 * scale + 15 * LOSS_SURFACE[sector] + 10 * AUTONOMY[sector] - 25 * proof
  return Math.round(clamp(raw, 0, 100))
}

export function computeD24h(exposure: number, p: Primitives, proofStrength: number): number {
  const gap = primitiveGap(p)
  const proof = proofStrength / 3
  const raw = 1 + 0.08 * exposure + 1.5 * gap - 2.0 * proof
  return clamp(Math.round(raw), 0, 9)
}

export function deriveState(p: Primitives, proofStrength: number): State {
  const ps = primSum(p)
  if (ps === 4 && proofStrength === 3) return 'Settled'
  if (ps >= 2 && proofStrength >= 2) return 'Clearable'
  return 'Non-Clearable'
}

// Deterministic hash for tiebreak
export function simpleHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}
