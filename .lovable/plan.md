
# NESA-Africa Navigation Consolidation

Goal: one information architecture, one shared config, six top-level groups, no duplicate destinations, no broken routes.

## 1. Single source of truth

Create `src/config/navigation.ts` — the only place any nav surface reads from.

Each node:
```
id, label, description?, href?, icon?, section, parent?, children?,
desktopVisible, mobileVisible, footerVisible, requiresAuth?, campaignPhase?,
featured?, external?, analyticsEvent?
```

Keep `src/config/campaignPhase.ts` (already exists) as the phase driver for CTAs and announcements. Delete/deprecate `siteNavigation.ts`, `enablersTaxonomy.ts` (fold into new config or import-only), and any ad-hoc menu arrays in components.

Top-level groups (in order): About · Awards · Education Enablers · Impact Programmes · Media & Events · Get Involved.

## 2. Dropdown/mega-menu contents

Build the six dropdowns exactly per the brief (sections 4A–4F). Enforce max 4 columns, 6–8 links each, with "View all" links to the section landing page. Long sector/region lists collapse behind directory landing pages, not columns.

## 3. Right-side actions

`Search` (opens `GlobalSearch` modal) · `Nominate Now` (always visible, primary) · phase-aware secondary CTA · `Language` · `Sign In`/Account. All labels locked:
- Primary: always "Nominate Now" → `/nominate`
- Phase secondary via `campaignPhase.ts`: nomination→"Explore Nominees", voting→"Vote & Earn AGC", gala→"Get Gala Tickets"

## 4. Components to rebuild/replace

```
src/components/navigation/
  AnnouncementBar.tsx        (rotating, ≤3, campaign-only)
  SiteHeader.tsx             (thin shell)
  DesktopNavigation.tsx      (Radix NavigationMenu, 6 items)
  MegaMenu.tsx               (shared 1–4 column renderer)
  MobileNavigation.tsx       (drawer + accordions, same IA)
  MobileBottomActions.tsx    (Explore·Nominate·Vote·Menu)
  GlobalSearch.tsx           (⌘K modal; searches enablers/nominees/etc.)
  CampaignCTA.tsx            (reads campaignPhase)
  AccountMenu.tsx            (signed-in vs signed-out)
  LanguageSelector.tsx       (wrap existing switcher)
```

Delete: `EducationEnablersMegaMenu.tsx` (folded into MegaMenu), any legacy `MainNav.tsx`.

## 5. Footer

Rewrite `src/components/PublicFooter.tsx` to four columns exactly per brief §8 (Platform, Participate, Trust & Support, Legal). No sector/region dumps.

## 6. Route audit + redirects

Script (`scripts/audit-routes.ts`) walks `src/App.tsx` and greps `<Link to=`/`navigate(` to produce a route inventory. Then add redirect `<Route>`s in `App.tsx`:

```
/recognition/*   → /awards/*
/directory       → /education-enablers
/companies       → /education-enablers
/organisations   → /education-enablers
/gala            → /events/gala-2026
/tickets         → /events/gala-tickets
/support         → /get-involved
/partner         → /get-involved/partner
/sponsor         → /sponsors  (kept as canonical alias)
/gala-tickets    → /events/gala-tickets
```
Also fold existing `/awards/*` variants once canonicals confirmed. No redirects added before the audit confirms no live-content collision.

## 7. Active-state + breadcrumbs

Central helper `getActiveSection(pathname)` used by desktop, mobile, and breadcrumb components. Only one top-level group active per route. Breadcrumb component reads from route metadata attached to each nav node.

## 8. Accessibility

All menus via Radix (`NavigationMenu`, `DropdownMenu`, `Dialog` for mobile drawer/search). `aria-expanded`, `aria-controls`, focus trap on drawer, Escape to close, focus restoration, `prefers-reduced-motion`, ≥44px tap targets, visible `focus-visible` rings, background scroll lock via Radix Dialog. Announcement bar uses `aria-live="polite"`.

## 9. Analytics

Extend `src/lib/analytics.ts` with `trackNav(event, payload)` events per brief §18. Each nav node's `analyticsEvent` fires exactly once per click (dedupe by node id + timestamp) so overlapping surfaces don't double-fire.

## 10. Tests

Playwright specs under `tests/e2e/`:
- `nav-ia-desktop.spec.ts` — six groups, single active state, no duplicate hrefs across groups
- `nav-mobile-drawer.spec.ts` — accordion parity, focus trap, Escape, scroll lock
- `nav-cta-phase.spec.ts` — CTA labels swap per phase config
- `nav-redirects.spec.ts` — every entry in redirect table resolves
- `footer-ia.spec.ts` — four columns, no sector/region dumps

Vitest: `navigation.config.test.ts` asserts (a) exactly 6 top-level groups, (b) no href appears under two different `section`s, (c) every leaf has an `analyticsEvent`.

## 11. Delivery artefacts

At the end: screenshots (desktop navbar, mobile drawer, Education Enablers mega, mobile bottom actions), the config file, removed-duplicates list, merged-groups list, redirect table, changed-components list, a11y test output.

## Execution order

1. Write `config/navigation.ts` + Vitest guard.
2. Build `MegaMenu`, `DesktopNavigation`, `MobileNavigation`, `MobileBottomActions`, `AnnouncementBar`, `AccountMenu`, `GlobalSearch` skeleton (search hooks stubbed to existing endpoints where present).
3. Wire into `SiteHeader.tsx`; delete legacy nav components.
4. Rewrite `PublicFooter.tsx`.
5. Run route audit → add redirects → update internal links flagged as non-canonical.
6. Add breadcrumbs + active-state helper.
7. Analytics wiring.
8. Tests + capture delivery screenshots.

## Confirm before I start

- Scope confirmation: this refactor will touch ~40–60 files (nav config, header/footer, ~30 internal `<Link>` fixes, App.tsx redirect block, tests). OK to proceed as one large change, or split into (a) config+desktop, (b) mobile+footer, (c) redirects+tests?
- Global search: build a functional modal now (against existing enabler/nominee tables) or ship a stub that focuses the search input and routes to `/search?q=…`?
- Bottom mobile bar: enable now, or keep hidden behind a flag until content teams sign off?
