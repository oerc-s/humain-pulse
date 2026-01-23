import Link from 'next/link'
import { REINSURANCE_ACTORS, getActorScores, getStats, STATUS_DEFINITIONS } from '@/lib/reinsurance-data'
import type { ReinsuranceStatus } from '@/lib/reinsurance-data'

export default function ReinsurancePage() {
  const stats = getStats()
  const topExposure = REINSURANCE_ACTORS
    .map(a => ({ ...a, scores: getActorScores(a) }))
    .sort((a, b) => b.scores.eiAdj - a.scores.eiAdj)
    .slice(0, 4)

  return (
    <div className="pt-32 px-6 md:px-12 animate-in">
      <div className="max-w-[1800px] mx-auto min-h-[80vh] flex flex-col justify-start">

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 border-b border-white/10 pb-8">
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Reinsurers</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-red-500 uppercase tracking-widest mb-1">Non-Clearable</div>
            <div className="text-2xl text-red-500 font-mono">{stats.nonClearable}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-1">Human-Gated</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.humanGated}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-1">Conforming</div>
            <div className="text-2xl text-white font-mono">{stats.conforming}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Total Drift</div>
            <div className="text-2xl text-white font-mono">{stats.totalDrift} <span className="text-sm text-zinc-500">U/day</span></div>
          </div>
        </div>

        {/* Hero */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-white mb-6 uppercase leading-[0.9]">
          Reinsurance Clearing Capacity
          <br />
          <span className="text-emerald-500">Machine Risk</span> <span className="text-zinc-600 text-3xl md:text-4xl lg:text-5xl">(Live)</span>
        </h1>
        <h2 className="text-base md:text-lg text-zinc-400 font-mono uppercase tracking-widest mb-12 border-l-4 border-emerald-500 pl-6 max-w-3xl">
          Public settlement states measuring whether reinsurance can settle autonomous AI/agent risk without human gating.
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-6 mb-16">
          <Link href="/reinsurance/registry" className="btn-primary">
            View Settlement Layer
          </Link>
          <Link href="/reinsurance/method" className="btn-secondary">
            Read Method
          </Link>
        </div>

        {/* Standards Basis */}
        <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-16">
          Standards basis: <span className="text-zinc-400">HP-STD-001</span> / <span className="text-zinc-400">ASI-STD-001</span>
        </div>

        {/* Status Legend */}
        <div className="border-t border-white/10 pt-8 mb-16">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">Status Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(STATUS_DEFINITIONS) as [ReinsuranceStatus, string][]).map(([status, def]) => (
              <div key={status} className="border-l border-zinc-800 pl-4">
                <span className={`inline-block px-2 py-1 text-[10px] font-mono uppercase mb-2 ${
                  status === 'CONFORMING' ? 'bg-emerald-900 text-emerald-400' :
                  status === 'PARTIAL' ? 'bg-yellow-900 text-yellow-400' :
                  status === 'HUMAN-GATED' ? 'bg-orange-900 text-orange-400' :
                  status === 'UNSETTLED' ? 'bg-red-900/50 text-red-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {status}
                </span>
                <p className="text-xs text-zinc-500 font-mono leading-relaxed">{def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Exposure */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">Highest Adjusted Exposure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topExposure.map((actor) => (
              <Link
                key={actor.slug}
                href={`/reinsurance/actor/${actor.slug}`}
                className="card hover:border-white/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-layer">Capital / Reinsurance</span>
                  <span className={`badge ${
                    actor.status === 'CONFORMING' ? 'badge-conforming' :
                    actor.status === 'PARTIAL' ? 'badge-partial' :
                    actor.status === 'HUMAN-GATED' ? 'badge-human-gated' :
                    'badge-non-conforming'
                  }`}>
                    {actor.status}
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg mb-3 group-hover:text-emerald-400 transition-colors">
                  {actor.name}
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">EI_ADJ</span>
                    <span className={actor.scores.eiAdj > 150 ? 'text-red-500' : 'text-yellow-500'}>
                      {actor.scores.eiAdj}/250
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">MLI</span>
                    <span className="text-zinc-300">{actor.scores.mli}/100</span>
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-zinc-500">MEI</span>
                    <span className="text-zinc-300">{actor.scores.mei}/200</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between font-mono text-xs">
                  <span className="text-zinc-600">Drift</span>
                  <span className="text-red-400">+{actor.scores.drift} U/day</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
