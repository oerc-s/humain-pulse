'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { Layer } from '@/types'
import type { ClearingActorWithExposure } from '@/lib/clearing/types'

type TabFilter = 'All' | Layer
type SortBy = 'MEI' | 'MLI'

export default function ActorsPage() {
  const [actors, setActors] = useState<ClearingActorWithExposure[]>([])
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('MEI')

  useEffect(() => {
    fetch('/api/clearing/actors')
      .then(r => r.json())
      .then(data => setActors(data.actors || []))
  }, [])

  const filteredActors = useMemo(() => {
    let list = [...actors]

    // Filter by layer
    if (filterLayer !== 'All') {
      list = list.filter(a => a.actor.layer === filterLayer)
    }

    // Filter by search
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      list = list.filter(a =>
        a.actor.name.toLowerCase().includes(query) ||
        a.actor.sector.toLowerCase().includes(query) ||
        a.actor.actor_id.toLowerCase().includes(query)
      )
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'MEI') return b.exposure.MEI - a.exposure.MEI
      if (sortBy === 'MLI') return b.exposure.MLI - a.exposure.MLI
      return 0
    })

    return list
  }, [actors, filterLayer, searchTerm, sortBy])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-6">Actors</h1>
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
        <div className="flex gap-8 items-end w-full md:w-auto">
          <div className="font-mono text-[10px] uppercase text-zinc-500">
            Sort By:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-transparent text-white ml-2 outline-none border-b border-zinc-800 py-1"
            >
              <option value="MEI">Top Exposure (MEI)</option>
              <option value="MLI">Clearing Capacity (MLI)</option>
            </select>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="SEARCH ACTOR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-800 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none uppercase placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Capital Layer - Reinsurance Module Link */}
      {filterLayer === 'Capital' && (
        <Link
          href="/reinsurance"
          className="block mb-8 p-4 border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest mb-1">Specialized Settlement Layer</div>
              <div className="text-white font-medium">Reinsurance Clearing Capacity</div>
              <div className="text-zinc-500 text-xs font-mono mt-1">MLI, MEI, EI_ADJ, DRIFT metrics · 6 reinsurers tracked</div>
            </div>
            <div className="text-emerald-500 group-hover:translate-x-1 transition-transform">→</div>
          </div>
        </Link>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Layer</th>
              <th className="text-center">Status</th>
              <th className="text-right">MLI</th>
              <th className="text-right">MEI</th>
            </tr>
          </thead>
          <tbody>
            {filteredActors.map(({ actor, exposure }) => (
              <tr key={actor.actor_id}>
                <td>
                  <span className="text-white font-bold text-sm">
                    {actor.name}
                  </span>
                </td>
                <td className="text-zinc-400 text-xs font-mono uppercase">{actor.layer}</td>
                <td className="text-center">
                  <span className={`badge ${
                    actor.status === 'SETTLED' ? 'badge-conforming' :
                    actor.status === 'PARTIAL' ? 'badge-partial' :
                    'badge-non-conforming'
                  }`}>
                    {actor.status}
                  </span>
                </td>
                <td className="text-right font-mono text-zinc-300">{exposure.MLI}</td>
                <td className="text-right font-mono">
                  <span className={exposure.MEI > 1000 ? 'text-red-500' : exposure.MEI > 500 ? 'text-yellow-500' : 'text-zinc-300'}>
                    {Math.round(exposure.MEI)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center text-zinc-500 py-12 font-mono">
          No actors found matching criteria.
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 text-xs text-zinc-600 font-mono">
        Showing {filteredActors.length} of {actors.length} actors · Sorted by {sortBy} (descending)
      </div>
    </div>
  )
}
