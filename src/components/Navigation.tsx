'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/entities', label: 'Registry' },
  { href: '/standard', label: 'Standard' },
  { href: '/conformance', label: 'Conformance' },
  { href: '/enforcement', label: 'Notices' },
  { href: '/api-docs', label: 'API' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-mono text-sm font-bold tracking-wider text-white hover:text-emerald-500 transition-colors">
            HUMAIN PULSE
          </Link>
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  pathname === item.href || pathname?.startsWith(item.href + '/')
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
