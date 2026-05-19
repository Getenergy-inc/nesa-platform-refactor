# NESA-Africa — Region-First Nominee Refactor Migration Report

_Generated: 2026-05-19T23:11:35.439Z_

## 1. Audit summary

- **Total nominees reviewed**: 320
- **Categories covered**: 14
- **Classification confidence**: high=316 · medium=0 · low=4
- **Duplicate slugs**: 24
- **Manual-review queue (unknown region)**: 4
- **Data-quality score**: 99/100
- **SEO readiness score**: 100/100 (all region pages ship Helmet title/description/canonical/OG/JSON-LD)

## 2. Counts per region

| Region | Nominees |
|---|---|
| west-africa | 268 |
| east-africa | 15 |
| north-africa | 12 |
| central-africa | 9 |
| southern-africa | 12 |
| unknown | 4 |

## 3. Counts per award category (top 20)

| Category | Count |
|---|---|
| The Overall Best CSR for Education in Nigeria Award 2025 | 130 |
| Overall Best Educational Friendly State in Nigeria 2025 | 52 |
| Best STEM Education Program or Project (Africa-Regional) | 39 |
| Diaspora Association Educational Impact in Africa | 30 |
| Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025 | 19 |
| Best NGO Education Support Recognition Award (Africa-Regional) | 14 |
| Creative Arts Industry Contribution to Education in Nigeria 2025 | 9 |
| Best EduTech Organization in Nigeria and Africa 2025 | 8 |
| The Best Library in Nigerian Tertiary Institutions Award 2025 | 4 |
| The Overall Best Research and Development Contribution by Research Institutes | 3 |
| Best Media and Advocacy for Education in Nigeria 2025 | 3 |
| Christian Faith Organization Educational Champion of the Decade Award | 3 |
| Islamic Faith Organization Educational Champion of the Decade Award | 3 |
| Political Leaders in Nigeria 2025 Recognition Award | 3 |

## 4. Duplicate slug detection

- `kaduna-state` → ids: 38, 51
- `kebbi-state` → ids: 39, 53
- `sokoto-state` → ids: 40, 54
- `bauchi-state` → ids: 42, 60
- `borno-state` → ids: 43, 58
- `yobe-state` → ids: 46, 59
- `jigawa-state` → ids: 47, 55
- `kano-state` → ids: 48, 52
- `katsina-state` → ids: 49, 57
- `zamfara-state` → ids: 50, 56
- `anambra-state` → ids: 62, 66
- `akwa-ibom-state` → ids: 67, 79
- `rivers-state` → ids: 68, 80
- `bayelsa-state` → ids: 69, 81
- `delta-state` → ids: 70, 82
- `flour-mills-of-nigeria` → ids: 131, 174, 211
- `flutterwave` → ids: 158, 222
- `slum2school-africa` → ids: 233, 306
- `actionaid-nigeria` → ids: 234, 244
- `atlar-algeria` → ids: 285, 314
- `andela-nigeria` → ids: 286, 315
- `waec-stem-hub` → ids: 287, 305
- `africa-teen-geeks` → ids: 310, 319
- `open-dreams` → ids: 313, 320

## 5. Manual-review queue (first 25)

- #289 **ALX Africa** — category: _Best STEM Education Program or Project (Africa-Regional)_ · country: `Multiple`
- #294 **Digital Opportunity Trust (DOT)** — category: _Best STEM Education Program or Project (Africa-Regional)_ · country: `Tanzania/Rwanda`
- #302 **Jesuit Refugee Service (JRS)** — category: _Best STEM Education Program or Project (Africa-Regional)_ · country: `DRC/CAR`
- #303 **Norwegian Refugee Council (NRC)** — category: _Best STEM Education Program or Project (Africa-Regional)_ · country: `DRC/CAR`

## 6. Classification logic

1. **country exact match** against the 5-region country map → confidence `high`.
2. **last comma-segment fallback** ("Lagos, Nigeria" → Nigeria) → `high`.
3. **region field** if non-N/A → `medium`.
4. **category-name heuristic** ("...Nigeria", "...West Africa", etc.) → `medium`.
5. Otherwise → `unknown` + `requiresManualReview=true`. No nominees fabricated.

## 7. New routes shipped

- `/nominees/west-africa` — region hub
- `/nominees/west-africa/:categorySlug` — category within region
- `/nominees/west-africa/:categorySlug/:subcategorySlug` — subcategory drill-down
- `/nominees/east-africa` — region hub
- `/nominees/east-africa/:categorySlug` — category within region
- `/nominees/east-africa/:categorySlug/:subcategorySlug` — subcategory drill-down
- `/nominees/north-africa` — region hub
- `/nominees/north-africa/:categorySlug` — category within region
- `/nominees/north-africa/:categorySlug/:subcategorySlug` — subcategory drill-down
- `/nominees/central-africa` — region hub
- `/nominees/central-africa/:categorySlug` — category within region
- `/nominees/central-africa/:categorySlug/:subcategorySlug` — subcategory drill-down
- `/nominees/southern-africa` — region hub
- `/nominees/southern-africa/:categorySlug` — category within region
- `/nominees/southern-africa/:categorySlug/:subcategorySlug` — subcategory drill-down

## 8. SEO

- 5 region hubs added to `scripts/generate-sitemap.ts` (priority 0.85, weekly changefreq).
- Per-page `<Helmet>`: title, description, canonical (https://nesaafrica.lovable.app), OG, CollectionPage + ItemList JSON-LD.
- Category and subcategory routes inherit canonicals dynamically.

## 9. Recommendations

- Backfill `country` for the 4 `unknown`-region records to lift data-quality score above 90.
- Consider promoting the country-to-region map into the canonical `src/lib/regions.ts` system to unify nominee + chapter + ambassador region logic.
- Generate region-specific OG images (e.g. `/og/region-west-africa.jpg`) for richer social previews.