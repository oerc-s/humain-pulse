export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/actors',
      desc: 'List all audited entities with summary scores',
      response: `{
  "actors": [
    {
      "id": "munich-re",
      "name": "Munich Re",
      "layer": "Capital",
      "sector": "Reinsurance",
      "status": "NON_CONFORMING",
      "scores": { "MLI": 10, "MEI": 148 },
      "debt": { "active": true, "units_today": 22 },
      "last_review_date": "2026-01-20"
    }
  ],
  "total": 21
}`
    },
    {
      method: 'GET',
      path: '/api/actors/:id',
      desc: 'Full primitive breakdown, factors, and debt status',
      response: `{
  "id": "aws",
  "name": "AWS",
  "layer": "Compute",
  "sector": "Cloud",
  "status": "PARTIALLY_CONFORMING",
  "primitives": {
    "MID": { "score": 4, "status": "PUBLIC_VERIFIABLE" },
    "EI": { "score": 4, "status": "PUBLIC_VERIFIABLE" },
    "M2M_SE": { "score": 4, "status": "PUBLIC_VERIFIABLE" },
    "LCH": { "score": 3, "status": "PARTIAL_PUBLIC" },
    "CSD": { "score": 3, "status": "PARTIAL_PUBLIC" }
  },
  "mei_factors": { ... },
  "scores": { "MLI": 90, "MEI": 200 },
  "debt": { "active": true, "units_today": 20, "units_total": 600 },
  "evidence": [ ... ],
  "notices": [ ... ]
}`
    },
    {
      method: 'GET',
      path: '/api/notices',
      desc: 'Stream of all active enforcement notices',
      response: `{
  "notices": [
    {
      "id": "NCR-MUNICH-RE-2026-001",
      "actor_id": "munich-re",
      "actor_name": "Munich Re",
      "date": "2026-01-20",
      "type": "NON_CONFORMANCE",
      "title": "HP-STD-001 Status: NON CONFORMING",
      "summary": "Settlement-grade primitives incomplete.",
      "severity": "HIGH"
    }
  ],
  "total": 42
}`
    },
    {
      method: 'GET',
      path: '/api/notices?actor=:id',
      desc: 'Notices filtered by actor ID',
      response: `{
  "actor_id": "munich-re",
  "notices": [ ... ],
  "total": 2
}`
    },
    {
      method: 'GET',
      path: '/api/standard/HP-STD-001',
      desc: 'HP-STD-001 specification and scoring formulas',
      response: `{
  "id": "HP-STD-001",
  "version": "1.0",
  "primitives": ["MID", "EI", "M2M-SE", "LCH", "CSD"],
  "scoring": {
    "MLI": { "formula": "(MID+EI+M2M_SE+LCH+CSD)×5", "max": 100 },
    "MEI": { "models": ["MEI_reinsurance", "MEI_compute", "MEI_ai", "MEI_actuation"], "max": 200 }
  },
  "conformance_rules": { ... }
}`
    },
    {
      method: 'GET',
      path: '/api/conformance/:id',
      desc: 'Conformance check result for specific actor',
      response: `{
  "actor_id": "aws",
  "actor_name": "AWS",
  "status": "PARTIALLY_CONFORMING",
  "checks": [
    { "primitive": "MID", "score": 4, "passed": true },
    { "primitive": "EI", "score": 4, "passed": true },
    { "primitive": "M2M_SE", "score": 4, "passed": true },
    { "primitive": "LCH", "score": 3, "passed": true },
    { "primitive": "CSD", "score": 3, "passed": true }
  ],
  "pass_count": 5,
  "MLI": 90,
  "checked_at": "2026-01-20T12:00:00Z"
}`
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">API Reference</h1>
      <p className="text-zinc-400 font-mono text-sm mb-8">
        Public read-only endpoints. No authentication required. Rate limit: 100 req/min.
      </p>

      {/* Base URL */}
      <div className="card mb-8">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">Base URL</div>
        <code className="text-emerald-400 font-mono">https://pulse.humain.ai/api</code>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        {endpoints.map((ep, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 text-xs font-mono font-bold bg-emerald-500 text-black">
                {ep.method}
              </span>
              <code className="text-white font-mono">{ep.path}</code>
            </div>
            <p className="text-zinc-400 text-sm mb-4">{ep.desc}</p>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-mono">Response</div>
              <pre className="bg-black border border-zinc-800 p-4 text-xs font-mono overflow-x-auto text-zinc-400">
                {ep.response}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Field Reference */}
      <div className="card mt-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Key Fields
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-transparent cursor-default">
              <td className="font-mono text-sm text-emerald-400">scores.MLI</td>
              <td className="text-zinc-500">integer</td>
              <td className="text-zinc-400">Machine Liability Index (0-100)</td>
            </tr>
            <tr className="hover:bg-transparent cursor-default">
              <td className="font-mono text-sm text-emerald-400">scores.MEI</td>
              <td className="text-zinc-500">integer</td>
              <td className="text-zinc-400">Machine Exposure Index (0-200)</td>
            </tr>
            <tr className="hover:bg-transparent cursor-default">
              <td className="font-mono text-sm text-emerald-400">status</td>
              <td className="text-zinc-500">enum</td>
              <td className="text-zinc-400">CONFORMING | PARTIALLY_CONFORMING | NON_CONFORMING</td>
            </tr>
            <tr className="hover:bg-transparent cursor-default">
              <td className="font-mono text-sm text-emerald-400">debt.active</td>
              <td className="text-zinc-500">boolean</td>
              <td className="text-zinc-400">True if exposure debt is accruing</td>
            </tr>
            <tr className="hover:bg-transparent cursor-default">
              <td className="font-mono text-sm text-emerald-400">primitives.*.score</td>
              <td className="text-zinc-500">0-4</td>
              <td className="text-zinc-400">Primitive validation level</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Admin Note */}
      <div className="card mt-8 border-yellow-900">
        <h2 className="font-mono text-sm uppercase tracking-widest text-yellow-500 mb-2">Admin Endpoints</h2>
        <p className="text-zinc-500 text-sm">
          Write endpoints (POST, PUT, DELETE) require admin authentication. Not exposed publicly.
        </p>
      </div>
    </div>
  )
}
