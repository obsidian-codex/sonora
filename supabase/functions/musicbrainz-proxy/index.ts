/**
 * MusicBrainz Proxy — Supabase Edge Function
 *
 * Proxies all MusicBrainz API requests from the Sonora frontend.
 * Enforces the mandatory 1-request/second rate limit, sets a proper
 * User-Agent header, and caches responses in the Supabase database
 * so repeated lookups are instant and free.
 *
 * Route via the `action` query parameter:
 *   search-albums | search-artists | get-album | get-artist | get-release | get-cover-art
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Constants ───────────────────────────────────────────────────────────────

const MB_BASE = "https://musicbrainz.org/ws/2";
const CAA_BASE = "https://coverartarchive.org";
const USER_AGENT = "Sonora/0.1 (contact@sonora.app)";
const CACHE_TTL_DAYS = 7;
const FETCH_TIMEOUT_MS = 8_000;

// ─── CORS headers (auth handled by Supabase separately) ─────────────────────

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-client-info, apikey",
};

// ─── Rate-limiter (in-memory, per-isolate) ──────────────────────────────────
// MusicBrainz allows at most 1 request per second. We maintain a simple
// serial queue: each outgoing request records its timestamp and the next
// one waits until at least 1 000 ms have elapsed.

let lastRequestTimestamp = 0;

async function rateLimitedFetch(url: string, init?: RequestInit): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTimestamp;
  if (elapsed < 1_000) {
    await new Promise((resolve) => setTimeout(resolve, 1_000 - elapsed));
  }
  lastRequestTimestamp = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(init?.headers ?? {}),
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Type definitions ───────────────────────────────────────────────────────

/** Supported proxy actions (route via ?action=…) */
type Action =
  | "search-albums"
  | "search-artists"
  | "get-album"
  | "get-artist"
  | "get-release"
  | "get-cover-art";

/** Cleaned album shape returned to the frontend */
interface CleanAlbum {
  mbid: string;
  title: string;
  artistName: string;
  artistMbid: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  albumType: string | null;
  genres: string[];
  releases: CleanReleaseSummary[];
}

/** Minimal release reference attached to an album result */
interface CleanReleaseSummary {
  mbid: string;
  title: string;
  date: string | null;
  country: string | null;
  status: string | null;
}

/** Cleaned artist shape */
interface CleanArtist {
  mbid: string;
  name: string;
  sortName: string | null;
  type: string | null;
  country: string | null;
  beginDate: string | null;
  endDate: string | null;
  disambiguation: string | null;
  releaseGroups: CleanArtistReleaseGroup[];
}

/** Release-group summary nested inside an artist result */
interface CleanArtistReleaseGroup {
  mbid: string;
  title: string;
  primaryType: string | null;
  firstReleaseDate: string | null;
}

/** Cleaned release (with tracklist) */
interface CleanRelease {
  mbid: string;
  title: string;
  date: string | null;
  country: string | null;
  tracks: CleanTrack[];
}

interface CleanTrack {
  mbid: string | null;
  title: string;
  position: number;
  discNumber: number;
  durationMs: number | null;
}

/** Search result wrapper */
interface SearchResult<T> {
  query: string;
  count: number;
  results: T[];
}

// ─── Supabase client helper ──────────────────────────────────────────────────

function getSupabaseAdmin(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// ─── Cache helpers ───────────────────────────────────────────────────────────

/**
 * Check whether we have a cached MusicBrainz response that is still fresh.
 * Returns the cached JSON payload or null.
 */
async function getCachedResponse(
  supabase: SupabaseClient,
  cacheKey: string,
): Promise<unknown | null> {
  const { data, error } = await supabase
    .from("cached_metadata")
    .select("payload, cached_at")
    .eq("cache_key", cacheKey)
    .maybeSingle();

  if (error || !data) return null;

  const cachedAt = new Date(data.cached_at).getTime();
  const age = Date.now() - cachedAt;
  if (age > CACHE_TTL_DAYS * 24 * 60 * 60 * 1_000) return null;

  return data.payload;
}

/**
 * Upsert a MusicBrainz response into the cache table.
 */
async function setCachedResponse(
  supabase: SupabaseClient,
  cacheKey: string,
  payload: unknown,
): Promise<void> {
  await supabase.from("cached_metadata").upsert(
    {
      cache_key: cacheKey,
      payload,
      cached_at: new Date().toISOString(),
    },
    { onConflict: "cache_key" },
  );
}

// ─── Response builders ──────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      ...(extraHeaders ?? {}),
    },
  });
}

