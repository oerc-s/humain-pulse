/**
 * GET /api/clearing/actors
 * List all actors with clearing state
 */

import { NextResponse } from 'next/server'
import type { ActorsResponse } from '@/lib/clearing/types'
import { getAllActorsWithExposure, ensureInitialized } from '@/lib/clearing/engine'

export async function GET() {
  ensureInitialized()

  const actors = getAllActorsWithExposure()

  const response: ActorsResponse = {
    actors,
    count: actors.length,
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(response)
}
