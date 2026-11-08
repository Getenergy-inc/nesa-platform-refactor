/**
 * NESA-Africa 2026 — canonical public nomination and certificate window.
 * Every public surface imports these values; no earlier September/October/
 * November windows remain valid.
 */
export const NOMINATIONS_OPEN_ISO = "2026-11-09";
export const NOMINATIONS_CLOSE_ISO = "2027-03-31";
export const NOMINATIONS_OPEN_LABEL = "9 November 2026";
export const NOMINATIONS_CLOSE_LABEL = "31 March 2027";
export const NOMINATION_WINDOW_LABEL = "9 November 2026 – 31 March 2027";

/** All pathways, including Africa Education Icon, use the same public window. */
export const ICON_WINDOW_OPEN_ISO = NOMINATIONS_OPEN_ISO;
export const ICON_WINDOW_CLOSE_ISO = NOMINATIONS_CLOSE_ISO;
export const ICON_WINDOW_LABEL = NOMINATION_WINDOW_LABEL;
export const ICON_WINDOW_CLOSE_LABEL = NOMINATIONS_CLOSE_LABEL;

/** Verified contributors may download continuously throughout this window. */
export const CERTIFICATE_WINDOW_OPEN_ISO = NOMINATIONS_OPEN_ISO;
export const CERTIFICATE_WINDOW_CLOSE_ISO = NOMINATIONS_CLOSE_ISO;
export const CERTIFICATE_WINDOW_LABEL = NOMINATION_WINDOW_LABEL;
export const CERTIFICATE_WINDOW_CLOSE_LABEL = NOMINATIONS_CLOSE_LABEL;

/** Detailed judging milestones are not supplied by the approved brief. */
export const ICON_JUDGING_WINDOW_LABEL = "CONTENT REQUIRED";
export const ICON_RECIPIENTS_CONFIRMED_LABEL = "CONTENT REQUIRED";
