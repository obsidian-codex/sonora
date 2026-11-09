'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2 } from 'lucide-react';
import type { LiveSearchTrack } from '@/lib/music-api';
import { useAudioPlayer } from '@/lib/player-context';

export function TracklistPlayer({ tracks }: { tracks: LiveSearchTrack[] }) {
  const { activeTrack, isPlaying, playTrack } = useAudioPlayer();

  const handleToggle = (track: LiveSearchTrack) => {
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
    <div className="space-y-2">
      {tracks.map((track, idx) => {
        const isThisPlaying = isPlaying && activeTrack?.id === track.id;
        return (
          <div
            key={track.id}
            className={`group flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
              isThisPlaying
                ? 'border-champagne/50 bg-champagne/10'
                : 'border-hairline bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            {/* Play Button / Track Cover */}
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-umber">
              <Image
                src={track.cover}
                alt={track.title}
                fill
                sizes="44px"
                className="object-cover"
              />
              {track.previewUrl && (
                <button
                  type="button"
                  onClick={() => handleToggle(track)}
                  aria-label={isThisPlaying ? 'Pause' : 'Play preview'}
                  className={`absolute inset-0 flex items-center justify-center bg-obsidian/60 transition-opacity ${
                    isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause className="size-5 fill-champagne text-champagne" />
                  ) : (
                    <Play className="size-5 fill-white text-white" />
                  )}
                </button>
              )}
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{idx + 1}</span>
                <Link
                  href={`/track/${track.id}`}
                  className="truncate font-serif text-sm text-ivory hover:text-champagne transition-colors"
                >
                  {track.title}
                </Link>
                {isThisPlaying && (
                  <Volume2 className="size-3.5 animate-pulse text-champagne shrink-0" />
                )}
              </div>
              <Link
                href={`/album/${track.albumSlug}`}
                className="truncate text-xs text-muted-foreground hover:text-champagne transition-colors"
              >
                {track.album}
              </Link>
            </div>

            {/* Duration */}
            <div className="font-mono text-xs text-muted-foreground pr-2">
              {track.duration}
            </div>
          </div>
        );
      })}
    </div>
  );
}
