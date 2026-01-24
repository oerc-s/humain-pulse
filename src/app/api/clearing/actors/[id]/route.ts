/**
 * GET /api/clearing/actors/[id]
 * Get single actor with clearing state
 */

import { NextResponse } from 'next/server'
import { getActorWithExposure, ensureInitialized } from '@/lib/clearing/engine'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Props) {
  ensureInitialized()

  const { id } = await params
  const actorData = getActorWithExposure(id)

  if (!actorData) {
    return NextResponse.json(
      { error: 'Actor not found', actor_id: id },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ...actorData,
    timestamp: new Date().toISOString()
  })
}
