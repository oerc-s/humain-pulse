import Link from 'next/link'
import { computeAllActors } from '@/lib/clearing/engine'
import type { State } from '@/lib/clearing/types'

const STATE_COLOR: Record<State, string> = {
  'Non-Clearable': 'text-red-500',
  'Clearable': 'text-yellow-500',
  'Settled': 'text-emerald-500',
}

export default function NoticesPage() {
  const actors = computeAllActors()
  const today = new Date().toISOString().split('T')[0]
  const nonSettled = actors.filter((a) => a.state !== 'Settled')

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[900px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-8">
          Daily Public State Updates
        </h1>

        <div className="border border-white/10 p-6 mb-4">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            {today} — Clearing Cycle
          </div>
          <div className="space-y-2">
            {nonSettled.map((a) => (
              <div key={a.slug} className="flex items-center gap-4 font-mono text-sm">
                <span className="text-zinc-500 text-xs w-20 shrink-0">{a.sector.replace('_', ' ')}</span>
                <Link href={`/entities/${a.slug}`} className="text-white hover:text-emerald-400 transition-colors">
                  {a.actor_name}
                </Link>
                <span className={`text-[10px] uppercase ${STATE_COLOR[a.state]}`}>{a.state}</span>
                <span className="text-zinc-600 text-xs">Exp {a.exposure} · MEI {a.MEI} · MLI {a.MLI} · Δ+{a.d24h}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] text-zinc-600">
          {actors.length} entities tracked · {nonSettled.length} non-settled
        </p>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  )
}
