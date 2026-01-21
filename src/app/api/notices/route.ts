import { NextResponse } from 'next/server'
import { getAllNotices, ACTORS } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const actorId = searchParams.get('actor')

  if (actorId) {
    const actor = ACTORS.find(a => a.id === actorId)
    if (!actor) {
      return NextResponse.json(
        { error: 'Actor not found', actor_id: actorId },
        { status: 404 }
      )
    }
    return NextResponse.json({
      actor_id: actor.id,
      notices: actor.notices,
      total: actor.notices.length
    })
  }

  const notices = getAllNotices()
  return NextResponse.json({
    notices,
    total: notices.length
  })
}
