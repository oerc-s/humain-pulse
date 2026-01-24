'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type ClearingStatus = 'UNSETTLED' | 'PARTIAL' | 'SETTLED'

interface ClearingActor {
  actor_id: string
  name: string
  layer: string
  sector: string
  status: ClearingStatus
  primitives: {
    MID: boolean
    EI: boolean
    M2M_SE: boolean
    LCH: boolean
    CSD: boolean
  }
}

interface ClearingActorWithExposure {
  actor: ClearingActor
  exposure: {
    MEI: number
    MLI: number
  }
}

type TabFilter = 'All' | 'Capital' | 'Compute' | 'Intelligence' | 'Actuation'

function getBand(value: number): { label: string; color: string } {
  if (value >= 150) return { label: 'CRITICAL', color: 'text-red-500' }
  if (value >= 80) return { label: 'ELEVATED', color: 'text-yellow-500' }
  return { label: 'LOW', color: 'text-zinc-400' }
}

function getStatusDisplay(status: ClearingStatus): string {
  switch (status) {
    case 'SETTLED': return 'Settled'
    case 'PARTIAL': return 'Clearable'
    default: return 'Non-Clearable'
  }
}

function getStatusColor(status: ClearingStatus): string {
  switch (status) {
    case 'SETTLED': return 'bg-emerald-900/30 text-emerald-400'
    case 'PARTIAL': return 'bg-yellow-900/30 text-yellow-400'
    default: return 'bg-red-900/30 text-red-400'
  }
}

export default function EntitiesPage() {
  const [actors, setActors] = useState<ClearingActorWithExposure[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLayer, setFilterLayer] = useState<TabFilter>('All')

  useEffect(() => {
    fetch('/api/clearing/actors')
      .then(res => res.json())
      .then(data => {
        setActors(data.actors || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredActors = actors
    .filter(a => filterLayer === 'All' || a.actor.layer === filterLayer)
    .sort((a, b) => b.exposure.MEI - a.exposure.MEI)
    .slice(0, 50)

  const tabs: TabFilter[] = ['All', 'Capital', 'Compute', 'Intelligence', 'Actuation']

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
        <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">
          Public Registry
        </h1>
        <p className="text-zinc-500 font-mono text-sm">Loading clearing state...</p>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">
        Public Registry
      </h1>
      <p className="text-zinc-500 font-mono text-sm mb-6">
        Real-time exposure state for all entities. MEI / MLI.
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
        <div className="col-span-3">Actor</div>
        <div className="col-span-1">Sector</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">MEI</div>
        <div className="col-span-1 text-right">MLI</div>
        <div className="col-span-5 text-center">Primitives (MID/EI/M2M-SE/LCH/CSD)</div>
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {filteredActors.map(({ actor, exposure }) => {
          const meiBand = getBand(exposure.MEI)

          return (
            <Link
              key={actor.actor_id}
              href={`/entities/${actor.actor_id}`}
              className="block border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900/30 transition-colors"
            >
              {/* Desktop */}
              <div className="hidden lg:grid grid-cols-12 gap-2 py-3 px-4 items-center font-mono text-sm">
                <div className="col-span-3">
                  <div className="text-white font-bold">{actor.name}</div>
                  <div className="text-zinc-600 text-[10px]">{actor.actor_id}</div>
                </div>
                <div className="col-span-1 text-zinc-400 text-xs">{actor.sector}</div>
                <div className="col-span-1 text-center">
                  <span className={`text-[10px] uppercase px-2 py-1 ${getStatusColor(actor.status)}`}>
                    {getStatusDisplay(actor.status)}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className={meiBand.color}>{exposure.MEI.toFixed(1)}</span>
                  <span className={`text-[8px] ml-1 ${meiBand.color}`}>{meiBand.label}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-zinc-300">{exposure.MLI}</span>
                </div>
                <div className="col-span-5 flex justify-center gap-3 text-[10px]">
                  <span className={actor.primitives.MID ? 'text-emerald-400' : 'text-red-400'}>
                    MID:{actor.primitives.MID ? '✓' : '✗'}
                  </span>
                  <span className={actor.primitives.EI ? 'text-emerald-400' : 'text-red-400'}>
                    EI:{actor.primitives.EI ? '✓' : '✗'}
                  </span>
                  <span className={actor.primitives.M2M_SE ? 'text-emerald-400' : 'text-red-400'}>
                    M2M-SE:{actor.primitives.M2M_SE ? '✓' : '✗'}
                  </span>
                  <span className={actor.primitives.LCH ? 'text-emerald-400' : 'text-red-400'}>
                    LCH:{actor.primitives.LCH ? '✓' : '✗'}
                  </span>
                  <span className={actor.primitives.CSD ? 'text-emerald-400' : 'text-red-400'}>
                    CSD:{actor.primitives.CSD ? '✓' : '✗'}
                  </span>
                </div>
              </div>

              {/* Mobile */}
              <div className="lg:hidden p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{actor.name}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 ${getStatusColor(actor.status)}`}>
                    {getStatusDisplay(actor.status)}
                  </span>
                </div>
                <div className="text-zinc-500 text-xs font-mono mb-2">{actor.sector}</div>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div>
                    <div className="text-zinc-600 text-[10px]">MEI</div>
                    <div className={meiBand.color}>{exposure.MEI.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-600 text-[10px]">MLI</div>
                    <div className="text-zinc-300">{exposure.MLI}</div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 text-[10px] text-zinc-600 font-mono">
        {filteredActors.length} entities · HP-STD-001 v1.10
      </div>
    </div>
  )
}
