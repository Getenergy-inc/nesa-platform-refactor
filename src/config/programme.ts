/**
 * Global programme configuration — SINGLE SOURCE OF TRUTH.
 *
 * The NESA-Africa 2026 Online Awards Gala date
 * must never be hard-coded in components. Import from here instead.
 */

import commonEnglish from "@/locales/en/common.json";

/** Presentation-only gala scope; never changes legacy award eligibility. */
export const ONLINE_GALA = {
  maximumIcons: 9,
  productionParticipants: { approximateMinimum: 20, approximateMaximum: 30 },
  onlineOnly: true,
  publicVoting: false,
  ticketSales: false,
  continuingRecognitionEndsOn: "2027-03-31",
  copy: commonEnglish.onlineGala,
} as const;

/** ISO date (no time) of the Online Awards Gala day. */
export const PROGRAMME_END_DATE = "2026-12-13";

/** Full ISO timestamp of the Gala start (West Africa Time). */
export const PROGRAMME_END_DATETIME = "2026-12-13T18:00:00+01:00";

/** Date object for the Gala start (18:00 WAT). */
export const PROGRAMME_END = new Date(PROGRAMME_END_DATETIME);

/**
 * CANONICAL COUNTDOWN TARGET — every Gala countdown on the site must use this.
 * Programme day begins 13 December 2026, 00:00 West Africa Time (UTC+1).
 * Do not hard-code this value in components.
 */
export const GALA_COUNTDOWN_DATETIME = "2026-12-13T00:00:00+01:00";
export const GALA_COUNTDOWN_TARGET = new Date(GALA_COUNTDOWN_DATETIME);

/** Human-readable label used across the site. */
export const PROGRAMME_END_LABEL = "Sunday 13 December 2026";

/** Long label including the approved attendance mode. */
export const PROGRAMME_END_LONG_LABEL = "Sunday 13 December 2026 · Online";

/** Post-award legacy window (Rebuild My School Africa etc.). */
export const LEGACY_WINDOW_LABEL = "December 2026 – December 2027";

export function formatProgrammeEnd(
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  return PROGRAMME_END.toLocaleDateString(locale, options);
}
