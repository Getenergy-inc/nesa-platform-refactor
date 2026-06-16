# NESA-Africa 2026 MVP Refactor — Implementation Plan

This is a large, multi-surface refactor. To ship safely without breaking the live site, I propose **5 slices**. Approve all, or check the ones you want now and I'll defer the rest.

---

## Slice 1 — Public Navigation Slim-Down (high impact, low risk)

**File:** `src/config/navigation.ts`

Reduce top-level public nav to exactly 9 items:
`Home · About · Awards · Participate · Sponsors & Partners · Impact Programs · Media & Events · Join the Movement · Contact`

- Collapse current dropdowns into these 9 buckets (Explore Nominees moves under **Participate** alongside Nominate, Vote, Volunteer).
- Hide from public nav: Admin, NRC, Audit, Wallet, Dashboard, Jury, Judging, Voting Governance, Payment, internal review surfaces. Routes remain reachable for authenticated roles via `/dashboard/*` only.
- CTA strip (header + mobile bottom): **Primary** Nominate Now · **Secondary** Explore Existing Nominees · **Support** dropdown (Gala Ticket, Merch, Donate, Become a Sponsor, Nominate a Special Needs School).

## Slice 2 — Landing Page Focus Pass

**File:** `src/features/landing/NESALandingPage.tsx`

Reorder + prune to the approved 10-block flow:
1. Hero (3 CTAs: Nominate / Explore Nominees / Explore Categories)
2. Gala Countdown (22 Oct 2026)
3. Featured Changemakers + "Explore Existing Nominees" CTA
4. Four Recognition Pathways (Icon, Gold-Blue Garnet, Platinum, Influencer)
5. Explore Categories
6. Interactive Africa Map (Explore Africa's Regions)
7. Special Needs School Intervention (powered by EduAid + RMSA + NESA-Africa TV)
8. Sponsors & Partners strip
9. Join the Movement (Volunteers · Ambassadors · Judges · Chapters)
10. Final CTA: "Don't just applaud education changemakers. Nominate them."

Remove from landing: governance firewall block, sponsor pricing teaser, duplicate impact preview, About-NESA long section (moves to `/about`).

## Slice 3 — Nominee Directory as "Africa's Education Impact Directory"

**Files:** `src/pages/nominees/NomineesHubPage.tsx`, nominee profile component

- Rename hero copy + SEO title to **Africa's Education Impact Directory**.
- Ensure each profile renders the mandatory question header: **"How has this nominee contributed to Education for All in Africa?"** with EDI Matrix block, impact stories, biography, region map link, category chips.
- No data migration — uses existing DB-driven nominee feed.

## Slice 4 — Dashboard Consolidation (hide NRC + Judges from public)

**Files:** `src/App.tsx`, `src/config/navigation.ts`, dashboard route registrations.

- Move `/nrc/*` modules under `/dashboard/volunteer/research` (Tasks, Evidence, Duplicates, Reports). Keep old paths as authenticated redirects so existing bookmarks work.
- Move `/jury/*` under `/dashboard/judge/*` (Assigned Categories, Evidence Review, Scorecards, COI, Submitted Scores).
- Remove any header/footer links pointing at `/nrc`, `/jury`, `/admin`, `/wallet`, `/audit` for unauthenticated visitors.

## Slice 5 — Support / CTA Plumbing

- Add unified `<SupportCTAGroup>` component used in header (desktop dropdown), footer, and mobile sheet, exposing: Buy Gala Ticket, Buy Merch, Donate, Become a Sponsor, Nominate a Special Needs School.
- Wire to existing routes: `/tickets`, `/merch`, `/donate`, `/partners`, `/eduaid/special-needs-nomination`.

---

## Out of Scope (explicitly deferred to Phase 2/3 per your spec)

- Database schema changes (entities already exist per current Supabase tables).
- AGC wallet redesign, ticketing, merchandise checkout, RMSA full build, analytics dashboards.
- Building 152 enterprise pages — backend register is preserved as-is behind auth.

## Verification

After each slice: visual check of `/`, `/nominees`, `/dashboard`, mobile 561px viewport; confirm no public links to `/admin`, `/nrc`, `/jury`, `/wallet`.

---

**Which slices should I ship now?** Reply with slice numbers (e.g. "1, 2, 3" or "all"). Slice 1 + 2 alone deliver ~70% of the perceived "premium awards platform" outcome and are the safest first push.
