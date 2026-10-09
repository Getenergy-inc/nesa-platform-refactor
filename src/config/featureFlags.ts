// NESA-Africa 2026 Feature Flags
// Central switchboard for gating features during the 60→38 page refactor.
//
// Rules:
// - Read via the exported constants only (never process.env directly in UI).
// - Removing a flag = removing all guarded code paths in the same PR.

/**
 * Public award voting for the 2026 season.
 *
 * 2026 policy: NO public award voting. All /vote* routes redirect to the
 * Recognition hub, MainNav omits Vote CTAs, and voting components archived
 * (not deleted) for potential post-2026 seasons.
 */
export const PUBLIC_AWARD_VOTING = false;

/**
 * Redirect target for archived voting routes while PUBLIC_AWARD_VOTING is off.
 */
export const VOTING_SUNSET_REDIRECT = "/awards/gold-blue-garnet";
