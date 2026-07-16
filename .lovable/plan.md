
# Refactor 16 Category Pages onto One Approved Standard

## Goal
Rebuild the 9 Blue Garnet + 7 Platinum category/pathway pages using **one reusable template** driven by centralised content, matching the approved 14-section standard, with correct 2026 policy language (no voting, no competitive ranking on Blue Garnet 2026; Platinum jury-only).

## Approach: Central Content + One Template

### 1. Central content bible
Create `src/content/contentBible2026/pathwayPages.ts` as the single source of truth:
- `DetailedAwardCategoryPage` type (as in the prompt spec)
- Shared constants: EDI matrix (8 criteria), threshold bands (Platinum + Blue Garnet 2026), timeline stages (10), trust links, evidence checklist, benefits blocks (nominee/nominator/region/Africa)
- 16 page objects (BG-1…BG-9, PT-1…PT-7) with only the category-specific fields filled in (title, subtitle, story, eligible nominee types, subcategories with existing UUIDs, scoring emphasis notes, category FAQs, SEO, catalogue config, hero image key, existing route)

### 2. Reusable template component
Create `src/components/awards/DetailedCategoryPageTemplate.tsx` that renders the exact 14 sections in order, composed from existing components:
`HeroSection → BadgeRow → OverviewSection → EnablerStorySection → TwoColumnSection (Who Qualifies + EdiScoreTable + ThresholdStrip) → SubcategoryCards → BenefitCards (×4) → NominationCTA → RecognitionTimeline → NomineeTabs + MediaFilterBar + NomineeCard grid → EvidenceCTA → RecognitionPackage → TrustAccountability → FAQAccordion → FinalCTA`

Where a matching component doesn't already exist, add a thin new one that reuses shadcn primitives (no custom CSS). Reuse `BrandedNomineeDirectory` for Section 9 catalogue with grouping + media filter props.

### 3. Wire the 16 existing page files
Replace the body of each of the 16 category/pathway route components with:
```tsx
<DetailedCategoryPageTemplate page={pathwayPages["bg-csr-africa"]} />
```
- Keep every current route unchanged.
- Keep every valid subcategory UUID unchanged (read from existing config first; never invent).
- Delete duplicate/legacy JSX inside each page file only — no route changes.

Pages to refactor (route mapping preserved):
- BG-1 CSR Africa · BG-2 CSR Nigeria · BG-3 EdTech Africa · BG-4 Media Nigeria · BG-5 NGO Nigeria · BG-6 NGO Africa · BG-7 STEM Africa · BG-8 Creative Arts Nigeria · BG-9 Education Policy Nigeria
- PT-1 Library Nigeria · PT-2 R&D · PT-3 Christian · PT-4 Islamic · PT-5 Political Leadership · PT-6 International Partners (keep as reference impl) · PT-7 Diaspora

### 4. 2026 policy corrections applied globally in the template
- Blue Garnet badge = "2026 Recognition Edition"; Platinum badge = "Jury-Only Institutional Recognition"
- Threshold band labels switch by `awardTier`
- Trust + FAQ blocks include the "no public voting in 2026 / competitive Blue Garnet from 2027" statement
- Endorsements described as "expressions of appreciation, not votes"
- Timeline pulls dynamically from the existing 2026 season config — no hardcoded expired dates; Gala line = "22 October 2026 in Lagos"

### 5. Geographic logic
Template reads `page.nomineeCatalogue.grouping`:
- `region` (8 Africa regions from canonical `regions_v2`) — BG-1, BG-3, BG-6, BG-7
- `state` (Nigerian states/zones) — BG-2, BG-4, BG-5, BG-8, BG-9, PT-1
- `nominee_type` (partner-type tabs, continental, no regional tabs) — PT-6
- Diaspora (PT-7) adds diaspora-region + supported-African-region fields
- `subcategory` default otherwise

### 6. Mobile behaviour
Handled once in the template: horizontal-scroll subcategory tabs, sticky-safe media filter bar, stacked eligibility/scoring, one nominee card per row < md, no autoplay video.

### 7. Data integrity guardrails
- Nominee catalogue fetches from existing Supabase-backed nominee source only — no fabricated entries.
- Verification-status badges + EDI-score display gated on approval flag from DB.
- Category-specific nomination CTAs deep-link to existing `nominateCategorySlug`/subcategory forms (already present in each page today) — reused, never regenerated.

## Out of scope (explicit)
- No database schema changes.
- No new routes, no `_redirects` changes.
- No changes to nomination forms themselves.
- No new UUIDs invented; unresolved subcategories stay marked and use current DB value.
- International Partners page (PT-6) content stays as reference; only reshaped to the shared template so it renders identically.

## Deliverables
1. `src/content/contentBible2026/pathwayPages.ts` (+ shared constants file)
2. `src/components/awards/DetailedCategoryPageTemplate.tsx` (+ any small missing sub-components: `EnablerStorySection`, `ThresholdStrip`, `BenefitCards`, `EvidenceCTA`, `RecognitionPackage`, `TrustAccountability`, `FinalCTA` — each ≤80 LoC, shadcn-only)
3. 16 slimmed page files rewired to the template
4. Quick visual pass on 2 representative pages (1 Blue Garnet regional, 1 Platinum) via Playwright screenshot to confirm section order + mobile stacking

## Confirm before I build
- OK to slim the existing rich pages (e.g. `EduTechAfrica`, `LibraryNigeria`, `CSREducationNigeria`) down to the shared template? Their current bespoke hero/animated-words/documentary sections would be **replaced** by the standard 14-section layout so all 16 pages look and behave consistently. Say "yes, slim them" or "keep the bespoke hero on top and append the standard sections below" and I'll proceed.
