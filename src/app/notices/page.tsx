import type { Metadata } from 'next'
import { getAllNotices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Exposure Notices',
  description: 'HP-STD-001 exposure notices. Settlement state changes and accrual events.',
  keywords: ['exposure notices', 'HP-STD-001', 'settlement state', 'clearing notices'],
}

export default function NoticesPage() {
  const notices = getAllNotices()

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto animate-in">
      <h1 className="text-4xl text-white font-medium uppercase mb-4">
        Exposure Notices
      </h1>
      <p className="text-zinc-500 font-mono text-sm mb-12">
        HP-STD-001 state events. Settlement required to close.
      </p>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b border-white/10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        <div className="col-span-2">Notice_ID</div>
        <div className="col-span-2">Actor</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">MEI</div>
        <div className="col-span-1 text-right">ΔMEI_24h</div>
        <div className="col-span-1 text-right">MLI</div>
        <div className="col-span-1 text-center">Cash_State</div>
        <div className="col-span-2">Title</div>
        <div className="col-span-1 text-right">Cycle</div>
      </div>

      <div className="space-y-1">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`border ${
              notice.severity === 'CRITICAL' ? 'border-red-500/50 bg-red-950/10' :
              notice.severity === 'HIGH' ? 'border-red-900/30 bg-red-950/5' :
              'border-yellow-900/30 bg-yellow-950/5'
            }`}
          >
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 items-center font-mono text-sm">
              <div className="col-span-2 text-zinc-400 text-xs">{notice.id}</div>
              <div className="col-span-2">
                <div className="text-white">{notice.actor_name}</div>
                <div className="text-zinc-600 text-[10px]">{notice.actor_id}</div>
              </div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] uppercase px-2 py-1 ${
                  notice.status === 'SETTLED' ? 'bg-emerald-900/30 text-emerald-400' :
                  notice.status === 'PARTIAL' ? 'bg-yellow-900/30 text-yellow-400' :
                  'bg-red-900/30 text-red-400'
                }`}>
                  {notice.status}
                </span>
              </div>
              <div className="col-span-1 text-right text-zinc-300">{notice.MEI}</div>
              <div className="col-span-1 text-right text-red-400">+{notice.ΔMEI_24h || 0}</div>
              <div className="col-span-1 text-right text-zinc-300">{notice.MLI}</div>
              <div className="col-span-1 text-center">
                <span className={`text-[10px] uppercase ${
                  notice.cash_state === 'cleared' ? 'text-emerald-400' :
                  notice.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {notice.cash_state}
                </span>
              </div>
              <div className="col-span-2 text-zinc-400 text-xs truncate" title={notice.title}>{notice.title}</div>
              <div className="col-span-1 text-right text-zinc-600 text-[10px]">v1.10</div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono uppercase px-2 py-1 ${
                  notice.severity === 'CRITICAL' ? 'bg-red-900 text-red-400' :
                  notice.severity === 'HIGH' ? 'bg-red-900/50 text-red-400' :
                  'bg-yellow-900/50 text-yellow-400'
                }`}>
                  {notice.severity}
                </span>
                <span className="text-zinc-600 font-mono text-xs">{notice.date}</span>
              </div>

              <div className="text-white font-bold mb-1">{notice.actor_name}</div>
              <div className="text-zinc-400 text-sm font-mono mb-3">{notice.title}</div>

              <div className="grid grid-cols-4 gap-2 font-mono text-xs border-t border-white/10 pt-3">
                <div>
                  <div className="text-zinc-600 text-[10px]">Status</div>
                  <div className={
                    notice.status === 'SETTLED' ? 'text-emerald-400' :
                    notice.status === 'PARTIAL' ? 'text-yellow-400' : 'text-red-400'
                  }>{notice.status}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">MEI</div>
                  <div className="text-zinc-300">{notice.MEI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">MLI</div>
                  <div className="text-zinc-300">{notice.MLI}</div>
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px]">Cash</div>
                  <div className={
                    notice.cash_state === 'cleared' ? 'text-emerald-400' :
                    notice.cash_state === 'mismatch' ? 'text-yellow-400' : 'text-red-400'
                  }>{notice.cash_state}</div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-600 mt-3">{notice.id}</div>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="border border-zinc-800 p-8 text-center">
          <div className="text-zinc-500 font-mono">No active notices.</div>
        </div>
      )}

      {/* Open Letter Template */}
      <div className="border border-white/10 bg-zinc-900/20 p-8 mt-12">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Open Letter Template</div>
        <div className="font-mono text-sm text-zinc-300 space-y-4 max-w-xl">
          <p>Machine risk cannot be insured without machine-native clearing.</p>
          <p>Until settlement primitives exist, losses are already occurring.</p>
          <p className="text-emerald-400 pt-4">— Humain Pulse, Machine-Native Clearing Operator</p>
        </div>
      </div>

      <div className="mt-6 text-[10px] font-mono text-zinc-600">
        {notices.length} notices · HP-STD-001 v1.10
      </div>
    </div>
  )
}
