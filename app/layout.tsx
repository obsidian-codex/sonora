import type { Metadata, Viewport } from 'next'
import { LibraryProvider } from '@/lib/library-store'
import { AudioPlayerProvider } from '@/lib/player-context'
import { DesktopNav } from '@/components/sonora/desktop-nav'
import { MobileNav } from '@/components/sonora/mobile-nav'
import { SiteFooter } from '@/components/sonora/site-footer'
import { FloatingPlayer } from '@/components/sonora/floating-player'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SONORA — Music for a deeper you',
    template: '%s · SONORA',
  },
  description:
    'SONORA is a music discovery, criticism and community platform. Editorial album analysis, community scores and curated releases.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0f0d0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="min-h-dvh">
        <LibraryProvider>
          <AudioPlayerProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-champagne focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Skip to content
            </a>
            <DesktopNav />
            <div id="main" className="pb-28 lg:pb-0">
              {children}
              <SiteFooter />
            </div>
            <FloatingPlayer />
            <MobileNav />
          </AudioPlayerProvider>
        </LibraryProvider>
      </body>
    </html>
  )
}
