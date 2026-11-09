import Image from 'next/image'
import Link from 'next/link'
import { getAlbumsByMood } from '@/lib/data'
import type { Mood } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../primitives'

export function MoodChips({ moods, active }: { moods: Mood[]; active?: string }) {
  return (
    <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5" aria-label="Moods">
      {moods.map((m) => (
        <li key={m.slug} className="shrink-0">
          <Link
            href={`/mood/${m.slug}`}
            aria-current={active === m.slug ? 'page' : undefined}
            className={cn(
              'inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors',
              active === m.slug ? 'border-champagne/50 bg-champagne/10 text-champagne' : 'border-hairline text-ivory/85',
            )}
          >
            {m.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function MoodTile({ mood, className, large }: { mood: Mood; className?: string; large?: boolean }) {
  const count = getAlbumsByMood(mood.slug).length
  return (
    <Link
      href={`/mood/${mood.slug}`}
      className={cn('group relative isolate block overflow-hidden rounded-md ring-1 ring-hairline', className)}
    >
      <Image
        src={mood.image || '/placeholder.svg'}
        alt=""
        fill
        sizes={large ? '50vw' : '25vw'}
        className="-z-10 object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
      <div className="flex h-full flex-col justify-end p-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70">{count} records</p>
        <h3 className={cn('mt-2 font-serif leading-none text-ivory', large ? 'text-6xl' : 'text-4xl')}>{mood.name}</h3>
        <p className="mt-3 max-w-xs text-sm text-ivory/75 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {mood.description}
        </p>
      </div>
    </Link>
  )
}

export function MoodSection({ moods }: { moods: Mood[] }) {
  const [first, second, third, fourth] = moods
  return (
    <section aria-labelledby="moods-title" className="mx-auto max-w-7xl px-5 pt-8 lg:px-10 lg:pt-28">
      <SectionHeading id="moods-title" eyebrow="Discover by mood" title={<>How do you want <span className="italic">to feel</span> tonight?</>} href="/moods" linkLabel="All moods" />

      {/* Mobile */}
      <div className="mt-6 lg:hidden">
        <MoodChips moods={moods} />
        <ul className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5">
          {moods.slice(0, 4).map((m) => (
            <li key={m.slug} className="w-[62%] shrink-0 snap-start">
              <MoodTile mood={m} className="aspect-[3/4]" />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop */}
      <div className="mt-12 hidden h-[640px] grid-cols-12 grid-rows-2 gap-4 lg:grid">
        <MoodTile mood={first} large className="col-span-6 row-span-2" />
        <MoodTile mood={second} className="col-span-3 row-span-1" />
        <MoodTile mood={third} className="col-span-3 row-span-2" />
        <MoodTile mood={fourth} className="col-span-3 row-span-1" />
      </div>
    </section>
  )
}
