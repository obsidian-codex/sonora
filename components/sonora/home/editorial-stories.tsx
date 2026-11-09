import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Story } from '@/lib/types'

export function EditorialStories({ stories }: { stories: Story[] }) {
  const [lead, ...rest] = stories
  return (
    <section id="journal" aria-labelledby="journal-title" className="mx-auto max-w-7xl scroll-mt-28 px-5 pt-20 lg:px-10 lg:pt-40">
      <div className="mb-10 flex items-center gap-4">
        <p className="eyebrow">The Journal</p>
        <span className="h-px flex-1 bg-hairline" aria-hidden />
        <p className="eyebrow hidden sm:block">Issue 07 · Autumn 2026</p>
      </div>

      <article className="relative grid lg:grid-cols-12">
        <Link href={`/album/${lead.albumSlug}#analysis`} className="relative block aspect-[4/5] overflow-hidden rounded-md ring-1 ring-hairline sm:aspect-[16/10] lg:col-span-8 lg:aspect-[16/11]">
          <Image src={lead.image || '/placeholder.svg'} alt="A softly lit living room converted into a recording space" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent lg:hidden" />
        </Link>
        <div className="glass relative -mt-28 mx-3 rounded-xl p-6 sm:mx-8 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:self-center lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.26em] text-champagne">{lead.kicker}</p>
          <h2 id="journal-title" className="mt-4 font-serif text-4xl leading-[0.98] text-ivory text-balance lg:text-6xl">
            <Link href={`/album/${lead.albumSlug}#analysis`} className="hover:text-champagne">
              {lead.title}
            </Link>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ivory/75">{lead.dek}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            By {lead.author} · {lead.readTime}
          </p>
        </div>
      </article>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:w-2/3 lg:gap-12">
        {rest.map((s) => (
          <article key={s.slug} className="group flex gap-5 border-t border-hairline pt-6">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-sm ring-1 ring-hairline">
              <Image src={s.image || '/placeholder.svg'} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.26em] text-champagne">{s.kicker}</p>
              <h3 className="mt-2 font-serif text-2xl leading-tight text-ivory">
                <Link href={`/album/${s.albumSlug}#analysis`} className="inline-flex items-start gap-1 group-hover:text-champagne">
                  {s.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.dek}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
