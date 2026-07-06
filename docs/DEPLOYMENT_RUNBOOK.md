# NESA.Africa — Deployment Runbook

All work sits on branch `preview` (14 commits, unpushed). Two things deploy
separately: **frontend** and **Supabase backend**.

## The public domain is nesa.africa (Netlify)
Acceptance emails link to `https://nesa.africa/nominee/accept/…`, so the updated
frontend must be live on **nesa.africa**. nesa.africa builds from **main** via
Netlify. → The clean path is to merge `preview → main`.

## Step 1 — Frontend (nesa.africa via Netlify + Lovable)
```sh
cd /Users/admin/Documents/GitHub/nesa-platform-refactor
git checkout main
git merge preview
git push origin main          # Netlify rebuilds nesa.africa; Lovable syncs
```
(Optional parallel preview on Vercel: `npx vercel --prod` — separate *.vercel.app URL.)

## Step 2 — Supabase backend (via Lovable — CLI is 403)
In Lovable, ask the agent to:
> Apply the pending Supabase migrations `20260706120000_open_nominations_2026`
> and `20260706130000_fix_nominations_nominator_ref`, and redeploy the
> `nominations-submit`, `send-notifications`, `nominations` and `migration-emails`
> edge functions.

## Step 3 — Secrets (Supabase → Edge Functions → Secrets, or via Lovable)
| Secret | Value | Required |
|---|---|---|
| `RESEND_API_KEY` | `re_…` (your Resend key) | ✅ yes (else emails stay queued) |
| `RESEND_FROM` | `NESA-Africa <nominations@nesa.africa>` | optional (this is the default) |
| `PUBLIC_SITE_URL` | `https://nesa.africa` | optional (this is the default) |

## Step 4 — End-to-end test
1. Open an Icon link: `https://nesa.africa/nominate/official/africa-education-icon/icon-philanthropy?class=diaspora`
2. Submit a nomination with **your own email** as the nominee email.
3. Check: nomination row appears in Supabase (`nominations` table).
4. Trigger the email dispatcher (call `send-notifications`) → you receive the
   acceptance email from `nominations@nesa.africa` with a `nesa.africa/nominee/accept/…` link.
5. Click Accept → the acceptance flow completes.
6. (After NRC publishes) the nominee shows a public profile at `/nominees/<slug>`.

## Step 5 — Validate the aligned dashboards (needs a role account)
Log in with an `nrc` account → `/dashboard/volunteer` (NRC modules).
Log in with a `jury` account → `/dashboard/judge` (Judges Arena modules).
`/nrc` and `/judges-arena` should redirect to these.

## Notes
- Nominations stage: migration `20260706120000` opens it for the 2026 season.
- If emails must reach arbitrary nominees, the Resend domain nesa.africa is
  already verified — no extra DNS work.
