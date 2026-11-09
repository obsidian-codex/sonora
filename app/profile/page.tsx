'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Star, Disc3 } from 'lucide-react';
import { useLibrary } from '@/lib/library-store';
import { albums } from '@/lib/data';

export default function ProfilePage() {
  const library = useLibrary();
  const saved = library?.saved || [];
  const albumRatings = library?.albumRatings || {};
  const followed = library?.followed || [];

  const savedAlbums = albums.filter((a) => saved.includes(a.slug));
  const ratedAlbums = albums.filter((a) => a.slug in albumRatings);

  return (
    <div className="min-h-screen pb-28 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Profile Header */}
        <div className="mb-10 flex flex-col items-start gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-center">
          <div className="flex size-20 items-center justify-center rounded-full border border-champagne/40 bg-champagne/10 font-serif text-2xl text-champagne">
            K
          </div>
          <div>
            <h1 className="font-serif text-3xl text-ivory sm:text-4xl">Kartikey</h1>
            <p className="font-mono text-xs text-muted-foreground">
              Member since 2026 · {saved.length} Saved · {Object.keys(albumRatings).length} Rated · {followed.length} Artists Followed
            </p>
          </div>
        </div>

        {/* Saved Records Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
              <Bookmark className="size-5 text-champagne" /> Saved Albums ({saved.length})
            </h2>
          </div>

          {savedAlbums.length === 0 ? (
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-8 text-center text-muted-foreground">
              <Disc3 className="mx-auto size-8 opacity-40" />
              <p className="mt-3 font-serif text-lg text-ivory">No saved albums yet</p>
              <p className="text-sm">Click the save icon on any album to build your personal archive.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {savedAlbums.map((album) => (
                <Link
                  key={album.slug}
                  href={`/album/${album.slug}`}
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Rated Records */}
        {ratedAlbums.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-ivory">
                <Star className="size-5 text-champagne" /> Your Ratings
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ratedAlbums.map((album) => (
                <Link
                  key={album.slug}
                  href={`/album/${album.slug}`}
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
                    <div className="absolute bottom-2 right-2 rounded bg-obsidian/90 px-1.5 py-0.5 font-mono text-xs text-champagne">
                      ★ {albumRatings[album.slug]}/10
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="truncate font-serif text-sm text-ivory group-hover:text-champagne transition-colors">
                      {album.title}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">{album.artist}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
