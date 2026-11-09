'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, Star, Sparkles, Disc3 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/player-context';
import { useLibrary } from '@/lib/library-store';
import type { LiveTrackDetails } from '@/lib/music-api';

export function TrackHeroPlayer({ track }: { track: LiveTrackDetails }) {
  const { activeTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();
  const { trackRatings, rateTrack } = useLibrary();

  const isCurrentPlaying = isPlaying && activeTrack?.id === track.id;
  const ratingKey = `${track.albumSlug}:${track.trackNumber}`;
  const userRating = trackRatings[ratingKey] ?? null;

  const handlePlayToggle = () => {
    if (!track.previewUrl) return;
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover,
      previewUrl: track.previewUrl,
      albumTitle: track.album,
      albumSlug: track.albumSlug,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-hairline bg-obsidian-soft p-6 sm:p-10 lg:p-12">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-champagne/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
        {/* Cover Art with Vinyl Animation */}
        <div className="relative mx-auto size-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:size-64 md:mx-0">
          <Image
            src={track.cover}
            alt={track.title}
            fill
            priority
            sizes="(max-width: 640px) 224px, 256px"
            className={`object-cover transition-transform ${isCurrentPlaying ? 'scale-105' : ''}`}
          />
          {track.previewUrl && (
            <button
              type="button"
              onClick={handlePlayToggle}
              aria-label={isCurrentPlaying ? 'Pause song' : 'Play song preview'}
              className="absolute inset-0 flex items-center justify-center bg-obsidian/40 backdrop-blur-[2px] transition-all hover:bg-obsidian/20 group"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-champagne text-obsidian shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
                {isCurrentPlaying ? (
                  <Pause className="size-8 fill-obsidian" />
                ) : (
                  <Play className="size-8 fill-obsidian ml-1" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* Track Metadata */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-champagne">
              <Sparkles className="size-3" /> Track {track.trackNumber}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{track.duration}</span>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs text-muted-foreground">{track.year}</span>
            <span className="font-mono text-xs text-muted-foreground">·</span>
            <span className="font-mono text-xs text-muted-foreground">{track.genre}</span>
          </div>

          <h1 className="font-serif text-3xl text-ivory sm:text-5xl lg:text-6xl">
            {track.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-base text-muted-foreground">
            <span>By</span>
            <Link
              href={`/artist/${track.artistSlug}`}
              className="font-serif text-lg text-ivory hover:text-champagne transition-colors"
            >
              {track.artist}
            </Link>
            <span>from the album</span>
            <Link
              href={`/album/${track.albumSlug}`}
              className="font-serif text-lg text-champagne hover:underline"
            >
              {track.album}
            </Link>
          </div>

          {/* Interactive Rating Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-hairline">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono uppercase text-muted-foreground">Rate Track:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => rateTrack(ratingKey, userRating === num ? null : num)}
                    className={`size-7 rounded font-mono text-xs transition-colors ${
                      userRating && userRating >= num
                        ? 'bg-champagne text-obsidian font-bold'
                        : 'border border-hairline bg-white/5 text-ivory/80 hover:border-champagne/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            {userRating && (
              <span className="font-mono text-xs text-champagne">Your Score: {userRating}/10</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

