## Goal

Deliver a single, consistent architecture for the 4 NESA-Africa award tiers — Africa Education Icon, Gold-Blue Garnet, Platinum Recognition, Influencer Education Impact — with matching category pages and category-specific nomination forms, all driven by one central config. Language reinforces "Education Enablers enabling Education for All across Africa" (no "education changemakers").

Existing assets we will reuse (not rebuild):
- `src/config/recognition/*` (18 categories, 96 subcategories, 4 tiers) — spine of tier + category data.
- `src/config/nomination/*` (iconTaxonomy, platinumForms, goldBlueGarnetForms, influencerForms, awardCategoryForms) — schema-per-category source of truth.
- `src/pages/awards/AwardCategoryStandardPage.tsx` + `src/components/awards/standard/*` — reusable tier layout with `SubcategoryPathways`.
- `src/components/awards/TierCategoryCards.tsx`, `src/components/awards/InfluencerNominationForm.tsx`, `src/components/nominate/*`, `src/config/nomination/awardPageContent.ts`.

We are consolidating what already exists, not adding a parallel system.

## Scope of changes

### 1. Central tier + category config
- Extend `src/config/recognition/taxonomy2026.ts` (or add `tierConfig.ts` alongside) with per-tier metadata the pages need: `tierNumber`, `recognitionType`, `selectionMethod`, `nominationOpen`, `nominationClose`, `voteEnabled`, `eligibilitySummary`, `evidenceRequirements[]`, `evaluationCriteria[]`, `heroCopy`, `whoCanBeNominated`, `finalCta`.
- Guarantee every one of the 18 categories carries: `slug`, `name`, `description`, `nomineeType`, `geographicScope`, `selectionMethod`, `status` (`open|coming-soon|closed|voting|finalists|winners`), `subcategories[]`, `classifications[]?` (Icon only), `formSlug` (link into `awardCategoryForms.ts`).

### 2. Awards landing `/awards`
- Refactor to render the 4-tier overview from config: hero ("Four Recognition Tiers. One Continental Mission."), tier cards with tier number, description, recognition type, who may be nominated, selection method, category count, "Explore Tier" + "Nominate" CTAs.

### 3. Tier landing pages (4)
- One shared `TierLandingPage` component driven by tier slug. Routes:
  - `/awards/africa-education-icon`
  - `/awards/gold-blue-garnet`
  - `/awards/platinum-recognition`
  - `/awards/influencer-education-impact`
- Sections: Hero → About this tier → Who can be nominated → Category directory (cards linking to category page + nomination) → How selection works → Evidence requirements → Existing nominees (verified only) → Final CTA. Breadcrumbs on every page.
- Icon page keeps the 3 classifications (Africans in Africa / Diaspora / Friends of Africa) as tabs on category pages; single page, not 3 duplicates. Icon page states jury-selected; hides voting language.

### 4. Category pages
- One reusable `CategoryDetailPage` (already exists; extend) rendered at:
  - `/awards/africa-education-icon/:categorySlug`
  - `/awards/gold-blue-garnet/:categorySlug`
  - `/awards/platinum-recognition/:categorySlug`
  - `/awards/influencer-education-impact/:categorySlug`
- Content: hero image, description, eligibility, geographic scope, subcategories, classifications (Icon only), selection method, evaluation criteria, evidence requirements, existing verified nominees, related categories, FAQs, "Nominate in this category" CTA. Draft/Coming Soon badge when category has no approved form.

### 5. Nomination routing
- `/nominate/:tierSlug/:categorySlug` resolves to the correct category-specific form via `getCategoryFormBySlug` in `awardCategoryForms.ts`. Preserves the existing draft/save/auth-at-submit flow from `src/components/nominate/*`.
- Tier-specific form variants (Icon lifetime, GBG organisation, Platinum institutional, Influencer public-figure) already exist — wire tier → form component map and enforce required field sets per tier (per spec sections 5, 8, 10, 12).
- Tier 1 forms strip all public-voting copy.

### 6. Navigation + breadcrumbs
- Awards mega-menu items match section 17 (Explore All Four Tiers, 4 tier links, Explore Existing Nominees, Nomination Guidelines, Judging & Voting, Awards Timeline). No category links in global nav.
- Breadcrumb component on every tier / category / nominate page (Home > Awards > Tier > Category).

### 7. SEO + a11y
- Per-route `<Helmet>` with unique title, description, canonical, OG. Breadcrumb JSON-LD.
- Semantic headings, labelled form fields, keyboard nav, visible focus, adequate contrast — using existing shadcn/Radix primitives.

### 8. Database
The recognition spine tables already exist (`recognition_tiers`, `recognition_categories`, `recognition_subcategories`, `recognition_classifications`, `nominations`). No destructive changes; only add nullable columns if we need `evidence_requirements` / `evaluation_criteria` server-side. Existing nominee + nomination data preserved. No migration required for Phase 1 (config-driven); flag Phase 2 migration only if we move criteria/evidence copy from TS into DB.

## Out of scope (this pass)
- No changes to voting engine, wallet, judging RPC.
- No net-new categories — we only render what config already approves; missing content marked Draft.
- No footer / homepage layout changes.

## Technical notes
- Single tier component: `src/pages/awards/TierLandingPage.tsx` (extract from existing `AwardCategoryStandardPage.tsx` where possible).
- Config additions co-located in `src/config/recognition/tierPageContent.ts` (typed).
- Status badges use existing `Badge` variants + design tokens (`bg-primary`, `bg-muted`, `bg-accent`) — no hardcoded colors.
- All 4 tier pages, 18 category pages, and 4 form templates render off the same 2 shared components; adding a new subcategory becomes a config-only change.

## Deliverables
- 4 tier pages + 18 category pages routing cleanly, all sourced from `recognition/*` and `nomination/*` config.
- Category-specific nomination forms live per tier at `/nominate/:tier/:category`.
- Breadcrumbs, SEO tags, and a11y on every tier + category page.
- Redirect audit for any legacy `/awards/*` paths that shift slug.
- Playwright smoke: `/awards`, each tier page, one category per tier, one nominate route per tier — asserting no 404 and hero heading present.

Ready to build on approval.