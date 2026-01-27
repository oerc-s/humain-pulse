'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/registry', label: 'Registry' },
  { href: '/actors', label: 'Actors' },
  { href: '/notices', label: 'Notices' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505] border-b border-white/10">
      <div className="flex justify-between items-center max-w-[1400px] mx-auto px-6 py-4">
        <Link
          href="/"
          className="font-bold text-sm tracking-tight hover:opacity-70 transition-opacity uppercase select-none text-white"
        >
          Humain Pulse
        </Link>

        {/* Desktop nav */}
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

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white text-xl"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#050505]">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`font-mono text-sm uppercase tracking-widest ${
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'text-white'
                    : 'text-zinc-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
