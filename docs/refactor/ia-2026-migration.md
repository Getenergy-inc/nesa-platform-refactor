# NESA-Africa 2026 — Information Architecture refactor (no full redesign)

## Primary navigation (7 items)
Home · Recognition Hub 2026 · Explore Enablers · EduAid-Africa Impact ·
Media & Events · Gala & Tickets · Support & Get Involved.

Source of truth: `src/config/siteNavigation.ts`. The Recognition dropdown is
generated from `AWARD_CATEGORY_PAGES_2026`, so a category page can never be
orphaned from navigation.

## Award pages: 22 → 18
| Tier | Pages |
| --- | --- |
| 1 · Africa Education Icon | 1 (3 pathways bundled; jury-nominated, no public form) |
| 2 · Influencer Education Impact | 1 (3 pathways bundled; embedded form) |
| 3 · Platinum Recognition | 7 |
| 4 · Gold-Blue Garnet Recognition | 9 |

All 18 render through the single reusable template
`src/components/awards/subpage/AwardSubpageTemplate.tsx`, populated by
`src/config/awards/subpages2026.ts`.

## URL handling (no dead links)
The six former Icon/Influencer pathway pages remain live at their existing
`/recognition/subpage/:slug` URLs (exported as `PATHWAY_SUBPAGES_2026`) but are
no longer canonical and no longer appear in navigation or the page indexes.
They point back to their bundled tier category page.

## Note on the supplied site map
The site-map graphic labels Tier 1 as having an embedded nomination form; the
written spec states Tier 1 has no public nomination form (jury-only, 27 judges,
9 final Icons). The written spec is implemented.
