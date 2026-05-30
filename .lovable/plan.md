# NESA-Africa 2026 Refactor Plan

This is a large, multi-area refactor. To keep it shippable and reviewable, I'll break it into **6 phases**. Each phase is independently deployable and preserves all existing content (branding, Blue Garnet, categories, nominees, volunteers, judges, regions, EduAid, RMSA, Sophia AI, donations, sponsorship).

You can approve the whole plan, or tell me to start at a specific phase.

---

## Phase 1 — Two-Level Navigation (SCEF model)

Refactor `src/config/navigation.ts` + `src/components/navigation/MainNav.tsx` into two stacked bars:

**Level 1 — Governance Bar** (thin, top, dark):
Governance · Judges · Volunteers · Local Chapters · Partners · Sponsors · Donate · Login · Wallet · Language

**Level 2 — Primary Nav** (main bar, gold accents):
About · Awards · Impact Programs · Engage · Media · Support · Sponsor NESA-Africa · Contact

Each Level 2 item gets the exact submenu tree from your spec (e.g. Awards → Africa Education Icon, Blue Garnet, Platinum, Influencer, All Categories).

Mobile: single hamburger drawer with accordion sections for **both** levels (keyboard nav + focus trap already shipped).

Adjust `PublicLayout` top padding (`pt-14 sm:pt-16 lg:pt-[100px]`) to account for the new two-bar height.

## Phase 2 — Governance & Transparency Hub

New route `/governance` with anchored sections:
- Transparency · Conflict of Interest · Independent Verification · Voting Integrity · Judge Independence · Anti-Bribery · Sponsor Firewall · Appeals & Complaints · Data Protection

Reuses existing `INTEGRITY_DISCLAIMER` / `SPONSOR_DISCLAIMER` from `src/config/awardCategories/disclaimers.ts`.

Add a persistent **sponsor-firewall banner** component used on Awards, Nominate, Vote, Sponsor pages:
> "Sponsorship, partnership, donations, endorsements, and visibility opportunities do not influence nominees, judges, voting outcomes, finalists, or winners."

## Phase 3 — Meet Our Volunteers / Meet Our Judges (dynamic profiles)

**Volunteers** (`useVolunteers` hook already exists):
- `/volunteers` index — grid of cards
- `/volunteers/:slug` — profile page: bio, country of residence, country of origin, contributions, social links, referral link, certificate eligibility badge, link to volunteer dashboard

**Judges**:
- `/judges` index (extend existing `MeetOurJudges` component)
- `/judges/:slug` — profile page: expertise, country, bio, social links, governance declaration block, COI status badge

No schema changes required for phase 3 — uses existing tables; adds only frontend routes.

## Phase 4 — Sophia AI repositioning

Update `CustomerCareChat` header/intro copy → "Sophia — Official NESA-Africa Support Assistant". Add capability chips (Nominations · Voting · Sponsorship · Volunteering · Judging · Local Chapters · RMSA · EduAid). Add WhatsApp escalation CTA → `+2348109765897`.

## Phase 5 — Regional Ecosystem links

On each region hub page, ensure the action list links to: regional profile, EduAid conference, RMSA legacy project, special-needs nomination, voting, regional GFA Wallet, sponsorship, impact reports. Most exist — this phase audits and fills gaps.

## Phase 6 — Donor & Sponsor Trust block

New reusable `<DonorTrustPanel />` shown on `/partners`, `/support/donate`, sponsorship pages:
- Approved channels (GFA Wallet, bank transfer)
- Anti-fraud notice
- Sponsorship policy link
- Legacy fund reporting link

## Mobile QA (cross-cutting)

After Phase 1 + 2, verify at 320 / 375 / 414 / 768 / 1024:
- No navbar overlap (existing `tests/e2e/navbar-overlap.spec.ts`)
- Drawer focus trap (existing `tests/e2e/mobile-drawer-focus-trap.spec.ts`)
- Touch targets ≥ 48px (already enforced in current drawer)

---

## What I will NOT touch

Branding, Blue Garnet identity, award categories, nominee data, existing volunteer/judge/region pages, EduAid, RMSA, Sophia core logic, donation flows, sponsorship flows, wallet, auth, RLS, backend.

## Technical notes

- All new routes registered in `src/App.tsx` and `ROUTES.md`.
- All copy goes through `react-i18next` keys under `pages.*` so the 11-language coverage is preserved.
- Colors: only `charcoal` / `gold` semantic tokens — no hex in components.
- No DB migrations needed for any phase.

---

## How would you like to proceed?

1. **Ship all 6 phases sequentially** (large change, ~6 follow-up turns)
2. **Start with Phase 1 + 2 only** (navigation + governance — biggest credibility lift)
3. **Pick specific phases** — tell me which numbers
