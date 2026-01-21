export default function StandardPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">HP-STD-001</h1>
      <p className="text-zinc-400 font-mono text-sm mb-12 max-w-2xl">
        Machine-native primitives for liability clearing and exposure settlement. Deterministic scoring. Daily reassessment.
      </p>

      {/* Primitives */}
      <section className="card mb-8">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Core Primitives
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-24">Code</th>
              <th>Primitive</th>
              <th>Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-mono font-bold text-emerald-500">MID</td>
              <td className="text-zinc-300">Machine Identity</td>
              <td className="text-zinc-500 text-sm">Present + verifiable cryptographically</td>
            </tr>
            <tr>
              <td className="font-mono font-bold text-emerald-500">EI</td>
              <td className="text-zinc-300">Exposure Index</td>
              <td className="text-zinc-500 text-sm">Published + timestamped endpoint</td>
            </tr>
            <tr>
              <td className="font-mono font-bold text-emerald-500">M2M-SE</td>
              <td className="text-zinc-300">Machine Settlement Endpoint</td>
              <td className="text-zinc-500 text-sm">Reachable + responds to settlement requests</td>
            </tr>
            <tr>
              <td className="font-mono font-bold text-emerald-500">LCH</td>
              <td className="text-zinc-300">Liability Chain Hash</td>
              <td className="text-zinc-500 text-sm">Merkle root of state transitions published</td>
            </tr>
            <tr>
              <td className="font-mono font-bold text-emerald-500">CSD</td>
              <td className="text-zinc-300">Control Surface Declaration</td>
              <td className="text-zinc-500 text-sm">Stop/disable endpoints published</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Primitive Scoring */}
      <section className="card mb-8">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Primitive Scoring (0-4)
        </h2>
        <div className="space-y-3">
          {[
            { score: 0, label: 'ABSENT', desc: 'No evidence of primitive existence' },
            { score: 1, label: 'CONCEPTUAL', desc: 'Primitive mentioned in documentation only' },
            { score: 2, label: 'PROXY', desc: 'Exists but not machine-consumable' },
            { score: 3, label: 'PARTIAL_PUBLIC', desc: 'Public endpoint but incomplete specification' },
            { score: 4, label: 'PUBLIC_VERIFIABLE', desc: 'Full public endpoint with cryptographic verification' }
          ].map(item => (
            <div key={item.score} className="flex items-center gap-4 py-2 border-b border-white/5">
              <span className={`w-8 h-8 flex items-center justify-center font-mono font-bold ${
                item.score === 4 ? 'bg-emerald-500 text-black' :
                item.score === 3 ? 'bg-yellow-500 text-black' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                {item.score}
              </span>
              <div>
                <span className="font-mono text-sm text-white">{item.label}</span>
                <span className="text-zinc-500 text-sm ml-4">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MLI Formula */}
      <section className="card mb-8">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          MLI — Machine Liability Index (0-100)
        </h2>
        <div className="bg-black border border-zinc-800 p-4 mb-4">
          <code className="text-emerald-400 font-mono">MLI = (MID + EI + M2M_SE + LCH + CSD) × 5</code>
        </div>
        <p className="text-zinc-500 text-sm">
          Measures settlement-grade readiness. Higher MLI indicates better machine-to-machine liability clearing capability.
        </p>
      </section>

      {/* MEI Formulas */}
      <section className="card mb-8">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          MEI — Machine Exposure Index (0-200)
        </h2>
        <p className="text-zinc-500 text-sm mb-6">
          Sector-specific exposure scoring. Each factor scored 0-4 (NONE, LOW, MED, HIGH, EXTREME).
        </p>

        <div className="space-y-6">
          <div className="border border-zinc-800 p-4">
            <h4 className="text-white font-mono text-xs uppercase mb-2">Reinsurance</h4>
            <code className="text-emerald-400 font-mono text-sm">
              MEI = (AI_UW + PORTFOLIO_AI + ACCUMULATION + TRIGGERS + LATENCY + RETROCESSION + CLAIMS_AUTOMATION) × 6
            </code>
          </div>
          <div className="border border-zinc-800 p-4">
            <h4 className="text-white font-mono text-xs uppercase mb-2">Compute / Cloud</h4>
            <code className="text-emerald-400 font-mono text-sm">
              MEI = (WORKLOAD_SHARE + CROSS_DEPENDENCY + AUTONOMY_LEVEL + SCALE + TIME_CRITICALITY) × 8
            </code>
          </div>
          <div className="border border-zinc-800 p-4">
            <h4 className="text-white font-mono text-xs uppercase mb-2">Intelligence / AI</h4>
            <code className="text-emerald-400 font-mono text-sm">
              MEI = (DEPLOYED_AUTONOMY + DOWNSTREAM_IMPACT + TOKEN_VOLUME + INTEGRATION_DEPTH + TIME) × 8
            </code>
          </div>
          <div className="border border-zinc-800 p-4">
            <h4 className="text-white font-mono text-xs uppercase mb-2">Actuation / Robotics</h4>
            <code className="text-emerald-400 font-mono text-sm">
              MEI = (PHYSICAL_AUTONOMY + FLEET_SIZE + HUMAN_OVERRIDE_GAP + ENVIRONMENTAL_RISK + TIME) × 8
            </code>
          </div>
        </div>
      </section>

      {/* Conformance Status */}
      <section className="card mb-8">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Conformance Status
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="badge badge-conforming">CONFORMING</span>
            <span className="text-zinc-400 text-sm">MLI ≥ 80 AND at least 4 primitives at level 4 (PUBLIC_VERIFIABLE)</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="badge badge-partial">PARTIAL</span>
            <span className="text-zinc-400 text-sm">MLI ≥ 50 AND at least 2 primitives at level 3+</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="badge badge-non-conforming">NON-CONFORMING</span>
            <span className="text-zinc-400 text-sm">Does not meet CONFORMING or PARTIAL requirements</span>
          </div>
        </div>
      </section>

      {/* Debt Accrual */}
      <section className="card">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Daily Exposure Debt
        </h2>
        <p className="text-zinc-500 text-sm mb-4">
          Non-conforming actors accrue exposure debt daily until settlement-grade primitives are published.
        </p>
        <div className="bg-black border border-zinc-800 p-4">
          <code className="text-emerald-400 font-mono">DED = MEI × α</code>
          <span className="text-zinc-600 ml-4 text-sm">(α is internal multiplier)</span>
        </div>
        <p className="text-zinc-600 text-xs mt-4 font-mono">
          Debt accrues until status = CONFORMING. No negotiation. No exception.
        </p>
      </section>
    </div>
  )
}
