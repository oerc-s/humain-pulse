import Link from 'next/link'
import { computeAllActors } from '@/lib/clearing/engine'
import type { Sector, State } from '@/lib/clearing/types'

const STATE_STYLE: Record<State, string> = {
  UNSETTLED: 'text-red-500',
  PARTIAL: 'text-yellow-500',
  SETTLED: 'text-emerald-500',
  OBSERVED: 'text-blue-400',
}

const SECTORS: {
  name: string
  id: Sector
  weights: string
  autonomy: number
  systemic: number
  loss: number
  chokepoints: string
  lossProfile: string
}[] = [
  {
    name: 'Reinsurance',
    id: 'REINSURANCE',
    weights: 'wA=0.10 wS=0.40 wL=0.35 wP=0.15',
    autonomy: 0.40,
    systemic: 0.85,
    loss: 0.80,
    chokepoints: 'Missing M2M-SE and LCH causes UNSETTLED. High systemic concentration amplifies MEI.',
    lossProfile: 'Reinsurance concentrates tail risk from autonomous systems across the entire insurance chain. When machine-generated losses exceed reserve models, the capital shortfall cascades from primary insurers to retrocession layers. No settlement primitive exists today to clear machine-originated claims at the speed they accumulate.',
  },
  {
    name: 'AI Labs',
    id: 'AI_LABS',
    weights: 'wA=0.35 wS=0.35 wL=0.20 wP=0.10',
    autonomy: 1.00,
    systemic: 0.65,
    loss: 0.60,
    chokepoints: 'Full autonomy (1.0). Missing MID and EI causes UNSETTLED. Autonomy weight dominates MEI.',
    lossProfile: 'AI Labs operate fully autonomous systems (autonomy 1.0) whose outputs generate liability before any human review occurs. Losses originate from model decisions — hallucinations, misalignment, unauthorized actions — that produce downstream financial exposure. Without Machine Identity Declaration, no counterparty can attribute liability to source.',
  },
  {
    name: 'Cloud',
    id: 'CLOUD',
    weights: 'wA=0.20 wS=0.40 wL=0.30 wP=0.10',
    autonomy: 0.70,
    systemic: 0.90,
    loss: 0.70,
    chokepoints: 'Highest systemic concentration (0.90). Missing LCH causes UNSETTLED. Concentration dominates MEI.',
    lossProfile: 'Cloud infrastructure concentrates compute for the majority of autonomous systems globally (systemic 0.90). A single availability zone failure or policy change propagates loss across every dependent AI workload simultaneously. The concentration of machine-native operations on three providers creates a settlement bottleneck with no clearing alternative.',
  },
  {
    name: 'Robotics / Actuation',
    id: 'ROBOTICS',
    weights: 'wA=0.35 wS=0.30 wL=0.25 wP=0.10',
    autonomy: 1.00,
    systemic: 0.55,
    loss: 0.95,
    chokepoints: 'Highest loss surface (0.95). Full autonomy (1.0). Missing CSD causes UNSETTLED.',
    lossProfile: 'Robotics carries the highest loss surface (0.95) because autonomous physical systems produce bodily injury, property damage, and operational shutdown — loss categories that compound in real-time. Full autonomy (1.0) means losses begin before any override is possible. Without Conformance State Declaration, no clearing cycle can settle physical-world liability.',
  },
]

export default function SectorsPage() {
  const allActors = computeAllActors()

  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-8">
          Sector Scoring Profiles
        </h1>

        <div className="space-y-10">
          {SECTORS.map((s) => {
            const sectorActors = allActors.filter((a) => a.sector === s.id)
            return (
              <div key={s.id} className="border border-white/10 p-6">
                <h2 className="text-white font-medium uppercase mb-4">{s.name}</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500">Autonomy</div>
                    <div className="font-mono text-lg text-white">{s.autonomy}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500">Systemic</div>
                    <div className="font-mono text-lg text-white">{s.systemic}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500">Loss Surface</div>
                    <div className="font-mono text-lg text-white">{s.loss}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500">Weights</div>
                    <div className="font-mono text-xs text-zinc-400">{s.weights}</div>
                  </div>
                </div>

                <div className="font-mono text-xs text-zinc-500 mb-6">{s.chokepoints}</div>

                <div className="border-t border-white/5 pt-4 mb-6">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Systemic Loss Profile</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.lossProfile}</p>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Actors</div>
                  <div className="space-y-2">
                    {sectorActors.map((a) => (
                      <div key={a.slug} className="flex items-center gap-4 font-mono text-sm">
                        <Link href={`/entities/${a.slug}`} className="text-white hover:text-emerald-400 transition-colors w-44 shrink-0 truncate">
                          {a.actor_name}
                        </Link>
                        <span className={`text-[9px] uppercase w-20 shrink-0 ${STATE_STYLE[a.state]}`}>{a.state}</span>
                        <span className="text-zinc-500 text-xs">MEI {a.MEI}</span>
                        <span className="text-zinc-600 text-xs">{a.mei_band}</span>
                        <span className="text-zinc-500 text-xs">MLI {a.MLI}</span>
                        <span className="text-zinc-600 text-xs">{a.mli_band}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  )
}
