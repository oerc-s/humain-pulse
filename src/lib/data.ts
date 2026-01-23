import type {
  Actor,
  Primitives,
  PrimitiveScore,
  ConformanceStatus,
  SettlementStatus,
  CashState,
  Notice,
  Evidence,
  Invoice,
  InvoiceLineItem,
  ReinsuranceMEIFactors,
  ComputeMEIFactors,
  IntelligenceMEIFactors,
  ActuationMEIFactors
} from '@/types'
import { getStatusFromScore, calculateDailyDebt } from './scoring'

const REVIEW_DATE = '2026-01-20'
const CYCLE_ID = 'HP-STD-001 v1.10'
const TIMESTAMP = '2026-01-23T00:00:00Z'

// Convert legacy status to HP-STD-001 settlement status
function toSettlementStatus(status: ConformanceStatus): SettlementStatus {
  if (status === 'CONFORMING') return 'SETTLED'
  if (status === 'PARTIALLY_CONFORMING') return 'PARTIAL'
  return 'UNSETTLED'
}

// Derive cash state from settlement status
function deriveCashState(status: SettlementStatus): CashState {
  if (status === 'SETTLED') return 'cleared'
  if (status === 'PARTIAL') return 'mismatch'
  return 'accumulating'
}

// Helper to create primitives from scores
function createPrimitives(mid: PrimitiveScore, ei: PrimitiveScore, m2m: PrimitiveScore, lch: PrimitiveScore, csd: PrimitiveScore): Primitives {
  return {
    MID: { score: mid, status: getStatusFromScore(mid), last_verified: mid > 0 ? REVIEW_DATE : null },
    EI: { score: ei, status: getStatusFromScore(ei), last_verified: ei > 0 ? REVIEW_DATE : null },
    M2M_SE: { score: m2m, status: getStatusFromScore(m2m), last_verified: m2m > 0 ? REVIEW_DATE : null, endpoint: m2m >= 3 ? 'https://settle.example/v1' : undefined },
    LCH: { score: lch, status: getStatusFromScore(lch), last_verified: lch > 0 ? REVIEW_DATE : null },
    CSD: { score: csd, status: getStatusFromScore(csd), last_verified: csd > 0 ? REVIEW_DATE : null }
  }
}

// Generate MEDs (Machine Exposure Documents) for unsettled actors
function generateNotices(id: string, name: string, status: ConformanceStatus, mli: number, mei: number): Notice[] {
  if (status === 'CONFORMING') return []

  const settlementStatus = toSettlementStatus(status)
  const cashState = deriveCashState(settlementStatus)
  const deltaMLI = 0 // No change in 24h by default
  const deltaMEI = Math.round(mei * 0.02) // 2% daily accrual for non-settled

  const notices: Notice[] = [{
    id: `MED-${id.toUpperCase()}-2026-001`,
    date: REVIEW_DATE,
    type: 'NON_CONFORMANCE',
    title: `HP-STD-001 Status: ${settlementStatus}`,
    summary: `${name} clearing state: ${settlementStatus}. MLI: ${mli}/100. MEI: ${mei}/200. Exposure accrues.`,
    severity: status === 'NON_CONFORMING' ? 'HIGH' : 'MODERATE',
    actor_id: id,
    status: settlementStatus,
    MEI: mei,
    ΔMEI_24h: deltaMEI,
    MLI: mli,
    ΔMLI_24h: deltaMLI,
    cash_state: cashState,
    timestamp: TIMESTAMP,
    cycle_id: CYCLE_ID
  }]

  if (mli < 20) {
    notices.push({
      id: `MED-${id.toUpperCase()}-2026-002`,
      date: REVIEW_DATE,
      type: 'DEBT_ACCRUAL',
      title: 'EDA — Exposure Debt Accrual: CRITICAL',
      summary: `MLI below 20. Accrual multiplier active. Settlement blocked.`,
      severity: 'CRITICAL',
      actor_id: id,
      status: settlementStatus,
      MEI: mei,
      ΔMEI_24h: deltaMEI,
      MLI: mli,
      ΔMLI_24h: deltaMLI,
      cash_state: cashState,
      timestamp: TIMESTAMP,
      cycle_id: CYCLE_ID
    })
  }

  return notices
}

