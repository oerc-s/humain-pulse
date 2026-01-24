import Link from 'next/link'
import { getStats, ACTORS } from '@/lib/data'

export default function HomePage() {
  const stats = getStats()
  const totalDeltaMEI = ACTORS.reduce((sum, a) => sum + (a.scores.ΔMEI_24h || 0), 0)
  const timestamp = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-32 px-6 md:px-12 animate-in">
      <div className="max-w-[1800px] mx-auto min-h-[80vh] flex flex-col justify-start">

        {/* HERO */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-6 uppercase leading-[0.9] max-w-4xl">
          Machine risk cannot be insured without machine-native clearing.
        </h1>

        <p className="text-zinc-400 font-mono text-lg mb-4 max-w-2xl">
          Until settlement primitives exist, losses are already occurring.
        </p>

        <p className="text-emerald-500 font-mono text-sm mb-12">
          Humain Pulse — Machine-Native Clearing Operator
        </p>

        {/* 3 Bullets */}
        <div className="space-y-3 font-mono text-sm text-zinc-400 mb-12 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Public states: <span className="text-white">UNSETTLED / PARTIAL / SETTLED / OBSERVED</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Indices: <span className="text-white">MEI + MLI + Δ24h</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Cycle: <span className="text-white">HP-STD-001 v1.10</span> <span className="text-zinc-600">({timestamp})</span></span>
          </div>
        </div>

        {/* Accounting State */}
        <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8 max-w-xl">
          <p className="text-zinc-300 font-mono text-sm">
            This is an accounting state. Exposure accrues continuously until settlement is declared.
          </p>
        </div>

        {/* Live Surface */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 border border-white/10 p-6 bg-zinc-900/20">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Entities</div>
            <div className="text-3xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-1">Unsettled</div>
            <div className="text-3xl text-red-500 font-mono">{stats.nonConforming}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-1">Partial</div>
            <div className="text-3xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Settled</div>
            <div className="text-3xl text-emerald-500 font-mono">{stats.conforming}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-6 mb-24">
          <Link href="/entities" className="btn-primary">
            View Entities
          </Link>
          <Link href="/hp-std-001" className="btn-secondary">
            HP-STD-001
          </Link>
        </div>

        {/* Chokepoint */}
        <div className="border-t border-white/10 pt-8 max-w-xl">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Chokepoint</div>
          <p className="text-zinc-300 font-mono text-sm mb-2">
            MID + M2M-SE = machine-native clearing possible.
          </p>
          <p className="text-red-400 font-mono text-sm">
            No MID + no M2M-SE = UNSETTLED. Losses accumulating.
          </p>
        </div>
      </div>
    </div>
  )
}
