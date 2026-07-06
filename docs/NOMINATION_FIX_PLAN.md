# Nomination pipeline — correction plan (2026-07-06)

Public submission failed with **500 `Failed to create nominator`**. Root-cause
audit of `nominations-submit` against the REAL remote schema found several
column / enum / constraint mismatches (the Lovable-generated functions never
matched the DB, which is why nothing ever wrote — `nominations` is empty).

## Bugs found & fixes

### A. Edge Function `supabase/functions/nominations-submit/index.ts`

| # | Bug | Real schema | Fix |
|---|-----|-------------|-----|
| 1 | inserts `consent` into `nominators` | column is `consent_given BOOLEAN NOT NULL` (+ `consent_at`) | write `consent_given` (+ `consent_at`) |
| 2 | `nominations.source = "website"` | `source` is enum `nomination_source ('START_MEMBER','NRC','PUBLIC')` | use `"PUBLIC"` |
| 3 | `nominations.source_channel = "website_official"` | CHECK `IN ('website','google_form','admin_import','migration')` | use `"website"` |
| 4 | `nominations.status = "submitted"` | enum `nomination_status ('pending','under_review','approved','rejected','platinum')` | use `"pending"` |
| 5 | `nominations.publication_status = "under_review"` | CHECK `IN ('unpublished','queued','published','retracted')` | use `"queued"` |
| 6 | `nominations.workflow_status = "SUBMITTED"` | enum values start `'SUBMITTED_PENDING_ACCEPTANCE'` | use `"SUBMITTED_PENDING_ACCEPTANCE"` |
| 7 | `subcategory_id` may be null | `NOT NULL` on both `nominees` and `nominations` | resolve slug → if not found, return 400 (clear error) instead of 500 |

`nominees` insert columns, enum values (`status='pending'`, `acceptance_status='PENDING'`),
`acceptance_letters` and `notifications` inserts were verified OK.

### B. Migration — `nominations.nominator_id`

Empirically confirmed via PostgREST: `nominations.nominator_id` still
`REFERENCES auth.users(id) NOT NULL` (the later "repoint to nominators" ALTER was
a no-op because the column already existed). A public, no-login nomination has no
`auth.users` id, so the insert can never satisfy this column.

`nominations` table is **empty**, so it is safe to reshape:
- drop `NOT NULL` on `nominator_id`
- drop the `auth.users` FK (`nominations_nominator_id_fkey`)
- add FK `nominator_id → public.nominators(id)`

Migration: `20260706130000_fix_nominations_nominator_ref.sql`.

## After applying
Redeploy `nominations-submit` + run `supabase db push`, then re-test the public
submission end-to-end (nominator → nominee → nomination → acceptance token).
