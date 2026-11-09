/**
 * Utilities for image processing, fallbacks, and gradient generation.
 */

// Elegant muted dark color palette for fallback art based on DESIGN.md
const PALETTE = [
  ['#1e1b2e', '#2c1e28'], // deep violet - wine
  ['#142226', '#1c2e26'], // deep spruce - forest
  ['#26191b', '#3b2518'], // warm umber - terracotta
  ['#181a24', '#282436'], // slate navy - mauve
  ['#231d16', '#332717'], // espresso - bronze
  ['#1b2326', '#17272b'], // petrol - deep teal
  ['#2b181e', '#1e1418'], // maroon - velvet black
  ['#1b1c1e', '#2a2621'], // charcoal - dark gold
];

/**
 * Computes a deterministic integer hash from a string.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generates a consistent 2-stop gradient derived from album title.
 */
export function generateAlbumGradient(title: string): { from: string; to: string; gradient: string } {
  const hash = hashString(title || 'Sonora');
  const pair = PALETTE[hash % PALETTE.length] || ['#141417', '#1C1C21'];
  const from = pair[0]!;
  const to = pair[1]!;
  return {
    from,
    to,
    gradient: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  };
}

/**
 * Gets initial character for placeholder artwork.
 */
export function getArtworkInitial(title: string): string {
  if (!title) return 'S';
  const clean = title.replace(/^(the|a|an)\s+/i, '').trim();
  return (clean[0] || 'S').toUpperCase();
}

