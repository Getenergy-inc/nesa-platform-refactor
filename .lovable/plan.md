# NESA-Africa Navbar Refactor — Implementation Plan

## Goal
Replace the current 7-item nav with a 6-group ecosystem navbar that repositions NESA-Africa as a continental education platform (not "just awards"), with mega menus, campaign-phase CTAs, an announcement bar and an accessible mobile drawer — driven by one config.

## Scope (this pass)
Frontend/presentation only. Existing routes, forms, auth, voting and sponsor logic remain untouched — new links either point to existing routes or to redirect aliases.

## Deliverables

### 1. Single navigation config
`src/config/siteNavigation.ts` — rewrite as the source of truth used by desktop nav, mobile drawer and footer. Adds: `description`, `icon`, `featured`, `sections` (for mega menus), `campaignPhase`, `analyticsId`.

Top-level (desktop, logo = Home):
1. About
2. Awards
3. Education Enablers (mega menu: Explore / 8 RECs / 20 Sectors / EdTech / Actions)
4. Impact Programmes
5. Media & Events
6. Get Involved

Right cluster: Search · **Nominate Now** (primary) · **Vote & Earn AGC** (secondary, phase-driven) · Language · Sign In.

### 2. Campaign-phase CTA config
`src/config/campaignPhase.ts` — exports current phase + primary/secondary CTA labels/hrefs (nomination / voting / gala). Consumed by header + announcement bar.

### 3. Announcement bar
`src/components/navigation/AnnouncementBar.tsx` — slim rotating strip above header, ≤3 messages from config, dismissible (sessionStorage), clickable, mobile-safe. Data in `src/config/announcements.ts`.

### 4. Header rewrite
`src/components/navigation/SiteHeader.tsx` — refactor to:
- Announcement bar → main header row
- Desktop: logo, 6 nav items with Radix `NavigationMenu` dropdowns and one true mega menu for Education Enablers
- Mobile: logo · compact Nominate · hamburger → `Sheet` drawer with accordion sections in the specified order, search at top, ESC + focus-return preserved
- Optional sticky mobile bottom actions (Explore / Nominate / Vote / Menu) behind a flag, with body `pb-` offset

### 5. Mega menu component
`src/components/navigation/EducationEnablersMegaMenu.tsx` — 4-column panel: Explore · Browse by REC (8) · Browse by Sector (top 8 + "View all 20") · EdTech (4) · Actions strip. Reads from `src/config/enablersTaxonomy.ts` (new: RECs, 20 sectors, EdTech subcats).

### 6. Global search
Reuse existing `NavSearch` (Cmd+K dialog) — extend index groups to include Education Enablers, Sectors, RECs, Events. Placeholder updated to the required copy.

### 7. Route preservation & redirects
`src/App.tsx` — add `<Navigate>` aliases for new URLs that don't yet have dedicated pages, mapping to closest existing page:
- `/education-enablers/regions/:rec` → existing region hubs
- `/education-enablers/sectors[/:slug]` → prospective-org / directory filter
- `/education-enablers/edtech/*` → existing EdTech page
- `/impact/*` → existing EduAid / Rebuild / Special Needs routes
- `/media-events`, `/events/*` → existing media + gala routes
- `/about/*` → About consolidated anchors
- `/vote` → Gold-Blue Garnet vote hub
No page deletions. No content replacement.

### 8. Analytics
Extend `src/lib/analytics.ts` with `trackNav(event, {label, href, section, phase, device})` and wire it into every dropdown open, mega-menu click, CTA click, search open, drawer open, language change, sign-in click.

### 9. Accessibility
- Semantic `<nav aria-label>`, Radix primitives for aria-expanded/controls, focus-visible rings, ESC-to-close, focus return to hamburger, 44px targets, reduced-motion respect, no hover-only dropdowns.

### 10. Tests
- `tests/e2e/navbar-ecosystem-desktop.spec.ts` — 6 groups render, mega menu opens, CTAs visible, active state, ESC closes.
- `tests/e2e/navbar-ecosystem-mobile.spec.ts` — drawer order, accordion single-open, focus return, Nominate visible, no scroll leak.
- Extend `banned-strings` check to flag re-introduction of "education changemakers" in nav copy.

## Files created
- `src/config/campaignPhase.ts`
- `src/config/announcements.ts`
- `src/config/enablersTaxonomy.ts`
- `src/components/navigation/AnnouncementBar.tsx`
- `src/components/navigation/EducationEnablersMegaMenu.tsx`
- `tests/e2e/navbar-ecosystem-desktop.spec.ts`
- `tests/e2e/navbar-ecosystem-mobile.spec.ts`

## Files modified
- `src/config/siteNavigation.ts` (full rewrite of structure)
- `src/components/navigation/SiteHeader.tsx` (announcement bar + 6-group nav + phase CTA)
- `src/components/navigation/NavSearch.tsx` (extended index + placeholder)
- `src/lib/analytics.ts` (`trackNav` helper)
- `src/App.tsx` (route aliases / redirects)

## Explicit non-goals
- No new landing pages for sectors/RECs/EdTech subcats — links target existing pages or filtered directory views.
- No changes to nomination form, voting engine, auth, RLS, edge functions.
- No visual redesign of pages below the header.
- No footer restructure this pass (config is ready for it next).

## Risks & mitigations
- **Route drift:** every new nav href is checked against `App.tsx`; missing ones get a `<Navigate>` alias, never a dead link.
- **Mega-menu size on tablet:** collapse to standard dropdown below `lg`; mobile uses accordion.
- **Announcement bar height on mobile:** capped at 32px, single line, marquee-free.
- **CTA label churn:** driven from `campaignPhase.ts` so admins flip phase without touching components.

## Acceptance
Matches the 22-point acceptance checklist in the brief: 6 groups, logo=home, mega menu with 8 RECs + 20 sectors + 4 EdTech subcats, Nominate strongest CTA, phase-driven secondary CTA, accessible mobile accordion drawer, all existing routes preserved or redirected, analytics events emitted, keyboard + screen-reader support verified by E2E.
