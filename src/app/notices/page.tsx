import type { Metadata } from 'next'
import { getAllNotices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Daily Public State Updates | HP-STD-001',
  description: 'Chronological list of status transitions and state changes.',
}

export default function NoticesPage() {
  const notices = getAllNotices()

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto animate-in">
      <h1 className="text-3xl text-white font-medium uppercase tracking-tight mb-8">
        Daily Public State Updates
      </h1>

      <div className="space-y-1">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="border border-zinc-800/50 bg-zinc-900/20 p-4 font-mono text-sm"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-zinc-500">{notice.date}</span>
              <span className="text-white font-bold">{notice.actor_name}</span>
              <span className={`text-[10px] uppercase px-2 py-1 ${
                notice.status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                notice.status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {notice.status}
              </span>
              <span className="text-zinc-400">MEI:{notice.MEI}</span>
              <span className="text-red-400">Δ+{notice.ΔMEI_24h || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="text-zinc-500 font-mono">No state updates.</div>
      )}

      <div className="mt-8 text-[10px] font-mono text-zinc-600">
        {notices.length} updates · HP-STD-001 v1.10
      </div>
    </div>
  )
}
