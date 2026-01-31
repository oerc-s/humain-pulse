import Link from 'next/link'
import { getRegistry } from '@/lib/clearing/engine'
import type { State } from '@/lib/clearing/types'

const STATE_COLOR: Record<State, string> = {
  'Non-Clearable': 'text-red-500',
  'Clearable': 'text-yellow-500',
  'Settled': 'text-emerald-500',
}

export default function RegistryPage() {
  const actors = getRegistry()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-2">
          Public Registry
        </h1>
        <p className="font-mono text-[10px] text-zinc-500 mb-6">
          Deterministic indices · Scale 0–100 · Single source of truth
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                <th className="py-3 pr-4">Actor</th>
                <th className="py-3 pr-4">Sector</th>
                <th className="py-3 pr-4">State</th>
                <th className="py-3 pr-2 text-right">MEI</th>
                <th className="py-3 pr-2 text-right">MLI</th>
                <th className="py-3 pr-2 text-right">Exposure</th>
                <th className="py-3 pr-2 text-right">Δ24h</th>
                <th className="py-3 pr-4">Proof_Handle</th>
                <th className="py-3 text-right">As_of</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((a) => (
                <tr key={a.slug} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/entities/${a.slug}`} className="text-white hover:text-emerald-400 transition-colors text-sm">
                      {a.actor_name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-zinc-400">{a.sector.replace('_', ' ')}</td>
                  <td className={`py-3 pr-4 font-mono text-[10px] uppercase ${STATE_COLOR[a.state]}`}>{a.state}</td>
                  <td className="py-3 pr-2 text-right font-mono text-sm text-zinc-400">{a.MEI}</td>
                  <td className="py-3 pr-2 text-right font-mono text-sm text-zinc-400">{a.MLI}</td>
                  <td className="py-3 pr-2 text-right font-mono text-sm text-white font-medium">{a.exposure}</td>
                  <td className={`py-3 pr-2 text-right font-mono text-sm ${a.d24h > 0 ? 'text-red-400' : 'text-zinc-600'}`}>
                    +{a.d24h}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-zinc-600">{a.proof_handle}</td>
                  <td className="py-3 text-right font-mono text-[10px] text-zinc-600 whitespace-nowrap">{a.as_of}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
