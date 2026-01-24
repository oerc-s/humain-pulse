import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'HP-STD-001 v1.10 — Settlement Primitives',
  description: 'Machine-native clearing primitives. MID, EI, MLI, M2M-SE, LCH, CSD, MAEI.',
  keywords: ['HP-STD-001', 'primitives', 'MID', 'EI', 'MLI', 'M2M-SE', 'LCH', 'CSD', 'MAEI'],
}

const primitives = [
  { id: 'MID', name: 'Machine Identity', desc: 'Public verifiable identifier for the actor' },
  { id: 'EI', name: 'Exposure Index', desc: 'Quantified machine exposure surface' },
  { id: 'MLI', name: 'Machine Liability Index', desc: 'Settlement readiness score (0-100)' },
  { id: 'M2M-SE', name: 'M2M Settlement Endpoint', desc: 'Programmatic clearing interface' },
  { id: 'LCH', name: 'Liability Chain Hash', desc: 'Cryptographic proof of liability state' },
  { id: 'CSD', name: 'Control Surface Definition', desc: 'Declared execution boundaries' },
  { id: 'MAEI', name: 'Machine Aggregate Exposure Index', desc: 'Sector-level exposure aggregation' },
]

const statusRules = [
  { status: 'SETTLED', rule: 'MID ✓ AND M2M-SE ✓ AND LCH ✓ AND CSD ✓', color: 'text-emerald-400' },
  { status: 'PARTIAL', rule: 'MID ✓ AND (M2M-SE ✗ OR LCH ✗ OR CSD ✗)', color: 'text-yellow-400' },
  { status: 'UNSETTLED', rule: 'MID ✗ OR M2M-SE ✗', color: 'text-red-400' },
  { status: 'OBSERVED', rule: 'Execution detected, primitives missing', color: 'text-blue-400' },
]

export default function HPStdPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">HP-STD-001 v1.10</h1>
      <p className="text-zinc-500 font-mono text-sm mb-12">Settlement Primitives</p>

      {/* Primitives List */}
      <div className="border border-white/10 bg-zinc-900/20 mb-8">
        <div className="p-4 border-b border-white/10">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Primitives</div>
        </div>
        <div className="divide-y divide-white/10">
          {primitives.map((p) => (
            <div key={p.id} className="p-4 flex items-center gap-6">
              <span className="text-emerald-400 font-mono font-bold w-20">{p.id}</span>
              <span className="text-white">{p.name}</span>
              <span className="text-zinc-500 font-mono text-sm ml-auto hidden md:block">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Rules */}
      <div className="border border-white/10 bg-zinc-900/20 mb-8">
        <div className="p-4 border-b border-white/10">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Status Derivation</div>
        </div>
        <div className="divide-y divide-white/10">
          {statusRules.map((r) => (
            <div key={r.status} className="p-4 flex items-center gap-6">
              <span className={`font-mono font-bold w-24 ${r.color}`}>{r.status}</span>
              <span className="text-zinc-400 font-mono text-sm">{r.rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chokepoint Rule */}
      <div className="border border-red-900/50 bg-red-950/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-red-500 uppercase tracking-widest mb-4">Rule</div>
        <p className="text-red-400 font-mono text-lg font-bold">
          No MID + no M2M-SE = UNSETTLED.
        </p>
        <p className="text-zinc-400 font-mono text-sm mt-2">
          Losses accumulating until settlement is declared.
        </p>
      </div>

      {/* Scoring */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Scoring</div>
        <div className="space-y-2 font-mono text-sm text-zinc-400">
          <div>MEI / MLI: integers (0–1000)</div>
          <div>Δ24h: integer delta (positive or negative)</div>
          <div>Primitives: score 0-4 per primitive</div>
          <div>Threshold: score ≥ 3 = primitive satisfied</div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4">
        <Link href="/entities" className="btn-primary">View Entities</Link>
        <Link href="/sectors" className="btn-secondary">View Sectors</Link>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        Cycle: HP-STD-001 v1.10
      </div>
    </div>
  )
}
