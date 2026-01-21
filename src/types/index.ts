// HP-STD-001 Type Definitions

export type Layer = 'Capital' | 'Compute' | 'Intelligence' | 'Actuation'
export type Sector = 'Reinsurance' | 'Cloud' | 'Hardware' | 'Model Labs' | 'Robotics'

export type PrimitiveKey = 'MID' | 'EI' | 'M2M_SE' | 'LCH' | 'CSD'

// Primitive Score Levels: 0=ABSENT, 1=CONCEPTUAL, 2=PROXY, 3=PARTIAL_PUBLIC, 4=PUBLIC_VERIFIABLE
export type PrimitiveScore = 0 | 1 | 2 | 3 | 4

export type PrimitiveStatus = 'ABSENT' | 'CONCEPTUAL' | 'PROXY' | 'PARTIAL_PUBLIC' | 'PUBLIC_VERIFIABLE'

export type ConformanceStatus = 'NON_CONFORMING' | 'PARTIALLY_CONFORMING' | 'CONFORMING'

export type NoticeType = 'NON_CONFORMANCE' | 'EXPOSURE_UPDATE' | 'DEBT_ACCRUAL' | 'STATUS_CHANGE'

export type EvidenceTier = 'PUBLIC' | 'STRONG_PROXY' | 'WEAK_PROXY'

export interface PrimitiveData {
  score: PrimitiveScore
  status: PrimitiveStatus
  evidence_url?: string
  endpoint?: string
  last_verified: string | null
}

export interface Primitives {
  MID: PrimitiveData
  EI: PrimitiveData
  M2M_SE: PrimitiveData
  LCH: PrimitiveData
  CSD: PrimitiveData
}

// Reinsurance MEI factors
export interface ReinsuranceMEIFactors {
  AI_UW: number        // AI Underwriting
  PORTFOLIO_AI: number // Portfolio AI
  ACCUMULATION: number
  TRIGGERS: number
  LATENCY: number
  RETROCESSION: number
  CLAIMS_AUTOMATION: number
}

// Compute/Cloud MEI factors
export interface ComputeMEIFactors {
  WORKLOAD_SHARE: number
  CROSS_DEPENDENCY: number
  AUTONOMY_LEVEL: number
  SCALE: number
  TIME_CRITICALITY: number
}

// AI/Intelligence MEI factors
export interface IntelligenceMEIFactors {
  DEPLOYED_AUTONOMY: number
  DOWNSTREAM_IMPACT: number
  TOKEN_VOLUME: number
  INTEGRATION_DEPTH: number
  TIME: number
}

// Actuation/Robotics MEI factors
export interface ActuationMEIFactors {
  PHYSICAL_AUTONOMY: number
  FLEET_SIZE: number
  HUMAN_OVERRIDE_GAP: number
  ENVIRONMENTAL_RISK: number
  TIME: number
}

export type MEIFactors = ReinsuranceMEIFactors | ComputeMEIFactors | IntelligenceMEIFactors | ActuationMEIFactors

export interface Debt {
  active: boolean
  days_non_conforming: number
  units_today: number
  units_total: number
}

export interface Evidence {
  id: string
  primitive: PrimitiveKey
  claim_text: string
  evidence_url: string
  tier: EvidenceTier
  language: string
  extracted_snippet: string
  date: string
}

export interface Notice {
  id: string
  date: string
  type: NoticeType
  title: string
  summary: string
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
}

export interface Actor {
  id: string
  name: string
  layer: Layer
  sector: Sector
  website: string
  headquarters_country: string
  basis: string
  primitives: Primitives
  mei_factors: MEIFactors
  mei_model: string
  scores: {
    MLI: number  // 0-100
    MEI: number  // 0-200
  }
  status: ConformanceStatus
  debt: Debt
  evidence: Evidence[]
  notices: Notice[]
  last_review_date: string
}

export interface DebtRecord {
  actor_id: string
  date: string
  MEI: number
  debt_units_today: number
  debt_units_total: number
}
