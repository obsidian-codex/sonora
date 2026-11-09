import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Disc3, MapPin, Play, Music, Sparkles } from 'lucide-react';
import { getLiveArtist } from '@/lib/music-api';
import { Button } from '@/components/ui/button';
import { TracklistPlayer } from './tracklist-player';

export const dynamic = 'force-dynamic';

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getLiveArtist(slug);
  if (!artist) return { title: 'Artist Not Found — SONORA' };
  return {
    title: `${artist.name} — Discography & Critical Retrospective | SONORA`,
    description: artist.bio.slice(0, 160),
    openGraph: { images: [artist.image] },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = await getLiveArtist(slug);

  if (!artist) notFound();

  return (
    <div className="min-h-screen pb-28 pt-20">
      {/* Artist Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-obsidian-soft p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Backing Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-champagne/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
            {/* Artist Portrait */}
            <div className="relative size-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:size-56">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 640px) 176px, 224px"
                className="object-cover"
              />
            </div>

            {/* Artist Details */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-champagne">
                  <Sparkles className="size-3" /> Sonora Featured Artist
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <MapPin className="size-3 text-champagne" /> {artist.origin}
                </span>
                <span className="font-mono text-xs text-muted-foreground">·</span>
                <span className="font-mono text-xs text-muted-foreground">{artist.genre}</span>
              </div>

              <h1 className="font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
                {artist.name}
              </h1>

              <p className="max-w-2xl font-serif text-lg leading-relaxed text-ivory/80">
                {artist.bio}
              </p>

              {/* Sonic Signatures */}
              <div className="flex flex-wrap gap-2 pt-2">
                {artist.sonicSignature.map((sig, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-hairline bg-white/5 px-3 py-1 font-mono text-xs text-ivory/90"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Top Songs + Discography */}
      <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Top Playable Tracks (Left column on desktop) */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                <Music className="size-5 text-champagne" /> Essential Tracks
              </h2>
              <span className="font-mono text-xs text-muted-foreground">Official Previews</span>
            </div>

            <TracklistPlayer tracks={artist.topSongs} />

            {/* Critical Legacy Card */}
            <div className="mt-8 rounded-2xl border border-hairline bg-white/[0.02] p-6">
              <p className="eyebrow mb-2 text-champagne">Critical Impact & Legacy</p>
              <p className="text-sm leading-relaxed text-ivory/80">{artist.legacy}</p>
              <div className="mt-4 border-t border-hairline pt-3 font-mono text-xs text-muted-foreground">
                <span className="text-champagne">Recommended Starting Point:</span>{' '}
                {artist.recommendedListen}
              </div>
            </div>
          </div>

          {/* Discography (Right column on desktop) */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                <Disc3 className="size-5 text-champagne" /> Complete Discography
              </h2>
              <span className="font-mono text-xs text-muted-foreground">
                {artist.albums.length} Releases
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {artist.albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/album/${album.id}`}
                  className="group block overflow-hidden rounded-xl border border-hairline bg-white/[0.02] p-3 transition-all hover:border-champagne/40 hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-umber">
                    <Image
                      src={album.cover}
                      alt={album.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="truncate font-serif text-base text-ivory group-hover:text-champagne transition-colors">
                      {album.title}
                    </h3>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {album.year} · {album.genre}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
