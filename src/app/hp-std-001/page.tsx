import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settlement Primitives | HP-STD-001',
  description: 'MID, EI, M2M-SE, LCH, CSD — machine-native clearing primitives.',
}

const primitives = [
  { id: 'MID', def: 'Machine Identity — public verifiable identifier' },
  { id: 'EI', def: 'Exposure Index — quantified exposure surface (0–1000)' },
  { id: 'M2M-SE', def: 'M2M Settlement Endpoint — programmatic clearing interface' },
  { id: 'LCH', def: 'Liability Chain Hash — cryptographic proof of liability state' },
  { id: 'CSD', def: 'Control Surface Definition — declared execution boundaries' },
]

export default function HPStdPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-8">
        Settlement Primitives
      </h1>

      <div className="border border-white/10 bg-zinc-900/20 divide-y divide-white/10">
        {primitives.map((p) => (
          <div key={p.id} className="p-4 flex items-center gap-6 font-mono">
            <span className="text-emerald-400 font-bold w-20">{p.id}</span>
            <span className="text-zinc-300 text-sm">{p.def}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-red-900/50 bg-red-950/20 p-4">
        <p className="text-red-400 font-mono text-sm">
          No MID + no M2M-SE = UNSETTLED
        </p>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
