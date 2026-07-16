
# Expand Africa Regional model: 5 → 8 Africa Regions (+ African Diaspora)

This is a large, cross-cutting refactor touching config, database, forms, directories, dashboards, SEO and copy. It should ship in staged phases so preview stays green after each step.

## Goals

- Replace the existing 5-region model with 8 approved Africa regions.
- Treat **African Diaspora** as a separate Global Community track (never counted as an Africa region).
- Establish one country → region mapping as the single source of truth.
- Migrate existing nominee/nomination records with an auditable log.
- Update forms, directories, dashboards, SEO copy and routes consistently.

## Approved regions (canonical order everywhere)

1. North Africa
2. West Africa
3. Central Africa
4. East Africa
5. Horn of Africa
6. Southern Africa
7. Sahel Region
8. Indian Ocean Islands

Separate track: **African Diaspora** (with sub-continents: North America, South America, Europe, Caribbean, Middle East, Asia, Oceania).

## Phase 1 — Canonical region source of truth (frontend config)

- Rewrite `src/config/regions/africaRegions.ts` (new) as the single export used everywhere:
  - `AFRICA_REGIONS` (id, code, slug, name, order, description, countries[])
  - `DIASPORA_REGIONS` (continents)
  - `COUNTRY_TO_REGION` map (ISO2 → region code) using the country lists in the prompt
  - Helpers: `getRegionByCountry(iso2)`, `getRegionBySlug(slug)`, `listAfricaRegions()`, `listDiasporaContinents()`
- Deprecate/rewire `src/lib/regions.ts`, `src/lib/regionClassifier.ts`, `src/config/regionHubs.ts` to re-export from the new module. Keep old exports as thin aliases while call sites are migrated so the build never breaks.
- Add legacy → new region migration table (e.g. "East Africa" nominee in Ethiopia → Horn of Africa).

## Phase 2 — Database schema & migration

Create migration (single approval):

- `public.regions` — id, code, slug, name, region_type (`africa_region` | `global_community`), display_order, is_active, effective_date. Seed 8 Africa regions + `african-diaspora`.
- `public.countries` — id, iso2, iso3, name, region_id, is_african, is_active. Seed from the country list.
- `public.region_migration_log` — entity_type, entity_id, old_region, new_region, reason, changed_by, changed_at.
- Extend `nominees`: add `country_id`, `region_id`, `diaspora_status`, `country_of_residence_id`, `diaspora_region_id` (nullable; backfill later).
- Extend `nominations`: add `country_id`, `auto_assigned_region_id`, `region_override_reason`, `diaspora_status`.
- Extend `award_categories`: `geographic_scope`, `regional_model` (`one_per_region` | `filter_only` | `landing_pages`), `applies_to_all_regions`, `region_version`.
- GRANTs + RLS on all new tables (public read for regions/countries; admin write; migration log admin-only).

Data backfill (via `supabase--insert`, batched after migration):

- Populate `regions` and `countries` seeds.
- Backfill `nominees.region_id` from existing `country`/legacy region using the new mapping; log every reassignment into `region_migration_log`.

## Phase 3 — Nomination flow

- Update `NativeCategoryNominationForm`, `NomineeEntryForm` (Icon), Influencer form, Platinum/Diaspora form:
  - Country select → auto-derives region (read-only "Recognition Region: …" helper).
  - If `diaspora_status = true`: show country of residence, diaspora continental region, and African countries/regions supported.
  - Persist `country_id`, `region_id`, `diaspora_*` fields.
- Update draft JSON schema in `nomination_drafts` writes.

## Phase 4 — Discovery: directory, filters, cards, profiles

- `RegionSelector`, `RegionBadge`, `RegionCard`, `RegionalNomineeGrid`, `RegionalStats`, `RegionalFilterDrawer`, `DiasporaSelector` — one shared component set under `src/components/regions/`.
- Update `/nominees` and every award-specific directory to filter by 8 regions + Diaspora tab.
- Nominee cards show country + region + category + verification.
- Nominee profile: primary country, recognition region, geographic reach, countries served, diaspora classification.
- "Explore by Africa Region" reusable section on hub pages with dynamic counts.

## Phase 5 — Award pages, routes, SEO

- Route slugs: `north-africa`, `west-africa`, `central-africa`, `east-africa`, `horn-of-africa`, `southern-africa`, `sahel-region`, `indian-ocean-islands`, `african-diaspora`.
- Add `/nominees/region/:slug` regional landing pages driven by config.
- Register redirects in `src/config/refactorRedirects2026.ts` for old region URLs.
- Update award cards to display "Scope: 8 Africa Regions" (list all 8 once in the shared regional block, not on every card).
- Update SEO titles/descriptions per region.
- Global copy sweep: replace "5 / five African regions" and "North, West, East, Central and Southern Africa" phrasing across content configs (`pillars.ts`, `capability2026.ts`, `awardPageContent.ts`, `tierCluster.ts`, `regionHubs.ts`, homepage hero, footer, About).
- Canonical tagline: **"One Continent. Eight Africa Regions. One African Diaspora Community. One Mission."**

## Phase 6 — Dashboards, NRC, analytics

- Update executive/regional/chapter/NRC/media/sponsor dashboards: 8-region charts + separate Diaspora slice.
- NRC assignment rules: 8 Africa regional teams + African Diaspora team; auto-assign based on country → region.
- Import/export templates (`nomineeExport.ts`, admin CSV import): add Country, Country Code, Region, Region Code, Diaspora Status, Country of Residence, Diaspora Continental Region, African Country Supported.

## Phase 7 — QA

- Unit tests for `getRegionByCountry` covering every listed country.
- Integration tests: form country → region auto-assignment; directory filters return correct counts; diaspora fields conditional rendering.
- Redirect test for legacy region URLs.
- Manual QA pass via Playwright on nominee directory + one nomination form + regional landing page.

## Technical notes

- Because this touches ~60 files, do it in the phase order above and land Phase 1 + Phase 5 copy sweep before Phase 4 UI so pages don't render stale labels while wiring is in flight.
- Keep legacy `regionClassifier` API surface temporarily to avoid a big-bang breakage; delete after all call sites migrate.
- Do **not** silently mutate existing nominee records — every reassignment goes through `region_migration_log`.
- Diaspora is never included in the 8-region counters or the Africa region dropdowns; it lives in its own tab/section.

## Out of scope for this plan (call out for follow-up)

- Rewriting award tier scoring formulas.
- Migrating historical winner records from earlier seasons (before NESA-Africa 2026) beyond region reassignment.
- Localisation of new copy into the 11 supported languages — will follow once English copy is frozen.

## Deliverables (matches the master prompt)

Old 5-region audit report, approved country→region mapping, affected page list, affected category list, DB migration, API spec, spreadsheet template, updated forms, updated filters, updated profiles, updated NRC logic, updated dashboards, copy diff, redirect map, QA plan, migration report, final 8-region checklist.

**Please confirm the plan (or flag phases to drop / reorder) and I will start with Phase 1 + the Phase 2 migration.**
