'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'
import type { Layer } from '@/types'

type TabFilter = 'All' | Layer

function getBand(value: number): { label: string; color: string } {
  if (value >= 150) return { label: 'CRITICAL', color: 'text-red-500' }
  if (value >= 80) return { label: 'ELEVATED', color: 'text-yellow-500' }
  return { label: 'LOW', color: 'text-zinc-400' }
}

function getStatusDisplay(status: string): string {
  switch (status) {
    case 'SETTLED': return 'Settled'
    case 'PARTIAL': return 'Clearable'
    case 'OBSERVED': return 'Observed'
    default: return 'Non-Clearable'
  }
}

function getPrimitive(score: number): string {
  return score >= 3 ? '✓' : '✗'
}

export default function EntitiesPage() {
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')

  const filteredActors = useMemo(() => {
    let list = [...ACTORS]
    if (filterLayer !== 'All') {
      list = list.filter(a => a.layer === filterLayer)
    }
    list.sort((a, b) => b.scores.MEI - a.scores.MEI)
    return list.slice(0, 50)
  }, [filterLayer])

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">
        Public Registry
      </h1>
      <p className="text-zinc-500 font-mono text-sm mb-6">
        Real-time exposure state for all entities. MEI / MLI / Δ24h.
      </p>

      {/* Scale */}
      <div className="font-mono text-xs text-zinc-500 mb-6">
        Scale 0–1000 · <span className="text-zinc-400">LOW</span> &lt;80 · <span className="text-yellow-500">ELEVATED</span> 80–149 · <span className="text-red-500">CRITICAL</span> ≥150
      </div>

      {/* Filters */}
      <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest mb-8">
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

      {/* Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-2 py-3 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        <div className="col-span-2">Actor</div>
        <div className="col-span-1">Sector</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">MEI</div>
        <div className="col-span-1 text-right">MLI</div>
        <div className="col-span-1 text-right">ΔMEI</div>
        <div className="col-span-1 text-right">ΔMLI</div>
        <div className="col-span-4 text-center">Primitives (MID/EI/M2M-SE/LCH/CSD)</div>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {filteredActors.map((actor) => {
          const meiBand = getBand(actor.scores.MEI)
          const mliBand = getBand(actor.scores.MLI)

          return (
            <Link
              key={actor.id}
              href={`/entities/${actor.id}`}
              className="block border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/30 transition-colors"
            >
              {/* Desktop */}
              <div className="hidden lg:grid grid-cols-12 gap-2 py-3 px-4 items-center font-mono text-sm">
                <div className="col-span-2">
                  <div className="text-white font-bold">{actor.name}</div>
                  <div className="text-zinc-600 text-[10px]">{getStatusDisplay(actor.settlement_status || 'UNSETTLED')}</div>
                </div>
                <div className="col-span-1 text-zinc-400 text-xs">{actor.sector}</div>
                <div className="col-span-1 text-center">
                  <span className={`text-[10px] uppercase px-2 py-1 ${
                    actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                    actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                    actor.settlement_status === 'OBSERVED' ? 'bg-blue-900/30 text-blue-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {getStatusDisplay(actor.settlement_status || 'UNSETTLED')}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className={meiBand.color}>{actor.scores.MEI}</span>
                  <span className={`text-[8px] ml-1 ${meiBand.color}`}>{meiBand.label}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className={mliBand.color}>{actor.scores.MLI}</span>
                </div>
                <div className="col-span-1 text-right text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
                <div className="col-span-1 text-right text-zinc-500">{actor.scores.ΔMLI_24h || 0}</div>
                <div className="col-span-4 flex justify-center gap-3 text-[10px]">
                  <span className={actor.primitives.MID.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                    MID:{getPrimitive(actor.primitives.MID.score)}
                  </span>
                  <span className={actor.primitives.EI.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                    EI:{getPrimitive(actor.primitives.EI.score)}
                  </span>
                  <span className={actor.primitives.M2M_SE.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                    M2M-SE:{getPrimitive(actor.primitives.M2M_SE.score)}
                  </span>
                  <span className={actor.primitives.LCH.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                    LCH:{getPrimitive(actor.primitives.LCH.score)}
                  </span>
                  <span className={actor.primitives.CSD.score >= 3 ? 'text-emerald-400' : 'text-red-400'}>
                    CSD:{getPrimitive(actor.primitives.CSD.score)}
                  </span>
                </div>
              </div>

              {/* Mobile */}
              <div className="lg:hidden p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{actor.name}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                    actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                    actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {getStatusDisplay(actor.settlement_status || 'UNSETTLED')}
                  </span>
                </div>
                <div className="text-zinc-500 text-xs font-mono mb-2">{actor.sector}</div>
                <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                  <div>
                    <div className="text-zinc-600 text-[10px]">MEI</div>
                    <div className={meiBand.color}>{actor.scores.MEI}</div>
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
          )
        })}
      </div>

      <div className="mt-6 text-[10px] text-zinc-600 font-mono">
        Top {filteredActors.length} by MEI · HP-STD-001 v1.10
      </div>
    </div>
  )
}
