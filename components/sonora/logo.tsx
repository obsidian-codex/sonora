import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-baseline gap-1.5 font-serif text-xl leading-none tracking-[0.34em] text-ivory', className)}
      aria-label="SONORA home"
    >
      <span>SON</span>
      <span className="italic text-champagne transition-transform duration-500 group-hover:-rotate-12">O</span>
      <span className="-ml-1.5">RA</span>
    </Link>
  )
}
