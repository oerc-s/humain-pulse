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

        {/* Why */}
        <div className="border-l-2 border-zinc-700 pl-4 mb-12 max-w-2xl space-y-3">
          <p className="text-zinc-300 font-mono text-sm">
            Autonomous systems (AI software, agents, and robotic systems) act continuously and at machine speed.
          </p>
          <p className="text-zinc-400 font-mono text-sm">
            Human processes can't keep up.
          </p>
          <p className="text-zinc-300 font-mono text-sm">
            That's why risk must be measured and cleared in real time, by machines.
          </p>
          <p className="text-white font-mono text-sm mt-4">
            Humain Pulse provides a public registry and machine-native attestation to switch an entity from exposed to clearable.
          </p>
        </div>

        {/* Certification */}
        <div className="space-y-2 font-mono text-sm text-zinc-400 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Real-time classification: <span className="text-white">Non-Clearable / Clearable / Settled</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Exposure accrues automatically while Non-Clearable <span className="text-white">(MEI / MLI / Δ24h)</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Proofs served via <span className="text-white">HP-STD-001 primitives and APIs</span></span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 border border-white/10 p-6 bg-zinc-900/20 max-w-xl">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Total</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase mb-1">Non-Clearable</div>
            <div className="text-2xl text-red-500 font-mono">{stats.nonConforming}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase mb-1">Clearable</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase mb-1">Settled</div>
            <div className="text-2xl text-emerald-500 font-mono">{stats.conforming}</div>
          </div>
        </div>

        {/* Warning */}
        <div className="border border-red-900/50 bg-red-950/20 p-4 mb-8 max-w-xl">
          <p className="text-red-400 font-mono text-sm">
            Non-Clearable = Non-Settled. Capital remains exposed.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link href="/entities" className="btn-primary">View Registry</Link>
          <Link href="/sectors" className="btn-secondary">Sector Profiles</Link>
          <Link href="/hp-std-001" className="btn-secondary">HP-STD-001</Link>
        </div>
      </div>
    </div>
  )
}
