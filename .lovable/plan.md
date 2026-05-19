# NESA Africa Platform Refactor — Implementation Plan

This is a large, multi-domain refactor. To ship safely without regressing the live site, I'll execute it in **5 sequential phases**, each independently shippable and QA-able. You approve this plan once; I then implement phase by phase and report back after each.

---

## Phase 1 — Information Architecture & Routing Skeleton

Establish the new URL tree without breaking old links. Pure additive routing.

**New routes registered in `src/App.tsx`:**

```text
/awards/africa-education-icon
/awards/csr-for-education
/awards/digital-voices
/awards/global-partnerships

/nominees                                                  (hub — exists)
/nominees/africa-education-icon-award
  /:subcategory                                            (3 subs)
  /:subcategory/:classification                            (3 classifications)
/nominees/gold-special-recognition
  /sports-for-education
  /music-for-education
  /social-media-for-education

/nominee/:slug                                             (universal profile — exists, extended)
```

**Backward compatibility:** old `/nominees/category/*` and existing profile links continue to work via the universal resolver. No 404s.

**Files:** `src/App.tsx`, route stubs (placeholder pages render hero + "coming in next phase" state so navigation is testable end-to-end).

---

## Phase 2 — Nominee Architecture (Parts 6, 7, 8, 10)

The structural heart of the refactor. Replaces the long single nominees page with a 4-tier hierarchy.

**Data layer:** `src/data/iconAward/index.ts` and `src/data/goldSpecial/index.ts` — typed records with the migration fields you specified (`previous_category`, `previous_subcategory`, `migration_source`, `migration_reason`, `migration_status`, `migration_confidence_score`, `manual_review_required`). Selectors: `getNominee(slug)`, `bySubcategory()`, `byClassification()`, `featured()`.

**Page components:**

| Route | File |
|---|---|
| `/nominees/africa-education-icon-award` | `IconAwardMain.tsx` |
| `…/:sub` | `IconSubcategoryPage.tsx` |
| `…/:sub/:cls` | `IconClassificationPage.tsx` |
| `/nominees/gold-special-recognition` | `GoldRecognitionMain.tsx` |
| `…/:track` | `GoldTrackPage.tsx` |
| `/nominee/:slug` | extend `MasterNomineeProfile.tsx` with Hero · Badges · Verification · Impact Summary · Full Story · Media Gallery · Metrics · Vote/Share CTAs · Related Nominees · SEO |

**Shared components** in `src/components/nominees/`: `NomineeHero`, `SubcategoryCard`, `ClassificationCard`, `NomineeCard`, `NomineeFilterBar` (URL-synced: country, region, impact area, verification, jury status), `FeaturedSpotlight`, `RelatedNominees`, mobile bottom-sheet filter.

**Migration script** `scripts/migrate-nominees.ts` (offline, run once):
- Classify existing nominees into Icon subcategories via keyword rules (curriculum/literacy → Literary; TVET/STEM → Technical; foundation/scholarship → Philanthropy).
- Classify into Sports / Music / Social Media for Gold tracks.
- Classify into Africans-in-Africa / Diaspora / Friends-of-Africa using country + heritage tags.
- Deduplicate by normalized name+country.
- Low-confidence rows → `migration/manual-review.json` (not auto-published).
- Outputs `src/data/iconAward/nominees.generated.ts`, `src/data/goldSpecial/nominees.generated.ts`, `/mnt/documents/migration-report.md`.

---

## Phase 3 — Homepage Refactor (Parts 1, 2)

Replace the long-scroll homepage with the 14-block conversion funnel you specified.

**Blocks (in order):** Hero · Trust Bar · What NESA Represents · Ecosystem Carousel · Nominate & Vote · 4 Cinematic Award Cards · Impact Wrap-Up · Regional Reach · Featured Videos (2 only: How-to + CVO Vision) · Be Part of the Movement · Contributors · Sponsors · FAQ · Final CTA.

**Cinematic card system** (`src/components/nesa/CinematicAwardCard.tsx`):
- Top half: gradient + animated action-word ticker (`framer-motion`) + emotional headline + CTAs.
- Bottom half: video placeholder slot with play button + "Documentary coming soon" + ready for future YouTube embed.

Reuses existing `TrophyHeroSection`, `TrustLogosStrip`, `ContributorsHallSection`, `SponsorsSection`, `PageFAQSection`. New: `EcosystemCarousel`, `NominateAndVoteSection`, `BePartOfMovementSection`, `FinalCTASection` (revised copy).

**File edited:** `src/features/landing/NESALandingPage.tsx`.

---

## Phase 4 — Award Pillar Pages (Parts 2, 3)

Four full pages, one per pillar, using the cinematic card system blown up to full-page scale.

| Route | File |
|---|---|
| `/awards/africa-education-icon` | `AfricaEducationIconAward.tsx` |
| `/awards/csr-for-education` | `CSRForEducation.tsx` |
| `/awards/digital-voices` | `DigitalVoices.tsx` |
| `/awards/global-partnerships` | `GlobalPartnerships.tsx` |

Each page: Hero + action words · Story section · Documentary placeholder · Subcategory navigation · Nominee discovery (pulls from Phase 2 data) · Impact metrics · Pillar-specific CTA.

---

## Phase 5 — AGC Polish + SEO + QA (Parts 4, 5, 11, 12, 13)

The AGC navbar, dropdown, mobile wallet, and `/earn-agc` page are **already built** from prior turns. This phase polishes and verifies.

- Verify nav dropdown shows balance/tier/streak and all quick-earn shortcuts per Part 4 spec.
- Verify `/earn-agc` covers: what AGC is, what AGCc is, how to earn, how to use, reward tiers (Bronze/Silver/Gold/Platinum), leaderboard, daily missions, wallet preview.
- Update `scripts/generate-sitemap.ts` with all new routes.
- Add `<Helmet>` blocks to every new page: unique title, description, canonical, og:*, JSON-LD (`BreadcrumbList` everywhere; `Person`/`Organization` on profiles).
- Mobile QA pass: sticky CTAs, bottom-sheet filters, thumb-friendly buttons, image lazy-loading.
- Run final QA checklist (Part 13) and produce a summary report.

---

## Technical Details

- **Stack:** React 18 + Vite + Tailwind + `framer-motion` + `react-helmet-async` + `react-router-dom` (already installed).
- **Design tokens:** strict use of `bg-charcoal`, gold `42 85% 52%`, Playfair Display headers — no raw hex.
- **Data storage:** nominee master data stays in TS/JSON on GitHub (per project memory), Supabase only for votes/wallet/auth.
- **No DB schema changes** required for this refactor.
- **No edge function changes** required.
- **Files created:** ~35. **Files edited:** ~8. **Files deleted:** 0 (old long page kept as fallback until Phase 5 QA passes).

---

## Out of Scope

- Real documentary videos (placeholders only — YouTube-embed-ready).
- Backend admin UI for nominee migration (offline script only).
- New auth/payment/wallet logic (AGC plumbing already exists).
- Translations of new copy beyond English (existing i18n keys preserved).

---

## Execution Order After Approval

I'll ship phase 1 → report → phase 2 → report → … so you can review and redirect at each checkpoint instead of getting one giant unreviewable diff. If you want a different order (e.g. homepage first), say so in your approval.

Approve to begin **Phase 1**.