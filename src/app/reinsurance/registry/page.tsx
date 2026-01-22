'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { REINSURANCE_ACTORS, getActorScores, STATUS_DEFINITIONS } from '@/lib/reinsurance-data'
import type { ReinsuranceStatus } from '@/lib/reinsurance-data'

type SortBy = 'EI_ADJ' | 'MLI' | 'MEI' | 'DRIFT'
type StatusFilter = 'ALL' | ReinsuranceStatus

export default function RegistryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('EI_ADJ')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const actorsWithScores = useMemo(() => {
    return REINSURANCE_ACTORS.map(a => ({
      ...a,
      scores: getActorScores(a)
    }))
  }, [])

  const filteredActors = useMemo(() => {
    let actors = [...actorsWithScores]

    // Filter by status
    if (statusFilter !== 'ALL') {
      actors = actors.filter(a => a.status === statusFilter)
    }

    // Filter by search
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      actors = actors.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.slug.toLowerCase().includes(query)
      )
    }

    // Sort
    actors.sort((a, b) => {
      if (sortBy === 'EI_ADJ') return b.scores.eiAdj - a.scores.eiAdj
      if (sortBy === 'MLI') return b.scores.mli - a.scores.mli
      if (sortBy === 'MEI') return b.scores.mei - a.scores.mei
      if (sortBy === 'DRIFT') return b.scores.drift - a.scores.drift
      return 0
    })

    return actors
  }, [actorsWithScores, searchTerm, sortBy, statusFilter])

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'NON-CLEARABLE', label: 'Non-Clearable' },
    { key: 'HUMAN-GATED', label: 'Human-Gated' },
    { key: 'UNSETTLED', label: 'Unsettled' },
    { key: 'PARTIAL', label: 'Partial' },
    { key: 'CONFORMING', label: 'Conforming' },
  ]

  const getStatusBadgeClass = (status: ReinsuranceStatus) => {
    switch (status) {
      case 'CONFORMING': return 'badge-conforming'
      case 'PARTIAL': return 'badge-partial'
      case 'HUMAN-GATED': return 'badge-human-gated'
      case 'UNSETTLED': return 'badge-unsettled'
      case 'NON-CLEARABLE': return 'badge-non-clearable'
      default: return 'badge-non-conforming'
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen max-w-[1800px] mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-2">Reinsurance Registry</h1>
          <p className="text-zinc-500 font-mono text-sm">
            Machine-risk clearing readiness for capital / reinsurance layer.
          </p>
        </div>
        <div className="flex gap-6 items-end w-full md:w-auto">
          <div className="font-mono text-[10px] uppercase text-zinc-500">
            Sort:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-transparent text-white ml-2 outline-none border-b border-zinc-800 py-1"
            >
              <option value="EI_ADJ">Adjusted Exposure (EI_ADJ)</option>
              <option value="MLI">Clearing Readiness (MLI)</option>
              <option value="MEI">Exposure Pressure (MEI)</option>
              <option value="DRIFT">Drift (U/day)</option>
            </select>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="SEARCH REINSURER..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-800 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none uppercase placeholder:text-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`tab-item ${statusFilter === f.key ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Actor</th>
              <th>Layer</th>
              <th className="text-center">Status</th>
              <th className="text-right">MLI (0-100)</th>
              <th className="text-right">MEI (0-200)</th>
              <th className="text-right">EI_ADJ (0-250)</th>
              <th className="text-right">Drift (U/day)</th>
              <th className="text-right">Last Update</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredActors.map(actor => (
              <tr key={actor.slug} onClick={() => window.location.href = `/reinsurance/actor/${actor.slug}`}>
                <td>
                  <Link href={`/reinsurance/actor/${actor.slug}`} className="text-white font-bold text-sm hover:text-emerald-400 transition-colors">
                    {actor.name}
                  </Link>
                </td>
                <td className="text-zinc-400 text-xs font-mono uppercase">{actor.layer}</td>
                <td className="text-center">
                  <span className={`badge ${getStatusBadgeClass(actor.status)}`} title={STATUS_DEFINITIONS[actor.status]}>
                    {actor.status}
                  </span>
                </td>
                <td className="text-right font-mono text-zinc-300">{actor.scores.mli}</td>
                <td className="text-right font-mono">
                  <span className={actor.scores.mei > 150 ? 'text-red-500' : actor.scores.mei > 100 ? 'text-yellow-500' : 'text-zinc-300'}>
                    {actor.scores.mei}
                  </span>
                </td>
                <td className="text-right font-mono">
                  <span className={actor.scores.eiAdj > 180 ? 'text-red-500' : actor.scores.eiAdj > 120 ? 'text-yellow-500' : 'text-zinc-300'}>
                    {actor.scores.eiAdj}
                  </span>
                </td>
                <td className="text-right font-mono text-red-400">
                  +{actor.scores.drift}
                </td>
                <td className="text-right font-mono text-[10px] text-zinc-600">
                  2026-01-22
                </td>
                <td className="text-right">
                  <Link href={`/reinsurance/actor/${actor.slug}`} className="text-emerald-500 hover:text-emerald-400 font-mono text-xs">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredActors.length === 0 && (
        <div className="text-center text-zinc-500 py-12 font-mono">
          No reinsurers found matching criteria.
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 text-xs text-zinc-600 font-mono">
        Showing {filteredActors.length} of {REINSURANCE_ACTORS.length} reinsurers · Sorted by {sortBy} (descending)
      </div>
    </div>
  )
}
