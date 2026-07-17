
# Africa Education Icon Judges Portal — Implementation Plan

A dedicated, authenticated jury system for the **Africa Education Icon Award 2006–2026** only. Separate from public site, NRC portal, nominee dashboard, and all other award tiers.

## Scope

- 27 judges → 500+ nominees → 3 pathways × 3 classifications = **9 laureates**
- Applies **only** to the Africa Education Icon Award. No Blue Garnet, Platinum, Influencer, public voting, endorsements, donations, or Gala ticketing.

## 1. Database (single migration)

New tables under `public.` (all with GRANTs + RLS + policies):

```
icon_judges                 — judge roster (user_id, status, expertise, region, active)
icon_judge_profiles         — bio, photo, affiliations, availability
icon_judge_invitations      — invitation-only access tokens
icon_judge_onboarding       — 7-step checklist status
icon_pathways               — 3 seeded rows
icon_classifications        — 3 seeded rows
icon_judge_assignments      — judge_id × nominee_id × pathway × classification × deadline × status
icon_judge_conflicts        — declared conflicts + recusal action
icon_judge_reviews          — one per assignment; draft/submitted/locked; recommendation enum
icon_scoring_criteria       — 8 seeded rows (25/15/15/10/10/10/10/5 weights)
icon_judge_scores           — per-criterion score + justification + evidence ref
icon_judge_notes            — confidential notes (moderation-visible only)
icon_jury_deliberations     — shared deliberation threads
icon_jury_result_snapshots  — point-in-time result computation
icon_jury_result_positions  — 9 final positions with governance status
icon_jury_moderation_actions— reassign/reopen/exclude actions
icon_jury_notifications     — in-app notification queue
icon_jury_audit_logs        — immutable, INSERT-only (revoke UPDATE/DELETE)
```

RLS pattern: `has_icon_judge_role(uid)` and `has_icon_moderator_role(uid)` security-definer functions using existing `user_roles` (add role codes `ICON_JUDGE`, `ICON_MODERATOR`, `ICON_GOVERNANCE`). Judges see only own assignments/scores/notes; moderators see aggregated blind data; audit logs immutable via revoked privileges + trigger.

RPCs:
- `submit_icon_score(assignment_id, scores[])` — validates all criteria present, locks review, writes audit
- `declare_icon_conflict(nominee_id, type, severity)` — auto-recuses when severity=recusal
- `compute_icon_results(snapshot_label)` — aggregates avg/median/variance per pathway×classification, applies min-reviewer + NRC-verified gates, produces 9 positions with tie-break chain
- `reopen_icon_review(review_id, reason)` — moderator only, preserves original
- `approve_icon_laureate(position_id)` — governance role only

## 2. Routes (`src/App.tsx`)

Judge routes (behind `IconJudgeGate` — auth + role + 2FA + onboarding-complete):
```
/judges/sign-in        /judges/dashboard      /judges/assignments
/judges/nominees       /judges/nominee/:id    /judges/conflicts
/judges/scoring        /judges/notes          /judges/results
/judges/profile        /judges/help
```

Admin/governance routes (behind `IconModeratorGate`):
```
/admin/judges              /admin/judge-assignments   /admin/judge-moderation
/admin/judge-results       /admin/judge-audit
```

All routes namespaced under `src/pages/iconJudges/` and `src/pages/admin/iconJury/` — no coupling to existing NRC/nominee/public pages.

## 3. Components

`src/features/iconJudges/`:
- `IconJudgeGate.tsx` — auth + role + 2FA + onboarding gate (mirrors `JudgeOTPGate` pattern)
- `JudgesLayout.tsx` — dedicated shell (dark charcoal + gold, distinct from public header)
- `DashboardSummaryStrip.tsx` — 27 / 3 / 9 / 500+ live counters
- `AssignmentCard.tsx`, `AssignmentFilters.tsx`
- `NomineeReviewWorkspace.tsx` — left profile panel + right scoring panel
- `ScoringForm.tsx` — 8 criteria, per-criterion score + justification + evidence; draft/submit/lock
- `ConflictDeclarationDialog.tsx`
- `ConfidentialNotesPanel.tsx`
- `RecommendationSelect.tsx` (5 enum values)
- `ResultMatrix3x3.tsx` — the 9-position grid
- `DeliberationThread.tsx`

Admin:
- `ModerationTable.tsx` — variance flags, overdue, reopened, conflict warnings
- `ResultsAggregationView.tsx` — blind by default
- `AuditLogViewer.tsx` (read-only)

## 4. Scoring, tie-break, and result rules

Hard-coded in `src/config/iconAward/scoring.ts`:
- 100-point framework with the 8 weighted criteria
- Min 3 valid judges (admin-configurable via `platform_config`)
- Tie-break chain: Lifetime Impact → Sustainability → Evidence Quality → median → variance → jury deliberation → governance
- Result statuses: 10 enums as specified
- Public-ready result object generated separately; never auto-published

## 5. Security & audit

- Invitation-only signup (`icon_judge_invitations` token consumed)
- 2FA required for all `/judges/*` routes (reuse existing `judge_otp_sessions` pattern, new session table `icon_judge_otp_sessions`)
- Session timeout 30 min
- Rate limiting on score submission
- All mutations write to `icon_jury_audit_logs` via triggers
- Audit table: `REVOKE UPDATE, DELETE` from all roles; only `INSERT` allowed
- No judge score/note data ever sent to public analytics; server-side only

## 6. Explicit exclusions

- No public voting UI, no endorsement flows, no donation prompts, no ticketing
- No Blue Garnet / Platinum / Influencer integration
- No nominee-facing views of judge notes or scores
- No cross-pollination with `judges`, `judge_reviews`, `nrc_*` tables (Icon jury is fully isolated)

## 7. Out of scope for this build

- Sending real email/SMS/WhatsApp — notification records written to `icon_jury_notifications`; delivery workers can be wired later
- Judge onboarding video/training content — status flags exist, content is placeholder
- Public laureate announcement page — data object exposed but no public route

## Technical implementation order

1. Migration: tables + RLS + GRANTs + seed pathways/classifications/criteria + role codes + audit-immutability triggers
2. RPCs: submit_icon_score, declare_icon_conflict, compute_icon_results, reopen_icon_review, approve_icon_laureate
3. Gate components + layout + routes wired in `App.tsx`
4. Sign-in + onboarding + profile
5. Dashboard + assignments + review workspace + scoring + notes + conflicts
6. Results view (judge-scoped) + deliberation
7. Admin moderation + results aggregation + audit viewer

## Deliverable size

~35 new files, 1 migration, 5 RPCs, ~15 routes. All isolated under Icon-specific namespaces so nothing else in the platform is touched.
