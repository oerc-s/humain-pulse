/**
 * GET /api/clearing/events
 * Clearing events ledger
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { EventsResponse } from '@/lib/clearing/types'
import { getEvents, getActorEvents } from '@/lib/clearing/state'
import { ensureInitialized } from '@/lib/clearing/engine'

export async function GET(request: NextRequest) {
  ensureInitialized()

  const searchParams = request.nextUrl.searchParams
  const actorId = searchParams.get('actor_id')
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam, 10) : undefined

  const events = actorId
    ? getActorEvents(actorId, limit)
    : getEvents(limit)

  const response: EventsResponse = {
    events,
    count: events.length,
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(response)
}
