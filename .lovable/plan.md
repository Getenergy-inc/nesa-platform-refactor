# NESA-Africa 2026 — Master Public Experience Refactor

This is a continent-scale refactor. To ship it safely without breaking the live site, I'll execute in **5 sequenced phases**, each independently shippable and reviewable. You approve the plan; I then ship phase-by-phase (or all at once if you say "go straight through").

---

## Phase 1 — Navigation & Information Architecture

Collapse the public nav to **exactly 9 items** + right-side utilities.

**Primary nav:** Home · About · Awards · Participate · Impact Programs · Media & Events · Join the Movement · Sponsors & Partners · Contact
**Right side:** Become a Sponsor (button) · Sign In · Language Selector · Search

- Audit current `Header`/`PublicLayout` nav, fold legacy items into mega-menu groupings or move to footer/discovery.
- Update mobile bottom bar + drawer to mirror the 9-item structure.
- Route map: `/`, `/about`, `/awards`, `/participate`, `/impact-programs`, `/media-events`, `/join`, `/sponsors-partners`, `/contact`. Add redirects from any renamed routes.
- All other existing pages remain reachable via in-page CTAs, filters, search — never top-nav.

## Phase 2 — Landing Page (18 sections, exact order)

Refactor `src/pages/Index.tsx` (or equivalent landing composer) to render exactly these 18 sections in order. Reuse existing components where they map cleanly; build new ones where missing.

1. **Hero** — eyebrow "A CONTINENT IN RECOGNITION", new headline, 3 CTAs (Nominate / Explore Nominees / Become a Sponsor)
2. **Countdown** — 22 Oct 2026, Lagos
3. **The Road to NESA-Africa 2026** — photos/videos/testimonials carousel + "View More Moments"
4. **Why NESA Exists** — Recognition → Visibility → Partnerships → Funding → Intervention → Legacy (refactor existing `WhyNESAExistsSection`)
5. **Vision, Mission & Strategic Objectives** (rewrite copy per spec; keep `#mission` anchor)
6. **What Makes NESA-Africa Different** — 8 focus-area cards
7. **Recognition Framework** — 4 tiers · 18 categories · 96 subcategories (refactor `AwardTiersSummarySection`)
8. **One Continent. Ten Regions. One Mission.** — signature section, 10-region grid
9. **Explore Africa's Regions** — region cards with overview / leaders / nominees / chapters / stories / EduTourism
10. **People Behind the Movement** — 200+ volunteers · 30+ countries
11. **Education Stakeholder Endorsements** — FAWE Africa, CSACEFA + integrity notice
12. **Rebuild My School Africa**
13. **EduAid-Africa**
14. **NESA-Africa TV**
15. **Sponsors & Partners**
16. **Governance & Integrity Firewall**
17. **Vision 2035**
18. **Final CTA** — Nominate / Become a Sponsor / Join the Movement

Every section gets a clear CTA per spec. Mobile-first, semantic HTML, single H1 in hero.

## Phase 3 — Discovery Model

Enforce the funnel: **Recognition Pathway → Geography → Category → Subcategory → Nominate or Explore**.

- Refactor `/awards` to land on the 4-tier pathway picker, not a flat 96-subcategory dump.
- Refactor `/nominees` (and "Explore Nominees" entry from hero) to require a geography or tier filter before showing the full list.
- Add a global Search overlay (right-side nav) that bridges all four axes.

## Phase 4 — Supporting Public Pages (light refactor pass)

For each of the 9 top-nav pages, align hero, intro copy, and primary CTAs with the master positioning. No full redesign in this phase — just brand, copy, CTA, and nav alignment so the site feels coherent end-to-end.

## Phase 5 — SEO, Trust & Conversion polish

- Per-route `<title>` / meta description / canonical / OG (already partly in place via `react-helmet-async`)
- JSON-LD: `Organization`, `Event` (Gala), `BreadcrumbList` on discovery routes
- Sponsor / Volunteer / Nominate conversion CTAs audited site-wide
- Integrity firewall messaging visible on Awards, Sponsors, About

---

## Technical notes

- Stack stays: React 18 + Vite + Tailwind + shadcn + framer-motion + react-helmet-async.
- Tokens stay: Charcoal/Black background, Gold (`42 85% 52%`) accents, Playfair Display headings. No new color systems.
- New sections built as small focused components under `src/components/nesa/landing/` and composed in `Index.tsx`.
- Mobile bottom bar (`pb-20`) and bottom-20 chat offsets preserved.
- No backend schema changes required for this refactor. The unresolved nominee PII security finding remains separate — I'll address it after you pick Option A or B from the previous turn.
- Content for sections 3 (Road to 2026 media), 10 (volunteer stories), 11 (endorser logos) will use existing assets where available and placeholder slots where not — flagged in code with `TODO(content)` comments so your content team can fill them in.

---

## What I need from you before I start building

1. **Approve this 5-phase plan** (or tell me to merge phases / change order).
2. **Ship cadence:** one phase per turn (safer, reviewable) **or** straight through all 5 (faster, one big diff)?
3. **Nominee PII security fix (from previous turn):** Option A (column-level REVOKE) or Option B (route through `public_nominees` view)? I'll fold the fix into Phase 1.
4. Any **must-keep sections** currently on the landing page that aren't in the 18-section spec? (Default: I remove anything not listed.)
