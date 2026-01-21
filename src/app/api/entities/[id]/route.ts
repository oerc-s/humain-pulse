import { NextResponse } from 'next/server'
import { getActorById } from '@/lib/data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    return NextResponse.json(
      { error: 'Actor not found', id },
      { status: 404 }
    )
  }

  return NextResponse.json(actor)
}
