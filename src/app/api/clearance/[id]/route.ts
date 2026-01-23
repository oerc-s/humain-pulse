import { NextResponse } from 'next/server'
import { getActorById } from '@/lib/data'
import { getActorBySlug } from '@/lib/reinsurance-data'
import { checkClearance, CHOKE_POINTS } from '@/lib/choke-points'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Try entities first
  const actor = getActorById(id)
  if (actor) {
    const result = checkClearance(actor.id, actor.layer, actor.primitives)
    return NextResponse.json({
      ...result,
      actor_name: actor.name,
      mli: actor.scores.MLI,
      mei: actor.scores.MEI,
      timestamp: new Date().toISOString()
    })
  }

  // Try reinsurance actors
  const reinsurer = getActorBySlug(id)
  if (reinsurer) {
    const result = checkClearance(reinsurer.slug, 'Capital', reinsurer.primitives)
    return NextResponse.json({
      ...result,
      actor_name: reinsurer.name,
      timestamp: new Date().toISOString()
    })
  }

  return NextResponse.json(
    {
      error: 'Actor not found',
      id,
      status: 'BLOCKED',
      reason: 'Unknown actor — cannot verify clearance'
    },
    { status: 404 }
  )
}

// Bulk clearance check
export async function POST(request: Request) {
  const body = await request.json()
  const { actor_ids } = body

  if (!Array.isArray(actor_ids)) {
    return NextResponse.json(
      { error: 'actor_ids must be an array' },
      { status: 400 }
    )
  }

  const results = actor_ids.map((id: string) => {
    const actor = getActorById(id)
    if (actor) {
      return checkClearance(actor.id, actor.layer, actor.primitives)
    }
    const reinsurer = getActorBySlug(id)
    if (reinsurer) {
      return checkClearance(reinsurer.slug, 'Capital', reinsurer.primitives)
    }
    return {
      actor_id: id,
      status: 'BLOCKED',
      reason: 'Unknown actor'
    }
  })

  return NextResponse.json({
    results,
    timestamp: new Date().toISOString(),
    blocked_count: results.filter((r: any) => r.status === 'BLOCKED').length,
    cleared_count: results.filter((r: any) => r.status === 'CLEARED').length
  })
}
