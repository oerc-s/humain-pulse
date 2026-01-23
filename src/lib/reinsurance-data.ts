// Reinsurance Clearing Capacity Data Model
// HP-STD-001 / ASI-STD-001

export type PrimitiveState = 'PUBLISHED' | 'PARTIAL' | 'MISSING'

export type ReinsuranceStatus =
  | 'CONFORMING'
  | 'PARTIAL'
  | 'UNSETTLED'
  | 'HUMAN-GATED'
  | 'NON-CLEARABLE'

export interface Evidence {
  type: 'spec' | 'endpoint' | 'contract' | 'doc' | 'proxy'
  url: string
  label: string
  lang?: 'EN' | 'DE' | 'FR'
}

export interface Primitive {
  state: PrimitiveState
  evidence: Evidence[]
  last_seen: string | null
}

export interface MEIFactors {
  CAP: number  // 0-5: capital weight / systemic importance
  PORT: number // 0-5: portfolio breadth across cyber/AI/emerging risk
  SPEED: number // 0-5: ability to update exposure frequently
  DEP: number  // 0-5: dependency of cedents/brokers on them
  GATE: number // 0-5: degree of human gating in underwriting/claims
}

export interface Notice {
  id: string
  date: string
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE'
  status_impact: string
  trigger: string
  statement: string
}

export interface ReinsuranceActor {
  slug: string
  name: string
  layer: 'Capital / Reinsurance'
  status: ReinsuranceStatus
  website: string
  headquarters: string
  primitives: {
    MID: Primitive
    EI: Primitive
    'M2M-SE': Primitive
    LCH: Primitive
    CSD: Primitive
  }
  factors: MEIFactors
  notices: Notice[]
}

export interface ReinsuranceData {
  last_publish: string
  actors: ReinsuranceActor[]
}

// Primitive blocking explanations for reinsurance
export const PRIMITIVE_BLOCKS: Record<string, string> = {
  MID: 'Cannot underwrite machine as primary risk unit',
  EI: 'Cannot price dynamic exposure in real-time',
  'M2M-SE': 'Cannot settle autonomously without human approval',
  LCH: 'Cannot attribute causality without dispute risk',
  CSD: 'Cannot enforce machine-executable constraints on coverage'
}

// Status definitions
export const STATUS_DEFINITIONS: Record<ReinsuranceStatus, string> = {
  'CONFORMING': 'All HP-STD-001 primitives are publicly declared, verifiable, and continuously updated.',
  'PARTIAL': 'Some primitives exist as proxies but are not public, verifiable, or machine-consumable.',
  'UNSETTLED': 'Machine-risk settlement is not autonomous; exposure remains open.',
  'HUMAN-GATED': 'Underwriting/settlement requires manual committee actions; no machine-to-machine execution.',
  'NON-CLEARABLE': 'No public settlement endpoint, no exposure feed, no liability chain proof.'
}

// Scoring functions
export function computeMLI(primitives: ReinsuranceActor['primitives']): number {
  const MID_ok = primitives.MID.state === 'PUBLISHED' ? 1 : 0
  const M2M_ok = primitives['M2M-SE'].state === 'PUBLISHED' ? 1 : 0
  const LCH_ok = primitives.LCH.state === 'PUBLISHED' ? 1 : 0
  const CSD_ok = primitives.CSD.state === 'PUBLISHED' ? 1 : 0
  return 25 * (MID_ok + M2M_ok + LCH_ok + CSD_ok)
}

export function computeMEI(factors: MEIFactors): number {
  const { CAP, PORT, SPEED, DEP, GATE } = factors
  return 8 * (CAP + PORT + SPEED + DEP + GATE)
}

export function computeEIAdj(mli: number, mei: number): number {
  const raw = mei + (100 - mli) / 2
  return Math.min(Math.max(Math.round(raw), 0), 250)
}

export function computeDrift(mli: number, mei: number): number {
  return Math.round(5 + 0.15 * mei + 0.20 * (100 - mli))
}

export function getActorScores(actor: ReinsuranceActor) {
  const mli = computeMLI(actor.primitives)
  const mei = computeMEI(actor.factors)
  const eiAdj = computeEIAdj(mli, mei)
  const drift = computeDrift(mli, mei)
  return { mli, mei, eiAdj, drift }
}

// Generate observed gating based on missing primitives
export function getObservedGating(primitives: ReinsuranceActor['primitives']): string[] {
  const gating: string[] = []

  if (primitives.MID.state !== 'PUBLISHED') {
    gating.push('Machine identity not verifiable for underwriting')
  }
  if (primitives.EI.state !== 'PUBLISHED') {
    gating.push('No public exposure feed for dynamic pricing')
  }
  if (primitives['M2M-SE'].state !== 'PUBLISHED') {
    gating.push('No autonomous settlement trigger')
  }
  if (primitives.LCH.state !== 'PUBLISHED') {
    gating.push('Manual claims validation required for attribution')
  }
  if (primitives.CSD.state !== 'PUBLISHED') {
    gating.push('Human committee required for coverage changes')
  }

  return gating
}

