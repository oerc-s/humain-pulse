import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '/v1 — States + Indices + Primitives | HP-STD-001',
  description: 'Machine-native clearing API endpoints.',
}

const endpoints = [
  { method: 'GET', path: '/v1/entities', desc: 'All entities with state + indices + primitives' },
  { method: 'GET', path: '/v1/entities/{actor}', desc: 'Single entity state' },
  { method: 'GET', path: '/v1/league-table', desc: 'Top 50 by MEI' },
  { method: 'GET', path: '/v1/notices/{date}', desc: 'State updates for date (YYYY-MM-DD)' },
]

export default function ApiDocsPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-8">
        /v1 — States + Indices + Primitives
      </h1>

      <div className="border border-zinc-800 bg-zinc-900/30 p-4 mb-8">
        <code className="text-emerald-400 font-mono">https://humain-pulse.com/api</code>
      </div>

      <div className="space-y-2">
        {endpoints.map((ep, i) => (
          <div key={i} className="border border-zinc-800/50 bg-zinc-900/20 p-4 flex items-center gap-4 font-mono text-sm">
            <span className="px-2 py-1 text-xs font-bold bg-emerald-500 text-black">{ep.method}</span>
            <code className="text-white">{ep.path}</code>
            <span className="text-zinc-500 text-xs ml-auto">{ep.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-zinc-800 bg-zinc-900/20 p-4">
        <div className="text-[10px] font-mono text-zinc-500 uppercase mb-2">Response Schema</div>
        <pre className="text-zinc-400 font-mono text-xs overflow-x-auto">{`{
  actor, sector, status,
  mei, mli, dmei_24h, dmli_24h,
  primitives: { mid, ei, m2m_se, lch, csd },
  cycle_version, updated_at
}`}</pre>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
