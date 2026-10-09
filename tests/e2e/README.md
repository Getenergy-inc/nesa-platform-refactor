# Visual regression tests (Playwright)

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
