import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActorBySlug, computeAllActors } from '@/lib/clearing/engine'
import type { State } from '@/lib/clearing/types'

const STATE_STYLE: Record<State, string> = {
  UNSETTLED: 'text-red-500 border-red-900 bg-red-950/20',
  PARTIAL: 'text-yellow-500 border-yellow-900 bg-yellow-950/20',
  SETTLED: 'text-emerald-500 border-emerald-900 bg-emerald-950/20',
  OBSERVED: 'text-blue-400 border-blue-900 bg-blue-950/20',
}

const STATE_LABEL: Record<State, string> = {
  UNSETTLED: 'losses accumulating',
  PARTIAL: 'cash mismatch recorded',
  SETTLED: 'clearing active',
  OBSERVED: 'loss vector active',
}

export function generateStaticParams() {
  return computeAllActors().map((a) => ({ slug: a.slug }))
}

export default function EntityPage({ params }: { params: { slug: string } }) {
  const a = getActorBySlug(params.slug)
  if (!a) notFound()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[700px] mx-auto">

        <Link href="/entities" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors mb-6 inline-block">
          ← Entities
        </Link>

        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-2">{a.actor_name}</h1>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-8">{a.sector.replace('_', ' ')}</p>

        <div className="flex flex-wrap items-center gap-6 mb-8">
          <span className={`inline-flex px-3 py-2 text-xs font-mono uppercase tracking-wider border ${STATE_STYLE[a.state]}`}>
            {a.state}
          </span>
          <span className="font-mono text-xs text-zinc-600">{STATE_LABEL[a.state]}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-white/10 p-6 mb-8">
          <div>
            <div className="font-mono text-[10px] text-zinc-500">MEI</div>
            <div className="font-mono text-2xl text-white">{a.MEI}</div>
            <div className="font-mono text-[10px] text-zinc-600">{a.mei_band}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-zinc-500">MLI</div>
            <div className="font-mono text-2xl text-zinc-400">{a.MLI}</div>
            <div className="font-mono text-[10px] text-zinc-600">{a.mli_band}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-zinc-500">ΔMEI 24h</div>
            <div className={`font-mono text-2xl ${a.dMEI_24h > 0 ? 'text-red-400' : a.dMEI_24h < 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
              {a.dMEI_24h > 0 ? '+' : ''}{a.dMEI_24h}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-zinc-500">ΔMLI 24h</div>
            <div className={`font-mono text-2xl ${a.dMLI_24h > 0 ? 'text-red-400' : a.dMLI_24h < 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
              {a.dMLI_24h > 0 ? '+' : ''}{a.dMLI_24h}
            </div>
          </div>
        </div>

        <div className="border border-white/10 p-6 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Primitives</div>
          <div className="grid grid-cols-5 gap-3">
            {(['MID', 'EI', 'M2M_SE', 'LCH', 'CSD'] as const).map((key) => (
              <div key={key} className={`px-3 py-2 border font-mono text-xs text-center ${
                a.primitives[key]
                  ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
                  : 'border-red-900 bg-red-950/20 text-red-400'
              }`}>
                <div className="text-zinc-500 text-[10px] mb-1">{key.replace('_', '-')}</div>
                {a.primitives[key] ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>

        <div className="font-mono text-[10px] text-zinc-600">
          Last update: {a.last_updated_utc}
        </div>
      </div>
    </div>
  )
}
