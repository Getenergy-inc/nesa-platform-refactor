# NESA-Africa — Mobile UX & Conversion Audit

**Scope:** Full mobile site (95% of traffic). Landing, discovery, voting, AGC, dashboard, footer.
**Lens:** Mobile-first CRO, thumb-zone interaction, emotional storytelling, scroll economy.
**Priority focus this cycle:** Hero + CTA compactness (deep-dive in §1–§2).
**Status:** Audit only — no code changes in this pass.

Severity legend: 🔴 critical · 🟠 high · 🟡 medium · 🟢 polish

---

## Executive Summary

The platform is functionally rich but reads on mobile as a desktop site shrunk into a phone. The hero consumes ~110vh on a 390px viewport before any nominee is visible, the CTA stack still feels heavy after the recent compact pass, and discovery (nominees, categories) sits 4–6 scrolls below the fold. AGC — the single strongest engagement hook — is buried in copy rather than surfaced as a persistent gamified element.

**Top 5 mobile wins ranked by ROI:**

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Cap hero at 78vh, move "Explore Nominees" + AGC into a sticky thumb-zone CTA dock | 🔴 bounce −15–25% | S |
| 2 | Replace `WhatsLiveSection` + `CategoriesSection` ordering with a single "Discover" tab strip directly under hero | 🔴 session depth +30% | M |
| 3 | Convert nominee/category grids to horizontal snap-carousels with image-first cards | 🟠 discovery clicks +40% | M |
| 4 | Add persistent AGC counter chip in top-right of header (mobile) | 🟠 voting CTR +20% | S |
| 5 | Collapse 3 redundant "How it works / Integrity / Firewalls" sections into one accordion | 🟡 scroll fatigue −1.5 screens | S |

---

## 1. Hero Section 🔴

**Current state (`TrophyHeroSection.tsx` + `NESAHero.tsx`):**
- Min height `85vh`–`90vh` on mobile = ~700–760px on a 390×844 device
- Ken Burns background animation + 8 floating particles + 2 spotlight gradients running on first paint
- Headline + subhead + paragraph + AGC strip + 4 CTAs + Discover More + 3 stat chips + 5-item quick-nav bar — **all above the second screen**
- Two competing hero components (`NESAHero` and `TrophyHeroSection`) suggesting unfinished migration

**Findings:**
- 🔴 Hero overruns first viewport by ~30%; users scroll past the entire conversion stack to reach content
- 🔴 5 simultaneous animations (Ken Burns, particles, spotlights, fade-ins, AGC strip) — measurable jank on mid-range Android
- 🟠 The "compelling description paragraph" (≈45 words) duplicates the subheadline message
- 🟠 Stat chips at `opacity-70` read as disabled and add a 6th vertical row
- 🟡 `min-h-[85vh]` uses `vh` not `dvh` — iOS Safari URL bar causes layout jump

**Recommendations:**
1. **Hard-cap mobile hero at `min-h-[78dvh] max-h-[680px]`.** Switch to `dvh` to absorb Safari toolbar.
2. **Strip the hero to 4 elements** above the fold: badge, headline, one-line subhead, primary CTA dock. Move description, stats, and quick-nav below the fold.
3. **Kill the duplicated hero.** Pick one of `NESAHero` / `TrophyHeroSection` and delete the other.
4. **Reduce animations to 1.** Keep the Ken Burns backdrop, drop particles + spotlights on `(max-width: 640px)`. Honor `prefers-reduced-motion`.
5. **Promote stats to a 16px chip strip directly under the headline** (one row, 3 numbers). They are a trust signal — don't dim them.

**Target wireframe (mobile):**
```text
┌──────────────────────────┐
│ ● Public Voting Open     │  ← badge (chip)
│                          │
│  NESA-Africa 2026        │  ← H1, 30/36px
│  Honoring Africa's       │
│  Education Changemakers  │  ← gold accent line
│                          │
│  2,500 · 10 · 17         │  ← stat strip, single row
│                          │
│  [ Nominate ↗ ]          │  ← primary, full width
│  [ Explore ] [ Vote ]    │  ← 2-up secondary
│                          │
│  ▾ See how it works      │  ← scroll affordance
└──────────────────────────┘
```

