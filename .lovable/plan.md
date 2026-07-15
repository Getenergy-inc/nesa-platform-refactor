# NESA.Africa 22-Page Master Refactor — Execution Plan

This is a large, multi-phase refactor. Rather than attempting all 22 pages + 22 award subpages + nav + forms + redirects in one turn, this plan sequences the work into shippable phases that build on the Phase 0 foundations already in place (`refactorRedirects2026.ts`, `HeroCompact`, `CTAStack`, `TrustIndicators`, `TierNoticeBanner`, `TierClusterLayout`, `canonical-map.md`).

## Phase A — Architecture & Navigation (ship first)

1. **Canonical 22-page route map** — update `docs/refactor/canonical-map.md` and `src/config/siteNavigation.ts` to match the exact 22 routes and the 8-item primary nav (About · Recognition · Impact · Directory · Community · Media · Support · Nominate · Sign In · Language). Consolidated new routes: `/recognition`, `/partners-sponsors`, `/events`, `/resources`, `/policies`.
2. **Redirect register** — extend `src/config/refactorRedirects2026.ts` with every old→new mapping (Partners+Sponsors merge, EduAid/Rebuild/Scholarships/AfriEdu → `/impact`, NESA TV/News/Gallery/Press → `/media`, Gala/Webinars → `/events`, all policies → `/policies`, FAQs → `/faqs`, etc.) and wire in `App.tsx`.
3. **Footer** — collapse `NESAFooter` to 5 groups (About · Recognition · Impact · Participate · Support), remove obsolete voting links.
4. **Global nav dropdowns** — restrict Recognition dropdown to 4 tier roots only (no category leaks).

## Phase B — Reusable subpage template

5. Build `src/components/awards/subpage/AwardSubpageTemplate.tsx` implementing the 10-block order from §9 (hero → recognises → who → examples → geography → featured 6 nominees → how it works → integrity → FAQs ≤5 → final CTA). Data-driven from a single `subpageContent` config.
6. Create `src/config/awards/subpages2026.ts` — the source of truth for all 22 award subpages (3 Icon + 3 Influencer + 9 Blue Garnet + 7 Platinum).

## Phase C — Award subpages (22)

7. Register dynamic routes and wire each of the 22 subpages using the template + config. Ensure each is reachable ONLY via its parent tier page (breadcrumbs, pathway cards, category directory) — none appear in global nav.
8. Update the 4 tier landing pages to expose their subpages via a `PathwaysGrid` / `CategoryGrid` block.

## Phase D — Consolidated core pages

9. `/recognition` — new 4-card tier overview page.
10. `/impact` — merge EduAid, Rebuild, Special Needs, Scholarships, Afri-EduTourism into one hub with section cards.
11. `/partners-sponsors` — new merged page with two clear journeys + integrity firewall.
12. `/media` — merge TV / Radio / News / Stories / Gallery / Press.
13. `/events` — merge Gala 2026 / Conferences / Webinars / Tickets / Accreditation.
14. `/resources` — new downloads/reports hub.
15. `/policies` — new policy hub linking existing policy pages.
16. `/faqs` — searchable accordion (single page, categorised).
17. `/contact` — single routing form replacing multiple contact endpoints.
18. Home, About, Directory (`/nominees`), Hall of Fame, `/nominate`, `/sign-in`, `/dashboard`, `/search` — content trims to 300–700 words, one primary + one secondary CTA above the fold. (Home hero already shipped in Phase 1.)

## Phase E — Nomination flow inversion

19. Rework `/nominate` and tier `/nominate` sub-routes so the form is reachable without a signup wall; account creation happens at submit. Draft persistence across auth handoff. Existing users sign in inline.

## Phase F — Directory, profile, regions

20. Update `/nominees` filters to the specified set (tier · category · country · region · org type) with 8-region model + Diaspora as separate class.
21. Country → region auto-assignment in nomination + directory (no manual region selection for public users).
22. `/nominee/:slug` profile template audit against §15 (hide private evidence, NRC notes, jury scores).

## Phase G — QA & analytics

23. Analytics events per §21 (CTA clicks, form starts/abandon/success, directory filters, profile views, endorsements, cert downloads, donation start/complete, video plays, scroll depth).
24. Playwright specs for: nav shows only 8 items · Recognition dropdown has only 4 tiers · every redirect resolves · each of the 22 subpages renders 10 blocks · nomination-first flow works without signup.
25. Delete duplicate old routes AFTER redirects verified.

## Technical notes

- Content authority: **hybrid** — verbatim for legal/statement blocks (Blue Garnet 2026 Edition statement, integrity notes), NESA voice for hero/CTA copy.
- All 22 subpages share one template + one config file — do not fork per page.
- Dynamic totals (nominee counts, country/region counts, verification status) must come from Supabase via existing `useDbSpine`/`useNominees` hooks, not hardcoded.
- Word budgets enforced via lint in `scripts/check-banned-strings.sh` (add a soft check).
- No component deleted until its old URL is in `refactorRedirects2026.ts`.

## Shipping cadence

Each phase is one turn. I propose to start with **Phase A (Architecture & Navigation)** immediately after your approval — it unblocks every subsequent phase without touching page content yet.

Reply **"Approve — start Phase A"** to proceed, or tell me which phase to reorder / skip.
