import Link from 'next/link'
import { getStats } from '@/lib/data'

export default function HomePage() {
  const stats = getStats()
  const lastCycle = '2026-01-24'

  return (
    <div className="pt-32 px-6 md:px-12 animate-in">
      <div className="max-w-[1400px] mx-auto min-h-[70vh] flex flex-col justify-start">

        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4 uppercase">
          Humain Pulse — Machine-Native Clearing Operator
        </h1>

        <p className="text-zinc-400 font-mono text-sm mb-4 max-w-2xl">
          Market infrastructure for machine-native risk clearing.
        </p>
        <p className="text-zinc-500 font-mono text-xs mb-12 max-w-2xl">
          Autonomous systems risk is Non-Clearable by default unless attested under HP-STD-001.
        </p>

        {/* 3 Bullets */}
        <div className="space-y-2 font-mono text-sm text-zinc-400 mb-12">
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
            <span>Cycle: <span className="text-white">HP-STD-001 v1.10</span> · Last: {lastCycle}</span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12 border border-white/10 p-6 bg-zinc-900/20 max-w-xl">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Total</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase mb-1">Unsettled</div>
            <div className="text-2xl text-red-500 font-mono">{stats.nonConforming}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase mb-1">Partial</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1">Settled</div>
            <div className="text-2xl text-emerald-500 font-mono">{stats.conforming}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <Link href="/entities" className="btn-primary">View Entities</Link>
          <Link href="/hp-std-001" className="btn-secondary">HP-STD-001</Link>
        </div>
      </div>
    </div>
  )
}
