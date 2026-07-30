# Award Pages Module — Recovered Baseline & Gap Audit

**Date:** 2026-07-30
**Baseline recovered from:** `docs/refactor/d0-category-architecture.md` (LOCKED, 2026-07-28) —
the latest approved production specification. Earlier variants (Doc 25 "18 forms",
"Hybrid 4 hubs + 22 lean anchors", the 9-category/135-subcategory model from Jan 2026)
are **superseded** and must not be used as the baseline.

## 1. Approved baseline (recap)

| Item | Approved value |
| --- | --- |
| Tier overview pages | 4 (Icon · Influencer · Platinum · Gold-Blue Garnet) |
| Category pages | 22 (3 + 3 + 7 + 9) |
| Nomination forms | 22 (one per category page) |
| Public pages total | 43 (17 primary + 26 secondary) |
| Page template | 14 locked sections |
| Slug source of truth | `src/config/awardCategories/` + `src/config/recognition2026/categories/` |

14-section template: Hero · About · Eligibility · EDI Matrix · Evidence & Cure Window ·
Nomination form · Nominees strip · Timeline · FAQ · Governance note · Sponsor firewall ·
Endorse/Share · Related categories · CTA band.

## 2. What is already implemented

- **Content registry for all 22 subpages** — `src/config/awards/subpages2026.ts`
  generates every subpage from the canonical taxonomy, with `OVERRIDES` for copy.
- **Rendering template** — `src/components/awards/subpage/AwardSubpageTemplate.tsx`
  (`AwardSubpageContent`: hero + image, integrity notice, recognises, whoItsFor,
  examples, geography, EDI, steps, FAQs, breadcrumbs, SEO/canonical).
- **Routing** — `src/pages/recognition/AwardSubpageRoute.tsx` (`/recognition/subpage/:slug`),
  plus 4 tier overview pages and legacy redirect map (`buildRedirectMap()`).
- **Per-category hero imagery** — `src/config/awards/subpageHeroImages.ts`.
- **Nomination surface** — `src/pages/nominate/NominateHub2026.tsx` +
  `NominateCategoryShell.tsx` (locked 7-section institutional layout),
  `CategoryNominationForm.tsx`, `NativeCategoryNominationForm.tsx`,
  per-category EDI matrices (`src/config/nominate2026/ediMatrix.ts`).
- **Governance/eligibility/FAQ content** — `awardPageContent.ts`, `faqBuilder.ts`,
  `disclaimers.ts`.
- **Backend primitives that already exist** — tables `award_categories`, `categories`,
  `subcategories`, `recognition_categories`, `recognition_subcategories`,
  `content_pages`, `media_assets`, `media`, `gallery_collections`, `gallery_media`,
  `sponsors`, `sponsor_links`, `sponsor_campaigns`, `platform_config`.
- **CMS layer** — `src/lib/cms/` adapter abstraction (Lovable Cloud adapter live)
  for pathway cards, categories, subcategories, nominees.
- **Admin surfaces** — `AdminPathwaysCMS`, `GalleryAdmin`, `NomineeMediaLibrary`,
  `AdminContributorsCMS`, `AdminImpact`.

## 3. Partially implemented

| Area | State |
| --- | --- |
| 14-section template | Template renders ~10 of 14 sections. Missing/thin: nominees strip on subpages, related categories, endorse/share, per-award timeline. |
| Per-award branding | Hero image per subpage exists; **no per-award colour theme, icon, banner set or logo lockup**. All pages share charcoal/gold. |
| Nomination forms | 22 category-scoped forms resolve, but several still fall back to the shared native form / Google Form resolver rather than a category-specific field set. |
| CMS | Adapter exists for taxonomy + pathway cards only. Award page copy, FAQs, timeline, terms are **file-based (TS configs)**, not editable in the admin. |
| Sponsors | Global sponsor components/tables exist; **not scoped per award**. |
| Galleries | `gallery_collections` / `gallery_media` exist with an admin, but are not bound to an award/category. |

