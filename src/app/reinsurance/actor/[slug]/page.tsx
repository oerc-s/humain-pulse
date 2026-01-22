import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  REINSURANCE_ACTORS,
  getActorBySlug,
  getActorScores,
  getObservedGating,
  PRIMITIVE_BLOCKS,
  STATUS_DEFINITIONS,
  LAST_PUBLISH_DATE
} from '@/lib/reinsurance-data'
import { ActorClient } from './ActorClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return REINSURANCE_ACTORS.map((actor) => ({
    slug: actor.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const actor = getActorBySlug(slug)

  if (!actor) {
    return { title: 'Reinsurer Not Found' }
  }

  const scores = getActorScores(actor)
  const title = `${actor.name} - ${actor.status} | Reinsurance Clearing Readiness`
  const description = `${actor.name} clearing readiness record. MLI: ${scores.mli}/100, MEI: ${scores.mei}/200, EI_ADJ: ${scores.eiAdj}/250. Status: ${actor.status}. HP-STD-001 assessment.`

  return {
    title,
    description,
    keywords: [
      actor.name,
      `${actor.name} reinsurance`,
      `${actor.name} machine risk`,
      'reinsurance clearing readiness',
      'machine risk settlement',
      'HP-STD-001',
      'ASI-STD-001',
      actor.status.toLowerCase()
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://humain-pulse.com/reinsurance/actor/${actor.slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ActorPage({ params }: Props) {
  const { slug } = await params
  const actor = getActorBySlug(slug)

  if (!actor) {
    notFound()
  }

  const scores = getActorScores(actor)
  const gating = getObservedGating(actor.primitives)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CONFORMING': return 'badge-conforming'
      case 'PARTIAL': return 'badge-partial'
      case 'HUMAN-GATED': return 'badge-human-gated'
      case 'UNSETTLED': return 'badge-unsettled'
      case 'NON-CLEARABLE': return 'badge-non-clearable'
      default: return 'badge-non-conforming'
    }
  }

  const getPrimitiveStateClass = (state: string) => {
    switch (state) {
      case 'PUBLISHED': return 'badge-published'
      case 'PARTIAL': return 'badge-partial'
      case 'MISSING': return 'badge-missing'
      default: return 'badge-missing'
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: actor.name,
    url: actor.website,
    description: `${actor.name} - ${actor.layer} entity. Machine-risk clearing status: ${actor.status}. MLI: ${scores.mli}/100, MEI: ${scores.mei}/200.`,
    identifier: actor.slug,
    areaServed: actor.headquarters,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 border-b border-white/10 pb-8 gap-8">
          <div>
            <Link href="/reinsurance/registry" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
              ← Registry
            </Link>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="badge badge-layer">{actor.layer}</span>
              <span className={`badge ${getStatusBadgeClass(actor.status)}`} title={STATUS_DEFINITIONS[actor.status]}>
                {actor.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl text-white font-medium uppercase tracking-tight mb-2">
              {actor.name}
            </h1>
            <div className="font-mono text-xs text-zinc-500 uppercase mt-4">
              HQ: {actor.headquarters} · <a href={actor.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">{actor.website.replace('https://', '')}</a>
            </div>
          </div>

          {/* Drift Display */}
          <div className="p-6 border border-red-500 bg-red-950/10 min-w-[280px]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Exposure Drift</div>
            <div className="text-4xl font-mono text-red-500">
              +{scores.drift} <span className="text-sm">U/day</span>
            </div>
            <div className="text-[10px] text-red-400 mt-2 font-mono">
              Unsettled exposure accrual until primitives are publicly verifiable.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-12">

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0b0d10] border border-white/10 p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">MLI</div>
                <div className="text-3xl font-mono text-white mb-1">
                  {scores.mli}<span className="text-zinc-600 text-lg">/100</span>
                </div>
                <div className="text-xs text-zinc-500">Clearing Readiness</div>
                <div className="h-2 w-full bg-zinc-900 mt-3">
                  <div
                    className={`h-full ${scores.mli >= 75 ? 'bg-emerald-500' : scores.mli >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${scores.mli}%` }}
                  />
                </div>
              </div>
              <div className="bg-[#0b0d10] border border-white/10 p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">MEI</div>
                <div className="text-3xl font-mono text-white mb-1">
                  {scores.mei}<span className="text-zinc-600 text-lg">/200</span>
                </div>
                <div className="text-xs text-zinc-500">Exposure Pressure</div>
                <div className="h-2 w-full bg-zinc-900 mt-3">
                  <div
                    className={`h-full ${scores.mei > 150 ? 'bg-red-500' : scores.mei > 100 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(scores.mei / 200) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-[#0b0d10] border border-white/10 p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">EI_ADJ</div>
                <div className="text-3xl font-mono text-white mb-1">
                  {scores.eiAdj}<span className="text-zinc-600 text-lg">/250</span>
                </div>
                <div className="text-xs text-zinc-500">Adjusted Exposure</div>
                <div className="h-2 w-full bg-zinc-900 mt-3">
                  <div
                    className={`h-full ${scores.eiAdj > 180 ? 'bg-red-500' : scores.eiAdj > 120 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(scores.eiAdj / 250) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Blocking Primitives */}
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Blocking Primitives
              </h2>
              <div className="space-y-4">
                {(Object.entries(actor.primitives) as [string, typeof actor.primitives.MID][]).map(([key, prim]) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-white/5 pb-4 items-start">
                    <div className="md:col-span-2 text-white font-mono font-bold">{key}</div>
                    <div className="md:col-span-2">
                      <span className={`badge ${getPrimitiveStateClass(prim.state)}`}>
                        {prim.state}
                      </span>
                    </div>
                    <div className="md:col-span-4 text-zinc-400 text-sm">
                      {PRIMITIVE_BLOCKS[key]}
                    </div>
                    <div className="md:col-span-4 text-right">
                      {prim.evidence.length > 0 ? (
                        <div className="space-y-1">
                          {prim.evidence.map((ev, i) => (
                            <a
                              key={i}
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[10px] text-emerald-500 hover:underline font-mono"
                            >
                              {ev.label} {ev.type === 'proxy' && <span className="text-zinc-600">(proxy)</span>}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-700 font-mono text-[10px] uppercase">No Evidence</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observed Gating */}
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Observed Gating
              </h2>
              {gating.length > 0 ? (
                <ul className="space-y-2">
                  {gating.map((g, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-red-500 font-mono">×</span>
                      <span className="text-zinc-400 text-sm font-mono">{g}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-emerald-500 font-mono text-sm">
                  No human gating detected. All primitives publicly verifiable.
                </div>
              )}
            </div>

            {/* Active Notices */}
            <div>
              <h2 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
                Active Notices
              </h2>
              {actor.notices.length > 0 ? (
                <div className="space-y-4">
                  {actor.notices.map(n => (
                    <div key={n.id} className={`card border-l-4 ${
                      n.severity === 'CRITICAL' ? 'border-l-red-500 bg-red-950/10' :
                      n.severity === 'HIGH' ? 'border-l-red-500' :
                      'border-l-yellow-500'
                    }`}>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                          n.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                          n.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {n.severity}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">{n.date}</span>
                      </div>
                      <h3 className="text-white font-bold mb-1">{n.title}</h3>
                      <p className="text-zinc-400 text-sm font-mono mb-2">{n.statement}</p>
                      <div className="text-[10px] font-mono text-zinc-600">
                        {n.id} · Trigger: {n.trigger}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-2">
                        Settlement readiness can be updated by publishing verifiable endpoints.
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-zinc-800 text-zinc-500 font-mono text-sm">
                  No active notices.
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* MEI Factors */}
            <div className="p-6 border border-zinc-800 bg-zinc-900/20">
              <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">MEI Factors (0-5 each)</div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">CAP (Capital Weight)</span>
                  <span className="text-white">{actor.factors.CAP}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">PORT (Portfolio Breadth)</span>
                  <span className="text-white">{actor.factors.PORT}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">SPEED (Update Frequency)</span>
                  <span className="text-white">{actor.factors.SPEED}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">DEP (Dependency)</span>
                  <span className="text-white">{actor.factors.DEP}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">GATE (Human Gating)</span>
                  <span className="text-white">{actor.factors.GATE}/5</span>
                </div>
              </div>
            </div>

            {/* Record Info */}
            <div className="p-6 border border-zinc-800 bg-zinc-900/20">
              <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Record Info</div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Last Update</span>
                  <span className="text-white">{LAST_PUBLISH_DATE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Basis</span>
                  <span className="text-white">HP-STD-001 / ASI-STD-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Headquarters</span>
                  <span className="text-white">{actor.headquarters}</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <ActorClient actor={actor} scores={scores} />
          </div>
        </div>
      </div>
    </>
  )
}
