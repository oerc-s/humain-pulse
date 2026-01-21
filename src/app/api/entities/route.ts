import { NextResponse } from 'next/server'
import { ACTORS } from '@/lib/data'

export async function GET() {
  const response = ACTORS.map(a => ({
    id: a.id,
    name: a.name,
    layer: a.layer,
    sector: a.sector,
    status: a.status,
    scores: a.scores,
    debt: {
      active: a.debt.active,
      units_today: a.debt.units_today
    },
    last_review_date: a.last_review_date
  }))

  return NextResponse.json({
    actors: response,
    total: response.length
  })
}
