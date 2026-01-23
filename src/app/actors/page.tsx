'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { Layer } from '@/types'
import type { ClearingActorWithExposure } from '@/lib/clearing/types'

type TabFilter = 'All' | Layer

export default function ActorsPage() {
  const [actors, setActors] = useState<ClearingActorWithExposure[]>([])
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/clearing/actors')
      .then(r => r.json())
      .then(data => setActors(data.actors || []))
  }, [])

  const filteredActors = useMemo(() => {
    let list = [...actors]

    if (filterLayer !== 'All') {
      list = list.filter(a => a.actor.layer === filterLayer)
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      list = list.filter(a =>
        a.actor.name.toLowerCase().includes(query) ||
        a.actor.sector.toLowerCase().includes(query)
      )
    }

    // Sort by status: UNSETTLED first, then PARTIAL, then SETTLED
    list.sort((a, b) => {
      const order = { UNSETTLED: 0, PARTIAL: 1, SETTLED: 2 }
      return order[a.actor.status] - order[b.actor.status]
    })

    return list
  }, [actors, filterLayer, searchTerm])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']
  const primitiveKeys = ['MID', 'EI', 'M2M_SE', 'LCH', 'CSD'] as const

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Entity Index</h1>
          <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest flex-wrap">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setFilterLayer(t)}
                className={`tab-item ${filterLayer === t ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="SEARCH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-zinc-800 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none uppercase placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6 text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-4">
        <span>Primitives: MID · EI · M2M-SE · LCH · CSD</span>
        <span className="text-emerald-500">● = present</span>
        <span className="text-zinc-600">○ = missing</span>
      </div>

      {/* Capital Layer - Reinsurance Link */}
      {filterLayer === 'Capital' && (
        <Link
          href="/reinsurance"
          className="block mb-6 p-4 border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest mb-1">Reinsurance Layer</div>
              <div className="text-white font-medium">6 reinsurers · Detailed settlement metrics</div>
            </div>
            <div className="text-emerald-500 group-hover:translate-x-1 transition-transform">→</div>
          </div>
        </Link>
      )}

      {/* Entity List */}
      <div className="space-y-2">
        {filteredActors.map(({ actor, exposure }) => (
          <div
            key={actor.actor_id}
            className="border border-zinc-800 p-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Name + Layer */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold truncate">{actor.name}</div>
                <div className="text-zinc-600 text-[10px] font-mono uppercase">{actor.layer} · {actor.sector}</div>
              </div>

              {/* Primitives */}
              <div className="flex gap-1 font-mono text-sm">
                {primitiveKeys.map(key => (
                  <span
                    key={key}
                    className={actor.primitives[key] ? 'text-emerald-500' : 'text-zinc-700'}
                    title={key}
                  >
                    {actor.primitives[key] ? '●' : '○'}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div className={`font-mono text-xs px-3 py-1 ${
                actor.status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                actor.status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {actor.status}
              </div>

              {/* MLI Score */}
              <div className="text-right w-16">
                <div className="text-white font-mono font-bold">{exposure.MLI}</div>
                <div className="text-zinc-600 text-[10px] font-mono">MLI</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center text-zinc-500 py-12 font-mono">
          No entities found.
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 text-[10px] text-zinc-600 font-mono">
        {filteredActors.length} entities · MLI = primitives present × 20
      </div>
    </div>
  )
}
