import Link from 'next/link'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-24 max-w-7xl border-t border-hairline px-6 py-12 lg:px-10">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-serif text-2xl italic leading-snug text-muted-foreground">Music for a deeper you.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-muted-foreground sm:grid-cols-3">
          <Link href="/" className="hover:text-ivory">Discover</Link>
          <Link href="/moods" className="hover:text-ivory">Moods</Link>
          <Link href="/#journal" className="hover:text-ivory">Journal</Link>
          <Link href="/search" className="hover:text-ivory">Search</Link>
          <Link href="/profile" className="hover:text-ivory">Library</Link>
          <Link href="/#community" className="hover:text-ivory">Community</Link>
        </nav>
      </div>
      <p className="mt-12 text-xs text-muted-foreground/70">
        SONORA is a discovery and criticism platform. We don&apos;t stream music — we point you to where it lives. Demo catalogue, fictional artists.
      </p>
    </footer>
  )
}