function errorResponse(message: string, status: number, extraHeaders?: Record<string, string>): Response {
  return jsonResponse({ error: message }, status, extraHeaders);
}

// ─── Data transformers ──────────────────────────────────────────────────────
// Convert MusicBrainz's verbose JSON into the cleaner shapes defined above.

function extractYear(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const year = parseInt(dateStr.substring(0, 4), 10);
  return isNaN(year) ? null : year;
}

/** Normalise album type string from MusicBrainz primary-type */
function normaliseAlbumType(primaryType?: string | null): string | null {
  if (!primaryType) return null;
  const lower = primaryType.toLowerCase();
  const map: Record<string, string> = {
    album: "album",
    ep: "ep",
    single: "single",
    compilation: "compilation",
    live: "live",
    soundtrack: "soundtrack",
    broadcast: "other",
    other: "other",
  };
  return map[lower] ?? "other";
}

// deno-lint-ignore no-explicit-any
function transformAlbumSearch(raw: any, query: string): SearchResult<CleanAlbum> {
  // deno-lint-ignore no-explicit-any
  const releaseGroups: any[] = raw["release-groups"] ?? [];
  return {
    query,
    count: raw.count ?? releaseGroups.length,
    results: releaseGroups.map(transformReleaseGroup),
  };
}

// deno-lint-ignore no-explicit-any
function transformReleaseGroup(rg: any): CleanAlbum {
  // deno-lint-ignore no-explicit-any
  const firstArtist = rg["artist-credit"]?.[0]?.artist ?? ({} as any);
  return {
    mbid: rg.id,
    title: rg.title ?? "",
    artistName: rg["artist-credit"]?.[0]?.name ?? firstArtist.name ?? "Unknown Artist",
    artistMbid: firstArtist.id ?? null,
    releaseDate: rg["first-release-date"] ?? null,
    releaseYear: extractYear(rg["first-release-date"]),
    albumType: normaliseAlbumType(rg["primary-type"]),
    // deno-lint-ignore no-explicit-any
    genres: (rg.genres ?? []).map((g: any) => g.name as string),
    releases: (rg.releases ?? []).map(transformReleaseSummary),
  };
}

// deno-lint-ignore no-explicit-any
function transformReleaseSummary(r: any): CleanReleaseSummary {
  return {
    mbid: r.id,
    title: r.title ?? "",
    date: r.date ?? null,
    country: r.country ?? null,
    status: r.status ?? null,
  };
}

// deno-lint-ignore no-explicit-any
function transformArtistSearch(raw: any, query: string): SearchResult<CleanArtist> {
  // deno-lint-ignore no-explicit-any
  const artists: any[] = raw.artists ?? [];
  return {
    query,
    count: raw.count ?? artists.length,
    results: artists.map(transformArtist),
  };
}

// deno-lint-ignore no-explicit-any
function transformArtist(a: any): CleanArtist {
  return {
    mbid: a.id,
    name: a.name ?? "",
    sortName: a["sort-name"] ?? null,
    type: a.type ?? null,
    country: a.country ?? null,
    beginDate: a["life-span"]?.begin ?? null,
    endDate: a["life-span"]?.end ?? null,
    disambiguation: a.disambiguation || null,
    releaseGroups: (a["release-groups"] ?? []).map(transformArtistReleaseGroup),
  };
}

// deno-lint-ignore no-explicit-any
function transformArtistReleaseGroup(rg: any): CleanArtistReleaseGroup {
  return {
    mbid: rg.id,
    title: rg.title ?? "",
    primaryType: normaliseAlbumType(rg["primary-type"]),
    firstReleaseDate: rg["first-release-date"] ?? null,
  };
}

// deno-lint-ignore no-explicit-any
function transformRelease(raw: any): CleanRelease {
  // deno-lint-ignore no-explicit-any
  const media: any[] = raw.media ?? [];
  const tracks: CleanTrack[] = [];

  for (const medium of media) {
    const discNumber: number = medium.position ?? 1;
    // deno-lint-ignore no-explicit-any
    for (const t of medium.tracks ?? []) {
      tracks.push({
        mbid: t.recording?.id ?? t.id ?? null,
        title: t.title ?? t.recording?.title ?? "",
        position: t.position ?? t.number ?? 0,
        discNumber,
        durationMs: t.length ?? t.recording?.length ?? null,
      });
    }
  }

  return {
    mbid: raw.id,
    title: raw.title ?? "",
    date: raw.date ?? null,
    country: raw.country ?? null,
    tracks,
  };
}

