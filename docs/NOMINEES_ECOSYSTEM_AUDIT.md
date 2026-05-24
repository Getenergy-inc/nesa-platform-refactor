# Existing Nominees Ecosystem — UX, IA & Conversion Audit

**Scope:** `nesa.africa/nominees` + landing page nominee sections
**Lens:** Senior international UI/UX, CRO, IA, branding, data engineering, mobile-first behavior
**Assumption:** ~95% of traffic is mobile
**Goal:** Move from *“trending nominee cards, scattered”* → *“Explore Existing Nominees by Award Category”* — a structured, premium, mobile-first discovery system.

---

## 1. Executive Summary

### What's broken today
1. **No mental model.** Users land on `/nominees` and see horizontal carousels (Trending, Featured, Verified, Recently Added) before they ever see the award *categories*. The platform's core promise — *recognizing changemakers across structured award tracks* — is invisible until users scroll deep.
2. **Categories feel like filters, not destinations.** Influencers Education Impact, Best NGO, CSR, Technical Education, Africa Icon, Diaspora, STEM, Political Leaders, Media, Religious, EduTech, Library, R&D, International/Bilateral, State, Regional, Blue Garnet — all exist as award systems but are surfaced as flat dropdown options instead of branded tracks with their own landing real estate.
3. **CTA logic is inconsistent.** Cards mix "Vote", "Re-nominate", "View", and "Endorse" with no rule tying CTA → award stage. Users don't know what action is expected of them on which category.
4. **Trending Now appears too early.** It rewards short-tail interest before establishing the ecosystem. This causes thumb-fatigue scroll-past and high bounce on mobile.
5. **Mobile density is wrong.** Cards are desktop-first (3-col grid forced down). Tap targets, image ratios, and CTA stacks don't respect the 360–414px thumb zone.
6. **Re-nomination path is buried.** Returning users (the highest-intent segment) have no obvious "I want to nominate someone in this same category again" flow.

### What we're changing
A single, opinionated IA pivot:

> **Primary entry to nominees is *Browse by Award Category*. Everything else (Region, Country, Impact Type, Ecosystem, Recognition Type, Trending) is a secondary lens.**

CTA rule, applied globally and without exception:

> **Blue Garnet category cards → secondary CTA = "Vote". All other category cards → secondary CTA = "Re-nominate". Primary CTA on every card = "Explore Nominees".**

---

## 2. Information Architecture — Before vs After

### Before (current `/nominees`)
```
/nominees
├── Hero
├── Trending Now (horizontal rail)
├── Featured (rail)
├── Verified (rail)
├── Recently Added (rail)
├── Filter bar (category dropdown, region, country, sort)
└── Flat grid of all nominees, paginated
```
Problems: 4 rails of unranked nominees before any structural cue. Category is a *filter*, not a *place*.

### After (target IA)
```
/nominees  ← "Explore Existing Nominees"
│
├── 1. Hero (compact, mobile-first)
│      H1: "Explore Existing Nominees by Award Category"
│      Sub: "Discover changemakers across 17 NESA-Africa award tracks."
│      Stats strip: [X nominees · 17 categories · 10 regions · 54 countries]
│      Primary CTA: "Browse Categories"   Secondary: "Nominate Someone"
│
├── 2. BROWSE BY AWARD CATEGORY   ◄── primary discovery surface
│      Section header + sub: "Every nominee belongs to an award track. Pick one."
│      Mobile: vertical stack of category cards, 1-col, snap-scroll filter chips at top
│      Desktop: 3-col grid
│      Each card =
│        - Category icon / category-art
│        - Category name (e.g. "Best NGO Contribution to Education")
│        - 1-line description
│        - Meta row: "142 nominees · 18 countries · 4 subcategories"
│        - Recognition-type badge (Blue Garnet / Gold / Platinum / Icon / Regional)
│        - Primary CTA:   Explore Nominees  →  /nominees/category/{slug}
│        - Secondary CTA: Vote  (Blue Garnet only)  |  Re-nominate  (all others)
│
├── 3. SECONDARY LENSES (tabs, sticky on mobile)
│      [ Category ] [ Region ] [ Country ] [ Impact Type ] [ Ecosystem ] [ Recognition Type ]
│      Default tab = Category. Switching tab re-renders section 2 with that grouping.
│
├── 4. FEATURED / VERIFIED / BLUE GARNET FINALISTS
│      Curated rail. Trust-building. Click → nominee profile.
│
├── 5. EXPLORE BY AFRICAN REGION
│      Map + 10 region cards. Each → /regions/{slug} or /nominees?region=...
│
├── 6. RECENTLY ADDED (secondary rail, optional)
│
└── 7. TRENDING NOW   ◄── intentionally moved to BOTTOM
       Rationale: trending is a reward for scroll depth, not a top-of-page distraction.
       Lower CTR but higher quality clicks; protects the IA story above.
```

