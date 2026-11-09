import React, { useState } from 'react';
import { Search, Sparkles, Disc, Star, Compass, User, ExternalLink, Database, Cpu, Music } from 'lucide-react';
import { useDebounce } from './hooks/useDebounce';
import { formatScore, getScoreColor, getScoreLabel } from './utils/score';
import { generateAlbumGradient, getArtworkInitial } from './utils/image';

interface FeaturedAlbum {
  id: string;
  mbid: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  score: number;
  ratingCount: number;
  coverUrl?: string;
  editorial: string;
  aiDescription: string;
  keyTracks: string[];
}

const FEATURED_ALBUMS: FeaturedAlbum[] = [
  {
    id: '1',
    mbid: 'a73d3a04-94b2-4d4b-aeef-bc9f3bb329b3',
    title: 'In Rainbows',
    artist: 'Radiohead',
    year: 2007,
    genre: 'Art Rock / Electronic',
    score: 9.3,
    ratingCount: 1420,
    coverUrl: 'https://ia800806.us.archive.org/26/items/mbid-a73d3a04-94b2-4d4b-aeef-bc9f3bb329b3/mbid-a73d3a04-94b2-4d4b-aeef-bc9f3bb329b3-19965856950_thumb500.jpg',
    editorial:
      'Warm, human, and meticulously constructed. A masterclass in rhythmic tension and melodic intimacy.',
    aiDescription:
      'A watershed moment for modern rock. Synthesizes electronic textures with organic acoustic arrangements, capturing existential warmth and vulnerability.',
    keyTracks: ['15 Step', 'Nude', 'Weird Fishes/Arpeggi', 'Reckoner'],
  },
  {
    id: '2',
    mbid: 'b819f72b-8a8b-4f9e-a89e-4e4277b068a0',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: 2015,
    genre: 'Conscious Hip-Hop / Jazz Rap',
    score: 9.6,
    ratingCount: 2310,
    editorial:
      'An ambitious, layered manifesto fusing funk, free jazz, spoken word, and institutional critique.',
    aiDescription:
      'A monumental cultural work that excavates personal grief, African American history, and systemic struggle with unmatched musical dexterity.',
    keyTracks: ['Wesley\'s Theory', 'King Kunta', 'The Blacker the Berry', 'Alright'],
  },
  {
    id: '3',
    mbid: '811985f3-5be8-42f4-a8fe-3d3a77d130c5',
    title: 'Blue',
    artist: 'Joni Mitchell',
    year: 1971,
    genre: 'Folk / Singer-Songwriter',
    score: 9.2,
    ratingCount: 890,
    editorial:
      'The emotional blueprint for confessional songwriting. Bare, incandescent, and utterly fearless.',
    aiDescription:
      'Stripped of artifice, Mitchell uses open-tuned dulcimer and piano to articulate the bittersweet contradictions of romantic freedom and loneliness.',
    keyTracks: ['Carey', 'California', 'A Case of You', 'River'],
  },
  {
    id: '4',
    mbid: '3f6e9eb9-bcf5-4db2-944d-f952f447cf08',
    title: 'Selected Ambient Works 85-92',
    artist: 'Aphex Twin',
    year: 1992,
    genre: 'Ambient Techno / IDM',
    score: 8.9,
    ratingCount: 970,
    editorial:
      'Sublime, ethereal melodies underpinned by analog drum machines. The gold standard of electronic serenity.',
    aiDescription:
      'Precocious and otherworldly, Richard D. James created an intimate sonic universe that redefined electronic music as domestic contemplation.',
    keyTracks: ['Xtal', 'Tha', 'Pulsewidth', 'Ageispolis'],
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<FeaturedAlbum>(FEATURED_ALBUMS[0]!);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredAlbums = FEATURED_ALBUMS.filter(
    (a) =>
      a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.artist.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      a.genre.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-base text-content-primary flex flex-col font-body antialiased selection:bg-accent/20 selection:text-accent-text">
      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border-subtle backdrop-blur-md">
        <div className="max-w-content-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-3 group">
              <span className="font-display text-2xl font-bold tracking-tight text-content-primary group-hover:text-accent transition-colors duration-fast">
                SONORA
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                Alpha
              </span>
            </a>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-content-secondary">
              <a href="#featured" className="hover:text-content-primary transition-colors">
                Featured
              </a>
              <a href="#explore" className="hover:text-content-primary transition-colors flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-accent" /> Discover
              </a>
              <a href="#architecture" className="hover:text-content-primary transition-colors flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-accent" /> Backend Status
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
              <input
                type="text"
                placeholder="Search albums, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-surface text-content-primary placeholder-content-muted text-sm rounded-md pl-9 pr-4 py-1.5 border border-border-default focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <button className="flex items-center gap-2 bg-accent hover:brightness-110 text-bg-base font-medium text-xs px-3.5 py-1.5 rounded-md transition duration-fast">
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-content-full mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Backend & Architecture Status Bar */}
        <section id="architecture" className="p-4 rounded-xl bg-bg-surface border border-border-default">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-semantic-success animate-pulse" />
              <div>
                <h3 className="text-sm font-semibold text-content-primary flex items-center gap-2">
                  SONORA Platform Stack Ready
                </h3>
                <p className="text-xs text-content-muted">
                  PostgreSQL Schema • Edge Functions • Gemini AI Integration • MusicBrainz Proxy
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 bg-bg-elevated px-2.5 py-1 rounded-md border border-border-subtle text-content-secondary">
                <Database className="w-3.5 h-3.5 text-accent" />
                17 SQL Tables & Triggers
              </span>
              <span className="flex items-center gap-1.5 bg-bg-elevated px-2.5 py-1 rounded-md border border-border-subtle text-content-secondary">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Gemini 2.0 Flash AI
              </span>
              <span className="flex items-center gap-1.5 bg-bg-elevated px-2.5 py-1 rounded-md border border-border-subtle text-content-secondary">
                <Music className="w-3.5 h-3.5 text-accent" />
                MusicBrainz + Cover Art
              </span>
            </div>
          </div>
        </section>

        {/* Hero Featured Album Spotlight */}
        <section id="featured" className="relative rounded-2xl bg-bg-surface border border-border-default overflow-hidden p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-[340px] rounded-xl overflow-hidden shadow-2xl border border-border-strong group">
                {selectedAlbum.coverUrl ? (
                  <img
                    src={selectedAlbum.coverUrl}
                    alt={selectedAlbum.title}
                    className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                    style={{ background: generateAlbumGradient(selectedAlbum.title).gradient }}
                  >
                    <span className="font-display text-8xl font-bold opacity-30 text-content-primary">
                      {getArtworkInitial(selectedAlbum.title)}
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-bg-base/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border-default flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-mono text-sm font-semibold text-content-primary">
                    {formatScore(selectedAlbum.score)}
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial & AI Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent">
                  <span>{selectedAlbum.genre}</span>
                  <span>•</span>
                  <span>{selectedAlbum.year}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-content-primary">
                  {selectedAlbum.title}
                </h1>
                <h2 className="text-xl text-content-secondary font-medium">
                  {selectedAlbum.artist}
                </h2>
              </div>

              {/* Editorial review snippet */}
              <div className="border-l-2 border-accent/60 pl-4 py-1">
                <p className="text-sm text-content-secondary italic leading-relaxed">
                  "{selectedAlbum.editorial}"
                </p>
                <span className="text-[11px] font-mono text-content-muted mt-1 block">
                  — Sonora Editorial Curation
                </span>
              </div>

              {/* Gemini AI Analysis Feature Preview */}
              <div className="bg-bg-elevated/70 border border-border-subtle rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-accent">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Gemini AI Critical Perspective
                  </span>
                  <span className="text-[10px] text-content-muted font-mono uppercase">gemini-2.0-flash</span>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {selectedAlbum.aiDescription}
                </p>
              </div>

              {/* Key tracks */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-content-muted mb-2">
                  Essential Cuts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAlbum.keyTracks.map((track, i) => (
                    <span
                      key={i}
                      className="text-xs bg-bg-elevated px-3 py-1 rounded-md border border-border-subtle text-content-secondary font-mono flex items-center gap-1.5"
                    >
                      <Disc className="w-3 h-3 text-accent" />
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="bg-accent hover:brightness-110 text-bg-base font-semibold text-sm px-5 py-2.5 rounded-md transition duration-fast shadow-md">
                  View Full Album Dossier
                </button>
                <button className="bg-bg-surface hover:bg-bg-elevated border border-border-default text-content-primary font-medium text-sm px-4 py-2.5 rounded-md transition duration-fast flex items-center gap-2">
                  <span>MusicBrainz Record</span>
                  <ExternalLink className="w-3.5 h-3.5 text-content-muted" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Albums Grid */}
        <section id="explore" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-content-primary">
                Explore Essential Works
              </h2>
              <p className="text-sm text-content-secondary">
                Select an album to inspect metadata, community ratings, and editorial profiles.
              </p>
            </div>
            <span className="text-xs font-mono text-content-muted">
              {filteredAlbums.length} {filteredAlbums.length === 1 ? 'Album' : 'Albums'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => {
              const isSelected = selectedAlbum.id === album.id;
              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className={`cursor-pointer rounded-xl bg-bg-surface border p-4 transition-all duration-fast space-y-3 group ${
                    isSelected
                      ? 'border-accent shadow-lg shadow-accent/5 ring-1 ring-accent'
                      : 'border-border-default hover:border-border-strong hover:bg-bg-elevated'
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-border-subtle">
                    {album.coverUrl ? (
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-normal group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: generateAlbumGradient(album.title).gradient }}
                      >
                        <span className="font-display text-4xl font-bold opacity-30 text-content-primary">
                          {getArtworkInitial(album.title)}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 bg-bg-base/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1 border border-border-subtle">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className={getScoreColor(album.score)}>{formatScore(album.score)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium text-sm text-content-primary line-clamp-1 group-hover:text-accent transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-content-secondary line-clamp-1">{album.artist}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-content-muted pt-1">
                      <span>{album.year}</span>
                      <span className="text-accent">{getScoreLabel(album.score)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-8 mt-16 text-center text-xs text-content-muted">
        <p className="font-display text-sm font-semibold text-content-secondary mb-1">SONORA</p>
        <p>The Album Culture Platform for People Who Love Music Deeply.</p>
        <p className="font-mono text-[10px] mt-2 text-content-muted">
          MusicBrainz CC0 • Cover Art Archive • Google Gemini AI
        </p>
      </footer>
    </div>
  );
}

