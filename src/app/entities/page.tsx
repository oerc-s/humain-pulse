import Link from 'next/link'
import { getLeagueTable } from '@/lib/clearing/engine'
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

export default function EntitiesPage() {
  const actors = getLeagueTable()
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase">
            Exposure League Table
          </h1>
          <span className="font-mono text-[10px] text-zinc-500">{today}</span>
        </div>

        <p className="font-mono text-[10px] text-zinc-500 mb-6">
          MEI / MLI / Δ24h · Scale 0–1000 · LOW (0–300) · ELEVATED (301–600) · CRITICAL (601–1000)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                <th className="py-3 pr-4">Actor</th>
                <th className="py-3 pr-4">Sector</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-2 text-right">MEI</th>
                <th className="py-3 pr-4 text-right">Band</th>
                <th className="py-3 pr-2 text-right">MLI</th>
                <th className="py-3 pr-4 text-right">Band</th>
                <th className="py-3 pr-2 text-right">ΔMEI</th>
                <th className="py-3 pr-4 text-right">ΔMLI</th>
                <th className="py-3 text-center">MID</th>
                <th className="py-3 text-center">EI</th>
                <th className="py-3 text-center">M2M-SE</th>
                <th className="py-3 text-center">LCH</th>
                <th className="py-3 text-center">CSD</th>
              </tr>
            </thead>
            <tbody>
              {actors.map((a) => (
                <tr key={a.slug} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/entities/${a.slug}`} className="text-white hover:text-emerald-400 transition-colors text-sm">
                      {a.actor_name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[10px] text-zinc-400">{a.sector.replace('_', ' ')}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex px-2 py-1 text-[9px] font-mono uppercase tracking-wider border ${STATE_STYLE[a.state]}`}>
                      {a.state}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right font-mono text-sm text-white">{a.MEI}</td>
                  <td className="py-3 pr-4 text-right font-mono text-[9px] text-zinc-500">{a.mei_band}</td>
                  <td className="py-3 pr-2 text-right font-mono text-sm text-zinc-400">{a.MLI}</td>
                  <td className="py-3 pr-4 text-right font-mono text-[9px] text-zinc-500">{a.mli_band}</td>
                  <td className={`py-3 pr-2 text-right font-mono text-sm ${a.dMEI_24h > 0 ? 'text-red-400' : a.dMEI_24h < 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {a.dMEI_24h > 0 ? '+' : ''}{a.dMEI_24h}
                  </td>
                  <td className={`py-3 pr-4 text-right font-mono text-sm ${a.dMLI_24h > 0 ? 'text-red-400' : a.dMLI_24h < 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {a.dMLI_24h > 0 ? '+' : ''}{a.dMLI_24h}
                  </td>
                  <td className="py-3 text-center font-mono text-sm">{a.primitives.MID ? '✓' : '✗'}</td>
                  <td className="py-3 text-center font-mono text-sm">{a.primitives.EI ? '✓' : '✗'}</td>
                  <td className="py-3 text-center font-mono text-sm">{a.primitives.M2M_SE ? '✓' : '✗'}</td>
                  <td className="py-3 text-center font-mono text-sm">{a.primitives.LCH ? '✓' : '✗'}</td>
                  <td className="py-3 text-center font-mono text-sm">{a.primitives.CSD ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
