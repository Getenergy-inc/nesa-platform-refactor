# NESA-Africa Public Platform Refactor — Phased Plan

**Goal**: Compress 130 internal routes into a clean 9-item public navigation, retain the landing page, normalize award language, gate backend routes, and redirect duplicates — without reducing platform scope.

**User-confirmed decisions**:
- Award labels site-wide: **Africa Education Icon**, **Gold / Blue Garnet Awards**, **Platinum Recognition**, **Influencer Education Impact** (4 structures, not 3). Influencer remains its own surface but ranked below the 3 core structures.
- Coming-Soon routes (wallet, results, analytics, checkout, certificates, jury, etc.): **redirect to nearest parent** rather than render placeholder.
- Landing page: **reorder + trim existing sections** (no rebuild from scratch).
- Phase 1 = this plan document; execute phase-by-phase after approval.

---

## Public Navigation Target (9 top-level + 2 header CTAs)

| Top-level | Dropdown items | Backing routes |
|---|---|---|
| Home | — | `/` |
| About | About NESA, About the Award, Why It Matters, Standards & Governance, Recognition Framework, FAQs, Help Centre | `/about`, `/about/awards-recognition`, `/about/social-impact`, `/about/governance` + `/governance`, `/pathways`, `/faq`, `/faq` |
| Awards | Awards Hub, Africa Education Icon, Gold / Blue Garnet Awards, Platinum Recognition, Influencer Education Impact, Award Categories, Timeline, Rules | `/awards`, `/awards/icon` (alias `/awards/africa-education-icon`), `/awards/blue-garnet` + `/awards/gold`, `/awards/platinum`, `/awards/influencers-education-impact`, `/awards/categories`, `/about/timeline`, `/policies` |
| Participate | Explore Nominees, Nominate 2026, Pre-Nomination, Nomination Guidelines, Vote & Earn AGC, Voting Rules, Nomination FAQs | `/nominees`, `/nominate`, `/nominate` (pre-nom gated), `/guidelines/nominators` + `/guidelines/nominees`, `/vote` + `/earn-agc`, `/guidelines/voters`, `/faq` |
| Sponsors & Partners | Sponsor NESA, Sponsorship Packages, Category Sponsorship, Gala Sponsorship, NESA TV Sponsorship, EduAid Sponsorship, RMSA Sponsorship, CSR Education Fund, Partner With Us, Endorse NESA | `/sponsor`, `/sponsorship-packages`, `/sponsor/:slug`, `/sponsors`, `/endorse` |
| Impact Programs | EduAid-Africa, Scholarships, School Support, Teacher Development, Women & Girls, Special Needs, Rebuild My School Africa, Regional Map, Impact Reports | `/eduaid`, `/eduaid-africa/rebuild-my-school`, `/rebuild`, `/impact`, `/region` |
| Media & Events | Media Hub, NESA-Africa TV, Live Broadcast, Shows, Webinars, Announcements, Press, Impact Stories, Gallery, Gala | `/media`, `/media/tv`, `/media/shows`, `/media/webinars`, `/media/gala`, `/gallery`, `/videos`, `/trending` |
| Join the Movement | Membership, Chapters, Join Chapter, Ambassadors, Volunteers, Meet Judges, Become a Judge, Nominee Research Corps | `/chapters`, `/join-local-chapter`, `/ambassadors`, `/volunteers`, `/judges`, `/judge/apply`, `/nrc` (public landing variant) |
| Contact | Contact, Help Centre, Search, Sophia AI | `/contact`, `/faq` |

**Header CTAs**: Primary `Nominate Now → /nominate` · Secondary `Explore Nominees → /nominees`.

---

## Route Disposition Table (130 routes → Keep / Merge / Hide / Redirect)

### KEEP — Public primary

`/`, `/about`, `/about/vision-2035`, `/about/governance`, `/about/timeline`, `/about/scef`, `/about/awards-recognition`, `/about/social-impact`, `/governance`, `/edx-matrix`, `/pathways`, `/awards`, `/awards/icon`, `/awards/blue-garnet`, `/awards/gold`, `/awards/platinum`, `/awards/influencers-education-impact`, `/awards/categories`, `/awards/blue-garnet-categories`, `/awards/platinum-certificate-categories`, `/awards/gold-special-recognition`, `/categories/:slug`, `/nominees`, `/nominees/:slug` (or `/nominee/:slug`), `/nominate`, `/vote`, `/earn-agc`, `/about-agc`, `/how-voting-works`, `/sponsor`, `/sponsorship-packages`, `/sponsors`, `/endorse`, `/partners`, `/eduaid`, `/eduaid-africa/rebuild-my-school`, `/rebuild`, `/impact`, `/region`, `/region/:slug`, `/media`, `/media/tv`, `/media/shows`, `/media/webinars`, `/media/gala`, `/gallery`, `/videos`, `/trending`, `/chapters`, `/join-local-chapter`, `/ambassadors`, `/volunteers`, `/judges`, `/judge/apply`, `/contact`, `/faq`, `/policies`, `/guidelines/*` (5 role pages).

### MERGE — Consolidate to canonical

| Source | Canonical | Action |
|---|---|---|
| `/awards/africa-education-icon` | `/awards/icon` | redirect |
| `/awards/influencers-education-impact-2026-recognition` | `/awards/influencers-education-impact` | redirect |
| `/awards/csr-education`, `/awards/csr-for-education`, `/awards/influencer-education`, `/awards/digital-voices`, `/awards/grants-global-support`, `/awards/global-partnerships` | `/awards/categories` (or relevant category slug) | redirect |
| `/category/*` legacy slugs (12 routes) | `/categories/:slug` | already redirected — verify |
| `/pathways-to-recognition` | `/pathways` | redirect |
| `/ecosystem`, `/movement` | merge into `/about/social-impact` | redirect |
| `/contributors`, `/contributors/:id` | keep but link only from About | demote |
| `/upcoming-events` | merge into `/media/gala` | redirect |

