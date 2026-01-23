import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clearing API',
  description: 'Machine integration endpoints. JSON only. Clearing state, actors, notices, metrics.',
  keywords: ['clearing API', 'machine integration', 'JSON API', 'clearing endpoints'],
}

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/clearing/actors',
      desc: 'All actors with clearing state',
      response: `{
  "actors": [
    {
      "actor_id": "HP-ACT-001",
      "name": "Munich Re",
      "sector": "REINSURANCE",
      "status": "UNSETTLED",
      "MEI": 148,
      "MLI": 20,
      "last_state_change": "2026-01-20T00:00:00Z"
    }
  ],
  "total": 21
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/state',
      desc: 'Live clearing surface metrics',
      response: `{
  "unsettled": 15,
  "partial": 4,
  "settled": 2,
  "total_exposure_day": 380,
  "last_clearing_cycle": "2026-01-23T12:00:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/actors/:id',
      desc: 'Single actor clearing state',
      response: `{
  "actor_id": "HP-ACT-001",
  "name": "Munich Re",
  "sector": "REINSURANCE",
  "status": "UNSETTLED",
  "primitives": {
    "MID": false,
    "EI": false,
    "M2M_SE": false,
    "LCH": false,
    "CSD": false
  },
  "MEI": 148,
  "MLI": 0,
  "exposure_day": 22,
  "last_state_change": "2026-01-20T00:00:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/notices',
      desc: 'Public clearing events',
      response: `{
  "notices": [
    {
      "notice_id": "HP-CLR-20260120-001",
      "actor_id": "HP-ACT-001",
      "status": "UNSETTLED",
      "trigger": "primitives_missing",
      "timestamp": "2026-01-20T00:00:00Z"
    }
  ],
  "total": 42
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/metrics',
      desc: 'Aggregated clearing metrics',
      response: `{
  "total_actors": 21,
  "avg_MEI": 142,
  "avg_MLI": 35,
  "total_exposure_accrued": 12500,
  "last_update": "2026-01-23T12:00:00Z"
}`
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Clearing API</h1>
      <p className="text-zinc-400 font-mono text-sm mb-8">
        Machine integration. JSON only.
      </p>

      {/* Base URL */}
      <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-8">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Base URL</div>
        <code className="text-emerald-400 font-mono">https://humain-pulse.com/api</code>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        {endpoints.map((ep, i) => (
          <div key={i} className="border border-zinc-800 bg-zinc-900/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 text-xs font-mono font-bold bg-emerald-500 text-black">
                {ep.method}
              </span>
              <code className="text-white font-mono">{ep.path}</code>
            </div>
            <p className="text-zinc-400 text-sm mb-4 font-mono">{ep.desc}</p>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-mono">Response</div>
              <pre className="bg-black border border-zinc-800 p-4 text-xs font-mono overflow-x-auto text-zinc-400">
                {ep.response}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* State Values */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-6 mt-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          State Values
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
          <div>
            <div className="text-red-500 font-bold">UNSETTLED</div>
            <div className="text-zinc-500 text-xs">MLI &lt; 40</div>
          </div>
          <div>
            <div className="text-yellow-500 font-bold">PARTIAL</div>
            <div className="text-zinc-500 text-xs">40 ≤ MLI &lt; 80</div>
          </div>
          <div>
            <div className="text-emerald-500 font-bold">SETTLED</div>
            <div className="text-zinc-500 text-xs">MLI ≥ 80</div>
          </div>
          <div>
            <div className="text-zinc-400 font-bold">OBSERVED</div>
            <div className="text-zinc-500 text-xs">Detected, unattributed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
