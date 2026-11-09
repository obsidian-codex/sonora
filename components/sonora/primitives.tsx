'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function AlbumCover({
  src,
  alt,
  className,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const [error, setError] = useState(false)
  const fallback = '/placeholder.svg'

  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-md bg-umber ring-1 ring-hairline', className)}>
      <Image
        src={error || !src ? fallback : src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = 'View all',
  className,
  id,
}: {
  eyebrow?: string
  title: React.ReactNode
  href?: string
  linkLabel?: string
  className?: string
  id?: string
}) {
  return (
    <div className={cn('flex items-end justify-between gap-6', className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="font-serif text-3xl leading-[1.05] text-balance text-ivory md:text-5xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-champagne sm:inline-flex"
        >
          {linkLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-shimmer rounded-md bg-ivory/10', className)} />
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  body: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline p-10 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-ivory/[0.04] text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 font-serif text-2xl text-ivory">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/)
  const text = parts.length === 1 ? parts[0]!.slice(0, 2) : `${parts[0]![0]}${parts[parts.length - 1]![0]}`
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-champagne/15 font-serif text-xs font-medium text-champagne uppercase',
        className,
      )}
    >
      {text}
    </span>
  )
}
