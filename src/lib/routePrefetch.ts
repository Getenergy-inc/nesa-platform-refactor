// Route chunk prefetching.
//
// The app code-splits every route with React.lazy in src/App.tsx, so the first
// click on a nav item, category card or nominee card pays for a network round
// trip before anything renders. This module warms that chunk on intent
// (hover/focus on desktop, viewport-visible on touch) using the SAME dynamic
// import specifiers React.lazy uses — Vite dedupes them, so a prefetched chunk
// is already in the module graph by the time the route mounts.
//
// No new routing library is introduced: this is plain dynamic import warming.

type Importer = () => Promise<unknown>;

/**
 * Path matcher → chunk importer. Ordered: the FIRST matching entry wins, so
 * more specific prefixes must come before their parents.
 */
const ROUTE_CHUNKS: Array<[RegExp, Importer]> = [
  // Nominee directory + profiles (the heaviest, most-clicked surfaces)
  [/^\/nominees\/[^/]+\/[^/]+/, () => import("@/pages/nominees/NomineeProfilePage")],
  [/^\/nominees\/[^/]+/, () => import("@/pages/nominees/NomineeProfilePage")],
  [/^\/nominees/, () => import("@/pages/nominees/NomineesHubPage")],

  // Recognition / awards
  [/^\/awards\/[^/]+/, () => import("@/pages/awards/AwardSubpageTemplate")],
  [/^\/awards/, () => import("@/pages/Awards")],
  [/^\/categories/, () => import("@/pages/categories/EighteenCategoriesPage")],

  // Nomination funnel
  [/^\/nominate/, () => import("@/pages/nominate/NominateHub2026")],

  // Common editorial routes
  [/^\/timeline/, () => import("@/pages/about/Timeline")],
  [/^\/about/, () => import("@/pages/about/AboutConsolidated")],
  [/^\/regions/, () => import("@/pages/region/RegionsIndexPage")],
  [/^\/chapters/, () => import("@/pages/Chapters")],
  [/^\/tickets/, () => import("@/pages/Tickets")],
  [/^\/donate/, () => import("@/pages/Donate")],
];

const warmed = new Set<string>();

/** Warm the lazy chunk that will render `to`. Safe to call repeatedly. */
export function prefetchRoute(to: string) {
  if (typeof window === "undefined") return;
  if (!to || !to.startsWith("/")) return;

  const path = to.split(/[?#]/)[0];
  const entry = ROUTE_CHUNKS.find(([re]) => re.test(path));
  if (!entry) return;

  const key = entry[0].source;
  if (warmed.has(key)) return;
  warmed.add(key);

  // Never let a prefetch failure surface to the user — the real navigation
  // will retry (and the error boundary handles genuinely missing chunks).
  entry[1]().catch(() => warmed.delete(key));
}

/** True when the device has no hover capability (phones/tablets). */
export function isCoarsePointer() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}
