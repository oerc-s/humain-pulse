import Link from 'next/link'
import { getStats } from '@/lib/clearing/engine'

export default function HomePage() {
  const stats = getStats()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">

        <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-white mb-4 uppercase">
          Humain Pulse <span className="text-zinc-500">— Machine-Native Clearing (AGI / AI / Robotics)</span>
        </h1>

        <p className="text-white font-mono text-sm mb-12 max-w-xl">
          Machine risk cannot be insured without machine-native clearing. Losses are already occurring.
        </p>

        <div className="border border-white/10 p-6 mb-12 font-mono text-sm space-y-3">
          <div className="flex gap-4 items-baseline">
            <span className="text-zinc-500 text-xs w-24">States</span>
            <span className="text-red-500">UNSETTLED</span>
            <span className="text-zinc-500">/</span>
            <span className="text-yellow-500">PARTIAL</span>
            <span className="text-zinc-500">/</span>
            <span className="text-emerald-500">SETTLED</span>
            <span className="text-zinc-500">/</span>
            <span className="text-blue-400">OBSERVED</span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-zinc-500 text-xs w-24">Indices</span>
            <span className="text-white">Exposure + MEI + MLI + Δ24h</span>
            <span className="text-zinc-600 text-xs">Scale 0–100</span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-zinc-500 text-xs w-24">Cycle</span>
            <span className="text-white">HP-STD-001 v1.10</span>
            <span className="text-zinc-600 text-xs">{today}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 border border-white/10 p-6 bg-zinc-900/20">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Entities</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase mb-1">Unsettled</div>
            <div className="text-2xl text-red-500 font-mono">{stats.unsettled}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase mb-1">Partial</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1">Settled</div>
            <div className="text-2xl text-emerald-500 font-mono">{stats.settled}</div>
          </div>
        </div>

        <Link href="/entities" className="btn-primary">Registry</Link>
      </div>
    </div>
  )
}
