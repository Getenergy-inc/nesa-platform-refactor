
# NESA-Africa 60 → 38 Page Refactor

This is a multi-week program of work. To keep it safe (preserve Supabase data, auth, media, payments) and reviewable, I'll execute it in 9 controlled stages, each ending in a working, deployable state. Nothing valuable gets deleted — old routes become redirects or archived sections.

## Guiding principles

- **One website, in place.** No new project. Preserve domain, auth, Supabase rows, media, forms, payments, analytics.
- **4 tiers · 18 categories · 96 subcategories · 20 core + 18 category = 38 public pages.**
- **No public award voting in 2026** anywhere in the UI.
- **Terminology:** `pathway` → `subcategory` everywhere.
- **URLs:** `/recognition/{tier-slug}/{category-slug}`. Subcategories never get their own public page.
- **Config-driven:** one `AwardNominationForm`, one `award_cycles → tiers → categories → subcategories` spine, one timeline table, one media system.

## Target IA (final state)

**Nav (7 + Nominate CTA):** Home · Recognition · Impact Directory · Impact Programmes · Media & Events · Gala & Tickets · Support & Get Involved · **Nominate**.

**20 core pages:** `/`, `/about`, `/governance`, `/recognition`, `/recognition/gold-blue-garnet`, `/recognition/platinum`, `/recognition/africa-education-icon`, `/recognition/influencer-education-impact`, `/nominate`, `/directory`, `/regions`, `/timeline`, `/impact`, `/eduaid-africa`, `/rebuild-my-school`, `/special-needs`, `/afri-edutourism`, `/media`, `/gala`, `/support`.

**18 category pages** under their tier slug (9 GBG + 7 Platinum + 1 Icon + 1 Influencer).

## Stages

### Stage 1 — Audit & backup (read-only)
- Enumerate every current route from `src/App.tsx` + lazy routes → `docs/refactor/route-inventory.md`.
- Classify each: KEEP / MERGE / REDIRECT / CONVERT-TO-SECTION / DYNAMIC / DASHBOARD / ARCHIVE / REMOVE.
- Produce `docs/refactor/sitemap-38.md`, `route-migration-matrix.md`, `db-relationship-map.md`, `component-reuse-plan.md`.
- No code changes; deliverables are docs the user can review before Stage 2.

### Stage 2 — Governance & terminology sweep
- Remove/disable in UI: Vote Now, Vote with AGC (award context), voting leaderboards, trending/most-voted, voting countdowns, finalist/winner pages driven by public vote.
- Keep AGC wallet earn/spend for non-award utility; hide award-vote spend paths.
- Global rename `pathway` → `subcategory` across components, copy, i18n JSON, analytics events, config, tests.
- Restrict the 27 Icon judges to Icon-only routes (`ProtectedRoute` scope + guard in `judge-*` edge functions).

### Stage 3 — Data spine (Supabase migration)
Schema (all with GRANTs + RLS):
- `award_cycles`, `award_tiers`, `award_categories(tier_id)`, `award_subcategories(category_id)`, `award_classifications` (Icon only), `category_scopes`, `eligibility_rules`, `evidence_requirements`, `form_definitions`, `form_fields`, `timeline_events`.
- Extend `nominations` with `tier_id`, `category_id`, `subcategory_id`, `classification_id` (nullable, required for Icon); backfill from existing rows using current category slugs.
- Seed the canonical 4/18/96 taxonomy from a single TS source (`src/config/recognition/taxonomy2026.ts`) piped through a seed edge function.

### Stage 4 — Route architecture
- Add `/recognition` hub + 4 tier hubs.
- Replace 18 category routes with `/recognition/{tier}/{category}` served by one `<CategoryPage>` template that pulls tier/category/subcategories from DB config.
- Keep existing rich hero components as `legacyHero` slots (like current `AwardCategoryRoute`).
- All old category URLs → 301 via `src/config/redirects.ts` consumed by a `<RedirectRoute>` and mirrored in `public/_redirects` isn't used on Lovable (SPA fallback handles paths) — do redirects client-side + update sitemap.

