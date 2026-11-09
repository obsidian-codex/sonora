'use client'

import { formatCount } from '@/lib/data'
import { useLibrary } from '@/lib/library-store'
import type { Album } from '@/lib/types'
import { RatingMeter, verdictFor } from '../rating-meter'

export function SonoraScore({ album }: { album: Album }) {
  const { albumRatings, rateAlbum, reviews } = useLibrary()
  const max = Math.max(...album.distribution)
  const total = album.distribution.reduce((a, b) => a + b, 0)
  const highShare = Math.round(((album.distribution[8] + album.distribution[9]) / total) * 100)
  const reviewCount = reviews.filter((r) => r.albumSlug === album.slug).length

  const stats = [
    { label: 'Ratings', value: formatCount(album.ratingsCount) },
    { label: 'In libraries', value: formatCount(album.saves) },
    { label: 'Rated 9+', value: `${highShare}%` },
    { label: 'Reviews', value: String(reviewCount) },
  ]

  return (
    <section id="score" aria-labelledby="score-title" className="scroll-mt-28">
      <div className="glass rounded-2xl p-6 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
          <div className="shrink-0">
            <h2 id="score-title" className="eyebrow">
              The SONORA Score
            </h2>
            <p className="mt-3 font-serif text-[5.5rem] leading-[0.8] text-ivory lg:text-[7rem]">{album.score.toFixed(1)}</p>
            <p className="mt-3 font-serif text-xl italic text-champagne">{verdictFor(album.score)}</p>
          </div>

          <div className="flex-1">
            <p className="mb-3 text-xs text-muted-foreground">Rating distribution</p>
            <div className="flex h-28 items-end gap-1.5" role="img" aria-label={`Rating distribution: ${album.distribution.map((d, i) => `${i + 1}: ${d}`).join(', ')}`}>
              {album.distribution.map((d, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className={i >= 8 ? 'w-full rounded-t-sm bg-champagne/85' : 'w-full rounded-t-sm bg-ivory/15'}
                    style={{ height: `${Math.max(3, (d / max) * 100)}%` }}
                  />
                  <span className="text-[10px] tabular-nums text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-hairline pt-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 font-serif text-3xl text-ivory">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col gap-3 rounded-xl bg-obsidian/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-ivory">Your rating</p>
            <p className="text-xs text-muted-foreground">Tap a level. Tap again to clear.</p>
          </div>
          <RatingMeter value={albumRatings[album.slug]} onChange={(v) => rateAlbum(album.slug, v)} label={`Rate ${album.title}`} />
        </div>
      </div>
    </section>
  )
}
