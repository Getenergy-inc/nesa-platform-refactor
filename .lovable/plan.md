# Award Category Page Refactor (Phase 18B)

Consolidate 17 standalone category pages + scattered award landings into 4 canonical groups under a single master index, with a shared template, integrity/sponsor disclaimers, FAQs, redirects, and SEO.

## 1. Canonical group structure

| # | Group | Index URL | Page count |
|---|-------|-----------|-----------|
| 1 | Blue Garnet Award Categories | `/awards/blue-garnet-categories` | 9 |
| 2 | Platinum Certificate Categories | `/awards/platinum-certificate-categories` | 7 |
| 3 | Africa Education Icon Lifetime Achievement (2006–2026) | `/awards/africa-education-icon` | 1 hub + honour roll |
| 4 | Influencers Education Impact 2026 | `/awards/influencers-education-impact` | 3 sub |
| — | Master Index | `/awards/categories` | 1 |

## 2. Category architecture table (Keep / Merge / Rename / Redirect)

### Blue Garnet (competitive, voting-enabled)
| # | Final Title | New URL | Merged From | Status |
|---|---|---|---|---|
| 1 | Best NGO Contribution to Education (Africa) | `/awards/blue-garnet-categories/ngo-education-africa` | `/categories/ngo-africa` | Rename + redirect |
| 2 | Best NGO Contribution to Education (Nigeria) | `/awards/blue-garnet-categories/ngo-education-nigeria` | `/categories/ngo-nigeria` | Rename + redirect |
| 3 | Best CSR in Education (Africa) | `/awards/blue-garnet-categories/csr-education-africa` | `/categories/csr-africa`, `/categories/csr` | Merge |
| 4 | Best CSR in Education (Nigeria) | `/awards/blue-garnet-categories/csr-education-nigeria` | `/categories/csr-nigeria` | Rename + redirect |
| 5 | Best EduTech Organisation (Africa) | `/awards/blue-garnet-categories/edutech-africa` | `/categories/edutech-africa` | Rename + redirect |
| 6 | Best STEM Education Champion (Africa) | `/awards/blue-garnet-categories/stem-education-africa` | `/categories/stem-africa` | Rename + redirect |
| 7 | Best Media in Educational Advocacy (Nigeria) | `/awards/blue-garnet-categories/media-advocacy-nigeria` | `/categories/media-nigeria` | Rename + redirect |
| 8 | Creative Arts Education Impact (Nigeria) | `/awards/blue-garnet-categories/creative-arts-nigeria` | `/categories/creative-arts-nigeria` | Rename + redirect |
| 9 | Best Education-Friendly State (Nigeria) | `/awards/blue-garnet-categories/education-state-nigeria` | `/categories/education-state-nigeria` | Rename + redirect |

### Platinum Certificate (institutional, jury-only)
| # | Final Title | New URL | Merged From | Status |
|---|---|---|---|---|
| 10 | Best Library in Nigerian Tertiary Institutions | `/awards/platinum-certificate-categories/library-nigeria` | `/categories/library-nigeria` | Rename |
| 11 | Best R&D Contribution to Education (Nigeria) | `/awards/platinum-certificate-categories/rd-nigeria` | `/categories/rd-nigeria` | Rename |
| 12 | Christian Education Impact (Africa) | `/awards/platinum-certificate-categories/christian-education-africa` | `/categories/christian-africa` | Rename |
| 13 | Islamic Education Impact (Africa) | `/awards/platinum-certificate-categories/islamic-education-africa` | `/categories/islamic-africa` | Rename |
| 14 | Political Leaders' Contribution to Education (Nigeria) | `/awards/platinum-certificate-categories/political-leaders-nigeria` | `/categories/political-nigeria` | Rename |
| 15 | International / Bilateral Education Partnerships | `/awards/platinum-certificate-categories/international-education` | `/categories/international` | Rename |
| 16 | Diaspora Association Educational Impact | `/awards/platinum-certificate-categories/diaspora-impact` | `/categories/diaspora-impact` | Rename |

### Africa Education Icon (lifetime, by-invitation)
| # | Final Title | New URL | Merged From | Status |
|---|---|---|---|---|
| 17 | Africa Education Icon Lifetime Achievement 2006–2026 | `/awards/africa-education-icon` | `/categories/africa-icon`, `/awards/icon-award` | **Merge** (two pages → one canonical) |

### Influencers Education Impact 2026 (new group, 3 sub)
| # | Final Title | New URL | Status |
|---|---|---|---|
| 18 | Influencers Hub | `/awards/influencers-education-impact` | **New** |
| 18a | Africa Sports — Education Impact | `/awards/influencers-education-impact/sports` | New sub |
| 18b | Africa Music — Education Impact | `/awards/influencers-education-impact/music` | New sub |
| 18c | Africa Social Media — Education Impact | `/awards/influencers-education-impact/social-media` | New sub (merges "Digital Voices", "Education Advocate", "Creator" overlaps) |

