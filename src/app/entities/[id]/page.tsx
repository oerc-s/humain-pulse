'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getActorById, ACTORS } from '@/lib/data'
import { getStatusLabel } from '@/lib/scoring'

export default function ActorDetailPage() {
  const params = useParams()
  const actorId = params.id as string
  const actor = getActorById(actorId)

  if (!actor) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-white text-xl mb-4 font-mono">ERR_ENTITY_NOT_FOUND</h1>
        <p className="text-zinc-500 mb-6">No actor with ID: {actorId}</p>
        <Link href="/entities" className="text-zinc-500 underline font-mono text-sm">RETURN_INDEX</Link>
      </div>
    )
  }

  const isConforming = actor.status === 'CONFORMING'
  const isPartial = actor.status === 'PARTIALLY_CONFORMING'

  const getPrimitiveStatusClass = (score: number) => {
    if (score === 4) return 'text-emerald-500 border-emerald-900 bg-emerald-950/20'
    if (score === 3) return 'text-yellow-500 border-yellow-900 bg-yellow-950/20'
    return 'text-red-500 border-red-900 bg-red-950/20'
  }

  const handleDownloadJSON = () => {
    const data = JSON.stringify(actor, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${actor.id}-record.json`
    a.click()
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-white/10 pb-8 gap-8">
        <div>
          <Link href="/entities" className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase mb-6 block tracking-widest">
            ← Index
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="badge badge-layer">{actor.layer}</span>
            <span className={`badge ${
              isConforming ? 'badge-conforming' :
              isPartial ? 'badge-partial' :
              'badge-non-conforming'
            }`}>
              {isConforming ? 'SETTLED' :
               isPartial ? 'PARTIALLY SETTLED' :
               'UNSETTLED'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl text-white font-medium uppercase tracking-tight mb-2 leading-none">
            {actor.name}
          </h1>
          <div className="font-mono text-xs text-zinc-500 uppercase mt-4">
            ID: {actor.id} | SECTOR: {actor.sector} | UPDATED: {actor.last_review_date}
          </div>
        </div>

        {/* DEBT DISPLAY */}
        <div className={`p-6 border min-w-[250px] ${actor.debt.active ? 'border-red-500 bg-red-950/10' : 'border-zinc-800 bg-zinc-900/20'}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Exposure Debt</div>
          <div className={`text-4xl font-mono ${actor.debt.active ? 'text-red-500' : 'text-zinc-500'}`}>
            {actor.debt.units_today} <span className="text-sm">/ day</span>
          </div>
          <div className="text-xl font-mono text-zinc-400 mt-2">
            {actor.debt.units_total.toLocaleString()} <span className="text-xs">total</span>
          </div>
          {actor.debt.active && (
            <div className="text-[10px] text-red-400 mt-2 font-mono">
              Accruing daily until remediation.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT MAIN COL */}
        <div className="lg:col-span-8 space-y-16">

          {/* SCORE BARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex justify-between items-end mb-4">
                <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">MLI (Liability)</span>
                <span className="font-mono text-4xl text-white">
                  {actor.scores.MLI}<span className="text-zinc-600 text-lg">/100</span>
                </span>
              </div>
              <div className="score-bar mb-2">
                <div
                  className={`score-fill ${actor.scores.MLI >= 80 ? 'bg-emerald-500' : actor.scores.MLI >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${actor.scores.MLI}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 font-mono">Settlement-grade readiness score</p>
            </div>
            <div className="card">
              <div className="flex justify-between items-end mb-4">
                <span className="font-mono text-sm text-zinc-400 uppercase tracking-widest">MEI (Exposure)</span>
                <span className="font-mono text-4xl text-white">
                  {actor.scores.MEI}<span className="text-zinc-600 text-lg">/200</span>
                </span>
              </div>
              <div className="score-bar mb-2">
                <div
                  className={`score-fill ${actor.scores.MEI > 150 ? 'bg-red-500' : actor.scores.MEI > 100 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(actor.scores.MEI / 200) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 font-mono">Total risk load · Model: {actor.mei_model}</p>
            </div>
          </div>

          {/* Score Context */}
          <div className="text-[10px] font-mono text-zinc-500 -mt-12 mb-8">
            Scores indicate settlement readiness, not intent. Exposure accrues until cleared.
          </div>

          {/* Settlement State Block */}
          <div className="p-4 border border-zinc-800 bg-zinc-900/30 mb-8">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Settlement State — Machine-Native</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-mono">
              <div>
                <div className="text-zinc-500 mb-1">What this blocks:</div>
                <ul className="text-zinc-400 space-y-0.5">
                  <li>• Broker placement for machine / AGI risk</li>
                  <li>• Capital backing (reinsurance, ILS, retro)</li>
                  <li>• Audit and rating normalization</li>
                  <li>• Autonomous risk underwriting</li>
                </ul>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">What accrues:</div>
                <ul className="text-zinc-400 space-y-0.5">
                  <li>• Daily Machine Exposure Units (MEU)</li>
                  <li>• Public exposure reference used by brokers, auditors, allocators</li>
                </ul>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">What normalizes the status:</div>
                <ul className="text-zinc-400 space-y-0.5">
                  <li>• Public MID (Machine Identity)</li>
                  <li>• Public EI endpoint (Exposure Index)</li>
                  <li>• Reachable M2M-SE (Settlement Endpoint)</li>
                  <li>• Published LCH (Liability Chain Hash)</li>
                  <li>• Published CSD (Control Surface Definition)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PRIMITIVES CHECKLIST */}
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
              <h3 className="font-mono text-sm uppercase tracking-widest text-white">HP-STD-001 Conformance Checklist</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(actor.primitives).map(([key, data]) => (
                <div key={key} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-white/5 pb-4 items-center">
                  <div className="md:col-span-2 text-white font-mono font-bold">{key.replace('_', '-')}</div>
                  <div className="md:col-span-3">
                    <span className={`badge ${getPrimitiveStatusClass(data.score)}`}>
                      {data.score >= 3 ? 'YES' : 'NO'} / {data.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-center font-mono text-zinc-500">
                    {data.score}/4
                  </div>
                  <div className="md:col-span-5 text-right">
                    {data.endpoint ? (
                      <code className="text-[10px] text-emerald-500 bg-emerald-950/10 px-2 py-1 border border-emerald-900/30">
                        {data.endpoint}
                      </code>
                    ) : (
                      <span className="text-zinc-700 font-mono text-[10px] uppercase">No Endpoint Detected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REMEDIATION PATH */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
              Remediation Path
            </h3>
            <div className="space-y-3">
              {[
                { step: 1, action: 'Publish MID', desc: 'Machine Identity endpoint with cryptographic verification' },
                { step: 2, action: 'Publish EI endpoint', desc: 'Exposure Index with timestamped data feed' },
                { step: 3, action: 'Publish M2M-SE', desc: 'Machine-to-Machine Settlement Endpoint (reachable)' },
                { step: 4, action: 'Publish LCH hash', desc: 'Liability Chain Hash with Merkle proof' },
                { step: 5, action: 'Publish CSD', desc: 'Control Surface Declaration (stop/disable endpoints)' }
              ].map((item) => {
                const primKey = ['MID', 'EI', 'M2M_SE', 'LCH', 'CSD'][item.step - 1]
                const prim = actor.primitives[primKey as keyof typeof actor.primitives]
                const done = prim.score >= 4
                return (
                  <div key={item.step} className={`flex gap-4 p-4 border ${done ? 'border-emerald-900/30 bg-emerald-950/10' : 'border-zinc-800'}`}>
                    <div className={`w-8 h-8 flex items-center justify-center font-mono text-sm ${done ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {done ? '✓' : item.step}
                    </div>
                    <div className="flex-1">
                      <div className={`font-mono text-sm ${done ? 'text-emerald-400' : 'text-white'}`}>{item.action}</div>
                      <div className="text-xs text-zinc-500 mt-1">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* NOTICES TIMELINE */}
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-2">
              Public Notices Timeline
            </h3>
            {actor.notices.length > 0 ? (
              <div className="space-y-6">
                {actor.notices.map(n => (
                  <div key={n.id} className="border-l-2 border-zinc-700 pl-6 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-zinc-500" />
                    <div className="flex gap-4 items-baseline mb-1">
                      <span className="text-zinc-500 font-mono text-xs">{n.date}</span>
                      <span className={`text-[10px] font-mono uppercase px-1 ${
                        n.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                        n.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {n.severity}
                      </span>
                    </div>
                    <h4 className="text-zinc-300 text-sm font-bold mb-1">{n.title}</h4>
                    <p className="text-zinc-400 text-xs font-mono mb-2">{n.summary}</p>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase">
                      ID: {n.id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-zinc-800 text-zinc-500 font-mono text-sm">
                No active enforcement notices.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL - EVIDENCE & INFO */}
        <div className="lg:col-span-4 space-y-6">

          {/* EVIDENCE LINKS */}
          <div className="card">
            <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Evidence Artifacts</div>
            {actor.evidence.length > 0 ? (
              <ul className="space-y-3">
                {actor.evidence.map((ev) => (
                  <li key={ev.id} className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-zinc-300 font-mono text-xs">{ev.claim_text}</div>
                      <div className="text-[10px] text-zinc-600 mt-1">{ev.primitive} · {ev.tier}</div>
                    </div>
                    <span className="text-[10px] text-zinc-600 border border-zinc-800 px-1 shrink-0">
                      {ev.tier === 'PUBLIC' ? 'PUB' : ev.tier === 'STRONG_PROXY' ? 'STR' : 'WK'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-red-500 font-mono">No explicit public artifacts found.</div>
            )}
          </div>

          {/* MEI FACTORS */}
          <div className="card">
            <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">MEI Factors</div>
            <div className="space-y-2 font-mono text-xs">
              {Object.entries(actor.mei_factors).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-zinc-400">{key.replace(/_/g, ' ')}</span>
                  <span className="text-white">{value}/5</span>
                </div>
              ))}
            </div>
          </div>

          {/* ACTOR INFO */}
          <div className="card">
            <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">Entity Info</div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Website</span>
                <a href={actor.website} target="_blank" rel="noopener" className="text-emerald-500 hover:underline">
                  {actor.website.replace('https://', '')}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">HQ</span>
                <span className="text-white">{actor.headquarters_country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Basis</span>
                <span className="text-white">{actor.basis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Days Unsettled</span>
                <span className="text-red-400">{actor.debt.days_non_conforming}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadJSON}
            className="w-full bg-white text-black py-3 text-[10px] font-mono uppercase tracking-widest hover:bg-zinc-200 transition-colors font-bold"
          >
            Download Full JSON Record
          </button>
        </div>
      </div>
    </div>
  )
}
