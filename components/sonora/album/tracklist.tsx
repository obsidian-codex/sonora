'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Star, Play, Pause, Volume2 } from 'lucide-react'
import { totalRuntime } from '@/lib/data'
import { useLibrary } from '@/lib/library-store'
import { useAudioPlayer } from '@/lib/player-context'
import type { Album, Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { RatingMeter } from '../rating-meter'

export function Tracklist({ album }: { album: Album }) {
  const { trackRatings, rateTrack } = useLibrary()
  const { activeTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer()
  const [openTrack, setOpenTrack] = useState<number | null>(null)

  const handleTogglePlay = (track: Track) => {
    if (!track.previewUrl) return

    const trackId = `${album.slug}-${track.n}`
    playTrack({
      id: trackId,
      title: track.title,
      artist: album.artist,
      cover: album.cover,
      previewUrl: track.previewUrl,
      albumTitle: album.title,
      albumSlug: album.slug,
    })
  }

  return (
    <section id="tracks" aria-labelledby="tracks-title" className="scroll-mt-28">
      <div className="flex items-end justify-between">
        <div>
          <h2 id="tracks-title" className="font-serif text-3xl text-ivory lg:text-4xl">
            Tracklist & Previews
          </h2>
          <p className="mt-1 text-xs text-champagne flex items-center gap-1.5">
            <Volume2 className="size-3.5" /> Official 30s Audio Previews
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {album.tracks.length} tracks · {totalRuntime(album)}
        </p>
      </div>

      <div className="mt-4 hidden grid-cols-[2.5rem_2rem_1fr_4rem_9rem_3.5rem] gap-4 border-b border-hairline pb-3 pt-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:grid">
        <span>No.</span>
        <span>Play</span>
        <span>Title</span>
        <span className="text-right">Avg</span>
        <span>Your rating</span>
        <span className="text-right">Time</span>
      </div>

      <ol className="mt-4 sm:mt-0">
        {album.tracks.map((t) => {
          const key = `${album.slug}:${t.n}`
          const mine = trackRatings[key]
          const isOpen = openTrack === t.n
          const isThisPlaying = isPlaying && activeTrack?.id === `${album.slug}-${t.n}`

          return (
            <li key={t.n} className={cn('border-b border-hairline transition-colors', isThisPlaying && 'bg-champagne/[0.04]')}>
              <div className="grid grid-cols-[2rem_2.5rem_1fr_auto] items-center gap-3 py-4 sm:grid-cols-[2.5rem_2rem_1fr_4rem_9rem_3.5rem] sm:gap-4">
                <span className="font-serif text-lg tabular-nums text-muted-foreground">
                  {String(t.n).padStart(2, '0')}
                </span>

                {/* Audio Play Button */}
                <div>
                  {t.previewUrl ? (
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(t)}
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full border transition-all duration-fast',
                        isThisPlaying
                          ? 'border-champagne bg-champagne text-primary-foreground shadow-lg shadow-champagne/20'
                          : 'border-hairline text-ivory/80 hover:border-champagne hover:text-champagne'
                      )}
                      aria-label={isThisPlaying ? `Pause ${t.title}` : `Play preview of ${t.title}`}
                    >
                      {isThisPlaying ? (
                        <Pause className="size-3.5 fill-current" />
                      ) : (
                        <Play className="size-3.5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  ) : (
                    <span className="size-8 block" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[15px] text-ivory">
                    <Link
                      href={`/track/${encodeURIComponent(t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`}
                      className={cn('truncate font-medium hover:text-champagne hover:underline transition-colors', isThisPlaying && 'text-champagne')}
                    >
                      {t.title}
                    </Link>
                    {t.standout && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-champagne/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-champagne">
                        <Star className="size-2.5 fill-current" aria-hidden /> Standout
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                    {t.duration}
                    {mine ? <> · You: <span className="text-champagne">{mine}</span></> : null}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:contents">
                  <span className="text-right font-serif text-xl text-ivory sm:text-lg">
                    {t.rating.toFixed(1)}
                    <span className="sr-only"> average rating</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenTrack(isOpen ? null : t.n)}
                    aria-expanded={isOpen}
                    aria-label={`Rate ${t.title}`}
                    className="flex size-10 items-center justify-center rounded-full border border-hairline text-muted-foreground sm:hidden"
                  >
                    <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} aria-hidden />
                  </button>
                  <div className="hidden sm:block">
                    <RatingMeter size="sm" value={mine} onChange={(v) => rateTrack(key, v)} label={`Rate ${t.title}`} showVerdict={false} />
                  </div>
                  <span className="hidden text-right text-sm tabular-nums text-muted-foreground sm:block">{t.duration}</span>
                </div>
              </div>

              {isOpen && (
                <div className="animate-rise pb-4 pl-11 sm:hidden">
                  <RatingMeter value={mine} onChange={(v) => rateTrack(key, v)} label={`Rate ${t.title}`} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