### Archived/folded
- `/awards/gold` & `/awards/gold-special-recognition` → kept as Special Recognition track, linked from master index (not a competitive category group).
- `DigitalVoices` page → 301 to `/awards/influencers-education-impact/social-media`.

## 3. Shared page template

Every category page renders via one component `<AwardCategoryPage>` that takes a config object with these fields (this is the answer to the "produce for every category" requirement):

```
finalName, group, url, parentPage, shortDescription,
eligibilitySummary, whoCanBeNominated, whoCanNominate,
requiredEvidence, reviewMethod, votingRole, judgingRole,
integrityDisclaimer (shared constant), sponsorDisclaimer (shared constant),
ctaNominateHref, relatedCategories[], seoTitle, metaDescription,
faqs[], schema (JSON-LD: Event + FAQPage + BreadcrumbList)
```

Configs live in `src/config/awardCategories/` (one file per group, exporting arrays). The template renders the existing branded hero/words/directory blocks for visual continuity, then appends the new structured sections.

## 4. Shared integrity + sponsor disclaimers

Single constants in `src/config/awardCategories/disclaimers.ts`:

- **Integrity**: the exact NESA-Africa paragraph specified in the brief.
- **Sponsor**: "Category sponsorship supports visibility and programme delivery only. Sponsors, partners, endorsers and donors cannot nominate, shortlist, vote, judge, or determine winners."

Rendered at the bottom of every category page + index.

## 5. Master index `/awards/categories`

New `CategoryMasterIndex.tsx` with:
- Hero + intro to 2026 structure
- 4 group explainer cards (Blue Garnet, Platinum, Icon, Influencers)
- Filter bar: sector, role (individual/institution), country, institution type, impact area
- Search input (client-side over the config array)
- Grouped list of all category links
- Nominate CTA + Category FAQ accordion + Integrity statement

Old `/categories` and `/awards` index → 301 to `/awards/categories`.

## 6. Redirect map (implemented as `<Navigate replace>` in `App.tsx`)

```
/categories                            → /awards/categories
/categories/:slug                      → /awards/<group>/<slug>   (per table above)
/awards/icon-award                     → /awards/africa-education-icon
/awards/digital-voices                 → /awards/influencers-education-impact/social-media
/awards/gold                           → /awards/categories#special-recognition
```

All 301-equivalent (SPA replace navigation; SEO canonical updated on destination page).

## 7. Per-page FAQs (template — 8 questions each)

1. Who is eligible for this category?
2. Who can nominate?
3. What evidence is required?
4. Is there public voting?
5. How is the category reviewed?
6. Can sponsors influence this category?
7. When will finalists or winners be announced?
8. How do I nominate someone for this category?

Answers are config-driven per category.

## 8. SEO

- Per-page `<title>` ≤ 60 chars, `<meta description>` ≤ 160 chars.
- JSON-LD: `Event` (the award), `FAQPage`, `BreadcrumbList`.
- Canonical = new URL.
- `sitemap.xml` regenerated via `scripts/generate-sitemap.ts` after route changes.

## 9. File changes (technical)

**New**
- `src/config/awardCategories/disclaimers.ts`
- `src/config/awardCategories/blueGarnet.ts`
- `src/config/awardCategories/platinum.ts`
- `src/config/awardCategories/icon.ts`
- `src/config/awardCategories/influencers.ts`
- `src/config/awardCategories/index.ts` (aggregator + types)
- `src/components/awards/AwardCategoryPage.tsx` (shared template)
- `src/components/awards/CategoryFaqSection.tsx`
- `src/pages/awards/CategoryMasterIndex.tsx`
- `src/pages/awards/groups/BlueGarnetIndex.tsx`
- `src/pages/awards/groups/PlatinumIndex.tsx`
- `src/pages/awards/groups/InfluencersIndex.tsx`
- `src/pages/awards/categories/[slug].tsx` (route-level wrapper resolving config)

**Edited**
- `src/App.tsx` — new routes + 30+ `<Navigate>` redirects
- `src/config/navigation.ts` — Awards menu points at new URLs
- `src/config/page-sequence.ts` — updated for new pagination
- `ROUTES.md` — documents new map
- Existing `src/pages/categories/*.tsx` → thin redirect shims (delete after migration verified)

**Deleted (after redirects confirmed)**
- 17 standalone category page files folded into config

## 10. Out of scope (deferred)

- Actual content rewrites for influencer sub-categories beyond skeleton config (requires editorial input).
- Backend `categories` table changes — current `slug` field already accepts the new slugs; only the routing layer changes.
- Sponsor/judge dashboards remain on existing routes.

## Rollout

1. Land config + template + master index + 4 group indexes.
2. Land per-category dynamic route `[slug]` driven by config.
3. Land redirects.
4. Update navbar + sitemap.
5. Remove orphaned old page files.
6. Run `scripts/generate-sitemap.ts` and ship.