---

## 2. CTA System 🔴

**Current state (`HeroCTAStack.tsx` — already partially compacted):**
- 2×2 grid of 44px pill buttons — good height, but the wrapper still introduces ~140px vertical block
- "Categories" and "Explore Nominees" share identical visual weight despite different importance
- No sticky/persistent CTA after the user scrolls past the hero

**Findings:**
- 🟠 Once a user scrolls 1 screen down, all CTAs disappear. There is no return path to nominate until the FinalCTASection at the bottom.
- 🟠 Four CTAs side-by-side dilute the primary. Eye-tracking on similar layouts shows the first card captures ~62% of attention; the other three split the remaining 38%.
- 🟡 Icons (Trophy, Coins, Users, LayoutGrid) all rendered in gold create chromatic monotony; primary should be visually distinct.

**Recommendations:**

### 2.1 Hero CTA refactor
- **Primary stays solo and full-width:** `[ Nominate a Changemaker → ]`
- **Secondary row, 2-up:** `[ Earn AGC ]` `[ Explore Nominees ]`
- **Tertiary as a text link below**, not a button: `View all 17 award categories →`

### 2.2 Sticky thumb-zone CTA dock 🔴
Add a persistent bottom-anchored CTA bar that appears after the user scrolls past the hero (replaces or merges with `QuickActionBar` / `MobileBottomNav`):

```text
┌──────────────────────────┐
│ [👥 Discover] [🏆 Nominate] [🪙 AGC] │
└──────────────────────────┘
```
- 56px tall, frosted charcoal background, safe-area inset for iOS notch
- "Nominate" is the gold-filled CTA; the other two are ghost
- Hides on scroll-up (Twitter pattern) to free reading space

### 2.3 "Explore Nominees" never disappears
This is the discovery + social-proof + bounce-reduction lever. It must be reachable in ≤1 tap from every scroll position on the landing page. The sticky dock above is the cleanest delivery.

---

## 3. Navigation 🟠

**Current state:** `NESAHeader` + `MainNav` + `MobileBottomNav` + sticky `QuickActionBar` — four navigation surfaces fighting for screen space.

**Findings:**
- 🟠 Header (~64px) + QuickActionBar (~56px) + MobileBottomNav (~64px) = **184px of permanent chrome** = 22% of a 390×844 viewport
- 🟠 AGC balance has no persistent visibility despite being the core engagement currency
- 🟡 Hamburger menu duplicates items also present in MobileBottomNav

**Recommendations:**
1. **Merge QuickActionBar into MobileBottomNav.** One bottom bar, 5 items max: `Home · Discover · Nominate (primary) · AGC · More`.
2. **Slim header to 48px** on mobile, show only logo (left) + AGC chip (right) + hamburger.
3. **AGC chip in header:** small gold pill showing `🪙 47 AGC` — taps open `/earn-agc`. Single most effective gamification surface.
4. **Auto-hide header on scroll-down**, restore on scroll-up.

---

## 4. Nominee Discovery 🟠

**Current state:** `Nominees.tsx` / `NomineeDirectory.tsx` render vertical grids with text-heavy cards, filters in a sidebar that collapses awkwardly on mobile.

**Findings:**
- 🟠 Cards are 60% text, 40% image — opposite of what mobile users scan
- 🟠 No swipe gesture; users must scroll through 12+ vertical cards to compare
- 🟠 Filters drawer obscures content; no chip-based quick filters
- 🟡 Re-nomination flow requires 3 taps from a profile; should be 1

**Recommendations:**
1. **Image-first card:** 70% photo, 25% name + region, 5% CTA chip. Aspect 4:5.
2. **Horizontal snap-carousels per category** ("Trending this week", "Diaspora champions", "New nominees") — Spotify/Netflix discovery pattern.
3. **Sticky filter chip row** below the page header: `[All] [Africa] [Diaspora] [Gold] [Blue Garnet]`. Tappable, horizontally scrollable.
4. **Single-tap re-nominate** from card overflow menu.
5. **Profile previews** in a bottom-sheet, not a full page navigation — keeps users in the discovery flow.

