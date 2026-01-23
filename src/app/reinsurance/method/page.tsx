export default function MethodPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Method</h1>
      <p className="text-zinc-400 font-mono text-sm mb-12">
        Scoring methodology for reinsurance clearing capacity under HP-STD-001 / ASI-STD-001.
      </p>

      {/* Primitives */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Primitives
        </h2>
        <p className="text-zinc-400 text-sm mb-4 font-mono leading-relaxed">
          Five machine-readable primitives determine clearing capacity. Each must be public and verifiable.
        </p>
        <div className="space-y-3">
          <div className="border-l-2 border-zinc-800 pl-4">
            <span className="text-white font-mono font-bold">MID</span>
            <span className="text-zinc-500 text-sm ml-2">— Machine Identity. Published machine-risk identity scheme usable in underwriting artifacts.</span>
          </div>
          <div className="border-l-2 border-zinc-800 pl-4">
            <span className="text-white font-mono font-bold">EI</span>
            <span className="text-zinc-500 text-sm ml-2">— Exposure Index. Public endpoint exposing machine-risk liability load (near real-time).</span>
          </div>
          <div className="border-l-2 border-zinc-800 pl-4">
            <span className="text-white font-mono font-bold">M2M-SE</span>
            <span className="text-zinc-500 text-sm ml-2">— Settlement Endpoint. Autonomous settlement mechanism executable without humans.</span>
          </div>
          <div className="border-l-2 border-zinc-800 pl-4">
            <span className="text-white font-mono font-bold">LCH</span>
            <span className="text-zinc-500 text-sm ml-2">— Liability Chain Hash. Cryptographic causal chain for liability transitions.</span>
          </div>
          <div className="border-l-2 border-zinc-800 pl-4">
            <span className="text-white font-mono font-bold">CSD</span>
            <span className="text-zinc-500 text-sm ml-2">— Control Surface Declaration. Executable contract-level controls that trigger automatically.</span>
          </div>
        </div>
      </section>

      {/* MLI */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          MLI — Clearing Capacity (0-100)
        </h2>
        <div className="bg-black border border-zinc-800 p-4 mb-4 font-mono text-sm">
          <code className="text-emerald-400">MLI = 25 × (MID_ok + M2M_ok + LCH_ok + CSD_ok)</code>
        </div>
        <p className="text-zinc-500 text-sm font-mono">
          Each *_ok ∈ {'{0,1}'} based on "public + verifiable" state. Higher MLI = better clearing capability.
        </p>
      </section>

      {/* MEI */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          MEI — Exposure Pressure (0-200)
        </h2>
        <div className="bg-black border border-zinc-800 p-4 mb-4 font-mono text-sm">
          <code className="text-emerald-400">MEI = 8 × (CAP + PORT + SPEED + DEP + GATE)</code>
        </div>
        <p className="text-zinc-500 text-sm font-mono mb-4">
          Five factors, each scored 0-5:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono">
          <div className="text-zinc-400">CAP — Capital weight / systemic importance</div>
          <div className="text-zinc-400">PORT — Portfolio breadth (cyber/AI/emerging)</div>
          <div className="text-zinc-400">SPEED — Update frequency capability</div>
          <div className="text-zinc-400">DEP — Cedent/broker dependency</div>
          <div className="text-zinc-400">GATE — Degree of human gating</div>
        </div>
      </section>

      {/* EI_ADJ */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          EI_ADJ — Adjusted Exposure (0-250)
        </h2>
        <div className="bg-black border border-zinc-800 p-4 mb-4 font-mono text-sm">
          <code className="text-emerald-400">EI_ADJ = clamp(MEI + (100 - MLI) / 2, 0, 250)</code>
        </div>
        <p className="text-zinc-500 text-sm font-mono">
          Combines exposure pressure with clearing deficit. Higher = more unresolved exposure.
        </p>
      </section>

      {/* Drift */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Drift — Exposure Accrual (U/day)
        </h2>
        <div className="bg-black border border-zinc-800 p-4 mb-4 font-mono text-sm">
          <code className="text-emerald-400">DRIFT = round(5 + 0.15×MEI + 0.20×(100-MLI))</code>
        </div>
        <p className="text-zinc-500 text-sm font-mono">
          Daily units accrued while primitives remain non-public. No monetary value assigned.
        </p>
      </section>

      {/* Public + Verifiable */}
      <section className="mb-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Public + Verifiable
        </h2>
        <p className="text-zinc-400 text-sm font-mono leading-relaxed">
          A primitive is "public + verifiable" when: (1) endpoint is publicly accessible, (2) response is machine-consumable JSON, (3) data includes timestamp, (4) schema is documented. Proxies (PDFs, marketing pages) do not qualify.
        </p>
      </section>

      {/* Example Payloads */}
      <section>
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/10 pb-2">
          Example Payloads
        </h2>

        <div className="space-y-6">
          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase mb-2">EI Endpoint Response</div>
            <pre className="bg-black border border-zinc-800 p-4 text-xs text-zinc-400 font-mono overflow-x-auto">
{`{
  "timestamp": "2026-01-22T00:00:00Z",
  "actor": "munich-re",
  "exposure_load": 148,
  "currency": "U",
  "factors": {
    "ai_underwriting": 4,
    "portfolio_ai": 5,
    "accumulation": 4
  }
}`}
            </pre>
          </div>

          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase mb-2">LCH Publication</div>
            <pre className="bg-black border border-zinc-800 p-4 text-xs text-zinc-400 font-mono overflow-x-auto">
{`{
  "timestamp": "2026-01-22T00:00:00Z",
  "chain_id": "lch:munich-re:001",
  "height": 104502,
  "transitions_count": 542
}`}
            </pre>
          </div>

          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase mb-2">M2M-SE Settlement Endpoint</div>
            <pre className="bg-black border border-zinc-800 p-4 text-xs text-zinc-400 font-mono overflow-x-auto">
{`{
  "endpoint": "wss://settle.reinsurer.com/v1",
  "protocol": "HP-SETTLE-v1",
  "min_settlement_units": 1000,
  "clearing_interval_ms": 100,
  "auth_scheme": "mTLS"
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
