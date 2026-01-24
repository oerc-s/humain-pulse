'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

type ClearingStatus = 'UNSETTLED' | 'PARTIAL' | 'SETTLED'

interface ClearingPrimitives {
  MID: boolean
  EI: boolean
  M2M_SE: boolean
  LCH: boolean
  CSD: boolean
}

interface ClearingActor {
  actor_id: string
  name: string
  layer: string
  sector: string
  status: ClearingStatus
  primitives: ClearingPrimitives
  last_settlement: string | null
}

interface ClearingActorWithExposure {
  actor: ClearingActor
  exposure: {
    MEI: number
    MLI: number
  }
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

function getBand(value: number): { label: string; color: string } {
  if (value >= 150) return { label: 'CRITICAL', color: 'text-red-500' }
  if (value >= 80) return { label: 'ELEVATED', color: 'text-yellow-500' }
  return { label: 'LOW', color: 'text-zinc-400' }
}

interface Props {
  params: Promise<{ id: string }>
}

export default function EntityPage({ params }: Props) {
  const { id } = use(params)
  const [data, setData] = useState<ClearingActorWithExposure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/clearing/actors/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1200px] mx-auto animate-in">
        <Link href="/entities" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
          ← Registry
        </Link>
        <p className="text-zinc-500 font-mono text-sm">Loading clearing state...</p>
      </div>
    )
  }

  if (error || !data) {
    notFound()
  }

  const { actor, exposure } = data
  const meiBand = getBand(exposure.MEI)

  const primitivesList = [
    { key: 'MID', label: 'Machine Identity', enabled: actor.primitives.MID },
    { key: 'EI', label: 'Exposure Index', enabled: actor.primitives.EI },
    { key: 'M2M-SE', label: 'M2M Settlement Endpoint', enabled: actor.primitives.M2M_SE },
    { key: 'LCH', label: 'Liability Chain', enabled: actor.primitives.LCH },
    { key: 'CSD', label: 'Control Surface Definition', enabled: actor.primitives.CSD },
  ]

  const canClear = actor.primitives.MID && actor.primitives.M2M_SE

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1200px] mx-auto animate-in">
      <Link href="/entities" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
        ← Registry
      </Link>

      {/* Header */}
      <h1 className="text-4xl md:text-5xl text-white font-medium uppercase tracking-tight mb-2">
        {actor.name}
      </h1>
      <div className="flex items-center gap-3 mb-8 font-mono text-sm">
        <span className="text-zinc-400">{actor.sector}</span>
        <span className="text-zinc-600">—</span>
        <span className={`uppercase px-2 py-1 ${getStatusColor(actor.status)}`}>
          {getStatusDisplay(actor.status)}
        </span>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border border-white/10 bg-zinc-900/20 p-6">
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">MEI</div>
          <div className={`text-3xl font-mono ${meiBand.color}`}>
            {exposure.MEI.toFixed(1)}
          </div>
          <div className={`text-[10px] font-mono ${meiBand.color}`}>{meiBand.label}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">MLI</div>
          <div className="text-3xl font-mono text-white">{exposure.MLI}</div>
          <div className="text-[10px] font-mono text-zinc-500">/100</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Status</div>
          <div className={`text-xl font-mono ${getStatusColor(actor.status).split(' ')[1]}`}>
            {getStatusDisplay(actor.status)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Last Settlement</div>
          <div className="text-sm font-mono text-zinc-300">
            {actor.last_settlement
              ? new Date(actor.last_settlement).toLocaleDateString()
              : 'Never'
            }
          </div>
        </div>
      </div>

      {/* Primitives Checklist */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          Settlement Primitives
        </div>
        <div className="grid grid-cols-5 gap-2">
          {primitivesList.map(({ key, label, enabled }) => (
            <div
              key={key}
              className={`p-3 text-center border border-white/10 ${
                enabled ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'
              }`}
            >
              <div className="font-mono font-bold text-lg">{enabled ? '✓' : '✗'}</div>
              <div className="font-mono text-xs mt-1">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exposure State */}
      {actor.status === 'UNSETTLED' && (
        <div className="border border-red-900/50 bg-red-950/20 p-6 mb-8">
          <p className="text-red-400 font-mono text-sm mb-2">
            Exposure accrues. Clearing unavailable.
          </p>
          <p className="text-zinc-500 font-mono text-xs">
            {actor.primitives.MID ? 'MID ✓' : 'MID ✗'} · {actor.primitives.M2M_SE ? 'M2M-SE ✓' : 'M2M-SE ✗'}
          </p>
        </div>
      )}
      {actor.status === 'PARTIAL' && (
        <div className="border border-yellow-900/50 bg-yellow-950/20 p-6 mb-8">
          <p className="text-yellow-400 font-mono text-sm">Clearable.</p>
        </div>
      )}
      {actor.status === 'SETTLED' && (
        <div className="border border-emerald-900/50 bg-emerald-950/20 p-6 mb-8">
          <p className="text-emerald-400 font-mono text-sm">Settled.</p>
        </div>
      )}

      {/* Entity Info */}
      <div className="border-t border-white/10 pt-8 font-mono text-xs text-zinc-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] uppercase mb-1">Actor_ID</div>
            <div className="text-zinc-300">{actor.actor_id}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">Layer</div>
            <div className="text-zinc-300">{actor.layer}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">Sector</div>
            <div className="text-zinc-300">{actor.sector}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">Standard</div>
            <div className="text-zinc-300">HP-STD-001 v1.10</div>
          </div>
        </div>
      </div>
    </div>
  )
}
