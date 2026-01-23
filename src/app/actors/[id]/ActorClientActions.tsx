'use client'

import type { Actor } from '@/types'

interface Props {
  actor: Actor
}

export function ActorClientActions({ actor }: Props) {
  const handleDownload = () => {
    const data = JSON.stringify(actor, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${actor.id}-clearing-state.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-white text-black py-3 text-[10px] font-mono uppercase tracking-widest hover:bg-zinc-200 transition-colors font-bold"
    >
      Download JSON
    </button>
  )
}
