import Link from 'next/link'
import { getStats } from '@/lib/clearing/engine'

export default function HomePage() {
  const stats = getStats()

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
            <span className="text-red-500">Non-Clearable</span>
            <span className="text-zinc-500">/</span>
            <span className="text-yellow-500">Clearable</span>
            <span className="text-zinc-500">/</span>
            <span className="text-emerald-500">Settled</span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-zinc-500 text-xs w-24">Indices</span>
            <span className="text-white">MEI + MLI + Exposure + Δ24h</span>
            <span className="text-zinc-600 text-xs">Scale 0–100</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12 border border-white/10 p-6 bg-zinc-900/20">
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase mb-1">Non-Clearable</div>
            <div className="text-2xl text-red-500 font-mono">{stats.nonClearable}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase mb-1">Clearable</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.clearable}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1">Settled</div>
            <div className="text-2xl text-emerald-500 font-mono">{stats.settled}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/entities" className="btn-primary">Registry</Link>
          <span className="font-mono text-[10px] text-zinc-600">{stats.total} entities tracked</span>
        </div>
      </div>
    </div>
  )
}
