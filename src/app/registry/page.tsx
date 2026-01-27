import Link from 'next/link'
import { generateRegistry } from '@/lib/clearing/engine'
import type { State } from '@/lib/clearing/types'

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

export default function RegistryPage() {
  const { actors, generated_utc } = generateRegistry()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase">
            Registry
          </h1>
          <span className="font-mono text-[10px] text-zinc-500">
            {new Date(generated_utc).toISOString().split('T')[0]}
          </span>
        </div>

        <p className="font-mono text-xs text-zinc-600 mb-8">
          Losses accumulating. Cash exposure recorded.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                <th className="py-4 pr-4">Actor</th>
                <th className="py-4 pr-4">Sector</th>
                <th className="py-4 pr-4">State</th>
                <th className="py-4 pr-4 text-right">MEI</th>
                <th className="py-4 pr-4 text-right">MLI</th>
                <th className="py-4 text-right">Δ24h</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((actor) => (
                <tr key={actor.slug} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-4">
                    <Link href={`/actors/${actor.slug}`} className="text-white hover:text-emerald-400 transition-colors">
                      {actor.actor_name}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 font-mono text-xs text-zinc-400">
                    {actor.sector.replace('_', ' ')}
                  </td>
                  <td className="py-4 pr-4">
                    <StateBadge state={actor.state} />
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-white">
                    {actor.MEI}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-zinc-400">
                    {actor.MLI}
                  </td>
                  <td className={`py-4 text-right font-mono ${
                    actor.delta_24h > 0 ? 'text-red-400' : actor.delta_24h < 0 ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {actor.delta_24h > 0 ? '+' : ''}{actor.delta_24h}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  )
}
