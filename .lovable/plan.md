
# Africa Education Icon — Master Refactor Plan

This is a large, multi-phase migration. To keep it shippable and reversible, I'll break it into 5 sequenced phases. Each phase produces a verifiable artefact before the next begins. **Nothing in `src/data/iconAward` legacy files is deleted** — new data merges in via the existing `ICON_NOMINEES` dedup pipeline.

## Phase 0 — Data Ingestion & Audit (no UI changes)

1. **Parse the workbook** `NESA_Africa_Icon_Nominee_List_Table_Excel_2006_2026 (8).xlsx` with a script (`scripts/icon/ingest-workbook.ts`). Detect sheets, normalise headers, emit:
   - `src/data/iconAward/workbook2026.json` — canonical nominee records with: slug, name, subcategory (philanthropy / literary / technical), classification (africa-resident / diaspora / friend-of-africa), country, region, organisation, years, evidence bullets, references, source row.
   - `migration/icon-workbook.report.md` — totals per subcategory × classification, missing fields, slug collisions vs existing `ICON_NOMINEES`.
2. **Extract the image archive** to `public/images/icons/` (kebab-case filenames matching nominee slugs). Build `src/data/iconAward/iconImageMap.ts` mapping slug → public path, with a fuzzy-match report for any unmatched names ("(Tech track)" / "(Posthumous)" / "(Curriculum track)" suffixes are stripped during matching).
3. Emit `migration/icon.images.report.md` listing matched, unmatched-image, and nominee-without-image counts.

I stop and post the two reports to you before Phase 1 so you can spot mis-mappings.

## Phase 1 — CMS Merge

1. Convert `workbook2026.json` into `src/data/iconAward/workbookNominees.ts` exporting typed records that match the existing `IconNominee` shape (slug, kind, subcategory, classification, country, region, organization, summary, contributions[], image, sources[]).
2. Update `src/data/iconAward/index.ts` so `ICON_NOMINEES` = workbook-first ∪ legacy ∪ refactored — workbook wins on conflict, full provenance retained in `ICON_MERGE_STATS`.
3. Extend `IconNominee` with `contribution_2006_2026` (the long-form section) generated **only from workbook evidence** — no fabrication; if evidence is thin the section renders a "Verification in Progress" stub rather than invented prose.
4. Auto-attach images from `iconImageMap` with premium fallback (`PortraitFallback` component) for missing photos.

## Phase 2 — Gateway Page Refactor (`/awards/africa-education-icon`)

Replace the current long-scroll composition in `src/pages/categories/AfricaEducationIcon.tsx` with a museum-grade structure:

```text
Hero (legacy positioning) → Why this award exists → 3 Icon pathways (premium cards)
→ 3 Continental classifications (world-map visual) → Selection process (6 steps)
→ Hall of Fame preview (top verified) → Legacy stories → Final CTA
```

Remove duplicate FAQ / governance / sponsor / nomination / trust blocks (each appears once or links out).

## Phase 3 — Subcategory Pages Refactor

Refactor in place (URLs preserved):
- `/nominees/africa-education-icon-award/education-philanthropy-icon`
- `/nominees/africa-education-icon-award/literary-new-curriculum-advocate`
- `/nominees/africa-education-icon-award/technical-educator-icon`

Each page renders three classification rails (Africa-resident / Diaspora / Friend of Africa) populated from `byClassification(sub, cls)`, with sticky filters (country, region, organisation, year, verification), search, swipeable mobile cards, lazy images.

## Phase 4 — Profile Experience + "Individual Contribution 2006–2026"

Upgrade `IconNomineeProfilePage` (existing route preserved) to render:
- Hero portrait + verification badge
- Biography
- **Individual Contribution to African Education (2006–2026)** — generated from `contribution_2006_2026`, with verified-evidence bullets
- Timeline · Institutions · Sectors · Gallery (if media) · References · Related nominees
- SEO: canonical preserved, BreadcrumbList + Person/Organization JSON-LD, OG tags

Auto-generate profile pages for any workbook nominee that lacks one (data-driven; no new route files needed since the page already resolves by slug).

## Phase 5 — QA + Live Stats + SEO

- Replace hardcoded counters with live `ICON_NOMINEES`-derived stats (totals, per-classification, countries, year span).
- Add Playwright spec `tests/e2e/icon-hall-of-fame.spec.ts` asserting: gateway loads, 3 pathways link correctly, each subcategory shows 3 classification groups with non-empty rails (or verification placeholder), every workbook nominee resolves to a profile, no broken images, no duplicate H1.
- Run `bun run build` and verify zero regressions.

## Decisions I need from you before I start Phase 0

1. **Tone of generated `contribution_2006_2026` prose** — strictly bullet evidence (safe, never invents) vs. 150-word narrative summary rewritten from evidence cells (richer, but I will refuse to write if a row has fewer than ~3 evidence fields). Which?
2. **Legacy nominees with no workbook row** (the 180 from your earlier refactored list) — keep them visible alongside workbook nominees in the Hall of Fame, or hide them until they appear in the workbook?
3. **Image storage** — public/ folder (committed, ~15 MB, simple) vs. Lovable Assets CDN (recommended for binary >5 MB total, keeps repo lean). Default to CDN unless you prefer public/.

Once you answer (or say "your call"), I'll run Phase 0 and post the two reports.
