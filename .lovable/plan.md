# Judges Arena — port into this codebase

## Key finding first

The Judges Arena you described **already exists in this project**, in large part. Before building anything new I inspected the database and routes and found:

- **29 tables** already namespaced `icon_*` covering pathways, judges, panels, panel members, assignments, invitations, onboarding, conflicts, scores, reviews, notes, shortlists, deliberations + messages, Grand Jury groups/finalists/ballots/results, governance reviews, moderation actions, result snapshots, notifications and an immutable audit log.
- **11 server-side functions** already exist and do exactly what the spec's "key server-side operations" list asks: `submit_icon_score`, `submit_icon_shortlist`, `submit_icon_grand_jury_ballot`, `compute_icon_grand_jury_results`, `icon_governance_decide`, `icon_ensure_review`, plus role predicates `is_icon_judge` / `is_icon_moderator` / `is_icon_governance`.
- A **navy/gold Arena design system** (`ArenaChrome`, `ArenaSeo`, `IconJuryLayout`) and an access gate (`IconJudgeGate`) that already enforces auth + `ICON_JUDGE`/`ICON_MODERATOR`/`ICON_GOVERNANCE` role + a live OTP session.
- 18 routes already live under `/judges/*` and `/admin/icon-jury/*`.

**Recommendation: extend this, do not build a parallel `judges_arena_*` schema.** A second schema covering the same domain in the same Supabase project would double the RLS surface area — the opposite of the security goal — and would orphan the RPCs and audit log that already work. `icon_*` already satisfies the spec's "pick one namespace convention and use it consistently".

If you disagree and want a clean-room `judges_arena_*` build, say so and I'll re-plan — but I'd be duplicating working, already-secured tables.

## What is genuinely missing

Current data state: 3 pathways, 3 classifications, **0 judges, 0 panels, 0 Grand Jury groups, 0 invitations**. So the schema is there; the 9-pathway structure (3 categories x 3 communities), the 27 seats, and several UI surfaces are not.

### Stage 1 — Schema completion (one migration)
- Seed the **9 pathways** as `3 categories x 3 classifications` (Africans in Africa / Diaspora Africans / Friends of Africa), with the 3 categories as a first-class `icon_categories` table so `/judges/categories/:slug` has a real record to read.
- Add the missing columns the spec needs and the schema lacks: reserve nominee on panel shortlists, `reopen_requests` table for formal governance reopen (preserves the original record, never overwrites), per-pathway **result rooms** and a **Final 27-Judge Results Review Room** on the deliberations table, and message edit-history preservation.
- Add a `prepare_grand_jury_ballots(pathway)` RPC (missing) that materialises ballots once all 9 panel decisions are locked.
- Harden `submit_icon_grand_jury_ballot` validation: reject duplicate finalist IDs, duplicate ranks, missing ranks, out-of-range ranks, and reject submission by a **recused** judge.
- RLS audit pass across all 29 tables: verify Judge A cannot read Judge B's notes/scores/ballots, unassigned judges cannot read a pathway, and locked rows reject UPDATE at the policy level (not just the UI).

### Stage 2 — Invitation onboarding (missing)
- `/judges/sign-up` — single-use invitation token entry. Token compared as **SHA-256 hash** against `icon_judge_invitations`, tied to the approved email. Never logged.
- `/judges/onboarding` — the sequence: profile (title, institution, country, bio 30+ chars) -> appointment acceptance -> MOU -> Code of Conduct -> confidentiality -> COI declaration -> training -> MFA -> awaits governance activation. Persisted to `icon_judge_onboarding`.
- `/judges/forgot-password`.

### Stage 3 — Missing workspace routes
`/judges/categories`, `/judges/categories/:slug`, `/judges/pathways`, `/judges/pathways/:slug` (nominee queue + top-3 pipeline + reserve + pathway chat), `/judges/judge-profiles` (27-judge directory, auth-only), `/judges/finalists` (27 finalists), `/judges/chat-rooms` (3-column layout: room list / active room / details + confidentiality notice), `/judges/audit-log` (governance-only).

### Stage 4 — Grand Jury + results
- `/judges/general-voting` — select pathway -> review top 3 -> rank 1st/2nd/3rd -> submit, updatable until close, then locked. (Existing `/judges/voting` becomes an alias.)
- `/judges/general-voting/results` and `/results/:pathwaySlug` — scoring matrix (judges as columns, finalists as rows, 1pt/2pt/3pt, **lowest total wins**), "Verified & Approved" locked cards.
- **Status/completeness invariant:** the results view derives its status badge from the same lock state that gates the data. While a vote is open it renders a "Voting Open — results sealed" state with *no* provisional standings. A "Voting Live" badge can never appear next to revealed results. I'll add a unit test asserting this pairing.

### Stage 5 — Public landing + governance consistency
- Rebuild `/judges` as the public explainer, linked from the Trust page as the proof behind "no public voting". Flagship naming from `BRAND.flagship`. No wallet/AGC references, no public-voting language.
- Add `Disallow: /judges/` (keeping `/judges` itself indexable) to `robots.txt`, keep only `/judges` in the sitemap, and confirm `ArenaSeo` emits `noindex` on every confidential route.

## Technical notes

- Reuses existing auth: Supabase session + `user_roles.role_code` + OTP session, via `IconJudgeGate`. No parallel auth system, no service-role key in the browser.
- All new writes go through `SECURITY DEFINER` RPCs with authorization checks inside the function; the client never supplies the acting judge's identity.
- Gold/navy tokens come from the existing arena CSS variables and `brandHierarchy.ts` — no second gold.
- Mobile: sidebar collapses to the existing arena mobile pattern; the scoring matrix becomes stacked cards below `md`, never a wide table.

## Sequencing

I'll do Stage 1 as a migration you approve, then build Stages 2-5 in order, reporting what's complete, what's partial, and what needs a follow-up pass.
