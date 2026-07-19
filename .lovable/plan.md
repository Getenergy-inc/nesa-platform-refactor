
# 2026 Africa Education Icon Judges Arena — Implementation Plan

The existing project already has a strong foundation: `icon_judges`, `icon_judge_assignments`, `icon_judge_reviews`, `icon_judge_scores`, `icon_judge_conflicts`, `icon_jury_deliberations`, `icon_jury_moderation_actions`, `icon_jury_result_snapshots`, `icon_jury_audit_logs`, plus `IconJudgeGate`, `IconJuryLayout`, and pages under `src/pages/iconJury/`. This plan extends that spine rather than duplicating it, and adds the missing 27-judge panel matrix, ranked-choice grand jury, governance dashboard, and public `/judges` arena.

## 1. Award calendar — single source of truth

Create `src/config/iconAward/calendar.ts`:
- `SCREENING_OPEN` = 2026-09-14
- `SCREENING_CLOSE` = 2026-09-30
- `GRAND_JURY_OPEN` = 2026-10-01
- `GRAND_JURY_CLOSE` = 2026-10-07
- `GOVERNANCE_REVIEW` = 2026-10-08 → 2026-10-15
- `GALA` = 2026-10-22
- Helper `getCurrentIconPhase()` used by ribbon, dashboards, gates.

Also mirror in a DB row in `platform_config` for server-side gates.

## 2. Database — 4 focused migrations

Extend existing schema (do **not** rename existing tables). Add:

**a. Panels & panel membership**
- `icon_judge_panels` (pathway_id, classification_id, chair_judge_id, secretary_judge_id, unique on pathway+classification)
- `icon_judge_panel_members` (panel_id, judge_id, role: judge/chair/secretary/nrc_rep/governance_observer)

**b. Screening shortlist / finalists**
- `icon_panel_shortlists` (panel_id, finalist_1, finalist_2, finalist_3, reserve, justification, chair_signed_at, secretary_signed_at, submitted_at, status)
- `icon_grand_jury_groups` (id, pathway_id, classification_id, panel_id) — 9 rows
- `icon_grand_jury_finalists` (group_id, nominee_id, rank_seed)

**c. Ranked-choice ballots**
- `icon_grand_jury_ballots` (group_id, judge_id, first_choice, second_choice, third_choice, submitted_at, locked_at, receipt_hash, ip, user_agent) — unique (group_id, judge_id), CHECK three distinct nominees
- `icon_grand_jury_results` (group_id, nominee_id, first_choice_votes, points, avg_rank, laureate boolean, computed_at)
- `icon_governance_reviews` (group_id, decision: approve/hold/reopen, notes, decided_by, decided_at)

**d. RLS + RPCs**
- Judges: read own panel + assigned nominees only; read own ballots.
- Moderators/governance: read all; only governance can approve/reopen.
- RPCs: `submit_icon_ballot(group_id, first, second, third)` — validates phase window, distinct rankings, one ballot per judge, writes audit log; `compute_icon_grand_jury_results(group_id)`; `submit_icon_shortlist(panel_id, ...)`; `governance_decide(group_id, decision, notes)`.
- All writes append to existing `icon_jury_audit_logs`.

Grants follow the standard pattern (`authenticated`, `service_role`; no `anon`).

## 3. Public landing page — `/judges`

New `src/pages/judges/JudgesArenaLanding.tsx` (public, indexable):
- `ArenaHero` with executive imagery (deep midnight blue + Blue-Garnet accents)
- Live stat strip pulled from Supabase (`27 / 3 / 9 / 27 / 9 / 500+`)
- Workflow timeline component (Nomination → … → Laureates)
- "About the Judges Arena" sections
- Primary CTA → `/judges/sign-in`, secondary anchor to workflow
- SEO: title/description exactly as specified; canonical `/judges`

Route registered in `src/App.tsx`. All `/judges/*` authenticated routes get `<meta name="robots" content="noindex,nofollow">` via Helmet inside `IconJuryLayout`, and are excluded from `scripts/generate-sitemap.ts`.

## 4. Rename/mount authenticated routes under `/judges`

