// Stage 6 — Legacy Recognition Redirects
//
// Central table mapping deprecated hub-level URLs onto the new
// canonical spine (/recognition and /awards/explore/*). Registered
// in App.tsx via <RedirectRoute>. Category- and nominee-level
// legacy slugs stay handled inline where they already exist.

export interface LegacyRedirect {
  /** react-router path (may contain :params). */
  from: string;
  /** Canonical destination (may contain :params to be substituted). */
  to: string;
}

export const LEGACY_RECOGNITION_REDIRECTS: LegacyRedirect[] = [
  { from: "/recognition-architecture", to: "/recognition" },
  { from: "/awards/recognition", to: "/recognition" },
  { from: "/awards/architecture", to: "/recognition" },
  { from: "/recognition/pathways", to: "/recognition" },
  { from: "/pathways", to: "/recognition" },
  { from: "/recognition/:pathwaySlug", to: "/awards/explore/:pathwaySlug" },
  {
    from: "/recognition/:pathwaySlug/:categorySlug",
    to: "/awards/explore/:pathwaySlug/:categorySlug",
  },
  {
    from: "/recognition/:pathwaySlug/:categorySlug/:subcategorySlug",
    to: "/awards/explore/:pathwaySlug/:categorySlug/:subcategorySlug",
  },
];
