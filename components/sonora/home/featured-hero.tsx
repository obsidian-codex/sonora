import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Album } from '@/lib/types'
import { formatCount } from '@/lib/data'
import { SaveButton } from '../save-button'

export function FeaturedHero({ album }: { album: Album }) {
  return (
    <section aria-labelledby="featured-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image src={album.cover || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="scale-125 object-cover opacity-25 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-obsidian/70 to-obsidian" />
      </div>

      {/* Mobile */}
      <div className="px-5 pb-6 pt-3 lg:hidden">
        <p className="eyebrow mb-4">Record of the week · No. 41</p>
        <Link href={`/album/${album.slug}`} className="relative block overflow-hidden rounded-2xl ring-1 ring-hairline">
          <div className="relative aspect-[4/5]">
            <Image src={album.cover || '/placeholder.svg'} alt={`${album.title} by ${album.artist} album artwork`} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="mb-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-champagne">{album.score.toFixed(1)}</span>
              <span className="text-xs text-ivory/70">SONORA Score</span>
            </div>
            <h1 id="featured-title" className="font-serif text-5xl leading-[0.95] text-ivory">
              {album.title}
            </h1>
            <p className="mt-2 text-sm text-ivory/80">
              {album.artist} · {album.year}
            </p>
          </div>
        </Link>
        <p className="mt-5 text-[15px] leading-relaxed text-ivory/80">{album.tagline}</p>
        <div className="mt-5 flex gap-3">
          <Link
            href={`/album/${album.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-champagne text-sm font-medium text-primary-foreground"
          >
            Read the analysis <ArrowRight className="size-4" aria-hidden />
          </Link>
          <SaveButton slug={album.slug} title={album.title} variant="icon" className="size-11" />
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl grid-cols-12 items-end gap-10 px-10 pb-24 pt-40 lg:grid">
        <div className="col-span-5 animate-rise pb-6">
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-champagne" aria-hidden />
            Record of the week · No. 41
          </p>
          <h1 className="font-serif text-[clamp(4.5rem,8vw,8rem)] leading-[0.88] tracking-tight text-ivory">
            {album.title.split(' ')[0]}
            <br />
            <span className="italic text-champagne">{album.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mt-8 text-sm uppercase tracking-[0.18em] text-ivory/80">
            {album.artist} <span className="mx-2 text-muted-foreground">/</span> {album.year}{' '}
            <span className="mx-2 text-muted-foreground">/</span> {album.genre}
          </p>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{album.editorial}</p>
          <div className="mt-10 flex items-center gap-3">
            <Link
              href={`/album/${album.slug}`}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-champagne px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-ivory"
            >
              Read the analysis
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <SaveButton slug={album.slug} title={album.title} />
          </div>
        </div>

        <div className="relative col-span-7">
          <Link href={`/album/${album.slug}`} className="relative ml-auto block aspect-square w-[88%] overflow-hidden rounded-sm ring-1 ring-hairline shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]">
            <Image src={album.cover || '/placeholder.svg'} alt={`${album.title} by ${album.artist} album artwork`} fill priority sizes="55vw" className="object-cover" />
          </Link>
          <div className="glass absolute -left-4 bottom-10 w-72 rounded-xl p-6">
            <p className="eyebrow">SONORA Score</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-serif text-6xl leading-none text-ivory">{album.score.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                {formatCount(album.ratingsCount)} ratings
              </span>
            </div>
            <p className="mt-4 border-t border-hairline pt-4 font-serif text-lg italic leading-snug text-ivory/85">
              &ldquo;{album.tagline}&rdquo;
            </p>
          </div>
          <p className="absolute -right-2 top-1/2 origin-center translate-x-1/2 rotate-90 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            {album.label} — {album.releaseDate}
          </p>
        </div>
      </div>
    </section>
  )
}
