# NESA-Africa Recognition & Impact Platform Refactor

## Goal
Shift the site from an awards programme to **Africa's Education Recognition & Impact Platform**. Every page answers one question; no duplication; consistent language; 9 pillars; 8 regions + 2 global communities; Recognition → Impact → Legacy story.

This is a large refactor. I'll deliver it in **4 sequential batches**, each independently shippable and type-checked.

---

## Batch 1 — Canonical Content Foundation (single source of truth)

Create/refactor data files so every page reads from one place. No visual changes yet.

- **`src/data/pillars.ts`** — expand from 7 → **9 pillars** (add Diaspora Contributors, Faith-Based & Religious Organisations, Institutional & Bilateral Grants; rename to canonical pillar names). Each pillar gets: `whatItRecognises`, `whyItMatters`, `contributionToEFA`, `linkedCategories[]`, `linkedNominees` query.
- **`src/config/recognitionArchitecture.ts`** — update to **8 Africa Regions + 2 Global Communities** (West, East, Central, Southern, North, Horn of Africa, Sahel, Indian Ocean Islands + Diaspora + Friends of Africa). Confirm 4 Tiers → 18 Categories → 100+ Pathways mapping.
- **New `src/config/platformCopy.ts`** — canonical strings: positioning statement, Recognition→Legacy chain, CTA labels (Nominate an Education Enabler / Explore the Africa Education Impact Directory / Become a Sponsor, Partner or Volunteer), language replacements (Excellence→Enablers, Winners→Recognised Enablers, etc.).
- **New `src/components/recognition/RecognitionImpactLegacy.tsx`** — reusable 7-step flow component (Recognition → Visibility → Credibility → Partnerships → Investment → Educational Transformation → Legacy).

## Batch 2 — Homepage + Identity (Level 1)

Homepage = "What is NESA-Africa?" Inspire & orient only. Remove duplicated detail.

- **`TrophyHeroSection.tsx`** — headline & subhead from `platformCopy`; replace 7 pillar chips with **9 identity tags**; CTAs locked to the 3 primary journeys.
- **`HeroCTAStack.tsx`** — reduce to 3 primary CTAs (Nominate Enabler / Explore Directory / Sponsor-Partner-Volunteer).
- **`WhatIsNESASection.tsx`** — rewrite to the canonical "What is NESA-Africa?" paragraph.
- **`WhoWeHonourSection.tsx`** — refactor from 7 → **9 enabler cards**.
- **`SevenPillarsHomeSection.tsx`** → rename to **`NinePillarsHomeSection.tsx`** (keep export alias for safety), reads from updated `pillars.ts`.
- **`TenRegionsBannerSection`** / **`ExploreRegionsSection`** → "8 Africa Regions + 2 Global Communities" framing.
- Add `RecognitionImpactLegacy` strip below "How It Works".
- Trim/remove deep governance + volunteer detail (those live on About/Join now).
- `NESALandingPage.tsx` — reorder sections to: Hero → Countdown → What Is → Who We Honour → 9 Pillars → How It Works → Recognition→Legacy → Regions → Endorsements → Impact Programs → Sponsors → Final CTA. Remove duplicates already covered by Awards/About.

## Batch 3 — About (Trust) + Awards (Framework) + Pillars

- **About `/about`** — rewrite as **Trust Gateway**: Vision, Mission, History, Why NESA-Africa exists, Governance & Integrity Firewall, EDI, Awards Council, NRC, Independent Judges, SCEF, Recognition→Legacy. Remove any "category preview" / "nominee preview" sections (they belong on Awards/Nominees).
- **Awards `/awards`** — rebuild around **4 Recognition Tiers** only (Icon, Gold-Blue Garnet, Platinum, Influencer Impact). Tier cards expand to show 18 categories. No deep pillar grid here (pillars get their own hub).
- **`/awards/pillars` hub + `/awards/pillars/:slug`** — extend `PillarPage` template to render: What it recognises · Why it matters · Contribution to EFA · Linked categories · Linked nominees · Nominate CTA. Build out the 2 new pillar pages (Diaspora, Faith-Based, Bilateral Grants) from data.
- Update `src/config/navigation.ts` Awards mega menu to show 4 tiers + "9 Pillars" + Categories + Directory + Governance.

## Batch 4 — Directory, Language Sweep, CTAs, Tests

- **Nominee Directory** — rename surfaces to **"Africa Education Impact Directory"** (titles, breadcrumbs, SEO, nav). Add filter chips for the 9 pillars and 8 regions + 2 communities. Profile cards emphasise *contribution / evidence / education impact / pathway / region*.
- **Global language sweep** (codemod via `rg` + targeted edits) on these strings only in user-facing JSX/MD/JSON:
  - "Education Excellence" → "Education Enablers"
  - "Award Winners" → "Recognised Education Enablers"
  - "Education Awards" → "Education Recognition"
  - "Continental Honours" → "Continental Recognition Platform"
  - "Award Ceremony" → "Recognition & Impact Programme"
  - "Seven Pillars" / "7 Pillars" → "Nine Pillars" / "9 Pillars"
  - "54 African countries" → "Eight Africa Regions, Africans in the Diaspora and Friends of Africa" (+ optional 5–10 yr line)
  Each replacement reviewed for grammar; legal/historical references preserved.
- **CTA consolidation** — audit `HeroCTAStack`, `FinalCTASection`, `BePartOfMovementSection`, `MobileStickyNominateCTA`, page footers; collapse to the 3 primary journeys with consistent labels.
- **Analytics** — add `pillar_view` (9 pillars), `tier_view`, `directory_filter` events; keep existing `home_cta_click` / `about_cta_click` schema.
- **i18n** — update `src/locales/en/common.json` brand/nav strings; flag other locales as needing translator update (do not auto-translate).
- **Tests** — extend Playwright: homepage shows 9 pillar chips, About has no category preview, Awards shows 4 tiers, Directory renamed, banned-strings test updated to forbid the old phrases.

---

## Out of scope (this pass)
- Translating new copy into the 10 non-English locales (English only updated; others marked stale).
- Editing nominee profile schema in the database (presentation-layer rename only).
- Visual redesign of components beyond the structural changes above — palette, typography, and motion stay as-is.

## Risk & verification
- After each batch: `tsgo` typecheck, banned-strings test, targeted Playwright run, and a manual preview pass on `/`, `/about`, `/awards`, `/awards/pillars`, `/nominees`.
- All renamed components keep a re-export shim for one release to avoid import breakage.
