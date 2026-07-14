## Objective

Transform NESA-Africa from a handbook-style site into a scannable recognition & impact platform. Reduce cognitive load, unify the four recognition tiers, remove voting/competition language from 2026 surfaces, and standardise every page around one purpose · one audience · one primary CTA.

## Working principles (locked from your brief)

- **Positioning:** "Africa's Education Recognition & Impact Platform · Recognising the Enablers of Education for All Across Africa."
- **Geography:** 8 Africa Regions + African Diaspora. Friends of Africa is a participation class, not a region.
- **Recognition:** 4 tiers — Icon (3 pathways, 9 laureates, no vote), Blue Garnet 2026 (recognition only, competition from 2027), Platinum (jury-only), Influencer (impact-based).
- **Copy:** short paragraphs, no "excellence" language, no voting/competition wording on 2026 pages, no endorsements-as-votes.
- **CTAs:** one primary + one secondary + one tertiary per page. Max two repeats of primary.

## Delivery model

Two artefacts precede any code beyond navigation:

1. **Canonical map** at `docs/refactor/canonical-map.md` — every current route → keep / merge / redirect / delete, with new URL, primary audience, primary CTA, word budget, and hero image slot.
2. **Redirect + removal register** at `src/config/redirects.ts` — central 301 table wired into `App.tsx` so we can delete duplicates immediately without breaking inbound links (your combined answer 1+2).

Every phase updates both artefacts. Nothing gets deleted unless a redirect exists.

## Phase plan

### Phase 0 — Foundations (single turn)
- Ship `docs/refactor/canonical-map.md` covering all ~183 audited pages grouped by the 15 clusters in §47 of the brief.
- Ship `src/config/redirects.ts` + a `<RedirectResolver />` mounted at the top of `App.tsx` routes so old vote pages, 2025 award pages, duplicate About/Sponsor pages, and 5-region regional pages 301 to their new canonical routes.
- Ship `src/config/siteNavigation.ts` rewrite to the 10-item primary nav (About · Recognition · Impact Programmes · Directory · Media · Get Involved · Support · Nominate · Sign In · Language) with the three approved dropdowns only.
- Ship reusable primitives: `PageShell`, `HeroCompact`, `TierNoticeBanner`, `CTAStack` (primary/secondary/tertiary), `FeaturedNomineeStrip`, `FAQAccordion`, `TrustIndicators`. All consume design tokens — no ad-hoc colours.

### Phase 1 — Homepage + IA switch-over
- Rebuild `/` to the 10-block spec (hero → trust · 4 tier cards · directory preview · how it works · impact · participation · media · final CTA) at 500–650 words.
- Generate a single homepage hero visual (African classroom / laureate portrait mosaic) via imagegen premium; reuse existing portraits where present.
- Wire `SiteHeader` + `NESAFooter` to the new navigation config; retire mega menu overflow.
- Analytics events registered: `hero_cta_click`, `tier_card_click`, `directory_preview_click`, `final_cta_click`.

### Phase 2 — 4 Award landing clusters
Standardise every tier around the existing `TierClusterLayout` (hero · tier notice · category cards · nominate CTA · how it works · featured nominees · outputs · integrity · FAQs · final CTA), 700–900 words each. Supporting routes (`/about`, `/criteria`|`/categories`|`/pathways`|`/guidelines`, `/nominate`, `/nominees`) already exist — content rewrite + hero regeneration only.

| Route | Hero art | Notes |
|---|---|---|
| `/awards/africa-education-icon` | Hall of Fame portrait mosaic | 3 pathways, add `/hall-of-fame` link |
| `/awards/gold-blue-garnet` | Continental impact still | Add `/awards/gold-blue-garnet/2027-competition` teaser |
| `/awards/platinum` | Institutional/library still | Jury-only notice on every sub-page |
| `/awards/influencer-education-impact` | Split hero (social · sport · music) | Embedded one-page nomination form after hero |

