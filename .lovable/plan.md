## Scope

You picked "ALL" for every option, so this is a multi-phase build. To ship safely without breaking the live site, I'll deliver it in 4 sequential phases. Each phase is independently shippable and visible in preview.

## Phase 1 — `/nominees` Hub Redesign (ship first)

Rebuild `src/pages/nominees/NomineesHubPage.tsx` as a visual-first directory.

- **Hero block**: Title "Explore Existing Nominees", subtitle, governance disclaimer chip, primary CTAs (Nominate 2026 / View Categories / Regional Nominees).
- **NomineeQuickStatsBar** (already added) — keep and polish.
- **Discovery filters bar**: Award Group, Region (8), Country, Category, Subcategory, Year, Institution Type, Search. URL-synced (`?award=&region=&country=&q=`).
- **NomineeCardV2** component: photo (with org-vs-person fit rules), name, country flag, region, category badge, organisation, verification badge, year, 1-line impact summary, compact EDI badge (via `<CompactEDI>`), buttons View Profile / Share / Recommend Again.
- **Responsive grid**: 4 cols desktop / 3 tablet / 2 mobile-landscape / 1 mobile. Book-style pagination (existing system).
- **Mobile**: swipeable Featured carousel at top.

## Phase 2 — Interactive Africa Map + Region Explorer

- New `src/components/nominees/AfricaRegionMap.tsx`: SVG of Africa with 8 clickable regions, hover tooltips showing nominee counts (from `useRegionNomineeCounts`).
- Region chip fallback grid below the map for mobile/a11y.
- Click → filter the hub to that region (updates URL).
- Embed on `/nominees` between hero and filters.

## Phase 3 — Nominee Profile Page Rebuild (`/nominees/[slug]`)

Rebuild profile with these sections:
1. **Hero header** — large photo, name, country/region, category badge, organisation, verification badge, impact headline.
2. **Biography** — from `bio` / enriched profile `summary_2025`.
3. **Education Impact Story** — Problem → Intervention → Results → Vision (from `nominee_enrichments.education_for_all_contributions`; falls back to bio).
4. **Education for All metrics** — learners reached, schools, teachers trained, scholarships, communities (read from `nominee_enrichments` JSON; show "Pending verification" when missing).
5. **EDI Matrix** — full `NomineeEDIScores` (already built) with radar + 5 pillar bars + overall grade + benchmarking vs category/region average.
6. **6th pillar (Community Reach)** — extend `src/lib/ediScoring.ts` `PILLAR_KEYS` to add Community Reach with deterministic scoring; update radar to 6 axes.
7. **Media gallery** — uses `useNomineeMedia` (existing).
8. **Related nominees** — same category or region, top 4 by votes.
9. **Sponsor recognition** — if present in `sponsor_links`.
10. **Sticky action bar** — Share, Recommend Again, Explore Category, Explore Region.
11. **SEO** — `react-helmet-async` with JSON-LD `Person`/`Organization` schema, OG image, canonical.

## Phase 4 — Cross-Surface Embeds

A single reusable `<FeaturedNomineesBlock filter={{ category|region|award }} limit={6} />` component (refactor existing `ExistingNomineesInline`). Inject into:
- Award category pages (`AwardCategoryPage`)
- Subcategory pages
- Regional pages
- Icon, Blue Garnet, Gold, Platinum, Influencer pages
- Sponsor + Judge dashboards (read-only preview)

## Technical Notes

- **EDI 6th pillar**: edit `src/lib/ediScoring.ts` — add `community_reach` to `PILLAR_KEYS`, `PILLAR_CONFIG` (weight ~15%, rebalance others), `getPillarColor`. All existing callers continue to work.
- **No schema migration** in this build — impact metrics rendered from existing `nominee_enrichments` table when present, with "Pending verification" placeholder otherwise. (Migration can be a follow-up phase if you want admin-editable metrics.)
- **Data source**: `useNominees` (existing, hits `public_nominees` view) + `useEnrichedProfiles` (existing) + `nominee_enrichments` table.
- **Disclaimer chip**: shared `<NomineeGovernanceNotice />` component reused across hub, cards, and profile.
- **No backend / RLS changes** required.

## What I will NOT do this turn

- Will not change nomination flows, voting, or auth.
- Will not modify `client.ts` or `types.ts`.
- Will not delete legacy `NomineesHubPage` until Phase 1 replacement is verified.

## Confirmation needed

Approve and I'll start Phase 1 immediately, then proceed phase-by-phase. If you'd rather I ship all 4 phases without intermediate check-ins, say "ship all phases" and I'll batch the work.