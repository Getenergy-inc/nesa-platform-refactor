import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * Shared head metadata for every secure workspace (NRC Arena + Judges Arena).
 *
 * These are private, credentialed surfaces — they are always `noindex, nofollow`,
 * but they still carry consistent titles and Open Graph tokens so internally
 * shared links render with the same institutional arena branding.
 */

const SITE_URL = "https://nesaafrica.lovable.app";
const ARENA_OG_IMAGE = `${SITE_URL}/og-image.png`;
const SUITE = "NESA-Africa 2026";

export type ArenaWorkspace = "NRC Arena" | "Judges Arena";

const WORKSPACE_DESCRIPTION: Record<ArenaWorkspace, string> = {
  "NRC Arena":
    "Secure Nomination Review Committee workspace for NESA-Africa 2026 — verification queues, evidence review and audited handovers.",
  "Judges Arena":
    "Secure judging workspace for NESA-Africa 2026 — private deliberation, EDI Matrix scoring and fully audited decisions.",
};

/** Route → page title tokens, shared across both arenas. */
const ROUTE_TITLES: Array<[string, string]> = [
  // Judges Arena
  ["/judges-arena/nominees", "My Assignments"],
  ["/judges-arena/discussion", "Discussion Arena"],
  ["/judges-arena/rubric", "Scoring Rubrics"],
  ["/judges-arena/calendar", "Calendar & Deadlines"],
  ["/judges-arena/reports", "Reports"],
  ["/judges-arena/resources", "Resources"],
  ["/judges-arena", "Dashboard"],
  ["/judges/dashboard", "Dashboard"],
  ["/judges/chat", "Secure Judges Chat Rooms"],
  ["/judges/results", "Results Arena"],
  ["/judges/pathways", "Pathways"],
  ["/judges/directory", "Judges Directory"],
  ["/judges", "Judges Portal"],
  ["/judge", "Judges Arena"],
  // NRC Arena
  ["/nrc/dashboard/intake", "Intake Queue"],
  ["/nrc/dashboard/nominees", "Nominees"],
  ["/nrc/dashboard/my-reviews", "My Assigned Reviews"],
  ["/nrc/dashboard/queue", "Scoring Queue"],
  ["/nrc/dashboard/flagged", "Flagged Cases"],
  ["/nrc/dashboard/merge", "Merge & Dedup Tool"],
  ["/nrc/dashboard/edi-analytics", "EDI Analytics"],
  ["/nrc/dashboard/guidelines", "NRC Guidelines"],
  ["/nrc/dashboard", "Overview"],
  ["/nrc/cases", "My Assignments"],
  ["/nrc/teams", "Team Queue"],
  ["/nrc/automation", "Automation Engine"],
  ["/nrc/duplicates", "Duplicate Review"],
  ["/nrc/evidence", "Evidence Room"],
  ["/nrc/endorsements", "Public Endorsements"],
  ["/nrc/handover/judges", "Handover · Judges"],
  ["/nrc/handover/governance", "Handover · Governance"],
  ["/nrc/reports", "Reports"],
  ["/nrc/directory", "NRC Directory"],
  ["/nrc/profile", "My Profile"],
  ["/nrc/onboarding", "Training & Onboarding"],
  ["/nrc/audit-log", "Audit History"],
  ["/nrc/my-queue", "My Queue"],
  ["/nrc/members", "Members"],
  ["/nrc/settings", "Settings"],
  ["/nrc/arena", "Arena"],
  ["/nrc", "Dashboard"],
];

export function resolveArenaPageTitle(pathname: string): string | undefined {
  const match = ROUTE_TITLES.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return match?.[1];
}

export interface ArenaSeoProps {
  /** Which secure workspace this route belongs to. */
  workspace: ArenaWorkspace;
  /** Page-level title token. Falls back to the route map, then the workspace name. */
  title?: string;
  /** Optional page description; falls back to the workspace description. */
  description?: string;
}

export function ArenaSeo({ workspace, title, description }: ArenaSeoProps) {
  const { pathname } = useLocation();
  const page = title ?? resolveArenaPageTitle(pathname);
  const fullTitle = page
    ? `${page} · ${workspace} · ${SUITE}`
    : `${workspace} · ${SUITE}`;
  const desc = description ?? WORKSPACE_DESCRIPTION[workspace];
  const url = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content="noindex, nofollow" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={`NESA-Africa · ${workspace}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ARENA_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ARENA_OG_IMAGE} />
    </Helmet>
  );
}

export default ArenaSeo;