### Stage 5 — Unified nomination form
- One `<AwardNominationForm>` component driven by `form_definitions` + `form_fields` for the active `award_cycle`.
- Flow: Subcategory → Nominee → Contribution → Evidence → Nominator → Review → Draft/Submit → Email verify → Account link → Wallet link → Reference → NRC record.
- Config flags per tier: `public_voting_enabled=false` (all), `judge_review_enabled=true` (Icon only), `governance_review_enabled=true` (all).
- Embed on every category page; `/nominate` becomes the gateway (tier → category → subcategory picker → same component).

### Stage 6 — /timeline and /media
- `/timeline`: DB-driven from `timeline_events`; seed the 13 phases; mobile accordion + desktop rail; no voting windows.
- `/media`: hub with the 18 defined sections; back it with existing `media_assets` + new `media_stories`, `media_series`, `media_episodes`, `media_accreditations`, `media_consents`.
- Media Dashboard (authenticated, not counted in 38).

### Stage 7 — Consolidation pages
- `/directory` replaces nominees/finalists/winners/trending with unified filters.
- `/support` merges sponsors, partners, donate, volunteer, ambassadors, chapters, shop, help, contact into tabbed sections.
- `/impact` + `/eduaid-africa` reposition Rebuild / Special-Needs / Afri-EduTourism as EduAid services.
- Preserve existing content by moving into these parents; archive raw pages behind redirects.

### Stage 8 — Redirects, SEO, analytics
- Implement the full redirect map from the prompt + any extras found in Stage 1.
- Update `scripts/generate-sitemap.ts` to the 38-page set + dynamic category/directory routes.
- Update `index.html` head + per-route `<Helmet>` for the new IA; JSON-LD (Organization sitewide, Event for Gala, Article for media, BreadcrumbList on category pages).
- Wire the required analytics events through `src/lib/analytics.ts`.

### Stage 9 — QA, launch, monitoring
- Playwright specs: nav, tier hubs, category template, nomination form per tier, /timeline phases, /directory filters, redirect matrix, mobile viewport.
- Banned-strings CI: block reintroduction of `pathway`, `Vote Now`, `Vote with AGC` (award context), voting countdown copy.
- Preview → stakeholder review → production; keep rollback via git.

## Technical details

- **Category template:** extend existing `AwardCategoryPage` + `AwardCategoryRoute` to consume DB config (tier, category, subcategories, evidence, timeline slice). Keep `legacyHero` per category for visual continuity.
- **Redirects:** SPA-side `<RedirectRoute to="…" status={301}/>` component + `<meta http-equiv="refresh">` fallback in the rendered shell; add each old path to sitemap-exclude list.
- **Voting removal:** delete/guard routes `GoldVoting`, `BlueGarnetVoting`, `GoldBlueGarnetVoteHub`, `VoteWithAGCSection`; retain non-award AGC earn flows.
- **Data safety:** every schema change is additive; backfills run in idempotent migrations; no destructive drops until Stage 9 sign-off.
- **Icon jury scoping:** enforce `judge_assignments.tier_id = 'africa-education-icon'` in RLS + edge function guards.

## Deliverables per stage

Each stage ends with: a short changelog, updated `ROUTES.md`, updated `docs/refactor/*`, passing typecheck + targeted Playwright, and a preview URL for review before the next stage starts.

## What I need from you to start

1. **Confirm the staged approach** (I'll start Stage 1 audit immediately on approval — no code changes yet).
2. **Confirm scope of voting removal**: remove entirely from the 2026 UI, or keep behind a feature flag for post-2026 seasons? (Recommended: feature-flag off, code retained.)
3. **Any routes/pages you explicitly want KEPT** even if the audit flags them as duplicates?

On approval I will produce the Stage 1 audit docs first so we have a shared migration matrix before touching code.