### Master category list (under "Browse by Category")
All of the following are first-class category cards — none hidden in dropdowns:

| # | Category | Recognition Tier | Secondary CTA |
|---|---|---|---|
| 1 | Africa Education Icon Award | Icon | Re-nominate |
| 2 | Blue Garnet — Lifetime Africa Icon | **Blue Garnet** | **Vote** |
| 3 | Blue Garnet — Continental Leader | **Blue Garnet** | **Vote** |
| 4 | Blue Garnet — Diaspora Excellence | **Blue Garnet** | **Vote** |
| 5 | Best NGO Contribution to Education | Gold | Re-nominate |
| 6 | Best CSR for Education | Gold | Re-nominate |
| 7 | Technical & Vocational Education | Gold | Re-nominate |
| 8 | Influencers Education Impact | Gold | Re-nominate |
| 9 | Creative Arts Contribution to Education | Gold | Re-nominate |
| 10 | Diaspora Education Impact | Gold | Re-nominate |
| 11 | STEM Education Champion | Gold | Re-nominate |
| 12 | Political Leaders Educational Support | Gold | Re-nominate |
| 13 | Media Advocacy for Education | Gold | Re-nominate |
| 14 | Religious Education Impact | Gold | Re-nominate |
| 15 | EduTech Innovation | Gold | Re-nominate |
| 16 | Library & Knowledge Access | Gold | Re-nominate |
| 17 | Research & Development | Gold | Re-nominate |
| 18 | International & Bilateral Partners | Gold | Re-nominate |
| 19 | State Education Excellence | Regional | Re-nominate |
| 20 | Regional Education Awards (per region) | Regional | Re-nominate |

> Rule: the recognition tier on the card visually distinguishes Blue Garnet (deep-blue + gold edge) from Gold (charcoal + gold accent) from Regional (gold-on-charcoal compact). This is the ONLY visual cue users need to learn the CTA difference.

---

## 3. Landing Page (`/`) — Nominee Section Refactor

The landing page currently has a "Trending nominees" rail near the top. Replace with:

### Slot order (landing page, nominee-related slices only)
```
… hero …
… moments gallery …
[ NEW ]  Explore Existing Nominees by Award Category   ◄── replaces "Trending nominees"
            - Header + 1-line context
            - Horizontal snap-carousel of 6–8 category cards on mobile
            - "See all 20 categories →" link  →  /nominees
[ keep ] Featured / Blue Garnet nominees rail
[ NEW ]  Explore by African Region (10-region quick chips)
[ keep ] Trending Now  ◄── demoted, near bottom of landing
… categories / regions / AGC …
```

This mirrors the `/nominees` IA so the landing page teaches users the model before they land on the full page.

---

## 4. CTA System — Single Source of Truth

### Card-level CTAs
| Surface | Primary CTA | Secondary CTA |
|---|---|---|
| Blue Garnet category card | Explore Nominees | **Vote** |
| Any other category card | Explore Nominees | **Re-nominate** |
| Individual nominee card (Blue Garnet category) | View Profile | **Vote** |
| Individual nominee card (other) | View Profile | **Re-nominate** |
| Region card | Explore Region | — |
| Hero | Browse Categories | Nominate Someone |

### Visual rules
- Primary = gold solid pill, charcoal text, full-width on mobile.
- Secondary = gold outline pill, gold text, full-width on mobile, stacked **below** primary (never side-by-side on <414px).
- Min tap target: 44×44 pt. Vertical gap between primary/secondary: 8px.
- Never more than 2 CTAs per card. Tertiary actions → kebab menu or card tap.

