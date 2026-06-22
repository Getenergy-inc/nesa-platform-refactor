# NESA-Africa NRC Evidence Refactor — Phased Delivery Plan

The uploaded workbook (`NESA_NIG_-2026_NRC_EVIDENCE_REFACTORED_NIGERIA_8REGION_3.xlsx`) carries **2,521 NRC rows** across 7 sheets (NRC Evidence Matrix, Nigeria Classification, 8-Region Classification, Category/Subcategory Coverage, Evidence Required Queue, Media Nigeria NRC, EDI Matrix Rules). This is the source of truth for the refactor.

The current live DB already has **2,038 approved nominees** + 18 categories tiered (1–4) + region filter wired to the interactive Africa map. We layer on top — **no deletes, no overwrites**.

I am proposing **5 sequential phases**. Each phase ships independently, behind read-only public surfaces first, with admin write surfaces after.

---

## Phase 1 — Database backbone (migration + workbook import)

**New tables (all in `public`, RLS + GRANTs per Lovable Cloud rules):**

- `nrc_evidence_rows` — 1:1 with the workbook's "NRC Evidence Matrix" sheet. Keyed by `nrc_no` + `active_nominee_id`. Stores all 46 columns including the 3 reference triplets, EDI 5-axis scores, total EDI /20, verification_status, research_priority, search_query_pack, public_website_wording.
- `nrc_evidence_sources` — normalised 1:N source register exploded from Ref 1/2/3 (source_title, source_name, source_url, source_year, evidence_type, reliability_rating 0–5, date_checked, researcher, verification_status).
- `nrc_edi_scores` — Education Development Index Matrix: 11 axes (Evidence Strength, Access, Equity, Inclusion & Safeguarding, Scale, Sustainability, Innovation, Community Relevance, EFA, SDG4, AU 2063), total, average, band, reviewer_note.
- `nrc_research_queue` — Evidence Required Queue rows (priority, status enum: pending / in_review / evidence_found / needs_more_sources / ready_for_review / public_display_ready).
- `nrc_icon_classifications` — **only** for Africa Education Icon Award nominees. icon_classification_group enum: `africans_in_africa | africans_in_diaspora | friends_of_africa | needs_verification`.
- `nrc_regional_summary` + `nrc_nigeria_summary` — denormalised dashboard tables refreshed by edge function.
- Extend existing `nominees` with: `nrc_no`, `nrc_classification_level`, `nigeria_classification_group`, `country_of_impact`, `evidence_status`, `edi_band`, `public_display_status`, `research_priority` (all nullable — no breakage of the 2,038 live rows).

**RLS:** public `SELECT` only on rows where `public_display_status = 'public_display_ready'`. Admin/NRC roles get full access via `has_role()`.

**Import:** one-shot edge function `nrc-evidence-import` that reads the workbook (uploaded to `nominee-media` bucket), upserts by `nrc_no`, links to existing `nominees` by name match, never overwrites approved nominee bios.

---

## Phase 2 — Public directory refactor (`/nominees/explore`)

Refactor existing `/nominees` (NomineesHubPage) into the **Africa Education Awards Evidence Directory**:

- Filters added: award tier · award category · subcategory · Nigeria classification group · 8-region · country of base · country of impact · nominee type · evidence status · EDI band · research priority · public display status.
- **Conditional filter:** "Africa Education Icon Classification" (Africans in Africa / Diaspora / Friends of Africa / Needs Verification) appears **only** when category = Africa Education Icon Award.
- Nominee cards show safe labels: Under NRC Review · Evidence Required · Verified Contribution · Public Display Ready · EDI band chip.
- Integrity notice footer on every list and profile page.
- No nominee called winner/finalist/sponsor/partner/judge/ambassador/endorser.

New public pages:
- `/nominees/nigeria` — Nigeria Classification hub (states, zones, category blocks).
- `/nominees/regions` — 8-region grid with balance status chips (already half-wired via the Africa map).
- `/nominees/regions/[regionSlug]` — 8 region pages.
- `/awards/africa-education-icon` — Icon hub with the 3 classification groups.
- `/nominee/[slug]` — refactor existing profile to add Evidence Section, EDI Matrix Section, conditional Icon Classification block, Integrity Notice.

---

## Phase 3 — Admin NRC portal (`/admin/nrc-*`)

Gated by existing `has_role(auth.uid(), 'admin')` + new `nrc` role.

- `/admin/nrc-dashboard` — totals, coverage, missing evidence, regional balance, Icon classification summary, duplicates, geography flags.
- `/admin/nrc-evidence-matrix` — full evidence matrix table with inline edits.
- `/admin/research-queue` — kanban by status.
- `/admin/source-register` — every reference row, sortable by reliability.
- `/admin/education-development-index-matrix` — 11-axis scoring UI per nominee, auto-computes total/average/band.
- `/admin/icon-award-classifications` — Icon-only classification manager.

---

## Phase 4 — NRC Research Engine

- Edge function `nrc-search-pack` — auto-generates the search query packs per nominee type (CSR / Media / Icon variants per the spec).
- Edge function `nrc-edi-recompute` — recomputes EDI band when scores change.
- Edge function `nrc-regional-balance` — nightly refresh of `nrc_regional_summary` and `nrc_nigeria_summary`.
- Daily cron via `pg_cron` to keep summaries fresh.

---

## Phase 5 — Terminology + integrity sweep

- Repo-wide: rename every "EDI Matrix" reference meaning Equity/Diversity/Inclusion → "Education Development Index Matrix". Audit `src/` + `docs/` + `supabase/migrations/`.
- Add `INTEGRITY_NOTICE` constant + `<IntegrityNotice />` component used on every public list/profile/category page.
- Banned-strings test extension: fail CI if winner/finalist/sponsor/etc. appears next to a nominee field without an `approved_*` guard.
- Nav refactor per the spec (Explore Nominees · Nigeria · Regions · Icon Award).

---

## Decisions I need from you before I start Phase 1

I will only ship Phase 1 (schema + import) in the first turn. Phases 2–5 follow turn by turn after you approve each one. Three calls I cannot make without you:

1. **Nominee linking on import** — when a workbook row name matches an existing `nominees` row, do I (a) attach NRC data as a sidecar (existing record untouched, recommended), or (b) overwrite the nominee's category/region/country with the workbook's classification?
2. **Existing `nominees` not in the workbook** (~1,500 of the 2,038 won't match the 2,521 NRC rows by name) — leave them with `evidence_status = NULL` and let them keep their current `status = 'approved'` public visibility, **or** flip them all to `under_nrc_review` and hide from `/nominees` until classified?
3. **Public visibility default after import** — should newly imported NRC rows be **hidden** from `/nominees` until an admin flips `public_display_status = 'public_display_ready'` (safer), or **visible** immediately with the "Under NRC Review" chip (faster, matches the spec's "discovery platform" framing)?

Reply with answers (1a/1b, 2a/2b, 3a/3b) and I'll ship Phase 1.
