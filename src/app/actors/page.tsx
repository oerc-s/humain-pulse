'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'
import type { Layer } from '@/types'

type TabFilter = 'All' | Layer

export default function ActorsPage() {
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredActors = useMemo(() => {
    let list = [...ACTORS]

    if (filterLayer !== 'All') {
      list = list.filter(a => a.layer === filterLayer)
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.sector.toLowerCase().includes(query)
      )
    }

    // Sort by MEI descending (highest exposure first)
    list.sort((a, b) => b.scores.MEI - a.scores.MEI)

    return list
  }, [filterLayer, searchTerm])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  const getStatusDisplay = (status: string) => {
    if (status === 'CONFORMING') return 'SETTLED'
    if (status === 'PARTIALLY_CONFORMING') return 'PARTIAL'
    return 'UNSETTLED'
  }

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
        {filteredActors.map((actor) => (
          <Link
            key={actor.id}
            href={`/actors/${actor.id}`}
            className="block border border-zinc-800 p-4 hover:border-zinc-600 hover:bg-zinc-900/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Name + Layer */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold truncate">{actor.name}</div>
                <div className="text-zinc-600 text-[10px] font-mono uppercase">{actor.layer} · {actor.sector}</div>
              </div>

              {/* Status */}
              <div className={`font-mono text-xs px-3 py-1 ${
                actor.status === 'CONFORMING' ? 'bg-emerald-900/30 text-emerald-400' :
                actor.status === 'PARTIALLY_CONFORMING' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {getStatusDisplay(actor.status)}
              </div>

              {/* MLI */}
              <div className="text-right w-20">
                <div className="text-white font-mono font-bold">{actor.scores.MLI}</div>
                <div className="text-zinc-600 text-[10px] font-mono">MLI</div>
              </div>

              {/* MEI */}
              <div className="text-right w-20">
                <div className={`font-mono font-bold ${actor.scores.MEI > 150 ? 'text-red-500' : actor.scores.MEI > 100 ? 'text-yellow-500' : 'text-zinc-300'}`}>
                  {actor.scores.MEI}
                </div>
                <div className="text-zinc-600 text-[10px] font-mono">MEI</div>
              </div>

              {/* Arrow */}
              <div className="text-zinc-600">→</div>
            </div>
          </Link>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center text-zinc-500 py-12 font-mono">
          No entities found.
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 text-[10px] text-zinc-600 font-mono">
        {filteredActors.length} entities · Sorted by MEI (highest exposure first)
      </div>
    </div>
  )
}