// Determine status based on primitives
export function determineStatus(primitives: ReinsuranceActor['primitives']): ReinsuranceStatus {
  const states = [
    primitives.MID.state,
    primitives.EI.state,
    primitives['M2M-SE'].state,
    primitives.LCH.state,
    primitives.CSD.state
  ]

  const published = states.filter(s => s === 'PUBLISHED').length
  const partial = states.filter(s => s === 'PARTIAL').length
  const missing = states.filter(s => s === 'MISSING').length

  if (published === 5) return 'CONFORMING'
  if (published >= 3 && missing === 0) return 'PARTIAL'
  if (partial >= 3 && published === 0) return 'HUMAN-GATED'
  if (missing >= 4) return 'NON-CLEARABLE'
  return 'UNSETTLED'
}

// Static data
const LAST_PUBLISH = '2026-01-22'

export const REINSURANCE_ACTORS: ReinsuranceActor[] = [
  {
    slug: 'munich-re',
    name: 'Munich Re',
    layer: 'Capital / Reinsurance',
    status: 'NON-CLEARABLE',
    website: 'https://www.munichre.com',
    headquarters: 'Germany',
    primitives: {
      MID: { state: 'MISSING', evidence: [], last_seen: null },
      EI: { state: 'MISSING', evidence: [], last_seen: null },
      'M2M-SE': { state: 'MISSING', evidence: [], last_seen: null },
      LCH: { state: 'MISSING', evidence: [], last_seen: null },
      CSD: { state: 'MISSING', evidence: [], last_seen: null }
    },
    factors: { CAP: 5, PORT: 5, SPEED: 4, DEP: 5, GATE: 5 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-MUNICHRE-001',
        date: '2026-01-22',
        title: 'Non-Clearable Status Issued',
        severity: 'CRITICAL',
        status_impact: 'Classified as NON-CLEARABLE',
        trigger: 'All primitives MISSING',
        statement: 'No machine-risk settlement primitives detected. Exposure remains fully human-gated.'
      }
    ]
  },
  {
    slug: 'swiss-re',
    name: 'Swiss Re',
    layer: 'Capital / Reinsurance',
    status: 'NON-CLEARABLE',
    website: 'https://www.swissre.com',
    headquarters: 'Switzerland',
    primitives: {
      MID: { state: 'PARTIAL', evidence: [{ type: 'proxy', url: 'https://www.swissre.com/risk-knowledge/', label: 'Risk Knowledge Portal', lang: 'EN' }], last_seen: '2026-01-15' },
      EI: { state: 'MISSING', evidence: [], last_seen: null },
      'M2M-SE': { state: 'MISSING', evidence: [], last_seen: null },
      LCH: { state: 'MISSING', evidence: [], last_seen: null },
      CSD: { state: 'MISSING', evidence: [], last_seen: null }
    },
    factors: { CAP: 5, PORT: 5, SPEED: 3, DEP: 5, GATE: 5 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-SWISSRE-001',
        date: '2026-01-22',
        title: 'Non-Clearable Status Issued',
        severity: 'CRITICAL',
        status_impact: 'Classified as NON-CLEARABLE',
        trigger: 'MID partial only, all others MISSING',
        statement: 'Proxy MID detected but no settlement infrastructure. Machine-risk remains uncleared.'
      }
    ]
  },
  {
    slug: 'lloyds',
    name: "Lloyd's of London",
    layer: 'Capital / Reinsurance',
    status: 'HUMAN-GATED',
    website: 'https://www.lloyds.com',
    headquarters: 'United Kingdom',
    primitives: {
      MID: { state: 'PARTIAL', evidence: [{ type: 'doc', url: 'https://www.lloyds.com/conducting-business/market-oversight', label: 'Market Oversight Framework', lang: 'EN' }], last_seen: '2026-01-18' },
      EI: { state: 'PARTIAL', evidence: [{ type: 'proxy', url: 'https://www.lloyds.com/market-resources/regulatory-and-risk-data', label: 'Risk Data Portal', lang: 'EN' }], last_seen: '2026-01-10' },
      'M2M-SE': { state: 'PARTIAL', evidence: [{ type: 'doc', url: 'https://www.lloyds.com/conducting-business/claims', label: 'Claims Process', lang: 'EN' }], last_seen: '2026-01-12' },
      LCH: { state: 'MISSING', evidence: [], last_seen: null },
      CSD: { state: 'PARTIAL', evidence: [{ type: 'doc', url: 'https://www.lloyds.com/conducting-business/market-bulletin', label: 'Market Bulletins', lang: 'EN' }], last_seen: '2026-01-20' }
    },
    factors: { CAP: 5, PORT: 5, SPEED: 3, DEP: 5, GATE: 4 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-LLOYDS-001',
        date: '2026-01-22',
        title: 'Human-Gated Status Confirmed',
        severity: 'HIGH',
        status_impact: 'Classified as HUMAN-GATED',
        trigger: 'LCH MISSING, all others PARTIAL',
        statement: 'Syndicate structure requires committee approval. No autonomous settlement path exists.'
      }
    ]
  },
  {
    slug: 'scor',
    name: 'SCOR SE',
    layer: 'Capital / Reinsurance',
    status: 'NON-CLEARABLE',
    website: 'https://www.scor.com',
    headquarters: 'France',
    primitives: {
      MID: { state: 'MISSING', evidence: [], last_seen: null },
      EI: { state: 'MISSING', evidence: [], last_seen: null },
      'M2M-SE': { state: 'MISSING', evidence: [], last_seen: null },
      LCH: { state: 'MISSING', evidence: [], last_seen: null },
      CSD: { state: 'MISSING', evidence: [], last_seen: null }
    },
    factors: { CAP: 4, PORT: 4, SPEED: 3, DEP: 4, GATE: 5 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-SCOR-001',
        date: '2026-01-22',
        title: 'Non-Clearable Status Issued',
        severity: 'CRITICAL',
        status_impact: 'Classified as NON-CLEARABLE',
        trigger: 'All primitives MISSING',
        statement: 'No machine-risk clearing infrastructure detected.'
      }
    ]
  },
  {
    slug: 'hannover-re',
    name: 'Hannover Re',
    layer: 'Capital / Reinsurance',
    status: 'NON-CLEARABLE',
    website: 'https://www.hannover-re.com',
    headquarters: 'Germany',
    primitives: {
      MID: { state: 'PARTIAL', evidence: [{ type: 'proxy', url: 'https://www.hannover-re.com/1634808/risk-management', label: 'Risk Management Overview', lang: 'EN' }], last_seen: '2026-01-08' },
      EI: { state: 'MISSING', evidence: [], last_seen: null },
      'M2M-SE': { state: 'MISSING', evidence: [], last_seen: null },
      LCH: { state: 'MISSING', evidence: [], last_seen: null },
      CSD: { state: 'MISSING', evidence: [], last_seen: null }
    },
    factors: { CAP: 4, PORT: 4, SPEED: 3, DEP: 4, GATE: 5 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-HANNOVER-001',
        date: '2026-01-22',
        title: 'Non-Clearable Status Issued',
        severity: 'CRITICAL',
        status_impact: 'Classified as NON-CLEARABLE',
        trigger: 'MID partial only, settlement primitives MISSING',
        statement: 'No autonomous settlement endpoints. All clearing remains human-gated.'
      }
    ]
  },
  {
    slug: 'berkshire-re',
    name: 'Berkshire Hathaway Reinsurance',
    layer: 'Capital / Reinsurance',
    status: 'HUMAN-GATED',
    website: 'https://www.bhrg.com',
    headquarters: 'United States',
    primitives: {
      MID: { state: 'PARTIAL', evidence: [{ type: 'proxy', url: 'https://www.berkshirehathaway.com/subs/bhrg.html', label: 'Corporate Structure', lang: 'EN' }], last_seen: '2026-01-05' },
      EI: { state: 'PARTIAL', evidence: [], last_seen: '2026-01-10' },
      'M2M-SE': { state: 'MISSING', evidence: [], last_seen: null },
      LCH: { state: 'PARTIAL', evidence: [], last_seen: '2026-01-12' },
      CSD: { state: 'PARTIAL', evidence: [], last_seen: '2026-01-15' }
    },
    factors: { CAP: 5, PORT: 4, SPEED: 2, DEP: 4, GATE: 5 },
    notices: [
      {
        id: 'HP-NOTICE-20260122-BERKSHIRE-001',
        date: '2026-01-22',
        title: 'Human-Gated Status Confirmed',
        severity: 'HIGH',
        status_impact: 'Classified as HUMAN-GATED',
        trigger: 'M2M-SE MISSING, others PARTIAL',
        statement: 'No autonomous settlement mechanism. All decisions require principal approval.'
      }
    ]
  }
]

