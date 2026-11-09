import { supabase } from './supabase';

// ─── MusicBrainz search result types ─────────────────────────────────────────

export interface AlbumSearchResult {
  mbid: string;
  title: string;
  artistName: string;
  artistMbid: string;
  releaseYear: number | null;
  albumType: string | null;
  /** MusicBrainz search relevance score (0–100) */
  score: number;
}

export interface ArtistSearchResult {
  mbid: string;
  name: string;
  sortName: string;
  country: string | null;
  type: string | null;
  score: number;
}

// ─── MusicBrainz detail types ────────────────────────────────────────────────

export interface AlbumDetail {
  mbid: string;
  title: string;
  artists: Array<{ mbid: string; name: string; joinPhrase?: string }>;
  genres: string[];
  releases: Array<{
    mbid: string;
    date: string | null;
    country: string | null;
    status: string | null;
    barcode: string | null;
  }>;
  releaseDate: string | null;
}

export interface ArtistDetail {
  mbid: string;
  name: string;
  sortName: string;
  country: string | null;
  type: string | null;
  releaseGroups: Array<{
    mbid: string;
    title: string;
    primaryType: string | null;
    firstReleaseDate: string | null;
  }>;
}

export interface MBTrack {
  mbid: string;
  title: string;
  position: number;
  length: number | null;
  discNumber: number;
}

// ─── Proxy invocation helper ─────────────────────────────────────────────────

interface ProxyPayload {
  action: string;
  [key: string]: unknown;
}

/**
 * Invokes the `musicbrainz-proxy` Edge Function.
 * Throws on network/function errors with a descriptive message.
 */
async function invokeProxy<T>(payload: ProxyPayload): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(
    'musicbrainz-proxy',
    { body: payload },
  );

  if (error) {
    throw new Error(`MusicBrainz proxy error (${payload.action}): ${error.message}`);
  }

  if (data === null || data === undefined) {
    throw new Error(`MusicBrainz proxy returned empty response for action "${payload.action}"`);
  }

  return data;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Search for albums (release groups) via the MusicBrainz proxy.
 * @param query  Free-text search query.
 * @param limit  Max results to return (default 25, max 100).
 */
export async function searchAlbums(
  query: string,
  limit: number = 25,
): Promise<AlbumSearchResult[]> {
  return invokeProxy<AlbumSearchResult[]>({
    action: 'search-albums',
    query,
    limit,
  });
}

/**
 * Search for artists via the MusicBrainz proxy.
 */
export async function searchArtists(
  query: string,
  limit: number = 25,
): Promise<ArtistSearchResult[]> {
  return invokeProxy<ArtistSearchResult[]>({
    action: 'search-artists',
    query,
    limit,
  });
}

/**
 * Fetch full album (release-group) details by MusicBrainz ID.
 */
export async function getAlbum(mbid: string): Promise<AlbumDetail> {
  return invokeProxy<AlbumDetail>({
    action: 'get-album',
    mbid,
  });
}

/**
 * Fetch full artist details by MusicBrainz ID.
 */
export async function getArtist(mbid: string): Promise<ArtistDetail> {
  return invokeProxy<ArtistDetail>({
    action: 'get-artist',
    mbid,
  });
}

/**
 * Fetch the track listing for a specific release.
 * @param releaseMbid  The MBID of a *release* (not release-group).
 */
export async function getReleaseTracks(releaseMbid: string): Promise<MBTrack[]> {
  return invokeProxy<MBTrack[]>({
    action: 'get-tracks',
    releaseMbid,
  });
}