### CTA copy rules
- "Re-nominate" — used everywhere outside Blue Garnet. Tooltip on first encounter: *"Submit a new nominee in this award category for the current season."*
- "Vote" — only on Blue Garnet. Disabled state if voting window closed → label becomes "Voting Opens [date]".
- Avoid "View", "See more", "Learn" — they don't drive action.

---

## 5. Nominee Card Refactor

### Required elements (in this z-order, top → bottom on mobile)
1. **Image / logo** — 16:9 ratio for organizations, 1:1 for people. Use `object-cover`. Lazy load.
2. **Recognition tier badge** — top-left overlay (Blue Garnet | Gold | Platinum | Icon | Regional).
3. **Verification check** — top-right overlay, gold check on charcoal disc, only if `verified=true`.
4. **Nominee name** — `font-display`, 18px mobile / 20px desktop, 2-line clamp.
5. **Category + Subcategory** — 12px uppercase tracking-wide gold/60 text, 1 line, truncate.
6. **Country · Region** — 12px ivory/70, with flag emoji or 2-letter code.
7. **Impact summary** — 2-line clamp, 13px ivory/80. Pulled from `achievement` field.
8. **Vote count / endorsements** (only if public voting is live for category).
9. **CTA stack** — Primary full-width, Secondary full-width below.

### Density
- Mobile: 1 card per row (full-bleed inside 16px gutters), 12px vertical gap.
- 414–768px: 2 per row.
- ≥768px: 3 per row.
- Card height target on mobile: ~360px including 2 CTAs.

---

## 6. Mobile-First UX Decisions

1. **Sticky lens tabs.** When user scrolls past Section 2 header, the [Category|Region|Country|Impact|Ecosystem|Recognition] tab bar pins to top. One tap re-pivots the entire page.
2. **Filter chips, not dropdowns.** Replace the current `<Select>` filters with horizontal scrollable chips above the grid. Selected chip = gold filled.
3. **Search collapses to icon** on <414px until tapped, then expands full-width.
4. **CTA stack vertical.** Never put two pills side-by-side at <414px — they shrink below readability and tap-zone minimums.
5. **Section spacing.** 48px between major sections on mobile (currently inconsistent 24–96px). 16px page gutter.
6. **No horizontal scroll without a visible cue.** Every horizontal rail needs a gradient fade on the right edge + a "→" chevron hint.
7. **Lazy hydrate** the trending rail (now at bottom). Don't ship its JS on first paint.
8. **Bottom-bar offset** (`pb-24`) on the page so the mobile quick-action bar never covers the last CTA.

---

## 7. Conversion-Rate Optimization

### Funnel hypothesis
```
Landing → /nominees → Category page → Nominee profile → (Vote | Re-nominate | Share)
```
Each step currently leaks 40–60%. Target leaks:

| Step | Current leak hypothesis | Fix |
|---|---|---|
| Landing → /nominees | "Nominees" link is buried in nav | Add "Browse Categories" CTA in hero + landing slot #3 |
| /nominees → Category | Users can't tell categories apart | Category cards with tier badge + counts + 1-line description |
| Category → Profile | Card CTA confusion | Single Primary = "View Profile" on every nominee card |
| Profile → Action | Vote/Re-nominate decision fatigue | One contextual CTA based on category tier, never both |

### Quick CRO wins (ship-first)
1. Re-order `/nominees`: Hero → **Browse by Category** → Lens tabs → Featured → Regions → Recently → Trending (bottom).
2. Apply the **Blue Garnet = Vote / Other = Re-nominate** CTA rule globally.
3. Replace category dropdown with **category card grid as the page's primary surface**.
4. Add **nominee count + subcategory count** on every category card (trust + scope cue).
5. Move **search** above the category grid, not below.
6. Add a **"Continue where you left off"** strip for returning users (uses `useRecentlyViewed`).

### Medium-term wins
- Personalized re-nomination prompt: "You explored *Best NGO* last visit. Know someone who deserves this?" → 1-tap deep link into `/nominate?category=best-ngo`.
- Social proof microcopy on category cards: "32 nominees added this week".
- Sticky bottom action bar on nominee profile: [Share] [Re-nominate / Vote].

---

## 8. Data Engineering & Taxonomy

