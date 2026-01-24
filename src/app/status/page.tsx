import type { Metadata } from 'next'
import Link from 'next/link'
import { getStats, ACTORS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Status Definitions | HP-STD-001',
  description: 'Four settlement states: UNSETTLED, PARTIAL, SETTLED, OBSERVED. Machine-readable status definitions.',
  keywords: ['HP-STD-001', 'status', 'UNSETTLED', 'PARTIAL', 'SETTLED', 'OBSERVED', 'clearing'],
}

const statusDefinitions = [
  {
    status: 'UNSETTLED',
    color: 'red',
    threshold: 'MLI < 40',
    description: 'Entity has fewer than 2 primitives at score 3+. Exposure accrues daily. Settlement unavailable.',
    implications: [
      'MEI increases by 2% per day',
      'Cash state: accumulating',
      'No clearing eligibility',
      'Public exposure notice active',
    ]
  },
  {
    status: 'PARTIAL',
    color: 'yellow',
    threshold: '40 ≤ MLI < 80',
    description: 'Entity has 2-3 primitives at score 3+. Partial settlement readiness. Exposure accrues at reduced rate.',
    implications: [
      'MEI increases by 1% per day',
      'Cash state: mismatch',
      'Conditional clearing eligibility',
      'Remediation path available',
    ]
  },
  {
    status: 'SETTLED',
    color: 'emerald',
    threshold: 'MLI ≥ 80',
    description: 'Entity has 4+ primitives at score 3+. Full settlement readiness. Exposure cleared.',
    implications: [
      'MEI stable or decreasing',
      'Cash state: cleared',
      'Full clearing eligibility',
      'Settlement active',
    ]
  },
  {
    status: 'OBSERVED',
    color: 'zinc',
    threshold: 'Detected, unattributed',
    description: 'Machine activity detected but not yet attributed to a registered actor. Pending identification.',
    implications: [
      'No MEI assigned yet',
      'Cash state: pending',
      'Attribution in progress',
      'May transition to UNSETTLED',
    ]
  },
]

export default function StatusPage() {
  const stats = getStats()

  // Count by status
  const statusCounts = {
    UNSETTLED: ACTORS.filter(a => a.settlement_status === 'UNSETTLED').length,
    PARTIAL: ACTORS.filter(a => a.settlement_status === 'PARTIAL').length,
    SETTLED: ACTORS.filter(a => a.settlement_status === 'SETTLED').length,
    OBSERVED: ACTORS.filter(a => a.settlement_status === 'OBSERVED').length,
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">Status Definitions</h1>
      <p className="text-zinc-500 font-mono text-sm mb-8">
        HP-STD-001 defines four settlement states. Status derives from MLI score.
      </p>

      {/* Live Counts */}
      <div className="grid grid-cols-4 gap-4 mb-12 border border-white/10 bg-zinc-900/20 p-6">
        <div className="text-center">
          <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-1">Unsettled</div>
          <div className="text-3xl text-red-500 font-mono">{statusCounts.UNSETTLED}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-1">Partial</div>
          <div className="text-3xl text-yellow-500 font-mono">{statusCounts.PARTIAL}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Settled</div>
          <div className="text-3xl text-emerald-500 font-mono">{statusCounts.SETTLED}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Observed</div>
          <div className="text-3xl text-zinc-400 font-mono">{statusCounts.OBSERVED}</div>
        </div>
      </div>

      {/* Status Definitions */}
      <div className="space-y-6">
        {statusDefinitions.map((def) => (
          <div key={def.status} className="border border-white/10 bg-zinc-900/20">
            <div className={`p-6 border-b border-white/10 bg-${def.color}-950/20`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-${def.color}-400 font-mono font-bold text-2xl`}>{def.status}</span>
                <span className={`text-${def.color}-400 font-mono text-sm border border-${def.color}-400/30 px-3 py-1`}>
                  {def.threshold}
                </span>
              </div>
              <p className="text-zinc-300 font-mono text-sm">{def.description}</p>
            </div>
            <div className="p-6">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Implications</div>
              <ul className="space-y-2">
                {def.implications.map((imp, i) => (
                  <li key={i} className="flex items-center gap-3 font-mono text-sm text-zinc-400">
                    <span className={`text-${def.color}-500`}>→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* State Transition */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mt-12">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          State Transitions
        </div>
        <div className="font-mono text-sm text-zinc-400 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>OBSERVED → UNSETTLED: Actor attributed, primitives scored</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>UNSETTLED → PARTIAL: MLI reaches 40 (2+ primitives at 3+)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>PARTIAL → SETTLED: MLI reaches 80 (4+ primitives at 3+)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Any → UNSETTLED: Primitive score regression below threshold</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4 mt-12">
        <Link href="/league-table" className="btn-primary">
          View League Table
        </Link>
        <Link href="/primitives" className="btn-secondary">
          View Primitives
        </Link>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        Cycle: HP-STD-001 v1.10
      </div>
    </div>
  )
}
