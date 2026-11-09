import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getAlbumPlatforms } from '@/lib/platforms'
import type { Album } from '@/lib/types'

export function ListenPlatforms({ album }: { album: Album }) {
  const links = getAlbumPlatforms(album)
  return (
    <section id="listen" aria-labelledby="listen-title" className="scroll-mt-28">
      <h2 id="listen-title" className="font-serif text-3xl text-ivory">
        Listen across platforms
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        SONORA doesn&apos;t stream. Take this record wherever you listen — available on {links.length} services.
      </p>
      {links.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-hairline p-6 text-sm text-muted-foreground">
          This record isn&apos;t on any major service yet. Check the artist&apos;s own channels.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {links.map((p) => (
            <li key={p.id}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-14 items-center gap-3.5 overflow-hidden rounded-xl border border-hairline bg-ivory/[0.03] pl-3 pr-4 transition-colors hover:border-[color:var(--brand)]"
                style={{ ['--brand' as string]: `${p.tint}66` }}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: p.tint }}
                />
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ivory/[0.06]">
                  <Image src={p.logo || '/placeholder.svg'} alt="" width={22} height={22} className="size-[22px] object-contain" />
                </span>
                <span className="flex-1 text-sm font-medium text-ivory">{p.name}</span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory" aria-hidden />
                <span className="sr-only">(opens {p.name} in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
