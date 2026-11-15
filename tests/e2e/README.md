# Visual regression tests (Playwright)

## Real Support Fund persistence and access checks

`support-fund-live.test.py` submits a donation pledge and transfer report through
the running page to the real database, without mocking responses. It checks
anonymous inserts, rejected out-of-scope inserts, anonymous/member read/update
denial, and administrator read/update/read-back on both actual saved records.

```bash
SUPPORT_FUND_MEMBER_SESSION_FILE=/secure/member-session.json \
SUPPORT_FUND_ADMIN_SESSION_FILE=/secure/admin-session.json \
python3 tests/e2e/support-fund-live.test.py
```

Use authorised `lovable auth-session` JSON files; never commit sessions, print
tokens, promote users, or substitute a service-role key. The default preview is
`http://localhost:8080`; override with `SUPPORT_FUND_BASE_URL`. Missing member or
admin sessions explicitly skip their checks, not claim a full pass. Results and
a screenshot go to `/tmp/browser/support-fund-live/` by default. Runs retain two
clearly labelled synthetic records (US$1 pledge/report, no payment sent) for audit.
Admin tests only alter and restore test names, never reconcile or issue a receipt.

Catches subtle layout shifts and placeholder-fallback regressions on nominee
surfaces (`/nominees/:slug`, directory cards, landing carousel, search results).

## First-time setup

```bash
bun add -D @playwright/test
bun playwright install chromium
```

## Run

```bash
bun run test:e2e             # run against built preview on :4173
bun run test:e2e:update      # refresh baseline snapshots after intentional UI changes
```

To point at a deployed URL instead of spinning up `vite preview`:

```bash
PLAYWRIGHT_BASE_URL=https://nesaafrica.lovable.app bun run test:e2e
```

## What it asserts

For each verified-photo honouree (Kolisi, Loroupe, Kidjo):

1. `/nominees/:slug` hero renders a real `<img>` (not `placeholder.svg`) and
   the full page matches the baseline screenshot.
2. The `/nominees` directory grid matches its baseline (catches card layout
   drift and silent fallback-tile regressions).
3. The landing-page **Honourees Shaping Africa** carousel matches its
   baseline.
4. `/nominees?search=<name>` returns a card whose `<img src>` points at
   `/nominees/*` and matches the baseline.

Volatile zones (countdown, live vote counters, chat widget, iframes) are
masked so diffs only fire on real UI regressions.

Baselines live under `tests/e2e/nominee-visuals.spec.ts-snapshots/` and
should be committed. Regenerate intentionally with `--update-snapshots`.

## Public 2026 cleanup regression

`public-cleanup-regression.spec.ts` checks 14 public routes for retired Gala
ticket sales, “Vote Before Gala”, outdated category totals and the archived
Gala video. It also checks legacy ticket redirects, the two mobile actions,
and all five canonical Follow destinations.

Run it against the development server without a production build:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:8080 bunx playwright test tests/e2e/public-cleanup-regression.spec.ts --project=chromium-desktop
```
