/**
 * Cover Art Archive helpers.
 *
 * The Cover Art Archive (https://coverartarchive.org) serves images over a
 * public CDN, so most requests go directly from the browser — no proxy needed.
 */

const CAA_BASE = 'https://coverartarchive.org';

type CoverSize = 'small' | 'large' | '250' | '500' | '1200';

/** Map friendly size names to CAA path segments */
const SIZE_MAP: Record<CoverSize, string> = {
  small: '250',
  large: '1200',
  '250': '250',
  '500': '500',
  '1200': '1200',
};

/**
 * Build the Cover Art Archive front-cover URL for a release.
 *
 * The returned URL can be used directly in `<img src>` — the CAA will
 * 307-redirect to the actual image on archive.org's CDN.
 *
 * @param releaseMbid  MBID of a MusicBrainz *release* (not release-group).
 * @param size         Desired thumbnail size (default `'500'`).
 */
export function getCoverArtUrl(
  releaseMbid: string,
  size: CoverSize = '500',
): string {
  const dimension = SIZE_MAP[size];
  return `${CAA_BASE}/release/${releaseMbid}/front-${dimension}`;
}

/**
 * Check whether Cover Art Archive has artwork for a release.
 *
 * Sends a lightweight HEAD request via an Edge Function to avoid CORS issues
 * when called from the browser. Returns `true` if artwork exists.
 */
export async function checkCoverArt(releaseMbid: string): Promise<boolean> {
  try {
    // Use a direct fetch with no-cors mode for a simple existence check.
    // The CAA returns 307 → 200 if art exists, or 404 if not.
    const response = await fetch(
      `${CAA_BASE}/release/${releaseMbid}/front`,
      { method: 'HEAD', redirect: 'follow' },
    );
    return response.ok;
  } catch {
    // Network error — assume no cover art
    return false;
  }
}

// ─── Fallback art generation ─────────────────────────────────────────────────

/** Deterministic string hash (djb2) */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Predefined gradient palettes mapped to broad genre families.
 * Falls back to a neutral palette when genre is unknown.
 */
const GENRE_GRADIENTS: Record<string, [string, string][]> = {
  rock:       [['#e74c3c', '#c0392b'], ['#d35400', '#e74c3c']],
  metal:      [['#2c3e50', '#000000'], ['#1a1a2e', '#16213e']],
  pop:        [['#e91e63', '#9c27b0'], ['#ff6f91', '#ff9671']],
  jazz:       [['#1a237e', '#4a148c'], ['#283593', '#1565c0']],
  blues:      [['#1565c0', '#0d47a1'], ['#1976d2', '#0277bd']],
  electronic: [['#00bcd4', '#7c4dff'], ['#18ffff', '#651fff']],
  hiphop:     [['#ff9800', '#f44336'], ['#ff6d00', '#d50000']],
  rap:        [['#ff9800', '#f44336'], ['#ff6d00', '#d50000']],
  classical:  [['#5d4037', '#795548'], ['#3e2723', '#4e342e']],
  country:    [['#f4a460', '#cd853f'], ['#deb887', '#d2691e']],
  folk:       [['#558b2f', '#33691e'], ['#689f38', '#2e7d32']],
  rnb:        [['#6a1b9a', '#ad1457'], ['#8e24aa', '#d81b60']],
  soul:       [['#6a1b9a', '#ad1457'], ['#8e24aa', '#d81b60']],
  punk:       [['#212121', '#f44336'], ['#263238', '#e53935']],
  reggae:     [['#2e7d32', '#f9a825'], ['#1b5e20', '#f57f17']],
  default:    [['#37474f', '#546e7a'], ['#455a64', '#607d8b']],
};

/**
 * Generate a deterministic fallback gradient + initial letter for albums
 * without cover artwork.
 *
 * @param albumTitle  The album title (used for hashing).
 * @param genres      Genre tags to influence the color palette.
 * @returns           CSS gradient string and first-letter initial.
 */
export function generateFallbackArt(
  albumTitle: string,
  genres: string[],
): { gradient: string; initial: string } {
  const hash = hashString(albumTitle);

  // Match the first recognised genre, or fall back
  const normalizedGenres = genres.map((g) => g.toLowerCase().replace(/[^a-z]/g, ''));
  const matchedKey =
    normalizedGenres.find((g) => g in GENRE_GRADIENTS) ?? 'default';
  const palettes = GENRE_GRADIENTS[matchedKey]!;

  const [from, to] = palettes[hash % palettes.length]!;

  const initial = albumTitle.trim().charAt(0).toUpperCase() || '?';

  return {
    gradient: `linear-gradient(135deg, ${from}, ${to})`,
    initial,
  };
}
