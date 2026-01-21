'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllNotices, ACTORS } from '@/lib/data'
import type { NoticeType } from '@/types'

type FilterType = 'ALL' | NoticeType

export default function EnforcementPage() {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const allNotices = getAllNotices()

  const filteredNotices = useMemo(() => {
    if (filter === 'ALL') return allNotices
    return allNotices.filter(n => n.type === filter)
  }, [allNotices, filter])

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'NON_CONFORMANCE', label: 'Non-Conformance' },
    { key: 'DEBT_ACCRUAL', label: 'Debt Accrual' },
    { key: 'STATUS_CHANGE', label: 'Status Change' },
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Public Notices</h1>
      <p className="text-zinc-400 font-mono text-sm mb-8">
        Enforcement notices feed. Copy-pastable. Single-screen. No fluff.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`tab-item ${filter === opt.key ? 'active' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="card text-center">
          <div className="text-2xl font-mono text-white">{allNotices.length}</div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Total Notices</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-mono text-red-500">
            {allNotices.filter(n => n.type === 'NON_CONFORMANCE').length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Non-Conformance</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-mono text-yellow-500">
            {allNotices.filter(n => n.severity === 'CRITICAL').length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Critical</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-mono text-zinc-400">
            {ACTORS.filter(a => a.debt.active).length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Actors w/ Debt</div>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className={`card border-l-4 ${
              notice.severity === 'CRITICAL' ? 'border-l-red-500 bg-red-950/10' :
              notice.severity === 'HIGH' ? 'border-l-red-500' :
              'border-l-yellow-500'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                    notice.type === 'NON_CONFORMANCE' ? 'bg-red-900 text-red-400' :
                    notice.type === 'DEBT_ACCRUAL' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {notice.type.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 border ${
                    notice.severity === 'CRITICAL' ? 'border-red-500 text-red-400' :
                    notice.severity === 'HIGH' ? 'border-red-900 text-red-400' :
                    'border-yellow-900 text-yellow-400'
                  }`}>
                    {notice.severity}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">{notice.date}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{notice.title}</h3>
                <p className="text-zinc-400 text-sm font-mono mb-3">{notice.summary}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <span className="text-zinc-600">{notice.id}</span>
                  <Link
                    href={`/entities/${notice.actor_id}`}
                    className="text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    {notice.actor_name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-zinc-500 font-mono">No notices matching filter.</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-[10px] text-zinc-600 font-mono">
        Notices generated automatically based on conformance status. Next Reassessment: 2026-01-21 UTC 00:00
      </div>
    </div>
  )
}
