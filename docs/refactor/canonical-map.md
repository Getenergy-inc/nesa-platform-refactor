# NESA-Africa 2026 — Canonical Page Map

Owner: Refactor programme (Phases 0–8)
Source brief: Master Copy-and-Paste Prompt, Nov 2026
Related registers:
- `src/config/refactorRedirects2026.ts` — 301 register (executed via `<RedirectRoute>` in `App.tsx`)
- `src/config/legacyRecognitionRedirects.ts` — Stage 6 recognition-spine redirects (kept)
- `src/config/siteNavigation.ts` — primary nav + dropdowns

## Legend

| Status | Meaning |
|---|---|
| **KEEP** | URL and component stay; content rewrite only. |
| **REWRITE** | URL stays; template swapped to standard cluster/landing template. |
| **MERGE** | Absorbed into a canonical page; old URL 301s. |
| **REDIRECT** | URL removed; 301 to canonical route. |
| **DELETE** | Component removed after redirect ships. |
| **NEW** | Net-new route required by brief. |

Every row must carry: primary audience · primary CTA · word budget · hero slot.
Word budgets follow §4 of the brief (landing 300–700, detail 700–1,500, docs unlimited).

---

## 1. Core public pages

| Route | Status | Primary audience | Primary CTA | Words | Hero |
|---|---|---|---|---|---|
| `/` | REWRITE | First-time visitor | Nominate an Education Enabler | 500–650 | New homepage hero (generated) |
| `/nominate` | REWRITE | Nominator (choosing tier) | Choose recognition pathway | 250 | Split 4-tier grid |
| `/nominees` (visible title: **Africa Education Impact Directory**) | REWRITE | Public / researchers | Explore verified profiles | 300 | Directory hero |
| `/hall-of-fame` | KEEP | Public | View laureate profile | 500 | Portrait mosaic |
| `/how-it-works` | REWRITE | Nominator / nominee | Start a nomination | 600 | Timeline illustration |
| `/timeline` | KEEP | All | View phase | 400 | Timeline |
| `/contact` | REWRITE | All | Send enquiry | 250 | — |
| `/faq` → merged into `/help` | REDIRECT | All | Search help | — | — |
| `/search` | KEEP | All | Refine search | — | — |

## 2. Recognition tiers (four award clusters)

Each cluster follows the standard template (§13) via `TierClusterLayout`.
Sub-routes: `/about`, `/criteria`|`/categories`|`/pathways`|`/guidelines`, `/nominate`, `/nominees`.

| Cluster root | Status | Notice | Words (root) | Hero |
|---|---|---|---|---|
| `/awards/africa-education-icon` | REWRITE | 3 pathways · 9 laureates · no vote | 700–900 | Hall of Fame portrait mosaic (new) |
| `/awards/gold-blue-garnet` | REWRITE | Recognition Edition · competition from 2027 | 700–900 | Continental impact still (new) |
| `/awards/platinum` | REWRITE | Jury-only institutional | 700–900 | Institutional still (new) |
| `/awards/influencer-education-impact` | REWRITE | Impact-based, not popularity | 700–900 | Split social/sport/music (new) |

### 2027 competition teaser
`/awards/gold-blue-garnet/2027-competition` — **NEW** — 400 words · Learn more CTA.

### Removed / redirected
- `/awards/csr-education` and legacy per-category vote pages → 301 to `/awards/gold-blue-garnet/categories`.
- Old 2025 tier pages → 301 to matching 2026 tier root.

## 3. Directory + profiles

| Route | Status | Notes |
|---|---|---|
| `/nominees` | REWRITE | H1 → "Africa Education Impact Directory"; new filter set (tier · category · country · region · org type). |
| `/nominee/:slug` | REWRITE | Locked to §19 template (tabbed evidence/timeline/media). |
| `/hall-of-fame/:slug` | KEEP | Laureate-only. |
| `/certificate/verify/:id` | KEEP | Minimal public verify. |

## 4. Guidelines & help

| Route | Status |
|---|---|
| `/guidelines/nominators` | REWRITE (≤ 900 words) |
| `/guidelines/nominees` | REWRITE |
| `/guidelines/judges` | REWRITE |
| `/guidelines/sponsors` | REWRITE |
| `/guidelines/partners` | REWRITE |
| `/guidelines/volunteers` | REWRITE |
| `/help`, `/help/*` (nominations, nominee-acceptance, nrc-verification, endorsements, certificates, profiles, gala, donations, contact) | REWRITE — searchable FAQ accordion |

## 5. About cluster

Splits `AboutConsolidated` into focused pages per §30:
`/about`, `/about/vision-mission`, `/about/education-enablers`, `/about/recognition-framework`, `/about/regions`, `/about/history`, `/about/governance`, `/about/nrc`, `/about/leadership`, `/about/scef`, `/about/annual-reports`.

