const DEFAULT_LOCALE = "en-US";

/**
 * Format a number using the given locale's digit grouping conventions.
 *
 * Prefer this over `.toLocaleString("en-US")` or `.toFixed()` for any
 * user-facing number display so that future locale additions (e.g., Arabic,
 * Hindi) are handled correctly without per-component updates.
 */
export function formatNumber(
  value: number,
  locale: string | string[] = DEFAULT_LOCALE
): string {
  return value.toLocaleString(locale);
}

/**
 * Format a byte count as a human-readable string with locale-aware digit grouping.
 *
 * Uses `formatNumber` internally so digit separators respect the user's locale.
 */
export function formatBytes(
  bytes: number,
  locale: string | string[] = DEFAULT_LOCALE
): string {
  if (bytes < 1024) return `${formatNumber(bytes, locale)} B`;
  if (bytes < 1024 * 1024) return `${formatNumber(+(bytes / 1024).toFixed(1), locale)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${formatNumber(+(bytes / (1024 * 1024)).toFixed(1), locale)} MB`;
  return `${formatNumber(+(bytes / (1024 * 1024 * 1024)).toFixed(2), locale)} GB`;
}

/**
 * Round a score value to two decimal places for display.
 * Returns "-" for null/undefined values.
 */
export function formatScore(score: number | null | undefined): string {
  if (score == null) return "-";
  return String(Math.round(score * 100) / 100);
}
