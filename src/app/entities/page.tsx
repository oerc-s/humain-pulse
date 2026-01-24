'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'
import type { Layer } from '@/types'

type TabFilter = 'All' | Layer

function getStatusLabel(status: string): string {
  switch (status) {
    case 'SETTLED': return 'clearing active'
    case 'PARTIAL': return 'settlement incomplete'
    case 'OBSERVED': return 'loss vector active'
    default: return 'losses accumulating'
  }
}

function getPrimitiveCheck(score: number): string {
  return score >= 3 ? '✓' : '✗'
}

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

    list.sort((a, b) => b.scores.MEI - a.scores.MEI)
    return list
  }, [filterLayer, searchTerm])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">Entities</h1>
          <p className="text-zinc-500 font-mono text-xs mb-4">Exposure ranking by MEI. Losses accumulating until settlement.</p>
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

      {/* Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-2 py-3 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        <div className="col-span-2">Actor</div>
        <div className="col-span-1">Sector</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">MEI</div>
        <div className="col-span-1 text-right">MLI</div>
        <div className="col-span-1 text-right">ΔMEI</div>
        <div className="col-span-1 text-right">ΔMLI</div>
        <div className="col-span-4 text-center">Primitives</div>
      </div>

      {/* Entity List */}
      <div className="space-y-1">
        {filteredActors.map((actor) => (
          <Link
            key={actor.id}
            href={`/entities/${actor.id}`}
            className="block border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/30 transition-colors"
          >
            {/* Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-2 py-3 px-4 items-center font-mono text-sm">
              <div className="col-span-2">
                <div className="text-white font-bold">{actor.name}</div>
                <div className="text-zinc-600 text-[10px]">{getStatusLabel(actor.settlement_status || 'UNSETTLED')}</div>
              </div>
              <div className="col-span-1 text-zinc-400 text-xs">{actor.sector}</div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] uppercase px-2 py-1 ${
                  actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                  actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                  actor.settlement_status === 'OBSERVED' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {actor.settlement_status || 'UNSETTLED'}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <span className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-zinc-300'}>
                  {actor.scores.MEI}
                </span>
              </div>
              <div className="col-span-1 text-right text-zinc-300">{actor.scores.MLI}</div>
              <div className="col-span-1 text-right text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
              <div className="col-span-1 text-right text-zinc-500">{actor.scores.ΔMLI_24h || 0}</div>
              <div className="col-span-4 grid grid-cols-5 gap-1 text-center text-[10px]">
                <span className={actor.primitives.MID.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                  MID {getPrimitiveCheck(actor.primitives.MID.score)}
                </span>
                <span className={actor.primitives.EI.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                  EI {getPrimitiveCheck(actor.primitives.EI.score)}
                </span>
                <span className={actor.primitives.M2M_SE.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                  M2M-SE {getPrimitiveCheck(actor.primitives.M2M_SE.score)}
                </span>
                <span className={actor.primitives.LCH.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                  LCH {getPrimitiveCheck(actor.primitives.LCH.score)}
                </span>
                <span className={actor.primitives.CSD.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                  CSD {getPrimitiveCheck(actor.primitives.CSD.score)}
                </span>
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden p-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="text-white font-bold">{actor.name}</div>
                <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                  actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                  actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {actor.settlement_status || 'UNSETTLED'}
                </span>
              </div>
              <div className="text-zinc-500 text-xs font-mono mb-2">{actor.sector} · {getStatusLabel(actor.settlement_status || 'UNSETTLED')}</div>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                <div>
                  <div className="text-zinc-600 text-[10px]">MEI</div>
                  <div className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-zinc-300'}>{actor.scores.MEI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">MLI</div>
                  <div className="text-zinc-300">{actor.scores.MLI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">ΔMEI</div>
                  <div className="text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">ΔMLI</div>
                  <div className="text-zinc-500">{actor.scores.ΔMLI_24h || 0}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center text-zinc-500 py-12 font-mono">No entities found.</div>
      )}

      <div className="mt-6 text-[10px] text-zinc-600 font-mono">
        {filteredActors.length} entities · HP-STD-001 v1.10
      </div>
    </div>
  )
}
