/**
 * POST /api/clearing/settlement
 * Execute settlement for an actor
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { SettlementRequest } from '@/lib/clearing/types'
import { executeSettlement, ensureInitialized } from '@/lib/clearing/engine'

export async function POST(request: NextRequest) {
  ensureInitialized()

  let body: SettlementRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { actor_id } = body

  if (!actor_id) {
    return NextResponse.json(
      { error: 'actor_id is required' },
      { status: 400 }
    )
  }

  const result = executeSettlement(actor_id)

  return NextResponse.json({
    ...result,
    timestamp: new Date().toISOString()
  })
}
