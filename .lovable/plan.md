## NESA-Africa Award Pages — Unified Premium Refactor

Refactor all award-tier, category, subcategory, and directory pages to match the `/awards/africa-education-icon` premium standard. Build a reusable section library so every page shares identical structure, visual rhythm, and communication clarity.

---

### 1. Shared Component Library (new)

Create `src/components/awards/standard/` with composable, data-driven sections used by every award page:

- `AwardHeroStandard.tsx` — badge, headline, sub-line, lead paragraph, 3–4 stat cards, max 2 CTAs.
- `WhatThisRecognises.tsx` — "What This Award Recognises" plain-language explainer.
- `WhoIsThisFor.tsx` — eligibility grid: Who can / Who should not / Evidence / Region / Pathway.
- `HallOfFamePreview.tsx` — premium nominee preview grid with filter chips (All / Africa-Resident / Diaspora / Friends of Africa / Region / Subcategory / Verified). Graceful empty state with two CTAs. Pulls from existing `nomineeMasterData` + `ICON_NOMINEES` pipelines.
- `SubcategoryPathways.tsx` — subcategory cards with two CTAs each (View / Nominate).
- `HowNominationWorks.tsx` — 6-step process timeline.
- `IntegrityFirewallBlock.tsx` — trust statement + governance link (reuses `INTEGRITY_DISCLAIMER`).
- `FinalAwardCTA.tsx` — closing "Know someone who belongs?" block.

All sections accept typed props sourced from a new `src/config/awards/awardPageContent.ts` content map, keyed by award/category slug.

---

### 2. Content Layer

`src/config/awards/awardPageContent.ts` — one record per award/category page:

```ts
{
  slug, tierBadge, title, subhead, leadParagraph,
  stats: [{label, value}], primaryCta, secondaryCta,
  recognises: string, eligibility: {canBe, shouldNotBe, evidence, region, pathway},
  subcategories: [{slug, title, blurb, recognises, viewHref, nominateHref}],
  hallOfFameFilter: {awardFamily?, recognitionClass?, subcategorySlug?, region?},
  emptyState: {message, ctas[]}
}
```

Source values from existing configs: `PILLARS`, `AWARD_CATEGORY_FORMS`, `awardCategories/icon.ts`, `influencerImpact2026.ts`, `nomineeMasterData`. No new data ingestion.

---

### 3. Pages Refactored (use the new section library)

| Page | File |
|---|---|
| Awards Overview | `src/pages/Awards.tsx` |
| Gold-Blue Garnet hub | `src/pages/awards/PillarPage.tsx` (when slug = gold-blue-garnet) + new `src/pages/awards/GoldBlueGarnet.tsx` route alias |
| Platinum Recognition | `src/pages/awards/PlatinumRecognition.tsx` (new) |
| Influencer Education Impact 2026 | `src/pages/awards/InfluencerImpact2026.tsx` (refactor sections) |
| Africa Education Icon | already standard — extract its layout into the shared library, then re-mount |
| Every per-category page under `/awards/categories/:slug` | `src/pages/categories/*` — replace bespoke layouts with `<AwardCategoryStandardPage slug=… />` |
| Subcategory pages | dynamic route renders same shared layout filtered to subcategory |
| Explore Existing Nominees | `src/pages/nominees/NomineesHub.tsx` — add HallOfFamePreview filter strip parity, keep functionality |
| Eligibility & Guidelines | `src/pages/about/Eligibility.tsx` — apply hero + integrity blocks |

Each refactored page wires only the content record + helmet/SEO; section order is locked: Hero → WhatThisRecognises → WhoIsThisFor → HallOfFamePreview → SubcategoryPathways → HowNominationWorks → IntegrityFirewall → FinalCTA.

---

### 4. Awards Dropdown Refactor

`src/components/navigation/MainNav.tsx` — restructure Awards mega menu into two clearly labelled column groups:

- **Recognition Pillars**: Africa Education Icon · Gold-Blue Garnet · Platinum Recognition · Influencer Education Impact 2026 · Social Media Education Champions
- **Explore**: Award Categories · Explore Existing Nominees · Eligibility & Guidelines · Voting Timeline · Governance & Integrity

Keep existing `about_menu_*` analytics pattern; add `awards_menu_click` events.

---

### 5. Visual Standard (locked)

- bg `charcoal`, gold accents (`hsl(42 85% 52%)`), blue-garnet hairlines.
- Playfair Display headlines, generous spacing, max 2 CTAs per section.
- Stat cards: gold rule, large numeral, micro-label.
- Hall-of-Fame cards: portrait + verification chip + classification chip + 2 CTAs, organisation logos `object-contain`, people `object-cover`.
- Mobile-first; no CTA clusters.

---

### 6. QA

- Type-check (`tsgo`).
- Playwright spec `tests/e2e/award-pages-standard.spec.ts`: for each pillar + 3 sample categories, assert Hero/Recognises/Eligibility/HallOfFame/Subcategories/Process/Integrity/FinalCTA all render and primary CTA routes to `/nominate?...`.
- Analytics: `award_page_cta_click`, `hall_of_fame_filter`, `subcategory_card_click`.

---

### Out of scope

- No DB schema changes.
- No new nominee data — reuse existing pipelines.
- No copy changes to legal/governance pages beyond hero standardisation.

### Technical notes

- Section components are pure presentational; all copy/data via props.
- `AwardCategoryStandardPage` wrapper resolves content by slug + applies Helmet/Breadcrumb JSON-LD identical to the Africa Education Icon page.
- Existing per-category bespoke files are reduced to ~10 lines (slug + wrapper).
- No breaking URL changes; legacy routes preserved.
