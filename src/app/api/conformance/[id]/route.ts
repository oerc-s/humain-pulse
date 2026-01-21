import { NextResponse } from 'next/server'
import { getActorById } from '@/lib/data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    return NextResponse.json(
      { error: 'Actor not found', id },
      { status: 404 }
    )
  }

  const primitives = actor.primitives
  const checks = [
    {
      primitive: 'MID',
      score: primitives.MID.score,
      passed: primitives.MID.score >= 3
    },
    {
      primitive: 'EI',
      score: primitives.EI.score,
      passed: primitives.EI.score >= 3
    },
    {
      primitive: 'M2M_SE',
      score: primitives.M2M_SE.score,
      passed: primitives.M2M_SE.score >= 3
    },
    {
      primitive: 'LCH',
      score: primitives.LCH.score,
      passed: primitives.LCH.score >= 3
    },
    {
      primitive: 'CSD',
      score: primitives.CSD.score,
      passed: primitives.CSD.score >= 3
    }
  ]

  const passCount = checks.filter(c => c.passed).length

  return NextResponse.json({
    actor_id: actor.id,
    actor_name: actor.name,
    status: actor.status,
    checks,
    pass_count: passCount,
    MLI: actor.scores.MLI,
    checked_at: new Date().toISOString()
  })
}
