/**
 * GET /api/clearing/state
 * Engine summary stats
 */

import { NextResponse } from 'next/server'
import type { StateResponse } from '@/lib/clearing/types'
import { getEngineState } from '@/lib/clearing/state'
import { ensureInitialized } from '@/lib/clearing/engine'

export async function GET() {
  ensureInitialized()

  const state = getEngineState()

  const response: StateResponse = {
    state,
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(response)
}
