# Governance Clarifications — NESA-Africa 2026

Short, authoritative resolutions for ambiguities that appeared across the
refactor document set. Each item below overrides any earlier document that
contradicts it.

---

## 1. EDI Matrix vs. ICON_SCORING_CRITERIA — two stages, one pipeline

These are **two distinct instruments used at two distinct stages**. They do
not compete and must not be merged.

| Instrument              | Owner              | Applies to        | Purpose                                                                                       | Output                                    |
| ----------------------- | ------------------ | ----------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **EDI Matrix**          | NRC (verification) | All 4 tiers       | Structural fit, evidence quality, category placement, category-specific development indicators | `NRC Verified` / `NRC Not Verified`       |
| **ICON_SCORING_CRITERIA** | Icon Judges panel  | Tier 1 (Icon) only | Comparative 100-point scoring feeding the 27 judges → 9 groups → 27 finalists → 9 laureates chain | Weighted score + tie-break chain + quorum |

**Sequence for Icon:** Draft → Submitted → NRC (EDI Matrix) → NRC Verified →
Governance Review → Judges Arena (ICON_SCORING_CRITERIA) → Finalist → Laureate.

**Sequence for Influencer / Platinum / Gold-Blue Garnet:** Draft → Submitted →
NRC (EDI Matrix) → NRC Verified → Governance Review → Recognition Approved →
Certificate Issued. No judges' panel scoring stage.

The line in Doc 27 that reads "Apply the official 100-point judging framework"
must be interpreted as **ICON_SCORING_CRITERIA, Icon judges only**. The EDI
Matrix is also a 100-point instrument but is applied by NRC, not judges, and
is not tier-specific in its use.

---

## 2. Influencer taxonomy — 6 structural subcategories + non-structural tags

Influencer has:

- **3 pathways** (structural): Social Media · Sports · Music.
- **2 structural subcategories per pathway** (6 total) — these are the units
  the EDI Matrix and the recognition schema operate against.
- **~10 impact area tags per pathway** (~30 total) — these are **discovery /
  filter tags** shown on the profile and directory. They are non-structural:
  they do not feed the schema, do not appear in stat pill counts, and do not
  have their own EDI Matrix.

Consequence: `site_stats.subcategories` counts the 6 Influencer structural
subcategories, not the ~30 tags. The nomination form's second dropdown
labelled with the ~10 items is bound to a `impact_area_tags[]` column, not to
`subcategory_id`.

---

## 3. Public stat framing — single count (updated per D0)

**Superseded by [D0 — Category Page Architecture](./d0-category-architecture.md).**
Under D0 Option A, forms and categories are 1:1 — every Icon pathway and
every Influencer category has its own dedicated page and its own form.

- **22 Recognition Categories** = **22 Nomination Forms** (per-page,
  StageGate-scoped). Region-expanded variants are orthogonal and not counted
  in the headline pill.
- **4 Tier Overviews** — hubs above the 22 category pages.
- **99 Subcategories** — curated public subset (D2). Full 250–300+ pathway
  list lives inside forms and NRC tooling.

The earlier dual-count framing ("18 forms / 22 categories") is obsolete —
`useSiteStats()` and `StatsStrip.tsx` must be updated to surface a single
`22 Categories · 22 Forms` line before public release.

---

## 4. Laureate count — 9 (final)

Icon produces **9 Laureates** via 27 judges → 9 specialist groups → Top 3
finalists per group → 27 Grand Jury finalists → 9 Laureates. Any doc citing
"27 Laureates" is superseded by Docs 25, 27, 28/29.
