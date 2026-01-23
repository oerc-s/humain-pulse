'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'
import type { Layer } from '@/types'

type TabFilter = 'All' | Layer

export default function EntitiesPage() {
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

      {/* League Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        <div className="col-span-3">Actor</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">MEI</div>
        <div className="col-span-1 text-right">ΔMEI_24h</div>
        <div className="col-span-1 text-right">MLI</div>
        <div className="col-span-1 text-right">ΔMLI_24h</div>
        <div className="col-span-2 text-center">Cash_State</div>
        <div className="col-span-2 text-right">Timestamp</div>
      </div>

      {/* Entity List */}
      <div className="space-y-1">
        {filteredActors.map((actor) => (
          <Link
            key={actor.id}
            href={`/actors/${actor.id}`}
            className="block border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/30 transition-colors"
          >
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 items-center font-mono text-sm">
              <div className="col-span-3">
                <div className="text-white font-bold">{actor.name}</div>
                <div className="text-zinc-600 text-[10px] uppercase">{actor.layer} · {actor.sector}</div>
              </div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] uppercase px-2 py-1 ${
                  actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                  actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {actor.settlement_status}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <span className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-zinc-300'}>
                  {actor.scores.MEI}
                </span>
              </div>
              <div className="col-span-1 text-right text-red-400">
                +{actor.scores.ΔMEI_24h || 0}
              </div>
              <div className="col-span-1 text-right text-zinc-300">
                {actor.scores.MLI}
              </div>
              <div className="col-span-1 text-right text-zinc-500">
                {actor.scores.ΔMLI_24h || 0}
              </div>
              <div className="col-span-2 text-center">
                <span className={`text-[10px] uppercase ${
                  actor.cash_state === 'cleared' ? 'text-emerald-400' :
                  actor.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {actor.cash_state}
                </span>
              </div>
              <div className="col-span-2 text-right text-zinc-600 text-xs">
                {actor.timestamp}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="text-white font-bold">{actor.name}</div>
                <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                  actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                  actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {actor.settlement_status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                <div>
                  <div className="text-zinc-600 text-[10px]">MEI</div>
                  <div className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-zinc-300'}>{actor.scores.MEI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">ΔMEI</div>
                  <div className="text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">MLI</div>
                  <div className="text-zinc-300">{actor.scores.MLI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">Cash</div>
                  <div className={
                    actor.cash_state === 'cleared' ? 'text-emerald-400' :
                    actor.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
                  }>{actor.cash_state}</div>
                </div>
              </div>
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
        {filteredActors.length} entities · Cycle: HP-STD-001 v1.10
      </div>
    </div>
  )
}
