import Link from 'next/link'
import { computeAllActors } from '@/lib/clearing/engine'

export default function NoticesPage() {
  const actors = computeAllActors()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-4">
          Notices
        </h1>

        <p className="font-mono text-xs text-zinc-600 mb-8">
          Loss is already occurring. This is an accounting state.
        </p>

        {/* Current state notice */}
        <div className="border border-white/10 p-6 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            {today} — Accounting State
          </div>
          <div className="space-y-3">
            <p className="font-mono text-sm text-zinc-400">
              {actors.filter(a => a.state === 'Non-Clearable').length} actors classified Non-Clearable.
            </p>
            <p className="font-mono text-sm text-zinc-400">
              {actors.filter(a => a.state === 'Clearable').length} actors classified Clearable.
            </p>
            <p className="font-mono text-sm text-zinc-400">
              {actors.filter(a => a.state === 'Settled').length} actors classified Settled.
            </p>
          </div>
        </div>

        {/* Accounting statements */}
        <div className="space-y-4 mb-12">
          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="font-mono text-sm text-white">
              Losses are accumulating.
            </p>
            <p className="font-mono text-xs text-zinc-600 mt-1">
              Counterparties absorbing unresolved exposure.
            </p>
          </div>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="font-mono text-sm text-white">
              Cash mismatch recorded.
            </p>
            <p className="font-mono text-xs text-zinc-600 mt-1">
              Placement degrades mechanically.
            </p>
          </div>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="font-mono text-sm text-white">
              Non-clearable by default until proven otherwise.
            </p>
            <p className="font-mono text-xs text-zinc-600 mt-1">
              Status changes only on attestation.
            </p>
          </div>
        </div>

        {/* HP-STD-001 reference */}
        <div className="border border-white/5 p-4 mb-8 bg-zinc-900/10">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
            Reference
          </div>
          <p className="font-mono text-xs text-zinc-600">
            HP-STD-001 defines settlement primitives: MID, M2M-SE, LCH, CSD.
            Attestation of all four primitives transitions state to Settled.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  )
}
