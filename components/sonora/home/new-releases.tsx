import type { Album } from '@/lib/types'
import { AlbumTile } from '../album-tile'

export function NewReleases({ albums }: { albums: Album[] }) {
  return (
    <section aria-labelledby="new-title" className="mx-auto max-w-7xl px-5 pt-16 lg:px-10 lg:pt-32">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p className="eyebrow mb-3">Curated new releases</p>
          <h2 id="new-title" className="font-serif text-3xl leading-[1.05] text-ivory md:text-5xl">
            Fresh from <span className="italic">the press</span>
          </h2>
          <p className="mt-5 hidden max-w-xs text-sm leading-relaxed text-muted-foreground lg:block">
            Six records our editors couldn&apos;t stop returning to this month. Chosen by ear, not by algorithm.
          </p>
        </div>
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 lg:col-span-9 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 lg:overflow-visible lg:px-0">
          {albums.map((a, i) => (
            <li key={a.slug} className={`w-[58%] shrink-0 snap-start sm:w-[40%] lg:w-auto ${i % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
              <AlbumTile album={a} sizes="(min-width: 1024px) 22vw, 58vw" meta={<>{a.genre} · {a.releaseDate.replace(/, \d{4}$/, '')}</>} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
