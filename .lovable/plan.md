# Nominate-First Refactor Plan

Shift every public nomination journey from "sign up → sign in → nominate" to "nominate → create/confirm account at submit → track". Reuse one component across all forms.

## Scope

Forms in scope (all rewired to the same submission gate):
- Africa Education Icon nomination
- Blue Garnet (competitive) nominations
- Platinum Recognition nominations (incl. Diaspora, Library Nigeria, R&D Nigeria)
- Influencer Education Impact nomination
- School / Rebuild My School nominations
- Local Chapter recommendations
- Any generic `NativeCategoryNominationForm` entry point

Out of scope: NRC review, judge, admin, and volunteer flows (they remain sign-in first).

## Phase 1 — Backend (Lovable Cloud)

Migration adds:

1. `public.nomination_drafts`
   - `id uuid pk`, `draft_token text unique` (format `NOM-DRAFT-2026-XXXXXXXX`)
   - `form_type text`, `award_tier text`, `category_slug text`, `subcategory_slug text`
   - `nominee_data jsonb`, `nominator_email citext`, `session_id text`
   - `status text` (`draft` | `awaiting_account` | `converted` | `expired`)
   - `converted_to_nomination_id uuid null`
   - `created_at`, `updated_at`, `expires_at` (default `now() + 30 days`)
   - RLS: anon can `INSERT` + `SELECT`/`UPDATE` only rows matching their `draft_token` (passed via RPC param, not exposed to PostgREST filter); authenticated users can read drafts they own by email; service_role full.
   - Nightly cleanup via cron: delete `expires_at < now()`.

2. `public.nominations` additions (nullable):
   - `source_draft_id uuid references nomination_drafts(id)`
   - `nomination_reference text unique` (auto: `NESA-2026-XXXXXX`)
   - `email_verification_status text default 'pending'`

3. Security-definer RPCs (bypass PostgREST guessing):
   - `create_nomination_draft(payload jsonb) → draft_token`
   - `update_nomination_draft(token, payload jsonb)`
   - `get_nomination_draft(token) → jsonb`
   - `convert_draft_to_nomination(token, user_id) → nomination_reference` — enforces StageGate + one-time conversion + audit event.

4. Audit: extend `audit_events` writes for `draft_created`, `draft_updated`, `draft_converted`, `account_prompt_shown`, `existing_account_detected`, `nomination_submitted`.

5. Keep existing `enforce_nominations_stage_gate` trigger — the RPC runs as invoker of `service_role` bypass only when StageGate is open.

## Phase 2 — Shared frontend primitives

New reusable modules under `src/features/nominate/`:

- `useNominationDraft.ts` — hook that (a) mints/loads `draft_token` from `localStorage` key `nesa.draft.<formType>`, (b) debounced autosave to `nomination_drafts` via RPC, (c) hydrates initial values, (d) exposes `submit()` that routes through the gate.
- `AccountAtSubmitDialog.tsx` — compact inline dialog (bottom sheet on mobile) with:
  - Email → probe existing account (RPC `check_email_exists`).
  - Branch A (new): full name, password, country, consent, optional phone → `signUp` with `emailRedirectTo: window.location.origin/nominee/verify`.
  - Branch B (existing): password OR magic link OR reset.
  - Google OAuth button (already configured). No forced social.
  - On success → call `convert_draft_to_nomination` → route to success screen. Draft stays intact on any failure.
- `NominationSuccessScreen.tsx` — reference, verify-email banner (non-blocking), CTA to dashboard + "Nominate another".
- `DraftBanner.tsx` — "No account required to begin. Draft auto-saves." + restore/discard controls.

## Phase 3 — Wire into existing forms

Refactor the shared form container(s) to use the hook + gate. Concrete touchpoints:

- `src/components/awards/NativeCategoryNominationForm.tsx` — replace inline auth guard with `useNominationDraft`; swap submit path.
- `src/components/nominate/NominateGate.tsx` — remove pre-form auth wall; keep StageGate only. Add "takes ~2 minutes · no account required to begin" strip.
- `InfluencerNominationForm.tsx`, `NomineeEntryForm.tsx` (Icon), platinum form configs in `src/config/nomination/platinumForms.ts`, rebuild school nomination form, chapter recommendation form → all consume the same hook + `AccountAtSubmitDialog`.
- Remove/adjust any route-level auth redirects on `/nominate/*` and `/awards/:tier/nominate` so anonymous users land directly on the form.

## Phase 4 — Nominator dashboard

Extend `NomineeDashboard` / add `NominatorDashboard` page at `/nominator` showing: reference, nominee, pathway, submitted_at, status, clarification requests, acceptance status. Gate sensitive actions behind `email_verification_status = 'verified'`; nomination itself is always visible.

## Phase 5 — Analytics + copy sweep

- Fire events listed in the brief through existing `analytics.ts` (`track()`), namespaced `nomination_*`.
- Global copy sweep: "Register to Nominate" / "Sign Up Before Nominating" / "Create Account to Continue" → "Submit Nomination".
- Add pre-form strip and post-form disclosure copy per brief.

## Phase 6 — QA

- Playwright specs under `tests/e2e/nominate-first/`:
  - anonymous complete + new account submission
  - anonymous complete + existing account sign-in
  - draft survives reload / navigation / auth popup close
  - StageGate closed → submit blocked with clear message, draft preserved
  - mobile viewport bottom-sheet flow
  - duplicate email → "Welcome Back" branch
- Manual smoke on Icon, Platinum, Influencer, School, Chapter forms.

## Rollout order

1. Migration + RPCs (Phase 1) — requires user approval.
2. Shared primitives (Phase 2).
3. Wire Icon + Native forms first, verify, then fan out to remaining forms (Phase 3).
4. Dashboard, analytics, copy, tests (Phases 4-6).

I'll pause after each phase for a quick check before proceeding.

## Technical notes

- Drafts are anonymous-writable; the `draft_token` is the capability. Store it only in `localStorage` + returned to the caller — never expose via a list endpoint.
- Password sign-up keeps Supabase's default confirm-email flow but we do NOT gate submission on confirmation; the RPC accepts `user_id` from the freshly established session.
- Google OAuth `redirect_uri` stays `window.location.origin`; after callback we detect a pending draft token in `localStorage` and auto-run conversion.
- Expiry cleanup uses a Supabase cron (`pg_cron`) if enabled, otherwise a scheduled edge function.
