import Link from 'next/link'

const SECTORS = [
  {
    name: 'Reinsurance',
    id: 'REINSURANCE',
    weights: 'wA=0.10 wS=0.40 wL=0.35 wP=0.15',
    autonomy: 0.40,
    systemic: 0.85,
    loss: 0.80,
    chokepoints: 'Missing M2M-SE and LCH causes UNSETTLED. High systemic concentration amplifies MEI.',
  },
  {
    name: 'AI Labs',
    id: 'AI_LABS',
    weights: 'wA=0.35 wS=0.35 wL=0.20 wP=0.10',
    autonomy: 1.00,
    systemic: 0.65,
    loss: 0.60,
    chokepoints: 'Full autonomy (1.0). Missing MID and EI causes UNSETTLED. Autonomy weight dominates MEI.',
  },
  {
    name: 'Cloud',
    id: 'CLOUD',
    weights: 'wA=0.20 wS=0.40 wL=0.30 wP=0.10',
    autonomy: 0.70,
    systemic: 0.90,
    loss: 0.70,
    chokepoints: 'Highest systemic concentration (0.90). Missing LCH causes UNSETTLED. Concentration dominates MEI.',
  },
  {
    name: 'Robotics / Actuation',
    id: 'ROBOTICS',
    weights: 'wA=0.35 wS=0.30 wL=0.25 wP=0.10',
    autonomy: 1.00,
    systemic: 0.55,
    loss: 0.95,
    chokepoints: 'Highest loss surface (0.95). Full autonomy (1.0). Missing CSD causes UNSETTLED.',
  },
]

export default function SectorsPage() {
  return (
    <div className="pt-24 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">

        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white uppercase mb-8">
          Sector Scoring Profiles
        </h1>

        <div className="space-y-8">
          {SECTORS.map((s) => (
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

              <div className="font-mono text-xs text-zinc-500">{s.chokepoints}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </div>
    </div>
  )
}
