import Image from 'next/image'
import Link from 'next/link'
import type { Album } from '@/lib/types'
import { AlbumTile } from '../album-tile'

export function SimilarAlbums({ albums }: { albums: Album[] }) {
  const safeAlbums = Array.isArray(albums) ? albums : []
  const [lead, ...rest] = safeAlbums
  if (safeAlbums.length === 0) return null
  return (
    <section id="similar" aria-labelledby="similar-title" className="scroll-mt-28">
      <p className="eyebrow">If this moved you</p>
      <h2 id="similar-title" className="mt-3 font-serif text-3xl text-ivory lg:text-5xl">
        Similar <span className="italic">records</span>
      </h2>

      {/* Mobile: one rich lead + list */}
      <div className="mt-6 lg:hidden">
        {lead && (
          <Link href={`/album/${lead.slug}`} className="relative block overflow-hidden rounded-2xl ring-1 ring-hairline">
            <div className="relative aspect-[4/3]">
              <Image src={lead.cover || '/placeholder.svg'} alt={`${lead.title} by ${lead.artist} artwork`} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <div>
                <p className="font-serif text-3xl leading-tight text-ivory">{lead.title}</p>
                <p className="text-sm text-ivory/75">{lead.artist}</p>
              </div>
              <span className="font-serif text-3xl text-champagne">{lead.score.toFixed(1)}</span>
            </div>
          </Link>
        )}
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {rest.map((a) => (
            <li key={a.slug}>
              <AlbumTile album={a} sizes="50vw" meta={a.genre} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-12 hidden grid-cols-4 gap-8 lg:grid">
        {safeAlbums.map((a, i) => (
          <li key={a.slug} className={i % 2 === 1 ? 'translate-y-10' : undefined}>
            <AlbumTile album={a} sizes="22vw" meta={`${a.genre} · ${a.year}`} />
          </li>
        ))}
      </ul>
    </section>
  )
}
