# NESA-Africa Duplication Cleanup Plan

Content-only refactor. No redesign, no brand/layout changes. Goal: remove repeated sections, cards, CTAs, and copy while keeping the strongest version of each message in one canonical location.

## Scope & Approach

Work in small, verifiable batches — one surface at a time, typecheck after each batch. Every removal keeps the strongest existing component; nothing is rewritten from scratch.

## Batch 1 — Homepage (`src/features/landing/NESALandingPage.tsx`)

The landing page currently renders **22 sections** with heavy overlap. Consolidate to a lean, conversion-focused sequence.

**Remove (duplication of identity/architecture already covered elsewhere on the same page):**
- `WhatIsNESASection` — About duplicated by `WhyNESAExistsSection` + `VisionMissionObjectivesSection`
- `WhoWeHonourSection` — overlaps `WhoWeRecogniseClustersSection` (keep the 3-cluster version per prompt §10)
- `SevenPillarsHomeSection` — pillars belong on Awards/Pillars page; homepage keeps tiers only
- `RecognitionImpactLegacy` — duplicates `HowItWorksHomeSection` journey
- `AwardTiersSummarySection` — duplicates `RecognitionTiersHomeSection` (keep the newer tiers surface)
- `TrustStripSection` — integrity duplicated by `GovernanceFirewallSection` later on page

**Keep (canonical homepage sequence per prompt "Rule 2: Keep Homepage Short"):**
Hero → Countdown → CallForNomination → Gallery teaser → WhoWeRecognise (3 clusters) → RecognitionTiers → HowItWorks → WhyNESAExists → VisionMissionObjectives → WhatMakesDifferent → ExploreRegions → Volunteers → Endorsements → ImpactPrograms → Sponsors → GovernanceFirewall → Vision2035 → FinalCTA.

## Batch 2 — Programs Page (`src/pages/programs/NESAAfrica.tsx`)

Currently duplicates most of homepage. Remove:
- `CategoriesSection` (Awards page owns this)
- `SponsorsSection` (Sponsors page owns this)
- `FinalCTASection` (duplicates homepage CTA)
- `EDIIntegrityJourney` — keep only `IntegritySection` (governance appears twice)
- `NominationPathsCards` if it re-lists tiers already shown elsewhere on this page

Programs page keeps: Hero, Trust logos, What's Live, HowItWorks, VoteWithAGC, Integrity, Events, Watch, Music, Champions Directory, LegacyImpact.

## Batch 3 — Footer (`src/components/nesa/NESAFooter.tsx`)

Trim any long mission/vision/pillar/tier prose to the approved short line:
> "NESA-Africa 2026 — Africa's Education Recognition & Impact Platform recognising the Enablers of Education for All Across Africa."

Keep link columns (Awards, Programmes, Get Involved, Contact), copyright, SCEF line. Remove duplicated About paragraphs, metric blocks, or repeated integrity notices.

## Batch 4 — Card CTA cleanup

Sweep card components for redundant "Learn More" buttons where the whole card is already a link (`NominateAndVoteSection`, `BePartOfMovementSection` are already clean — audit similar grid components: `WhoWeRecogniseClustersSection`, `RecognitionTiersHomeSection`, `SevenPillarsHomeSection`, `ImpactProgramsSection`). Enforce max 2 CTAs per section; remove trailing duplicate primary buttons.

## Batch 5 — Terminology sweep (ripgrep-driven, low risk)

- `NESA Africa` / `Nesa Africa` → `NESA-Africa` (skip proper filenames, translation keys, image alts referring to legacy)
- `Blue Garnet Awards` standalone → `Gold-Blue Garnet Awards` (skip historical/visual brand references and existing route slugs)
- Standardize `Afri-EduTourism` spelling

## Out of scope (explicit per prompt)

- No visual/design changes, no new components, no tier/pillar re-writing, no route changes, no translation-file edits beyond terminology, no changes to backend, RLS, or data files.

## Verification per batch

1. `tsgo` typecheck
2. Manual read of edited file
3. Visit `/`, `/programs/nesa-africa`, footer via Playwright screenshot after Batch 1–3

## Deliverable

A leaner homepage and programs page, a shorter footer, deduplicated CTAs on cards, and consistent naming — same brand, same design system, less repetition.
