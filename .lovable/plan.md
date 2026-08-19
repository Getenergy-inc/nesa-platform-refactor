# Recruitment Tracker — investigation findings

## 1. How admin pages are gated

Two layers exist; admin pages currently use the in-page layer.

- `src/components/ProtectedRoute.tsx` — generic guard: redirects to `/login` when signed out, `/unauthorized` when `requiredRoles` don't match. It accepts `requiredRoles?: AppRole[]`.
- Admin pages such as `src/pages/admin/AdminContributorsCMS.tsx` do the check inside the component instead:
  ```tsx
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;
  ```
- Role source: `AuthContext` loads rows from the `user_roles` table into `roles: AppRole[]`; `hasRole(role)` checks membership. Roles are `user | nrc | jury | chapter | sponsor | admin` (`src/config/roles.ts`). No email allowlist, no JWT claim.
- Server side, the `has_role(auth.uid(), 'admin')` security-definer function is the authority — the client check is UX only.

## 2. Route/file pattern

- Files live in `src/pages/admin/<AdminXxx>.tsx`, exported through `src/pages/admin/index.ts`.
- Registered in `src/App.tsx` in the "Admin Routes" block (~line 2227) as flat `/admin/...` routes, outside the public layout. Chrome is either `DashboardLayout` (contributors/volunteers CMS) or `<AdminBareShell>` wrapping the page (gallery, nominee media, youtube pipeline).
- So a new page would be `src/pages/admin/AdminRecruitmentTracker.tsx` + `<Route path="/admin/recruitment" .../>`.

## 3. Existing recruitment-ish data

There is no generic `applicants`, `vacancies`, or `recruitment` table. What exists:

- `judge_applications` (24 cols) — judge-specific intake, public INSERT + admin ALL.
- `volunteers` (29 cols) — volunteer profiles with `verification_status` (pending/approved/rejected) and `visibility_status`; doubles as a light applicant store, plus `volunteer_tasks`, `volunteer_referrals`, `volunteer_teams`.
- `partnership_leads`, `bulk_order_leads` — lead-capture tables with the same public-insert / admin-manage shape.
- Vacancies themselves are **static code**, not data: `src/data/volunteerVacancies2026.ts` (`VOLUNTEER_VACANCIES_2026`, slot arrays derived from the 2026 timeline). Nothing writes applications against those slots today.

Conclusion: a recruitment tracker needs a new table (e.g. `recruitment_applications`, optionally `recruitment_vacancies` if vacancies must become data-driven). Extending `volunteers` would mix approved public profiles with private applicant pipeline data and fight its existing public-read policy.

## 4. RLS pattern to follow for an admin-only table

Consistent pattern across `partnership_leads`, `bulk_order_leads`, `judge_applications`, `import_review_queue`:

```sql
CREATE TABLE public.<t> (...);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.<t> TO authenticated;
GRANT ALL ON public.<t> TO service_role;
-- no anon SELECT grant
ALTER TABLE public.<t> ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage <t>" ON public.<t> FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
```

Add a public `INSERT`-only policy (`WITH CHECK (true)`, granted to `anon`) **only** if the public application form writes directly; otherwise keep it fully admin-scoped. Never a public `SELECT` policy — that is what currently keeps leads private.

## Open questions before schema design

1. Should vacancies stay static in `src/data/volunteerVacancies2026.ts` (tracker just references a `vacancy_slug`), or become a DB table so admins can create roles?
2. Does the tracker only record candidates admins enter/import, or does a public "apply" form insert into it (which decides the anon INSERT policy)?
3. Should it aggregate existing pipelines (`judge_applications`, pending `volunteers`) into one view, or track only its own new records?
