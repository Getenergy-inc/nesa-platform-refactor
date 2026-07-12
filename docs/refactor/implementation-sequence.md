# Implementation Sequence

Each stage ships in a working, deployable state and ends with a preview URL for review.

## Stage 1 — Audit & backup (this stage, no code changes) ✅
Deliverables in `docs/refactor/*`. Awaiting sign-off before Stage 2.

## Stage 2 — Governance & terminology
- Feature flag `PUBLIC_AWARD_VOTING=false` (default). Hide/guard: `MainNav` vote items, `VoteWithAGCSection`, `/vote*`, `/awards/gold-blue-garnet/vote*`, voting countdowns, trending/finalists/winners driven by vote.
- Global rename `pathway` → `subcategory` (code, copy, i18n JSON, analytics event names, tests). Update `scripts/check-banned-strings.sh` to enforce.
- Icon jury scoping: guard in `judge-*` edge functions + `ProtectedRoute` scope.
- No routing churn yet.

## Stage 3 — Data spine
- One migration: `award_cycles`, `award_tiers`, `award_categories`, `award_subcategories`, `award_classifications`, `category_scopes`, `eligibility_rules`, `evidence_requirements`, `form_definitions`, `form_fields`, `timeline_events` — with GRANT + RLS + policies.
- Extend `nominations` with nullable `cycle_id/tier_id/category_id/subcategory_id/classification_id/page_source/campaign_source`.
- Seed via edge function from `taxonomy2026.ts`. Backfill `nominations` (report unmatched to `nominations_backfill_queue`).

## Stage 4 — Route architecture
- Add `/recognition`, 4 tier hubs, 18 category routes.
- Introduce `<RedirectRoute>`; wire the redirect map from `route-migration-matrix.md`.
- Preserve current visual hero via `legacyHero` slot.
- Update `ROUTES.md`, `scripts/generate-sitemap.ts`, robots.

## Stage 5 — Unified nomination form
- `AwardNominationForm` reads `form_definitions`/`form_fields` for `(cycle, tier, category)`.
- Embedded on every category page; `/nominate` gateway hands off with URL params.
- Draft autosave, email verify, account link, wallet link, NRC record creation.

## Stage 6 — Timeline & Media
- `/timeline` from `timeline_events` (seed 13 phases). Mobile accordion + desktop rail. No voting windows.
- `/media` hub with 18 sections backed by `media_series/episodes/stories/…`.
- Authenticated Media Dashboard (not in 38).

## Stage 7 — Consolidation
- `/directory` becomes the single canonical list; retire trending/finalists/winners aliases (already redirected).
- `/support` merges sponsors/donate/volunteer/ambassadors/chapters/merch/help/contact into tabbed sections.
- `/impact` → `/eduaid-africa` positioning locked in; `/rebuild-my-school`, `/special-needs`, `/afri-edutourism` retained as services.

## Stage 8 — SEO & analytics
- Per-route `<Helmet>` with canonical/og for the 38 pages.
- JSON-LD: Organization sitewide; Event (`/gala`); Article (media stories); BreadcrumbList (category pages).
- Analytics events wired: `tier_view`, `category_page_view`, `subcategory_selected`, `nomination_form_started/draft_saved/submitted`, `timeline_phase_viewed`, `directory_profile_viewed`, `gala_ticket_*`, `donation_*`, `media_story_viewed`, `certificate_downloaded`, `sponsor_enquiry_submitted`.
- Broken-link scan + redirect-loop check.

## Stage 9 — QA & launch
- Playwright: nav 7 items, tier hubs, category template, nomination form (per tier), timeline 13 phases, directory filters, redirect matrix, mobile viewport.
- Banned-strings CI: `pathway`, `Vote Now`, `Vote with AGC` (award context), `Trending Nominees`.
- Optional destructive migration: set NOT NULL on `nominations.tier_id/category_id/subcategory_id` once backfill queue is empty.
- Staging → stakeholder review → production. Rollback via git.

## Entry/exit gates

Each stage requires:
- Green typecheck.
- Targeted Playwright green.
- Updated `ROUTES.md`.
- Preview URL screenshot in the stage changelog.
