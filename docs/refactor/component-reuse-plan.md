# Component Reuse Plan

## Keep and extend (do not rebuild)

| Existing | Role in new IA |
|---|---|
| `src/components/navigation/MainNav.tsx` | Trim to 7 primary items + Nominate CTA; keep analytics instrumentation |
| `src/components/awards/AwardCategoryPage.tsx` | Category template base — accept DB-loaded config |
| `src/pages/awards/AwardCategoryRoute.tsx` | Route wrapper — switch from `getCategoryBySlug` (static) to DB fetch by `(tier, category)` slug pair; keep `legacyHero` slot |
| `src/components/awards/CategoryNominationForm.tsx` | Rename → `AwardNominationForm`; drive from `form_definitions` + `form_fields`; embedded on every category page |
| `src/components/awards/NativeCategoryNominationForm.tsx` | Field-rendering primitives |
| `src/pages/about/Timeline.tsx` + `src/config/schedule.ts` + `src/data/recognitionJourney2026.ts` | Merge into `/timeline`, source from new `timeline_events` table |
| `src/components/nesa/NESAFooter.tsx` | Update nav sections to new 7 |
| `src/components/nesa/CallForNominationIconAward.tsx` | Retire from home; content moves into `/recognition` tier hubs |
| `src/pages/nominees/NomineesHubPage.tsx` | Repoint to `/directory`; keep filter UI |
| `src/pages/media/*` | Absorbed as sections of `/media` hub |
| `src/pages/vote/*`, `VoteWithAGCSection.tsx`, `GoldBlueGarnetVoteHub.tsx` | Retire routes; leave code archived behind feature flag `PUBLIC_AWARD_VOTING=false` |
| `src/lib/analytics.ts` | Add missing events from the spec (`tier_view`, `subcategory_selected`, `nomination_form_started`, `timeline_phase_viewed`, etc.) |

## New components (Stage 4–6)

| Component | Path | Purpose |
|---|---|---|
| `RecognitionHubPage` | `src/pages/recognition/RecognitionHub.tsx` | `/recognition` |
| `TierHubPage` | `src/pages/recognition/TierHub.tsx` | 4 tier hubs from one template |
| `CategoryTemplatePage` | `src/pages/recognition/CategoryTemplate.tsx` | 18 category pages from one template (DB-driven) |
| `AwardNominationForm` | `src/components/nominate/AwardNominationForm.tsx` | Unified nomination surface |
| `NominateGatewayPage` | `src/pages/nominate/NominateGateway.tsx` | `/nominate` picker |
| `DirectoryPage` | `src/pages/directory/Directory.tsx` | `/directory` with full filter set |
| `MediaHubPage` | `src/pages/media/MediaHub.tsx` | `/media` with 18 sections |
| `TimelinePage` | `src/pages/timeline/Timeline.tsx` | `/timeline` (DB-driven 13 phases) |
| `SupportHubPage` | `src/pages/support/SupportHub.tsx` | Merged `/support` with tabs |
| `RedirectRoute` | `src/components/routing/RedirectRoute.tsx` | `<Navigate>` wrapper with analytics + `<meta refresh>` fallback |

## Taxonomy source of truth

`src/config/recognition/taxonomy2026.ts` — the canonical TS declaration of 4 tiers · 18 categories · 96 subcategories · 3 classifications. Consumed by:
- Stage 3 seed function
- Stage 4 category/subcategory registry mappers
- Stage 8 sitemap generator
- CI check: taxonomy count assertions
