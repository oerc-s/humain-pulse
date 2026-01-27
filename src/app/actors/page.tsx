import Link from 'next/link'
import { getActorsBySector } from '@/lib/clearing/engine'
import type { State, Sector } from '@/lib/clearing/types'

function StateBadge({ state }: { state: State }) {
  const styles = {
    'Non-Clearable': 'text-red-500 border-red-900 bg-red-950/20',
    'Clearable': 'text-yellow-500 border-yellow-900 bg-yellow-950/20',
    'Settled': 'text-emerald-500 border-emerald-900 bg-emerald-950/20',
  }

  return (
    <span className={`inline-flex px-2 py-1 text-[10px] font-mono uppercase tracking-wider border ${styles[state]}`}>
      {state}
    </span>
  )
}

const SECTOR_LABELS: Record<Sector, string> = {
  REINSURANCE: 'Reinsurance',
  AI_LABS: 'AI Labs',
  CLOUD: 'Cloud',
  ROBOTICS: 'Robotics / Actuation',
}

const SECTOR_ORDER: Sector[] = ['REINSURANCE', 'AI_LABS', 'CLOUD', 'ROBOTICS']

export default function ActorsPage() {
  const bySector = getActorsBySector()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-4">
          Actors
        </h1>

        <p className="font-mono text-xs text-zinc-600 mb-12">
          Placement degrades mechanically. This is an accounting state.
        </p>

        {SECTOR_ORDER.map((sector) => {
          const actors = bySector[sector] || []
          if (actors.length === 0) return null

          return (
            <div key={sector} className="mb-12">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                {SECTOR_LABELS[sector]}
              </h2>

              <div className="grid gap-3">
                {actors.map((actor) => (
                  <Link
                    key={actor.slug}
                    href={`/actors/${actor.slug}`}
                    className="flex items-center justify-between p-4 border border-white/5 hover:border-white/20 transition-colors bg-zinc-900/20"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-white">{actor.actor_name}</span>
                      <StateBadge state={actor.state} />
                    </div>
                    <div className="flex items-center gap-6 font-mono text-sm">
                      <div>
                        <span className="text-zinc-500 text-xs mr-2">MEI</span>
                        <span className="text-white">{actor.MEI}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-xs mr-2">MLI</span>
                        <span className="text-zinc-400">{actor.MLI}</span>
                      </div>
                      <div className={actor.delta_24h > 0 ? 'text-red-400' : actor.delta_24h < 0 ? 'text-emerald-400' : 'text-zinc-500'}>
                        {actor.delta_24h > 0 ? '+' : ''}{actor.delta_24h}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  )
}
