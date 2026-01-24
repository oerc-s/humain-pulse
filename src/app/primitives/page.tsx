import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settlement Primitives | HP-STD-001',
  description: 'Five machine-verifiable primitives for settlement readiness. MID, EI, M2M-SE, LCH, CSD.',
  keywords: ['HP-STD-001', 'primitives', 'MID', 'EI', 'M2M-SE', 'LCH', 'CSD', 'settlement'],
}

const primitives = [
  {
    id: 'MID',
    name: 'Machine Identity',
    description: 'Public identifier for the actor. Verifiable origin.',
    levels: [
      { score: 0, label: 'ABSENT', desc: 'No public identity' },
      { score: 1, label: 'CONCEPTUAL', desc: 'Named but not verifiable' },
      { score: 2, label: 'PROXY', desc: 'Third-party attestation' },
      { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Some public verification' },
      { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Fully verifiable identity' },
    ]
  },
  {
    id: 'EI',
    name: 'Exposure Index',
    description: 'Quantified machine exposure. Published liability surface.',
    levels: [
      { score: 0, label: 'ABSENT', desc: 'No exposure data' },
      { score: 1, label: 'CONCEPTUAL', desc: 'Acknowledged but unmeasured' },
      { score: 2, label: 'PROXY', desc: 'Estimated via third-party' },
      { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Partial public disclosure' },
      { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Full public exposure data' },
    ]
  },
  {
    id: 'M2M-SE',
    name: 'Machine-to-Machine Settlement Endpoint',
    description: 'Programmatic settlement interface. API or protocol.',
    levels: [
      { score: 0, label: 'ABSENT', desc: 'No M2M interface' },
      { score: 1, label: 'CONCEPTUAL', desc: 'Planned but not deployed' },
      { score: 2, label: 'PROXY', desc: 'Manual/human mediated' },
      { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Limited API access' },
      { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Full public API' },
    ]
  },
  {
    id: 'LCH',
    name: 'Liability Chain Hash',
    description: 'Cryptographic proof of liability state. Immutable record.',
    levels: [
      { score: 0, label: 'ABSENT', desc: 'No hash record' },
      { score: 1, label: 'CONCEPTUAL', desc: 'Internal only' },
      { score: 2, label: 'PROXY', desc: 'Third-party audit' },
      { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Periodic publication' },
      { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Real-time hash publication' },
    ]
  },
  {
    id: 'CSD',
    name: 'Clearing Status Declaration',
    description: 'Explicit settlement readiness declaration. Public commitment.',
    levels: [
      { score: 0, label: 'ABSENT', desc: 'No declaration' },
      { score: 1, label: 'CONCEPTUAL', desc: 'Informal acknowledgment' },
      { score: 2, label: 'PROXY', desc: 'Third-party statement' },
      { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Conditional declaration' },
      { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Full public commitment' },
    ]
  },
]

export default function PrimitivesPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">Settlement Primitives</h1>
      <p className="text-zinc-500 font-mono text-sm mb-12">
        HP-STD-001 defines five machine-verifiable primitives. Each scores 0-4. MLI = count of primitives at score 3+ times 20.
      </p>

      {/* Formula */}
      <div className="border border-white/10 bg-zinc-900/30 p-6 mb-12 font-mono">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">MLI Formula</div>
        <div className="text-emerald-400 text-lg">
          MLI = [MID, EI, M2M-SE, LCH, CSD].filter(score &gt;= 3).length × 20
        </div>
        <div className="text-zinc-500 text-sm mt-2">
          Maximum: 100 (all 5 primitives at score 3 or 4)
        </div>
      </div>

      {/* Primitives Grid */}
      <div className="space-y-8">
        {primitives.map((primitive) => (
          <div key={primitive.id} className="border border-white/10 bg-zinc-900/20">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-emerald-400 font-mono font-bold text-xl">{primitive.id}</span>
                <span className="text-white font-medium text-lg">{primitive.name}</span>
              </div>
              <p className="text-zinc-400 font-mono text-sm">{primitive.description}</p>
            </div>
            <div className="grid grid-cols-5 divide-x divide-white/10">
              {primitive.levels.map((level) => (
                <div key={level.score} className={`p-4 ${level.score >= 3 ? 'bg-emerald-950/20' : ''}`}>
                  <div className="text-center mb-2">
                    <span className={`font-mono font-bold text-lg ${
                      level.score >= 3 ? 'text-emerald-400' :
                      level.score >= 1 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{level.score}</span>
                  </div>
                  <div className={`text-[10px] font-mono uppercase text-center mb-1 ${
                    level.score >= 3 ? 'text-emerald-400' :
                    level.score >= 1 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{level.label}</div>
                  <div className="text-zinc-500 text-[10px] text-center">{level.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Threshold Reference */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mt-12">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          Settlement Thresholds
        </div>
        <div className="grid grid-cols-3 gap-4 font-mono text-sm">
          <div className="text-center">
            <div className="text-red-400 font-bold mb-1">MLI &lt; 40</div>
            <div className="text-red-400 text-xs">UNSETTLED</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold mb-1">40 &le; MLI &lt; 80</div>
            <div className="text-yellow-400 text-xs">PARTIAL</div>
          </div>
          <div className="text-center">
            <div className="text-emerald-400 font-bold mb-1">MLI &ge; 80</div>
            <div className="text-emerald-400 text-xs">SETTLED</div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        Cycle: HP-STD-001 v1.10
      </div>
    </div>
  )
}
