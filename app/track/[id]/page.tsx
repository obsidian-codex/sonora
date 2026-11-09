import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Disc3, Music, Sparkles, ExternalLink, Play } from 'lucide-react';
import { getLiveTrack } from '@/lib/music-api';
import { TrackHeroPlayer } from './track-hero-player';
import { TracklistPlayer } from '@/app/artist/[slug]/tracklist-player';

export const dynamic = 'force-dynamic';

interface TrackPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { id } = await params;
  const track = await getLiveTrack(id);
  if (!track) return { title: 'Track Not Found — SONORA' };

  return {
    title: `${track.title} — ${track.artist} | Critical Analysis & Audio | SONORA`,
    description: track.analysis.lede,
    openGraph: { images: [track.cover] },
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { id } = await params;
  const track = await getLiveTrack(id);

  if (!track) notFound();

  return (
    <div className="min-h-screen pb-28 pt-20">
      {/* Track Hero Player */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <TrackHeroPlayer track={track} />
      </section>

      {/* Main Breakdown: Editorial Analysis & Parent Album */}
      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Critical Analysis (Left Column) */}
          <div className="space-y-8 lg:col-span-7">
            {/* Critical Lede */}
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6 sm:p-8">
              <p className="eyebrow mb-2 text-champagne">Critical Evaluation</p>
              <p className="font-serif text-xl leading-relaxed text-ivory">
                {track.analysis.lede}
              </p>
            </div>

            {/* Sonic Architecture */}
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ivory mb-4">Sonic Architecture & Production</h2>
              <p className="text-base leading-relaxed text-ivory/80">
                {track.analysis.sonicArchitecture}
              </p>

              {/* Standout Climax */}
              <div className="mt-6 rounded-xl border border-champagne/20 bg-champagne/5 p-4">
                <span className="font-mono text-xs uppercase tracking-wider text-champagne block mb-1">
                  Signature Moment
                </span>
                <p className="text-sm text-ivory/90 italic">
                  &ldquo;{track.analysis.standoutMoment}&rdquo;
                </p>
              </div>
            </div>

            {/* Lyrical Themes */}
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ivory mb-4">Core Lyrical Themes</h2>
              <div className="space-y-4">
                {track.analysis.lyricalThemes.map((th, idx) => (
                  <div key={idx} className="border-l-2 border-champagne pl-4">
                    <h3 className="font-serif text-lg text-ivory">{th.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{th.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Context */}
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ivory mb-3">Historical & Cultural Context</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {track.analysis.culturalContext}
              </p>
            </div>
          </div>

          {/* Album Context & Sister Cuts (Right Column) */}
          <div className="space-y-8 lg:col-span-5">
            {/* Parent Album Card */}
            <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
              <p className="eyebrow mb-4 text-champagne">Appears On</p>
              <Link
                href={`/album/${track.albumSlug}`}
                className="group flex items-center gap-4 transition-colors"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-umber">
                  <Image
                    src={track.cover}
                    alt={track.album}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg text-ivory group-hover:text-champagne transition-colors truncate">
                    {track.album}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {track.year} · {track.genre}
                  </p>
                </div>
              </Link>
            </div>

            {/* Sister Cuts */}
            {track.sisterTracks.length > 0 && (
              <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-ivory flex items-center gap-2">
                    <Disc3 className="size-4 text-champagne" /> Album Tracklist
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {track.sisterTracks.length} Tracks
                  </span>
                </div>

                <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                  {track.sisterTracks.map((st) => {
                    const isCurrent = st.title === track.title;
                    return (
                      <Link
                        key={st.id}
                        href={`/track/${st.id}`}
                        className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                          isCurrent
                            ? 'bg-champagne/10 border border-champagne/30 text-champagne'
                            : 'hover:bg-white/5 text-ivory/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs text-muted-foreground w-5 text-right">
                            {st.n}
                          </span>
                          <span className="truncate">{st.title}</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {st.duration}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stream On Platforms */}
            {track.externalUrl && (
              <div className="rounded-2xl border border-hairline bg-white/[0.02] p-6">
                <p className="eyebrow mb-3 text-champagne">Listen on Official Platforms</p>
                <a
                  href={track.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-hairline bg-white/5 p-3 text-sm text-ivory transition-colors hover:border-champagne/40 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Music className="size-4 text-champagne" /> Apple Music Full Track
                  </span>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

