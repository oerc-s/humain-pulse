'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllNotices } from '@/lib/reinsurance-data'

type SeverityFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE'

export default function NoticesPage() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL')
  const allNotices = getAllNotices()

  const filteredNotices = useMemo(() => {
    if (severityFilter === 'ALL') return allNotices
    return allNotices.filter(n => n.severity === severityFilter)
  }, [allNotices, severityFilter])

  const severityFilters: { key: SeverityFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'CRITICAL', label: 'Critical' },
    { key: 'HIGH', label: 'High' },
    { key: 'MODERATE', label: 'Moderate' },
  ]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-4">Public Notices</h1>
      <p className="text-zinc-400 font-mono text-sm mb-8">
        Issued notices for reinsurance clearing capacity status.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {severityFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setSeverityFilter(f.key)}
            className={`tab-item ${severityFilter === f.key ? 'active' : ''}`}
          >
            {f.label}
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
            {allNotices.filter(n => n.severity === 'CRITICAL').length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Critical</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-mono text-red-400">
            {allNotices.filter(n => n.severity === 'HIGH').length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">High</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-mono text-yellow-500">
            {allNotices.filter(n => n.severity === 'MODERATE').length}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Moderate</div>
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
                    notice.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                    notice.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {notice.severity}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-600">{notice.date}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{notice.title}</h3>
                <p className="text-zinc-400 text-sm font-mono mb-2">{notice.statement}</p>
                <div className="text-[10px] font-mono text-zinc-600 mb-2">
                  {notice.id}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <span className="text-zinc-500">Issued to:</span>
                  <Link
                    href={`/reinsurance/actor/${notice.actor_slug}`}
                    className="text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    {notice.actor_name} →
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono mt-1">
                  <span className="text-zinc-500">Status impact:</span>
                  <span className="text-white">{notice.status_impact}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono mt-1">
                  <span className="text-zinc-500">Trigger:</span>
                  <span className="text-zinc-400">{notice.trigger}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                  Clearing capacity can be updated by publishing verifiable endpoints.
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
        Notices generated based on clearing capacity status. Records updated daily (UTC).
      </div>
    </div>
  )
}
