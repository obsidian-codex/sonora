'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Search, Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Discover', icon: Compass, match: (p: string) => p === '/' || p.startsWith('/album') },
  { href: '/search', label: 'Search', icon: Search, match: (p: string) => p.startsWith('/search') },
  { href: '/moods', label: 'Moods', icon: Sparkles, match: (p: string) => p.startsWith('/mood') },
  { href: '/profile', label: 'Profile', icon: User, match: (p: string) => p.startsWith('/profile') },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden"
    >
      <ul className="glass-strong mx-auto flex max-w-md items-stretch justify-between rounded-full p-1.5">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-14 flex-col items-center justify-center gap-1 rounded-full text-[11px] transition-colors',
                  active ? 'bg-ivory/8 text-champagne' : 'text-muted-foreground active:text-ivory',
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2 : 1.5} aria-hidden />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
