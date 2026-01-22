export default function StandardPage() {
  const primitives = [
    {
      code: 'MID',
      name: 'Machine Identity',
      desc: 'Public cryptographic identity rooted in hardware or model weights.',
      schema: `{
  "did": "did:web:actor.com:mid:12345",
  "verificationMethod": [{
    "id": "#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:actor.com",
    "publicKeyJwk": { ... }
  }],
  "proof": { "type": "MerkleProof2019", ... }
}`
    },
    {
      code: 'EI',
      name: 'Exposure Index',
      desc: 'Public endpoint declaring current liability load and dependency graph.',
      schema: `{
  "timestamp": "2026-01-20T14:00:00Z",
  "score": 148,
  "factors": {
    "ai_underwriting": 4,
    "portfolio_ai": 5,
    "accumulation": 4
  },
  "dependencies": ["did:web:aws.com", "did:web:nvidia.com"]
}`
    },
    {
      code: 'M2M-SE',
      name: 'Settlement Endpoint',
      desc: 'Wallet/Contract endpoint for automated clearing of liability premiums.',
      schema: `{
  "endpoint": "wss://clearing.actor.com/v1/settle",
  "supported_assets": ["USDC", "ETH"],
  "min_settlement": "100.00",
  "clearing_interval_ms": 100
}`
    },
    {
      code: 'LCH',
      name: 'Liability Chain Hash',
      desc: 'Merkle root digest of prior state transitions to ensure non-repudiation.',
      schema: `{
  "root_hash": "0x8f2d7a1b3c...",
  "prev_hash": "0x9a1b4e2f...",
  "height": 104502,
  "transitions_count": 542
}`
    },
    {
      code: 'CSD',
      name: 'Control Surface Decl.',
      desc: 'Machine-readable definition of operational bounds and kill-switch logic.',
      schema: `{
  "operational_bounds": {
    "max_throughput": "10M req/s",
    "geo_fence": ["US", "EU", "APAC"]
  },
  "interdiction_endpoint": "https://api.actor.com/ops/halt",
  "auth_scheme": "mTLS"
}`
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto animate-in">
      <h1 className="text-4xl text-white font-medium uppercase mb-4">
        HP-STD-001 <span className="text-zinc-500">Primitives</span>
      </h1>
      <p className="text-zinc-400 font-mono text-sm mb-16 max-w-2xl">
        Technical definitions for the Machine Liability Index standard. Each primitive must be machine-consumable and cryptographically verifiable.
      </p>

      {/* Primitives with Schemas */}
      <div className="space-y-8 mb-24">
        {primitives.map(p => (
          <div key={p.code} className="border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-mono text-emerald-500 font-bold text-lg">{p.code}</span>
                <span className="font-mono text-xs text-zinc-500 uppercase">{p.name}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{p.desc}</p>
            </div>
            <div className="bg-[#050505] p-4">
              <div className="text-[10px] text-zinc-600 font-mono uppercase mb-2">Example Schema</div>
              <pre className="text-[11px] text-zinc-400 font-mono overflow-x-auto p-3 border border-zinc-900 bg-black/50">
                {p.schema}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Section */}
      <div className="border-t border-white/10 pt-16 mb-16">
        <h2 className="text-2xl text-white font-medium uppercase mb-8">Scoring Models</h2>

        {/* Primitive Scoring */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6 mb-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6">
            Primitive Score (0-4)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { score: 0, label: 'ABSENT' },
              { score: 1, label: 'CONCEPTUAL' },
              { score: 2, label: 'PROXY' },
              { score: 3, label: 'PARTIAL' },
              { score: 4, label: 'VERIFIED' }
            ].map(item => (
              <div key={item.score} className="text-center p-4 border border-white/5">
                <div className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center font-mono font-bold text-lg ${
                  item.score === 4 ? 'bg-emerald-500 text-black' :
                  item.score === 3 ? 'bg-yellow-500 text-black' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {item.score}
                </div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MLI */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6 mb-8">
          <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4">
            MLI — Machine Liability Index
          </h3>
          <div className="bg-black border border-zinc-800 p-4 mb-4 font-mono">
            <span className="text-emerald-400">MLI = (MID + EI + M2M_SE + LCH + CSD) × 5</span>
            <span className="text-zinc-600 ml-4">// Range: 0-100</span>
          </div>
          <p className="text-zinc-500 text-sm">
            Settlement-grade readiness. Higher MLI = better M2M clearing capability.
          </p>
        </div>

        {/* MEI */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6">
          <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-4">
            MEI — Machine Exposure Index
          </h3>
          <p className="text-zinc-500 text-sm mb-6">Sector-specific. Each factor scored 0-5.</p>

          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 p-4">
              <div className="text-white font-mono text-xs uppercase mb-2">Capital / Reinsurance</div>
              <code className="text-emerald-400 font-mono text-sm">
                (AI_UW + PORTFOLIO_AI + ACCUMULATION + TRIGGERS + LATENCY + RETROCESSION + CLAIMS) × 6
              </code>
            </div>
            <div className="bg-black border border-zinc-800 p-4">
              <div className="text-white font-mono text-xs uppercase mb-2">Compute / Cloud</div>
              <code className="text-emerald-400 font-mono text-sm">
                (WORKLOAD + DEPENDENCY + AUTONOMY + SCALE + CRITICALITY) × 8
              </code>
            </div>
            <div className="bg-black border border-zinc-800 p-4">
              <div className="text-white font-mono text-xs uppercase mb-2">Intelligence / AI</div>
              <code className="text-emerald-400 font-mono text-sm">
                (DEPLOYED_AUTONOMY + DOWNSTREAM + TOKENS + INTEGRATION + TIME) × 8
              </code>
            </div>
            <div className="bg-black border border-zinc-800 p-4">
              <div className="text-white font-mono text-xs uppercase mb-2">Actuation / Robotics</div>
              <code className="text-emerald-400 font-mono text-sm">
                (PHYSICAL_AUTONOMY + FLEET + OVERRIDE_GAP + ENV_RISK + TIME) × 8
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Conformance Rules */}
      <div className="border-t border-white/10 pt-16">
        <h2 className="text-2xl text-white font-medium uppercase mb-8">Conformance Rules</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-6 p-6 border border-emerald-900/30 bg-emerald-950/10">
            <span className="badge badge-conforming shrink-0">CONFORMING</span>
            <div>
              <div className="text-white font-mono text-sm mb-1">MLI ≥ 80</div>
              <div className="text-zinc-500 text-sm">At least 4 primitives at level 4 (PUBLIC_VERIFIABLE)</div>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6 border border-yellow-900/30 bg-yellow-950/10">
            <span className="badge badge-partial shrink-0">PARTIAL</span>
            <div>
              <div className="text-white font-mono text-sm mb-1">MLI ≥ 50</div>
              <div className="text-zinc-500 text-sm">At least 2 primitives at level 3+</div>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6 border border-red-900/30 bg-red-950/10">
            <span className="badge badge-non-conforming shrink-0">NON-CONFORMING</span>
            <div>
              <div className="text-white font-mono text-sm mb-1">Does not meet requirements</div>
              <div className="text-zinc-500 text-sm">Daily exposure debt accrual active. DED = MEI × α</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
