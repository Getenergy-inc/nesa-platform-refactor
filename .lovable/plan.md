## Goal

Rewrite the narrative content of the 4 tier pages using the copy provided, keep every existing nomination form, and ensure each parent category card links to its own subcategory detail page.

## Scope — 4 tier pages

1. **Africa Education Icon Award** (`/africa-education-icon` → `IconAward.tsx`)
2. **Blue Garnet Award 2026** (`/gold-blue-garnet` → `BlueGarnetAward.tsx` → `AwardCategoryStandardPage` slug `gold-blue-garnet`)
3. **Platinum Award 2026** (`/platinum` → `PlatinumAward.tsx` → `AwardCategoryStandardPage` slug `platinum-recognition`)
4. **Influencer Education Impact 2026** (`/influencer-impact` → `InfluencerImpact2026.tsx`)

## Changes

### A. `src/config/awards/awardPageContent.ts`
Rewrite the four page entries so the on-page narrative matches the supplied copy:

- **Hero** — new title, subhead, and lead paragraphs.
- **`recognises` body** — "Why this award matters" / "Recognition Philosophy" sections rendered by `WhatThisRecognises`.
- **Subcategories** — refresh the `title`, `blurb`, and `recognises` fields so each parent card carries the correct pathway/category description; keep existing `slug`, `viewHref`, and `nominateHref` so the "View" button already links to the subcategory detail route.
- **Eligibility** — refresh `canBeNominated`, `shouldNotBeNominated`, `evidence` from the "Who Can Be Nominated / Should Not Be Nominated" copy.
- **Process** — surface the 7–8 recognition steps in `HowNominationWorks` (already generic; just confirm rendering).
- **Final CTA** — use the "Primary / Secondary / Directory CTA" text from each page.

### B. `src/pages/awards/IconAward.tsx`
Icon is bespoke, not driven by the config. Replace the copy blocks with:

- Hero: "Two Decades. Three Pathways. Nine Laureates. One Continental Legacy."
- Recognition Philosophy section.
- Three Recognition Pathways cards (Philanthropy · Literary & New Curriculum · Technical Education) — each card links to its subcategory page under `/recognition/africa-education-icon/…` and to a "Nominate in this pathway" CTA.
- Nine Laureates block (3 Africa · 3 Diaspora · 3 Friends of Africa).
- "No Public Voting" and 8-step process.
- Preserve the existing `FeaturedNomineesBlock` and any nomination CTA present.

### C. `src/pages/awards/InfluencerImpact2026.tsx`
- Replace hero + narrative with the "Influencer Education Impact 2026" copy (Recognition Philosophy, three pathways: Social Media · Sports · Music, verification by NRC, 7-step process).
- Add a "Three Pathways" grid where each card links to its subcategory page and includes an in-page anchor to the existing form.
- **Preserve `InfluencerNominationForm`** exactly where it currently sits.

### D. Subcategory link surface
`SubcategoryPathways` already renders per-subcategory "View" and "Nominate" buttons from `viewHref` / `nominateHref`. Audit the four entries and:

- Ensure every subcategory has a `viewHref` pointing to `/recognition/<tier>/<category-slug>` (or the tier-specific subcategory route already registered in `App.tsx`).
- Add missing `viewHref`s where absent so no subcategory renders without a link.

## Non-goals

- No changes to routing, data model, or backend.
- No removal of any nomination form, `FeaturedNomineesBlock`, `HallOfFamePreview`, or TV show section already on these pages.
- No changes to shared components beyond confirming their props still fit.

## Verification

- `tsgo` typecheck.
- Spot-render each of the 4 pages in the preview (Playwright screenshot of hero + subcategory grid + form region) and confirm nomination form is still present on Icon and Influencer pages.
