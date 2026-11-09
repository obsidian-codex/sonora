import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { formatCount } from '@/lib/data'
import type { Album } from '@/lib/types'
import { SectionHeading } from '../primitives'

function Trend({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-champagne">
        <ArrowUp className="size-3" aria-hidden />
        {delta}
        <span className="sr-only"> places up</span>
      </span>
    )
  if (delta < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <ArrowDown className="size-3" aria-hidden />
        {Math.abs(delta)}
        <span className="sr-only"> places down</span>
      </span>
    )
  return (
    <span className="text-xs text-muted-foreground">
      <Minus className="size-3" aria-hidden />
      <span className="sr-only">No change</span>
    </span>
  )
}

export function TrendingChart({ albums }: { albums: Album[] }) {
  return (
    <section aria-labelledby="trending-title" className="mx-auto max-w-7xl px-5 pt-16 lg:px-10 lg:pt-40">
      <SectionHeading id="trending-title" eyebrow="The Community Chart" title={<>Rated highest, <span className="italic">this week</span></>} />
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Ranked by SONORA Score weighted by the number of ratings — so a quiet masterpiece can sit beside a blockbuster.
      </p>
      <ol className="mt-10 grid gap-x-16 lg:mt-14 lg:grid-cols-2">
        {albums.map((a, i) => (
          <li key={a.slug} className="border-t border-hairline">
            <Link href={`/album/${a.slug}`} className="group flex items-center gap-4 py-4 lg:gap-6 lg:py-5">
              <span className="w-8 font-serif text-2xl text-muted-foreground/70 tabular-nums lg:text-3xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative size-14 shrink-0 overflow-hidden rounded-sm ring-1 ring-hairline lg:size-16">
                <Image src={a.cover || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-xl leading-tight text-ivory transition-colors group-hover:text-champagne lg:text-2xl">
                  {a.title}
                </p>
                <p className="truncate text-sm text-muted-foreground">{a.artist}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl leading-none text-ivory">{a.score.toFixed(1)}</p>
                <p className="mt-1 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
                  <span className="hidden sm:inline">{formatCount(a.ratingsCount)} ratings</span>
                  <Trend delta={a.trendDelta} />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
