import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settlement Rules',
  description: 'Deterministic settlement logic. MLI and MEI formulas. State transition rules. No exceptions.',
  keywords: ['settlement rules', 'MLI formula', 'MEI formula', 'state transition', 'settlement primitives'],
}

export default function ClearingPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto animate-in">
      <h1 className="text-4xl text-white font-medium uppercase mb-4">
        Settlement Rules
      </h1>
      <p className="text-zinc-400 font-mono text-sm mb-16">
        Deterministic state logic. No exceptions.
      </p>

      {/* MLI Formula */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          MLI — Clearing Capacity
        </h2>
        <div className="bg-black border border-zinc-800 p-6 mb-4 font-mono">
          <code className="text-emerald-400 text-lg">MLI = COUNT(present primitives) × 20</code>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm font-mono">
          <div className="border border-zinc-800 p-4">
            <div className="text-zinc-500 mb-1">0–39</div>
            <div className="text-red-500 font-bold">UNSETTLED</div>
          </div>
          <div className="border border-zinc-800 p-4">
            <div className="text-zinc-500 mb-1">40–79</div>
            <div className="text-yellow-500 font-bold">PARTIAL</div>
          </div>
          <div className="border border-zinc-800 p-4">
            <div className="text-zinc-500 mb-1">80–100</div>
            <div className="text-emerald-500 font-bold">SETTLED</div>
          </div>
        </div>
      </section>

      {/* MEI Formula */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          MEI — Exposure Pressure
        </h2>
        <div className="bg-black border border-zinc-800 p-6 mb-4 font-mono">
          <code className="text-emerald-400 text-lg">MEI = (AUTOMATION × SCALE × TIME × SURFACE)</code>
        </div>
        <div className="text-zinc-400 text-sm font-mono space-y-2">
          <div>UNSETTLED → MEI grows continuously</div>
          <div>SETTLED → MEI = 0 (normalized)</div>
        </div>
      </section>

      {/* Clearing Primitives */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Clearing Primitives
        </h2>
        <div className="space-y-4">
          {[
            { code: 'MID', name: 'Machine Identity', role: 'Enables actor attribution' },
            { code: 'EI', name: 'Exposure Index', role: 'Enables exposure quantification' },
            { code: 'M2M-SE', name: 'Settlement Endpoint', role: 'Enables autonomous clearing execution' },
            { code: 'LCH', name: 'Liability Chain', role: 'Enables state transition verification' },
            { code: 'CSD', name: 'Control Surface', role: 'Enables operational bounds enforcement' },
          ].map((p) => (
            <div key={p.code} className="border border-white/10 p-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-white font-bold">{p.code}</span>
                <span className="text-zinc-500 text-sm ml-3">{p.name}</span>
              </div>
              <div className="text-zinc-400 text-sm font-mono">{p.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* State Logic */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          State Transitions
        </h2>
        <div className="bg-black border border-zinc-800 p-6 font-mono text-sm space-y-2">
          <div><span className="text-zinc-500">IF</span> MLI &lt; 40 → <span className="text-red-500">UNSETTLED</span></div>
          <div><span className="text-zinc-500">IF</span> 40 ≤ MLI &lt; 80 → <span className="text-yellow-500">PARTIAL</span></div>
          <div><span className="text-zinc-500">IF</span> MLI ≥ 80 → <span className="text-emerald-500">SETTLED</span></div>
        </div>
        <div className="text-zinc-500 text-xs font-mono mt-4">
          State changes are automatic. No approval. No notification required.
        </div>
      </section>

      {/* Exposure Accrual */}
      <section>
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Exposure Accrual
        </h2>
        <div className="border border-red-900/30 bg-red-950/10 p-6">
          <div className="text-zinc-300 font-mono text-sm space-y-2">
            <div>MEI &gt; 0 → Exposure active</div>
            <div>UNSETTLED → Exposure accrues (ΔMEI_24h &gt; 0)</div>
            <div>SETTLED → Exposure normalized (ΔMEI_24h = 0)</div>
          </div>
          <div className="text-zinc-500 text-xs font-mono mt-4 pt-4 border-t border-red-900/30">
            Clearing is the only state modifier.
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-white/10 text-[10px] font-mono text-zinc-600">
        Last clearing cycle: 2026-01-23 · HP-STD-001 v1.10
      </div>
    </div>
  )
}
