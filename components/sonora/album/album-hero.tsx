'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Plus } from 'lucide-react'
import { formatCount, totalRuntime } from '@/lib/data'
import { useLibrary } from '@/lib/library-store'
import type { Album } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SaveButton } from '../save-button'

export function FollowButton({ album, className }: { album: Album; className?: string }) {
  const { isFollowing, toggleFollow } = useLibrary()
  const following = isFollowing(album.artistSlug)
  return (
    <button
      type="button"
      onClick={() => toggleFollow(album.artistSlug)}
      aria-pressed={following}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors',
        following ? 'border-champagne/40 text-champagne' : 'border-hairline text-ivory/80 hover:border-ivory/25',
        className,
      )}
    >
      {following ? <Check className="size-3.5" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
      {following ? 'Following' : 'Follow'}
      <span className="sr-only"> {album.artist}</span>
    </button>
  )
}

export function AlbumHero({ album }: { album: Album }) {
  const meta = [
    { label: 'Released', value: album.releaseDate },
    { label: 'Genre', value: album.genre },
    { label: 'Tracks', value: `${album.tracks.length} · ${totalRuntime(album)}` },
    { label: 'Label', value: album.label },
  ]

  return (
    <section aria-labelledby="album-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image src={album.cover || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="scale-125 object-cover opacity-30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/20 via-obsidian/75 to-obsidian" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-8 pt-2 lg:grid-cols-12 lg:items-end lg:gap-14 lg:px-10 lg:pb-20 lg:pt-36">
        <div className="relative mx-auto w-full max-w-sm animate-rise lg:col-span-6 lg:max-w-none">
          <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-hairline shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)] lg:rounded-sm">
            <Image src={album.cover || '/placeholder.svg'} alt={`${album.title} by ${album.artist} album artwork`} fill priority sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:pb-4">
          <p className="eyebrow text-center lg:text-left">
            {album.year} · {album.subgenres.join(' · ')}
          </p>
          <h1 id="album-title" className="mt-3 text-center font-serif text-5xl leading-[0.92] tracking-tight text-ivory text-balance lg:mt-5 lg:text-left lg:text-[clamp(4rem,6.5vw,6.5rem)]">
            {album.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:mt-6 lg:justify-start">
            <Link
              href={`/artist/${album.artistSlug}`}
              className="text-base text-ivory/90 hover:text-champagne transition-colors lg:text-lg"
            >
              {album.artist}
            </Link>
            <span className="text-xs text-muted-foreground">{album.artistOrigin}</span>
            <FollowButton album={album} />
          </div>

          <p className="mx-auto mt-6 hidden max-w-lg font-serif text-2xl italic leading-snug text-ivory/80 lg:mx-0 lg:block">
            &ldquo;{album.tagline}&rdquo;
          </p>

          <div className="mt-6 flex items-center justify-center gap-5 lg:mt-10 lg:justify-start">
            <a href="#score" className="group flex items-baseline gap-2">
              <span className="font-serif text-5xl leading-none text-champagne lg:text-6xl">{album.score.toFixed(1)}</span>
              <span className="text-xs leading-tight text-muted-foreground">
                SONORA
                <br />
                {formatCount(album.ratingsCount)} ratings
              </span>
            </a>
            <span className="h-10 w-px bg-hairline" aria-hidden />
            <SaveButton slug={album.slug} title={album.title} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 lg:mt-12 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 text-sm text-ivory">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
