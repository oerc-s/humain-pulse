import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sector Profiles | Market Coverage',
  description: 'Sector weights and chokepoints across Capital, Compute, Intelligence, and Actuation layers.',
}

const sectors = [
  {
    layer: 'Capital',
    items: [
      { name: 'Reinsurance', weight: 1.0, chokepoint: 'MID + M2M-SE missing → Non-Clearable' },
      { name: 'Brokers', weight: 0.8, chokepoint: 'M2M-SE missing → Clearable (proxy)' },
      { name: 'Ratings', weight: 0.6, chokepoint: 'EI missing → Clearable (proxy)' },
      { name: 'ILS / Capital Markets', weight: 0.9, chokepoint: 'LCH missing → Clearable (proxy)' },
      { name: 'Funds / Allocators', weight: 0.7, chokepoint: 'EI missing → Clearable (proxy)' },
    ]
  },
  {
    layer: 'Compute',
    items: [
      { name: 'Cloud Providers', weight: 1.0, chokepoint: 'MID + M2M-SE missing → Non-Clearable' },
      { name: 'Integrators', weight: 0.7, chokepoint: 'CSD missing → Clearable (proxy)' },
    ]
  },
  {
    layer: 'Intelligence',
    items: [
      { name: 'AI Labs', weight: 1.0, chokepoint: 'MID + M2M-SE missing → Non-Clearable' },
      { name: 'Auditors', weight: 0.6, chokepoint: 'LCH missing → Clearable (proxy)' },
    ]
  },
  {
    layer: 'Actuation',
    items: [
      { name: 'Robotics', weight: 1.0, chokepoint: 'MID + CSD missing → Non-Clearable' },
    ]
  },
]

export default function SectorsPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">
        Sector Profiles
      </h1>
      <p className="text-zinc-500 font-mono text-sm mb-8">
        Market coverage across four layers. Weights and chokepoints per sector.
      </p>

      <div className="space-y-8">
        {sectors.map(({ layer, items }) => (
          <div key={layer} className="border border-white/10 bg-zinc-900/20">
            <div className="p-4 border-b border-white/10 bg-zinc-900/30">
              <span className="text-white font-mono font-bold uppercase">{layer}</span>
            </div>
            <div className="divide-y divide-white/10">
              {items.map((sector) => (
                <div key={sector.name} className="p-4 grid grid-cols-3 gap-4 font-mono text-sm">
                  <div className="text-white">{sector.name}</div>
                  <div className="text-zinc-400">Weight: {sector.weight}</div>
                  <div className="text-red-400 text-xs">{sector.chokepoint}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        HP-STD-001 v1.10
      </div>
    </div>
  )
}
