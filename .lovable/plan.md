# Nominee Ecosystem Refactor — 3-Level IA

Transform the single long `/nominees` page into a scalable Discovery → Exploration → Trust → Vote ecosystem with dedicated pages at every level.

## Current State (audit)

- `/nominees` renders all categories, filters, and cards in one page → scroll fatigue, weak SEO.
- Individual nominee profile pages already exist at `/nominees/:slug` (used by `NomineeCard` links).
- Category pages exist as static files under `src/pages/categories/*` driven by `DynamicCategoryPage`, but they are NOT connected to the `/nominees/...` URL tree and don't share a consistent shell.
- No subcategory-level pages exist.

## Target Information Architecture

```text
/nominees                              → Hub: category index (lightweight)
/nominees/:categorySlug                → Category landing (hero, featured, grid, filters)
/nominees/:categorySlug/:subSlug       → Subcategory browse (filtered grid + sort/search)
/nominees/profile/:nomineeSlug         → Nominee profile (new richer template)
```

The existing `/nominees/:slug` profile route is preserved as a redirect to `/nominees/profile/:slug` to avoid breaking inbound links.

## Scope (this plan)

### 1. Nominees Hub (`/nominees`) — lightweight redesign
- Replace the long mega-list with a **Category Index Grid**: one premium card per major category showing icon, name, nominee count, top-3 avatars, and "Explore →" CTA.
- Keep a compact global search + "Trending nominees" rail + "Most voted this week" rail (data-driven, 8 items each, carousel on mobile).
- Remove the in-page subcategory accordions and infinite grid.

### 2. Category Landing (`/nominees/:categorySlug`)
- Hero: category title, mission statement, nominee count, primary CTA `Vote Now`, secondary `Nominate`.
- Filter bar: Region, Country, Sort (Most Voted / Newest / Trending), Search.
- **Featured Nominees** spotlight (top 3 by votes, large cards).
- **Subcategory chips** linking to subcategory pages.
- Paginated nominee grid (12/page) using existing `NomineeCard`.
- Community engagement strip (total votes, endorsements, regions represented).
- Final CTA band.
- SEO: `<Helmet>` with title, description, canonical, OG, JSON-LD `CollectionPage`.

### 3. Subcategory Page (`/nominees/:categorySlug/:subSlug`)
- Breadcrumb (Nominees › Category › Subcategory).
- Subcategory header with description + count + Vote/Nominate CTAs.
- Sort + Search + Region filter.
- Paginated grid (12/page).
- Sidebar/aside: "Other subcategories in {category}".
- SEO Helmet + JSON-LD `ItemList`.

### 4. Nominee Profile (`/nominees/profile/:slug`)
Build a new richer profile template with sections:
1. **Hero** — image/logo (respects person vs org sizing), name, category badge, country/region, nomination year, status badge (Approved / Platinum / Blue Garnet).
2. **Impact Story** — narrative, measurable impact bullets, timeline.
3. **Why This Nominee Matters** — social proof block (community outcomes, advocacy).
4. **Media & Gallery** — photos/videos grid (lazy-loaded), respects YouTube nocookie rule.
5. **Voting & Engagement** — sticky-on-mobile Vote CTA, share bar, endorse, testimonial preview (reuses existing voting components).
6. **Related Nominees** — same subcategory + same region (6 cards).
7. **Trust Indicators** — verification badge, NRC/jury verified, vote count, endorsement count, citation links.
- SEO: Helmet + JSON-LD `Person` or `Organization` depending on `imageType`.
- Keep `/nominees/:slug` route → `<Navigate>` to `/nominees/profile/:slug`.

### 5. Shared building blocks (new components)
- `NomineeBreadcrumbs`
- `CategoryHero`
- `NomineeFilterBar` (region, country, sort, search — bottom-sheet on mobile)
- `FeaturedNomineeSpotlight`
- `NomineePagination` (reuses universal pagination)
- `RelatedNomineesRail`
- `TrustIndicators`
- `NomineeProfileHero`, `ImpactStorySection`, `MediaGallerySection`

### 6. Routing
- Add the 3 new routes in `src/App.tsx` (or wherever the nominees routes live).
- Add legacy redirect `/nominees/:slug` → `/nominees/profile/:slug` only when `:slug` is not a known category slug. Implementation: a small resolver component that checks the slug against the category list; if it matches a category, render `CategoryLandingPage`, else `<Navigate>` to profile.

### 7. Performance
- Lazy-load all new pages via `React.lazy`.
- Paginate (12/page) instead of infinite scroll.
- Image lazy-loading via existing `useResolvedNomineeImages`.
- Skeleton loaders using existing `NomineeCardSkeleton`.

### 8. SEO
- `react-helmet-async` per page (provider already wired).
- JSON-LD: `CollectionPage` (hub), `CollectionPage` + `ItemList` (category/subcategory), `Person`/`Organization` (profile).
- Update `scripts/generate-sitemap.ts` if it exists to enumerate categories + nominees from `nominees-master.json`.

## Out of scope (this pass)
- Backend schema changes — uses existing `nominees` table + master JSON.
- Comment/testimonial submission system (only display existing data; full posting flow is a separate feature).
- Admin moderation UI changes.

## Files to add
- `src/pages/nominees/NomineesHubPage.tsx`
- `src/pages/nominees/CategoryLandingPage.tsx`
- `src/pages/nominees/SubcategoryPage.tsx`
- `src/pages/nominees/NomineeProfilePage.tsx` (new richer template; may wrap/replace existing profile)
- `src/components/nominees/CategoryHero.tsx`
- `src/components/nominees/NomineeFilterBar.tsx`
- `src/components/nominees/FeaturedNomineeSpotlight.tsx`
- `src/components/nominees/RelatedNomineesRail.tsx`
- `src/components/nominees/TrustIndicators.tsx`
- `src/components/nominees/NomineeBreadcrumbs.tsx`

## Files to edit
- `src/App.tsx` (routes)
- Existing `/nominees` page component (slim down to hub)
- `scripts/generate-sitemap.ts` (if present)

## Style
Maintain Charcoal/Gold palette, Playfair Display headers, framer-motion entrance animations, bottom-20 mobile offsets for sticky CTAs.