### Current state (from `src/lib/nomineeMasterData.ts`)
- Nominees keyed by `category` (string) and `subcategory` (string), slugified at runtime.
- `pathway` is derived from category name heuristics — fragile.
- No first-class `recognitionTier` field → cannot drive CTA logic deterministically.
- No `impactType` or `ecosystem` taxonomy.

### Recommended schema additions
```ts
type RecognitionTier = "blue_garnet" | "gold" | "platinum" | "icon" | "regional";
type ImpactType =
  | "ngo" | "csr" | "tech" | "stem" | "creative" | "media"
  | "political" | "religious" | "research" | "library"
  | "edutech" | "diaspora" | "bilateral" | "state" | "influencer";
type Ecosystem = "individual" | "organization" | "institution" | "government" | "corporate";

interface NomineeV2 extends MasterNominee {
  recognitionTier: RecognitionTier;   // drives CTA = Vote vs Re-nominate
  impactType: ImpactType;             // drives "Browse by Impact"
  ecosystem: Ecosystem;               // drives "Browse by Ecosystem"
  verified: boolean;
  voteCount?: number;
  endorsementCount?: number;
  publicVotingOpen: boolean;          // drives Vote-button enabled state
}
```

### Category registry (single source of truth)
Create `src/config/nomineeCategories.ts`:
```ts
export const NOMINEE_CATEGORIES = [
  { slug: "blue-garnet-lifetime", name: "...", tier: "blue_garnet", secondaryCta: "vote", ... },
  { slug: "best-ngo", name: "...", tier: "gold", secondaryCta: "renominate", ... },
  ...
] as const;
```
Every card, filter chip, route, and SEO meta reads from this registry. No more string-matching on category names.

### Indexing & filtering
- Build a single in-memory index on first load: `{ byCategory, byRegion, byCountry, byImpact, byEcosystem, byTier }` — each is `Map<string, Nominee[]>`.
- Server-side (Supabase): add B-tree indexes on `category_slug`, `region`, `country`, `recognition_tier`, `impact_type`. Add GIN index on `tags[]`.
- Pagination: cursor-based on `(votes desc, id desc)` for "trending"; offset OK for category pages with <500 nominees.

### Search
- Client-side fuse.js across `name`, `category`, `subcategory`, `country`, `achievement` — already partially implemented in `searchMasterNominees`. Add ranking weights: name=10, category=4, country=2, achievement=1.
- For >2000 nominees, move to Supabase `pg_trgm` + edge function.

---

## 9. Analytics & Tracking Plan

Add events (via existing `useEDXMetrics` hook or a thin wrapper):

| Event | Properties | Purpose |
|---|---|---|
| `nominee_page_view` | source, deviceType | top of funnel |
| `category_card_click` | categorySlug, tier, position | category discoverability |
| `lens_tab_switch` | from, to | IA validation |
| `filter_chip_apply` | dimension, value | filter usage |
| `search_query` | query, resultsCount | search quality |
| `nominee_card_click` | nomineeId, categorySlug, position, source | discovery → profile |
| `cta_primary_click` | surface, target | primary CTA conversion |
| `cta_secondary_click` | surface, action ("vote"\|"renominate"), categoryTier | the core CRO metric |
| `vote_submitted` | nomineeId, categorySlug | conversion |
| `renominate_started` | categorySlug, source | conversion |
| `scroll_depth` | percent (25/50/75/100), page | bounce diagnostics |
| `trending_rail_view` | position (now bottom) | validate demotion |

