# Investigation: Icon subcategory gallery vs Influencer dashboards

Report only — no source files were changed.

## 1. The page behind `/nominees/africa-education-icon-award/education-philanthropy-icon`

Route: `src/App.tsx:1932-1939` — `/nominees/africa-education-icon-award/:sub` renders
`src/pages/nominees/icon/IconSubcategoryPage.tsx` (siblings: `IconAwardMain` for the index,
`IconClassificationPage` for `/:sub/:cls`).

Section order in `IconSubcategoryPage.tsx`:

1. `IconBreadcrumbs` (Home / Africa Education Icon Award / subcategory short name)
2. `IconHero` — dark gradient band, eyebrow "Icon Subcategory · 2006–2026", subcategory title/description, meta pills (`Classifications: 3`, `Nominees: <count>`), primary CTA `#all`
3. Classifications grid — 3 `ClassificationCard`s (Africans in Africa / Diaspora / Friends of Africa) with per-classification counts
4. "Featured Icon Spotlight" — `featured(subSlug, undefined, 3)`, 3 `NomineeCard`s
5. `SubcategoryNomineeBrowser` — `NomineeFilterBar` (sticky) + the full picture grid at `id="all"`
6. `FinalCTA`

### Picture catalogue details

- Grid: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; spotlight grid is 3-up.
- Card: `NomineeCard` in `src/components/iconAward/shared.tsx:186-244`. Structure: `aspect-[4/3]` image, `object-cover`, `loading="lazy"`, hover scale; "Verified" gold badge overlay when `verification_status === "verified"`; then name (`line-clamp-2`), `MapPin` + `country · region`, `impact_summary` (`line-clamp-3`), then badges — optional subcategory badge, `years_of_contribution`, `jury_status`.
- Photo fallback: **`onError` swap only** — `src = "/images/africaicons/placeholder-icon.svg"`. No initials avatar, no `HonoureeImage`/`NomineeImage`/`InitialsAvatar` usage here. Image URLs come from `src/data/iconAward/imageManifest.ts` via `resolveIconImage`.
- Filtering: `useNomineeFilters` (`src/components/iconAward/NomineeFilterBar.tsx`) — URL-param driven (`q`, `country`, `region`, `verification`, `jury`, `classification`), derived country/region option lists, active-filter count, clear-all.
- Pagination: **none**. Every filtered nominee renders at once.
- Data source: **static TS**, not the database — `src/data/iconAward/index.ts` (`ICON_NOMINEES`, merged with `workbookNominees.ts`), selectors `bySubcategory` / `byClassification` / `featured`. The philanthropy subcategory has ~98 workbook rows + ~10 legacy rows.
- Links: each card → `profileUrl(slug)` = `/nominees/africa-education-icon-award/:sub/:cls/:slug`.

## 2. Is it reusable?

Partially. `IconSubcategoryPage` itself is **bespoke to the Icon award**: it is parameterized only by `:sub`, hard-codes the Icon breadcrumb/CTA, assumes the 3-classification model, and reads exclusively from the static `iconAward` data module — there is no category-slug prop and no Supabase query.

The building blocks *are* generic-ish and could be lifted: `IconHero`, `NomineeCard`, `ClassificationCard`, `NomineeFilterBar`/`useNomineeFilters`. Blockers to reuse as-is: `NomineeCard` types on `IconNominee` (requires `impact_summary`, `years_of_contribution`, `jury_status`, `classification_slug`), the filter hook imports `ICON_CLASSIFICATIONS` directly, and `profileUrl` builds Icon-only URLs.

## 3. Do the 3 Influencer subpages have this gallery?

No. `src/pages/awards/InfluencerSubcategoryPage.tsx` (Music / Social Media / Sports) renders:

- `BrandedCategoryHeroBand`, sticky jump nav, long content `Section` stack
- a `#directory` section that is **text only** — bullet lists describing "Directory filters" and "Each nominee card displays", plus a button out to `/awards/influencer-education-impact/nominees`
- `CategoryNomineeDashboard` (the compact live list we built)
- inline `InfluencerNominationForm`, FAQs, final CTA

Real difference between the two grids:

| | Icon `NomineeCard` grid | `CategoryNomineeDashboard` |
|---|---|---|
| Data | static `ICON_NOMINEES` TS module | live `public_nominees` via Supabase, joined to `subcategories`/`categories` |
| Card media | `aspect-[4/3]` photo, `onError` → placeholder SVG | `aspect-[4/3]` photo (`photo_url \|\| logo_url`), else `InitialsAvatar` |
| Card body | name, country·region, 3-line impact summary, 3 badges (years, jury status, verification) | name, organization, subcategory label, country/region — no narrative, no status badges |
| Grid | 2/3/4-up, larger cards | 2/3/4-up, denser cards |
| Filtering | URL-param filter bar: search, country, region, verification, jury, classification | local state: text search + subcategory pill tabs (incl. empty subcategories), live per-sub counters |
| CTA | page-level `FinalCTA` link to `/nominate` | inline "Nominate for this category" modal (StageGate-aware) |
| Pagination | none | none (query limit 2000) |

There *is* a richer Influencer gallery, but only on the separate directory route `/awards/influencer-education-impact/nominees` → `InfluencerNomineesDirectoryPage` → `InfluencerHallOfFameSection` (pathway/region/search filters, region-grouped `src/components/influencer-impact/NomineeCard`). It is not embedded on the three subpages.

## 4. Existing "featured / spotlight nominee" patterns

Four distinct ones already exist:

1. **`featured()` + "Featured Icon Spotlight"** — `src/data/iconAward/index.ts:719` returns the first N of the pool (`pool.slice(0, n)`, no curation field); rendered as 3 standard `NomineeCard`s on `IconSubcategoryPage` and `IconClassificationPage`. Closest thing to a per-subcategory spotlight, but it is just "first 3", not an editorially chosen nominee.
2. **`FeaturedNomineeSpotlight`** (`src/components/nominees/FeaturedNomineeSpotlight.tsx`) — takes `EnrichedDatabaseNominee[]`, shows the top 3 with `#1 Featured` badges, `aspect-[4/3]` image with logo/photo `object-contain` vs `object-cover` handling, framer-motion stagger. Used only by `src/pages/nominees/CategoryLandingPage.tsx:199`.
3. **`CuratedFeaturedNominees`** (`src/components/nominees/CuratedFeaturedNominees.tsx`) — hardcoded 9-name "Hall of Fame Spotlight" strip with initials tiles, links into `/nominees?search=`.
4. **`InfluencerPathwayNomineeSlider`** — live DB carousel used on the landing page and `InfluencerImpact2026`.

No single-nominee "hero spotlight" component (one large highlighted nominee distinct from the grid) exists anywhere; every current pattern is a 3-up or carousel of cards, and none reads a `featured`/`is_spotlight` flag from the database.
