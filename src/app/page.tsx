import Link from 'next/link'
import { getStats, getAllNotices, ACTORS } from '@/lib/data'

export default function HomePage() {
  const stats = getStats()
  const recentNotices = getAllNotices().slice(0, 4)

  // Activity feed
  const feed = [
    { type: 'NOTICE', text: `${stats.nonConforming} actors unsettled — exposure accruing`, time: 'Today' },
    { type: 'DEBT', text: `${stats.totalDebtToday} total exposure units accruing daily`, time: 'Active' },
    { type: 'SCORE', text: `Average MEI across registry: ${stats.avgMEI}/200`, time: 'Current' },
    { type: 'STATUS', text: `${stats.partial} actors partially settled`, time: 'Active' },
  ]

  return (
    <div className="pt-32 px-6 md:px-12 animate-in">
      <div className="max-w-[1800px] mx-auto min-h-[80vh] flex flex-col justify-start">

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16 border-b border-white/10 pb-8">
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Total Actors</div>
            <div className="text-2xl text-white font-mono">{stats.total}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-red-500 uppercase tracking-widest mb-1">Unsettled</div>
            <div className="text-2xl text-red-500 font-mono">{stats.nonConforming}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-1">Partially Settled</div>
            <div className="text-2xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest mb-1">Settled</div>
            <div className="text-2xl text-white font-mono">{stats.conforming}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Debt Today</div>
            <div className="text-2xl text-white font-mono">{stats.totalDebtToday}</div>
          </div>
        </div>

        {/* Hero */}
        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white mb-6 uppercase leading-[0.85]">
          Humain Pulse
        </h1>
        <h2 className="text-lg md:text-xl text-zinc-400 font-mono uppercase tracking-widest mb-12 border-l-4 border-emerald-500 pl-6 max-w-3xl">
          Machine-native liability registry & exposure clearing readiness.
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-6 mb-24">
          <Link href="/entities" className="btn-primary">
            Browse Actors
          </Link>
          <Link href="/standard" className="btn-secondary">
            View Primitives
          </Link>
          <Link href="/conformance" className="btn-secondary">
            Conformance
          </Link>
        </div>

        {/* Activity Feed */}
        <div className="border-t border-white/10 pt-8 mb-16">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">Today&apos;s Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feed.map((item, i) => (
              <div key={i} className="border-l border-zinc-800 pl-4">
                <div className="flex justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-1 ${
                    item.type === 'NOTICE' ? 'bg-red-900 text-red-400' :
                    item.type === 'DEBT' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>{item.type}</span>
                  <span className="text-[10px] font-mono text-zinc-600">{item.time}</span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Exposure Actors */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6">Highest Exposure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTORS.sort((a, b) => b.scores.MEI - a.scores.MEI).slice(0, 4).map((actor) => (
              <Link
                key={actor.id}
                href={`/entities/${actor.id}`}
                className="card hover:border-white/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-layer">{actor.layer}</span>
                  <span className={`badge ${
                    actor.status === 'CONFORMING' ? 'badge-conforming' :
                    actor.status === 'PARTIALLY_CONFORMING' ? 'badge-partial' :
                    'badge-non-conforming'
                  }`}>
                    {actor.status === 'NON_CONFORMING' ? 'UNSETTLED' :
                     actor.status === 'PARTIALLY_CONFORMING' ? 'PARTIAL' : 'SETTLED'}
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                  {actor.name}
                </h4>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-zinc-500">MEI</span>
                  <span className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-yellow-500'}>
                    {actor.scores.MEI}/200
                  </span>
                </div>
                <div className="flex justify-between font-mono text-sm mt-1">
                  <span className="text-zinc-500">MLI</span>
                  <span className="text-zinc-300">{actor.scores.MLI}/100</span>
                </div>
                {actor.debt.active && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between font-mono text-xs">
                    <span className="text-zinc-600">Debt/Day</span>
                    <span className="text-red-400">{actor.debt.units_today} U</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
