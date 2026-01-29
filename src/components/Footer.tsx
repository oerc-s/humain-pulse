export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            <span className="text-zinc-400">HP-STD-001</span> · MID · EI · M2M-SE · LCH · CSD
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] text-zinc-500">
            <a href="/api-docs" className="hover:text-white transition-colors">API</a>
            <a href="/hp-std-001" className="hover:text-white transition-colors">Docs</a>
            <a href="mailto:clearing@humain-pulse.com" className="text-zinc-400 hover:text-white transition-colors">
              clearing@humain-pulse.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
