// Choke Points Definition per Layer
// Technical blocking mechanisms for machine-native settlement

export interface ChokePoint {
  layer: string
  blocking_primitives: string[]
  blocked_flow: string
  reason: string
  mechanical_effect: string[]
  choke_point: string
  consequence: string
}

export const CHOKE_POINTS: Record<string, ChokePoint> = {
  'Capital': {
    layer: 'Capital / Reinsurance',
    blocking_primitives: ['EI', 'M2M-SE'],
    blocked_flow: 'underwriting machine/AGI risk',
    reason: 'No continuous machine exposure declaration',
    mechanical_effect: [
      'Unable to aggregate machine risk',
      'Real-time pricing impossible',
      'Retrocession blocked'
    ],
    choke_point: 'capital allocation',
    consequence: 'Without public EI + machine settlement, risk is non-transferable'
  },
  'Intelligence': {
    layer: 'Intelligence / AI Labs',
    blocking_primitives: ['LCH', 'CSD'],
    blocked_flow: 'enterprise contracts / indemnification',
    reason: 'No machine liability chain, no declared control surface',
    mechanical_effect: [
      'Unbounded liability exposure',
      'Runtime legally opaque',
      'Indemnification clauses unenforceable'
    ],
    choke_point: 'enterprise liability acceptance',
    consequence: 'Without LCH + CSD, runtime is legally opaque'
  },
  'Compute': {
    layer: 'Compute / Cloud',
    blocking_primitives: ['M2M-SE'],
    blocked_flow: 'regulated workloads / high-risk AI',
    reason: 'Billing ≠ settlement — no machine-native clearing',
    mechanical_effect: [
      'No machine-native clearing path',
      'Downstream liability stuck',
      'Compliance gap for regulated workloads'
    ],
    choke_point: 'downstream liability transfer',
    consequence: 'Compute operational, liability not clearable'
  },
  'Actuation': {
    layer: 'Actuation / Robotics',
    blocking_primitives: ['MID', 'CSD'],
    blocked_flow: 'physical deployment at scale',
    reason: 'No machine identity, no control surface for physical override',
    mechanical_effect: [
      'Fleet liability unbounded',
      'No emergency stop verification',
      'Insurance placement blocked'
    ],
    choke_point: 'physical deployment authorization',
    consequence: 'Without MID + CSD, physical autonomy is uninsurable'
  }
}

// Clearance check function
export interface ClearanceResult {
  actor_id: string
  layer: string
  status: 'CLEARED' | 'BLOCKED'
  blocking_primitives: string[]
  choke_point: string
  can_transfer_risk: boolean
  reason: string
}

export function checkClearance(
  actorId: string,
  layer: string,
  primitives: any
): ClearanceResult {
  const chokePoint = CHOKE_POINTS[layer]

  if (!chokePoint) {
    return {
      actor_id: actorId,
      layer,
      status: 'BLOCKED',
      blocking_primitives: ['UNKNOWN'],
      choke_point: 'unknown',
      can_transfer_risk: false,
      reason: 'Layer not recognized'
    }
  }

  const missingPrimitives: string[] = []

  for (const prim of chokePoint.blocking_primitives) {
    const primKey = prim === 'M2M-SE' ? 'M2M-SE' : prim
    const primData = primitives[primKey] || primitives[prim.replace('-', '_')]

    if (!primData) {
      missingPrimitives.push(prim)
      continue
    }

    // Check state (reinsurance model)
    if ('state' in primData && primData.state !== 'PUBLISHED') {
      missingPrimitives.push(prim)
    }
    // Check score (entities model)
    else if ('score' in primData && primData.score < 4) {
      missingPrimitives.push(prim)
    }
  }

  const isBlocked = missingPrimitives.length > 0

  return {
    actor_id: actorId,
    layer,
    status: isBlocked ? 'BLOCKED' : 'CLEARED',
    blocking_primitives: missingPrimitives,
    choke_point: chokePoint.choke_point,
    can_transfer_risk: !isBlocked,
    reason: isBlocked
      ? chokePoint.consequence
      : 'All required primitives published. Risk transferable.'
  }
}

// Get all blocked actors by layer
export function getBlockedFlows(layer: string): string[] {
  const cp = CHOKE_POINTS[layer]
  return cp ? cp.mechanical_effect : []
}
