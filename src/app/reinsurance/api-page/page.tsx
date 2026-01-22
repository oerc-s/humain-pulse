export default function APIPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/registry',
      description: 'List all reinsurers with computed scores.',
      response: `{
  "last_publish": "2026-01-22",
  "actors": [
    {
      "slug": "munich-re",
      "name": "Munich Re",
      "status": "NON-CLEARABLE",
      "scores": { "mli": 0, "mei": 192, "eiAdj": 242, "drift": 54 }
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/registry/{slug}',
      description: 'Full record for a single reinsurer including primitives and factors.',
      response: `{
  "slug": "munich-re",
  "name": "Munich Re",
  "status": "NON-CLEARABLE",
  "primitives": {
    "MID": { "state": "MISSING", "evidence": [] },
    "EI": { "state": "MISSING", "evidence": [] },
    ...
  },
  "factors": { "CAP": 5, "PORT": 5, ... },
  "scores": { "mli": 0, "mei": 192, "eiAdj": 242, "drift": 54 }
}`
    },
    {
      method: 'GET',
      path: '/api/notices',
      description: 'Stream of all active notices across reinsurers.',
      response: `{
  "notices": [
    {
      "id": "HP-NOTICE-20260122-MUNICHRE-001",
      "actor_slug": "munich-re",
      "severity": "CRITICAL",
      "title": "Non-Clearable Status Issued",
      "statement": "No machine-risk settlement primitives detected."
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/method',
      description: 'HP-STD-001 scoring methodology and primitive definitions.',
      response: `{
  "standard": "HP-STD-001 / ASI-STD-001",
  "primitives": ["MID", "EI", "M2M-SE", "LCH", "CSD"],
  "formulas": {
    "mli": "25 * (MID_ok + M2M_ok + LCH_ok + CSD_ok)",
    "mei": "8 * (CAP + PORT + SPEED + DEP + GATE)",
    "eiAdj": "clamp(MEI + (100 - MLI) / 2, 0, 250)",
    "drift": "round(5 + 0.15*MEI + 0.20*(100-MLI))"
  }
}`
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">API</h1>
      <p className="text-zinc-400 font-mono text-sm mb-4">
        Read-only JSON endpoints for reinsurance clearing readiness data.
      </p>
      <p className="text-zinc-500 font-mono text-xs mb-12">
        Base URL: <code className="text-emerald-500">https://humain-pulse.com</code>
      </p>

      <div className="space-y-8">
        {endpoints.map((ep, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-emerald-900 text-emerald-400 px-2 py-1 text-xs font-mono">
                {ep.method}
              </span>
              <code className="text-white font-mono text-sm">{ep.path}</code>
            </div>
            <p className="text-zinc-400 text-sm font-mono mb-4">{ep.description}</p>
            <div className="text-[10px] text-zinc-600 font-mono uppercase mb-2">Example Response</div>
            <pre className="bg-black border border-zinc-800 p-4 text-xs text-zinc-400 font-mono overflow-x-auto">
              {ep.response}
            </pre>
          </div>
        ))}
      </div>

      {/* Rate Limits */}
      <div className="mt-12 p-6 border border-zinc-800 bg-zinc-900/20">
        <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Notes</div>
        <ul className="space-y-2 text-sm font-mono text-zinc-400">
          <li>• All endpoints return JSON with <code className="text-emerald-500">Content-Type: application/json</code></li>
          <li>• No authentication required for read access</li>
          <li>• Data refreshed daily at UTC 00:00</li>
          <li>• CORS enabled for all origins</li>
        </ul>
      </div>
    </div>
  )
}
