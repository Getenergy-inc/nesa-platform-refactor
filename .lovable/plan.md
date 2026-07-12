# 30-Page Consolidation Refactor

Replace the current 38-page structure with **30 task-focused pages**, keeping every word of copy from the current pages. Content is consolidated (not deleted) via sections, tabs, accordions, and anchor navigation.

## Target sitemap (30 pages)

| # | Route | Consolidates |
|---|-------|--------------|
| 1 | `/` | Home (unchanged) |
| 2 | `/about` | About + Governance + SCEF + NRC + COI + FAQs |
| 3 | `/recognition` | Recognition hub + season overview + eligibility + timeline summary |
| 4 | `/recognition/africa-education-icon` | Icon tier + its 1 category + subs + laureates + judges + form + FAQs |
| 5 | `/recognition/influencer-education-impact` | Influencer tier + category + subs + form + FAQs |
| 6 | `/recognition/platinum` | Platinum hub (7 category cards + common rules) |
| 7 | `/recognition/gold-blue-garnet` | Gold-Blue Garnet hub (9 category cards + rules) |
| 8–14 | `/recognition/platinum/:category` (×7) | One page per Platinum category |
| 15–23 | `/recognition/gold-blue-garnet/:category` (×9) | One page per GBG category |
| 24 | `/education-enablers` | All nominee/finalist/winner/region/org directories → one filterable directory |
| 25 | `/nominate` | Tier→category→sub→type gateway with inline form routing |
| 26 | `/timeline` | 13-phase timeline + current phase + countdown |
| 27 | `/eduaid-africa` | EduAid + Rebuild + Special-Needs + Afri-EduTourism + Scholarships + Training + Impact Reporting (anchors: `#webinars`, `#rebuild-my-school`, `#nominate-special-needs-school`, `#afri-edutourism`, `#scholarships`, `#training`, `#impact-reporting`) |
| 28 | `/media` | TV + webinars + shows + interviews + docs + podcasts + news + press + galleries + gala media + accreditation + events |
| 29 | `/gala` | Gala + tickets + tables + delegates + hospitality + invitations + accreditation + FAQs + QR |
| 30 | `/support` | Sponsor + partner + donate + volunteer + ambassador + chapters + merch + contact + help + FAQs |

## Execution steps

**Step 1 — Source of truth**
Rewrite `src/config/page-sequence.ts` to the 30 entries above. Update `src/config/siteNavigation.ts` main-nav to reflect the 7-item structure pointing at these routes.

**Step 2 — Build the 4 new consolidator pages**
Create wrapper pages that mount existing section components (no copy loss):
- `src/pages/about/AboutConsolidated.tsx` — reuses existing About sections + Governance, SCEF, NRC, COI, FAQ sections.
- `src/pages/eduaid/EduAidAfricaImpact.tsx` — mounts EduAid, Rebuild, Special-Needs nominate, Afri-EduTourism, Scholarships, Training, Impact sections with `id=` anchors and a sticky sub-nav.
- `src/pages/media/MediaHubConsolidated.tsx` — mounts TV, Webinars, Shows, Interviews, Docs, Podcasts, News, Press, Galleries, Accreditation, Events sections.
- `src/pages/support/SupportConsolidated.tsx` — mounts Sponsor, Partner, Donate, Volunteer, Ambassador, Chapters, Merch, Contact, Help, FAQ sections.
- `src/pages/EducationEnablersDirectory.tsx` — single filterable directory replacing separate nominee/finalist/winner/region/org listings.
- `src/pages/NominateGateway.tsx` — tier → category → subcategory → nominee-type wizard that opens the correct embedded form.

Each consolidator imports the existing section components verbatim so **no copy is removed**.

**Step 3 — Route table**
In `src/App.tsx`:
- Point the 30 canonical routes at the pages above.
- Add `<Navigate>` redirects from every removed route to its new home (with `#anchor` where applicable):
  - `/eduaid` → `/eduaid-africa`
  - `/rebuild` → `/eduaid-africa#rebuild-my-school`
  - `/special-needs` → `/eduaid-africa#nominate-special-needs-school`
  - `/events/tourism`, `/afri-edutourism` → `/eduaid-africa#afri-edutourism`
  - `/media/tv`, `/media/shows`, `/media/webinars`, `/media/gala`, `/press` → `/media` (with anchors)
  - `/donate`, `/volunteer`, `/ambassadors`, `/partners`, `/endorse`, `/judges`, `/shop`, `/contact`, `/faq`, `/policies` → `/support` (with anchors)
  - `/about/vision-2035`, `/about/governance`, `/about/scef`, `/about/social-impact` → `/about#…`
  - `/nominees`, `/regions`, `/impact`, directory variants → `/education-enablers`
  - `/awards/*` legacy → `/recognition/*`
  - `/tickets` → `/gala#tickets`
- Keep dynamic `:category` routes under the two hubs (Platinum, GBG).

**Step 4 — Navigation & footer**
Update `src/config/siteNavigation.ts`, `MobileBottomNav`, `NESAFooter` link groups, and any hardcoded links across the codebase to the new 30-route map. Preserve labels.

**Step 5 — Content preservation check**
Grep each removed page's copy strings and confirm they still render inside the target consolidator. Add anchor `id`s to the section components that need them.

**Step 6 — Verify**
- `tsgo` typecheck
- `bun run build`
- Playwright smoke: visit each of the 30 routes + 5 legacy redirects; assert 200 and heading present.
- Update `FRONTEND_ARCHITECTURE.md` and `docs/refactor/sitemap-38.md` → new `sitemap-30.md`.

## Notes / trade-offs

- **No copy is deleted.** Every existing section component is remounted inside the new consolidators; only routes/wrappers change.
- The 16 tier-category detail pages (7 Platinum + 9 GBG) continue to use the existing `TierCategorySubcategoryPage` / `CategoryDetailPage` renderers, hydrated from `useDbSpine`.
- Legacy URLs keep working via redirects, so external links and SEO are preserved during the transition.
- This is a large multi-file change (~40–60 files touched, mostly routing + 6 new wrapper pages). I'll batch writes in parallel where safe.

Approve this plan and I'll implement it in one pass.
