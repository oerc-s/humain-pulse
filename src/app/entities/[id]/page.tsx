import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActorById, ACTORS } from '@/lib/data'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return ACTORS.map((actor) => ({ id: actor.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    return { title: 'Entity Not Found' }
  }

  const title = `${actor.name} — ${actor.sector} — ${actor.settlement_status || 'UNSETTLED'}`
  const description = `${actor.name} settlement state. MEI: ${actor.scores.MEI}. MLI: ${actor.scores.MLI}. Status: ${actor.settlement_status}.`

  return {
    title,
    description,
    keywords: [actor.name, actor.sector, actor.layer, actor.settlement_status || 'UNSETTLED', 'HP-STD-001'],
  }
}

function getPrimitiveCheck(score: number): { symbol: string; color: string } {
  return score >= 3
    ? { symbol: '✓', color: 'text-emerald-400 bg-emerald-900/30' }
    : { symbol: '✗', color: 'text-red-400 bg-red-900/30' }
}

export default async function EntityPage({ params }: Props) {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    notFound()
  }

  const primitivesList = [
    { key: 'MID', label: 'Machine Identity', data: actor.primitives.MID },
    { key: 'EI', label: 'Exposure Index', data: actor.primitives.EI },
    { key: 'M2M-SE', label: 'M2M Settlement Endpoint', data: actor.primitives.M2M_SE },
    { key: 'LCH', label: 'Liability Chain Hash', data: actor.primitives.LCH },
    { key: 'CSD', label: 'Control Surface Definition', data: actor.primitives.CSD },
  ]

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1200px] mx-auto animate-in">
      <Link href="/entities" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
        ← Entities
      </Link>

      {/* Header */}
      <h1 className="text-4xl md:text-5xl text-white font-medium uppercase tracking-tight mb-2">
        {actor.name}
      </h1>
      <div className="flex items-center gap-3 mb-8 font-mono text-sm">
        <span className="text-zinc-400">{actor.sector}</span>
        <span className="text-zinc-600">—</span>
        <span className={`uppercase px-2 py-1 ${
          actor.settlement_status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
          actor.settlement_status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
          actor.settlement_status === 'OBSERVED' ? 'bg-blue-900/30 text-blue-400' :
          'bg-red-900/30 text-red-400'
        }`}>
          {actor.settlement_status || 'UNSETTLED'}
        </span>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border border-white/10 bg-zinc-900/20 p-6">
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">MEI</div>
          <div className={`text-3xl font-mono ${actor.scores.MEI > 150 ? 'text-red-500' : 'text-white'}`}>
            {actor.scores.MEI}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">MLI</div>
          <div className="text-3xl font-mono text-white">{actor.scores.MLI}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">ΔMEI_24h</div>
          <div className="text-3xl font-mono text-red-400">+{actor.scores.ΔMEI_24h || 0}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">ΔMLI_24h</div>
          <div className="text-3xl font-mono text-zinc-400">{actor.scores.ΔMLI_24h || 0}</div>
        </div>
      </div>

      {/* Primitives Checklist */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          Settlement Primitives
        </div>
        <div className="grid grid-cols-5 gap-2">
          {primitivesList.map(({ key, label, data }) => {
            const check = getPrimitiveCheck(data.score)
            return (
              <div key={key} className={`p-3 text-center border border-white/10 ${check.color}`}>
                <div className="font-mono font-bold text-lg">{check.symbol}</div>
                <div className="font-mono text-xs mt-1">{key}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Accounting State */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          Accounting State
        </div>
        <p className="text-zinc-300 font-mono text-sm mb-2">
          This is current cash exposure.
        </p>
        <p className="text-red-400 font-mono text-sm">
          Losses are accumulating until settlement is declared.
        </p>
      </div>

      {/* Chokepoint Status */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
          Chokepoint
        </div>
        {actor.primitives.MID.score >= 3 && actor.primitives.M2M_SE.score >= 3 ? (
          <p className="text-emerald-400 font-mono text-sm">
            MID ✓ + M2M-SE ✓ = Machine-native clearing possible.
          </p>
        ) : (
          <p className="text-red-400 font-mono text-sm">
            {actor.primitives.MID.score < 3 ? 'MID ✗' : 'MID ✓'} + {actor.primitives.M2M_SE.score < 3 ? 'M2M-SE ✗' : 'M2M-SE ✓'} = UNSETTLED. No clearing possible.
          </p>
        )}
      </div>

      {/* Entity Info */}
      <div className="border-t border-white/10 pt-8 font-mono text-xs text-zinc-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] uppercase mb-1">Entity_ID</div>
            <div className="text-zinc-300">{actor.id}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">Layer</div>
            <div className="text-zinc-300">{actor.layer}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">HQ</div>
            <div className="text-zinc-300">{actor.headquarters_country}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase mb-1">Cycle</div>
            <div className="text-zinc-300">{actor.cycle_id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
