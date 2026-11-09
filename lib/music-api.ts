import { albums as fallbackAlbums } from './data';
import type { Album, Track } from './types';
import {
  generateAIAlbumAnalysis,
  generateAIArtistAnalysis,
  generateAITrackAnalysis,
  type GeminiArtistAnalysis,
  type GeminiTrackAnalysis,
} from './gemini';

function msToDuration(ms: number | null | undefined): string {
  if (!ms) return '3:30';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const distribution = (score: number, spread = 1.35): number[] => {
  const raw = Array.from({ length: 10 }, (_, i) => Math.exp(-((i + 1 - score) ** 2) / (2 * spread ** 2)));
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => Math.round((v / total) * 1000) / 10);
};

export function getHighResArtwork(url: string | null | undefined): string {
  if (!url) return '/placeholder.svg';
  return url
    .replace(/100x100bb\.(jpg|png)/g, '1000x1000bb.$1')
    .replace(/60x60bb\.(jpg|png)/g, '1000x1000bb.$1')
    .replace(/300x300bb\.(jpg|png)/g, '1000x1000bb.$1');
}

export interface LiveSearchAlbum {
  id: string;
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
  year: number;
  cover: string;
  genre: string;
  trackCount: number;
}

export interface LiveSearchArtist {
  id: string;
  name: string;
  slug: string;
  origin: string;
  genre: string;
  image: string;
}

export interface LiveSearchTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumSlug: string;
  cover: string;
  duration: string;
  previewUrl?: string;
}

/**
 * Searches real albums across iTunes API with live 1000x1000 covers.
 */
export async function searchRealAlbums(query: string, limit = 8): Promise<LiveSearchAlbum[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&entity=album&limit=${limit}`,
      { headers: { 'User-Agent': 'Sonora/1.0.0' }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    return results.map((r: any) => ({
      id: String(r.collectionId),
      slug: String(r.collectionId),
      title: r.collectionName,
      artist: r.artistName,
      artistSlug: r.artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      year: r.releaseDate ? parseInt(r.releaseDate.slice(0, 4), 10) : 2024,
      cover: getHighResArtwork(r.artworkUrl100),
      genre: r.primaryGenreName || 'Music',
      trackCount: r.trackCount || 10,
    }));
  } catch (err) {
    console.error('Error searching real albums:', err);
    return [];
  }
}

/**
 * Searches real tracks across iTunes API with live 30s playable audio previews.
 */
export async function searchRealTracks(query: string, limit = 8): Promise<LiveSearchTrack[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&entity=song&limit=${limit}`,
      { headers: { 'User-Agent': 'Sonora/1.0.0' }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    return results.map((r: any) => ({
      id: String(r.trackId),
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName,
      albumSlug: String(r.collectionId),
      cover: getHighResArtwork(r.artworkUrl100),
      duration: msToDuration(r.trackTimeMillis),
      previewUrl: r.previewUrl || undefined,
    }));
  } catch (err) {
    console.error('Error searching real tracks:', err);
    return [];
  }
}

/**
 * Searches real artists across iTunes & MusicBrainz with photos and origins.
 */
export async function searchRealArtists(query: string, limit = 6): Promise<LiveSearchArtist[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&entity=musicArtist&limit=${limit}`,
      { headers: { 'User-Agent': 'Sonora/1.0.0' }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    // For each artist, fetch their top album artwork to represent the artist portrait
    const artistsWithArt = await Promise.all(
      results.map(async (art: any) => {
        let image = '/placeholder.svg';
        try {
          const albRes = await fetch(
            `https://itunes.apple.com/lookup?id=${art.artistId}&entity=album&limit=1`,
            { headers: { 'User-Agent': 'Sonora/1.0.0' } }
          );
          if (albRes.ok) {
            const albData = await albRes.json();
            const firstAlbum = albData.results?.[1];
            if (firstAlbum?.artworkUrl100) {
              image = getHighResArtwork(firstAlbum.artworkUrl100);
            }
          }
        } catch (_) {}

        return {
          id: String(art.artistId),
          name: art.artistName,
          slug: art.artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          origin: art.primaryGenreName ? `${art.primaryGenreName} Artist` : 'International',
          genre: art.primaryGenreName || 'Contemporary',
          image,
        };
      })
    );

    return artistsWithArt;
  } catch (err) {
    console.error('Error searching real artists:', err);
    return [];
  }
}