### HIDE from nav (Public but Secondary — reachable by deep link/footer)

`/edx-matrix`, `/governance`, `/about/timeline`, `/about/scef`, `/policies`, `/guidelines/*`, `/region/*` subpages, `/gallery/:slug`, `/videos`, `/trending`, `/judges/directory`, `/judges/:slug`, `/ambassadors/*`, `/volunteers/:slug`, `/volunteer-*` (teams/leaderboard/stories), `/contributors*`, `/install`, `/programs`, `/programs/nesa-africa`.

### COMING SOON → redirect to nearest parent

| Coming-Soon route | Redirect target |
|---|---|
| `/vote/jury`, `/vote/gold`, `/vote/blue-garnet`, `/vote/receipt/:id`, `/vote/analytics`, `/vote/results`, `/results` | `/vote` |
| `/wallet`, `/dashboard/wallet` | `/about-agc` |
| `/certificates/*` (except `/certificates/verify`) | `/about` |
| `/verify/:hash` | keep (verification works) |
| `/rmsa/vote`, `/rmsa/funding` | `/rebuild` |
| `/tickets`, `/shop/checkout` | `/media/gala` (until commerce ready) |

### PROTECTED (require auth — keep mounted, never in public nav)

`/login`, `/register`, `/forgot-password`, `/reset-password`, `/dashboard*`, `/profile*`, `/nominee/dashboard/:token`, `/nominee/accept/:token`, `/nominee/decline/:token`, `/judge/dashboard`, `/judge/scoring`, `/judge/coi`, `/judge/chat`, `/judge/rubric`, `/judge/guidelines`, `/judge/panel`, `/judge/help`, `/judge/settings`, `/judge/icon-lifetime`, `/judge/status`, `/judge/verify`, `/judge/signup`, `/volunteer/dashboard` + sub-routes, `/olc/*`.

### PRIVATE ADMIN (never public)

All `/admin/*` (18 routes), `/nrc/*` portal pages (15 routes). NRC public landing may show "Apply" CTA only.

---

## Phased Execution

### Phase 2 — Navigation IA (1 PR)
- Refactor `src/components/navigation/MainNav.tsx` to 9 top-level items with dropdowns above.
- Refactor `MobileBottomNav` and Drawer to mirror the structure (Home / Awards / Nominate / Participate / More).
- Refactor `src/components/nesa/NESAFooter.tsx` columns to: Awards · Participate · Programs · Sponsors · Movement · Contact.
- Update `src/components/layout/PublicLayout.tsx` only if header signature changes.
- Header CTAs: `Nominate Now` (primary), `Explore Nominees` (secondary).

### Phase 3 — Redirects & route hygiene (1 PR)
- Add `<Route>` redirects in `src/App.tsx` for every row in MERGE and COMING SOON tables.
- Update `src/config/page-sequence.ts` to drop hidden/admin/protected routes from book pagination.
- Update `scripts/generate-sitemap.ts` (or `public/sitemap.xml`) to include only KEEP routes.

### Phase 4 — Award language normalization (1 PR)
- Site-wide replace to the 4 confirmed labels. Touch `src/locales/en/pages.json`, `src/config/awardCategories/*`, hero/landing/dropdown copy.
- Remove voting language from Icon and Platinum surfaces; keep only on Gold/Blue Garnet and Influencer where applicable.

### Phase 5 — Landing page reorder (1 PR)
Reorder existing sections in `src/features/landing/NESALandingPage.tsx` to:
1. Hero (existing TrophyHeroSection) — confirmed copy
2. About NESA-Africa Awards (existing About block, trimmed)
3. Why NESA-Africa Matters (extract from existing)
4. Three+1 Award Structures (existing Awards carousel, ensure 4 cards)
5. How Participation Works (existing EcosystemCarousel, relabel)
6. Gala Countdown (existing)
7. Explore Existing Nominees Preview (FeaturedNomineesSection — already added)
8. Sponsors & CSR Preview
9. Impact Programs Preview (EduAid + RMSA)
10. Media & NESA TV Preview
11. Join the Movement Preview
12. Final CTA (Nominate / Explore / Sponsor / Join)

Trim any sections not in the 12-block list.

### Phase 6 — SEO sweep (1 PR)
- Unique `<Helmet>` title + meta description on every KEEP page.
- Canonical tags on category/nominee/award detail pages.
- OG tags inherited from `index.html` defaults; per-page where content differs.
- Regenerate `public/sitemap.xml` from KEEP list.

### Phase 7 — Mobile-first QA (1 PR)
- Verify single primary CTA per page.
- Verify dropdown depth ≤ 2 on mobile.
- Run `tests/e2e/navbar-*.spec.ts` and add coverage for new IA.
- Update `ROUTES.md` to reflect public vs internal split.

---

## Out of Scope (explicit)
- No DB schema changes.
- No new pages — only reorganization, redirects, and copy.
- No removal of existing functionality; admin/dashboard/NRC remain mounted under auth.
- No new design system tokens; reuse charcoal/gold tokens.

---

## Approval Gate
Reply with the phase number to execute next (e.g. "go Phase 2") or request edits to this plan.