### Phase 3 — Directory + Nominee profile
- Rename `/nominees` visible title to **Africa Education Impact Directory**; keep URL for SEO, add H1 change + JSON-LD `CollectionPage`.
- Filter refactor: recognition tier · category · country · region · organisation type. Collapsed by default on mobile.
- `NomineeProfile` template locked to §19 spec with tabbed evidence/timeline/media. PII columns already restricted server-side — audit `select` calls one more time.

### Phase 4 — Nomination flows
- `/nominate` becomes a chooser only (four tier cards + "who are you nominating?" selector).
- Each tier gets a dedicated one-page form under `/awards/:tier/nominate` using existing `NativeCategoryNominationForm` (already emits success + redirect analytics from prior turn). No account required pre-submit.
- Kill legacy multi-form omnibus pages via redirects.

### Phase 5 — Impact, Chapters, Community, Volunteer/Ambassador, Sponsor, Partner, Media, Events, Support
Apply the standard landing template (§13) to each cluster. Each cluster page ≤ 700 words; long-form policy content moves under `/policies/*` and `/help/*` where the brief already prescribes routes. Sponsorship packages become a downloadable brochure; sponsor landing shrinks to one card grid.

### Phase 6 — Governance, NRC, Judges, Dashboards, Auth
- Public governance pages compressed; full policies live under `/policies/*`.
- NRC + Judges portals: no visual overhaul, just navigation labels and copy alignment (workflows already correct).
- Dashboard task cards standardised via a shared `DashboardTaskCard` primitive.

### Phase 7 — SEO, analytics, performance, accessibility
- Per-route `<Helmet>` audit: unique title/description/canonical/og. `og:url` self-references route.
- Regenerate `public/sitemap.xml` via `scripts/generate-sitemap.ts` from the canonical map (removes obsolete vote/2025 URLs).
- Analytics events registered in `src/lib/analytics.ts` per §50 (page_view, cta_click{slot}, scroll_depth, video_play, form_start/abandon/error/submit, directory_search, filter_use, profile_view, share, endorsement, cert_download, print_request, gala_request, donation_start/complete).
- Accessibility skill pass on every rebuilt template (button-name, main landmark, tap targets, `h-dvh`).
- Perf: lazy-load below-the-fold media, compress hero PNGs → WebP, paginate directory (already in place), remove autoplay video.

### Phase 8 — Cleanup + QA
- Sweep for lingering "excellence", vote language, 60/40 references, five-region maps, Friends-of-Africa-as-region.
- Playwright coverage: nav breakpoints, tier cluster smoke tests, form submission + redirect analytics, directory filter interactions.
- Publish redirect audit report + duplicate-removal report to `docs/refactor/`.

## Deliverables per phase

Every phase closes with: updated canonical map row status, redirect entries added, Playwright spec, analytics events registered, and a short changelog under `docs/refactor/changelog/PHASE-N.md`.

## Technical notes

- Route contract stays React Router in `src/App.tsx`; redirect table drives 301s so we can delete pages the same turn we redirect them.
- Design tokens (`bg-charcoal`, `text-gold`, `bg-blue-garnet`) already defined — no new palette.
- All new hero art generated with imagegen premium at 1600×900 into `src/assets/refactor/*.jpg`, then referenced via ES import. Portraits reuse `imageManifest.ts`.
- Copy source: NESA voice, written by me, flagged in `data/copy/*.ts` files so you can edit without touching JSX.
- StageGate + PII RLS already in place from prior turns; no schema changes expected until Phase 6 dashboard tweaks.

## What I need from you to start Phase 0

Approve this plan and I'll ship Phase 0 (canonical map + redirect resolver + new nav config + shared primitives) in one turn. Phase 1 follows immediately after.

## What is explicitly out of scope

- Backend schema changes beyond additive analytics events.
- New payments, wallet, or AGC mechanics.
- Rewriting NRC/judges evaluation logic.
- Video production — only poster images + embed hardening.