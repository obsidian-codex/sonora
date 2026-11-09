import Link from 'next/link'
import type { Album } from '@/lib/types'
import { cn } from '@/lib/utils'
import { AlbumCover } from './primitives'
import { SaveButton } from './save-button'

export function AlbumTile({
  album,
  meta,
  className,
  sizes,
}: {
  album: Album
  meta?: React.ReactNode
  className?: string
  sizes?: string
}) {
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/album/${album.slug}`} className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">
        <div className="relative">
          <AlbumCover
            src={album.cover}
            alt={`${album.title} by ${album.artist} album artwork`}
            sizes={sizes}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
          <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 font-serif text-sm text-ivory">
            {album.score.toFixed(1)}
            <span className="sr-only"> SONORA Score</span>
          </span>
        </div>
        <div className="mt-4 pr-12">
          <h3 className="font-serif text-xl leading-tight text-ivory text-pretty">{album.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{album.artist}</p>
          {meta && <div className="mt-1.5 text-xs text-muted-foreground/80">{meta}</div>}
        </div>
      </Link>
      <SaveButton
        slug={album.slug}
        title={album.title}
        variant="icon"
        className="absolute right-3 top-3 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 [&[aria-pressed=true]]:opacity-100"
      />
    </article>
  )
}
