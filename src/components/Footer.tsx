import { LAST_PUBLISH_DATE } from '@/lib/reinsurance-data'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col gap-4">
          <div className="font-mono text-[10px] text-zinc-500">
            This registry publishes settlement states. Costs propagate automatically.
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
              <span className="text-zinc-400">HP-STD-001</span> / <span className="text-zinc-400">ASI-STD-001</span> · MID · EI · M2M-SE · LCH · CSD
            </div>
            <div className="font-mono text-[10px] text-zinc-600">
              Last update (UTC): {LAST_PUBLISH_DATE} · <span className="text-zinc-500">Records updated daily</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
