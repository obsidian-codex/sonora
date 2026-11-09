'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { currentUser } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { Initials } from './primitives'
import { SearchOverlay } from './search-overlay'

const links = [
  { href: '/', label: 'Discover' },
  { href: '/artists', label: 'Artists' },
  { href: '/moods', label: 'Moods' },
  { href: '/profile', label: 'Library' },
]

export function DesktopNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-5 z-40 hidden justify-center px-6 lg:flex">
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-8 rounded-full py-2 pl-7 pr-2"
        >
          <Logo className="text-lg" />
          <ul className="flex items-center gap-1">
            {links.map((l) => {
              const active =
                l.href === '/' ? pathname === '/' : l.href.startsWith('/#') ? false : pathname.startsWith(l.href)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm transition-colors',
                      active ? 'text-ivory' : 'text-muted-foreground hover:text-ivory',
                    )}
                  >
                    {l.label}
                    {active && <span className="mx-auto mt-0.5 block h-px w-4 bg-champagne" aria-hidden />}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-56 items-center gap-2.5 rounded-full border border-hairline bg-obsidian/40 px-4 text-sm text-muted-foreground transition-colors hover:border-ivory/20 hover:text-ivory"
            >
              <Search className="size-3.5" aria-hidden />
              <span className="flex-1 text-left">Search</span>
              <kbd className="rounded border border-hairline px-1.5 py-0.5 font-sans text-[10px] tracking-wider">⌘K</kbd>
            </button>
            <Link href="/profile" aria-label="Your profile" className="rounded-full">
              <Initials name={currentUser.name} className="size-10" />
            </Link>
          </div>
        </nav>
      </header>
      <SearchOverlay open={open} onClose={close} />
    </>
  )
}
