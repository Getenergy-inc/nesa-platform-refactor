# NESA-Africa 2026 — Platform-Wide Recognition Architecture Refactor

Reposition the site from "awards platform" to **Africa's Education Recognition & Impact Platform**, anchored on one canonical hierarchy: **4 Tiers → 18 Categories → ~100 Subcategories → 10 Regions → Nominee**. Every page, nav item, CMS record, and journey is rewired to that single model.

---

## 1. Freeze the canonical architecture (single source of truth)

Create `src/config/recognitionArchitecture.ts` — the only place the 4/18/100/10 model lives. Every page, nav, filter, and form imports from here. No duplicate lists anywhere.

- `RECOGNITION_PATHWAYS` (4): `africa-education-icon`, `blue-garnet`, `platinum-recognition`, `influencers-education-impact`
- `AWARD_CATEGORIES` (18): consolidated from `awardTiers2026.ts` + `awardCategoryForms.ts` into one authoritative list with tier ref, slug, region scope, vote mechanic
- `RECOGNITION_SUBCATEGORIES` (~100): each tagged with parent category + thematic tag (CSR, STEM, TVET, Faith, Diaspora, etc.)
- `EDUCATION_REGIONS` (10): West, East, Central, Southern, North, Horn, Sahel, Indian Ocean Islands, Diaspora, Friends of Africa
- Helpers: `getCategoriesByTier`, `getSubcategoriesByCategory`, `getRegionScope`, `countSubcategories`

Reconciliation note: current data shows 22 categories (9+7+3+3) — consolidate to 18 per brief (merge regional duplicates of CSR/EduTech/NGO/STEM into single category records with `regionScope: 'multi'`).

---

## 2. Six-stage impact framework as a shared component

`src/components/recognition/ImpactJourney.tsx` — horizontal/vertical animated flow used on Home, About, Awards, and Impact Programs:

```
Recognition → Visibility → Partnerships → Funding → Educational Intervention → Legacy
```

One component, three layout variants (hero/section/compact).

---

## 3. Progressive discovery navigation

Rewrite `src/config/navigation.ts` + `src/components/navigation/MainNav.tsx` to the 9-item public nav:

`Home · About · Awards · Participate · Impact Programs · Media & Events · Join the Movement · Sponsors & Partners · Contact`

Awards mega-menu becomes a **tier-first** explorer (4 tier cards → reveal categories on hover/tap), not a flat link dump. Mobile keeps the accordion pattern already shipped.

Add a universal `<DiscoveryBreadcrumb>` that always shows: Pathway → Category → Subcategory → Region → Country → Nominee.

---

## 4. Page-by-page responsibilities (eliminate duplication)

| Page | Single responsibility | Action |
|---|---|---|
| `/` Home | Answer the 4 questions only | Trim to: Hero · ImpactJourney · 4 Pathways teaser · Stats · 10 Regions teaser · One primary CTA |
| `/about` | Trust + ecosystem | Keep current trust gateway; remove any award-pathway repetition |
| `/awards` | Gateway to recognition framework | Tier explorer (4 cards) → category grid (18) → subcategory drawer; eligibility/judging/EDI/calendar tabs |
| `/awards/:tierSlug` | Tier detail | Standardised page from existing `AwardCategoryStandardPage` |
| `/awards/:tierSlug/:categorySlug` | Category detail + subcategory list | New dynamic route, progressive subcategory reveal |
| `/participate` | 6-step nominate journey | New page replacing scattered nominate entry points |
| `/programs` Impact Programs | NESA → EduAid → RMSA → NESA-TV chain | Refactor existing hub around recognition→impact narrative |
| `/movement` Join the Movement | Volunteers/Ambassadors/Chapters/Judges/Researchers/Media/Partners | Consolidate scattered pages |
| `/governance` | Board · Council · NRC · Judges · EDI · Firewall · Sponsor non-influence | Promote into top-nav reachable section |
| `/nominees` Education Impact Directory | Rebrand + full progressive filter chain | Tier → Category → Subcategory → Region → Country → Nominee |
| `/regions` + `/regions/:slug` | 10 regions, each with overview/featured/priorities/partnerships/Afri-EduTourism/Regional Hall of Fame | Extend existing region pages with the 6 required blocks |

For each page, remove duplicated FAQ blocks, governance text, nominee listings, and integrity statements — link to the canonical page instead.

---

## 5. Africa Education Icon — lock the "9 winners" framing

Update `/awards/africa-education-icon` + Hall of Fame copy to make the **3 categories × 3 classifications = 9 winners** structure unmistakable. Remove any language that implies mass competition. Add the classification grid (Africans in Africa / Diaspora / Friends of Africa) as the primary visual.

---

## 6. Nominee profile = Education Impact Directory entry

Standardise `/nominees/:category/:slug` profile template to include every brief-required block: portrait, biography, timeline, country, organisation, sector, **Individual Contribution to African Education (2006–2026)**, evidence, publications, awards, related nominees, related categories, verification status. Build from existing profile data; fill missing sections with graceful empty states.

---

## 7. Cross-cutting

- **SEO**: per-page `<title>` <60c, meta <160c, JSON-LD `BreadcrumbList` reflecting discovery chain, single H1.
- **Accessibility**: keyboard/ARIA already shipped for About nav — extend pattern to new Awards tier explorer and Directory filter chain.
- **Analytics**: add `pathway_view`, `category_view`, `subcategory_view`, `region_view`, `nominee_view`, `discovery_step` (with chain context) to `src/lib/analytics.ts`.
- **Performance**: subcategory lists render on-demand (filter/drawer), never all at once.
- **CMS**: existing `src/lib/cms/types.ts` extended with `tier`, `pathwaySlug`, `subcategorySlug` fields so future Lovable Cloud-backed editing maps cleanly.

---

## 8. QA

- `tsgo` clean
- Playwright `tests/e2e/recognition-architecture.spec.ts`: traverse Pathway → Category → Subcategory → Region → Nominee on desktop + mobile; assert breadcrumb, analytics events, and that no page renders >24 subcategory chips at once.
- Visual: confirm Home renders only the 4 required answers above the fold on 610×542 (current viewport).

---

## Out of scope (explicit)

- No DB schema changes (architecture is config-driven; CMS adapter shape unchanged).
- No new nominee ingestion — reuse existing pipelines.
- No copy rewrites to legal/governance pages beyond hero standardisation.
- No visual redesign of shipped premium pages (Icon Award, About trust gateway, Judges Directory) — only structural rewiring to the canonical architecture.

---

## Suggested execution order (4 batches)

1. **Foundation**: canonical architecture config + ImpactJourney component + navigation rewrite.
2. **Awards spine**: `/awards` tier explorer + dynamic tier/category routes + Icon "9 winners" lock.
3. **Directory & Regions**: progressive filter chain on `/nominees`; extend `/regions/:slug` to 6 blocks.
4. **Journeys & cleanup**: `/participate`, `/programs`, `/movement`, `/governance` consolidation; dedupe sweep; analytics + Playwright.

Each batch ships independently and leaves the site in a working state.