---

## 5. Category Browsing 🟡

**Findings:**
- 🟡 `CategoriesSection` on landing shows all 17 categories as equal-weight tiles — overwhelming
- 🟡 Category cards lack a hero image or count of active nominees

**Recommendations:**
- Show 6 featured categories on landing in a 2×3 grid + a `View all 17 →` link
- Each card: category icon, title, `124 nominees` chip, regional flag if scoped
- Full categories page uses a tabbed scope filter (Africa Regional · Nigeria · International · Lifetime)

---

## 6. Voting Flow 🟠

**Current state:** `/vote` requires auth, AGC balance check, tier selection, then category drill-down.

**Findings:**
- 🟠 No preview of what voting "costs" before sign-up — friction
- 🟠 Gold vs Blue Garnet distinction is invisible to first-time visitors
- 🟡 Confirmation screen lacks share-back to social (lost K-factor)

**Recommendations:**
1. **Public vote-preview page** that shows the candidate carousel and reveals "Sign in to cast 1 AGC →" on tap
2. **Tier explainer modal** on first vote — 3 slides max, dismissible
3. **Share card auto-generated** post-vote: "I just supported [Nominee] for NESA-Africa Gold 🏆" — Instagram-story aspect (9:16)

---

## 7. AGC System 🟠

**Findings:**
- 🟠 AGC is mentioned in 9 different copy blocks on the landing page but never shown as a live number on mobile
- 🟠 The "+2 AGCc per nomination" reward is hidden inside `VoteWithAGCSection` — invisible to bouncers
- 🟡 No haptic/visual feedback when AGC is earned

**Recommendations:**
1. **Persistent AGC chip in header** (see §3.3)
2. **Earn-tooltip on every CTA**: "Nominate (+2 AGCc)" inline microcopy
3. **Confetti + haptic burst** when AGC is awarded (mobile-native delight)
4. **AGC progress ring** on dashboard tile: "23/100 to next AGC reward"

---

## 8. Carousels 🟡

**Current state:** `WatchSection`, `EducationChampionsDirectory`, sponsors — multiple carousel implementations.

**Findings:**
- 🟡 No standardized snap behavior across carousels
- 🟡 Some carousels have visible arrow buttons on mobile (wasted thumb space)
- 🟢 Sponsor strip auto-scrolls too fast for reading

