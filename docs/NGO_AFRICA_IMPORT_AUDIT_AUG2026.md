# Import audit — NGO (Africa Regional), "Research compilation — Aug 2026"

Category: `best-ngo-education-africa`
Source batch: Evidence A/B, West + East Africa (18 organisations in the source email)
Generated: 3 September 2026

## 1. Mapped vs. ambiguous

| Outcome | Count |
| --- | --- |
| Mapped confidently on first pass (this audit) | 12 |
| Flagged ambiguous on first pass (mapped later, decision still pending) | 6 |
| Excluded by instruction (Central/Southern/North Africa, Evidence C, no evidence link) | not imported |

Per-subcategory breakdown of the 12 confidently mapped records:

| Subcategory (region-scoped) | Mapped |
| --- | --- |
| Girl-Child Education (West Africa) | 4 |
| Girl-Child Education (East Africa) | 2 |
| Teacher Training (East Africa) | 4 |
| Teacher Training (West Africa) | 2 |
| **Total** | **12** |

The 6 flagged records (Street Child, Save the Children Nigeria, AfriKids, Slum2School
Africa, World Vision Rwanda, Room to Read) are excluded from this audit's counts; their
mapping is a separate pending decision and they were not modified in this pass.

The five thematic subcategories named in the source research (Basic & Primary Education,
Refugee & Displaced Children Education, Special Needs & Inclusive Education) do not exist
in production. Production uses region-scoped subcategories, so mapping was constrained to
Girl-Child Education and Teacher Training for the confident set.

## 2. Fields saved per record

Every one of the 12 records carries identical governance fields:

- `status` = `under_review`
- `publication_status` = `unpublished`
- `public_display_status` = `hidden`
- `nrc_verified` = `false`
- `acceptance_status` = `PENDING`
- `profile_status` = `partial`, `profile_completion_score` = 40
- `data_source` = `historical_register_unconfirmed` (the only permitted unverified value)
- `nomination_source` = `Research compilation — Aug 2026` (dedicated column; previously
  overloaded onto `legacy_source`, now cleared there)
- `evidence_urls` = empty — the source email's evidence links were not supplied to the
  import, so none were fabricated. Evidence grade (A/B) is recorded in each bio.

| # | Nominee | Country | Region | Subcategory | nomination_source | data_source | status / publication / nrc_verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Plan International Nigeria | Nigeria | West Africa | Girl-Child Education (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 2 | ActionAid Nigeria | Nigeria | West Africa | Girl-Child Education (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 3 | ActionAid Ghana | Ghana | West Africa | Girl-Child Education (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 4 | Development Research and Projects Centre (dRPC) | Nigeria | West Africa | Girl-Child Education (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 5 | I Choose Life–Africa | Kenya | East Africa | Girl-Child Education (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 6 | CAMFED | Zimbabwe | East Africa | Girl-Child Education (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 7 | The Education Partnership Centre (TEP Centre) | Nigeria | West Africa | Teacher Training (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 8 | LEAP Africa | Nigeria | West Africa | Teacher Training (West Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 9 | Together We Learn Ethiopia | Ethiopia | East Africa | Teacher Training (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 10 | Edukans | Ethiopia | East Africa | Teacher Training (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 11 | Educate! | Uganda | East Africa | Teacher Training (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |
| 12 | Right To Play | Kenya | East Africa | Teacher Training (East Africa) | Research compilation — Aug 2026 | historical_register_unconfirmed | under_review / unpublished / false |

## 3. Controls now in place

- **Database trigger** `enforce_research_import_review()` on `public.nominees`: any row whose
  `nomination_source` contains "research compilation" is rejected if it is inserted or updated
  as published or `nrc_verified = true` while its status is not `approved`. Publishing is only
  possible after an admin approval.
- **Admin review queue** at `/admin/ngo-review` (admin role only): lists every
  `best-ngo-education-africa` nomination at `status = under_review` with its subcategory,
  location, bio and governance fields, and provides Approve (publishes) / Reject actions.
  The 6 pending-decision records are shown read-only.
- **Automated tests** in `src/config/__tests__/researchImportRules.test.ts` enforce
  region-scoped subcategory mapping and the under_review / unpublished / not-verified triple.

## 4. Second pass — 3 September 2026 (new subcategories + resolution of the 6 flagged records)

Four new region-scoped subcategories were created under `best-ngo-education-africa`
(no speculative Central/Southern/North shells):

- `ngo-africa-basicprimary-west-africa` — Basic & Primary Education (West Africa)
- `ngo-africa-basicprimary-east-africa` — Basic & Primary Education (East Africa)
- `ngo-africa-refugee-west-africa` — Refugee & Displaced Children Education (West Africa)
- `ngo-africa-refugee-east-africa` — Refugee & Displaced Children Education (East Africa)

The 6 previously flagged records were re-mapped (governance fields unchanged:
`under_review` / `unpublished` / `nrc_verified = false`, `nomination_source =
Research compilation — Aug 2026`):

| Nominee | Subcategory | Evidence |
| --- | --- | --- |
| Street Child | Basic & Primary (West Africa) | A+ |
| Save the Children Nigeria | Basic & Primary (West Africa) | A |
| AfriKids | Basic & Primary (West Africa) | A+ |
| Slum2School Africa | Basic & Primary (West Africa) | A |
| World Vision Rwanda | Basic & Primary (East Africa) | A |
| Room to Read | Basic & Primary (East Africa) | A+ |

