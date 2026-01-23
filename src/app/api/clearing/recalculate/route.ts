/**
 * POST /api/clearing/recalculate
 * CRON trigger for hourly recalculation
 */

import { NextResponse } from 'next/server'
import { recalculateAll, ensureInitialized } from '@/lib/clearing/engine'

export async function POST() {
  ensureInitialized()

  const result = recalculateAll()

  return NextResponse.json(result)
}

// Also allow GET for manual testing
export async function GET() {
  ensureInitialized()

  const result = recalculateAll()

  return NextResponse.json(result)
}