// ─── Action handlers ────────────────────────────────────────────────────────

async function handleSearchAlbums(
  params: URLSearchParams,
  supabase: SupabaseClient,
): Promise<Response> {
  const term = params.get("term");
  if (!term) return errorResponse("Missing required parameter: term", 400);
  const limit = Math.min(Math.max(parseInt(params.get("limit") ?? "25", 10) || 25, 1), 100);

  const cacheKey = `search-albums:${term}:${limit}`;
  const cached = await getCachedResponse(supabase, cacheKey);
  if (cached) return jsonResponse(cached);

  const url = `${MB_BASE}/release-group?query=${encodeURIComponent(term)}&limit=${limit}&fmt=json`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const raw = await res.json();
  const clean = transformAlbumSearch(raw, term);

  // Cache in background — don't block the response
  setCachedResponse(supabase, cacheKey, clean).catch(() => {});

  return jsonResponse(clean);
}

async function handleSearchArtists(
  params: URLSearchParams,
  supabase: SupabaseClient,
): Promise<Response> {
  const term = params.get("term");
  if (!term) return errorResponse("Missing required parameter: term", 400);
  const limit = Math.min(Math.max(parseInt(params.get("limit") ?? "25", 10) || 25, 1), 100);

  const cacheKey = `search-artists:${term}:${limit}`;
  const cached = await getCachedResponse(supabase, cacheKey);
  if (cached) return jsonResponse(cached);

  const url = `${MB_BASE}/artist?query=${encodeURIComponent(term)}&limit=${limit}&fmt=json`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const raw = await res.json();
  const clean = transformArtistSearch(raw, term);

  setCachedResponse(supabase, cacheKey, clean).catch(() => {});

  return jsonResponse(clean);
}

async function handleGetAlbum(
  params: URLSearchParams,
  supabase: SupabaseClient,
): Promise<Response> {
  const mbid = params.get("mbid");
  if (!mbid || !isValidMbid(mbid)) return errorResponse("Missing or invalid MBID", 400);

  const cacheKey = `get-album:${mbid}`;
  const cached = await getCachedResponse(supabase, cacheKey);
  if (cached) return jsonResponse(cached);

  const url = `${MB_BASE}/release-group/${mbid}?inc=artists+genres+releases&fmt=json`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const raw = await res.json();
  const clean = transformReleaseGroup(raw);

  // Upsert into the albums/artists tables for permanent local data
  upsertAlbumData(supabase, clean).catch(() => {});
  setCachedResponse(supabase, cacheKey, clean).catch(() => {});

  return jsonResponse(clean);
}

async function handleGetArtist(
  params: URLSearchParams,
  supabase: SupabaseClient,
): Promise<Response> {
  const mbid = params.get("mbid");
  if (!mbid || !isValidMbid(mbid)) return errorResponse("Missing or invalid MBID", 400);

  const cacheKey = `get-artist:${mbid}`;
  const cached = await getCachedResponse(supabase, cacheKey);
  if (cached) return jsonResponse(cached);

  const url = `${MB_BASE}/artist/${mbid}?inc=release-groups&type=album&fmt=json`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const raw = await res.json();
  const clean = transformArtist(raw);

  upsertArtistData(supabase, clean).catch(() => {});
  setCachedResponse(supabase, cacheKey, clean).catch(() => {});

  return jsonResponse(clean);
}

async function handleGetRelease(
  params: URLSearchParams,
  supabase: SupabaseClient,
): Promise<Response> {
  const mbid = params.get("mbid");
  if (!mbid || !isValidMbid(mbid)) return errorResponse("Missing or invalid MBID", 400);

  const cacheKey = `get-release:${mbid}`;
  const cached = await getCachedResponse(supabase, cacheKey);
  if (cached) return jsonResponse(cached);

  const url = `${MB_BASE}/release/${mbid}?inc=recordings&fmt=json`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const raw = await res.json();
  const clean = transformRelease(raw);

  setCachedResponse(supabase, cacheKey, clean).catch(() => {});

  return jsonResponse(clean);
}

