/**
 * Utility functions for formatting and styling scores across SONORA.
 */

/**
 * Returns Tailwind text color class based on score (1-10 scale).
 * Matches the 5-level score color system from DESIGN.md.
 */
export function getScoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'text-content-muted';
  if (score >= 9) return 'text-score-5'; // 9-10: excellent (muted green)
  if (score >= 7) return 'text-score-4'; // 7-8: good (soft lime)
  if (score >= 6) return 'text-score-3'; // 6: average (champagne)
  if (score >= 4) return 'text-score-2'; // 4-5: below average (amber)
  return 'text-score-1';                 // 1-3: low (muted red)
}

/**
 * Returns Tailwind background color class for badges/chips based on score.
 */
export function getScoreBgColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'bg-content-muted/10 text-content-muted';
  if (score >= 9) return 'bg-score-5/15 text-score-5';
  if (score >= 7) return 'bg-score-4/15 text-score-4';
  if (score >= 6) return 'bg-score-3/15 text-score-3';
  if (score >= 4) return 'bg-score-2/15 text-score-2';
  return 'bg-score-1/15 text-score-1';
}

/**
 * Formats a score to 1 decimal place (e.g. 7.4) or returns placeholder.
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '—';
  return score.toFixed(1);
}

/**
 * Returns an editorial qualitative label for a score.
 */
export function getScoreLabel(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'Unrated';
  if (score >= 9.0) return 'Essential';
  if (score >= 8.0) return 'Exceptional';
  if (score >= 7.0) return 'Recommended';
  if (score >= 6.0) return 'Solid';
  if (score >= 5.0) return 'Mixed';
  return 'Overlooked';
}

