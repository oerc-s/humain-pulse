import Link from 'next/link'
import { getStats } from '@/lib/clearing/engine'

export default function HomePage() {
  const stats = getStats()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">

        <h1 className="text-2xl md:text-4xl font-medium tracking-tight text-white mb-6 uppercase">
          Humain Pulse
        </h1>

        <p className="text-zinc-400 font-mono text-sm mb-8 max-w-xl">
          Machine-Native Clearing Operator
        </p>

        <div className="border-l-2 border-zinc-700 pl-4 mb-12 max-w-xl space-y-2">
          <p className="text-white font-mono text-sm">
            Non-clearable by default until proven otherwise.
          </p>
          <p className="text-zinc-500 font-mono text-xs">
            Status changes only on attestation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border border-white/10 p-6 bg-zinc-900/20">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Actors</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase mb-1">Non-Clearable</div>
            <div className="text-2xl text-red-500 font-mono">{stats.non_clearable}</div>
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

        {/* Indices */}
        <div className="grid grid-cols-2 gap-4 mb-12 max-w-md">
          <div>
            <span className="font-mono text-xs text-zinc-500 uppercase">Avg MEI: </span>
            <span className="font-mono text-lg text-white">{stats.avg_mei}</span>
          </div>
          <div>
            <span className="font-mono text-xs text-zinc-500 uppercase">Avg MLI: </span>
            <span className="font-mono text-lg text-white">{stats.avg_mli}</span>
          </div>
        </div>

        {/* Accounting language */}
        <div className="border border-white/5 p-4 mb-12 bg-zinc-900/10">
          <p className="font-mono text-xs text-zinc-600">
            Losses are accumulating. Counterparties absorbing unresolved exposure.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link href="/registry" className="btn-primary">Registry</Link>
          <Link href="/actors" className="btn-secondary">Actors</Link>
        </div>
      </div>
    </div>
  )
}
