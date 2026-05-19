# Africa Education Icon Award — Nested Nominee Architecture

Refactor the single Icon Award nominees page into a three-tier, premium, SEO-friendly experience: **Main → Subcategory → Classification → Profile**.

## 1. Routing Tree

```text
/nominees/africa-education-icon-award                          (Main)
  /literary-new-curriculum-advocate                            (Sub 1)
    /africans-in-africa
    /diaspora-africans
    /friends-of-africa
  /technical-educator-icon                                     (Sub 2)
    /africans-in-africa
    /diaspora-africans
    /friends-of-africa
  /education-philanthropy-icon                                 (Sub 3)
    /africans-in-africa
    /diaspora-africans
    /friends-of-africa

/nominee/:slug                                                 (Profile — reuses universal resolver)
```

All routes registered in `src/App.tsx`; existing `/nominees/category/africa-education-icon-award` redirected to the new main page.

## 2. Data Layer

**New file:** `src/data/iconAward/index.ts`

Single source of truth — typed constants plus an array of nominee records using the requested schema:

```ts
export type IconSubcategorySlug =
  | "literary-new-curriculum-advocate"
  | "technical-educator-icon"
  | "education-philanthropy-icon";

export type IconClassificationSlug =
  | "africans-in-africa"
  | "diaspora-africans"
  | "friends-of-africa";

export interface IconNominee {
  id: string; name: string; slug: string;
  award_subcategory_slug: IconSubcategorySlug;
  classification_slug: IconClassificationSlug;
  country: string; region: string;
  sector?: string; impact_area: string[];
  years_of_contribution: string;
  impact_summary: string; full_impact_story?: string;
  impact_metrics?: Record<string, string | number>;
  jury_status: "nominated" | "verified" | "shortlisted" | "jury_reviewed" | "laureate";
  verification_status: "pending" | "verified";
  image_url: string; banner_url?: string;
  media_gallery?: { type: "image"|"video"|"link"; url: string; title?: string }[];
  previous_categories?: string[]; tags?: string[];
  seo_title?: string; seo_description?: string;
}
```

Helper selectors: `getNominee(slug)`, `bySubcategory(sub)`, `byClassification(sub, cls)`, `featured(sub, cls, n=3)`.

## 3. Page Components

**New folder:** `src/pages/nominees/icon/`

| File | Route | Purpose |
|---|---|---|
| `IconAwardMain.tsx` | `/nominees/africa-education-icon-award` | Hero, 3 subcategory cards, total counts, CTAs |
| `IconSubcategoryPage.tsx` | `…/:sub` | Hero, 3 classification cards, featured nominees, View All CTA |
| `IconClassificationPage.tsx` | `…/:sub/:cls` | Hero, FilterBar, NomineeGrid, Featured Spotlight, Related Classifications, Final CTA |
| `IconNomineeProfile.tsx` | `/nominee/:slug` (resolver dispatches here for Icon Award slugs) | Full profile with hero, timeline, metrics, evidence, recognition, related |

**Shared components** in `src/components/iconAward/`:
`IconHero`, `SubcategoryCard`, `ClassificationCard`, `NomineeCard`, `NomineeFilterBar`, `FeaturedSpotlight`, `LifetimeTimeline`, `ImpactMetricsGrid`, `EvidenceGallery`, `RecognitionStatusBadge`, `RelatedNominees`.

## 4. Filtering

`NomineeFilterBar` supports: country, region, impact area, sector, nomination year, verification status, jury status. URL-synced query params for shareability; client-side filter using selectors.

## 5. Visual System

Reuse the existing Charcoal/Gold tokens (`bg-charcoal`, gold `42 85% 52%`, Playfair display). Editorial card style with serif headings, fine gold rules, subtle motion on hover (framer-motion). Mobile-first; sticky filter bar collapses to a sheet on small screens.

## 6. SEO

`react-helmet-async` `<Helmet>` blocks per page (single-string `<title>`):

- Main: `Africa Education Icon Award Nominees | NESA Africa 2006–2026`
- Subcategory: `{Sub} Nominees | Africa Education Icon Award | NESA Africa`
- Classification: `{Classification} — {Sub} Nominees | NESA Africa`
- Profile: `{Name} | {Sub} | Africa Education Icon Nominee`

Each page emits canonical, og:title/description/url, and JSON-LD (`BreadcrumbList` everywhere; `Person` schema on profiles).

## 7. Migration

Script `scripts/migrate-icon-nominees.ts` (offline, run once):

1. Load existing Icon Award nominees from current data sources (`src/data/awardData.ts`, `goldSpecialRecognition.ts`, CSV).
2. Classify each into one of the 3 subcategories using keyword rules on existing category/sector/impact text:
   - **Literary/Curriculum**: keywords *curriculum, literacy, author, publisher, policy writer, content*
   - **Technical Educator**: *TVET, STEM, vocational, technical, skills, innovation training*
   - **Philanthropy**: *foundation, donor, scholarship, CSR, philanthropist, funder*
3. Classify into Africans-in-Africa / Diaspora / Friends-of-Africa using `country`, heritage tags, and existing residency flags.
4. Generate slug, profile URL, classification URL; preserve `previous_categories`.
5. Low-confidence rows → `manual-review.json` (not auto-published).
6. Emit `src/data/iconAward/nominees.generated.ts` and a `REPORT.md` in `/mnt/documents/icon-architecture/`.

Original data files are left untouched.

## 8. Backward Compatibility

- Old `/nominees/category/africa-education-icon-award` → 301-style client redirect to the new main page.
- Old profile links continue to work via the universal `/nominee/:slug` resolver, which now dispatches Icon slugs to `IconNomineeProfile`.

## 9. Files Created / Edited

**Created** (~14): data module, 4 page components, ~10 shared components, migration script, redirect stub.
**Edited** (~3): `src/App.tsx` (routes + redirect), nav links pointing at the old Icon Award page, `NomineeSlugRedirect` dispatch table.

## 10. Out of Scope

- No DB schema change — data lives in TS modules (matches existing GitHub-first nominee storage pattern).
- No new nominee write/admin UI; this is read/discovery only.
- Real nominee photos still depend on the existing NRC image pipeline; placeholders used where missing.

Approve to implement.