/**
 * Unified multi-entity search for albums, tracks, and artists.
 */
export async function searchUnified(query: string) {
  if (!query.trim()) {
    return { albums: [], artists: [], tracks: [] };
  }
  const [albums, artists, tracks] = await Promise.all([
    searchRealAlbums(query, 6),
    searchRealArtists(query, 4),
    searchRealTracks(query, 6),
  ]);
  return { albums, artists, tracks };
}

/**
 * Fetches real album tracks, high-res artwork, and Gemini AI analysis by album ID or slug.
 */
export async function getLiveAlbum(slugOrId: string): Promise<Album | null> {
  const slugClean = decodeURIComponent(slugOrId).trim();

  // 1. Check if it's one of our local curated albums first
  const localMatch = fallbackAlbums.find(
    (a) => a.slug === slugClean || a.slug.toLowerCase() === slugClean.toLowerCase()
  );

  // If local match has valid previewUrls and 1000x1000 artwork, return it directly
  if (localMatch && localMatch.tracks[0]?.previewUrl) {
    return localMatch;
  }

  try {
    let collectionId: string | null = null;
    let initialMeta: any = null;

    // Check if numeric iTunes collectionId
    if (/^\d+$/.test(slugClean)) {
      collectionId = slugClean;
    }
    // Check if MusicBrainz UUID
    else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugClean)) {
      try {
        const mbRes = await fetch(
          `https://musicbrainz.org/ws/2/release-group/${slugClean}?inc=artists&fmt=json`,
          { headers: { 'User-Agent': 'Sonora/1.0.0 (contact@sonora.app)' } }
        );
        if (mbRes.ok) {
          const mbData = await mbRes.json();
          const artistName = mbData['artist-credit']?.[0]?.artist?.name || '';
          const albumTitle = mbData.title || '';
          const searchQuery = `${albumTitle} ${artistName}`.trim();

          const itunesRes = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=album&limit=1`,
            { headers: { 'User-Agent': 'Sonora/1.0.0' } }
          );
          if (itunesRes.ok) {
            const itunesData = await itunesRes.json();
            if (itunesData.results?.[0]) {
              collectionId = String(itunesData.results[0].collectionId);
              initialMeta = itunesData.results[0];
            }
          }
        }
      } catch (err) {
        console.warn('MBID resolution failed, falling back:', err);
      }
    }
    // Standard text slug (e.g. "ok-computer", "igor", "abbey-road")
    else {
      const slugQuery = slugClean.replace(/-/g, ' ');
      const searchRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(slugQuery)}&entity=album&limit=1`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results?.[0]) {
          collectionId = String(searchData.results[0].collectionId);
          initialMeta = searchData.results[0];
        }
      }
    }

    if (collectionId) {
      // Fetch full tracklist and playable previews via Apple lookup
      const lookupRes = await fetch(
        `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      );

      if (lookupRes.ok) {
        const lookupData = await lookupRes.json();
        const items = lookupData.results || [];
        const albumInfo = items[0] || initialMeta;
        const trackItems = items.slice(1);

        const realTracks: Track[] = trackItems.map((t: any, idx: number) => ({
          n: t.trackNumber || idx + 1,
          title: t.trackName || `Track ${idx + 1}`,
          duration: msToDuration(t.trackTimeMillis),
          rating: Math.round((8.7 + ((idx % 5) * 0.25)) * 10) / 10,
          standout: idx === 0 || idx === 2 || idx === 6,
          previewUrl: t.previewUrl || undefined,
        }));

        const title = albumInfo.collectionName || initialMeta?.collectionName || slugClean;
        const artist = albumInfo.artistName || initialMeta?.artistName || 'Various Artists';
        const year = albumInfo.releaseDate
          ? parseInt(albumInfo.releaseDate.slice(0, 4), 10)
          : 2024;
        const cover = getHighResArtwork(albumInfo.artworkUrl100 || initialMeta?.artworkUrl100);
        const genre = albumInfo.primaryGenreName || 'Music';

        const curatedByTitle = fallbackAlbums.find(
          (a) => a.title.toLowerCase() === title.toLowerCase() ||
                 title.toLowerCase().includes(a.title.toLowerCase())
        );

        // Generate live Gemini AI critical review or use curated masterpiece analysis
        const aiAnalysis = curatedByTitle ? curatedByTitle.analysis : await generateAIAlbumAnalysis({
          title,
          artist,
          genre,
          year,
          tracks: realTracks.map((t) => t.title),
        });

        const score = curatedByTitle ? curatedByTitle.score : 9.3;

        return {
          slug: slugClean,
          title,
          artist,
          artistSlug: artist.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          artistOrigin: albumInfo.country || 'International',
          year,
          releaseDate: albumInfo.releaseDate
            ? new Date(albumInfo.releaseDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : `${year}`,
          genre,
          subgenres: curatedByTitle ? curatedByTitle.subgenres : [genre, 'Studio Album'],
          label: albumInfo.copyright || 'Official Release',
          cover,
          moods: curatedByTitle ? curatedByTitle.moods : ['late-night', 'focus', 'solitude'],
          score,
          ratingsCount: curatedByTitle ? curatedByTitle.ratingsCount : 48200,
          distribution: distribution(score, 1.0),
          saves: curatedByTitle ? curatedByTitle.saves : 95400,
          trendDelta: 6,
          attentionRise: 42,
          isNew: year >= 2024,
          tagline: aiAnalysis.lede,
          editorial: curatedByTitle ? curatedByTitle.editorial : aiAnalysis.body.join(' '),
          analysis: aiAnalysis,
          credits: curatedByTitle ? curatedByTitle.credits : [
            { role: 'Artist', name: artist },
            { role: 'Record Label', name: albumInfo.copyright || 'Official Release' },
            { role: 'Track Count', name: `${realTracks.length} Official Cuts` },
          ],
          tracks: realTracks,
          platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music', 'tidal', 'deezer'],
        };
      }
    }
  } catch (err) {
    console.error('Error fetching real live album:', err);
  }

  if (localMatch) return localMatch;

  // Universal Fallback: synthesize so album page never returns 404
  const fallbackTitle = slugClean
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const aiAnalysis = await generateAIAlbumAnalysis({
    title: fallbackTitle,
    artist: 'Featured Artist',
    genre: 'Contemporary',
    year: 2024,
  });

  const score = 9.0;
  return {
    slug: slugClean,
    title: fallbackTitle,
    artist: 'Featured Artist',
    artistSlug: 'featured-artist',
    artistOrigin: 'International',
    year: 2024,
    releaseDate: '2024',
    genre: 'Contemporary',
    subgenres: ['Contemporary', 'Studio Album'],
    label: 'Official Release',
    cover: '/placeholder.svg',
    moods: ['late-night', 'focus', 'solitude'],
    score,
    ratingsCount: 12000,
    distribution: distribution(score, 1.0),
    saves: 24000,
    trendDelta: 0,
    attentionRise: 15,
    isNew: true,
    tagline: aiAnalysis.lede,
    editorial: aiAnalysis.body.join(' '),
    analysis: aiAnalysis,
    credits: [
      { role: 'Artist', name: 'Featured Artist' },
      { role: 'Release', name: fallbackTitle },
    ],
    tracks: [
      { n: 1, title: 'Opening Track', duration: '3:45', rating: 9.1, standout: true },
      { n: 2, title: 'Main Movement', duration: '4:20', rating: 9.3, standout: true },
      { n: 3, title: 'Closing Suite', duration: '5:10', rating: 8.9 },
    ],
    platforms: ['spotify', 'apple-music', 'youtube-music', 'amazon-music'],
  };
}

export interface LiveArtist {
  name: string;
  slug: string;
  origin: string;
  genre: string;
  image: string;
  bio: string;
  legacy: string;
  sonicSignature: string[];
  recommendedListen: string;
  topSongs: LiveSearchTrack[];
  albums: LiveSearchAlbum[];
}

/**
 * Fetches real artist profile, discography with 1000x1000 covers, top playable songs, and Gemini critique.
 */
export async function getLiveArtist(slugOrName: string): Promise<LiveArtist | null> {
  const nameQuery = decodeURIComponent(slugOrName).replace(/-/g, ' ').trim();

  try {
    // 1. Fetch albums & songs from Apple Music
    const [albRes, songRes] = await Promise.all([
      fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(nameQuery)}&entity=album&limit=12`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      ),
      fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(nameQuery)}&entity=song&limit=10`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      ),
    ]);

    const albData = albRes.ok ? await albRes.json() : { results: [] };
    const songData = songRes.ok ? await songRes.json() : { results: [] };

    const rawAlbums = albData.results || [];
    const rawSongs = songData.results || [];

    if (rawAlbums.length === 0 && rawSongs.length === 0) {
      return null;
    }

    const artistName = rawAlbums[0]?.artistName || rawSongs[0]?.artistName || nameQuery;
    const genre = rawAlbums[0]?.primaryGenreName || rawSongs[0]?.primaryGenreName || 'Contemporary';
    const artistImage = getHighResArtwork(
      rawAlbums[0]?.artworkUrl100 || rawSongs[0]?.artworkUrl100
    );

    // 2. Fetch origin and musicology from MusicBrainz
    let origin = 'International';
    try {
      const mbRes = await fetch(
        `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&fmt=json`,
        { headers: { 'User-Agent': 'Sonora/1.0.0 (contact@sonora.app)' } }
      );
      if (mbRes.ok) {
        const mbData = await mbRes.json();
        const first = mbData.artists?.[0];
        if (first?.country) {
          origin = first.country;
        } else if (first?.area?.name) {
          origin = first.area.name;
        }
      }
    } catch (_) {}

    // 3. Format Albums
    const albums: LiveSearchAlbum[] = rawAlbums.map((a: any) => ({
      id: String(a.collectionId),
      slug: String(a.collectionId),
      title: a.collectionName,
      artist: a.artistName,
      artistSlug: a.artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      year: a.releaseDate ? parseInt(a.releaseDate.slice(0, 4), 10) : 2024,
      cover: getHighResArtwork(a.artworkUrl100),
      genre: a.primaryGenreName || genre,
      trackCount: a.trackCount || 10,
    }));

    // 4. Format Top Playable Songs
    const topSongs: LiveSearchTrack[] = rawSongs.map((s: any) => ({
      id: String(s.trackId),
      title: s.trackName,
      artist: s.artistName,
      album: s.collectionName,
      albumSlug: String(s.collectionId),
      cover: getHighResArtwork(s.artworkUrl100),
      duration: msToDuration(s.trackTimeMillis),
      previewUrl: s.previewUrl || undefined,
    }));

    // 5. Generate Gemini AI Artist Retrospective
    const aiAnalysis = await generateAIArtistAnalysis({
      artist: artistName,
      origin,
      genre,
      keyWorks: albums.slice(0, 3).map((a) => a.title),
    });

    return {
      name: artistName,
      slug: artistName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      origin,
      genre,
      image: artistImage,
      bio: aiAnalysis.biography,
      legacy: aiAnalysis.legacy,
      sonicSignature: aiAnalysis.sonicSignature,
      recommendedListen: aiAnalysis.recommendedListen,
      topSongs,
      albums,
    };
  } catch (err) {
    console.error('Error fetching live artist:', err);
  }

  // Universal Fallback: synthesize artist so page never gives 404
  const fallbackName = nameQuery.replace(/\b\w/g, (c) => c.toUpperCase());
  const aiAnalysis = await generateAIArtistAnalysis({
    artist: fallbackName,
    origin: 'International',
    genre: 'Contemporary',
  });

  return {
    name: fallbackName,
    slug: slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    origin: 'International',
    genre: 'Contemporary',
    image: '/placeholder.svg',
    bio: aiAnalysis.biography,
    legacy: aiAnalysis.legacy,
    sonicSignature: aiAnalysis.sonicSignature,
    recommendedListen: aiAnalysis.recommendedListen,
    topSongs: [],
    albums: [],
  };
}

export interface LiveTrackDetails {
  id: string;
  title: string;
  artist: string;
  artistSlug: string;
  album: string;
  albumSlug: string;
  trackNumber: number;
  year: number;
  duration: string;
  cover: string;
  genre: string;
  previewUrl?: string;
  externalUrl?: string;
  analysis: GeminiTrackAnalysis;
  sisterTracks: {
    id: string;
    n: number;
    title: string;
    duration: string;
    previewUrl?: string;
  }[];
}

/**
 * Fetches real song details, 30s playable audio, parent album, and Gemini AI track critique.
 */
export async function getLiveTrack(idOrSlug: string): Promise<LiveTrackDetails | null> {
  const queryClean = decodeURIComponent(idOrSlug).trim();

  // 1. Check if query is in format "albumSlug-trackNumber" e.g. "in-rainbows-1" or "blonde-9"
  const slugNumMatch = queryClean.match(/^(.*?)[-:](\d+)$/);
  if (slugNumMatch) {
    const albumSlug = slugNumMatch[1];
    const trackNum = parseInt(slugNumMatch[2], 10);
    const matchedAlbum = fallbackAlbums.find(
      (a) => a.slug === albumSlug || a.slug.toLowerCase() === albumSlug.toLowerCase()
    );
    if (matchedAlbum) {
      const t = matchedAlbum.tracks.find((trk) => trk.n === trackNum) || matchedAlbum.tracks[trackNum - 1];
      if (t) {
        const analysis = await generateAITrackAnalysis({
          title: t.title,
          artist: matchedAlbum.artist,
          album: matchedAlbum.title,
          year: matchedAlbum.year,
          genre: matchedAlbum.genre,
        });

        return {
          id: `${matchedAlbum.slug}-${t.n}`,
          title: t.title,
          artist: matchedAlbum.artist,
          artistSlug: matchedAlbum.artistSlug,
          album: matchedAlbum.title,
          albumSlug: matchedAlbum.slug,
          trackNumber: t.n,
          year: matchedAlbum.year,
          duration: t.duration,
          cover: matchedAlbum.cover,
          genre: matchedAlbum.genre,
          previewUrl: t.previewUrl,
          analysis,
          sisterTracks: matchedAlbum.tracks.map((s) => ({
            id: `${matchedAlbum.slug}-${s.n}`,
            n: s.n,
            title: s.title,
            duration: s.duration,
            previewUrl: s.previewUrl,
          })),
        };
      }
    }
  }

  // 2. Check if it matches any track in fallback albums by title or slug
  const normalizedQuery = queryClean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  for (const a of fallbackAlbums) {
    const t = a.tracks.find((trk) => {
      const trkSlug = trk.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return trkSlug === normalizedQuery || trk.title.toLowerCase() === queryClean.toLowerCase();
    });
    if (t) {
      const analysis = await generateAITrackAnalysis({
        title: t.title,
        artist: a.artist,
        album: a.title,
        year: a.year,
        genre: a.genre,
      });

      return {
        id: `${a.slug}-${t.n}`,
        title: t.title,
        artist: a.artist,
        artistSlug: a.artistSlug,
        album: a.title,
        albumSlug: a.slug,
        trackNumber: t.n,
        year: a.year,
        duration: t.duration,
        cover: a.cover,
        genre: a.genre,
        previewUrl: t.previewUrl,
        analysis,
        sisterTracks: a.tracks.map((s) => ({
          id: `${a.slug}-${s.n}`,
          n: s.n,
          title: s.title,
          duration: s.duration,
          previewUrl: s.previewUrl,
        })),
      };
    }
  }

  // 3. Query iTunes API
  try {
    let trackItem: any = null;

    // A. If numeric iTunes trackId
    if (/^\d+$/.test(queryClean)) {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${queryClean}`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      );
      if (res.ok) {
        const data = await res.json();
        trackItem = data.results?.[0];
      }
    }

    // B. Search for song name
    if (!trackItem) {
      const searchTerm = queryClean.replace(/-/g, ' ');
      const searchRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=1`,
        { headers: { 'User-Agent': 'Sonora/1.0.0' } }
      );
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        trackItem = searchData.results?.[0];
      }
    }

    if (trackItem) {
      const title = trackItem.trackName;
      const artist = trackItem.artistName;
      const album = trackItem.collectionName || 'Single';
      const albumId = trackItem.collectionId ? String(trackItem.collectionId) : '';
      const year = trackItem.releaseDate
        ? parseInt(trackItem.releaseDate.slice(0, 4), 10)
        : 2024;
      const cover = getHighResArtwork(trackItem.artworkUrl100);
      const genre = trackItem.primaryGenreName || 'Music';
      const duration = msToDuration(trackItem.trackTimeMillis);
      const trackNumber = trackItem.trackNumber || 1;
      const previewUrl = trackItem.previewUrl || undefined;

      // Fetch Sister Tracks from parent album
      let sisterTracks: { id: string; n: number; title: string; duration: string; previewUrl?: string }[] = [];
      if (albumId) {
        try {
          const albRes = await fetch(
            `https://itunes.apple.com/lookup?id=${albumId}&entity=song`,
            { headers: { 'User-Agent': 'Sonora/1.0.0' } }
          );
          if (albRes.ok) {
            const albData = await albRes.json();
            const items = albData.results || [];
            sisterTracks = items.slice(1).map((s: any, idx: number) => ({
              id: String(s.trackId),
              n: s.trackNumber || idx + 1,
              title: s.trackName,
              duration: msToDuration(s.trackTimeMillis),
              previewUrl: s.previewUrl || undefined,
            }));
          }
        } catch (_) {}
      }

      // Generate Gemini AI Track Critique
      const analysis = await generateAITrackAnalysis({
        title,
        artist,
        album,
        year,
        genre,
      });

      return {
        id: String(trackItem.trackId),
        title,
        artist,
        artistSlug: artist.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        album,
        albumSlug: albumId,
        trackNumber,
        year,
        duration,
        cover,
        genre,
        previewUrl,
        externalUrl: trackItem.trackViewUrl,
        analysis,
        sisterTracks,
      };
    }
  } catch (err) {
    console.error('Error fetching live track:', err);
  }

  // 4. Universal Fallback: If title exists, synthesize so page never gives 404
  const fallbackTitle = queryClean
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const analysis = await generateAITrackAnalysis({
    title: fallbackTitle,
    artist: 'Featured Artist',
    album: 'Official Release',
    year: 2024,
    genre: 'Contemporary',
  });

  return {
    id: queryClean,
    title: fallbackTitle,
    artist: 'Featured Artist',
    artistSlug: 'featured-artist',
    album: 'Official Release',
    albumSlug: 'in-rainbows',
    trackNumber: 1,
    year: 2024,
    duration: '3:45',
    cover: '/placeholder.svg',
    genre: 'Contemporary',
    analysis,
    sisterTracks: [],
  };
}
