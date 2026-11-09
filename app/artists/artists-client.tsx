'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Mic2, MapPin, Sparkles, Disc3, ArrowRight } from 'lucide-react';

export interface DirectoryArtist {
  name: string;
  slug: string;
  origin: string;
  genre: string;
  cover: string;
  era: string;
  recordsCount: number;
}

const GENRE_FILTERS = [
  'All',
  'Alternative',
  'Hip-Hop/Rap',
  'Rock',
  'R&B/Soul',
  'Pop',
  'Jazz',
  'Electronic',
];

export function ArtistsClient({ artists }: { artists: DirectoryArtist[] }) {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = artists.filter((a) => {
    const matchesGenre =
      selectedGenre === 'All' ||
      a.genre.toLowerCase().includes(selectedGenre.toLowerCase()) ||
      (selectedGenre === 'Electronic' && a.genre.toLowerCase().includes('dance'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.genre.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  const featured = artists[1] || artists[0]; // Kendrick Lamar

  return (
    <div className="space-y-12">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter artists by name, origin, or sound..."
            className="h-12 w-full rounded-full border border-hairline bg-white/[0.03] pl-11 pr-4 font-serif text-base text-ivory placeholder:text-muted-foreground/60 focus:border-champagne/50 focus:outline-none"
          />
        </div>

        {/* Genre Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {GENRE_FILTERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                selectedGenre === g
                  ? 'bg-champagne text-obsidian font-bold'
                  : 'border border-hairline bg-white/[0.02] text-ivory/80 hover:border-champagne/40 hover:text-champagne'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Artist Spotlight (when no search active) */}
      {searchQuery.trim() === '' && selectedGenre === 'All' && featured && (
        <section className="relative overflow-hidden rounded-3xl border border-hairline bg-obsidian-soft p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-champagne/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative size-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:size-52">
              <Image
                src={featured.cover}
                alt={featured.name}
                fill
                priority
                sizes="(max-width: 640px) 176px, 208px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-champagne">
                <Sparkles className="size-3" /> Spotlight Retrospective
              </span>
              <h2 className="font-serif text-4xl text-ivory sm:text-5xl">{featured.name}</h2>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-ivory">
                  <MapPin className="size-3 text-champagne" /> {featured.origin}
                </span>
                <span>·</span>
                <span>{featured.genre}</span>
                <span>·</span>
                <span>{featured.era}</span>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-ivory/80">
                Architect of cultural epics and visionary storytelling, reshaping the linguistic and musical boundaries of modern art.
              </p>
              <div className="pt-2">
                <Link
                  href={`/artist/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-champagne px-5 py-2 font-mono text-xs font-bold text-obsidian transition-transform hover:scale-105 active:scale-95"
                >
                  Explore Complete Discography <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Artists Directory Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-ivory flex items-center gap-2">
            <Mic2 className="size-5 text-champagne" /> Directory Catalog
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            Showing {filtered.length} Artists
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-hairline bg-white/[0.02] p-12 text-center text-muted-foreground">
            <Mic2 className="mx-auto size-10 opacity-30" />
            <p className="mt-4 font-serif text-xl text-ivory">No artists found</p>
            <p className="mt-1 text-sm">Try searching for a different name or clearing the genre filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filtered.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artist/${artist.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-hairline bg-white/[0.02] p-5 text-center transition-all hover:border-champagne/40 hover:bg-white/[0.05]"
              >
                {/* Circular Portrait Image */}
                <div className="relative size-28 overflow-hidden rounded-full border border-white/10 shadow-lg sm:size-32">
                  <Image
                    src={artist.cover}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Name & Origin */}
                <h3 className="mt-4 truncate font-serif text-lg text-ivory group-hover:text-champagne transition-colors">
                  {artist.name}
                </h3>
                <p className="truncate font-mono text-xs text-muted-foreground mt-0.5">
                  {artist.origin}
                </p>

                {/* Genre & Discography Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-ivory/80">
                    {artist.genre}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {artist.recordsCount} Releases
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

