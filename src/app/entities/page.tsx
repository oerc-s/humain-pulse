'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'
import type { Layer, ConformanceStatus } from '@/types'

type TabFilter = 'All' | Layer
type SortBy = 'MEI' | 'MLI' | 'DEBT'

export default function EntitiesPage() {
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('MEI')

  const filteredActors = useMemo(() => {
    let actors = [...ACTORS]

    // Filter by layer
    if (filterLayer !== 'All') {
      actors = actors.filter(a => a.layer === filterLayer)
    }

    // Filter by search
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      actors = actors.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.sector.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query)
      )
    }

    // Sort
    actors.sort((a, b) => {
      if (sortBy === 'MEI') return b.scores.MEI - a.scores.MEI
      if (sortBy === 'MLI') return b.scores.MLI - a.scores.MLI
      if (sortBy === 'DEBT') return b.debt.units_today - a.debt.units_today
      return 0
    })

    return actors
  }, [filterLayer, searchTerm, sortBy])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-6">Actor Index</h1>
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
              <option value="MLI">Readiness (MLI)</option>
              <option value="DEBT">Debt / Day</option>
            </select>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="SEARCH ENTITY..."
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
              <div className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest mb-1">Specialized Registry</div>
              <div className="text-white font-medium">Reinsurance Clearing Readiness</div>
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
              <th className="text-right">MLI (0-100)</th>
              <th className="text-right">MEI (0-200)</th>
              <th className="text-right">Debt / Day</th>
              <th className="text-right">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredActors.map(actor => (
              <tr key={actor.id} onClick={() => window.location.href = `/entities/${actor.id}`}>
                <td>
                  <Link href={`/entities/${actor.id}`} className="text-white font-bold text-sm hover:text-emerald-400 transition-colors">
                    {actor.name}
                  </Link>
                </td>
                <td className="text-zinc-400 text-xs font-mono uppercase">{actor.layer}</td>
                <td className="text-center">
                  <span className={`badge ${
                    actor.status === 'CONFORMING' ? 'badge-conforming' :
                    actor.status === 'PARTIALLY_CONFORMING' ? 'badge-partial' :
                    'badge-non-conforming'
                  }`}>
                    {actor.status === 'NON_CONFORMING' ? 'OUT' :
                     actor.status === 'PARTIALLY_CONFORMING' ? 'PARTIAL' : 'IN'}
                  </span>
                </td>
                <td className="text-right font-mono text-zinc-300">{actor.scores.MLI}</td>
                <td className="text-right font-mono">
                  <span className={actor.scores.MEI > 150 ? 'text-red-500' : actor.scores.MEI > 100 ? 'text-yellow-500' : 'text-zinc-300'}>
                    {actor.scores.MEI}
                  </span>
                </td>
                <td className="text-right font-mono text-red-400">
                  {actor.debt.units_today > 0 ? `${actor.debt.units_today} U` : '-'}
                </td>
                <td className="text-right font-mono text-[10px] text-zinc-600">
                  {actor.last_review_date}
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
        Showing {filteredActors.length} of {ACTORS.length} actors · Sorted by {sortBy} (descending)
      </div>
    </div>
  )
}
