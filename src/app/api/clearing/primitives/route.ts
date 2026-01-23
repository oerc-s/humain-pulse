/**
 * POST /api/clearing/primitives
 * Update actor primitives
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { PrimitiveUpdateRequest, ClearingPrimitives } from '@/lib/clearing/types'
import { updatePrimitives, ensureInitialized } from '@/lib/clearing/engine'
import { CLEARING_NOTES } from '@/lib/clearing/language'

export async function POST(request: NextRequest) {
  ensureInitialized()

  let body: PrimitiveUpdateRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { actor_id, primitives } = body

  if (!actor_id) {
    return NextResponse.json(
      { error: 'actor_id is required' },
      { status: 400 }
    )
  }

  if (!primitives || typeof primitives !== 'object') {
    return NextResponse.json(
      { error: 'primitives object is required' },
      { status: 400 }
    )
  }

  // Validate primitive values are booleans
  const validKeys: (keyof ClearingPrimitives)[] = ['MID', 'EI', 'M2M_SE', 'LCH', 'CSD']
  for (const key of Object.keys(primitives)) {
    if (!validKeys.includes(key as keyof ClearingPrimitives)) {
      return NextResponse.json(
        { error: `Invalid primitive key: ${key}` },
        { status: 400 }
      )
    }
    if (typeof primitives[key as keyof ClearingPrimitives] !== 'boolean') {
      return NextResponse.json(
        { error: `Primitive ${key} must be a boolean` },
        { status: 400 }
      )
    }
  }

  const event = updatePrimitives(actor_id, primitives)

  if (!event) {
    return NextResponse.json(
      { error: 'Actor not found', note: CLEARING_NOTES.CLEARING_UNAVAILABLE },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    actor_id,
    event,
    timestamp: new Date().toISOString()
  })
}
