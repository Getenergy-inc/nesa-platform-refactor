## Goal

Give every Influencer Education Impact nominee the same profile + acceptance + dashboard experience Icon nominees already have, add automated acceptance emails via Resend, and remove all voting language/UI from Influencer surfaces.

## What already exists (reused as-is)

- `nominees` table with `slug`, `email`, `acceptance_token`, `acceptance_token_expires_at`, `acceptance_status`, `referral_code`, `renomination_count`, `profile_status`.
- RPCs `mint_acceptance_token(nominee_id)`, `accept_nomination_by_token(token)`, `record_renomination_via_referral(...)`.
- Routes `/nominee/:slug` (public profile), `/nominee/accept/:token`, `/nominee/dashboard/:token`.
- `nominations-submit` edge function already creates a `nominees` row with `status: pending` for Influencer submissions.
- Resend secrets (`RESEND_API_KEY`, `RESEND_FROM`) already configured.

No new tables needed. No schema duplication.

## Changes

### 1. Data (small migration)

- Add `nominees.recognition_pathway TEXT` (nullable) — values `social_media` | `sports` | `music` | null. Used only for Influencer nominees; other awards leave it null.
- Backfill for existing influencer nominees by joining through `nominations → subcategories.slug`:
  - `africa-social-media-*` → `social_media`
  - `africa-sports-*` → `sports`
  - `africa-music-*` → `music`
- Update `nominations-submit` to set `recognition_pathway` when the incoming payload has one (Influencer form already sends `pathway`).

### 2. Public profile — pathway awareness

- `/nominee/:slug`: when `recognition_pathway` is set, show a "Recognition Pathway" chip (Social Media / Sports / Music Education Champion) and swap the CTA row to hide any "Vote" button; render the standard no-voting note.
- Related-nominees block: when pathway is set, filter suggestions to same pathway first, then region.

### 3. Acceptance page — Influencer copy variant

- `NomineeAccept.tsx`: detect Influencer nominee (pathway present OR primary subcategory in the Influencer set) and swap the heading/body copy to the spec ("You Have Been Nominated … Influencer Education Impact Award 2026 …"), keep the same secure token + auto-accept + magic-link flow.

### 4. Dashboard — six sections + `/dashboard/nominee/:nomineeId` alias

- Keep the existing token-authenticated `/nominee/dashboard/:token` as the canonical dashboard.
- Add alias route `/dashboard/nominee/:nomineeId` that resolves to the same page when the signed-in user's email matches the nominee.
- Restructure `NomineeDashboard` into the 6 tabs from the spec: Overview, My Profile, Education Impact, Evidence & Media, Recognition Status, Messages & Support (Messages tab shows a placeholder if no thread system yet).
- Recognition Status timeline shows: Nomination Received → NRC Preliminary Review → Acceptance Confirmed → Profile Completed → Evidence Verified → Governance Review → Approved → Published. No voting or judging steps.
- Profile Completion % = weighted count of filled fields (photo, bio, impact summary, ≥1 evidence link, media consent).

### 5. No-voting enforcement (Influencer pages only)

- `/awards/influencer-education-impact`, `/awards/influencer-education-impact/nominees`, `/nominee/:slug` when pathway is Influencer: hide any vote CTAs, vote counts, and add a standard disclosure block:
  > There is no public voting for the Influencer Education Impact Award. Recognition is based on verified education impact, NRC review and governance approval.
- Grep for `Vote Now`/`vote_count`/vote-related components on these routes and gate them behind `recognition_pathway == null`.

### 6. Acceptance emails via Resend

- New edge function `send-nominee-acceptance` (verify_jwt via caller's session; admin role required) that:
  1. Calls `mint_acceptance_token(nominee_id)` server-side.
  2. Sends a branded HTML email via Resend from `RESEND_FROM` to the nominee, with the acceptance URL `${SITE_URL}/nominee/accept/${token}`.
  3. Updates `nominees` acceptance_status to `SENT`.
- New admin action button in the existing NRC/admin nominee row: "Send acceptance invitation" — calls the function. Also expose a bulk action for approved Influencer nominees.
- Post-acceptance confirmation email + profile-published email are wired to the same function with a `templateName` parameter (`invitation` | `confirmation` | `published`). Trigger `confirmation` from inside `accept_nomination_by_token` flow (called from `NomineeAccept` after success) and `published` when `profile_status` flips to `published`.

## Technical notes

- One migration: add column + backfill + index on `recognition_pathway`. GRANTs already exist on `nominees`.
- Edge function uses Resend REST API directly (no SDK) with `RESEND_API_KEY` + `RESEND_FROM`.
- All acceptance URLs use `Deno.env.get('SITE_URL') ?? 'https://nesa.africa'`.
- No dashboard-side voting UI to remove (already absent); enforcement is on public/award pages.
- Analytics: emit `influencer_acceptance_email_sent`, `influencer_acceptance_email_opened` (via existing `trackEvent`).

## Out of scope (deferred)

- Full messaging thread system inside dashboard — stub UI with support email link for now.
- Automated reminder emails (day 3 / day 7) — hook exists but cron not scheduled here.
- Governance approval workflow beyond `profile_status` flip.
