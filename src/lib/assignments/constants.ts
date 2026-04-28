/**
 * Default point value for assignment problems when `points` is null/undefined.
 *
 * The DB schema allows `points` to be nullable, but the UI requires a numeric
 * value for display and scoring. This constant centralizes the fallback so
 * the default is consistent across all 6+ locations that render or compute
 * problem points.
 */
export const DEFAULT_PROBLEM_POINTS = 100;
