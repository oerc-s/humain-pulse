import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API | HP-STD-001',
  description: 'Machine-native clearing API. JSON endpoints for entities, notices, and HP-STD-001.',
  keywords: ['API', 'HP-STD-001', 'JSON', 'machine integration'],
}

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/entities',
      desc: 'All entities with clearing state',
      response: `{
  "entities": [
    {
      "actor": "munich-re",
      "sector": "Reinsurance",
      "status": "UNSETTLED",
      "mei": 148,
      "mli": 10,
      "dmei_24h": 3,
      "dmli_24h": 0,
      "primitives": {
        "mid": true,
        "ei": false,
        "m2m_se": false,
        "lch": true,
        "csd": false
      },
      "cycle_version": "HP-STD-001 v1.10",
      "updated_at": "2026-01-24T00:00:00Z"
    }
  ],
  "total": 22
}`
    },
    {
      method: 'GET',
      path: '/api/v1/entities/:slug',
      desc: 'Single entity clearing state',
      response: `{
  "actor": "munich-re",
  "sector": "Reinsurance",
  "layer": "Capital",
  "status": "UNSETTLED",
  "mei": 148,
  "mli": 10,
  "dmei_24h": 3,
  "dmli_24h": 0,
  "primitives": {
    "mid": true,
    "ei": false,
    "m2m_se": false,
    "lch": true,
    "csd": false
  },
  "cycle_version": "HP-STD-001 v1.10",
  "updated_at": "2026-01-24T00:00:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/v1/league-table',
      desc: 'Entities ranked by MEI descending',
      response: `{
  "rankings": [
    {
      "rank": 1,
      "actor": "boston-dynamics",
      "sector": "Robotics",
      "status": "OBSERVED",
      "mei": 195,
      "mli": 5
    }
  ],
  "total": 22,
  "updated_at": "2026-01-24T00:00:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/v1/notices',
      desc: 'Public clearing notices',
      response: `{
  "notices": [
    {
      "notice_id": "HP-NTC-2026-001",
      "actor": "munich-re",
      "status": "UNSETTLED",
      "mei": 148,
      "dmei_24h": 3,
      "timestamp": "2026-01-24T00:00:00Z",
      "cycle_version": "HP-STD-001 v1.10"
    }
  ],
  "total": 35
}`
    },
    {
      method: 'GET',
      path: '/api/v1/hp-std-001',
      desc: 'HP-STD-001 specification',
      response: `{
  "version": "1.10",
  "primitives": ["MID", "EI", "M2M-SE", "LCH", "CSD"],
  "indices": ["MEI", "MLI", "MAEI"],
  "statuses": ["UNSETTLED", "PARTIAL", "SETTLED", "OBSERVED"],
  "rule": "No MID + no M2M-SE = UNSETTLED"
}`
    },
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">API</h1>
      <p className="text-zinc-500 font-mono text-sm mb-8">
        HP-STD-001 machine integration. JSON only.
      </p>

      {/* Base URL */}
      <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-8">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Base URL</div>
        <code className="text-emerald-400 font-mono">https://humain-pulse.com/api/v1</code>
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

      {/* Response Schema */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-6 mt-12">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Response Schema
        </h2>
        <div className="font-mono text-sm text-zinc-400 space-y-2">
          <div><span className="text-white">actor</span>: string — entity slug</div>
          <div><span className="text-white">sector</span>: string — sector name</div>
          <div><span className="text-white">status</span>: UNSETTLED | PARTIAL | SETTLED | OBSERVED</div>
          <div><span className="text-white">mei</span>: integer (0-1000)</div>
          <div><span className="text-white">mli</span>: integer (0-100)</div>
          <div><span className="text-white">dmei_24h</span>: integer delta</div>
          <div><span className="text-white">dmli_24h</span>: integer delta</div>
          <div><span className="text-white">primitives</span>: {"{"} mid, ei, m2m_se, lch, csd {"}"} — booleans</div>
          <div><span className="text-white">cycle_version</span>: string</div>
          <div><span className="text-white">updated_at</span>: ISO 8601 timestamp</div>
        </div>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
