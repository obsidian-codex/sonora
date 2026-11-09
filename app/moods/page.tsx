import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { moods, albums } from '@/lib/data';
import { Sparkles, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Atmospheric Moods & Listening States — SONORA',
  description: 'Curated sonic spaces for deep focus, late-night contemplation, heartbreak, and euphoria.',
};

export default function MoodsPage() {
  return (
    <div className="min-h-screen pb-28 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow mb-2 flex items-center gap-1.5 text-champagne">
            <Compass className="size-3.5" /> Atmospheric States
          </p>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">Listening Rooms</h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Music tailored by emotional resonance, sonic timbre, and time of day.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moods.map((m) => {
            const moodAlbums = albums.filter((a) => a.moods.includes(m.slug));
            return (
              <div
                key={m.slug}
                className="group relative overflow-hidden rounded-2xl border border-hairline bg-white/[0.02] p-6 transition-all hover:border-champagne/40 hover:bg-white/[0.05]"
              >
                <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-umber">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-obsidian/60 px-3 py-1 font-mono text-[11px] text-ivory backdrop-blur-sm">
                    {moodAlbums.length} Records
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-ivory group-hover:text-champagne transition-colors">
                  {m.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4">
                  {moodAlbums.slice(0, 3).map((a) => (
                    <Link
                      key={a.slug}
                      href={`/album/${a.slug}`}
                      className="truncate rounded-md bg-white/5 px-2.5 py-1 text-xs text-ivory/80 hover:bg-white/10 hover:text-champagne transition-colors"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

