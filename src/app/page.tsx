import Link from 'next/link'
import { getStats, ACTORS } from '@/lib/data'

export default function HomePage() {
  const stats = getStats()
  const totalDeltaMEI = ACTORS.reduce((sum, a) => sum + (a.scores.ΔMEI_24h || 0), 0)

  return (
    <div className="pt-32 px-6 md:px-12 animate-in">
      <div className="max-w-[1800px] mx-auto min-h-[80vh] flex flex-col justify-start">

        {/* HERO */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-8 uppercase leading-[0.9] max-w-4xl">
          Exposure accrues.<br />
          <span className="text-emerald-500">Settlement closes it.</span>
        </h1>

        {/* 3 Bullets */}
        <div className="space-y-3 font-mono text-sm text-zinc-400 mb-12 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Public states: <span className="text-white">UNSETTLED / PARTIAL / SETTLED / OBSERVED</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Indices: <span className="text-white">MEI + MLI + Δ24h</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">→</span>
            <span>Invoice object: <span className="text-white">Status Reconciliation (AP-payable)</span></span>
          </div>
        </div>

        {/* Live Clearing Surface */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 border border-white/10 p-6 bg-zinc-900/20">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Entities</div>
            <div className="text-3xl text-white font-mono">{stats.total}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-1">Unsettled</div>
            <div className="text-3xl text-red-500 font-mono">{stats.nonConforming}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-1">Partial</div>
            <div className="text-3xl text-yellow-500 font-mono">{stats.partial}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Settled</div>
            <div className="text-3xl text-emerald-500 font-mono">{stats.conforming}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">ΔMEI_24h</div>
            <div className="text-3xl text-white font-mono">+{totalDeltaMEI}</div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 mb-16">
          Cycle: HP-STD-001 v1.10
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-6 mb-24">
          <Link href="/actors" className="btn-primary">
            View Entities
          </Link>
          <Link href="/notices" className="btn-secondary">
            View Notices
          </Link>
          <Link href="/invoices" className="btn-secondary">
            View Invoices
          </Link>
        </div>

        {/* Highest Exposure */}
        <div className="border-t border-white/10 pt-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Highest Exposure</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTORS.sort((a, b) => b.scores.MEI - a.scores.MEI).slice(0, 4).map((actor) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="border border-white/10 bg-zinc-900/30 p-4 hover:border-white/30 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{actor.sector}</span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/50 text-emerald-400' :
                    actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {actor.settlement_status}
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg mb-3 group-hover:text-emerald-400 transition-colors">
                  {actor.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  <div>
                    <div className="text-[10px] text-zinc-600">MEI</div>
                    <div className={actor.scores.MEI > 150 ? 'text-red-500' : 'text-zinc-300'}>{actor.scores.MEI}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-600">ΔMEI_24h</div>
                    <div className="text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-600">MLI</div>
                    <div className="text-zinc-300">{actor.scores.MLI}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-600">Cash</div>
                    <div className={`text-xs ${
                      actor.cash_state === 'cleared' ? 'text-emerald-400' :
                      actor.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{actor.cash_state}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
