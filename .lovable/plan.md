
# NESA-Africa Landing Page — Platinum Update + Conversion Refactor

## Part A — Immediate Platinum Card Fix (small, safe)

File: `src/components/nesa/CallForNominationIconAward.tsx`

1. Reorder `platinumCategories` to the approved final sequence:
   1. Best Bilateral Organisations & International Embassies Education Enablers
   2. Faith-Based & Religious Organisations Advancing Education
   3. African Diaspora Education Impact Award
   4. Nigeria Political Leaders Education Enablers
2. Update the Faith-Based card body to the exact approved copy (two paragraphs about Christian, Islamic and other faith-based organisations).
3. Normalise the Faith-Based tag to `PLATINUM RECOGNITION 2026` to match the diaspora card.
4. Do NOT add a 5th "Civil Society & NGO" Platinum card — per your instruction it lives under Blue-Garnet only.

Result: 4 Platinum cards, no duplicates, no design changes.

## Part B — Conversion Refactor (larger, content + structure only)

Goal: reduce bounce, self-select visitors, cut CTA overload. No redesign, no new components beyond one small pathway section, no colour/typography changes.

### B1. Hero CTAs (`src/components/nesa/TrophyHeroSection.tsx`)
Trim hero action buttons to exactly three:
- Nominate Now
- Explore Award Categories
- Accept Your Nomination

Move Sponsor / Volunteer / Judge / Donate / Wallet CTAs out of the hero. They stay reachable via the existing header nav and their dedicated sections lower on the page.

### B2. New "Who Are You Nominating?" pathway section
New file: `src/components/nesa/VisitorPathwaySection.tsx`
Four cards using the existing card style tokens (charcoal/gold, same `rounded-2xl border border-gold/20` pattern used in `CallForNominationIconAward`):
1. An Individual Education Enabler → `/awards/africa-education-icon`
2. An Organisation or Institution → `/awards/platinum-recognition`
3. A Diaspora or Global Education Supporter → `/awards/platinum-recognition/diaspora`
4. A Media, Sports, Music or Digital Voice → `/awards/influencers-education-impact`

Mounted in `NESALandingPage.tsx` right after `CountdownSection`, before `CallForNominationIconAward`.

### B3. Nomination card ordering
In `CallForNominationIconAward.tsx` reorder the tier blocks on the page to:
Tier 1 Icon (Lifetime) → Tier 2 Blue-Garnet (CSR / EdTech / NGO / Media) → Tier 3 Platinum → Tier 4 Influencers.

Currently the file renders Icon → Platinum → Blue-Garnet → Influencers. Just swap the JSX order of the Platinum and Blue-Garnet blocks; the arrays themselves don't move.

### B4. Add Blue-Garnet NGO + Media cards (merged NGO)
Extend `corporateCategories` from 2 cards to 4:
- Best CSR for Education in Africa (existing)
- Best EdTech & STEM Innovation for Education (existing)
- NGO Education Enablers for Education for All Award (new, merged Nigeria + Africa)
- Nigeria Media Enablers for Education for All Award (new)

The merged NGO card CTA "Nominate Here" links to a new lightweight chooser route `/nominate/ngo` that presents two options (Nigeria NGO / Africa Regional NGO) and forwards to the correct existing nomination URL. New tiny page: `src/pages/nominate/NGOChooser.tsx`, wired in `App.tsx`.

### B5. Mobile "View All Categories"
In `CallForNominationIconAward.tsx`, on `sm:` and below, show only the first 6 cards across all tiers and append a single `View All Nomination Categories` button linking to `/nominate` (or `/awards`). Implemented with Tailwind responsive classes (`hidden sm:block` on cards 7+, `sm:hidden` on the button) — no JS state, no design change.

### B6. Duplication + CTA hygiene sweep
- Remove repeated "Learn More" buttons on cards that link to the same tier page — keep one Learn More per tier, not per card, where the target URL is identical. (Icon tier cards all point to `/awards/africa-education-icon` — collapse to one Learn More at the tier footer.)
- Confirm no Sponsor / Volunteer / Judge / Donate / Wallet CTAs appear inside any award card section.
- No content changes to Sponsors, Volunteers, Governance, Vision2035, FinalCTA sections beyond confirming they aren't duplicated.

### B7. Final homepage section order (`NESALandingPage.tsx`)
Hero → Countdown → **VisitorPathway (new)** → CallForNominations (Icon → Blue-Garnet → Platinum → Influencers) → Gallery → WhoWeRecogniseClusters → RecognitionTiers → HowItWorks → WhyNESAExists → VisionMissionObjectives → WhatMakesDifferent → ExploreRegions → Volunteers → Endorsements → ImpactPrograms → Sponsors → GovernanceFirewall → Vision2035 → FinalCTA.

## Out of scope
- No redesign, no colour/typography/layout changes.
- No backend/schema/RLS changes.
- No translation file edits (English strings only; i18n can catch up later).
- No changes to detail pages under `/awards/*` — only the homepage surfaces.
- No new analytics events beyond reusing existing `trackEvent` calls.

## Verification
1. `tsgo` typecheck.
2. Playwright screenshot of `/` at mobile (375) and desktop (1280) confirming: 3 hero CTAs, pathway section visible, tier order Icon→BG→Platinum→Influencers, 4 Platinum cards in the new order with the updated Faith-Based copy, mobile "View All Categories" button visible.
