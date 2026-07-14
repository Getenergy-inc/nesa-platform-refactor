## Goal

Ship a consistent 5-subpage cluster for each of the 4 recognition tiers (Home, About, Criteria, Nominees, Nominate) using a single mobile-first template and one SEO helper, driven by per-tier config.

## The 4 tiers and route shape

- Icon — `/awards/africa-education-icon/{about|criteria|nominees|nominate}`
- Blue-Garnet — `/awards/gold-blue-garnet/…`
- Platinum — `/awards/platinum-recognition/…`
- Influencer — `/awards/influencer-education-impact/…`

Existing tier "home" pages (`IconAward.tsx`, `BlueGarnetAward.tsx`, `PlatinumAward.tsx`, `InfluencerImpact2026.tsx`) remain the `/awards/:tier` entry — no visual regression.

## Deliverables

1. **`src/config/awards/tierCluster.ts`** — single source of truth per tier:
   - identity: tierId, slug, name, tagline, accent tone
   - hero: eyebrow, headline, subhead, primary + secondary CTA
   - about: narrative sections (mission, who qualifies, integrity model)
   - criteria: pillars, evidence types, evaluation weights, timeline anchor
   - nominees: directory filter (tier + year), empty-state copy
   - nominate: which existing form component to embed
   - seo: title, description, ogTitle, ogDescription, canonical path per subpage

2. **`src/components/awards/cluster/`** — reusable pieces:
   - `TierClusterLayout.tsx` — shared header bar (breadcrumb + sub-nav tabs: Overview · About · Criteria · Nominees · Nominate), mobile-first sticky tabs, active state.
   - `TierAboutSection.tsx`, `TierCriteriaSection.tsx`, `TierNomineesSection.tsx`, `TierNominateSection.tsx` — mobile-first templates driven by config.
   - `TierSEO.tsx` — `<Helmet>` wrapper reading tier + subpage from config; sets title, description, canonical, og:*, BreadcrumbList JSON-LD.

3. **Page routes** — 4 tiers × 4 new subpages = 16 pages, each a 5-line file that renders the template with `{ tier, subpage }`:
   - `src/pages/awards/cluster/{tier}/{About|Criteria|Nominees|Nominate}Page.tsx`

4. **`src/App.tsx`** — register the 16 new routes above the wildcard, alongside existing tier home routes.

5. **Reuse, don't rebuild**:
   - Nominees subpage reuses `BrandedNomineeDirectory` filtered by tier.
   - Nominate subpage embeds each tier's existing form (`InfluencerNominationForm`, Icon form, Platinum forms, Blue-Garnet form) via the config's `formComponent` field.
   - Criteria pulls from existing `awardPageContent.ts` where fields already exist.

## SEO consistency

Every subpage gets:
- `<title>` = `{Tier Name} — {Subpage} · NESA-Africa 2026`
- Canonical + og:url self-referencing the exact subpage path
- BreadcrumbList JSON-LD (Home → Awards → Tier → Subpage)
- Consistent 155-char description templated per subpage type

## Out of scope this pass

- Redesigning the existing tier home pages
- Changing existing nomination forms
- Backend/DB changes

## Confirmation needed

This is ~24 new files + App.tsx edits. Confirm and I'll build it; or say "just Icon first" to pilot one tier before rolling to the other three.
