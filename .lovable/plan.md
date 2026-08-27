# Template Comparison Report — Icon vs Influencer vs Detailed Category

Investigation only. No files were changed.

## 1. AfricaEducationIcon.tsx (reference, 427 lines)

Section order:
1. Helmet SEO + `BreadcrumbJsonLd`
2. **Hero** — full-bleed dark section, `bg-gradient-to-b from-black via-charcoal to-charcoal-light`, decorative gold radial-gradient overlay at 8% opacity, centered `max-w-4xl`, framer-motion fade-up. Contains: crown pill badge, `font-display` h1 up to `text-6xl` with a gold-coloured fragment, subhead, a **4-up inline stat grid** (rounded gold-bordered tiles, gold numerals), two CTAs (primary gold "Nominate", outline "Explore Existing Nominees"), and a trust line with a shield icon.
3. **Pathways** — 3 subcategory cards with icon chip, live count badge, hover gold glow shadow.
4. `CategoryNomineeDashboard categorySlug="africa-education-icon-award"` (shared component)
5. **Classifications** — 3 cards, each with a nested list of pathway × classification counts.
6. **Selection Process** — 6 numbered step cards + trust chips row.
7. **Hall of Fame preview** — 8 `NomineeCard` (from `@/components/iconAward/shared`) + 3 per-pathway quick links.
8. **Final CTA** — centered, sparkles icon, two buttons.

Visual signature: whole page sits on `bg-charcoal`, every section is dark; `font-display` headings; eyebrow labels in `text-[11px] uppercase tracking-[0.18em] text-gold`; rounded-2xl gold-tinted cards; framer-motion `whileInView` stagger. There is **no on-page nomination form** — CTAs anchor to `#nomination-form` (which does not exist on this page) or link out to `/nominate?category=...`. That anchor is a live bug worth noting.

## 2. InfluencerSubcategoryPage.tsx (498 lines, 3 pages)

Section order: tier ribbon → breadcrumb → **card hero** (rounded-2xl bordered box inside a `max-w-5xl` container, optional background photo at 30% opacity, tier eyebrow, h1, italic supporting statement, intro paragraphs, 4-up `quickInfo` `<dl>` tiles, 2 CTAs) → sticky jump nav (11 anchors) → then a long stack of narrow uniform `Section` blocks: Overview, Who, Geography, Eligibility, Evidence, Impact Questions, Directory → `CategoryNomineeDashboard` → **Nomination form inline** (`InfluencerNominationForm`) → Review → Integrity → FAQs → sibling subcategories → final CTA.

Differences from Icon: constrained document layout instead of full-bleed sections; hero is a boxed card, not a gradient band; no stat grid tied to live counts (only static `quickInfo`); heading scale is `text-xl/2xl` gold rather than large white display; no motion; but it *does* embed the real nomination form on-page and has a sticky jump nav Icon lacks.

## 3. DetailedCategoryPageTemplate.tsx (426 lines, 16 pages)

S1 Hero (dark, `max-w-6xl`, `font-serif`, badges, 3 CTAs — no stats grid) → S2 Overview 3-col → S3 Enabler story → S4 Who Qualifies + EDI matrix table + threshold bands → S5 Subcategories cards → S6 Benefits 4-up → S7 Nomination CTA band → S8 Recognition Timeline → S9 `CategoryNomineeDashboard` (falls back to `BrandedNomineeDirectory` when no mapped slug) → S10 Evidence submission → S11 Recognition Package → S12 Trust → S13 FAQs (+ tail sections).

Differences from Icon: light theme — S2/S6/S8/S10/S12 use `bg-background`, alternating `bg-muted/30`; `font-serif` not `font-display`; shadcn `Card`/`Accordion` primitives instead of hand-rolled gold-bordered tiles; only the hero and S7 are dark. It already consumes the branded label map (`getCategoryDisplayName`) and tier accents (gold vs platinum slate). No inline nomination form — S7 links to `/nominate`.

## 4. Is Icon's layout extractable?

Mostly yes. Only two things on the Icon page are genuinely bespoke:
- `NomineeCard` from `@/components/iconAward/shared` and the `ICON_*` static dataset (`bySubcategory`, `byClassification`, `featured`).
- The Classifications section, which depends on a 3×3 pathway × classification grid that no other category has.

Everything else — hero band, gradient + radial overlay, badge, stat grid, eyebrow/heading pattern, motion card grid, numbered process steps, final CTA — is plain Tailwind over generic props and can be lifted into shared pieces:

```text
src/components/awards/branded/
  BrandedCategoryHeroBand.tsx   eyebrow badge, title (+gold fragment), subhead,
                                stats[] tiles, primary/secondary CTA, trust line
  BrandedSectionHeading.tsx     eyebrow + h2 + lede
  BrandedProcessSteps.tsx       numbered step cards + trust chips
  BrandedFinalCta.tsx           centered closing CTA
```

Adoption without a rewrite:
- **InfluencerSubcategoryPage**: swap the boxed header for `BrandedCategoryHeroBand` (map `quickInfo` → `stats`, keep hero image as an optional prop). Keep the jump nav, `Section` stack, and inline form. ~1 section changed.
- **DetailedCategoryPageTemplate**: swap S1 for the same hero band, feed it live counts from the dashboard query, and optionally re-skin S8 with `BrandedProcessSteps` and the tail CTA with `BrandedFinalCta`. Body sections can stay as-is initially.

## 5. Risks in making the 16 pages look like Icon

- **Icon-specific data assumptions**: Icon's stat grid uses `ICON_SUBCATEGORIES.length` / `ICON_CLASSIFICATIONS.length` / hardcoded `9 laureates`. Other categories have no classifications and no fixed laureate count — the stats array must be a prop, not baked in. The Classifications and Hall-preview sections should **not** be generalised.
- **Theme collision**: the 16 pages are light-themed with `bg-background`/`bg-muted/30` and shadcn `Card`s. Making only the hero dark is safe; converting whole pages to `bg-charcoal` means auditing every `text-muted-foreground`, `Card`, `Accordion`, and the EDI `<table>` for contrast — that is the expensive part, and where accessibility regressions would appear.
- **Typography split**: Icon uses `font-display`, the 16 pages use `font-serif`. Pick one for the shared hero or expose it as a prop, otherwise headings will drift across the site.
- **Platinum tier**: `tierAccent()` renders slate accents for platinum pages. A gold-hardcoded hero would erase that distinction unless the accent is passed through.
- **Existing anchor bug**: Icon's hero CTA points at `#nomination-form`, which does not exist on that page. If the hero is extracted as-is, the broken anchor propagates. The Influencer pages are the only ones with a real `#nomination-form`.

## Open question

Do you want the shared hero applied to **all 19 pages** (Icon + 3 Influencer + 16 detailed), or hero-only on the 16 detailed pages first, leaving Influencer untouched? And should the 16 detailed pages go fully dark charcoal, or keep light bodies with a dark hero band?
