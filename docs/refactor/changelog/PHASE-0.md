# Phase 0 — Foundations (shipped)

Date: 2026-07-14

## What shipped

1. **Canonical map** — `docs/refactor/canonical-map.md` covering all 17 clusters and ~183 audited pages, with primary audience, primary CTA, word budget and hero slot per row. Progress ledger table added at the bottom for phase tracking.
2. **Refactor redirects register** — `src/config/refactorRedirects2026.ts` with the first batch of 301s:
   - Deprecated voting pages → tier nominee pages
   - 2025 archived tier landings → 2026 canonical tier landings
   - Duplicate About / FAQ / Sponsor / directory routes
   - 5-region legacy pages → 8-region canonical anchors
   - "Friends of Africa" as-region routes → participation class
   - Endorsement language cleanup
3. **Wired into `App.tsx`** — additional `<RedirectRoute>` loop next to the existing `LEGACY_RECOGNITION_REDIRECTS` block. Redirects ship immediately; components can be safely deleted in later phases.
4. **Shared primitives** — `src/components/common/`:
   - `CTAStack` (enforces one primary + one secondary + one tertiary hierarchy)
   - `HeroCompact` (mobile-first landing hero, single H1, primary CTA above the fold on 360px)
   - `TierNoticeBanner` (four locked notice kinds: recognition · jury-only · impact-based · icon)
   - `TrustIndicators` (five approved trust markers from §12)
   - Barrel export via `src/components/common/index.ts`

## What did not change

- No public copy edits — Phase 1 owns the homepage rewrite.
- No component deletions — deletions land phase-by-phase after landings are rebuilt.
- `SiteHeader` / `NESAFooter` untouched (a prior turn already refactored them to the 10-item nav; Phase 1 will audit).

## Next up (Phase 1)

- Rebuild `/` with `HeroCompact` + `TrustIndicators` + 4 tier cards + directory preview + how-it-works + impact + participation + media + final CTA.
- Generate homepage hero art via imagegen premium.
- Register `hero_cta_click`, `tier_card_click`, `directory_preview_click`, `final_cta_click` analytics events.
- Update the canonical-map progress ledger to `shipped` for Phase 1 when done.

## Rule reminder

No component may be deleted before its old URL appears in `refactorRedirects2026.ts` and ships through `<RedirectRoute>`.
