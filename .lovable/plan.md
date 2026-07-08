
## Goal
Every nominee must accept their nomination via a tokenized magic link. Acceptance provisions their public profile page and private dashboard. From the dashboard they get a shareable referral URL. The public profile shows a live renomination/endorsement counter driven by that link.

## Flow

```text
Nomination approved ──► acceptance email sent
        │                   │
        │                   ▼
        │           /accept/:token  (magic-link sign-in)
        │                   │
        │                   ▼
        │           Accept ─► profile activated + dashboard unlocked + referral_code minted
        │                   │
        ▼                   ▼
Public /nominees/:slug   /nominee/dashboard
   │  counter: N        │  share URL: /nominees/:slug?ref=CODE
   │  [Renominate] ─────┴────────► POST /renominations (ref=CODE) ─► counter++, event logged
```

## Deliverables

### 1. Database (migration)
- `nominee_acceptance_tokens` — `id, nominee_id, token (unique), email, expires_at, consumed_at, magic_link_user_id`. RLS: service_role only; public reads via token lookup RPC.
- Add columns on `public.nominees`: `accepted_at timestamptz`, `profile_activated bool default false`, `referral_code text unique`, `endorsement_count int default 0`.
- RPC `accept_nomination(p_token text)` — validates token, sets `accepted_at`, `profile_activated=true`, mints `referral_code` (`N-XXXXXX`), returns nominee slug + referral code.
- RPC `record_renomination_via_referral(p_ref text, p_message text)` — resolves nominee by code, inserts into `renominations`, increments `endorsement_count`, logs to `referral_events`. Rate-limited by device_hash (reuse existing pattern).
- GRANTs per project rules.

### 2. Edge functions
- `send-acceptance-email` — mints token, enqueues app email via `send-transactional-email` with new `nominee-acceptance` React Email template. Idempotent by `nominee_id + email`.
- `backfill-acceptance-emails` (admin only) — batches all `nominees` where `accepted_at IS NULL`, calls `send-acceptance-email` per row.
- App email template `nominee-acceptance.tsx` with CTA to `${SITE_URL}/accept/{token}`.

### 3. Auth
Magic-link sign-in bound to the acceptance email. On `/accept/:token`, if unauthenticated, call `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: /accept/:token }})`; once session hydrated, call the accept RPC.

### 4. Frontend
- `src/pages/nominee/AcceptNomination.tsx` (route `/accept/:token`) — three states: verifying, needs-signin (send magic link), accepted (redirect to `/nominee/dashboard`).
- Extend `NomineeDashboard` with `NomineeReferralCard` (share URL `/nominees/:slug?ref=CODE`, copy/twitter/whatsapp) and live counter subscribed to `nominees.endorsement_count` via Supabase Realtime.
- Public `Nominees/:slug` page: reads `?ref=CODE` from URL, passes to `RenominateModal`; on success calls the referral RPC.
- Update `NomineeStatsGrid` to source `endorsementCount` from the row.
- Admin button on `/admin/nominees` → "Backfill acceptance emails" invoking the edge function.

### 5. Email infrastructure
Uses existing Lovable app-email queue. If email domain isn't configured yet, I'll trigger the setup dialog first.

## Technical notes
- No changes to `auth.users` FK patterns — magic-link users are matched to nominees via the email on the token, not a nominee→user FK.
- Referral code format `N-XXXXXX` reuses `generate_referral_code('N')`.
- Counter uses one authoritative column (`nominees.endorsement_count`) updated inside the RPC — no client-side count queries.
- All new writes go through SECURITY DEFINER RPCs; no anon INSERT policies added.

## Out of scope (this iteration)
- Certificate auto-unlock at 200 (already handled by existing `auto_unlock_certificates` trigger — will just start firing once counter grows).
- Vote fraud detection tuning for referral spam (existing `detect_vote_fraud` covers device reuse).

Approve to proceed?
