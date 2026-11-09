import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Side C</p>
      <h1 className="mt-4 font-serif text-6xl text-ivory">This groove runs out.</h1>
      <p className="mt-4 text-muted-foreground">The page you were looking for isn&apos;t in our archive.</p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-champagne px-6 text-sm font-medium text-primary-foreground">
        Back to Discover
      </Link>
    </main>
  )
}
