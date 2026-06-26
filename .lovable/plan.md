# NESA-Africa 2026 — 7-Pillar Communication Refactor

## Scope
Refactor public-facing copy + structure across the homepage hero, Award Categories overview page, and 7 pillar pages so visitors immediately understand: what NESA-Africa is, who it recognises, and one clear first action.

All routing, data, governance, and backend logic stay untouched. This is a frontend/presentation refactor (copy, identity tags, CTA labels, section ordering, new pillar pages).

## Deliverables

### 1. Homepage Hero (`src/components/nesa/TrophyHeroSection.tsx`)
- Eyebrow: "NESA-Africa 2026 | The African Blue-Garnet Awards for Education"
- Headline: "Africa's Highest Honour for Education Excellence."
- Subheadline: enablers narrative (people, institutions, companies, funders, innovators, diaspora, media, advocates)
- Clarity badge: "Not a student prize. Not just another award ceremony…"
- Primary CTA: "Nominate an Education Champion" → `/nominate`
- Secondary CTA: "Explore the 7 Recognition Pillars" → `/awards/pillars`
- Trust microcopy: integrity firewall line
- Replace floating identity tags with: Education Icons, CSR for Education, Diaspora Champions, EdTech & STEM, Education Funders, Institutional Excellence, Social Media Education Champions
- Stats bar: 54 Countries · 18 Categories · 7 Pillars · 2026–2027 Impact Journey

### 2. Award Categories Overview (`src/pages/Awards.tsx`)
- New hero: "Every Force Building African Education Deserves a Stage."
- Replace top section with 7 Pillar banner cards (each links to its pillar page)
- Keep existing recognition framework, 9-step journey, and selection flow below
- Final CTA section: "Know someone making education possible?"

### 3. New Pillars Hub Route (`/awards/pillars`)
- New file: `src/pages/awards/PillarsHub.tsx` listing all 7 pillars as rich cards.

### 4. 7 Pillar Pages (new files under `src/pages/awards/pillars/`)
Each follows identical template: Hero → Sell line → Opening intro → Who is eligible → Who is not → Why this pillar exists → Subcategories (with CTAs) → Sponsorship positioning → Sponsor + Nomination CTAs → Hashtags → Standard footer note.

Routes:
- `/awards/pillars/africa-education-icon` → Pillar 1 (reuses/links existing `/awards/africa-education-icon`)
- `/awards/pillars/csr-for-education` → Pillar 2
- `/awards/pillars/diaspora-champions` → Pillar 3
- `/awards/pillars/edtech-stem` → Pillar 4
- `/awards/pillars/education-funding` → Pillar 5
- `/awards/pillars/continental-recognition` → Pillar 6
- `/awards/pillars/social-media-champions` → Pillar 7

Shared template component: `src/components/awards/pillars/PillarPageTemplate.tsx` driving from a `PILLARS` data file (`src/data/pillars.ts`) so all 7 pages stay consistent and copy edits stay one-file.

### 5. Routing (`src/App.tsx`)
Register `/awards/pillars` and the 7 child routes.

### 6. Standard Pillar Footer Block
Reusable `PillarFooterNote` component injected at the bottom of every pillar page.

## Out of scope
- Database/schema changes
- Existing `/awards/africa-education-icon` Hall of Fame gateway (kept as-is; Pillar 1 page links into it as deep destination)
- Translations (English copy only — i18n keys can be added later)
- Visual redesign of unrelated sections

## Technical notes
- All copy lives in `src/data/pillars.ts` (typed) so future edits are content-only.
- Reuse existing design tokens (charcoal/gold), Playfair Display headers, framer-motion fade-ins.
- Add `pillar_cta_click` analytics event via existing `trackEvent` helper.
- SEO via `react-helmet-async` on each pillar page (title, description, canonical, BreadcrumbList JSON-LD).
- No changes to nominee/judge/governance components.
