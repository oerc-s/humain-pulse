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

  const title = `${actor.name} — ${actor.settlement_status} | HP-STD-001`
  const description = `${actor.name} settlement state. Status: ${actor.settlement_status}. MEI: ${actor.scores.MEI}. MLI: ${actor.scores.MLI}. Cash: ${actor.cash_state}.`

  return {
    title,
    description,
    keywords: [actor.name, actor.sector, actor.layer, actor.settlement_status || '', 'HP-STD-001'],
    openGraph: { title, description, type: 'article', url: `https://humain-pulse.com/actors/${actor.id}` },
    twitter: { card: 'summary', title, description },
  }
}

export default async function ActorPage({ params }: Props) {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: actor.name,
    url: actor.website,
    description: `${actor.name} - ${actor.settlement_status}. MEI: ${actor.scores.MEI}, MLI: ${actor.scores.MLI}.`,
    identifier: actor.id,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1200px] mx-auto animate-in">
        {/* Header */}
        <Link href="/actors" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
          ← Entities
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 border border-zinc-800">{actor.layer}</span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 border border-zinc-800">{actor.sector}</span>
        </div>

        <h1 className="text-5xl md:text-6xl text-white font-medium uppercase tracking-tight mb-8">
          {actor.name}
        </h1>

        {/* STATE BLOCK */}
        <div className="border border-white/20 bg-zinc-900/30 p-8 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/10">
            State Block
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 font-mono">
            {/* Status */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">Status</div>
              <div className={`text-2xl font-bold ${
                actor.settlement_status === 'SETTLED' ? 'text-emerald-400' :
                actor.settlement_status === 'PARTIAL' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {actor.settlement_status}
              </div>
            </div>

            {/* MEI */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">MEI</div>
              <div className={`text-2xl ${actor.scores.MEI > 150 ? 'text-red-500' : 'text-white'}`}>
                {actor.scores.MEI}
              </div>
            </div>

            {/* ΔMEI_24h */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">ΔMEI_24h</div>
              <div className="text-2xl text-red-400">
                +{actor.scores.ΔMEI_24h || 0}
              </div>
            </div>

            {/* MLI */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">MLI</div>
              <div className="text-2xl text-white">
                {actor.scores.MLI}
              </div>
            </div>

            {/* ΔMLI_24h */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">ΔMLI_24h</div>
              <div className="text-2xl text-zinc-400">
                {actor.scores.ΔMLI_24h || 0}
              </div>
            </div>

            {/* Cash_State */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">Cash_State</div>
              <div className={`text-2xl ${
                actor.cash_state === 'cleared' ? 'text-emerald-400' :
                actor.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {actor.cash_state}
              </div>
            </div>

            {/* Cycle_ID */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">Cycle_ID</div>
              <div className="text-lg text-zinc-300">
                {actor.cycle_id}
              </div>
            </div>

            {/* Last_Update */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase mb-2">Last_Update</div>
              <div className="text-lg text-zinc-400">
                {actor.timestamp}
              </div>
            </div>
          </div>
        </div>

        {/* Primitives */}
        <div className="border border-white/10 bg-zinc-900/20 p-6 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Settlement Primitives
          </div>
          <div className="grid grid-cols-5 gap-2 font-mono text-sm">
            {Object.entries(actor.primitives).map(([key, data]) => (
              <div key={key} className={`p-3 border text-center ${
                data.score >= 3 ? 'border-emerald-900/50 bg-emerald-950/20' :
                data.score >= 1 ? 'border-yellow-900/50 bg-yellow-950/20' :
                'border-red-900/50 bg-red-950/20'
              }`}>
                <div className={`font-bold ${
                  data.score >= 3 ? 'text-emerald-400' :
                  data.score >= 1 ? 'text-yellow-400' : 'text-red-400'
                }`}>{key.replace('_', '-')}</div>
                <div className="text-zinc-500 text-xs mt-1">{data.score}/4</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href={`/invoices?actor=${actor.id}`}
            className="btn-primary"
          >
            Generate Invoice
          </Link>
          <Link
            href={`/notices?actor=${actor.id}`}
            className="btn-secondary"
          >
            Open Notice
          </Link>
        </div>

        {/* Actor Info */}
        <div className="mt-12 pt-8 border-t border-white/10 font-mono text-xs text-zinc-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] uppercase mb-1">Actor_ID</div>
              <div className="text-zinc-300">{actor.id}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-1">HQ</div>
              <div className="text-zinc-300">{actor.headquarters_country}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-1">Website</div>
              <a href={actor.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                {actor.website.replace('https://', '')}
              </a>
            </div>
            <div>
              <div className="text-[10px] uppercase mb-1">Basis</div>
              <div className="text-zinc-300">{actor.basis}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
