'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { getAlbum } from '@/lib/data'
import { useLibrary } from '@/lib/library-store'
import type { Album } from '@/lib/types'
import { SectionHeading } from '../primitives'
import { ReviewCard } from '../album/review-card'

export function CommunityPulse({ rising }: { rising: Album[] }) {
  const { reviews } = useLibrary()
  const latest = [...reviews].sort((a, b) => b.likes - a.likes).slice(0, 3)

  return (
    <section id="community" aria-labelledby="community-title" className="mx-auto max-w-7xl scroll-mt-28 px-5 pt-20 lg:px-10 lg:pt-40">
      <SectionHeading id="community-title" eyebrow="From the community" title={<>What listeners <span className="italic">are saying</span></>} />
      <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-4 lg:col-span-7">
          {latest.map((r) => {
            const album = getAlbum(r.albumSlug)
            return album ? <ReviewCard key={r.id} review={r} album={album} showAlbum /> : null
          })}
        </div>

        <aside aria-labelledby="rising-title" className="lg:col-span-5">
          <div className="glass rounded-xl p-6 lg:sticky lg:top-28 lg:p-8">
            <div className="flex items-center justify-between">
              <h3 id="rising-title" className="font-serif text-3xl text-ivory">
                Gaining attention
              </h3>
              <TrendingUp className="size-5 text-champagne" aria-hidden />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Fastest-growing ratings over the past seven days.</p>
            <ol className="mt-6 space-y-1">
              {rising.map((a) => (
                <li key={a.slug}>
                  <Link href={`/album/${a.slug}`} className="group flex items-center gap-4 rounded-lg py-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-hairline">
                      <Image src={a.cover || '/placeholder.svg'} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg leading-tight text-ivory group-hover:text-champagne">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.artist}</p>
                    </div>
                    <div className="w-24">
                      <p className="text-right text-sm text-champagne">+{a.attentionRise}%</p>
                      <div className="mt-1.5 h-px w-full bg-hairline">
                        <div className="h-px bg-champagne" style={{ width: `${Math.min(100, (a.attentionRise / 120) * 100)}%` }} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
