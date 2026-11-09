'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SearchResults } from './search-results'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const close = () => {
    setQuery('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24" role="dialog" aria-modal="true" aria-label="Search SONORA">
      <button type="button" aria-label="Close search" onClick={close} className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm" />
      <div className="glass-strong relative w-full max-w-2xl animate-rise overflow-hidden rounded-2xl">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            if (!query.trim()) return
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
            close()
          }}
          className="flex items-center gap-3 border-b border-hairline px-5"
        >
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <label htmlFor="global-search" className="sr-only">
            Search artists, albums and genres
          </label>
          <input
            ref={inputRef}
            id="global-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, albums, genres"
            autoComplete="off"
            className="h-16 flex-1 bg-transparent font-serif text-2xl text-ivory placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <button type="button" onClick={close} className="rounded-full p-2 text-muted-foreground hover:text-ivory" aria-label="Close search">
            <X className="size-4" aria-hidden />
          </button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <SearchResults query={query} onPick={setQuery} onNavigate={close} />
        </div>
      </div>
    </div>
  )
}