## 6. Impact programmes

| Route | Status |
|---|---|
| `/impact` | REWRITE — hub |
| `/impact/eduaid-africa` | REWRITE |
| `/impact/rebuild-my-school-africa` | REWRITE |
| `/impact/nominate-school` | KEEP |
| `/impact/regional-projects` | KEEP |
| `/impact/regional-winners` | KEEP |
| `/impact/special-needs-school-intervention` | REWRITE |
| `/impact/scholarships` | NEW |
| `/impact/afri-edutourism` | KEEP |
| `/impact/reports` | KEEP |
| `/impact/donate` | KEEP |

## 7. Community & membership

`/community`, `/community/join`, `/community/missions`, `/community/leaderboard`, `/community/rewards`, `/community/profile`, `/membership`, `/membership/types`, `/membership/benefits`. All REWRITE ≤ 500 words.

## 8. Chapters

`/chapters`, `/chapters/find`, `/chapters/join`, `/chapters/start`, `/chapters/leadership`, `/chapters/resources`, `/chapters/reports`, `/chapters/sign-in`, `/chapters/dashboard`. Handbook removed from `/chapters`; moved to `/chapters/resources`.

## 9. Volunteer & ambassador

`/volunteer`, `/volunteer/opportunities`, `/volunteer/apply`; `/ambassadors`, `/ambassadors/apply`, `/ambassadors/levels`, `/ambassadors/dashboard`.

## 10. Sponsorship & partnerships

Sponsor: `/sponsors`, `/sponsors/packages`, `/sponsors/impact`, `/sponsors/integrity`, `/sponsors/enquire`.
Partner: `/partners`, `/partners/{government,corporate,universities,development,faith-based,media,technology,enquire}`.

## 11. Media

`/media`, `/nesatv`, `/radio-podcast`, `/media/news`, `/media/stories`, `/media/gallery`, `/media/press`, `/media/resources`.

## 12. Events & Gala

`/events`, `/events/gala-2026`, `/events/tickets`, `/events/recipients`, `/events/media-accreditation`, `/events/faq`, `/events/attendance-request`.

## 13. Support & donations

`/support`, `/donate`, `/donate/rebuild-my-school-africa`, `/donate/eduaid-africa`, `/donate/receipt`, `/support/corporate-giving`, `/support/legacy-giving`.

## 14. Dashboards (auth-only)

`/dashboard/nominee/*` per §27. `/nrc/*` per §28. `/judges/*` per §29. `/governance/*` per §29.

## 15. Auth

`/sign-in`, `/register`, `/forgot-password`, `/verify-email`, `/activate-nomination`, `/accept-nomination/:token`, `/decline-nomination/:token`, `/request-correction/:token`. All standalone (no site header/footer chrome).

## 16. Legal & governance

`/privacy`, `/terms`, `/accessibility`, `/cookies`, `/policies/nomination-integrity`, `/policies/sponsor-independence`, `/policies/data-protection`, `/policies/conflict-of-interest`, `/policies/endorsement`, `/policies/certificate`, `/policies/media-consent`, `/governance/framework`.

## 17. Contact

`/contact`, `/contact/support`, `/contact/media`, `/contact/partnerships`, `/contact/sponsorship`, `/contact/chapters`. Auto-routed enquiries; no exposed email lists.

---

## Consolidation / removal targets

Tracked in `src/config/refactorRedirects2026.ts`. Categories:
- Old voting pages (`/vote/*`, `/awards/*/vote`) → 301 to tier `/nominees` page.
- 2025 award landings → 301 to matching 2026 tier.
- Duplicate About/Sponsor/FAQ pages → 301 to canonical.
- 5-region regional pages → 301 to 8-region equivalent.
- "Friends of Africa" as-region routes → 301 to `/about/regions#friends-of-africa`.

## Redirects rule

No component may be deleted until its old URL is present in `refactorRedirects2026.ts` and shipping through `<RedirectRoute>`.

## Progress ledger

Update this table per phase.

| Phase | Status | PR / changelog |
|---|---|---|
| 0 — Foundations | shipped | `docs/refactor/changelog/PHASE-0.md` |
| 1 — Homepage + nav | shipped | Hero + CTA stack |
| A — 22-page nav + redirects + footer | shipped | siteNavigation.ts / refactorRedirects2026.ts / NESAFooter.tsx |
| B — Reusable subpage template | pending | — |
| C — 22 award subpages | pending | — |
| D — Consolidated core pages | pending | — |
| E — Nomination flow inversion | pending | — |
| F — Directory + regions | pending | — |
| G — QA + analytics | pending | — |

