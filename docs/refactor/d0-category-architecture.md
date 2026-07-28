# D0 — Category Page Architecture (LOCKED)

**Status:** Resolved — 2026-07-28
**Decision:** **Option A — 22 standalone pages**

## Resolution

Every Recognition mega-menu link resolves to its own full page. No shared
tier-hub anchors, no collapsed Icon/Influencer pathway pages.

| Tier                          | Overview page | Category pages |
| ----------------------------- | ------------- | -------------- |
| Africa Education Icon         | 1             | 3              |
| Influencer Education Impact   | 1             | 3              |
| Platinum                      | 1             | 7              |
| Gold-Blue Garnet              | 1             | 9              |
| **Totals**                    | **4**         | **22**         |

**Secondary public pages:** 4 + 22 = **26**
**Total public pages:** 17 primary + 26 secondary = **43**
**Nomination forms:** **22** (one per category page — supersedes the Doc 25
"18 forms" model where Icon's 3 pathways and Influencer's 3 categories
shared a single form).

## Per-category page template (locked)

Each of the 22 pages ships with the standard 14-section template used on the
existing Platinum/Blue Garnet category pages:

1. Hero (name, tier badge, phase status)
2. About this Recognition
3. Eligibility & Universal Criteria
4. Category-specific EDI Matrix (per `src/config/nominate2026/ediMatrix.ts`)
5. Evidence requirements & Cure Window
6. Nomination form (category-scoped, StageGate-guarded)
7. Nominees strip (filtered to this category)
8. Timeline / phase gates
9. FAQ
10. Governance & Integrity note
11. Sponsor firewall banner (where applicable)
12. Endorse / Share (nominee-facing)
13. Related categories
14. CTA band (Nominate · Directory · Download EDI Matrix)

## Implementation notes

- Category slugs are the canonical source in
  `src/config/awardCategories/`. Each of the 22 must have its own route
  registered in `src/App.tsx` — no shared dynamic tier-hub routes for the
  22 links.
- Icon pathways (Philanthropy · Literary & New Curriculum · Technical
  Education) each get their own page and their own form; the shared 9-step
  Icon wizard becomes the form body on all three, scoped by pathway.
- Influencer categories (Social Media · Sports · Music) each get their own
  page and their own scoped form built from
  `InfluencerNominationForm.tsx`.
- `getTotalAwardFormCount()` in
  `src/config/nomination/awardCategoryForms.ts` must return **22** (before
  Africa-regional expansion) once cutover is complete. Regional expansion
  is orthogonal and unchanged.

## Supersedes

- Doc 25's "18 main nomination forms" collapsed-pathway model.
- Any earlier "Hybrid (4 hubs + 22 lean anchors)" language in prior
  clarifications.
