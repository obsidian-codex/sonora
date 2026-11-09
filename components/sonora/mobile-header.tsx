import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import { Logo } from './logo'

export function MobileHeader({ backHref, title }: { backHref?: string; title?: string }) {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-5 lg:hidden">
      {backHref ? (
        <Link href={backHref} aria-label="Back" className="glass flex size-11 items-center justify-center rounded-full">
          <ArrowLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <Logo className="text-base" />
      )}
      {title && <p className="eyebrow">{title}</p>}
      <Link href="/search" aria-label="Search" className="glass flex size-11 items-center justify-center rounded-full">
        <Search className="size-4" aria-hidden />
      </Link>
    </header>
  )
}