async function handleGetCoverArt(params: URLSearchParams): Promise<Response> {
  const mbid = params.get("mbid");
  if (!mbid || !isValidMbid(mbid)) return errorResponse("Missing or invalid MBID", 400);

  // Cover Art Archive — just proxy through, let browser cache handle it.
  // No need to cache in DB; the images are large and CDN-served.
  const url = `${CAA_BASE}/release/${mbid}/`;
  const res = await rateLimitedFetch(url);
  if (!res.ok) return handleMbError(res);

  const body = await res.json();

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400", // browser-cache 24h
      ...CORS_HEADERS,
    },
  });
}

// ─── DB upsert helpers ──────────────────────────────────────────────────────
// These silently write album/artist rows so the local DB accumulates data
// over time. Errors are swallowed — caching is best-effort.

async function upsertAlbumData(supabase: SupabaseClient, album: CleanAlbum): Promise<void> {
  // Upsert the artist first (if we have the MBID)
  if (album.artistMbid) {
    await supabase.from("artists").upsert(
      {
        mbid: album.artistMbid,
        name: album.artistName,
        cached_at: new Date().toISOString(),
      },
      { onConflict: "mbid" },
    );
  }

  // Upsert the album (release-group)
  const releaseMbid = album.releases?.[0]?.mbid ?? null;
  await supabase.from("albums").upsert(
    {
      mbid: album.mbid,
      release_mbid: releaseMbid,
      title: album.title,
      artist_name: album.artistName,
      artist_mbid: album.artistMbid,
      release_date: album.releaseDate,
      release_year: album.releaseYear,
      album_type: album.albumType,
      genres: album.genres,
      cached_at: new Date().toISOString(),
    },
    { onConflict: "mbid" },
  );
}

async function upsertArtistData(supabase: SupabaseClient, artist: CleanArtist): Promise<void> {
  await supabase.from("artists").upsert(
    {
      mbid: artist.mbid,
      name: artist.name,
      sort_name: artist.sortName,
      artist_type: artist.type,
      country: artist.country,
      begin_date: artist.beginDate,
      end_date: artist.endDate,
      disambiguation: artist.disambiguation,
      cached_at: new Date().toISOString(),
    },
    { onConflict: "mbid" },
  );
}

// ─── Error handling ─────────────────────────────────────────────────────────

function handleMbError(res: Response): Response {
  switch (res.status) {
    case 404:
      return errorResponse("Resource not found on MusicBrainz", 404);
    case 503: {
      const retryAfter = res.headers.get("Retry-After") ?? "2";
      return errorResponse("MusicBrainz is temporarily unavailable — please retry", 503, {
        "Retry-After": retryAfter,
      });
    }
    case 400:
      return errorResponse("Bad request to MusicBrainz — check your parameters", 400);
    default:
      return errorResponse(`MusicBrainz returned unexpected status ${res.status}`, 502);
  }
}

// ─── Validation helpers ─────────────────────────────────────────────────────

const MBID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidMbid(value: string): boolean {
  return MBID_RE.test(value);
}

function isValidAction(value: string): value is Action {
  const actions: Action[] = [
    "search-albums",
    "search-artists",
    "get-album",
    "get-artist",
    "get-release",
    "get-cover-art",
  ];
  return actions.includes(value as Action);
}

// ─── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Only GET requests are supported
  if (req.method !== "GET") {
    return errorResponse("Method not allowed — use GET", 405);
  }

  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    const action = params.get("action");

    if (!action || !isValidAction(action)) {
      return errorResponse(
        `Invalid or missing action. Supported: search-albums, search-artists, get-album, get-artist, get-release, get-cover-art`,
        400,
      );
    }

    // Cover art doesn't need a Supabase client (no caching in DB)
    if (action === "get-cover-art") {
      return await handleGetCoverArt(params);
    }

    const supabase = getSupabaseAdmin();

    switch (action) {
      case "search-albums":
        return await handleSearchAlbums(params, supabase);
      case "search-artists":
        return await handleSearchArtists(params, supabase);
      case "get-album":
        return await handleGetAlbum(params, supabase);
      case "get-artist":
        return await handleGetArtist(params, supabase);
      case "get-release":
        return await handleGetRelease(params, supabase);
      default:
        return errorResponse("Unknown action", 400);
    }
  } catch (err: unknown) {
    // AbortError from our timeout controller means the upstream took > 8 s
    if (err instanceof DOMException && err.name === "AbortError") {
      return errorResponse("MusicBrainz request timed out (>8 s)", 504);
    }
    console.error("[musicbrainz-proxy] Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return errorResponse(message, 500);
  }
});
