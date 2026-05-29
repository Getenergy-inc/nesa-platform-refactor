# NESA-Africa Judge Ecosystem — Build Plan

Mirrors the existing Volunteer profile/dashboard pattern. Charcoal/Gold branding, mobile-first, RLS-secured.

## Phase 1 — Database Foundation (one migration)

New tables in `public`. All follow the project's GRANT + RLS pattern.

- **`judges`** — public-facing profile data
  - `id`, `user_id` (FK `auth.users`, nullable until linked), `slug` (unique), `full_name`, `email` (private), `phone` (private), `photo_url`
  - `country_residence`, `country_origin`, `region`
  - `professional_title`, `organization`, `bio`
  - `expertise_areas text[]`, `languages text[]`, `social_links jsonb`
  - `verification_status` (`unverified` / `verified` / `featured`)
  - `judge_status` enum (`applied`, `under_review`, `approved`, `rejected`, `active`, `inactive`, `suspended`, `alumni`)
  - `profile_visibility` (`public` / `unlisted` / `private`)
  - `public_contribution_statement`, `contribution_score int`
  - `created_at`, `updated_at`

- **`judge_applications`** — application submissions
  - `judge_id` (FK), `application_status`, `reason_for_applying`, `preferred_categories text[]`, `documents jsonb`
  - `confidentiality_accepted bool`, `conflict_policy_accepted bool`, `profile_display_consent bool`
  - `submitted_at`, `reviewed_at`, `reviewed_by`

- **`judge_assignments`** — categories/nominees assigned to a judge
  - `judge_id`, `category_id`, `subcategory_id`, `nominee_id`, `assigned_by`, `due_date`, `status` enum (`not_started`, `in_progress`, `submitted`, `returned_for_revision`, `finalized`)

- **`judge_reviews`** — scoring + comments (PRIVATE)
  - `judge_id`, `nominee_id`, `category_id`, `score numeric`, `comments text`, `evidence_review jsonb`, `recommendation`, `status`, `submitted_at`

- **`judge_conflicts`** — COI declarations (PRIVATE)
  - `judge_id`, `nominee_id`, `conflict_type`, `description`, `status`, `declared_at`

- **`judge_activity_logs`** — audit trail
  - `judge_id`, `action`, `metadata jsonb`, `created_at`

**RBAC** — extend `app_role` enum with `'judge'` if not present (reuse existing `has_role()`). Add admin-only check via existing `has_role(uid, 'admin')`.

**RLS summary:**
- `judges`: anon + auth can `SELECT` where `profile_visibility='public' AND judge_status IN ('approved','active','alumni')`; judges can `UPDATE` their own row; admins full access. `email`/`phone` exposed only via auth + ownership/admin (handled by a `judges_public` view with `security_invoker=true` that masks PII).
- `judge_applications`, `judge_reviews`, `judge_conflicts`, `judge_assignments`, `judge_activity_logs`: judges read only their own rows; admins full; `anon` no access.

**Storage:** reuse `contributor-photos` bucket for judge photos (already public).

**Triggers:**
- `judge_before_insert` → auto-generate slug from `full_name` (reuse `slugify()` pattern from volunteers).
- `handle_updated_at` on all tables.

## Phase 2 — Navigation Changes

`src/config/navigation.ts`:
- **About dropdown**: replace existing single "Meet Our Judges" with two items:
  - `Meet the Judges` → `/judges`
  - `Governance & Jury Process` → `/about/governance`
- **Engage dropdown**: rename existing "Meet Our Judges" entry → `Apply to be a Judge` → `/apply/judge`. Keep all other Engage items.

## Phase 3 — Public Pages

- **`/judges`** (`src/pages/judges/JudgesDirectory.tsx`)
  - Hero with the three CTAs (Apply, Governance, Categories) — black/gold
  - Filter bar (country, region, expertise, category, status, language) — mobile collapses to bottom-sheet
  - Grid of `JudgeCard` (photo, name, country flag, title, org, expertise chips, verification badge, social icons, View Profile)
  - Governance note panel at bottom
  - Welcome / hashtags block
  - SEO: `LocalizedSEO`, JSON-LD `Person` list

- **`/judges/:slug`** (`src/pages/judges/JudgeProfile.tsx`)
  - Hero: photo, name, title, org, country residence/origin, verification badge
  - Tabs / stacked sections: Biography, Expertise, Assigned Categories, Public Contribution Statement, COI Transparency Note, Social Links, Share
  - Replaces existing single `Judges.tsx` page (which becomes a redirect)

