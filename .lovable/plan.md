## Africa's Education Impact Directory — `/nominees` Refactor

Transform the nominees page into a premium 11-section discovery platform positioned as "Africa's Education Impact Directory."

### Scope

Rebuild `/nominees` (NomineesHubPage) into a long-form, section-based directory experience modeled on IMDb/LinkedIn/UNESCO. Reuse existing data layer (`useNominees`, `recognitionArchitecture2026`, `pillars`, `regions`) — no schema changes.

### Sections (11)

1. **Hero** — Large immersive hero with headline "Africa's Education Impact Directory", subheadline, 12 dynamic stat counters (DB-driven), 5 primary CTAs.
2. **Four Recognition Tiers** — Interactive cards linking to tier pages (Icon / Gold-Blue Garnet / Platinum / Influencer).
3. **Nine Recognition Pillars** — Visual nav cards from `src/data/pillars.ts` with counts + featured enablers.
4. **Browse by Award Category** — Grid of all categories with icon, count, latest profiles, story, explore CTA.
5. **Browse by Recognition Tier** — Filter chips for the 4 tiers.
6. **Browse by Education Enabler Type** — 25 enabler-type chips (People, NGOs, Universities, Faith-Based, Diaspora, etc.).
7. **Browse by Eight Africa Regions + 2 Global Communities** — Regions grid (8) + separated Global Communities block (Diaspora, Friends of Africa).
8. **Interactive Africa Map** — Reuse existing Africa map component with hover stats.
9. **Featured Education Enablers** — Horizontal large cards with photo, region, tier, category, impact summary.
10. **Education Impact Stories** — Dynamic storytelling cards (before/after, school transformation, etc.).
11. **Advanced Discovery** — Global search with autocomplete + smart filters (tier, category, pillar, country, region, community, enabler type, organisation type, impact area, gender, language, verification, year) + result grid using upgraded NomineeCard.

Footer: Independent Verification, Governance, EDI Matrix, FAQs, Sponsor Independence, Privacy, Accessibility, Contact.

### Naming

Rename all user-facing references "Nominee Directory" → **Africa's Education Impact Directory**. Internal route stays `/nominees` (preserves SEO + deep links).

### Files

**New components** (`src/components/directory/`):
- `DirectoryHero.tsx` — hero + 12 stats + CTAs
- `DirectoryTiersSection.tsx`
- `DirectoryPillarsSection.tsx`
- `DirectoryCategoriesSection.tsx`
- `DirectoryEnablerTypesSection.tsx`
- `DirectoryRegionsSection.tsx` (8 regions + 2 communities split)
- `DirectoryMapSection.tsx` (wraps existing Africa map)
- `DirectoryFeaturedSection.tsx`
- `DirectoryImpactStoriesSection.tsx`
- `DirectoryAdvancedDiscovery.tsx` (search + filters + results grid)
- `DirectoryFooterTrust.tsx`

**Edited**:
- `src/pages/nominees/NomineesHubPage.tsx` — replaced with new composed page
- `src/config/platformCopy.ts` — add `DIRECTORY_NAME = "Africa's Education Impact Directory"`
- `src/components/navigation/MainNav.tsx` — update label
- `src/config/navigation.ts` — update label
- `index.html` / Helmet — title/description/OG/JSON-LD for `/nominees`

### Technical Details

- **Data**: existing `useNominees` (public_nominees view), `recognitionArchitecture2026.ts`, `pillars.ts`, `regions.ts`. Counts computed client-side from query results with React Query caching.
- **Analytics**: `directory_section_view`, `directory_cta_click`, `directory_filter_apply`, `directory_search` via existing `analytics.ts`.
- **SEO**: per-route Helmet with canonical `/nominees`, OG image, JSON-LD `ItemList` schema. Stack stays React/Vite (project is not Next.js — ignore that part of brief; we have ISR-equivalent via React Query staleTime).
- **A11y**: AA contrast, focus rings, ARIA labels on stat cards, semantic landmarks (`<main>`, `<section aria-labelledby>`), keyboard nav on filters.
- **Design**: Charcoal/Gold per brand memory, Playfair display headings, framer-motion section reveals.
- **No business-logic changes**: pure presentation refactor on existing Supabase data.

### Out of Scope

- Individual nominee profile redesign (separate ticket — current `/nominees/:slug` retained).
- New DB tables/columns (counts derive from existing data).
- Multi-language directory copy (English first; i18n keys reserved).
