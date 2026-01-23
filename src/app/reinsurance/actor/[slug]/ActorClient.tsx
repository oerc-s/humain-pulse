'use client'

import type { ReinsuranceActor } from '@/lib/reinsurance-data'

interface ActorClientProps {
  actor: ReinsuranceActor
  scores: {
    mli: number
    mei: number
    eiAdj: number
    drift: number
  }
}

export function ActorClient({ actor, scores }: ActorClientProps) {
  const downloadJSON = () => {
    const data = {
      ...actor,
      computed_scores: scores,
      export_timestamp: new Date().toISOString(),
      standard: 'HP-STD-001 / ASI-STD-001'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${actor.slug}-hp-sl-001.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={downloadJSON}
      className="w-full p-4 border border-emerald-900 bg-emerald-950/10 text-emerald-400 font-mono text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
    >
      Download JSON Record
    </button>
  )
}
