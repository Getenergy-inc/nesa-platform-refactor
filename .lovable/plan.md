
## Goal

Reallocate today's 18 Gold–Blue Garnet award categories across the four recognition tiers exactly as you described:

- **9** categories under **Gold–Blue Garnet** (programme / organisation recognition)
- **7** categories under **Platinum** (institutional / systemic recognition)
- **1** meta-category under **Africa Education Icon Award** (its three lifetime pathways: Philanthropy, Literary & Curriculum, Technical)
- **1** meta-category under **Influencer Education Impact** (its three subcategories: Social Media, Sports, Music)

Then render every category as a link card on its parent tier page so users can jump directly into `/awards/18-categories/:slug`.

## Proposed mapping (based on current architecture semantics + prior tier docs)

**Gold–Blue Garnet (9 — organisations, programmes, campaigns):**
1. csr-for-education
2. education-philanthropy
3. ngos-advancing-education
4. edtech-and-ai-innovation
5. stem-education
6. tvet-and-technical-education
7. media-and-journalism-for-education
8. school-transformation
9. skills-development-and-employability

**Platinum (7 — institutions & systemic leadership):**
1. universities-and-higher-education
2. libraries-and-knowledge-systems
3. research-and-curriculum-development
4. faith-based-organisations
5. institutional-and-bilateral-grants
6. education-policy-and-government
7. regional-education-leadership

**Africa Education Icon (1 meta-category → 3 pathways):**
- africa-education-icon → Philanthropy · Literary & Curriculum · Technical Education

**Influencer Impact (1 meta-category → 3 subcategories):**
- influencer-education-impact → Social Media · Sports · Music

Not mapped in the 9/7 split (three residual categories from today's 18 that no longer fit either bucket cleanly): `inclusive-and-special-needs-education`, `early-childhood-education`. These logically belong to the **Rebuild My School Africa / Special-Needs** stream, not to the 4-tier recognition. I'll relocate them under the Special Needs and EduAid-Africa hubs (existing pages) rather than delete them.

If any of those three should instead stay on Gold–Blue Garnet or move to Platinum, say the word and I'll adjust before wiring.

## Implementation

1. **`src/config/recognitionArchitecture2026.ts`** — split the existing 18-category list into two `categories: []` arrays per the mapping above. Add Icon + Influencer meta-category entries where they already live.
2. **`src/config/recognition/categoryAlias.ts`** — extend `CATEGORY_TO_REGISTRY` with entries for any moved categories so subcategory counts continue to resolve.
3. **`src/pages/awards/GoldBlueGarnet.tsx` / `Platinum*.tsx`** — under each tier page, render a new "Award Categories" grid using the shared `SubcategoryPathways` component (already used on Icon and Influencer). Cards link to `/awards/18-categories/:slug`; nomination form on each tier page stays intact.
4. **`src/pages/awards/EighteenCategoriesPage.tsx`** — add a `tier` badge on each card and a `groupBy=tier` toggle so the /18-categories index still shows all 18 but grouped by parent tier.
5. **Update `docs/refactor/sitemap-38.md`** and inline nav copy where the count "18 Gold–Blue Garnet categories" appears so it reads "18 categories across 4 tiers (9 Gold–Blue Garnet · 7 Platinum · Icon · Influencer)".
6. No DB / RLS / edge-function changes required — the 18-category registry is purely front-end config.

## Out of scope

- Rewriting subcategory registries or category detail pages
- Changing the nomination form logic on any tier page (kept exactly as-is)
- The full narrative rewrite from your last message — that is a separate copy task; ping me and I'll fold those long-form sections into each tier page next.