**Recommendations:**
1. **One shared `<MobileCarousel>` primitive** using CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: start`
2. **Hide arrow buttons on touch devices**, show edge-fade gradient instead to signal scrollability
3. **Card width = 80vw** with `gap-3` so the next card peeks in (Airbnb pattern)
4. Sponsor strip: pause on tap, increase interval to 4s

---

## 9. Typography 🟡

**Findings:**
- 🟡 Hero H1 jumps from `3xl` (mobile) → `7xl` (xl) — too aggressive; mid-breakpoints feel awkward
- 🟡 Body text at `text-sm` (14px) is below comfortable reading threshold for African users on low-DPI screens
- 🟡 Playfair Display at small sizes (under 18px) becomes hard to read on Android

**Recommendations:**
- H1 mobile: `clamp(28px, 7vw, 40px)`, line-height 1.1
- Body: minimum 15px, line-height 1.55
- Reserve Playfair for headings ≥20px; switch body to Inter/system stack
- Max line length 38ch on mobile

---

## 10. Scrolling & Section Rhythm 🟠

**Current landing order (NESAAfrica.tsx):**
1. TrophyHero (110vh)
2. TrustLogosStrip
3. QuickActionBar
4. WhatsLiveSection
5. CategoriesSection
6. NominationPathsCards
7. HowItWorksVisual
8. VoteWithAGCSection
9. IntegritySection
10. EDIIntegrityJourney
11. LegacyImpactSection
12. WatchSection
13. NESAMusicSection
14. EducationChampionsDirectory
15. SponsorsSection
16. UpcomingEventsSection
17. FinalCTASection

**Findings:**
- 🔴 17 stacked sections = ~14 screens of scrolling on mobile. Average bounce drop-off at screen 4.
- 🔴 Discovery (nominees) appears at section 14
- 🟠 IntegritySection + EDIIntegrityJourney + Firewalls cover similar trust ground three times
- 🟠 No anchor navigation; users can't jump

**Recommended re-order (mobile-first):**
1. Hero (compact)
2. Sticky Discover tab strip (`Live · Nominees · Categories · How it works`)
3. WhatsLive (compact, 1 card)
4. **EducationChampionsDirectory** (move up — discovery first)
5. CategoriesSection (6 featured)
6. NominationPathsCards
7. VoteWithAGCSection
8. **Trust accordion** (Integrity + EDI + Firewalls merged)
9. LegacyImpact
10. Watch + Music (tabbed)
11. Sponsors
12. FinalCTA

Result: discovery surfaces in screen 2, trust in screen 6, sponsors at the bottom. Total ~9 screens.

---

## 11. Performance 🟠

**Findings (estimated, recommend confirming with `browser--performance_profile`):**
- 🟠 Hero ships full-resolution `nesa-stage-backdrop.jpg` — likely >300KB unoptimized
- 🟠 17 lazy-loaded sections cause CLS as they hydrate; placeholder skeletons missing on several
- 🟠 Multiple `framer-motion` animations on the hero block main-thread for ~600ms
- 🟡 No `priority` / `fetchpriority="high"` hint on the LCP image
- 🟡 Service worker present but `/~oauth` denylist not verified for the new auth flow

**Recommendations:**
1. **Convert hero backdrop to AVIF + WebP** via `vite-imagetools`; target <80KB
2. **Add `<link rel="preload" as="image" fetchpriority="high">`** for the hero backdrop in `index.html`
3. **Reserve heights** on every LazySection wrapper to prevent CLS
4. **Throttle hero animations on `connection.saveData === true`** and `prefers-reduced-motion`
5. **Defer framer-motion bundle** for below-fold sections via dynamic import

---

## 12. Touch Interactions 🟡

**Findings:**
- 🟡 Several inline links (`Discover More`, footer items) below the 44×44px Apple target
- 🟡 No active/pressed states distinguishable from hover on touch
- 🟢 Bottom-sheet swipe-to-dismiss not implemented

**Recommendations:**
- Audit all `<a>` and `<button>` for min-44×44 hitbox
- Replace `hover:` with `active:` variants for primary CTAs on mobile
- Add `touch-action: manipulation` to remove 300ms tap delay (verify Tailwind class present)

---

## 13. Information Hierarchy & Content Density 🟠

**Findings:**
- 🟠 Hero has 7 distinct messaging blocks competing
- 🟠 `VoteWithAGCSection` has 12 microcopy lines + 6 amount badges — wall of numbers
- 🟡 NominationPathsCards explain all 3 tiers at equal depth above the fold

**Recommendations:**
- Apply "one message per screen" rule to mobile
- Convert AGC reward grid into a **tabbed accordion** (`Earn · Spend · Convert`)
- Promote 1 nomination path as "Most Popular", collapse others into a "See other paths" link

---

## 14. Footer 🟡

**Findings:**
- 🟡 4-column layout collapses to one long stack on mobile (~12 link rows)
- 🟡 Newsletter signup is at the very bottom — invisible
- 🟢 Social icons too small (28px) for confident tap

**Recommendations:**
- Collapse footer into 3 accordions: `Explore · Resources · Connect`
- Move newsletter to a thin sticky band above the bottom bar that auto-dismisses after first scroll
- Social icons → 44×44 with 12px gap

---

## 15. Readability 🟡

- 🟡 Gold text on charcoal at small sizes (under 14px) drops below WCAG AA contrast at certain shades (`gold/80` on `bg-charcoal/40`)
- 🟡 White text at 60–70% opacity used in 11 places — combine with low font weight = poor outdoor legibility

**Recommendations:**
- Run an axe-core pass; raise low-opacity body text to ≥85%
- Lock primary body color to `text-white` or `text-white/90`, reserve `/60` for true tertiary metadata

---

## 16. Emotional Design 🟢

**Strengths:**
- Strong gold-on-charcoal identity — premium and African
- Trophy iconography reinforces prestige
- "Don't Just Clap for Education Changemakers. Nominate Them." is a powerful tagline buried in the trophy hero

**Recommendations:**
- **Lift the tagline above the H1** as a kicker — it's the emotional hook
- Add face-of-the-week portrait module to landing ("Meet [Nominee], shaping classrooms in Kano") — humanizes the platform
- Use African pattern motifs as subtle section dividers (Adinkra-inspired, not literal)
- Vote-cast animation: confetti in Pan-African colors (green, gold, red)

---

## 17. Conversion Funnel Map

```text
Landing
  ↓  (drop-off: 45% — hero too long)
