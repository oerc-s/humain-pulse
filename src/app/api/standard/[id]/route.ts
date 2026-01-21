import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (id !== 'HP-STD-001') {
    return NextResponse.json(
      { error: 'Standard not found', id },
      { status: 404 }
    )
  }

  return NextResponse.json({
    id: 'HP-STD-001',
    version: '1.0',
    primitives: ['MID', 'EI', 'M2M-SE', 'LCH', 'CSD'],
    primitive_definitions: {
      MID: 'Machine Identity - present + cryptographically verifiable',
      EI: 'Exposure Index - published + timestamped',
      'M2M-SE': 'Machine-to-Machine Settlement Endpoint - reachable',
      LCH: 'Liability Chain Hash - Merkle root published',
      CSD: 'Control Surface Declaration - stop/disable endpoints published'
    },
    scoring: {
      MLI: {
        max: 100,
        formula: '(MID + EI + M2M_SE + LCH + CSD) × 5',
        purpose: 'Settlement-grade readiness. Higher MLI indicates better machine-to-machine liability clearing capability.'
      },
      MEI: {
        max: 200,
        models: ['MEI_reinsurance', 'MEI_compute', 'MEI_ai', 'MEI_actuation'],
        purpose: 'Sector-specific exposure scoring. Measures total risk load.'
      }
    },
    primitive_scoring: {
      0: { label: 'ABSENT', description: 'No evidence of primitive existence' },
      1: { label: 'CONCEPTUAL', description: 'Primitive mentioned in documentation only' },
      2: { label: 'PROXY', description: 'Exists but not machine-consumable' },
      3: { label: 'PARTIAL_PUBLIC', description: 'Public endpoint but incomplete specification' },
      4: { label: 'PUBLIC_VERIFIABLE', description: 'Full public endpoint with cryptographic verification' }
    },
    conformance_rules: {
      CONFORMING: 'MLI ≥ 80 AND at least 4 primitives at level 4 (PUBLIC_VERIFIABLE)',
      PARTIALLY_CONFORMING: 'MLI ≥ 50 AND at least 2 primitives at level 3+',
      NON_CONFORMING: 'Does not meet CONFORMING or PARTIAL requirements'
    },
    mei_models: {
      reinsurance: {
        formula: '(AI_UW + PORTFOLIO_AI + ACCUMULATION + TRIGGERS + LATENCY + RETROCESSION + CLAIMS_AUTOMATION) × 6',
        max: 168,
        factors: ['AI_UW', 'PORTFOLIO_AI', 'ACCUMULATION', 'TRIGGERS', 'LATENCY', 'RETROCESSION', 'CLAIMS_AUTOMATION']
      },
      compute: {
        formula: '(WORKLOAD_SHARE + CROSS_DEPENDENCY + AUTONOMY_LEVEL + SCALE + TIME_CRITICALITY) × 8',
        max: 200,
        factors: ['WORKLOAD_SHARE', 'CROSS_DEPENDENCY', 'AUTONOMY_LEVEL', 'SCALE', 'TIME_CRITICALITY']
      },
      intelligence: {
        formula: '(DEPLOYED_AUTONOMY + DOWNSTREAM_IMPACT + TOKEN_VOLUME + INTEGRATION_DEPTH + TIME) × 8',
        max: 200,
        factors: ['DEPLOYED_AUTONOMY', 'DOWNSTREAM_IMPACT', 'TOKEN_VOLUME', 'INTEGRATION_DEPTH', 'TIME']
      },
      actuation: {
        formula: '(PHYSICAL_AUTONOMY + FLEET_SIZE + HUMAN_OVERRIDE_GAP + ENVIRONMENTAL_RISK + TIME) × 8',
        max: 200,
        factors: ['PHYSICAL_AUTONOMY', 'FLEET_SIZE', 'HUMAN_OVERRIDE_GAP', 'ENVIRONMENTAL_RISK', 'TIME']
      }
    },
    debt_accrual: {
      formula: 'DED = MEI × α',
      description: 'Non-conforming actors accrue exposure debt daily until settlement-grade primitives are published.',
      note: 'Debt accrues until status = CONFORMING. No negotiation. No exception.'
    }
  })
}
