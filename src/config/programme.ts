/**
 * Global programme configuration — SINGLE SOURCE OF TRUTH.
 *
 * The NESA-Africa 2026 programme end date (Gold-Blue Garnet Awards Gala)
 * must never be hard-coded in components. Import from here instead.
 */

/** ISO date (no time) of the programme end / Gala day. */
export const PROGRAMME_END_DATE = "2026-12-14";

/** Full ISO timestamp of the Gala start (West Africa Time). */
export const PROGRAMME_END_DATETIME = "2026-12-14T18:00:00+01:00";

/** Date object for countdowns. */
export const PROGRAMME_END = new Date(PROGRAMME_END_DATETIME);

/** Human-readable label used across the site. */
export const PROGRAMME_END_LABEL = "14 December 2026";

/** Long label including venue context. */
export const PROGRAMME_END_LONG_LABEL = "Monday, 14 December 2026 · Lagos, Nigeria";

/** Post-award legacy window (Rebuild My School Africa etc.). */
export const LEGACY_WINDOW_LABEL = "December 2026 – December 2027";

export function formatProgrammeEnd(
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return PROGRAMME_END.toLocaleDateString(locale, options);
}