Seven new A+/A entries were added with the same governance fields:

| Nominee | Subcategory | Evidence |
| --- | --- | --- |
| CODE (Canadian Organization for Development through Education) | Basic & Primary (West Africa) | A+ |
| Strømme Foundation | Basic & Primary (West Africa) | A+ |
| PEAS | Basic & Primary (East Africa) | A+ |
| Finn Church Aid | Refugee & Displaced (East Africa) | A |
| Windle International | Refugee & Displaced (East Africa) | A |
| Norwegian Refugee Council (Uganda SESBiLL) | Refugee & Displaced (East Africa) | A |
| COOPI — Cooperazione Internazionale | Refugee & Displaced (West Africa) | A |

**Not imported:** Edukans was requested for Basic & Primary (East Africa) but already
exists in this batch under Teacher Training (East Africa). No duplicate record was
created; re-mapping is a pending decision.

Resulting `under_review` total for `best-ngo-education-africa`: **25**
(Basic & Primary West 6, Basic & Primary East 3, Refugee West 1, Refugee East 3,
Girl-Child West 4, Girl-Child East 2, Teacher Training West 2, Teacher Training East 4).

## 5. Third pass — 3 September 2026 (full 100-organisation master list)

The full source research file was imported. Region-scoped subcategories were created
only where real records existed (no speculative shells):

- Central Africa: scholarship, refugee, community, training, basicprimary, girlchild
- Southern Africa: girlchild, materials, basicprimary, community, training
- North Africa: girlchild, basicprimary, training, materials, community
- Horn of Africa: basicprimary, refugee, scholarship, girlchild
- Sahel Africa: basicprimary, girlchild, refugee, community
- Indian Ocean Islands: basicprimary, materials, scholarship, specialneeds, community, girlchild
- African Diaspora: training, scholarship
- Friends of Africa: basicprimary, community

**Inserted:** 60 new organisations from the master list (the other 30 rows were either
already imported in passes 1–2 or were duplicates of an existing record by name).

**Skipped duplicates / already present:**

| # | Organisation | Reason |
| --- | --- | --- |
| 1 | Street Child | Already imported (Basic & Primary, West Africa) |
| 2 | Plan International Nigeria | Already imported |
| 3 | Save the Children Nigeria | Already imported |
| 4 | ActionAid Nigeria | Already imported |
| 5 | ActionAid Ghana | Already imported |
| 6 | AfriKids | Already imported |
| 7 | TEP Centre | Already imported |
| 8 | Slum2School Africa | Already imported |
| 9 | LEAP Africa | Already imported |
| 10 | dRPC | Already imported |
| 11 | I Choose Life–Africa | Already imported (East Africa) |
| 12 | CAMFED | Already imported (East Africa) |
| 13 | World Vision Rwanda | Already imported (Basic & Primary, East Africa) |
| 14 | Together We Learn Ethiopia | Already imported |
| 15 | Edukans | Already imported (Teacher Training, East Africa) — not duplicated |
| 16 | Hope of Family | Already imported (Basic & Primary, East Africa) |
| 17 | Children of Rwanda | Already imported (Basic & Primary, East Africa) |
| 18 | Educate! | Already imported |
| 19 | Room to Read | Already imported (Basic & Primary, East Africa) |
| 20 | Right To Play | Already imported (East Africa) |
| 25 | COOPI | Already imported (Refugee, West Africa) |
| 60 | I Choose Life–Africa | Duplicate of #11 |
| 82 | Education Congo | Duplicate of #22 (Central Africa scholarship) |
| 86 | Education For Madagascar | Duplicate of #71 (Indian Ocean Islands) |
| 87 | Somali Hope Foundation | Duplicate of #54 (Horn of Africa) |
| 88 | Children of Rwanda | Duplicate of #17 (East Africa) |
| 91 | Room to Read | Duplicate of #19 (Friends of Africa vs East Africa) |
| 92 | CAMFED | Duplicate of #12 (Friends of Africa vs East Africa) |
| 93 | Right To Play | Duplicate of #20 (Friends of Africa vs East Africa) |
| 96 | Concern Worldwide | Duplicate of #28 (Friends of Africa vs Central Africa) |
| 99 | International Rescue Committee | Duplicate of #30 (Friends of Africa vs Central Africa) |
| 100 | Norwegian Refugee Council | Duplicate of #59 (Friends of Africa vs Horn of Africa) |

**Final `under_review` total for `best-ngo-education-africa`: 85**
research-compilation records, all governed as `under_review` / `unpublished` /
`nrc_verified = false` / `public_display_status = hidden` / `profile_completion_score = 40`.

Per-region under_review counts:

| Region | Count |
| --- | --- |
| West Africa | 12 |
| East Africa | 11 |
| Central Africa | 10 |
| Southern Africa | 10 |
| North Africa | 10 |
| Horn of Africa | 9 |
| Sahel Africa | 10 |
| Indian Ocean Islands | 10 |
| African Diaspora | 6 |
| Friends of Africa | 3 |
