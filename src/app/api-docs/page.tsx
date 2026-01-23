import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clearing API',
  description: 'HP-STD-001 machine integration endpoints. JSON only.',
  keywords: ['clearing API', 'HP-STD-001', 'JSON API', 'machine integration'],
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
      "actor_id": "munich-re",
      "name": "Munich Re",
      "sector": "Reinsurance",
      "status": "UNSETTLED",
      "MEI": 148,
      "ΔMEI_24h": 3,
      "MLI": 10,
      "ΔMLI_24h": 0,
      "cash_state": "accumulating",
      "timestamp": "2026-01-23T00:00:00Z",
      "cycle_id": "HP-STD-001 v1.10"
    }
  ],
  "total": 22
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/state',
      desc: 'Live clearing surface metrics',
      response: `{
  "unsettled": 17,
  "partial": 4,
  "settled": 1,
  "observed": 0,
  "total_MEI": 2840,
  "total_ΔMEI_24h": 56,
  "cycle_id": "HP-STD-001 v1.10",
  "timestamp": "2026-01-23T12:00:00Z"
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/actors/:id',
      desc: 'Single actor clearing state',
      response: `{
  "actor_id": "munich-re",
  "name": "Munich Re",
  "sector": "Reinsurance",
  "status": "UNSETTLED",
  "primitives": {
    "MID": true,
    "EI": false,
    "M2M_SE": false,
    "LCH": true,
    "CSD": false
  },
  "MEI": 148,
  "ΔMEI_24h": 3,
  "MLI": 10,
  "ΔMLI_24h": 0,
  "cash_state": "accumulating",
  "timestamp": "2026-01-23T00:00:00Z",
  "cycle_id": "HP-STD-001 v1.10"
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/notices',
      desc: 'Public clearing events',
      response: `{
  "notices": [
    {
      "notice_id": "MED-MUNICH-RE-2026-001",
      "actor_id": "munich-re",
      "status": "UNSETTLED",
      "MEI": 148,
      "ΔMEI_24h": 3,
      "MLI": 10,
      "ΔMLI_24h": 0,
      "cash_state": "accumulating",
      "timestamp": "2026-01-23T00:00:00Z",
      "cycle_id": "HP-STD-001 v1.10"
    }
  ],
  "total": 35
}`
    },
    {
      method: 'GET',
      path: '/api/clearing/invoices',
      desc: 'AP-ready invoice objects',
      response: `{
  "invoices": [
    {
      "ref": "HP-INV-MUNICH-RE-20260123-001",
      "actor_id": "munich-re",
      "actor_name": "Munich Re",
      "line_item": "Status Reconciliation",
      "amount": 14800,
      "cycle_id": "HP-STD-001 v1.10",
      "due_date": "2026-02-22",
      "status": "pending"
    }
  ],
  "total": 21
}`
    }
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Clearing API</h1>
      <p className="text-zinc-500 font-mono text-sm mb-8">
        HP-STD-001 machine integration. JSON only.
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

      {/* Cash States */}
      <div className="border border-zinc-800 bg-zinc-900/20 p-6 mt-6">
        <h2 className="font-mono text-sm uppercase tracking-widest text-emerald-500 mb-6 border-b border-white/10 pb-2">
          Cash States
        </h2>
        <div className="grid grid-cols-3 gap-4 font-mono text-sm">
          <div>
            <div className="text-red-400 font-bold">accumulating</div>
            <div className="text-zinc-500 text-xs">Exposure debt active</div>
          </div>
          <div>
            <div className="text-yellow-400 font-bold">mismatch</div>
            <div className="text-zinc-500 text-xs">Partial reconciliation</div>
          </div>
          <div>
            <div className="text-emerald-400 font-bold">cleared</div>
            <div className="text-zinc-500 text-xs">Settlement complete</div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        Cycle: HP-STD-001 v1.10
      </div>
    </div>
  )
}
