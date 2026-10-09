/**
 * Global programme configuration — SINGLE SOURCE OF TRUTH.
 *
 * The NESA-Africa 2026 programme end date (Gold-Blue Garnet Awards Gala)
 * must never be hard-coded in components. Import from here instead.
 */

/** ISO date (no time) of the programme end / Gala day. */
export const PROGRAMME_END_DATE = "2026-12-13";

/** Full ISO timestamp of the Gala start (West Africa Time). */
export const PROGRAMME_END_DATETIME = "2026-12-13T18:00:00+01:00";

/** Date object for the Gala start (18:00 WAT). */
export const PROGRAMME_END = new Date(PROGRAMME_END_DATETIME);

/**
 * CANONICAL COUNTDOWN TARGET — every Gala countdown on the site must use this.
 * Gala day begins 13 December 2026, 00:00 West Africa Time (UTC+1).
 * Do not hard-code this value in components.
 */
export const GALA_COUNTDOWN_DATETIME = "2026-12-13T00:00:00+01:00";
export const GALA_COUNTDOWN_TARGET = new Date(GALA_COUNTDOWN_DATETIME);

/** Human-readable label used across the site. */
export const PROGRAMME_END_LABEL = "13 December 2026";

/** Long label including venue context. */
export const PROGRAMME_END_LONG_LABEL = "Sunday, 13 December 2026 · Lagos, Nigeria";

/** Post-award legacy window (Rebuild My School Africa etc.). */
export const LEGACY_WINDOW_LABEL = "December 2026 – December 2027";

export function formatProgrammeEnd(
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return PROGRAMME_END.toLocaleDateString(locale, options);
}
