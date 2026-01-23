import type { Metadata } from 'next'
import { getAllNotices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Exposure Notices',
  description: 'Public exposure events. State changes and accrual notices.',
  keywords: ['exposure notices', 'exposure events', 'state changes', 'clearing operator'],
}

export default function NoticesPage() {
  const notices = getAllNotices()

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto animate-in">
      <h1 className="text-4xl text-white font-medium uppercase mb-4">
        Exposure Notices
      </h1>
      <p className="text-zinc-400 font-mono text-sm mb-12">
        Public exposure events. State unchanged until settlement.
      </p>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`border p-6 ${
              notice.severity === 'CRITICAL' ? 'border-red-500 bg-red-950/10' :
              notice.severity === 'HIGH' ? 'border-red-900/50 bg-red-950/5' :
              'border-yellow-900/50 bg-yellow-950/5'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                  notice.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                  notice.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                  'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {notice.severity}
                </span>
                <span className="text-zinc-500 font-mono text-xs">{notice.actor_name}</span>
              </div>
              <span className="text-zinc-600 font-mono text-xs">{notice.date}</span>
            </div>

            <h3 className="text-white font-bold mb-2">{notice.title}</h3>
            <p className="text-zinc-400 text-sm font-mono mb-4">{notice.summary}</p>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 pt-4 border-t border-white/5">
              <span>{notice.id}</span>
              <span className="text-zinc-500">Exposure accrues. State unchanged.</span>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="border border-zinc-800 p-8 text-center">
          <div className="text-zinc-500 font-mono">No active notices.</div>
        </div>
      )}
    </div>
  )
}
