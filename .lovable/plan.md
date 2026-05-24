
# NESA-Africa Landing Page Restructure — Execution Plan

This is a large, multi-section refactor. To avoid a single risky mega-change I'll ship it in 4 reviewable phases. Each phase leaves the site fully working — you can stop after any phase.

Scope is **landing page (`/`) + nominee discovery surfaces only**. No backend, voting, AGC ledger, certificates, auth, or RLS changes.

---

## Target landing-page flow (final state)

```text
1. HERO              headline + 4 primary CTAs (Nominate, Earn AGC, Explore Nominees, Browse Categories)
2. ECOSYSTEM TRUST   honourees / ecosystem strip — moved up
3. COUNTDOWN         Blue Garnet 2026 Gala — compact, premium
4. NOMINEE DISCOVERY "Explore Existing Nominees by Award Category" (carousel preview, link to /nominees)
5. REGIONAL PREVIEW  5 region cards → /regions
6. MOMENTS PREVIEW   4 tiles → /gallery
7. IMPACT WRAP-UP    EduAid-branded, simplified metrics
8. FINAL CTA         Nominate · Vote · Earn AGC
```

Everything else (Trending full grid, Merch, deep AGC, voting guide, ecosystem programs, full regions, full categories, full nominee search) moves off the homepage into dedicated routes.

---

## Phase 1 — Homepage section reorder + trim (highest impact, lowest risk)

**File:** `src/features/landing/NESALandingPage.tsx`

1. Reorder sections to the 8-section flow above.
2. Remove or collapse from the landing page:
   - Full Trending grid → keep max 4 preview cards + "View All Trending" link to `/trending`
   - Full Gallery → keep 4 tiles + "Explore Full Gallery" → `/gallery`
   - Merchandise block → remove from homepage (lives at `/store`)
   - Deep AGC explainer → 1 compact strip linking to `/agc`
   - Voting guide block → 1 compact strip linking to `/how-voting-works`
   - Ecosystem programs deep grid → link to `/ecosystem`
3. Move Ecosystem Trust + Countdown above nominee discovery.
4. Tighten hero CTA stack to exactly 4 buttons, mobile-first sizing (no oversized hero CTAs).

Deliverable: visibly cleaner, shorter homepage; no routes deleted.

---

## Phase 2 — Nominee discovery refactor on the landing page

**Files:** `src/features/landing/NESALandingPage.tsx`, reuse existing `src/components/nominees/CategoryDiscoveryGrid.tsx`.

1. Replace the current scattered nominee blocks on the homepage with a single "Explore Existing Nominees by Award Category" section using `CategoryDiscoveryGrid layout="carousel"` (already built).
2. Add a compact tabbed switcher above the carousel: **Category · Region · Impact Type · Country** — landing-page version shows top items only, "See all" → `/nominees`.
3. Confirm the global CTA rule is applied in the carousel:
   - Blue Garnet → secondary CTA = **Vote**
   - All others → secondary CTA = **Re-nominate**
   (Already enforced via `getSecondaryCtaHref` / `getSecondaryCtaLabel` in `src/config/nomineeCategories.ts`.)

Deliverable: one clear discovery surface on the homepage instead of 3–4 overlapping ones.

---

## Phase 3 — Dedicated internal pages for moved content

Create or confirm these routes; ensure each is fully self-contained so the homepage can safely link out:

| Route | Status | Action |
|---|---|---|
| `/nominees` | exists | already the full discovery (no change needed) |
| `/categories` | exists | confirm covers all award category families listed |
| `/regions` | exists (`RegionsIndexPage`) | confirm 5-region full grid |
| `/trending` | **new** | extract current homepage Trending block into a full page |
| `/gallery` | exists | confirm + ensure "Explore Full Gallery" lands here |
| `/agc` | exists (`AboutAGC` / `EarnVotingCredits`) | confirm canonical AGC hub route |
| `/how-voting-works` | **new** | extract voting explainer from homepage |
| `/ecosystem` | exists (`EcosystemPage`) | confirm |
| `/store` | exists (shop) | confirm merch lives here, not homepage |

Wire any new routes into `src/App.tsx` and `public/sitemap.xml`.

Deliverable: every "Explore" / "View All" link on the homepage resolves to a real, complete page.

---

## Phase 4 — Mobile-first polish + analytics hooks

1. Audit hero, CTA stack, section spacing at 360, 390, 414 widths. Reduce padding, button size, font size where current values bloat mobile.
2. Add 44pt min tap targets, snap-scroll for previews, lazy-load offscreen sections.
3. Add lightweight analytics events (using existing `useEDXMetrics` hook pattern) for:
   - hero CTA clicks, category card clicks, region clicks, "View all" clicks, scroll depth checkpoints (25/50/75/100%), bounce trigger (scroll <25% + exit).
4. SEO pass: per-route `<Helmet>` title/description/canonical, JSON-LD `CollectionPage` on `/nominees`, `/categories`, `/regions`, `/trending`.

Deliverable: measurable, mobile-optimized, indexable homepage.

---

## Out of scope (explicit)

- No changes to voting logic, AGC ledger, judging rubric, certificates, auth, or Supabase schema.
- No changes to the already-shipped nominee profile pages, Blue Garnet finalist flow, or category-internal logic.
- No new design system tokens — strict Charcoal/Gold per project memory.
- No content/copy rewrites beyond section headlines listed above. Copy refinement is a separate pass if you want it.

---

## Question before I start

Two things to confirm so Phase 1 ships cleanly:

1. **Trending block**: keep a 4-card preview on the homepage with a link to a new `/trending` page, or remove from homepage entirely?
2. **Merchandise**: fully remove from homepage (link from footer only), or keep a single thin "Shop the Movement" strip linking to `/store`?

Reply with answers (or "your call" and I'll pick the conversion-optimal default: 4-card Trending preview + remove merch from homepage) and I'll execute Phase 1 immediately.
