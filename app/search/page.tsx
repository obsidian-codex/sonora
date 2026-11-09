import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon, Disc3, Mic2, Music, Sparkles } from 'lucide-react';
import { searchUnified } from '@/lib/music-api';
import { TracklistPlayer } from '../artist/[slug]/tracklist-player';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" — SONORA` : 'Search Music, Albums & Artists — SONORA',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  const results = query ? await searchUnified(query) : { albums: [], artists: [], tracks: [] };
  const hasResults = results.albums.length > 0 || results.artists.length > 0 || results.tracks.length > 0;

  return (
    <div className="min-h-screen pb-28 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Search Header */}
        <div className="mb-10">
          <p className="eyebrow mb-2 flex items-center gap-1.5 text-champagne">
            <Sparkles className="size-3.5" /> Global Catalog Search
          </p>
          <h1 className="font-serif text-3xl text-ivory sm:text-4xl">
            {query ? `Results for "${query}"` : 'Discover Music & Culture'}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Searching across official Apple Music catalog, MusicBrainz & Gemini AI archives
          </p>
        </div>

        {/* If no query entered */}
        {!query && (
          <div className="rounded-2xl border border-hairline bg-white/[0.02] p-12 text-center">
            <SearchIcon className="mx-auto size-10 text-muted-foreground/60" />
            <p className="mt-4 font-serif text-xl text-ivory">Start searching</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Type an album name, artist, or song in the search bar above.
            </p>
          </div>
        )}

        {/* If query has no results */}
        {query && !hasResults && (
          <div className="rounded-2xl border border-hairline bg-white/[0.02] p-12 text-center">
            <SearchIcon className="mx-auto size-10 text-muted-foreground/60" />
            <p className="mt-4 font-serif text-xl text-ivory">No results found for &ldquo;{query}&rdquo;</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching for popular artists like Radiohead, Kendrick Lamar, Pink Floyd, or Taylor Swift.
            </p>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="space-y-12">
            {/* Artists Section */}
            {results.artists.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                    <Mic2 className="size-5 text-champagne" /> Artists
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {results.artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artist/${artist.slug}`}
                      className="group flex flex-col items-center rounded-2xl border border-hairline bg-white/[0.02] p-5 text-center transition-all hover:border-champagne/40 hover:bg-white/[0.05]"
                    >
                      <div className="relative size-24 overflow-hidden rounded-full border border-white/10 sm:size-28">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-3 truncate font-serif text-base text-ivory group-hover:text-champagne transition-colors">
                        {artist.name}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground">{artist.origin}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Albums Section */}
            {results.albums.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                    <Disc3 className="size-5 text-champagne" /> Albums
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.albums.map((album) => (
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
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3">
                        <h3 className="truncate font-serif text-sm text-ivory group-hover:text-champagne transition-colors">
                          {album.title}
                        </h3>
                        <p className="truncate text-xs text-muted-foreground">{album.artist}</p>
                        <p className="font-mono text-[11px] text-muted-foreground/70">
                          {album.year} · {album.genre}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Songs / Tracks Section with Audio Previews */}
            {results.tracks.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                    <Music className="size-5 text-champagne" /> Tracks with 30s Audio Previews
                  </h2>
                </div>
                <div className="max-w-3xl">
                  <TracklistPlayer tracks={results.tracks} />
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

