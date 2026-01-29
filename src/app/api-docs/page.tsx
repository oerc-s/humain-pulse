import Link from 'next/link'

export default function ApiDocsPage() {
  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[700px] mx-auto">

        <h1 className="text-xl font-medium text-white uppercase tracking-tight mb-8">
          /v1 — States + Indices + Primitives
        </h1>

        <div className="space-y-6 font-mono text-sm">
          <div className="border border-white/10 p-4">
            <div className="text-emerald-400 mb-1">GET /v1/entities</div>
            <div className="text-zinc-500 text-xs">All entities with state, MEI, MLI, Δ24h, primitives.</div>
          </div>

          <div className="border border-white/10 p-4">
            <div className="text-emerald-400 mb-1">{'GET /v1/entities/{actor}'}</div>
            <div className="text-zinc-500 text-xs">Single entity by slug. Full state block.</div>
          </div>

          <div className="border border-white/10 p-4">
            <div className="text-emerald-400 mb-1">GET /v1/league-table</div>
            <div className="text-zinc-500 text-xs">Ranked by MEI descending. All fields.</div>
          </div>

          <div className="border border-white/10 p-4">
            <div className="text-emerald-400 mb-1">{'GET /v1/notices/{date}'}</div>
            <div className="text-zinc-500 text-xs">State transitions for a given date (YYYY-MM-DD).</div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  )
}
