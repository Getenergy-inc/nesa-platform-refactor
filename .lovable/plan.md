## Goal
Wire every Nominate CTA on NESA.Africa to the correct Google Form intake (23 award category forms + 8 RMSA regional school forms), using a central config so forms, subcategories, and statuses are editable in one place. Google Forms is the MVP intake; backend nomination stays roadmap.

## Important: Output required before implementation
Per section 23 of your brief, a **Nomination Form Mapping Table** must be produced and approved before any code change. I will produce that table as the first deliverable. I cannot invent the Google Form public URLs, embed URLs, or Google Sheet IDs — those need to be created in the Gmail accounts you listed and pasted into the config. The table will mark them as `Link Pending` until you supply them.

## Deliverables (in order)

### Phase 0 — Mapping table (no code yet)
- `docs/NOMINATION_FORM_MAPPING.md` — full 23 + 8 row table with all 21 columns from section 23. Statuses default to `Link Pending`. You review/edit, then approve.

### Phase 1 — Central configuration
- `src/config/nomination/awardCategoryForms.ts` — 23 award categories: family, group, slug, name, gmail, formEmbedUrl, formPublicUrl, sheetName, status, lastUpdated, reviewer, dataLead, notes, subcategories[].
- `src/config/nomination/awardSubcategories.ts` — subcategory lists per category (uses your section 9 examples; placeholder lists for remaining categories, editable).
- `src/config/nomination/rmsaRegionalForms.ts` — 8 RMSA regional forms with same shape.
- `src/config/nomination/types.ts` — shared types + status enum (`Active | Draft | Coming Soon | Link Pending | Closed | Replaced`).

No Gmail passwords anywhere. Only public form/sheet URLs once you provide them.

### Phase 2 — /nominate page update
Update `src/pages/NominateFlow.tsx` (or add a new MVP route variant) to support the Google-Form-first flow:
1. Hero + flash message (section 4 copy verbatim).
2. Family selector (4 cards — Icon, Gold-Blue Garnet, Platinum, Influencer).
3. Category selector filtered by family, honoring `?family=`, `?category=`, `?subcategory=`, `?region=` URL params.
4. Subcategory selector per category.
5. Integrity notice + evidence reminder.
6. Google Form embed (iframe) + "Open Form in New Tab" fallback.
7. Status handling: Active → embed; Link Pending / Draft / Coming Soon → "form being prepared" message with `nesa.africa@gmail.com`; Closed → closed message; Replaced → redirect.
8. Links to Existing Nominees, Guidelines, Support.

### Phase 3 — /impact/nominate-school page
- New page `src/pages/impact/NominateSchool.tsx` + route in `App.tsx`.
- 8 region cards; honors `?region=` deep links.
- Flash message, integrity notice, embed + open-in-new-tab fallback, EduTourism 2027 and Rebuild donation explainer panels, contact link.

### Phase 4 — Global CTA audit
Rewrite Nominate CTAs across the site per section 3 mapping. Scope:
- Homepage hero / footer
- Awards Hub, Award Family pages, Award Category pages, Subcategory sections
- Nominees index, Nominee profile
- Regional pages
- Impact program page
Ensure none route to `/login`, `/register`, `/dashboard`, `/admin`. Replace any `Vote & Earn AGC` copy with `Nominate & Earn AGC Voting Coin` where applicable.

### Phase 5 — QA + docs
- Run the section 24 checklist; record pass/fail in `docs/NOMINATION_QA_REPORT.md`.
- Extend existing `src/pages/__tests__/NominateFlow.lang.test.tsx` with deep-link tests for `?family=`, `?category=`, `?subcategory=`, `?region=` selection persistence.
- Confirm mobile rendering of embeds.

## What I need from you to proceed
1. **Approve the plan** (or request edits).
2. After Phase 0 mapping table is generated, supply for each form (or confirm they should stay `Link Pending`):
   - Google Form **public URL** (`/viewform`)
   - Google Form **embed URL** (`/viewform?embedded=true`)
   - Linked Google Sheet name (for documentation)
3. Confirm the 24 subcategory placeholder lists for the 18 categories not covered by section 9 examples (you can edit the config file after I scaffold it).
4. Confirm: do you want the existing rich multi-step `NominateFlow` preserved as a secondary path, or fully replaced by the Google-Forms MVP flow? My recommendation is **replace for now** since the brief says "Google Forms as MVP intake while backend nomination portal remains future roadmap."

## Out of scope (explicitly not touched)
- Public navigation, admin/dashboard/wallet/voting analytics/NRC/Judges Arena routes.
- Backend nomination DB writes (Google Forms is the only intake this round).
- Gmail account creation, password management, 2FA setup — those are operational tasks on your side.
- Creating the actual Google Forms / Sheets in Google Workspace — I have no access to those Gmail accounts.

## Technical notes
- All copy/labels go through `nomination` i18n namespace where currently localized; new strings added with English defaults so the existing 11-language coverage continues to work after translators fill in.
- Status enum drives one switch in the form-display component — no per-category branching.
- Embeds use `<iframe loading="lazy" referrerpolicy="no-referrer">` with min-height 1600 on desktop, full-width on mobile; "Open in New Tab" always visible.
- Region slugs align with the existing `src/lib/regions.ts` taxonomy (West / East / Central / Southern / North / Sahel / Horn / Indian Ocean Islands) so the regional switcher and `?region=` work end-to-end.
