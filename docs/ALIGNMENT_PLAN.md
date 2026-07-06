# NESA.Africa — Alignment with the 152-Page Master Register

Reconcile the live codebase (353 routes, Lovable sprawl) with the CVO's
canonical 152-page register. Staged from safe → structural.

## Global rules (register)
- Terminology: **Gold-Blue Garnet** (never "Gold & Blue Garnet" etc.); **Nominate & Earn AGC Voting Coin** (never "Vote & Earn AGC"). ✅ enforced by `banned-strings.test.ts` (green).
- **Integrity Notice** on every public page.
- Public nav limited to 9 items; do NOT expose admin/nrc/judges/wallet/voting routes in public nav.
- NRC lives inside `/dashboard/volunteer`; Judges Arena inside `/dashboard/judge`. NRC admin in `/admin/nominations`; judging admin in `/admin/voting|reports|audit`.

## Stages

### Stage A — Public navigation & integrity  ✅ SAFE / NOW
- Top nav = Home, About, Awards, Participate, Sponsors & Partners, Impact Programs, Media & Events, Join the Movement, Contact.
- Primary CTA "Nominate Now"; secondary "Explore Nominees".
- Integrity Notice present on public pages.

### Stage B — Route consolidation (additive redirects)  ⚠️ MEDIUM / NOW (safe subset)
- Add canonical routes that the register expects but that live under a different path today, as redirects/aliases (no deletion):
  - `/dashboard/nominee|judge|volunteer` → existing dashboards
  - `/gala/tickets`, `/awards/influencer`, `/judges/apply`, `/admin/nominations`
- Collapse obvious duplicate award clusters (`/awards/gold`, `/awards/gold-blue-garnet`, `/awards/blue-garnet`, …) to ONE canonical + redirects. (Needs canonical choice — default to the register's path.)

### Stage C — NRC → /dashboard/volunteer  🔴 LARGE / NEEDS DEPLOY + DECISION
- Build Volunteer Dashboard with NRC tabs (Overview, NRC Research Tasks, Submit Research, Evidence Upload, Duplicate Flags, Reviewer Feedback, My NRC Reports, Training). Redirect `/nrc/*` there.
- This REORIENTS the old "Phase 5" (which finished separate NRC routes).

### Stage D — Judges Arena → /dashboard/judge  🔴 LARGE / NEEDS DEPLOY + DECISION
- Judge Dashboard tabs (Overview, Assigned Categories, Shortlisted, Evidence Review, Scorecard, COI, Submitted Scores, Guidelines). Redirect `/judges-arena` there.

### Stage E — Admin consolidation  🔴 LARGE / NEEDS DEPLOY
- NRC review under `/admin/nominations`; judging under `/admin/voting|reports|audit`.

## Constraints
- Backend (Supabase functions/migrations) can only be deployed via Lovable (owner = Lovable Cloud); local CLI is 403.
- C/D/E touch role-gated dashboards → validate after deploy.
- Stages A/B are frontend routing/copy → verifiable locally, live on next Vercel deploy.
