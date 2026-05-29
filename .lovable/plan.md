# NESA-Africa Mobile-First Refactor — Delivery Plan

You picked the maximum scope (Phases 1+2, profile pages + Sophia voice, mobile up to 1024px). That's realistically **4 sequential PRs**, not one. Shipping it as a single mega-change would break the live site. Here's the plan — approve and I start on Pass 1 immediately.

## Global breakpoint change (applies to all passes)

Switch the "mobile" cutoff from `md` (768px) to `lg` (1024px) everywhere:
- `NESALandingPage.tsx`: all `hidden md:block` wrappers → `hidden lg:block`
- `PublicLayout.tsx`: `pb-20 lg:pb-16` (already correct)
- `MobileBottomNav`, `MobileStickyNominateCTA`, `MobileAGCWallet`: render up to `lg`
- `Header`: hamburger up to `lg`, desktop nav from `lg` up

## Pass 1 — Navigation + Hero + Homepage hierarchy

**Navigation (`MainNav.tsx`)**
- Visible hamburger ≤1024px, full-screen drawer (not slide-in popover)
- Accordion sections for: About · Awards · Impact Programs · Engage · Media · Support
- Pinned bottom CTAs in drawer: "Become a Sponsor" (gold outline) + "Nominate 2026" (gold filled)
- 44px min touch targets; z-index audit (drawer z-50, Sophia z-40, sticky CTA z-30)
- Fix dropdown clipping with `Portal` + `collisionPadding`

**Hero (`TrophyHeroSection` / `NESAHero`)**
- Mobile: cut hero height ~30%, shorter headline, single descriptive line
- Stacked CTA order: Nominate 2026 (primary) → Explore Nominees → Vote → Earn AGC
- Remove triple "Vote — Gold / Vote — Blue Garnet" buttons on mobile (consolidate to one "Vote" → /vote with tier picker)
- Lazy-load backdrop image, add `fetchpriority="high"` preload

**Homepage order (`NESALandingPage.tsx`)** — match your spec exactly:
1. Hero → 2. CTAs (in hero) → 3. Trust strip + Ecosystem → 4. Countdown → 5. **Award Categories** (new mobile rail position) → 6. Existing Nominees → 7. Regional Map → 8. Impact Programs (ImpactWrapUp) → 9. Sponsors → 10. Volunteers → 11. Gallery (Moments) → 12. Impact highlights → 13. FAQ → 14. Final CTA

**Overlay audit**: Sophia floating button moves to `bottom-24` on mobile to clear MobileBottomNav and sticky Nominate CTA. Document final z-index stack.

## Pass 2 — Mobile card system + category/nominee browsing

- Unify card primitives: `MobileSwipeCard` wrapper with snap-x scroll, consistent h-[280px], CTA always visible at bottom
- Refactor: award cards, nominee cards, region cards, volunteer cards, sponsor cards through this primitive
- Category cards show: image · title · description · nominee count · Explore + (Vote OR Update Impact) CTAs
- **Bottom-sheet filters** for `/nominees`: Sheet from shadcn, filter chips, applied count badge on filter button
- Lazy-load nominee images with native `loading="lazy"` + blur placeholder

## Pass 3 — Volunteer + Judge public profile pages

- New routes: `/volunteers/:slug` and `/judges/:slug` (public-facing profiles)
- Profile shell: hero photo, name, role, country, expertise tags, bio, social links, contribution badges, referral link, "Get in touch" CTA
- Directory pages (`/volunteers`, `/judges`) get mobile card grid with search + region filter
- Dashboards (private) stay as follow-up — out of scope for this pass

## Pass 4 — Sophia AI mobile bottom sheet + voice

**Requires ELEVENLABS_API_KEY** — I'll request it before starting this pass.

- Convert Sophia from floating chat panel to mobile bottom sheet (Sheet with `side="bottom"`, `h-[85dvh]`)
- Quick-action chips at top: How do I nominate? · How do I vote? · Earn AGC · Volunteer · Sponsor · Tickets · Nominate a School
- Voice: ElevenLabs Conversational Agent via `@elevenlabs/react` `useConversation`, WebRTC token from edge function `elevenlabs-conversation-token`
- Language picker: en/fr/sw/ha/yo (uses i18n)
- Hidden when keyboard open; never overlaps CTAs

## Technical details

- **Files touched (estimated 30–40)**: `src/components/navigation/MainNav.tsx`, `src/components/nesa/TrophyHeroSection.tsx`, `src/components/nesa/NESAHero.tsx`, `src/components/nesa/HeroCTAStack.tsx`, `src/features/landing/NESALandingPage.tsx`, `src/components/landing/MobileCategoryRail.tsx`, `src/components/nominees/*`, `src/components/cards/MobileSwipeCard.tsx` (new), `src/pages/volunteers/[slug].tsx` (new), `src/pages/judges/[slug].tsx` (new), `src/components/sophia/*` (refactor), `supabase/functions/elevenlabs-conversation-token/index.ts` (new), routes registration.
- **No DB migrations** in Passes 1–3. Pass 4 may add an `agent_conversations` log table if you want voice transcripts persisted (otherwise ephemeral).
- **No breaking API changes**; all changes are presentation-layer.
- **Tests**: existing Playwright suites (`navbar-overlap.spec.ts`, `voting-responsive.spec.ts`) should keep passing; I'll update breakpoint assertions.

## What I will NOT do without explicit follow-up

- Rewrite forms (nomination/volunteer/judge/sponsor/school) — you listed these but Pass 1–4 is already huge. Forms come in Pass 5.
- Build private dashboards for volunteers/judges with contribution history & referral analytics.
- Performance audit + Lighthouse 90+ tuning (image compression, route-level code splits beyond what exists, font subsetting) — Pass 6.
- Full accessibility sweep with screen-reader testing — incremental during each pass, dedicated pass last.
- Analytics event additions beyond what `trackEvent` already covers.

## What I need from you to start

1. **Approve this plan** → I start Pass 1 immediately (no further questions).
2. For Pass 4: confirm you want voice (needs ElevenLabs key + ~$5–20/mo usage) or text-only Sophia.
