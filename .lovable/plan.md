## Goal

Update the landing page copy and small structural fixes (tier ordering, step count, footer columns) inside the **existing** components. Do not rebuild layouts, swap images, or re-theme.

## Approach

Every section maps 1:1 to a component already mounted in `src/features/landing/NESALandingPage.tsx`. Work is done as targeted edits inside those components, plus a footer rebuild.

## Batch 1 — Hero, notice, countdown, integrity

- `UtilityBar` / announcement bar → "Public Nominations Open 1 August 2026 · NESA-Africa 2026" + Nominate Now CTA
- `TrophyHeroSection`
  - Eyebrow, headline "Africa Sees Your Education Impact", brand line, platform statement
  - New description + emotional statement
  - Primary CTAs: Nominate an Education Enabler · Explore Recognition 2026
  - Secondary links: Accept Your Nomination · Explore Education Enablers
  - Hero image caption + supporting caption
  - Replace stats row with the 7-metric set (4/18/96/8/2/27/9)
  - Add topic tag row (10 tags) if not already present as a subcomponent
- New `HeroIntegrityStrip` (or update existing "Recognition Built on Evidence and Integrity" copy)
- `PublicNominationsNotice` — reuse copy from master timeline (already aligned; verify)
- `CountdownSection` — new eyebrow, heading, date, copy, buttons; remove any "votes decide winners" phrasing

## Batch 2 — Pathways, tiers, architecture, process

- `VisitorPathwaySection` → 4 cards (Individual · Org/Institution · Diaspora/Friend · Influencer)
- `CallForNominationIconAward` → verify tier order Icon → Influencer → Platinum → Blue-Garnet with new tier labels and card copy for all 9 Blue-Garnet, 3 Influencer, 7 Platinum, 3 Icon
- `WhoWeRecogniseClustersSection` → 3 cards (Individuals · Orgs/Institutions · Govts/International)
- `RecognitionTiersHomeSection` → convert to compact "Recognition Architecture at a Glance" table
- `HowItWorksHomeSection` → collapse 6 steps to 5 (Nominate · Accept & Complete · Provide Evidence · Verify & Review · Recognise & Connect); remove vote/shortlist steps

## Batch 3 — Story, regions, people, endorsements

- `WhyNESAExistsSection` → "Recognition Without Impact Is Incomplete" + Recognition → … → Legacy flow
- `WhatMakesNESADifferentSection` → 6 blocks (Recognition/Visibility/Partnerships/Funding/Intervention/Legacy); drop Scholarships & Community Engagement
- `ExploreRegionsSection` → "8 African Regions · 2 Global Communities" (drop 10-region/5+2 phrasing)
- `PoweredByVolunteersSection` → new heading/copy + 3 buttons (Meet · Become · Join Chapter)
- `EndorsedBySection` → new heading/copy + 3 buttons; remove placeholder logos

## Batch 4 — Programmes, wallet, governance, vision, CTA, footer

- `ImpactProgramsSection` → 4 cards (EduAid-Africa · Rebuild My School 2027 · Special-Needs Nominations · Afri-EduTourism); global rename Edu-Tourism → Afri-EduTourism
- `SponsorsSection` → single logo strip + copy + buttons; SCEF/GFAwzip/Pancokrato/Get Energy identified by actual role
- `GovernanceFirewallSection` → "A Recognition Firewall You Can Trust" + do-not-influence list + process statement + 8 commitments; drop voting/finalists/EDI/AGC-voting language
- `Vision2035RoadmapSection` → 6 dated milestones (2026/27/28/30/32/35)
- `FinalCTASection` → new heading/copy/buttons
- Add "Final Statistics" strip (4/18/96/20-yr/8/2) above or inside FinalCTA
- `NESAFooter` → rebuild as 7 columns exactly per spec; drop Vote/duplicate Donate/Sponsor/Participate/general Judges recruitment

## Cross-cutting

- Extend `scripts/checkTimelineIntegrity.ts` denylist with: "10 education regions", "5+2 regions", "9 Pillars", "2,500+ nominees" (unless data-backed), "public voting" on recognition pages, "Edu-Tourism" (bare form)
- Run vitest + integrity guard to confirm clean

## Out of scope (explicit)

- No layout rebuilds, image swaps, or theme changes
- No new routes/pages
- No backend/schema changes
- Any component that already matches spec is left as-is (verified by read, no rewrite)

## Sequencing

I will execute Batch 1 → 2 → 3 → 4 in order, each batch as one parallel edit round with a read pass immediately before it. After Batch 4, run the timeline guard + typecheck and report any residual mismatches for follow-up.

**Confirm** to start Batch 1, or tell me which batches to skip / re-prioritise.