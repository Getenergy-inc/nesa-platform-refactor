## Refactor to 22 canonical public pages

Replace the current 30-page structure with **22 task-focused pages**, preserving all copy by mounting existing section components inside consolidator pages. No words removed.

### Target sitemap (22)

| # | Route | Consolidates / Source |
|---|-------|-----------------------|
| 1 | `/` | Home (unchanged) |
| 2 | `/about` | AboutConsolidated (About + SCEF + Vision2035 + FAQ) — **remove Governance from this page** |
| 3 | `/governance` | New consolidator: Governance + Integrity Firewall + NRC + COI + Policies |
| 4 | `/recognition` | Recognition hub + 4-tier overview |
| 5 | `/africa-education-icon` | Africa Education Icon tier (rename from `/recognition/africa-education-icon`) |
| 6 | `/gold-blue-garnet` | Gold-Blue Garnet tier hub (rename from `/recognition/gold-blue-garnet`) |
| 7 | `/platinum` | Platinum tier hub (rename from `/recognition/platinum`) |
| 8 | `/influencer-impact` | Influencer tier (rename from `/recognition/influencer-education-impact`) |
| 9 | `/nominate` | Nomination gateway |
| 10 | `/directory` | Africa Education Impact Directory (was `/education-enablers`) |
| 11 | `/regions` | 8 regions + Diaspora index |
| 12 | `/impact` | New Impact Programmes hub (overview + cards linking to 13–16) |
| 13 | `/eduaid-africa` | EduAid-Africa (scholarships + training + webinars) — narrowed |
| 14 | `/rebuild-my-school` | Rebuild My School Africa (standalone) |
| 15 | `/special-needs` | Special Needs Education (standalone) |
| 16 | `/afri-edutourism` | Afri-EduTourism (standalone) |
| 17 | `/media` | MediaHubConsolidated (TV, webinars, shows, news, galleries, events, accreditation) |
| 18 | `/gala` | GalaConsolidated (gala + tickets + tables + hospitality + FAQ) |
| 19 | `/sponsors` | Sponsors & Partners consolidator (Partners + SponsorLanding + endorse-as-sponsor) |
| 20 | `/shop` | Merchandise (Shop) |
| 21 | `/endorsements` | Endorsements page (EndorseNESA + endorsements list) |
| 22 | `/chapters` | Chapters + Volunteers + Ambassadors consolidator |

**Dropped canonical routes (kept as redirects):** 7 Platinum category detail pages, 9 Gold-Blue Garnet category detail pages, `/timeline`, `/support`. Category detail pages remain reachable via `/platinum/:category` and `/gold-blue-garnet/:category` (still rendered by `TierCategorySubcategoryPage`) but are no longer part of the "22 public pages" navigation. Timeline content is embedded inside `/recognition`. `/support` splits into `/sponsors`, `/shop`, `/endorsements`, `/chapters`.

### Execution steps

**Step 1 — Source of truth**
- Rewrite `src/config/page-sequence.ts` to the 22 entries above.
- Update `src/config/siteNavigation.ts` main-nav to reflect the new top-level structure and anchor links.

**Step 2 — New / updated consolidator pages** (no copy loss — mount existing sections)
- `src/pages/about/AboutConsolidated.tsx` — remove Governance section (moves to `/governance`).
- `src/pages/governance/GovernanceConsolidated.tsx` — new: mounts Governance + NRC + Integrity Firewall + Policies + COI.
- `src/pages/impact/ImpactHub.tsx` — new: overview + 4 programme cards linking to /eduaid-africa, /rebuild-my-school, /special-needs, /afri-edutourism.
- `src/pages/sponsors/SponsorsPartners.tsx` — new: mounts Partners + SponsorLanding + sponsor CTAs.
- `src/pages/endorsements/EndorsementsPage.tsx` — new: mounts EndorseNESA + endorsements list.
- `src/pages/chapters/ChaptersConsolidated.tsx` — new: mounts Chapters + Volunteers + Ambassadors sections.
- Split `EduAidAfricaImpact.tsx` back into 4 standalone routes (`/eduaid-africa`, `/rebuild-my-school`, `/special-needs`, `/afri-edutourism`) — sections already exist as standalone pages, just re-route them.

**Step 3 — Route table** (`src/App.tsx`)
- Point 22 canonical routes at the pages above.
- Rename tier canonical routes: `/recognition/africa-education-icon` → `/africa-education-icon` (add redirect), same for the other 3 tiers.
- Redirects: `/support` → `/sponsors`; `/support#volunteers` → `/chapters#volunteers`; `/support#donate` → `/sponsors#donate`; `/education-enablers` → `/directory`; `/timeline` → `/recognition#timeline`; `/gala/tickets` → `/gala#tickets`; legacy consolidator anchors keep working.
- Keep dynamic `:category` and `:subcategory` routes (still rendered, but not counted in the 22).

**Step 4 — Navigation & footer**
- Update `src/config/siteNavigation.ts` primary items and children to the 22-route map.
- Update `NESAFooter` link groups.
- Update `MobileBottomNav` targets if any point at removed routes.

**Step 5 — Content preservation check**
- Grep each retired page's headline strings; verify they still render inside their new home.
- Add anchor `id`s to any section that a nav link now targets.

**Step 6 — Verify**
- `tsgo` typecheck.
- Playwright smoke: visit all 22 routes + 8 key legacy redirects; assert 200 + heading present.
- Update `docs/refactor/sitemap-30.md` → `sitemap-22.md`; update `FRONTEND_ARCHITECTURE.md`.

### Notes / trade-offs
- **No copy deleted** — every existing section component is remounted; only routing/wrappers change.
- Tier routes shorten (`/africa-education-icon` etc.) to match the user's spec. Old `/recognition/<tier>` URLs redirect.
- Category detail pages still exist and are linked from tier hubs, but they don't count toward the 22 canonical public pages.
- Multi-file change (~15 new/edited files + App.tsx routing + nav/footer). Batched in parallel where safe.

Approve and I'll implement in one pass.