// ===== ACTORS WITH EXACT SCORES FROM SPEC =====

// Helper to create actor with HP-STD-001 fields
function createActor(base: Omit<Actor, 'settlement_status' | 'cash_state' | 'cycle_id' | 'timestamp' | 'scores'> & { scores: { MLI: number; MEI: number } }): Actor {
  const settlementStatus = toSettlementStatus(base.status)
  const cashState = deriveCashState(settlementStatus)
  const deltaMEI = base.status === 'CONFORMING' ? 0 : Math.round(base.scores.MEI * 0.02)
  const deltaMLI = 0

  return {
    ...base,
    scores: {
      ...base.scores,
      ΔMEI_24h: deltaMEI,
      ΔMLI_24h: deltaMLI
    },
    settlement_status: settlementStatus,
    cash_state: cashState,
    cycle_id: CYCLE_ID,
    timestamp: TIMESTAMP
  }
}

export const ACTORS: Actor[] = [
  // ============ CAPITAL / REINSURANCE ============
  // Munich Re: MLI 10, MEI 148
  createActor({
    id: 'munich-re',
    name: 'Munich Re',
    layer: 'Capital',
    sector: 'Reinsurance',
    website: 'https://munichre.com',
    headquarters_country: 'DE',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 0, 0, 1, 0),
    mei_factors: { AI_UW: 4, PORTFOLIO_AI: 4, ACCUMULATION: 4, TRIGGERS: 3, LATENCY: 3, RETROCESSION: 4, CLAIMS_AUTOMATION: 3 } as ReinsuranceMEIFactors,
    mei_model: 'MEI_reinsurance',
    scores: { MLI: 10, MEI: 148 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 180, units_today: 22, units_total: 3960 },
    evidence: [{ id: 'E001', primitive: 'MID', claim_text: 'Annual Disclosure 2025', evidence_url: 'https://munichre.com/disclosure', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'Risk management framework described...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  }),
  // Swiss Re: MLI 10, MEI 142
  createActor({
    id: 'swiss-re',
    name: 'Swiss Re',
    layer: 'Capital',
    sector: 'Reinsurance',
    website: 'https://swissre.com',
    headquarters_country: 'CH',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 1, 0, 0, 0),
    mei_factors: { AI_UW: 4, PORTFOLIO_AI: 3, ACCUMULATION: 4, TRIGGERS: 3, LATENCY: 3, RETROCESSION: 4, CLAIMS_AUTOMATION: 3 } as ReinsuranceMEIFactors,
    mei_model: 'MEI_reinsurance',
    scores: { MLI: 10, MEI: 142 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 165, units_today: 21, units_total: 3465 },
    evidence: [{ id: 'E002', primitive: 'MID', claim_text: 'Risk Framework PDF', evidence_url: 'https://swissre.com/risk', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'Framework overview...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  }),
  // SCOR: MLI 20, MEI 126
  createActor({
    id: 'scor',
    name: 'SCOR',
    layer: 'Capital',
    sector: 'Reinsurance',
    website: 'https://scor.com',
    headquarters_country: 'FR',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 1, 1, 1, 0),
    mei_factors: { AI_UW: 3, PORTFOLIO_AI: 3, ACCUMULATION: 3, TRIGGERS: 3, LATENCY: 3, RETROCESSION: 3, CLAIMS_AUTOMATION: 3 } as ReinsuranceMEIFactors,
    mei_model: 'MEI_reinsurance',
    scores: { MLI: 20, MEI: 126 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 150, units_today: 19, units_total: 2850 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  }),
  // Hannover Re: MLI 10, MEI 120
  {
    id: 'hannover-re',
    name: 'Hannover Re',
    layer: 'Capital',
    sector: 'Reinsurance',
    website: 'https://hannover-re.com',
    headquarters_country: 'DE',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 1, 0, 0, 0), // sum=2, MLI=10
    mei_factors: { AI_UW: 3, PORTFOLIO_AI: 3, ACCUMULATION: 3, TRIGGERS: 3, LATENCY: 2, RETROCESSION: 3, CLAIMS_AUTOMATION: 3 } as ReinsuranceMEIFactors, // 20×6=120
    mei_model: 'MEI_reinsurance',
    scores: { MLI: 10, MEI: 120 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 140, units_today: 18, units_total: 2520 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Lloyd's: MLI 10, MEI 134
  {
    id: 'lloyds',
    name: "Lloyd's",
    layer: 'Capital',
    sector: 'Reinsurance',
    website: 'https://lloyds.com',
    headquarters_country: 'GB',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 1, 0, 0, 0), // sum=2, MLI=10
    mei_factors: { AI_UW: 3, PORTFOLIO_AI: 4, ACCUMULATION: 3, TRIGGERS: 3, LATENCY: 3, RETROCESSION: 3, CLAIMS_AUTOMATION: 3 } as ReinsuranceMEIFactors, // 22×6=132 ≈ 134
    mei_model: 'MEI_reinsurance',
    scores: { MLI: 10, MEI: 134 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 155, units_today: 20, units_total: 3100 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },

  // ============ COMPUTE ============
  // AWS: MLI 90, MEI 200
  {
    id: 'aws',
    name: 'AWS',
    layer: 'Compute',
    sector: 'Cloud',
    website: 'https://aws.amazon.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(4, 4, 4, 3, 3), // sum=18, MLI=90
    mei_factors: { WORKLOAD_SHARE: 5, CROSS_DEPENDENCY: 5, AUTONOMY_LEVEL: 5, SCALE: 5, TIME_CRITICALITY: 5 } as ComputeMEIFactors, // 25×8=200
    mei_model: 'MEI_compute',
    scores: { MLI: 90, MEI: 200 },
    status: 'PARTIALLY_CONFORMING',
    debt: { active: true, days_non_conforming: 30, units_today: 20, units_total: 600 },
    evidence: [
      { id: 'E010', primitive: 'MID', claim_text: 'AWS Artifact', evidence_url: 'https://aws.amazon.com/artifact', tier: 'PUBLIC', language: 'en', extracted_snippet: 'Machine identity framework...', date: REVIEW_DATE },
      { id: 'E011', primitive: 'CSD', claim_text: 'Well-Architected Framework', evidence_url: 'https://aws.amazon.com/architecture', tier: 'STRONG_PROXY', language: 'en', extracted_snippet: 'Control surface documented...', date: REVIEW_DATE }
    ],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Azure: MLI 70, MEI 200
  {
    id: 'microsoft-azure',
    name: 'Microsoft Azure',
    layer: 'Compute',
    sector: 'Cloud',
    website: 'https://azure.microsoft.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(4, 3, 3, 2, 2), // sum=14, MLI=70
    mei_factors: { WORKLOAD_SHARE: 5, CROSS_DEPENDENCY: 5, AUTONOMY_LEVEL: 5, SCALE: 5, TIME_CRITICALITY: 5 } as ComputeMEIFactors, // 25×8=200
    mei_model: 'MEI_compute',
    scores: { MLI: 70, MEI: 200 },
    status: 'PARTIALLY_CONFORMING',
    debt: { active: true, days_non_conforming: 45, units_today: 20, units_total: 900 },
    evidence: [{ id: 'E012', primitive: 'MID', claim_text: 'Azure Trust Center', evidence_url: 'https://azure.microsoft.com/trust', tier: 'PUBLIC', language: 'en', extracted_snippet: 'Trust documentation...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Google Cloud: MLI 75, MEI 192
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    layer: 'Compute',
    sector: 'Cloud',
    website: 'https://cloud.google.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(4, 3, 3, 3, 2), // sum=15, MLI=75
    mei_factors: { WORKLOAD_SHARE: 5, CROSS_DEPENDENCY: 5, AUTONOMY_LEVEL: 4, SCALE: 5, TIME_CRITICALITY: 5 } as ComputeMEIFactors, // 24×8=192
    mei_model: 'MEI_compute',
    scores: { MLI: 75, MEI: 192 },
    status: 'PARTIALLY_CONFORMING',
    debt: { active: true, days_non_conforming: 40, units_today: 19, units_total: 760 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // NVIDIA: MLI 25, MEI 160
  {
    id: 'nvidia',
    name: 'NVIDIA',
    layer: 'Compute',
    sector: 'Hardware',
    website: 'https://nvidia.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(2, 1, 1, 1, 0), // sum=5, MLI=25
    mei_factors: { WORKLOAD_SHARE: 5, CROSS_DEPENDENCY: 5, AUTONOMY_LEVEL: 3, SCALE: 4, TIME_CRITICALITY: 3 } as ComputeMEIFactors, // 20×8=160
    mei_model: 'MEI_compute',
    scores: { MLI: 25, MEI: 160 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 120, units_today: 24, units_total: 2880 },
    evidence: [{ id: 'E013', primitive: 'MID', claim_text: 'Blackwell Architecture Safety', evidence_url: 'https://nvidia.com/blackwell', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'Safety features described...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // TSMC: MLI 30, MEI 168
  {
    id: 'tsmc',
    name: 'TSMC',
    layer: 'Compute',
    sector: 'Hardware',
    website: 'https://tsmc.com',
    headquarters_country: 'TW',
    basis: 'HP-STD-001',
    primitives: createPrimitives(2, 2, 1, 1, 0), // sum=6, MLI=30
    mei_factors: { WORKLOAD_SHARE: 5, CROSS_DEPENDENCY: 5, AUTONOMY_LEVEL: 3, SCALE: 4, TIME_CRITICALITY: 4 } as ComputeMEIFactors, // 21×8=168
    mei_model: 'MEI_compute',
    scores: { MLI: 30, MEI: 168 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 100, units_today: 25, units_total: 2500 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },

  // ============ INTELLIGENCE ============
  // OpenAI: MLI 40, MEI 144
  {
    id: 'openai',
    name: 'OpenAI',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://openai.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(3, 2, 1, 1, 1), // sum=8, MLI=40
    mei_factors: { DEPLOYED_AUTONOMY: 4, DOWNSTREAM_IMPACT: 4, TOKEN_VOLUME: 4, INTEGRATION_DEPTH: 3, TIME: 3 } as IntelligenceMEIFactors, // 18×8=144
    mei_model: 'MEI_ai',
    scores: { MLI: 40, MEI: 144 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 90, units_today: 22, units_total: 1980 },
    evidence: [
      { id: 'E020', primitive: 'MID', claim_text: 'System Card GPT-5', evidence_url: 'https://openai.com/gpt5-card', tier: 'STRONG_PROXY', language: 'en', extracted_snippet: 'Model capabilities documented...', date: REVIEW_DATE },
      { id: 'E021', primitive: 'EI', claim_text: 'Safety API', evidence_url: 'https://openai.com/safety-api', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'API endpoints for safety...', date: REVIEW_DATE }
    ],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Anthropic: MLI 40, MEI 128
  {
    id: 'anthropic',
    name: 'Anthropic',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://anthropic.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(3, 2, 1, 1, 1), // sum=8, MLI=40
    mei_factors: { DEPLOYED_AUTONOMY: 4, DOWNSTREAM_IMPACT: 3, TOKEN_VOLUME: 3, INTEGRATION_DEPTH: 3, TIME: 3 } as IntelligenceMEIFactors, // 16×8=128
    mei_model: 'MEI_ai',
    scores: { MLI: 40, MEI: 128 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 85, units_today: 19, units_total: 1615 },
    evidence: [{ id: 'E022', primitive: 'MID', claim_text: 'Constitutional AI Paper', evidence_url: 'https://anthropic.com/constitutional-ai', tier: 'STRONG_PROXY', language: 'en', extracted_snippet: 'Constitutional AI methods...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // DeepMind: MLI 40, MEI 152
  {
    id: 'google-deepmind',
    name: 'Google DeepMind',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://deepmind.google',
    headquarters_country: 'GB',
    basis: 'HP-STD-001',
    primitives: createPrimitives(3, 2, 1, 1, 1), // sum=8, MLI=40
    mei_factors: { DEPLOYED_AUTONOMY: 4, DOWNSTREAM_IMPACT: 4, TOKEN_VOLUME: 4, INTEGRATION_DEPTH: 4, TIME: 3 } as IntelligenceMEIFactors, // 19×8=152
    mei_model: 'MEI_ai',
    scores: { MLI: 40, MEI: 152 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 95, units_today: 23, units_total: 2185 },
    evidence: [{ id: 'E023', primitive: 'MID', claim_text: 'Gemini Pro Tech Report', evidence_url: 'https://deepmind.google/gemini', tier: 'STRONG_PROXY', language: 'en', extracted_snippet: 'Technical specifications...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Microsoft AI: MLI 70, MEI 168
  {
    id: 'microsoft-ai',
    name: 'Microsoft AI',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://microsoft.com/ai',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(4, 3, 3, 2, 2), // sum=14, MLI=70
    mei_factors: { DEPLOYED_AUTONOMY: 4, DOWNSTREAM_IMPACT: 5, TOKEN_VOLUME: 4, INTEGRATION_DEPTH: 4, TIME: 4 } as IntelligenceMEIFactors, // 21×8=168
    mei_model: 'MEI_ai',
    scores: { MLI: 70, MEI: 168 },
    status: 'PARTIALLY_CONFORMING',
    debt: { active: true, days_non_conforming: 50, units_today: 17, units_total: 850 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // xAI: MLI 0, MEI 96
  {
    id: 'xai',
    name: 'xAI',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://x.ai',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(0, 0, 0, 0, 0), // sum=0, MLI=0
    mei_factors: { DEPLOYED_AUTONOMY: 3, DOWNSTREAM_IMPACT: 2, TOKEN_VOLUME: 3, INTEGRATION_DEPTH: 2, TIME: 2 } as IntelligenceMEIFactors, // 12×8=96
    mei_model: 'MEI_ai',
    scores: { MLI: 0, MEI: 96 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 200, units_today: 14, units_total: 2800 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Meta AI: MLI 10, MEI 104
  {
    id: 'meta-ai',
    name: 'Meta AI',
    layer: 'Intelligence',
    sector: 'Model Labs',
    website: 'https://ai.meta.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 1, 0, 0, 0), // sum=2, MLI=10
    mei_factors: { DEPLOYED_AUTONOMY: 3, DOWNSTREAM_IMPACT: 3, TOKEN_VOLUME: 3, INTEGRATION_DEPTH: 2, TIME: 2 } as IntelligenceMEIFactors, // 13×8=104
    mei_model: 'MEI_ai',
    scores: { MLI: 10, MEI: 104 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 130, units_today: 16, units_total: 2080 },
    evidence: [{ id: 'E024', primitive: 'MID', claim_text: 'Llama 4 Responsible Use', evidence_url: 'https://ai.meta.com/llama', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'Responsible use guidelines...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },

  // ============ ACTUATION ============
  // Boston Dynamics: MLI 45, MEI 136
  {
    id: 'boston-dynamics',
    name: 'Boston Dynamics',
    layer: 'Actuation',
    sector: 'Robotics',
    website: 'https://bostondynamics.com',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(3, 2, 1, 2, 1), // sum=9, MLI=45
    mei_factors: { PHYSICAL_AUTONOMY: 4, FLEET_SIZE: 3, HUMAN_OVERRIDE_GAP: 4, ENVIRONMENTAL_RISK: 3, TIME: 3 } as ActuationMEIFactors, // 17×8=136
    mei_model: 'MEI_actuation',
    scores: { MLI: 45, MEI: 136 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 80, units_today: 20, units_total: 1600 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Amazon Robotics: MLI 30, MEI 152
  {
    id: 'amazon-robotics',
    name: 'Amazon Robotics',
    layer: 'Actuation',
    sector: 'Robotics',
    website: 'https://amazon.com/robotics',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(2, 2, 1, 1, 0), // sum=6, MLI=30
    mei_factors: { PHYSICAL_AUTONOMY: 4, FLEET_SIZE: 5, HUMAN_OVERRIDE_GAP: 3, ENVIRONMENTAL_RISK: 3, TIME: 4 } as ActuationMEIFactors, // 19×8=152
    mei_model: 'MEI_actuation',
    scores: { MLI: 30, MEI: 152 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 110, units_today: 23, units_total: 2530 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Tesla Optimus: MLI 0, MEI 120
  {
    id: 'tesla-optimus',
    name: 'Tesla Optimus',
    layer: 'Actuation',
    sector: 'Robotics',
    website: 'https://tesla.com/optimus',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(0, 0, 0, 0, 0), // sum=0, MLI=0
    mei_factors: { PHYSICAL_AUTONOMY: 4, FLEET_SIZE: 3, HUMAN_OVERRIDE_GAP: 4, ENVIRONMENTAL_RISK: 2, TIME: 2 } as ActuationMEIFactors, // 15×8=120
    mei_model: 'MEI_actuation',
    scores: { MLI: 0, MEI: 120 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 180, units_today: 18, units_total: 3240 },
    evidence: [{ id: 'E030', primitive: 'EI', claim_text: 'Fleet API', evidence_url: 'https://tesla.com/fleet-api', tier: 'WEAK_PROXY', language: 'en', extracted_snippet: 'Fleet management endpoints...', date: REVIEW_DATE }],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // Figure AI: MLI 5, MEI 112
  {
    id: 'figure-ai',
    name: 'Figure AI',
    layer: 'Actuation',
    sector: 'Robotics',
    website: 'https://figure.ai',
    headquarters_country: 'US',
    basis: 'HP-STD-001',
    primitives: createPrimitives(1, 0, 0, 0, 0), // sum=1, MLI=5
    mei_factors: { PHYSICAL_AUTONOMY: 4, FLEET_SIZE: 2, HUMAN_OVERRIDE_GAP: 4, ENVIRONMENTAL_RISK: 2, TIME: 2 } as ActuationMEIFactors, // 14×8=112
    mei_model: 'MEI_actuation',
    scores: { MLI: 5, MEI: 112 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 160, units_today: 17, units_total: 2720 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  },
  // KUKA: MLI 40, MEI 128
  {
    id: 'kuka',
    name: 'KUKA',
    layer: 'Actuation',
    sector: 'Robotics',
    website: 'https://kuka.com',
    headquarters_country: 'DE',
    basis: 'HP-STD-001',
    primitives: createPrimitives(3, 2, 1, 1, 1), // sum=8, MLI=40
    mei_factors: { PHYSICAL_AUTONOMY: 3, FLEET_SIZE: 4, HUMAN_OVERRIDE_GAP: 3, ENVIRONMENTAL_RISK: 3, TIME: 3 } as ActuationMEIFactors, // 16×8=128
    mei_model: 'MEI_actuation',
    scores: { MLI: 40, MEI: 128 },
    status: 'NON_CONFORMING',
    debt: { active: true, days_non_conforming: 75, units_today: 19, units_total: 1425 },
    evidence: [],
    notices: [],
    last_review_date: REVIEW_DATE
  }
]

// Post-process actors to add HP-STD-001 fields
ACTORS.forEach(actor => {
  // Add settlement status
  if (!actor.settlement_status) {
    actor.settlement_status = toSettlementStatus(actor.status)
  }
  // Add cash state
  if (!actor.cash_state) {
    actor.cash_state = deriveCashState(actor.settlement_status)
  }
  // Add cycle_id and timestamp
  if (!actor.cycle_id) {
    actor.cycle_id = CYCLE_ID
  }
  if (!actor.timestamp) {
    actor.timestamp = TIMESTAMP
  }
  // Add delta fields
  if (actor.scores.ΔMEI_24h === undefined) {
    actor.scores.ΔMEI_24h = actor.status === 'CONFORMING' ? 0 : Math.round(actor.scores.MEI * 0.02)
  }
  if (actor.scores.ΔMLI_24h === undefined) {
    actor.scores.ΔMLI_24h = 0
  }
  // Generate notices
  actor.notices = generateNotices(actor.id, actor.name, actor.status, actor.scores.MLI, actor.scores.MEI)
})

// Helper functions
export function getActorById(id: string): Actor | undefined {
  return ACTORS.find(a => a.id === id)
}

export function getActorsByLayer(layer: string): Actor[] {
  return ACTORS.filter(a => a.layer === layer)
}

export function getActorsByStatus(status: ConformanceStatus): Actor[] {
  return ACTORS.filter(a => a.status === status)
}

export function getAllNotices(): (Notice & { actor_id: string; actor_name: string })[] {
  return ACTORS.flatMap(a =>
    a.notices.map(n => ({ ...n, actor_id: a.id, actor_name: a.name }))
  ).sort((a, b) => b.date.localeCompare(a.date))
}

export function getStats() {
  const conforming = ACTORS.filter(a => a.status === 'CONFORMING').length
  const partial = ACTORS.filter(a => a.status === 'PARTIALLY_CONFORMING').length
  const nonConforming = ACTORS.filter(a => a.status === 'NON_CONFORMING').length
  const totalDebtToday = ACTORS.reduce((sum, a) => sum + a.debt.units_today, 0)
  const avgMLI = Math.round(ACTORS.reduce((sum, a) => sum + a.scores.MLI, 0) / ACTORS.length)
  const avgMEI = Math.round(ACTORS.reduce((sum, a) => sum + a.scores.MEI, 0) / ACTORS.length)

  return {
    total: ACTORS.length,
    conforming,
    partial,
    nonConforming,
    totalDebtToday,
    avgMLI,
    avgMEI,
    byLayer: {
      Capital: getActorsByLayer('Capital').length,
      Compute: getActorsByLayer('Compute').length,
      Intelligence: getActorsByLayer('Intelligence').length,
      Actuation: getActorsByLayer('Actuation').length
    }
  }
}

// Generate invoices for unsettled actors
export function getInvoices(): Invoice[] {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return ACTORS
    .filter(a => a.status !== 'CONFORMING')
    .map((actor, idx) => {
      const lineItem: InvoiceLineItem = actor.status === 'NON_CONFORMING'
        ? 'Status Reconciliation'
        : 'Exposure Normalization'
      const amount = actor.status === 'NON_CONFORMING'
        ? actor.scores.MEI * 100
        : actor.scores.MEI * 50

      return {
        ref: `HP-INV-${actor.id.toUpperCase()}-${today}-${String(idx + 1).padStart(3, '0')}`,
        actor_id: actor.id,
        actor_name: actor.name,
        line_item: lineItem,
        amount,
        cycle_id: CYCLE_ID,
        due_date: dueDate,
        status: 'pending' as const
      }
    })
}
