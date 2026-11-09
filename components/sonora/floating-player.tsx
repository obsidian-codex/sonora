'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, X, Volume2, Disc3 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/player-context';

export function FloatingPlayer() {
  const { activeTrack, isPlaying, progress, currentTime, duration, togglePlay, closePlayer, seekTo } =
    useAudioPlayer();

  if (!activeTrack) return null;

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(fraction);
  };

  return (
    <div
      role="region"
      aria-label="Now Playing Audio Bar"
      className="fixed inset-x-0 bottom-20 z-50 mx-auto max-w-xl px-4 lg:bottom-6"
    >
      <div className="glass-strong relative flex flex-col overflow-hidden rounded-2xl border border-hairline/90 p-3 shadow-2xl backdrop-blur-xl">
        {/* Progress Bar Top Edge */}
        <div
          onClick={handleSeek}
          className="group relative -mx-3 -mt-3 mb-2 h-1.5 cursor-pointer bg-white/10"
        >
          <div
            className="h-full bg-champagne transition-all"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-champagne shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Album / Track Artwork with Vinyl Animation */}
          <Link
            href={`/track/${activeTrack.id}`}
            className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-umber ring-1 ring-hairline group"
          >
            <Image
              src={activeTrack.cover || '/placeholder.svg'}
              alt={activeTrack.title}
              fill
              sizes="44px"
              className={`object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
          </Link>

          {/* Track Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/track/${activeTrack.id}`}
                className="truncate font-serif text-sm font-medium text-ivory hover:text-champagne transition-colors"
              >
                {activeTrack.title}
              </Link>
              {isPlaying && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-champagne">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-champagne" />
                  PREVIEW
                </span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {activeTrack.artist}
              {activeTrack.albumTitle && ` · ${activeTrack.albumTitle}`}
            </p>
          </div>

          {/* Time & Controls */}
          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline-block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex size-9 items-center justify-center rounded-full bg-champagne text-obsidian shadow transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="size-4 fill-obsidian" />
              ) : (
                <Play className="size-4 fill-obsidian ml-0.5" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePlayer}
              aria-label="Close audio player"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-ivory transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