// Helper functions
export function getActorBySlug(slug: string): ReinsuranceActor | undefined {
  return REINSURANCE_ACTORS.find(a => a.slug === slug)
}

export function getAllNotices(): (Notice & { actor_slug: string; actor_name: string })[] {
  return REINSURANCE_ACTORS.flatMap(actor =>
    actor.notices.map(notice => ({
      ...notice,
      actor_slug: actor.slug,
      actor_name: actor.name
    }))
  ).sort((a, b) => b.date.localeCompare(a.date))
}

export function getStats() {
  const actors = REINSURANCE_ACTORS.map(a => ({
    ...a,
    scores: getActorScores(a)
  }))

  return {
    total: actors.length,
    conforming: actors.filter(a => a.status === 'CONFORMING').length,
    partial: actors.filter(a => a.status === 'PARTIAL').length,
    unsettled: actors.filter(a => a.status === 'UNSETTLED').length,
    humanGated: actors.filter(a => a.status === 'HUMAN-GATED').length,
    nonClearable: actors.filter(a => a.status === 'NON-CLEARABLE').length,
    totalDrift: actors.reduce((sum, a) => sum + a.scores.drift, 0),
    avgMEI: Math.round(actors.reduce((sum, a) => sum + a.scores.mei, 0) / actors.length),
    avgMLI: Math.round(actors.reduce((sum, a) => sum + a.scores.mli, 0) / actors.length)
  }
}

export const LAST_PUBLISH_DATE = LAST_PUBLISH