Alias existing `/icon-jury/*` under `/judges/*` (keep old routes as redirects to avoid breaking bookmarks). Add missing pages:
- `/judges/dashboard` — reuse `DashboardSummaryStrip`, add `AwardPhaseRibbon`, summary cards, quick actions.
- `/judges/my-panel` — new page reading `icon_judge_panels` + members.
- `/judges/assignments`, `/judges/nominees`, `/judges/nominee/:id` — extend existing NomineeReview with 3-column layout, evidence viewer tabs, 8-criterion scoring panel (already in `src/config/iconAward/scoring.ts`).
- `/judges/deliberations`, `/judges/deliberations/:roomId` — extend existing `icon_jury_deliberations` UI with tabs (Discussion, Shortlist, Compare, Evidence, Clarifications, Minutes, Final Report). Gate entry until judge's own scores are locked.
- `/judges/voting`, `/judges/voting/:groupId` — new grand jury arena with 9 group cards and ranked-choice ballot component + confirmation dialog + receipt.
- `/judges/compare` — side-by-side finalist comparison matrix.
- `/judges/results`, `/judges/messages`, `/judges/calendar`, `/judges/notifications`, `/judges/profile`, `/judges/help` — new pages, mostly thin wrappers over existing tables.

Admin/NRC:
- `/admin/judge-panels`, `/admin/judge-assignments`, `/admin/finalists`, `/admin/grand-jury`, `/admin/governance-review`, `/admin/judge-audit` (audit reuses existing `AdminAuditTrail`).

## 5. Reusable components

Under `src/features/iconJudges/arena/`:
`ArenaHero`, `AwardPhaseRibbon`, `PanelCard`, `NomineeAssignmentCard`, `EvidenceViewer`, `ScoringPanel` (wraps the 8-criterion config), `ConflictModal`, `ComparisonMatrix`, `DeliberationRoom`, `ShortlistSelector`, `GrandJuryGroupCard`, `FinalistCard`, `RankedChoiceBallot`, `BallotConfirmation`, `ResultsMatrix`, `GovernanceChecklist`, `NotificationCentre`, `CalendarPanel`. Consistent midnight-blue / Blue-Garnet / restrained-gold theming (via tokens in `index.css`).

## 6. Access control & gating

- Reuse `IconJudgeGate` (auth + `ICON_JUDGE` role + valid OTP).
- Add phase gate: ballot RPC and shortlist RPC reject writes outside their window unless caller is `ICON_GOVERNANCE`.
- Panel-scoped visibility: judges can only list assignments where their `judge_id` belongs to the assignment's panel.
- Screening judges revealed publicly on finalist group header, but their individual scores/preferences never leave `icon_judge_scores` (already RLS-scoped to owning judge + moderator).

## 7. Governance & audit

- `/admin/governance-review` shows checklist per group: panel completion, conflicts resolved, all 27 ballots in, invalid ballots, tie status, computed results.
- Approve / Hold / Reopen actions logged via `icon_jury_audit_logs` (new action codes: `shortlist_submitted`, `ballot_submitted`, `ballot_locked`, `results_computed`, `governance_approved`, `governance_hold`, `governance_reopened`).
- Audit trail already implemented — extend action enum in `IconJuryAuditTrail.tsx` filter list.

## 8. Out of scope (explicitly excluded)

Blue Garnet / Platinum / Influencer surfaces, public voting, endorsements, donations, sponsorship, gala ticketing. None of those are touched.

## 9. Delivery order

1. Migration (calendar table + panels + ballots + RLS + RPCs).
2. Config + calendar module + phase helper.
3. Public `/judges` landing + SEO + sitemap exclusion.
4. Route aliasing under `/judges/*` + `IconJuryLayout` header/ribbon updates.
5. Panels + assignments + review workspace enhancements.
6. Deliberation rooms + shortlist submission.
7. Grand Jury voting arena + ranked-choice ballot + results computation.
8. Governance review dashboard.
9. Notifications, calendar, profile, help pages.
10. Mobile polish (bottom nav for /judges), a11y pass, noindex verification.

## Technical notes

- Icon jury schema, roles (`ICON_JUDGE`, `ICON_MODERATOR`, `ICON_GOVERNANCE`), and OTP already exist — no auth refactor needed.
- Ballot uniqueness enforced by DB (`UNIQUE (group_id, judge_id)`) + RPC checks distinct rankings and phase window.
- Tie-break chain implemented in `compute_icon_grand_jury_results` following the specified order, falling back to a `tie_case` row for governance if unresolved.
- All timestamps read from `src/config/iconAward/calendar.ts` on the client and from `platform_config` on the server so dates change in one place.
- AI evidence summaries (if enabled later) will be rendered read-only with the mandated disclaimer; not part of this build.

Estimated: ~1 migration batch, ~35 new files, ~10 edits to existing icon-jury pages/layout.
