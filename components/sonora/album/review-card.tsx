'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useLibrary } from '@/lib/library-store'
import type { Album, Review } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Initials } from '../primitives'

export function ReviewCard({ review, album, showAlbum }: { review: Review; album?: Album; showAlbum?: boolean }) {
  const { likedReviews, toggleLike } = useLibrary()
  const liked = likedReviews.includes(review.id)
  const likes = review.likes + (liked ? 1 : 0)

  return (
    <article className="rounded-xl border border-hairline bg-ivory/[0.02] p-5 transition-colors hover:border-ivory/15 lg:p-7">
      <header className="flex items-start gap-4">
        {showAlbum && album ? (
          <Link href={`/album/${album.slug}`} className="relative size-14 shrink-0 overflow-hidden rounded-sm ring-1 ring-hairline">
            <Image src={album.cover || '/placeholder.svg'} alt={`${album.title} artwork`} fill sizes="56px" className="object-cover" />
          </Link>
        ) : (
          <Initials name={review.author} />
        )}
        <div className="min-w-0 flex-1">
          {showAlbum && album && (
            <Link href={`/album/${album.slug}`} className="block truncate text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-champagne">
              {album.title} — {album.artist}
            </Link>
          )}
          <h3 className="mt-0.5 font-serif text-xl leading-snug text-ivory lg:text-2xl">{review.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {review.author} <span aria-hidden>·</span> @{review.handle} <span aria-hidden>·</span> {review.date}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="font-serif text-3xl leading-none text-champagne">{review.rating}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </header>
      <p className="mt-4 text-[15px] leading-relaxed text-ivory/80">{review.body}</p>
      <footer className="mt-5 flex items-center">
        <button
          type="button"
          onClick={() => toggleLike(review.id)}
          aria-pressed={liked}
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs transition-colors',
            liked ? 'border-champagne/40 text-champagne' : 'border-hairline text-muted-foreground hover:text-ivory',
          )}
        >
          <Heart className={cn('size-3.5', liked && 'fill-current')} aria-hidden />
          {likes} <span className="sr-only">likes, {liked ? 'unlike' : 'like'} this review</span>
        </button>
      </footer>
    </article>
  )
}
