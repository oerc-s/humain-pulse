import type { Metadata } from 'next'
import Link from 'next/link'
import { ACTORS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sectors | HP-STD-001',
  description: 'Machine exposure by sector. Four layers: Capital, Compute, Intelligence, Actuation.',
  keywords: ['sectors', 'HP-STD-001', 'Capital', 'Compute', 'Intelligence', 'Actuation'],
}

const layers = [
  {
    layer: 'Capital',
    sectors: [
      { name: 'Reinsurance', chokepoint: 'MID + M2M-SE', breaks: 'Loss reserves cannot clear without machine identity' },
      { name: 'Brokers', chokepoint: 'MID + M2M-SE', breaks: 'Placement data unverifiable without settlement endpoint' },
      { name: 'Ratings', chokepoint: 'MID + EI', breaks: 'Exposure models fail without machine exposure index' },
      { name: 'ILS / Capital Markets', chokepoint: 'MID + LCH', breaks: 'Tranches unattributable without liability chain' },
      { name: 'Funds / Allocators', chokepoint: 'MID + EI', breaks: 'Portfolio exposure unquantified' },
    ]
  },
  {
    layer: 'Compute',
    sectors: [
      { name: 'Cloud Providers', chokepoint: 'MID + M2M-SE', breaks: 'Workload liability uncleared' },
      { name: 'Integrators', chokepoint: 'MID + CSD', breaks: 'Control surfaces undefined' },
    ]
  },
  {
    layer: 'Intelligence',
    sectors: [
      { name: 'AI Labs', chokepoint: 'MID + M2M-SE', breaks: 'Model deployment exposure uncleared' },
      { name: 'Auditors', chokepoint: 'MID + LCH', breaks: 'Attestation chain broken' },
    ]
  },
  {
    layer: 'Actuation',
    sectors: [
      { name: 'Robotics / Actuation', chokepoint: 'MID + CSD', breaks: 'Physical autonomy uncontrolled' },
    ]
  },
]

export default function SectorsPage() {
  // Count entities per layer
  const layerCounts = {
    Capital: ACTORS.filter(a => a.layer === 'Capital').length,
    Compute: ACTORS.filter(a => a.layer === 'Compute').length,
    Intelligence: ACTORS.filter(a => a.layer === 'Intelligence').length,
    Actuation: ACTORS.filter(a => a.layer === 'Actuation').length,
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">Sectors</h1>
      <p className="text-zinc-500 font-mono text-sm mb-12">
        Four layers. Each sector has a chokepoint. No MID + no M2M-SE = UNSETTLED.
      </p>

      {/* Layers */}
      <div className="space-y-12">
        {layers.map(({ layer, sectors }) => (
          <div key={layer}>
            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl text-white font-medium uppercase">{layer}</h2>
              <span className="text-zinc-500 font-mono text-sm">{layerCounts[layer as keyof typeof layerCounts]} entities</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sectors.map((sector) => (
                <Link
                  key={sector.name}
                  href={`/entities?sector=${encodeURIComponent(sector.name)}`}
                  className="border border-white/10 bg-zinc-900/20 p-6 hover:border-white/30 transition-colors"
                >
                  <div className="text-white font-bold mb-3">{sector.name}</div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500">Chokepoint:</span>
                      <span className="text-zinc-300">{sector.chokepoint}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500">State:</span>
                      <span className="text-zinc-400">UNSETTLED = losses accumulating</span>
                    </div>
                    <div className="text-zinc-500 mt-2">{sector.breaks}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Rule */}
      <div className="border border-white/10 bg-zinc-900/20 p-6 mt-12">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Rule</div>
        <p className="text-red-400 font-mono text-sm">
          No MID + no M2M-SE = UNSETTLED. Losses accumulating.
        </p>
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
