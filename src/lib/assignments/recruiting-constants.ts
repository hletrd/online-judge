/**
 * Shared constants and helpers for recruiting invitation routes.
 * Ensures consistent expiry limits and date computations across
 * single, bulk, PATCH, and API key routes.
 */

/** Maximum expiry duration from creation time (10 tropical years, accounting for leap days). */
export const MAX_EXPIRY_MS = 10 * 365.25 * 24 * 60 * 60 * 1000;

/** Milliseconds per day — used to convert expiryDays to a Date offset. */
const MS_PER_DAY = 86400000;

/**
 * Compute an expiry Date by adding whole days to a base timestamp.
 * Centralises the `new Date(base.getTime() + days * 86400000)` pattern
 * used across invitation and API key routes so the arithmetic cannot
 * drift between call sites.
 */
export function computeExpiryFromDays(baseDate: Date, expiryDays: number): Date {
  return new Date(baseDate.getTime() + expiryDays * MS_PER_DAY);
}
