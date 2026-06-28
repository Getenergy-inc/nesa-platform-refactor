# Awards Architecture Refactor — Execution Plan

Restructure the entire Awards section around the official 2026 Recognition Architecture: **Tiers → Categories → Subcategories → Region → Country → Nominee → Hall of Fame**. The Awards menu must be self-explanatory within 5 seconds.

This is a large refactor. I'll execute in 5 batches and pause for approval after each.

---

## Single Source of Truth

Create `src/config/recognitionArchitecture2026.ts` as the canonical spine driving navigation, routing, breadcrumbs, page metadata, and CMS lookups. Shape:

```
RecognitionTier
 ├── id, slug, label, tagline, selectionMethod, votingMode
 ├── description, hero copy, eligibility, process
 ├── categories: AwardCategory[]
 │    └── subcategories: Subcategory[]
 │         └── (classification × region × country resolved at query time)
 └── pages: { about, categories, nominees, hallOfFame, eligibility, nominate, voting?, judging? }
```

The 4 tiers, ~18 Gold-Blue Garnet categories, 20 Platinum recognition categories, 3 Influencer categories and 3 Icon subcategories all live here. Existing `recognitionArchitecture.ts`, `awardPageContent.ts`, `awardCategories/*`, and `pillars.ts` are kept but the new spine becomes authoritative for nav + tier pages.

## Batch 1 — Spine + Navigation (this turn)

1. **`src/config/recognitionArchitecture2026.ts`** — new canonical tier/category/subcategory data, with copy from the brief.
2. **`src/config/navigation.ts`** — rebuild Awards mega-menu to match the prescribed tree (Recognition Architecture, 4 Tiers each with sub-links, Africa Education Impact Directory, Governance & Integrity, Eligibility & Guidelines, Voting Timeline). Remove top-level "Social Media Education Champions" and "Award Categories"; nest them inside their tiers.
3. **`src/components/navigation/MainNav.tsx`** — render the new Awards mega-menu with tier-grouped columns, taglines and "self-explanatory in 5s" layout. Preserve existing analytics hooks.

## Batch 2 — Recognition Architecture Hub + Tier Landing Pages

4. **`src/pages/awards/RecognitionArchitecturePage.tsx`** — `/awards/recognition-architecture`. Visual map of all 4 tiers with selection method, voting mode, and entry points.
5. **`src/pages/awards/tiers/TierLandingPage.tsx`** — dynamic `/awards/tier/:tierSlug` rendering tier hero, sub-nav (About / Categories / Nominees / Hall of Fame / Eligibility / Nominate / Voting / Judging), category grid driven by the spine.
6. **Replace/wrap existing tier pages** (`AfricaEducationIcon`, `BlueGarnetAward`, `PlatinumAward`, `InfluencerImpact2026`) to consume the new spine while keeping their premium hero sections.

## Batch 3 — Category & Subcategory Spine Pages

7. **`src/pages/awards/CategoryPage.tsx`** — dynamic `/awards/:tierSlug/:categorySlug`. Sections: Overview, Eligibility, Subcategories grid, Existing Nominees preview, Hall of Fame, Voting (where applicable), Judging, FAQs, Nominate CTA.
8. **`src/pages/awards/SubcategoryPage.tsx`** — `/awards/:tierSlug/:categorySlug/:subcategorySlug`. Filtered nominee grid by classification (Africans in Africa / Diaspora / Friends of Africa) and region.
9. Wire the new GBG 18-category set and Platinum 20-category set into the spine.

## Batch 4 — Africa Education Impact Directory

10. Rename "Existing Nominees" → **Africa Education Impact Directory** everywhere (nav, page titles, breadcrumbs, copy). Add `src/config/platformCopy.ts` constant `DIRECTORY_NAME`.
11. **`src/pages/nominees/NomineesHubPage.tsx`** — refactor filter rail to the prescribed hierarchy: Tier → Category → Subcategory → Region → Country → Org/Individual. Persist filters in URL.
12. Nominee profile page additions: Recognition Tier badge, Category, Subcategory, Evidence of Impact section, Related Nominees, Hall of Fame status chip.

## Batch 5 — Redirects, CMS adapter alignment, QA

13. **Redirects** — map old `/awards/categories`, `/awards/social-media-*`, legacy category URLs → new spine routes via `App.tsx` `<Navigate />` and `buildRedirectMap()`.
14. **CMS adapter** — extend `src/lib/cms/types.ts` + `lovableCloud.ts` so `tier`, `category`, `subcategory` joins resolve consistently for the Directory.
15. **Playwright** — `tests/e2e/awards-architecture.spec.ts`: open Awards menu, verify 4 tiers + sub-links, click each tier landing, verify category/subcategory routes resolve, verify Directory filters by tier.
16. **Terminology sweep** — under Platinum, replace remaining "Excellence" with Leadership / Contribution / Transformation / Education Enabler / Institutional Impact wording.

---

## Technical Notes

- All new pages use the existing `AwardCategoryStandardPage` section primitives (`AwardHeroStandard`, `WhatThisRecognises`, etc.) so the premium black/gold/blue-garnet look is preserved.
- Routes are additive — old routes redirect, no broken links.
- CMS-driven: every tier/category/subcategory reads from the spine config; copy can later migrate into Supabase `categories`/`subcategories` tables without code changes by swapping the adapter.
- No schema changes required in Batch 1–3; Batch 5 only extends select columns if the CMS adapter needs `tier` on `categories` (already present per `src/lib/cms/types.ts`).

---

**Reply "approve" or "continue" to start Batch 1**, or tell me which batches to reorder/skip.
