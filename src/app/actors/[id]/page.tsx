import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActorById, ACTORS } from '@/lib/data'
import { SECTOR_ALPHA } from '@/lib/scoring'
import { checkClearance, CHOKE_POINTS } from '@/lib/choke-points'
import { ActorClientActions } from './ActorClientActions'

interface Props {
  params: Promise<{ id: string }>
}

// Generate static paths for all actors
export async function generateStaticParams() {
  return ACTORS.map((actor) => ({
    id: actor.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    return { title: 'Actor Not Found' }
  }

  const status = actor.status === 'CONFORMING' ? 'SETTLED' :
                 actor.status === 'PARTIALLY_CONFORMING' ? 'PARTIAL' : 'UNSETTLED'

  const title = `${actor.name} — ${status} | Clearing State`
  const description = `${actor.name} clearing state. Status: ${status}. MEI: ${actor.scores.MEI}/200. MLI: ${actor.scores.MLI}/100. Sector: ${actor.sector}. HQ: ${actor.headquarters_country}.`

  return {
    title,
    description,
    keywords: [
      actor.name,
      `${actor.name} clearing`,
      `${actor.name} exposure`,
      `${actor.name} ${actor.sector}`,
      actor.sector,
      actor.layer,
      status,
      'machine exposure',
      'clearing state',
      'HP-STD-001'
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://humain-pulse.com/actors/${actor.id}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    other: {
      'geo.region': actor.headquarters_country,
      'geo.placename': actor.headquarters_country,
    }
  }
}

export default async function ActorPage({ params }: Props) {
  const { id } = await params
  const actor = getActorById(id)

  if (!actor) {
    notFound()
  }

  const isConforming = actor.status === 'CONFORMING'
  const isPartial = actor.status === 'PARTIALLY_CONFORMING'
  const clearance = checkClearance(actor.id, actor.layer, actor.primitives)
  const chokePoint = CHOKE_POINTS[actor.layer]

  const getPrimitiveStatusClass = (score: number) => {
    if (score === 4) return 'text-emerald-500 border-emerald-900 bg-emerald-950/20'
    if (score === 3) return 'text-yellow-500 border-yellow-900 bg-yellow-950/20'
    return 'text-red-500 border-red-900 bg-red-950/20'
  }

  const statusDisplay = isConforming ? 'SETTLED' : isPartial ? 'PARTIAL' : 'UNSETTLED'

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: actor.name,
    url: actor.website,
    description: `${actor.name} - ${actor.layer} / ${actor.sector}. Clearing status: ${statusDisplay}. MEI: ${actor.scores.MEI}, MLI: ${actor.scores.MLI}.`,
    identifier: actor.id,
    areaServed: actor.headquarters_country,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-white/10 pb-8 gap-8">
          <div>
            <Link href="/actors" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
              ← Entities
            </Link>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 py-1 border border-zinc-800">{actor.layer}</span>
              <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                isConforming ? 'bg-emerald-900/50 text-emerald-400' :
                isPartial ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {statusDisplay}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl text-white font-medium uppercase tracking-tight mb-2 leading-none">
              {actor.name}
            </h1>
            <div className="font-mono text-xs text-zinc-500 uppercase mt-4">
              {actor.sector} · {actor.headquarters_country} · {actor.last_review_date}
            </div>
          </div>

          {/* EXPOSURE DISPLAY */}
          <div className={`p-6 border min-w-[280px] ${actor.debt.active ? 'border-red-500 bg-red-950/10' : 'border-zinc-800 bg-zinc-900/20'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Exposure Accrual</div>
            <div className={`text-4xl font-mono ${actor.debt.active ? 'text-red-500' : 'text-zinc-500'}`}>
              {actor.debt.units_today} <span className="text-sm">U/day</span>
            </div>
            <div className="text-xl font-mono text-zinc-400 mt-2">
              {actor.debt.units_total.toLocaleString()} <span className="text-xs">total</span>
            </div>
            {actor.debt.active && (
              <div className="text-[10px] text-zinc-500 mt-3 font-mono border-t border-red-900/30 pt-2">
                α({actor.layer}) = {SECTOR_ALPHA[actor.layer] || 1.0}
              </div>
            )}
          </div>
        </div>

        {/* CLEARING BLOCKED */}
        {clearance.status === 'BLOCKED' && chokePoint && (
          <div className="mb-12 p-6 border border-red-500 bg-red-950/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">Clearing Unavailable</div>
                <div className="text-white font-bold text-lg uppercase">{chokePoint.choke_point}</div>
              </div>
              <div className="px-4 py-2 bg-red-900 text-red-400 font-mono text-sm font-bold">
                BLOCKED
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Missing</div>
                <div className="flex gap-2 flex-wrap">
                  {clearance.blocking_primitives.map(p => (
                    <span key={p} className="px-2 py-1 bg-red-900/50 text-red-400 text-xs">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Blocked</div>
                <div className="text-zinc-300">{chokePoint.blocked_flow}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase mb-1">State</div>
                <div className="text-red-400">Exposure accrues</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COL */}
          <div className="lg:col-span-8 space-y-12">

            {/* SCORES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-zinc-800 bg-zinc-900/20 p-6">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">MLI</span>
                  <span className="font-mono text-3xl text-white">
                    {actor.scores.MLI}<span className="text-zinc-600 text-lg">/100</span>
                  </span>
                </div>
                <div className="h-2 bg-zinc-800">
                  <div
                    className={`h-full ${actor.scores.MLI >= 80 ? 'bg-emerald-500' : actor.scores.MLI >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${actor.scores.MLI}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-600 font-mono mt-2">Clearing capacity</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/20 p-6">
                <div className="flex justify-between items-end mb-4">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">MEI</span>
                  <span className="font-mono text-3xl text-white">
                    {actor.scores.MEI}<span className="text-zinc-600 text-lg">/200</span>
                  </span>
                </div>
                <div className="h-2 bg-zinc-800">
                  <div
                    className={`h-full ${actor.scores.MEI > 150 ? 'bg-red-500' : actor.scores.MEI > 100 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(actor.scores.MEI / 200) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-600 font-mono mt-2">Exposure pressure</div>
              </div>
            </div>

            {/* BLOCKS */}
            <div className="p-4 border-l-4 border-red-500 bg-red-950/10">
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">Blocks</div>
              <div className="text-sm font-mono text-zinc-300">
                {actor.layer === 'Capital' && 'Capital allocation for machine/AGI risk underwriting'}
                {actor.layer === 'Compute' && 'Downstream liability transfer from regulated workloads'}
                {actor.layer === 'Intelligence' && 'Enterprise indemnification and runtime liability acceptance'}
                {actor.layer === 'Actuation' && 'Physical deployment authorization and fleet insurance placement'}
              </div>
            </div>

            {/* PRIMITIVES */}
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Clearing Primitives
              </h2>
              <div className="space-y-3">
                {Object.entries(actor.primitives).map(([key, data]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-zinc-800">
                    <div className="flex items-center gap-4">
                      <span className="text-white font-mono font-bold w-16">{key.replace('_', '-')}</span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                        data.score === 4 ? 'bg-emerald-900/50 text-emerald-400' :
                        data.score >= 2 ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {data.score === 4 ? 'PRESENT' : data.score >= 2 ? 'PARTIAL' : 'ABSENT'}
                      </span>
                    </div>
                    <span className="font-mono text-zinc-500 text-sm">{data.score}/4</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NOTICES */}
            {actor.notices.length > 0 && (
              <div>
                <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                  Clearing Notices
                </h2>
                <div className="space-y-4">
                  {actor.notices.map(n => (
                    <div key={n.id} className="border border-zinc-800 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                          n.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                          n.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {n.severity}
                        </span>
                        <span className="text-zinc-600 font-mono text-xs">{n.date}</span>
                      </div>
                      <div className="text-white font-bold mb-1">{n.title}</div>
                      <div className="text-zinc-400 text-sm font-mono">{n.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL */}
          <div className="lg:col-span-4 space-y-6">

            {/* MEI FACTORS */}
            <div className="border border-zinc-800 bg-zinc-900/20 p-6">
              <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">MEI Factors</div>
              <div className="space-y-2 font-mono text-xs">
                {Object.entries(actor.mei_factors).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-zinc-400">{key}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800">
                        <div
                          className={`h-full ${Number(value) >= 4 ? 'bg-red-500' : Number(value) >= 3 ? 'bg-yellow-500' : 'bg-zinc-500'}`}
                          style={{ width: `${(Number(value) / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-white w-4 text-right">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INFO */}
            <div className="border border-zinc-800 bg-zinc-900/20 p-6">
              <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Actor Info</div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Website</span>
                  <a href={actor.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                    {actor.website.replace('https://', '')}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">HQ</span>
                  <span className="text-white">{actor.headquarters_country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Days Unsettled</span>
                  <span className="text-red-400">{actor.debt.days_non_conforming}</span>
                </div>
              </div>
            </div>

            {/* DOWNLOAD */}
            <ActorClientActions actor={actor} />
          </div>
        </div>
      </div>
    </>
  )
}