KPIs to track weekly:
- Category card CTR (target: >18% mobile)
- Lens tab switch rate (target: 25% — shows users explore secondary lenses)
- Secondary-CTA conversion rate, split Blue Garnet (Vote) vs Other (Re-nominate)
- Bounce rate on `/nominees` (target: <45% mobile, currently estimated >60%)
- Scroll-depth to "Trending" (we expect it to drop — that's fine; that depth-traffic is high-quality)

---

## 10. Wireframe Notes (mobile, 360–414px)

```
┌─────────────────────────────┐
│ Hero (compact, 380px tall)  │
│  H1 · sub · 2 CTAs · stats  │
├─────────────────────────────┤
│ [search ↑ ] [sort ↓]        │
│ Section: Browse by Category │
│  ┌───────────────────────┐  │
│  │ [tier badge]          │  │
│  │ Best NGO Contribution │  │
│  │ to Education          │  │
│  │ 142 nominees · 18 cty │  │
│  │ ┌─────────────────┐   │  │
│  │ │ Explore Nominees│   │  │ ← primary, gold solid
│  │ └─────────────────┘   │  │
│  │ ┌─────────────────┐   │  │
│  │ │ Re-nominate     │   │  │ ← secondary, gold outline
│  │ └─────────────────┘   │  │
│  └───────────────────────┘  │
│  (repeat for each category) │
├─────────────────────────────┤
│ Sticky tabs (appear on      │
│ scroll past section header):│
│ [Category|Region|Country|…] │
├─────────────────────────────┤
│ Featured / Blue Garnet rail │
├─────────────────────────────┤
│ Explore by Region (10 chips)│
├─────────────────────────────┤
│ Recently Added (rail)       │
├─────────────────────────────┤
│ Trending Now (rail) ← demote│
└─────────────────────────────┘
```

---

## 11. SEO & Discoverability

- Each category gets its own indexable URL: `/nominees/category/{slug}` (already partly built — `CategoryLandingPage.tsx`).
- `<title>`: `"{Category} Nominees — NESA-Africa 2026"`.
- `<meta description>`: nominee count + 1-line value prop.
- JSON-LD `CollectionPage` + `ItemList` per category (already partly implemented).
- Add `BreadcrumbList` schema.
- `hreflang` alternates per category page (extend `LocalizedSEO` to category routes).
- Add internal links from category pages → 3 related categories (boost crawl + dwell).
- Sitemap: include all 20 category URLs and top 200 nominee profile URLs.

---

## 12. Trust & Credibility Layer

- Verification check badge consistent across all card surfaces.
- Recognition tier badge with consistent color semantics (Blue Garnet = deep blue + gold; Gold = charcoal + gold; Regional = gold compact).
- "Reviewed by NRC" micro-label on cleared nominees.
- Stat strip in hero: "X nominees · 17 categories · 10 regions · Z verified".
- Citation/evidence link on profile page (already required by Award Records governance).

---

## 13. Implementation Backlog (ordered)

### Phase 1 — IA & CTA (this sprint)
1. Create `src/config/nomineeCategories.ts` registry with tier + secondaryCta per category.
2. Build `<CategoryDiscoveryGrid />` (mobile-first, 1-col → 3-col).
3. Rebuild `/nominees` page section order per Section 2 of this doc.
4. Apply Blue Garnet = Vote / Other = Re-nominate CTA rule globally.
5. Demote Trending Now to the bottom of `/nominees` and landing page.
6. Landing page: replace top "Trending nominees" with `<CategoryDiscoveryCarousel />`.

### Phase 2 — Mobile polish
7. Sticky lens tabs (Category / Region / Country / Impact / Ecosystem / Recognition).
8. Filter chips replace dropdown filters.
9. Card vertical CTA stack <414px.
10. Section spacing normalization.

### Phase 3 — Data layer
11. Add `recognitionTier`, `impactType`, `ecosystem`, `publicVotingOpen` to nominee schema.
12. Migrate existing 2025 dataset with derived values; backfill via migration script.
13. Build in-memory indexes on first load.

### Phase 4 — Analytics
14. Wire all events in Section 9.
15. Dashboard in admin: category CTR, secondary-CTA conversion, scroll-depth.

### Phase 5 — SEO
16. Per-category SEO metadata + JSON-LD + hreflang.
17. Sitemap expansion.

---

## 14. Expected Outcomes

- **Bounce rate** on `/nominees` mobile: -15 to -25 pts (from >60% to ~40%).
- **Category card CTR**: 18–25% mobile (vs. ~6% for current trending rail).
- **Re-nomination starts per session**: +40–80% (clear secondary CTA on every non-Blue-Garnet card).
- **Vote conversion in Blue Garnet**: +25–50% (focused, single CTA, no confusion with re-nominate).
- **Scroll depth to 50%**: +20 pts (users now have a reason to scroll past hero).
- **SEO impressions** on category long-tail keywords: +3–5× over 90 days (20 indexable category pages with structured data).

---

*Document owner: NESA-Africa product team. Source of truth for the nominee ecosystem refactor — pair with `docs/MOBILE_UX_AUDIT.md` and `docs/UX_AUDIT_REPORT.md`.*
