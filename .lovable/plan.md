
# NESA-Africa Platform Refactor — Execution Plan

This refactor turns NESA-Africa from an "awards website" into **Africa's Education Recognition & Impact Platform**. URLs, slugs, metadata and Cloud schema are preserved. Work ships in 6 batches so each can be reviewed before the next.

Much of the foundation is already in place from prior turns (`platformCopy.ts`, `pillars.ts` at 9 pillars, `recognitionArchitecture.ts`, `RecognitionImpactLegacy`, updated `WhatIsNESASection`, `WhoWeHonourSection`, `SevenPillarsHomeSection`→Nine). The plan below completes the remaining ~70%.

---

## Batch 1 — Canonical Identity & Language Layer
Single source of truth so every page reads from the same strings.

- Extend `src/config/platformCopy.ts`:
  - `PLATFORM_IDENTITY_SENTENCE` (the "(New Education Standard Award Africa)…" paragraph)
  - `RECOGNITION_ARCHITECTURE_SUMMARY` (4 Tiers · 18 Categories · 100+ Pathways · 8 Regions · 2 Communities)
  - `WHO_WE_RECOGNISE_CLUSTERS` (Individuals / Organisations / Governments)
  - `TRUST_STATEMENT`, `PRIMARY_CTAS`, `REGION_LINE`
- Add `src/lib/copyLint.ts` dev-only helper + an ESLint custom rule entry (`no-restricted-syntax` style) that flags the legacy phrases: "Education Excellence", "Award Winners", "Excellence Awards", "Seven Recognition Pillars", "54 African countries" (in marketing copy only — NOT in regional data files).
- Replace those phrases in static homepage/about/awards section components.

## Batch 2 — Homepage
Identity surface only — no category explanations.

- `TrophyHeroSection`: identity sentence + `RECOGNITION_ARCHITECTURE_SUMMARY` chips + 3 CTAs from `PRIMARY_CTAS`.
- New `RecognitionTiersHomeSection` (4 tier cards → `/awards/tiers/:slug`).
- `NinePillarsHomeSection` stays (already done).
- `RecognitionImpactLegacy` stays (already inserted).
- New `WhoWeRecogniseClustersSection` (3-cluster grid replacing long lists).
- `TrustStripSection` (one-line trust statement + link to /about#governance).
- Trim duplicated category copy from homepage.

## Batch 3 — About (Trust Gateway)
- Rewrite `src/pages/about/About.tsx` sections in this order: Identity → Vision → Mission → Why We Exist → Recognition→Impact→Legacy → Governance (Awards Council, NRC, Independent Judges, EDI, Integrity Firewall, Sponsor Firewall) → SCEF → Choose Your Journey.
- Remove category descriptions (they belong on /awards and /categories).

## Batch 4 — Awards Spine
- `/awards` (`src/pages/Awards.tsx`): hero + 4 Recognition Tiers + 9 Pillars summary + 18-category index card + How Recognition Works (6 steps) + Selection Flow.
- `/awards/tiers/:slug`: tier overview → its categories.
- `/awards/categories/:slug`: each of the 18 categories with the mandatory 13-block template (Purpose, Why it matters, Who, Contribution to EFA, Benefits ×4, Related pathways, Existing nominees, Process, FAQs). Driven by `src/config/awards/awardCategoryContent.ts` (extend existing).
- `/awards/pathways/:slug`: 100+ pathway pages from `recognitionArchitecture.ts` with Overview, Eligibility, Contribution areas, Nominees, Hall of Fame, Country & Regional distribution (live counts), Related pathways, CTA.
- Pillar pages (`/awards/pillars/:slug`) — add the 2 new pillars (Philanthropy, Faith-Based).

## Batch 5 — Africa Education Impact Directory
- Rename `/nominees` UI label → "Africa Education Impact Directory" (route preserved; add 301-equivalent canonical from `/nominees` self-reference, plus internal links updated).
- Filters: Tier · Category · Pathway · Region · Country · Cluster (Africans in Africa / Diaspora / Friends of Africa).
- Profile page template adds: Contribution · Evidence · Impact · Organisation · Region · Country · Recognition pathway · Related nominees · Hall of Fame badge.
- All counts via Cloud queries (no hardcoded totals). New hook `useDirectoryCounts()` against `nominees` + `nomination_intake`.

## Batch 6 — Cross-cutting + QA
- Navigation (`src/config/navigation.ts`): mega menu reorganised to Tiers / Categories / Pillars / Directory / Impact / Sponsors / Volunteers / Media.
- Global footer + breadcrumbs use canonical labels.
- SEO: per-route Helmet titles/descriptions rewritten around "Recognition & Impact Platform"; canonicals & og:url unchanged.
- Accessibility sweep on new sections (aria-labels, heading order, focus rings, 44px tap targets).
- Analytics: extend existing `home_cta_click` + add `tier_view`, `category_view`, `pathway_view`, `directory_filter_apply`, `nominate_cta_click`.
- Playwright specs: identity sentence present on /, /about, /awards; 9 pillars rendered; tier → category → pathway → directory journey; legacy phrases absent.

---

## Technical Notes

- **No DB migrations** — all changes are content, components, routes, copy. Existing `nominees`, `subcategories`, `regions` tables already support the model.
- **No URL changes.** Any new route (`/awards/tiers/:slug`, `/awards/pathways/:slug`) is additive; legacy `/awards/:slug` keeps working.
- **CMS-driven counts**: replace any literal count strings with values from `useDirectoryCounts()` / `useRegionCounts()`.
- **Risk control**: each batch is independently shippable; build + tsgo run after every batch.

## Proposed Execution Order This Session

I'll implement **Batch 1 and Batch 2** in the next response (foundational + homepage — the highest-leverage changes), then pause for your review before Batches 3–6. If you'd rather I run straight through all six batches without intermediate pauses, say "ship all batches" and I'll proceed.
