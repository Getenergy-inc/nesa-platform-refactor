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