- **`/apply/judge`** (`src/pages/judges/JudgeApply.tsx`)
  - Multi-step form (4 steps) using existing nomination form patterns
  - Zod validation, draft autosave via `localStorage`, file upload via `nomination-evidence` bucket
  - On submit: insert into `judges` (status=`applied`, visibility=`private`) + `judge_applications`. Sign-in gated.

## Phase 4 — Private Judge Dashboard

Under `src/pages/judge/` with `RequireAuth` + `RequireRole('judge')`.

- **`/judge/dashboard`** — overview cards (assigned count, reviews pending/done, COI status, calendar snippet, notifications)
- **`/judge/profile`** — edit name, bio, photo, expertise, social links, visibility toggle
- **`/judge/assigned-categories`** — list of categories/subcategories assigned with progress
- **`/judge/reviews`** — table of nominees to review + per-nominee scoring drawer (score 0-20 per rubric pillar, comments, evidence checklist, recommendation, submit)
- **`/judge/conflict-declaration`** — declare COI against a nominee/category with type + description
- **`/judge/settings`** — notification prefs, language, account

Use existing `dashboard-navigation.ts` pattern. Add `JUDGE_DASHBOARD_NAV` to `src/config/navigation.ts`.

## Phase 5 — Data Layer

- **`src/lib/api/judges.api.ts`** — typed wrappers around `supabase` calls:
  - `listPublicJudges(filters)`, `getJudgeBySlug(slug)`, `submitApplication(payload)`
  - `getMyJudgeProfile()`, `updateMyJudgeProfile(payload)`
  - `listMyAssignments()`, `getReviewForNominee(id)`, `submitReview(payload)`
  - `declareConflict(payload)`, `listMyConflicts()`
- **`src/hooks/useJudges.ts`** — TanStack Query hooks
- Reuse existing `useAuth()` for role gating

## Phase 6 — Admin Tooling

Add to existing admin area (`src/pages/admin/`):
- `JudgeApplicationsReview` — list pending applications, approve/reject with reason → sets `judge_status` + `verification_status`, sends notification
- `JudgeAssignments` — bulk assign categories/nominees to approved judges
- `JudgeDirectory` admin view — toggle visibility, suspend, verify, mark featured

## Phase 7 — Analytics

`trackEvent()` calls:
- `judge_application_start`, `judge_application_step_complete`, `judge_application_submit`
- `judge_profile_view` (slug), `judge_social_link_click` (slug, platform)
- `judge_dashboard_login`, `judge_review_submit`, `judge_conflict_declared`
- `judge_assignment_progress`

## Privacy / Security Guarantees

- Public view never returns `email`, `phone`, raw scores, COI details
- A `judges_public` SQL view (security_invoker, masked PII) feeds the directory
- All review/conflict tables: anon=no access, authenticated=own rows only, admin=all
- Audit log writes via SECURITY DEFINER trigger on review submit + conflict declare

## Mobile-First Notes

- Directory: 2-column grid <sm becomes 1-column with horizontal swipe rail option
- Filters open as `Sheet` bottom-sheet on mobile
- Scoring screen: one nominee per screen, sticky submit bar, autosave
- All tap targets ≥44px, follows existing charcoal/gold tokens

---

## Execution Order in this turn

If you approve, I will execute in this order across separate turns (one DB migration is destructive-blocking, so phases gate each other):

1. **Phase 1 migration** (your approval required by Lovable Cloud before it runs)
2. **Phase 2 navbar + Phase 3 public pages** (after migration succeeds)
3. **Phase 4 private dashboard + Phase 5 data layer**
4. **Phase 6 admin + Phase 7 analytics**

Each phase is one assistant turn so you can review/test before the next ships.

## Open questions before I start

1. **Role enum**: should I add `'judge'` to the existing `app_role` enum (alongside the existing `role_code` system), or piggyback on the existing jury/NRC role you may already use? I'll grep to confirm before the migration.
2. **Existing data**: there's an existing `src/pages/Judges.tsx` and `src/hooks/useJuryData.ts` plus `jury_assignments` table referenced in `compute_blue_garnet_results`. Should the new `judges` system **replace** the existing jury system, **coexist** alongside it (jury = internal scoring panel; judges = broader public-facing reviewer pool), or **merge** (rename `jury_*` → `judge_*`)?
3. **Application gating**: Sign-in required to apply, or allow anonymous submission with email-only contact?

Once you answer #2 in particular, I'll write the migration in the next turn. #2 determines whether this is additive or a rename, which materially changes the SQL.