export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            <span className="text-zinc-400">HP-STD-001</span> · MID · EI · M2M-SE · LCH · CSD
          </div>
          <div className="font-mono text-[10px] text-zinc-600">
            Last Publish: 2026-01-20 · Daily Reassessment UTC 00:00
          </div>
        </div>
      </div>
    </footer>
  )
}
