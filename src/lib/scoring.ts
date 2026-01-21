import type {
  Primitives,
  PrimitiveScore,
  PrimitiveStatus,
  ConformanceStatus,
  ReinsuranceMEIFactors,
  ComputeMEIFactors,
  IntelligenceMEIFactors,
  ActuationMEIFactors,
  MEIFactors
} from '@/types'

/**
 * HP-STD-001 Scoring Engine
 *
 * Primitive Scores: 0=ABSENT, 1=CONCEPTUAL, 2=PROXY, 3=PARTIAL_PUBLIC, 4=PUBLIC_VERIFIABLE
 * MLI (Liability) = (MID + EI + M2M_SE + LCH + CSD) × 5  → Range 0-100
 * MEI (Exposure) = Sector-specific formula → Range 0-200
 */

// Get status label from score
export function getStatusFromScore(score: PrimitiveScore): PrimitiveStatus {
  switch (score) {
    case 0: return 'ABSENT'
    case 1: return 'CONCEPTUAL'
    case 2: return 'PROXY'
    case 3: return 'PARTIAL_PUBLIC'
    case 4: return 'PUBLIC_VERIFIABLE'
  }
}

// Get display label for primitive status
export function getStatusLabel(status: PrimitiveStatus): string {
  switch (status) {
    case 'ABSENT': return 'MISSING'
    case 'CONCEPTUAL': return 'CONCEPTUAL'
    case 'PROXY': return 'PROXY'
    case 'PARTIAL_PUBLIC': return 'PARTIAL'
    case 'PUBLIC_VERIFIABLE': return 'VERIFIED'
  }
}

// Calculate MLI (Machine Liability Index) - Range 0-100
// Formula: MLI = (MID + EI + M2M_SE + LCH + CSD) × 5
export function calculateMLI(primitives: Primitives): number {
  const sum = primitives.MID.score +
              primitives.EI.score +
              primitives.M2M_SE.score +
              primitives.LCH.score +
              primitives.CSD.score
  return Math.min(100, sum * 5)
}

// Calculate MEI for Reinsurance - Range 0-200
// Formula: MEI = (AI_UW + PORTFOLIO_AI + ACCUMULATION + TRIGGERS + LATENCY + RETROCESSION + CLAIMS_AUTOMATION) × 6
export function calculateReinsuranceMEI(factors: ReinsuranceMEIFactors): number {
  const sum = factors.AI_UW +
              factors.PORTFOLIO_AI +
              factors.ACCUMULATION +
              factors.TRIGGERS +
              factors.LATENCY +
              factors.RETROCESSION +
              factors.CLAIMS_AUTOMATION
  return Math.min(200, sum * 6)
}

// Calculate MEI for Compute/Cloud - Range 0-200
// Formula: MEI = (WORKLOAD_SHARE + CROSS_DEPENDENCY + AUTONOMY_LEVEL + SCALE + TIME_CRITICALITY) × 8
export function calculateComputeMEI(factors: ComputeMEIFactors): number {
  const sum = factors.WORKLOAD_SHARE +
              factors.CROSS_DEPENDENCY +
              factors.AUTONOMY_LEVEL +
              factors.SCALE +
              factors.TIME_CRITICALITY
  return Math.min(200, sum * 8)
}

// Calculate MEI for Intelligence/AI - Range 0-200
// Formula: MEI = (DEPLOYED_AUTONOMY + DOWNSTREAM_IMPACT + TOKEN_VOLUME + INTEGRATION_DEPTH + TIME) × 8
export function calculateIntelligenceMEI(factors: IntelligenceMEIFactors): number {
  const sum = factors.DEPLOYED_AUTONOMY +
              factors.DOWNSTREAM_IMPACT +
              factors.TOKEN_VOLUME +
              factors.INTEGRATION_DEPTH +
              factors.TIME
  return Math.min(200, sum * 8)
}

// Calculate MEI for Actuation/Robotics - Range 0-200
// Formula: MEI = (PHYSICAL_AUTONOMY + FLEET_SIZE + HUMAN_OVERRIDE_GAP + ENVIRONMENTAL_RISK + TIME) × 8
export function calculateActuationMEI(factors: ActuationMEIFactors): number {
  const sum = factors.PHYSICAL_AUTONOMY +
              factors.FLEET_SIZE +
              factors.HUMAN_OVERRIDE_GAP +
              factors.ENVIRONMENTAL_RISK +
              factors.TIME
  return Math.min(200, sum * 8)
}

// Calculate MEI based on sector model
export function calculateMEI(factors: MEIFactors, model: string): number {
  switch (model) {
    case 'MEI_reinsurance':
      return calculateReinsuranceMEI(factors as ReinsuranceMEIFactors)
    case 'MEI_compute':
      return calculateComputeMEI(factors as ComputeMEIFactors)
    case 'MEI_ai':
      return calculateIntelligenceMEI(factors as IntelligenceMEIFactors)
    case 'MEI_actuation':
      return calculateActuationMEI(factors as ActuationMEIFactors)
    default:
      return 0
  }
}

// Determine conformance status
// CONFORMING: MLI >= 80 AND at least 4 primitives at level 4
// PARTIALLY_CONFORMING: MLI >= 50 AND at least 2 primitives at level 3+
// NON_CONFORMING: Otherwise
export function determineStatus(mli: number, primitives: Primitives): ConformanceStatus {
  const scores = [
    primitives.MID.score,
    primitives.EI.score,
    primitives.M2M_SE.score,
    primitives.LCH.score,
    primitives.CSD.score
  ]

  const level4Count = scores.filter(s => s === 4).length
  const level3PlusCount = scores.filter(s => s >= 3).length

  if (mli >= 80 && level4Count >= 4) {
    return 'CONFORMING'
  }

  if (mli >= 50 && level3PlusCount >= 2) {
    return 'PARTIALLY_CONFORMING'
  }

  return 'NON_CONFORMING'
}

// Calculate daily debt units
export function calculateDailyDebt(mei: number, status: ConformanceStatus): number {
  if (status === 'CONFORMING') return 0
  // Base debt scales with MEI
  const baseDebt = Math.floor(mei / 10)
  // Multiplier for non-conforming
  const multiplier = status === 'NON_CONFORMING' ? 1.5 : 1.0
  return Math.round(baseDebt * multiplier)
}

// Get status color
export function getStatusColor(status: ConformanceStatus): 'green' | 'amber' | 'red' {
  switch (status) {
    case 'CONFORMING': return 'green'
    case 'PARTIALLY_CONFORMING': return 'amber'
    case 'NON_CONFORMING': return 'red'
  }
}

// Get primitive score color
export function getPrimitiveColor(score: PrimitiveScore): string {
  if (score === 4) return 'text-emerald-500'
  if (score === 3) return 'text-yellow-500'
  return 'text-red-500'
}

// Count primitives at specific levels
export function countPrimitivesAtLevel(primitives: Primitives, minLevel: PrimitiveScore): number {
  const scores = [
    primitives.MID.score,
    primitives.EI.score,
    primitives.M2M_SE.score,
    primitives.LCH.score,
    primitives.CSD.score
  ]
  return scores.filter(s => s >= minLevel).length
}
