'use client'

import { useEffect, useRef, useState } from 'react'
import type { Album } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MobileHeader } from '../mobile-header'
import { AlbumAnalysis, AlbumCredits } from './album-analysis'
import { AlbumCommunity } from './album-community'
import { AlbumHero } from './album-hero'
import { ListenPlatforms } from './listen-platforms'
import { SimilarAlbums } from './similar-albums'
import { SonoraScore } from './sonora-score'
import { Tracklist } from './tracklist'

const tabs = [
  { id: 'overview', label: 'Album' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'community', label: 'Community' },
  { id: 'similar', label: 'Similar' },
] as const

type TabId = (typeof tabs)[number]['id']

const desktopAnchors = [
  { href: '#score', label: 'Score' },
  { href: '#tracks', label: 'Tracklist' },
  { href: '#analysis', label: 'Analysis' },
  { href: '#community', label: 'Community' },
  { href: '#similar', label: 'Similar' },
]

export function AlbumView({ album, similar }: { album: Album; similar: Album[] }) {
  const [tab, setTab] = useState<TabId>('overview')
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (tabs.some((t) => t.id === hash)) setTab(hash as TabId)
  }, [])

  const select = (id: TabId) => {
    setTab(id)
    const top = tabsRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) tabsRef.current?.scrollIntoView({ block: 'start' })
  }

  const panel = (id: TabId) => cn(tab === id ? 'block' : 'hidden', 'lg:block')

  return (
    <main>
      <MobileHeader backHref="/" title="Album" />
      <AlbumHero album={album} />

      <div ref={tabsRef} className="sticky top-0 z-30 scroll-mt-0 border-b border-hairline bg-obsidian/80 backdrop-blur-xl lg:hidden">
        <div role="tablist" aria-label="Album sections" className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => select(t.id)}
              className={cn(
                'h-10 shrink-0 rounded-full px-4 text-sm transition-colors',
                tab === t.id ? 'bg-ivory/10 text-champagne' : 'text-muted-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <nav aria-label="Album sections" className="sticky top-24 z-30 mx-auto hidden max-w-7xl justify-end px-10 lg:flex">
        <ul className="glass -mt-6 flex gap-1 rounded-full p-1">
          {desktopAnchors.map((a) => (
            <li key={a.href}>
              <a href={a.href} className="block rounded-full px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-ivory/5 hover:text-ivory">
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 lg:pt-16">
        <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className={cn(panel('overview'))}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <SonoraScore album={album} />
            </div>
            <div className="lg:col-span-5">
              <ListenPlatforms album={album} />
            </div>
          </div>
          <div className="mt-10 lg:hidden">
            <p className="mb-6 text-[15px] leading-relaxed text-ivory/80">{album.editorial}</p>
            <AlbumCredits album={album} />
          </div>
        </div>

        <div id="panel-tracks" role="tabpanel" aria-labelledby="tab-tracks" className={cn(panel('tracks'), 'lg:mt-28')}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <Tracklist album={album} />
            </div>
            <div className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-40">
                <AlbumCredits album={album} />
              </div>
            </div>
          </div>
        </div>

        <div id="panel-analysis" role="tabpanel" aria-labelledby="tab-analysis" className={cn(panel('analysis'), 'lg:mt-36')}>
          <AlbumAnalysis album={album} />
        </div>

        <div id="panel-community" role="tabpanel" aria-labelledby="tab-community" className={cn(panel('community'), 'lg:mt-36')}>
          <AlbumCommunity album={album} />
        </div>

        <div id="panel-similar" role="tabpanel" aria-labelledby="tab-similar" className={cn(panel('similar'), 'lg:mt-36 lg:pb-12')}>
          <SimilarAlbums albums={similar} />
        </div>
      </div>
    </main>
  )
}
