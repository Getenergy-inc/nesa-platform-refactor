
# Refactor: 17 Dedicated Category Nomination Pages

All 17 URLs already route through a single component (`src/pages/nominate/NominateCategoryShell.tsx`), so this is a **shell refactor + config expansion**, not 17 separate page rewrites. No new routes.

## Scope

Update in place:
- `/nominate/influencer-education-impact`
- 7× `/nominate/platinum/:category`
- 9× `/nominate/gold-blue-garnet/:category`

Untouched: Icon page, /nominate hub, site nav/footer.

## Design system (all 17 share it)

Match the live Icon page exactly — reuse existing nav, announcement bars, hero shell, card/button/select components.
- bg `#0c0e13`, card `#15181f`, border `#2b3140`
- Single gold `#d9a441` / dim `#8a6f34` — strip any tier-specific hue (teal/silver/garnet-red) currently on these pages
- Playfair display for headings, system sans for body

## Section order (identical on every page)

1. Hero — tier badge, H1, italic tagline, description, 3 buttons: `Start Nomination` (#nominate), `Explore Existing Nominees` (#nominees), `Back to All Categories` (/nominate)
2. **Nomination form** (`#nominate`) — immediately after hero, not at the bottom
3. About This Category — two-column: paragraphs + 3 pillars (NRC-Verified · Non-competitive · Certificate on approval)
4. Certificate Categories / Recognition Pathways — subcategory cards (Influencer uses 3 full pathway blocks matching Icon)
5. **EDI Matrix** (`#edi-matrix`) — 10 core dimensions, two-column, category-specific weighting note, PDF download button (new section on most pages)
6. Existing Nominees (`#nominees`) — real data or honest empty state, never fabricated
7. Footer integrity line — category-specific wording

## Per-category form logic

Category-specific step 1 → shared skeleton (Classification → Nominee info → Evidence (≥2 sources) → Nominator/Declaration → "what happens next" ending "Certificate of Recognition released immediately on approval — no endorsement threshold.")

**Step 1 pathway selectors:**
| Category | Selector |
|---|---|
| Influencer | pathway dropdown (Social Media / Sports / Music) → dependent recognition-area dropdown (10 each) |
| 7 Platinum | single dropdown, 10 certificate options each (exact approved wording) |
| CSR Africa, CSR Nigeria, NGO Africa | dual dropdown: region/zone → sector/programme |
| EduTech, Media, NGO Nigeria, STEM, Creative Arts | single dropdown, 10–15 options |
| Education-Friendly States | 6 certificate-name dropdown + 12-tag multi-select impact grid |

**Classification sets:**
- Influencer, 7 Platinum, CSR (Africa), EduTech, NGO (Africa), STEM → `African in Africa / Diaspora African / Friend of Africa`
- CSR (Nigeria), Media (Nigeria), NGO (Nigeria), Creative Arts (Nigeria) → `Nigerian in Nigeria / Nigerian in Diaspora / Friend of Nigeria`
- Education-Friendly States → "Nominating capacity": State Ministry / Citizen or resident / Institutional or NGO

## Governance copy (verbatim per tier)

- **Influencer** — "Not a competition. No judges, no public voting. Recognition is based entirely on Nominee Research Corps verification and category EDI Matrix assessment — never on follower count or fame."
- **Platinum** — "Institutional recognition. No judges, no voting, no competition. Multiple organisations may be recognised in the same category after Nominee Research Corps verification and Governance approval."
- **Gold-Blue Garnet** — "Entirely evidence-based. No judges, no voting, no ranking. Multiple organisations may be recognised per category, region, or sector."

Footer integrity: "Recognition in this category is based on verified education contribution, not popularity or public vote — verified by the Nominee Research Corps and approved by Governance." (adapted per category, same structure)

No 5,000-endorsement gate, no public-vote language, no AGC unlock on these 17 pages.

## Empty nominees state (when zero verified)

```
🕊 No Verified Nominees Yet
This category is newly open for nominations. Once nominees are accepted and
verified by the Nominee Research Corps, their profiles will appear here.
```
Real cards (photo, name, country, pathway tag, classification, verified-impact one-liner, NRC-Verified badge, profile link) only when the live DB returns verified rows for that category.

## Technical plan

**Config-first — one shell, driven by data:**

1. `src/config/nominate2026/categoryContent.ts` (new) — for each of 17 category slugs:
   - hero copy (H1, tagline, description)
   - tier + tier badge label
   - governance blurb key (influencer/platinum/gbg)
   - classification set key (africa/nigeria/state-capacity)
   - pathway selector shape (single / dependent / dual / dropdown-plus-tags) + option lists (exact approved wording)
   - subcategory card list
   - EDI weighting note + PDF href
   - footer integrity sentence
   - nominee-info field overrides (e.g. "Head librarian", "Jurisdiction")

2. `src/config/nominate2026/ediMatrix.ts` — already exists; reuse the 10 core dimensions per category. Verify all 17 slugs resolve; fill gaps.

3. `src/pages/nominate/NominateCategoryShell.tsx` — replace with the new 7-section layout above. Renders driven purely by `categoryContent[slug]`. Anchors `#nominate`, `#edi-matrix`, `#nominees` wired to hero buttons.

4. New reusable sections under `src/components/nominate/category/`:
   - `CategoryHero.tsx`
   - `CategoryAboutPillars.tsx`
   - `CategorySubcategoryCards.tsx` (+ `InfluencerPathwayBlocks.tsx` variant)
   - `CategoryEDIMatrix.tsx` (two-column, PDF button, mobile stack)
   - `CategoryExistingNominees.tsx` (queries verified nominees for the category via existing `nomineesApi`; empty state fallback)
   - `CategoryFooterIntegrity.tsx`

5. Form (`src/components/nominate/category/CategoryNominationForm.tsx`) — reuses existing `NativeCategoryNominationForm` skeleton for Classification/Nominee/Evidence/Nominator/Declaration steps; step 1 renders one of 4 selector variants from config.

6. Strip old tier accent tokens (teal/silver/garnet-red) referenced by these pages — replace with shared gold token. Sweep only files these 17 pages import.

7. Mobile: EDI two-column → single; dual dropdowns stack; tag grid stacks.

## Out of scope

- Icon page, /nominate hub, global nav/footer, unrelated routes
- New nominee data (empty state only until DB has verified rows)
- New UI dependencies

## Deliverables

- 1 new content config, 1 rewritten shell, 6 new section components, 1 form component
- All 17 URLs render the unified structure; no route changes
- Anchors verified; mobile stack verified; no fabricated nominees
