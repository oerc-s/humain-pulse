'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/entities', label: 'Entities' },
  { href: '/conformance', label: 'Conformance' },
  { href: '/reinsurance', label: 'Reinsurance' },
  { href: '/standard', label: 'Standard' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505] border-b border-white/10 px-6 py-4">
      <div className="flex justify-between items-center max-w-[1800px] mx-auto">
        <Link
          href="/"
          className="font-bold text-sm tracking-tight hover:opacity-70 transition-opacity uppercase select-none text-white"
        >
          Humain Pulse
        </Link>

        <div className="hidden md:flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-emerald-400 transition-colors ${
                pathname === item.href || pathname?.startsWith(item.href + '/')
                  ? 'text-white'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/entities"
          className="border border-white/20 bg-white/5 text-white px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all active:scale-95"
        >
          View Entities
        </Link>
      </div>
    </nav>
  )
}
