'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useDeferredValue, useEffect, useState } from 'react'
import { Disc3, Mic2, SearchX, Music, Sparkles, Play, Pause } from 'lucide-react'
import { popularSearches, searchCatalog } from '@/lib/search'
import { cn } from '@/lib/utils'
import { EmptyState, Skeleton } from './primitives'
import { useAudioPlayer } from '@/lib/player-context'

function useDebounced<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

interface SearchResultsProps {
  query: string
  onPick?: (query: string) => void
  onNavigate?: () => void
  layout?: 'compact' | 'full'
}

interface LiveAlbum {
  id: string
  slug: string
  title: string
  artist: string
  year: number
  cover: string
  genre: string
}

interface LiveArtist {
  id: string
  name: string
  slug: string
  origin: string
  genre: string
  image: string
}

interface LiveTrack {
  id: string
  title: string
  artist: string
  album: string
  albumSlug: string
  cover: string
  duration: string
  previewUrl?: string
}

export function SearchResults({ query, onPick, onNavigate, layout = 'compact' }: SearchResultsProps) {
  const debounced = useDebounced(query)
  const deferred = useDeferredValue(debounced)
  const isPending = query.trim() !== deferred.trim()
  const localResults = searchCatalog(deferred)

  const [liveAlbums, setLiveAlbums] = useState<LiveAlbum[]>([])
  const [liveArtists, setLiveArtists] = useState<LiveArtist[]>([])
  const [liveTracks, setLiveTracks] = useState<LiveTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { activeTrack, isPlaying, playTrack } = useAudioPlayer()

  useEffect(() => {
    if (!deferred.trim()) {
      setLiveAlbums([])
      setLiveArtists([])
      setLiveTracks([])
      return
    }

    let active = true
    setIsLoading(true)

    fetch(`/api/search?q=${encodeURIComponent(deferred.trim())}`)
      .then((res) => (res.ok ? res.json() : { albums: [], artists: [], tracks: [] }))
      .then((data) => {
        if (active) {
          setLiveAlbums(data.albums || [])
          setLiveArtists(data.artists || [])
          setLiveTracks(data.tracks || [])
        }
      })
      .catch((err) => {
        console.warn('Live search error:', err)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [deferred])

  if (!query.trim()) {
    return (
      <div className="p-1">
        <p className="eyebrow mb-3">Popular Right Now</p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPick?.(s)}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-sm text-ivory/85 transition-colors hover:border-champagne/40 hover:text-champagne"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="space-y-3 p-1" aria-busy="true" aria-label="Searching">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const hasAnyResults =
    localResults.total > 0 || liveAlbums.length > 0 || liveArtists.length > 0 || liveTracks.length > 0
  const full = layout === 'full'

  if (!hasAnyResults && !isLoading) {
    return (
      <EmptyState
        icon={SearchX}
        title="Nothing found"
        body={`We couldn't find matches for "${query}". Try searching for Radiohead, Kendrick Lamar, Pink Floyd, or Taylor Swift.`}
        className="border-0 py-10"
      />
    )
  }

  return (
    <div className={cn('space-y-7 p-1', full && 'space-y-12')} aria-live="polite">
      {/* Real Songs / Tracks */}
      {liveTracks.length > 0 && (
        <section aria-labelledby="sr-tracks">
          <div className="flex items-center justify-between mb-3">
            <h3 id="sr-tracks" className="eyebrow flex items-center gap-2 text-champagne">
              <Music className="size-3.5" aria-hidden /> Songs & Playable Cuts
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">30s Previews</span>
          </div>
          <ul className="space-y-1.5">
            {liveTracks.slice(0, 4).map((track) => {
              const isThisPlaying = isPlaying && activeTrack?.id === track.id
              return (
                <li
                  key={track.id}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ivory/5 group"
                >
                  {/* Play preview button */}
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-umber">
                    <Image src={track.cover} alt={track.title} fill sizes="40px" className="object-cover" />
                    {track.previewUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          playTrack({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            cover: track.cover,
                            previewUrl: track.previewUrl!,
                            albumTitle: track.album,
                            albumSlug: track.albumSlug,
                          })
                        }
                        className={cn(
                          'absolute inset-0 flex items-center justify-center bg-obsidian/60 transition-opacity',
                          isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        )}
                        aria-label={isThisPlaying ? 'Pause' : 'Play preview'}
                      >
                        {isThisPlaying ? (
                          <Pause className="size-4 fill-champagne text-champagne" />
                        ) : (
                          <Play className="size-4 fill-white text-white ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Title linking to dedicated Track Page */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/track/${track.id}`}
                      onClick={onNavigate}
                      className="truncate font-serif text-base block text-ivory group-hover:text-champagne transition-colors"
                    >
                      {track.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.artist} · from {track.album}
                    </p>
                  </div>

                  <span className="font-mono text-xs text-muted-foreground">{track.duration}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Real Artists */}
      {(liveArtists.length > 0 || localResults.artists.length > 0) && (
        <section aria-labelledby="sr-artists">
          <h3 id="sr-artists" className="eyebrow mb-3 flex items-center gap-2">
            <Mic2 className="size-3.5" aria-hidden /> Artists
          </h3>
          <ul className="flex flex-wrap gap-3">
            {(liveArtists.length > 0 ? liveArtists : localResults.artists).map((a: any) => (
              <li key={a.slug || a.id}>
                <Link
                  href={`/artist/${a.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-full border border-hairline py-1.5 pl-1.5 pr-4 transition-colors hover:border-ivory/25 group"
                >
                  <span className="relative size-8 overflow-hidden rounded-full bg-umber">
                    <Image src={a.image || a.cover || '/placeholder.svg'} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  <span className="text-sm text-ivory group-hover:text-champagne transition-colors">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{(a.origin || '').split(',')[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Real Albums */}
      {liveAlbums.length > 0 && (
        <section aria-labelledby="sr-live-albums">
          <div className="flex items-center justify-between mb-3">
            <h3 id="sr-live-albums" className="eyebrow flex items-center gap-2 text-champagne">
              <Disc3 className="size-3.5" aria-hidden /> Albums & Discography
            </h3>
            <span className="text-[11px] font-mono text-muted-foreground">Apple Catalog</span>
          </div>
          <ul className={cn('space-y-1', full && 'grid gap-x-8 gap-y-2 space-y-0 md:grid-cols-2')}>
            {liveAlbums.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link
                  href={`/album/${item.id}`}
                  onClick={onNavigate}
                  className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-ivory/5 group"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded ring-1 ring-hairline bg-umber">
                    <Image src={item.cover} alt={item.title} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg leading-tight text-ivory group-hover:text-champagne transition-colors">
                      {item.title}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {item.artist} {item.year ? `· ${item.year}` : ''} · {item.genre}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-2">
          <Sparkles className="size-3.5 animate-spin text-champagne" />
          <span>Searching global catalog...</span>
        </div>
      )}
    </div>
  )
}
