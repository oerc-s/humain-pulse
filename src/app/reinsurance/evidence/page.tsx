import Link from 'next/link'
import { REINSURANCE_ACTORS } from '@/lib/reinsurance-data'

export default function EvidencePage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Evidence</h1>
      <p className="text-zinc-400 font-mono text-sm mb-12">
        Cited sources and evidence links for each reinsurer. Proxy-only sources are marked.
      </p>

      <div className="space-y-8">
        {REINSURANCE_ACTORS.map(actor => {
          const allEvidence = Object.entries(actor.primitives).flatMap(([prim, data]) =>
            data.evidence.map(ev => ({ ...ev, primitive: prim }))
          )

          return (
            <div key={actor.slug} className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <Link
                    href={`/reinsurance/actor/${actor.slug}`}
                    className="text-white font-bold text-lg hover:text-emerald-400 transition-colors"
                  >
                    {actor.name}
                  </Link>
                  <div className="text-zinc-500 font-mono text-xs mt-1">{actor.layer}</div>
                </div>
                <a
                  href={actor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:underline font-mono text-xs"
                >
                  {actor.website.replace('https://', '')} →
                </a>
              </div>

              {allEvidence.length > 0 ? (
                <div className="space-y-3">
                  {allEvidence.map((ev, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-600 font-mono text-xs w-16">{ev.primitive}</span>
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-300 hover:text-emerald-400 font-mono text-sm transition-colors"
                        >
                          {ev.label}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {ev.lang && (
                          <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 px-1">
                            {ev.lang}
                          </span>
                        )}
                        {ev.type === 'proxy' && (
                          <span className="text-[10px] font-mono text-yellow-500 bg-yellow-900/20 px-2 py-0.5">
                            Proxy only (non-machine-consumable)
                          </span>
                        )}
                        {ev.type === 'doc' && (
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5">
                            Documentation
                          </span>
                        )}
                        {ev.type === 'endpoint' && (
                          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-900/20 px-2 py-0.5">
                            Endpoint
                          </span>
                        )}
                        {ev.type === 'spec' && (
                          <span className="text-[10px] font-mono text-blue-500 bg-blue-900/20 px-2 py-0.5">
                            Specification
                          </span>
                        )}
                        {ev.type === 'contract' && (
                          <span className="text-[10px] font-mono text-purple-500 bg-purple-900/20 px-2 py-0.5">
                            Contract
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-600 font-mono text-sm py-4">
                  No public evidence artifacts detected for any primitive.
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-12 p-6 border border-zinc-800 bg-zinc-900/20">
        <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Evidence Types</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 bg-emerald-900/20 px-2 py-0.5">Endpoint</span>
            <span className="text-zinc-500">— Machine-readable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 bg-blue-900/20 px-2 py-0.5">Spec</span>
            <span className="text-zinc-500">— Schema/spec</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500 bg-purple-900/20 px-2 py-0.5">Contract</span>
            <span className="text-zinc-500">— On-chain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 bg-zinc-800 px-2 py-0.5">Doc</span>
            <span className="text-zinc-500">— Human docs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 bg-yellow-900/20 px-2 py-0.5">Proxy</span>
            <span className="text-zinc-500">— Not verifiable</span>
          </div>
        </div>
      </div>
    </div>
  )
}
