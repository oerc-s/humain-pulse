'use client'

import { useState } from 'react'
import { ACTORS } from '@/lib/data'

export default function ConformancePage() {
  const [selectedId, setSelectedId] = useState(ACTORS[0].id)
  const actor = ACTORS.find(a => a.id === selectedId) || ACTORS[0]

  const requirements = [
    { id: 1, key: 'MID', label: 'MID Present + Verifiable' },
    { id: 2, key: 'EI', label: 'EI Published + Timestamped' },
    { id: 3, key: 'M2M_SE', label: 'M2M-SE Reachable' },
    { id: 4, key: 'LCH', label: 'LCH Hash Published' },
    { id: 5, key: 'CSD', label: 'CSD Published' }
  ]

  const passCount = requirements.filter(r => {
    const prim = actor.primitives[r.key as keyof typeof actor.primitives]
    return prim.score >= 3
  }).length

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1800px] mx-auto animate-in">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Column */}
        <div className="lg:w-1/3">
          <h1 className="text-3xl text-white font-medium uppercase mb-8">Settlement Engine</h1>
          <p className="text-zinc-400 text-sm mb-8 font-mono">
            HP-STD-001 Settlement State. Select an entity to view primitive validation status.
          </p>

          <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase">Select Entity</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full mb-8"
          >
            {ACTORS.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.layer})</option>
            ))}
          </select>

          {/* Status Card */}
          <div className="card">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Overall Status</div>
            <div className={`text-4xl font-mono mb-2 ${
              actor.status === 'CONFORMING' ? 'text-emerald-500' :
              actor.status === 'PARTIALLY_CONFORMING' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {actor.status === 'CONFORMING' ? 'SETTLED' :
               actor.status === 'PARTIALLY_CONFORMING' ? 'PARTIALLY SETTLED' : 'UNSETTLED'}
            </div>
            {actor.status === 'NON_CONFORMING' && (
              <div className="text-[10px] font-mono text-red-400 uppercase">Exposure Accruing</div>
            )}
            <div className="score-bar">
              <div
                className={`score-fill ${
                  actor.status === 'CONFORMING' ? 'bg-emerald-500' :
                  actor.status === 'PARTIALLY_CONFORMING' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(passCount / 5) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-right text-xs font-mono text-white">
              {passCount} / 5 Primitives
            </div>
            {passCount === 0 && (
              <div className="mt-2 text-[10px] font-mono text-red-400">
                0 / 5 primitives declared. Settlement not reachable.
              </div>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="card text-center">
              <div className="text-3xl font-mono text-white">{actor.scores.MLI}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">MLI /100</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-mono text-white">{actor.scores.MEI}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase">MEI /200</div>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-mono text-zinc-500">
            Scores indicate settlement readiness, not intent. Exposure accrues until cleared.
          </div>

          {/* Settlement State Block */}
          <div className="mt-6 p-4 border border-zinc-800 bg-zinc-900/30">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-3">Settlement State — Machine-Native</div>
            <div className="space-y-3 text-[10px] font-mono">
              <div>
                <div className="text-zinc-500 mb-1">What this blocks:</div>
                <ul className="text-zinc-400 space-y-0.5 ml-2">
                  <li>• Broker placement for machine / AGI risk</li>
                  <li>• Capital backing (reinsurance, ILS, retro)</li>
                  <li>• Audit and rating normalization</li>
                  <li>• Autonomous risk underwriting</li>
                </ul>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">What accrues:</div>
                <ul className="text-zinc-400 space-y-0.5 ml-2">
                  <li>• Daily Machine Exposure Units (MEU)</li>
                  <li>• Public exposure reference used by brokers, auditors, allocators</li>
                </ul>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">What normalizes the status:</div>
                <ul className="text-zinc-400 space-y-0.5 ml-2">
                  <li>• Public MID (Machine Identity)</li>
                  <li>• Public EI endpoint (Exposure Index)</li>
                  <li>• Reachable M2M-SE (Settlement Endpoint)</li>
                  <li>• Published LCH (Liability Chain Hash)</li>
                  <li>• Published CSD (Control Surface Definition)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-2/3">
          <h2 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-6">Primitive Validation</h2>
          <table className="data-table mb-16">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Requirement</th>
                <th className="w-20 text-center">Score</th>
                <th className="w-32 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((r) => {
                const prim = actor.primitives[r.key as keyof typeof actor.primitives]
                const isYes = prim.score >= 3
                return (
                  <tr key={r.key} className="cursor-default hover:bg-transparent">
                    <td className="text-zinc-600 font-mono">{r.id}</td>
                    <td className="text-zinc-300">{r.label}</td>
                    <td className="text-center text-zinc-500 font-mono">{prim.score}/4</td>
                    <td className="text-center">
                      <span className={`badge ${isYes ? 'badge-conforming' : 'badge-non-conforming'}`}>
                        {isYes ? 'YES' : 'NO'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* API Specs */}
          <div className="border-t border-white/10 pt-12">
            <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-8">Registry API Specifications</h2>
            <div className="space-y-4">
              {[
                { verb: 'GET', url: '/api/actors', desc: 'List all audited entities with summary scores.' },
                { verb: 'GET', url: '/api/actors/{slug}', desc: 'Full primitive breakdown and debt status.' },
                { verb: 'GET', url: '/api/notices', desc: 'Stream of active non-conformance notices.' },
                { verb: 'GET', url: '/api/primitives', desc: 'HP-STD-001 Schema Definitions.' }
              ].map((ep, i) => (
                <div key={i} className="bg-black border border-zinc-800 p-4 font-mono text-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-1 text-xs">{ep.verb}</span>
                  <code className="text-emerald-500">{ep.url}</code>
                  <span className="text-zinc-500 text-xs flex-grow md:text-right">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
