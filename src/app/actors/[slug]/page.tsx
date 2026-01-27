import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getActorBySlug, computeAllActors } from '@/lib/clearing/engine'
import type { State } from '@/lib/clearing/types'

function StateBadge({ state }: { state: State }) {
  const styles = {
    'Non-Clearable': 'text-red-500 border-red-900 bg-red-950/20',
    'Clearable': 'text-yellow-500 border-yellow-900 bg-yellow-950/20',
    'Settled': 'text-emerald-500 border-emerald-900 bg-emerald-950/20',
  }

  return (
    <span className={`inline-flex px-3 py-2 text-xs font-mono uppercase tracking-wider border ${styles[state]}`}>
      {state}
    </span>
  )
}

function PrimitiveBadge({ name, active }: { name: string; active: boolean }) {
  return (
    <div className={`px-3 py-2 border font-mono text-xs ${
      active
        ? 'border-emerald-900 bg-emerald-950/20 text-emerald-400'
        : 'border-red-900 bg-red-950/20 text-red-400'
    }`}>
      <span className="text-zinc-500 mr-2">{name}</span>
      <span>{active ? 'TRUE' : 'FALSE'}</span>
    </div>
  )
}

export function generateStaticParams() {
  const actors = computeAllActors()
  return actors.map((actor) => ({
    slug: actor.slug,
  }))
}

export default function ActorPage({ params }: { params: { slug: string } }) {
  const actor = getActorBySlug(params.slug)

  if (!actor) {
    notFound()
  }

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[700px] mx-auto">

        <Link href="/actors" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors mb-6 inline-block">
          ← Actors
        </Link>

        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-2">
          {actor.actor_name}
        </h1>

        <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-8">
          {actor.sector.replace('_', ' ')}
        </p>

        {/* State + Indices */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <StateBadge state={actor.state} />
          <div>
            <span className="font-mono text-3xl text-white">{actor.MEI}</span>
            <span className="font-mono text-xs text-zinc-500 ml-2">MEI</span>
          </div>
          <div>
            <span className="font-mono text-2xl text-zinc-400">{actor.MLI}</span>
            <span className="font-mono text-xs text-zinc-500 ml-2">MLI</span>
          </div>
          <div className={`font-mono text-lg ${
            actor.delta_24h > 0 ? 'text-red-400' : actor.delta_24h < 0 ? 'text-emerald-400' : 'text-zinc-500'
          }`}>
            {actor.delta_24h > 0 ? '+' : ''}{actor.delta_24h}
            <span className="text-xs text-zinc-500 ml-1">Δ24h</span>
          </div>
        </div>

        {/* Primitives */}
        <div className="border border-white/10 p-6 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Primitives (HP-STD-001)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PrimitiveBadge name="MID" active={actor.primitives.MID} />
            <PrimitiveBadge name="M2M-SE" active={actor.primitives.M2M_SE} />
            <PrimitiveBadge name="LCH" active={actor.primitives.LCH} />
            <PrimitiveBadge name="CSD" active={actor.primitives.CSD} />
          </div>
        </div>

        {/* Subscores */}
        <div className="border border-white/10 p-6 mb-8">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
            Subscores
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="font-mono text-[10px] text-zinc-500">A (Autonomy)</div>
              <div className="font-mono text-lg text-white">{actor.subscores.A}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-zinc-500">S (Systemic)</div>
              <div className="font-mono text-lg text-white">{actor.subscores.S}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-zinc-500">L (Loss Surface)</div>
              <div className="font-mono text-lg text-white">{actor.subscores.L}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-zinc-500">P (Primitive Gap)</div>
              <div className="font-mono text-lg text-white">{actor.subscores.P}</div>
            </div>
          </div>
        </div>

        {/* Proofs */}
        {actor.proofs.length > 0 && (
          <div className="border border-white/10 p-6 mb-8">
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">
              Proofs
            </div>
            <div className="space-y-2">
              {actor.proofs.map((proof, i) => (
                <a
                  key={i}
                  href={proof.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="text-white text-sm">{proof.title}</div>
                  <div className="font-mono text-[10px] text-zinc-500">
                    {proof.source_type} · {proof.date}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Accounting note */}
        <div className="border border-white/5 p-4 mb-8 bg-zinc-900/10">
          <p className="font-mono text-xs text-zinc-600">
            Status changes only on attestation.
          </p>
        </div>

        {/* Timestamp */}
        <div className="font-mono text-[10px] text-zinc-600">
          Last update: {actor.last_updated_utc}
        </div>
      </div>
    </div>
  )
}