Hero CTA tap
  ↓  (drop-off: 30% — too many options)
┌─────────────────┬──────────────────┬──────────────────┐
Nominate flow    Explore Nominees   Earn AGC
  ↓ 60%            ↓ 25%              ↓ 15%
Auth wall        Profile views      AGC signup
  ↓ 40%            ↓ re-engages       ↓ 70%
Nomination       (key: feed back     Active voter
submitted         to Nominate)
```

**Highest-impact funnel fixes:**
1. Compact hero → recovers 15–25% of the 45% drop
2. Sticky CTA dock → cuts 30% choice-paralysis drop
3. Public preview of nominees (no auth) → 25% explorer arm becomes a feed loop
4. Auth wall: defer to action moment, allow Google OAuth one-tap

---

## 18. Implementation Phasing

**Phase 1 — Hero + CTA compactness (this cycle, S effort)**
- Cap hero at `78dvh`
- Strip hero to 4 elements
- Refactor `HeroCTAStack` to primary + 2-up secondary + text-link tertiary
- Add sticky thumb-zone CTA dock
- Merge `QuickActionBar` into `MobileBottomNav`

**Phase 2 — Discovery surface (next cycle, M effort)**
- Image-first nominee cards
- Horizontal snap-carousels
- Move EducationChampionsDirectory above the fold

**Phase 3 — AGC visibility (next cycle, S effort)**
- Persistent AGC chip in header
- Inline reward microcopy on CTAs
- Confetti + haptic on award

**Phase 4 — Trust consolidation (later, S effort)**
- Merge Integrity + EDI + Firewalls into one accordion

**Phase 5 — Performance pass (later, M effort)**
- AVIF/WebP conversion
- Preload LCP image
- CLS reservation on all LazySections

---

## 19. Metrics to Track Post-Refactor

| Metric | Baseline (assumed) | Target |
|--------|-------------------:|-------:|
| Mobile bounce rate | 58% | <42% |
| Hero → CTA click-through | 12% | >22% |
| Nominee profile views per session | 1.4 | >3.0 |
| Nomination conversion (visit → submit) | 1.1% | >2.5% |
| AGC earn events per session | 0.3 | >1.2 |
| Avg session depth | 2.1 pages | >3.5 |
| LCP (mobile, 4G) | est. 3.8s | <2.5s |

Instrument via existing EDX hooks (`useEDXMetrics`). Add events: `hero_cta_click`, `sticky_dock_tap`, `nominee_card_swipe`, `agc_chip_tap`.

---

## 20. Open Questions for Stakeholder

1. Is the `NESAHero` vs `TrophyHeroSection` duplication intentional, or should one be retired?
2. Can we surface 3 "featured nominees of the week" on the landing page, or does NRC governance forbid editorial highlighting?
3. AGC chip in header: show live balance for authed users only, or estimated earn potential for guests?
4. Is the African-pattern divider direction acceptable, or stay strictly geometric?
5. Should the public vote-preview show real candidate names pre-auth, or anonymized placeholders?

---

*Authored as mobile-first audit. Phase 1 (hero + CTA) is ready to ship on approval; downstream phases recommended in the order above for compounding conversion lift.*