## 4. Missing

1. **Per-award theming system** — theme tokens (accent, gradient, seal, banner, icon)
   keyed by award slug.
2. **Award-scoped media** — image gallery + YouTube embeds (URL only, no video storage)
   attached to an award/category.
3. **Award-specific countdown** — per-award open/close/announce dates surfaced as a
   countdown block (currently one global gala countdown).
4. **Award-scoped sponsors, partners, testimonials.**
5. **Content sections:** Benefits, Terms & Conditions, per-award Timeline.
6. **Dynamic CMS management** for award pages / categories / graphics / forms
   (no `award_pages`, `award_media`, `award_sponsors`, `award_testimonials`,
   `award_faqs`, `award_form_fields` tables; no admin editor).
7. **API/edge endpoints** for reading award page bundles with caching.

## 5. Requires updating

- `getTotalAwardFormCount()` must return **22** post-cutover (D0 note).
- Register all 22 canonical routes explicitly in `src/App.tsx` (D0 forbids a single
  dynamic tier-hub route for the 22 links); `/recognition/subpage/:slug` should become
  the internal renderer behind canonical per-category URLs.
- `AwardSubpageContent` needs new optional blocks: `theme`, `gallery`, `videos`,
  `countdown`, `sponsors`, `partners`, `testimonials`, `benefits`, `terms`, `timeline`.
- CMS adapter must gain `fetchAwardPage(slug)` with file-config fallback so nothing
  breaks while content migrates.

## 6. Step-by-step implementation plan (non-breaking)

**Phase 1 — Contract extension (frontend only, additive)**
1. Extend `AwardSubpageContent` with the optional blocks listed above.
2. Render each new block in `AwardSubpageTemplate` only when present.
3. Add `src/config/awards/awardThemes.ts` — accent/gradient/icon/banner per award slug,
   expressed as HSL design tokens in `index.css` (no hardcoded colour utilities).

**Phase 2 — Content completion (file-based, still no DB dependency)**
4. Fill the 4 remaining template sections (nominees strip, related categories,
   endorse/share, per-award timeline) via existing components.
5. Author benefits + terms + per-award countdown dates in `subpages2026.ts` overrides,
   sourcing dates from `src/config/programme.ts` (14 Dec 2026 remains global).

**Phase 3 — Database & CMS**
6. Migration: `award_pages`, `award_sections`, `award_media` (image URL or YouTube URL,
   `kind` enum), `award_sponsors`, `award_testimonials`, `award_faqs`,
   `award_form_fields`. Each with GRANTs (`select` to `anon`/`authenticated` for
   published rows, `all` to `service_role`), RLS enabled, admin-only writes via
   `has_role(auth.uid(),'admin')`.
7. Add `fetchAwardPage(slug)` to `src/lib/cms/adapters/lovableCloud.ts`, with the TS
   config as the fallback when no published row exists — guarantees zero regression.
8. Build `/admin/awards-cms`: page list → section editor, media manager (image upload +
   YouTube URL field), sponsors/testimonials/FAQ editors, form-field builder.

**Phase 4 — Forms**
9. Drive `NativeCategoryNominationForm` field sets from `award_form_fields` with the
   current static schema as fallback; keep StageGate + NRC pipeline untouched.
10. Flip `getTotalAwardFormCount()` to 22 and update `siteStats`.

**Phase 5 — Verification**
11. Route snapshot diff against `docs/refactor/_snapshot-2026-routes.txt`.
12. Vitest coverage: every award slug resolves content, theme, and a form.
13. Playwright pass over all 22 pages (sections present, no console errors, SEO tags).
14. Security scan + linter after the migration.

**Guardrails:** additive-only schema, fallback-first reads, no changes to voting-free
governance copy, charcoal/gold remains the base theme with per-award accents layered on.
