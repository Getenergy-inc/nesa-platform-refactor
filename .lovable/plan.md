# Region-First Nominee Ecosystem Refactor

Transform `/nominees` from a flat archive into a region-first architecture across West, East, North, Central, and Southern Africa — with category → subcategory → profile drill-down, search, filters, and SEO.

## Scope

In scope:
- Data layer: classify every existing nominee into one of the 5 African regions using the country-to-region map you provided, plus `unknown` + `requires_manual_review` flag.
- New routes:
  - `/nominees/west-africa`, `/east-africa`, `/north-africa`, `/central-africa`, `/southern-africa` (regional hubs)
  - `/nominees/:region/:categorySlug` (category within region)
  - `/nominees/:region/:categorySlug/:subcategorySlug` (subcategory within region)
  - Keep `/nominees/profile/:slug` (unchanged URL contract for existing profiles).
- Region hub UI: hero, stats, category grid, featured nominees, search, filters.
- Category-in-region & subcategory-in-region pages: reuse the existing `CategoryLandingPage` patterns (`CategoryHero`, `SubcategoryTabs`, `NomineeFilterBar`, `FeaturedNomineeSpotlight`, `LandingNomineeCard`).
- Migration report: counts per region/category, duplicates, missing images, manual-review queue, SEO readiness score.
- Sitemap + per-page Helmet meta (title, description, canonical, OG, JSON-LD `CollectionPage` / `ItemList`).

Out of scope (call out, do not touch):
- The new `Best NGO Contribution to Education (Africa Regional)` ecosystem already shipped at `/nominees/best-ngo-contribution-to-education` — left as-is; region pages will link into it.
- Backend Supabase nominee tables — current source of truth is `src/data/nominees-2025.ts` via `src/lib/nomineeMasterData.ts`. No DB migration in this pass.
- Voting/wallet logic, judging rubric, certificates — untouched.
- The existing `/nominees/category/:categorySlug` flat routes — kept for backward compatibility, region routes added alongside.

## Data layer

Add `src/lib/regionClassifier.ts`:
- `COUNTRY_TO_REGION: Record<string, AfricaRegion>` from your mapping (West/East/North/Central/Southern).
- `classifyRegion(country?: string): AfricaRegion | "unknown"`.
- `AFRICA_REGIONS` metadata: slug, name, description, country list, hero image, accent color (gold variants on charcoal — no new palettes).

Extend `src/lib/nomineeMasterData.ts`:
- Add `africaRegion`, `requiresManualReview`, `migrationConfidenceScore` derived fields on `MasterNominee` (computed at build time from country).
- Add helpers: `getNomineesByAfricaRegion(region)`, `getCategoriesByAfricaRegion(region)`, `getSubcategoriesByRegionAndCategory(...)`, `getRegionStats(region)`.
- Generate a one-time migration report `migration/nominees.region-refactor.report.md` listing totals, duplicates (slug collision), missing images, and the manual-review queue.

## Routes & pages

New components under `src/pages/nominees/regional/`:
- `RegionNomineesHubPage.tsx` — hero with region name, country chips, stats (nominees, categories, countries), category grid, featured spotlight, search, link to all categories.
- `RegionCategoryPage.tsx` — scoped version of `CategoryLandingPage` filtered to the region; reuses `CategoryHero`, `SubcategoryTabs`, `NomineeFilterBar`, `FeaturedNomineeSpotlight`, `LandingNomineeCard`.
- `RegionSubcategoryPage.tsx` — subcategory drill-down within a region (search, filters, pagination, vote/view CTAs).

Wire into `src/App.tsx`:
```text
/nominees/:region                                  → RegionNomineesHubPage
/nominees/:region/:categorySlug                    → RegionCategoryPage
/nominees/:region/:categorySlug/:subcategorySlug   → RegionSubcategoryPage
```
Validate `:region` against `AFRICA_REGIONS`; otherwise redirect to `/nominees`.

Update `src/pages/nominees/NomineesHubPage.tsx`:
- Add a "Explore by Region" section (5 region cards with nominee counts) above the existing category grid.
- Keep the existing NGO + Influencers featured banners.

## UX & design

- Reuse existing Charcoal/Gold tokens (`bg-charcoal`, gold accents, Playfair Display headers). No new color tokens.
- Mobile-first, PWA-safe (`pb-20` for bottom chat/footer).
- `framer-motion` enter animations on cards, consistent with `CategoryLandingPage`.
- Book-style pagination on subcategory pages (matches existing pattern).

## SEO

- Per-page `<Helmet>` with title, description, canonical to `https://nesaafrica.lovable.app/...`, OG tags, `CollectionPage` + `ItemList` JSON-LD.
- Extend `public/sitemap.xml` (or `scripts/generate-sitemap.ts` if present) with all new region + region/category + region/category/subcategory URLs.

## Migration report deliverables

`migration/nominees.region-refactor.report.md`:
1. Total nominees reviewed (from `NOMINEES_2025` master)
2. Counts per region & per category
3. Duplicate slugs detected
4. Records with missing country → `unknown` region (manual review queue)
5. Missing image paths
6. SEO readiness score (% with title, description, canonical, image)
7. Data-quality score
8. Recommendations

## Out-of-scope confirmations

- Will NOT touch the new NGO Africa Regional pages, `/nominees/category/:slug` flat routes, voting/wallet, judging, certificates, Supabase schema, or auth.
- Will NOT fabricate nominees — only classify what's in `nominees-2025.ts`. Empty regions render an empty-state CTA.

## Open question before I start

The master dataset (`NOMINEES_2025`) is the single source. Many records have `country = ""` or `region = "N/A"` (Nigeria-heavy). Confirm one of:

- **A. Country-only classification (recommended)**: Use only `country` to assign region. Records with no country → `unknown` + flagged for manual review. Honest, no fabrication.
- **B. Country + heuristic from category name**: If category contains "(Nigeria)" / "(Africa)" / "Diaspora", infer region. Higher coverage, lower confidence — flagged `medium`.
- **C. Country + heuristic + curated supplements**: Same as B plus 5-10 well-known nominees per empty region from public records, flagged `requires_manual_review=true` (same approach as the NGO Africa Regional ecosystem we just shipped).

Reply with A, B, or C and I'll execute the full refactor in one pass.