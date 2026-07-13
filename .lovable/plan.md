
# NESA-Africa 2026 — 18 Dedicated Category Pages

This is a large refactor. To avoid a wall of untested code, I'll deliver in 4 phases with checkpoints. You can approve/adjust after each.

## Architecture (single source of truth)

```text
src/config/recognition2026/
  tiers.ts                       // 4 tiers, order, review routes, integrity notice
  categories/
    index.ts                     // registry of 18 categories
    icon-award.ts                // 1 file per category
    influencer.ts
    platinum-library.ts          // …7 platinum
    gbg-csr-africa.ts            // …9 gold-blue garnet
    ...
  formSchemas/
    <category-slug>.ts           // 18 unique form schemas (sections, questions, evidence, geography)
  geographyModels.ts             // 7 models: ICON_CLASSIFICATION, AFRICA_REGION_COUNTRY, etc.
  nomineeTypes.ts
  evidenceRules.ts
  integrity.ts                   // shared notice text + FAQs

src/components/recognition2026/
  TierLandingPage.tsx            // one component, tier-driven
  CategoryPage.tsx               // one component; 13 sections per spec
  sections/*                     // Breadcrumb, Hero, Overview, WhoCanBeNominated,
                                 //   SubcategoryPicker, Geography, Eligibility,
                                 //   Evidence, Integrity, FAQs, FinalCTA
  form/
    NominationFormEngine.tsx     // schema-driven renderer
    fields/*                     // shared inputs (Identity, Contribution, Uploads, Nominator, Declaration)
    SubmissionSuccess.tsx        // reference number screen

src/pages/recognition/
  Recognition2026Index.tsx       // /recognition
  tiers/[tier].tsx               // 4 routes
  categories/[tier]/[category].tsx  // 18 routes (data-driven via registry)
```

Every category page = same `CategoryPage.tsx` reading from the category config + its form schema. No copy-paste pages.

## Phase 1 — Foundation (this batch)

1. Config skeleton: `tiers.ts`, `categories/index.ts`, `geographyModels.ts`, `nomineeTypes.ts`, `integrity.ts` with all 18 category stubs (slug, title, tier, review route, subcategory count, opening/closing dates from `masterTimeline2026`).
2. Routes: 4 tier routes + 18 category routes wired in `App.tsx` (rendering placeholder from the shared page component).
3. Publication validator script: asserts `Icon=3, Influencer=3, Platinum=27, GBG=63, total=96` at build time.
4. Redirects from old award slugs to new `/recognition/...` routes.

## Phase 2 — Tier + Category page shells

1. `TierLandingPage.tsx` — full spec (tier meta, review route, integrity, category cards in approved order).
2. `CategoryPage.tsx` — all 13 sections rendered from config (form section still a placeholder).
3. Per-page SEO via `react-helmet-async` (title/description/canonical/OG/breadcrumb JSON-LD).

## Phase 3 — Nomination Form Engine

1. Schema types (section → question groups → fields, with conditional geography).
2. `NominationFormEngine.tsx`: autosave draft (localStorage keyed by category+session), progress indicator, one-group-at-a-time, file uploads with progress, keyboard/a11y.
3. Shared field packs (Identity variants, Contribution, Evidence, Nominator, Declaration).
4. `SubmissionSuccess.tsx` with `NESA-2026-{CODE}-{seq}` reference number.
5. Wire to existing `nominations` table (map to `category_id`/`subcategory_id`/`nominee_master_id`); no new DB tables in this phase unless a required field is missing — I'll flag any gaps and propose migrations before running them.

## Phase 4 — 18 Unique Form Schemas + polish

1. Author all 18 `formSchemas/<slug>.ts` per the category-specific field lists in your brief.
2. FAQs per category, evidence rules per category.
3. Integrity guardrails: strip any voting/leaderboard UI from these routes; central `IntegrityNotice` component.
4. QA: Playwright smoke — every category route renders, form validates required fields, submission returns a reference number, mobile viewport clean.

## Technical notes

- Reuses `masterTimeline2026.ts` for opening/closing dates (single source).
- Existing DB schema already has `award_categories`, `subcategories`, `nominations` — I'll map to those and only propose migrations for missing columns (e.g. `form_definition_id`, `form_version`, `subcategory_code`). No new "voting" fields.
- Existing `AwardCategoryStandardPage` and current `/awards/*` routes stay live behind redirects until the new `/recognition/*` routes ship, then flip.
- No public voting UI added on any `/recognition/*` route.

## Questions before I start Phase 1

1. **Coexistence vs cutover**: keep the current `/awards/*` tier pages live during rollout and redirect at the end, or hard-cut to `/recognition/*` immediately (breaks inbound links / prior QA)?
2. **DB scope**: are you OK if I keep nominations flowing into the existing `nominations`/`nominee_master` tables and only add columns as needed, rather than creating the full new table set (`award_cycles`, `nomination_form_definitions`, `nomination_form_sections`, `nomination_form_questions`, `category_nominee_types`, `category_geography_rules`, `category_evidence_requirements`, `duplicate_matches`, `verification_cases`)? Full new-table build is ~2 extra phases.
3. **Copy source**: use the category-specific field lists in this brief verbatim for the 18 form schemas, or should I first re-check any category against the master workbook you shared earlier for the Icon award?
4. **Phase 1 kickoff**: approve this plan as-is, or trim/expand phases before I start?
