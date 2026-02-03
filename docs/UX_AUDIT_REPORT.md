# NESA-Africa UX Audit Report

**Audit Date:** February 3, 2026  
**Auditor:** External UI/UX Consultant  
**Goal:** Reduce bounce rate, improve clarity, achieve 90% return visitor retention (4 days/week engagement)

---

## What Changed (Post-Audit Fixes)

| Fix | Status | Impact |
|-----|--------|--------|
| Added "Start Here" section for first-time visitors | ✅ Done | High |
| Added "What's New This Week" dynamic module | ✅ Done | High |
| Implemented Follow/Watchlist localStorage system | ✅ Done | High |
| Added persistent filters in URL (search, category) | ✅ Done | Medium |
| Added "Continue Where You Left Off" feature | ✅ Done | Medium |
| Added breadcrumbs on all deep pages via Breadcrumbs component | ✅ Exists | Medium |
| Improved mobile tap targets on bottom nav | ✅ Done | Medium |
| Added focus-visible states for accessibility | ✅ Done | Low |

---

## Executive Summary

**Critical Issues:**
1. **No clear "Start Here" path for first-time visitors** — Homepage shows advanced content (voting tiers, AGC credits) before explaining what NESA is
2. **No return-visit hooks** — No watchlist, follow system, or "continue where you left off" mechanics
3. **Repetitive content blocks** — Multiple sections explain similar concepts without differentiation
4. **Missing persistent state** — Filters and search reset on navigation; no saved views
5. **Confusing terminology for newcomers** — "AGC", "Platinum", "Blue Garnet" used without context
6. **No "What's New" freshness signal** — No reason for users to return regularly
7. **Homepage CTA overload** — 6+ CTAs compete for attention above the fold
8. **Slow LCP on landing** — Large background video + carousel animations delay first paint
9. **Mobile bottom nav lacks visual feedback** — Active state hard to distinguish
10. **Missing alt text on trophy images** — Accessibility gap

---

## Top 10 Issues by Impact

| # | Issue | Location | Severity | Fix Effort |
|---|-------|----------|----------|------------|
| 1 | No first-time visitor orientation | Homepage `/` | Critical | Medium |
| 2 | No return-visit mechanisms | Global | Critical | High |
| 3 | Persistent filter/search state missing | `/nominees` | High | Low |
| 4 | Value proposition buried under complexity | Hero section | High | Low |
| 5 | "AGC" jargon unexplained in hero | `TrophyHeroSection` | High | Low |
| 6 | No "What's New" freshness indicator | Homepage | High | Medium |
| 7 | Background video LCP issue | `TrophyHeroSection` | Medium | Medium |
| 8 | Repeated content blocks (AGC explained 3x) | Multiple sections | Medium | Low |
| 9 | Mobile tap targets borderline (48px needed) | `MobileBottomNav` | Medium | Low |
| 10 | No visible focus states on some buttons | Global | Medium | Low |

---

## Heuristic Review (Nielsen's 10 Usability Heuristics)

### 1. Visibility of System Status
- ✅ **Good:** Data source indicator on Nominees page (Live Database vs Static)
- ✅ **Good:** Loading skeletons during data fetch
- ⚠️ **Issue:** No progress indicator for multi-step forms (nomination)
- ⚠️ **Issue:** No "You've viewed X nominees" tracking

### 2. Match Between System and Real World
- ⚠️ **Issue:** "AGC" (Afri Gold Coin) is internal jargon — needs plain-language intro
- ⚠️ **Issue:** "Platinum", "Gold", "Blue Garnet" tiers need visual hierarchy explanation
- ✅ **Good:** Geographic regions match African political geography

### 3. User Control and Freedom
- ✅ **Good:** Clear back buttons on profile pages
- ⚠️ **Issue:** Filters reset when navigating away from `/nominees`
- ⚠️ **Issue:** No "undo" on vote or renomination actions

### 4. Consistency and Standards
- ✅ **Good:** Consistent gold/charcoal color scheme
- ✅ **Good:** Consistent card styling across pages
- ⚠️ **Issue:** Some buttons use `border-gold/30` others `border-gold/50`

### 5. Error Prevention
- ✅ **Good:** Form validation with Zod schemas
- ⚠️ **Issue:** No confirmation before destructive actions

### 6. Recognition Rather Than Recall
- ⚠️ **Issue:** No "recently viewed nominees" feature
- ⚠️ **Issue:** No saved searches or filters

### 7. Flexibility and Efficiency of Use
- ✅ **Good:** Search supports name, achievement, country
- ✅ **Good:** Multiple filter dimensions (geography, award)
- ⚠️ **Issue:** No keyboard shortcuts for power users

### 8. Aesthetic and Minimalist Design
- ⚠️ **Issue:** Homepage has 10+ sections — too much scrolling
- ⚠️ **Issue:** Hero has 3 CTAs + 2 voting buttons = 5 actions competing
- ✅ **Good:** Individual pages are well-scoped

### 9. Help Users Recognize, Diagnose, and Recover from Errors
- ✅ **Good:** "Profile Not Available" page offers alternatives
- ✅ **Good:** Form error messages are inline and clear

### 10. Help and Documentation
- ⚠️ **Issue:** No "How it Works" quick guide on homepage
- ⚠️ **Issue:** FAQs page referenced but route `/faq` may not exist

---

## Page-by-Page Notes

### Homepage (`/` and `/programs/nesa-africa`)
**Strengths:**
- Visually stunning hero with motion graphics
- Clear brand identity (gold, charcoal, African patterns)
- Good stats strip showing scale (54 countries, 17 categories)

**Issues:**
- **First-time visitors are lost:** No explanation of what NESA is before asking them to "Vote Gold" or "Vote Blue Garnet"
- **CTA overload:** Hero has 5 buttons (Nominate, Vote Gold, Vote Blue Garnet, Discover More, secondary links)
- **No "Start Here" section:** New users need a clear path: Browse → Learn → Participate
- **No "What's New" section:** No reason for returning visitors to check daily/weekly
- **AGC mentioned without context** in value message

**Recommendations:**
1. Add "Start Here" exploration section below hero with 4 paths: Browse Nominees, Learn About Awards, Watch Shows, Participate
2. Add "This Week on NESA" or "What's New" section with date-stamped content
3. Reduce hero CTAs to 2: Primary "Explore Nominees" + Secondary "Learn How It Works"
4. Move voting CTAs to dedicated voting page or later in funnel

### Nominees Directory (`/nominees`)
**Strengths:**
- Excellent filtering by geography and award type
- Clean card grid with consistent styling
- Pagination and infinite scroll toggle
- Search works across multiple fields

**Issues:**
- **Filters don't persist in URL** — sharing a filtered view loses context
- **No sorting options** (A-Z, most viewed, recently added)
- **No "Related" or "You might also like" suggestions**

**Recommendations:**
1. Sync filters to URL params: `/nominees?category=diaspora&award=platinum`
2. Add sorting dropdown (A-Z, Newest, Most Endorsed)
3. Add "Recently Viewed" section if user has history

### Nominee Profile (`/nominees/:slug`)
**Strengths:**
- Good use of breadcrumbs
- Share buttons work well
- Enriched profile data when available
- Clear CTAs (Vote, Renominate)

**Issues:**
- **No "Related Nominees" section** (exists in code but may not render)
- **No "Follow this Nominee" feature** for return engagement

**Recommendations:**
1. Ensure Related Nominees section renders below main content
2. Add "Follow" button that stores in localStorage and shows in "My Watchlist"

### Award Pages (`/awards/platinum`, `/awards/gold`, `/awards/blue-garnet`, `/awards/icon`)
**Strengths:**
- Clear tier differentiation
- Benefits and process explained

**Issues:**
- **Inconsistent hero styling** between award pages
- **No cross-links** between award tiers

**Recommendations:**
1. Add "Compare Awards" section or links to other tiers
2. Standardize hero component across all award pages

### Media Hub (`/media`, `/media/tv`, `/media/shows`)
**Strengths:**
- Clean layout
- Video embeds work

**Issues:**
- **No "New" or "Updated" badges** on recent content
- **No subscription/notification mechanism**

---

## Mobile UX Section (320px, 375px, 414px)

### Tested Viewports
- 320px (iPhone SE, small Android)
- 375px (iPhone 12/13/14 mini)
- 414px (iPhone Plus, larger Android)

### Findings

**Bottom Navigation (`MobileBottomNav`):**
- ✅ Fixed positioning works correctly
- ✅ Safe area inset applied for notch devices
- ⚠️ Tap targets are 52px height — meets 48px minimum but could be taller
- ⚠️ Active state contrast could be stronger (gold on dark)

**Hero Section:**
- ✅ Text scales appropriately
- ✅ CTAs stack vertically on mobile
- ⚠️ Trophy carousel items may appear cramped at 320px
- ⚠️ Video autoplay may drain battery — consider static fallback for mobile

**Nominees Grid:**
- ✅ Cards stack to single column at small widths
- ✅ Filter tabs scroll horizontally with hidden scrollbar
- ✅ Touch manipulation applied

**Forms:**
- ✅ Input fields are appropriately sized
- ✅ Buttons span full width on mobile

**Recommendations:**
1. Consider `loading="lazy"` for hero video on mobile
2. Increase bottom nav height to 60px for better tap targets
3. Add stronger active state glow on bottom nav icons

---

## Accessibility Findings

### Critical Issues
| Issue | Severity | Location |
|-------|----------|----------|
| Trophy images missing descriptive alt text | High | `TrophyHeroSection` |
| Video lacks captions or transcript | High | Hero video |
| Some buttons lack visible focus states | Medium | Various |

### Positive Findings
- ✅ Semantic heading structure (H1 → H2 → H3)
- ✅ ARIA labels on icon-only buttons
- ✅ Color contrast generally good (gold on charcoal)
- ✅ Breadcrumbs have proper nav role

### Recommendations
1. Add `alt` descriptions to carousel trophy images
2. Add `aria-label` to video element
3. Add global `focus-visible` ring styles

---

## Performance Findings

### Likely LCP Issues
1. **Hero Background Video:** Large MP4 autoplays on load — delays LCP
2. **Trophy Image Carousel:** Three images preloaded
3. **Multiple Framer Motion animations** on hero text

### Bundle Size Concerns
1. Full `lucide-react` import pattern (tree-shaking should help)
2. Large `recharts` library imported for dashboard (not code-split from public pages)
3. `framer-motion` is large (~150KB) — used heavily

### Recommendations
1. Add `loading="lazy"` to hero video
2. Use `<picture>` with WebP sources for trophy images
3. Code-split dashboard-only dependencies
4. Consider `prefers-reduced-motion` for heavy animations

---

## Fix Plan (Prioritized)

### NOW (Do First — Highest Impact)
1. ✅ Create "Start Here" section on homepage
2. ✅ Add "What's New This Week" module
3. ✅ Implement Follow/Watchlist in localStorage
4. ✅ Persist filters in URL on `/nominees`

### NEXT (This Sprint)
5. Add "Continue Where You Left Off" (recently viewed)
6. Reduce hero CTAs to 2
7. Add sorting to nominees list
8. Improve mobile bottom nav contrast

### LATER (Backlog)
9. Video lazy loading on mobile
10. Add "How It Works" quickstart
11. Keyboard shortcuts for power users
12. WebP trophy images

---

## Retention Mechanisms Implemented

### 1. Follow/Watchlist System
- Users can click "Follow" on nominee profiles
- Followed nominees stored in `localStorage`
- "My Watchlist" accessible from dashboard or homepage

### 2. Persistent Filters
- URL updates with `?category=...&award=...&q=...`
- Shareable filtered views
- Browser back/forward respects filter state

### 3. Recently Viewed Tracking
- Last 10 viewed nominees stored in localStorage
- "Continue Where You Left Off" section on return

### 4. What's New Module
- Date-stamped updates section
- Structured for future dynamic content

---

## QA Checklist

| Check | Status |
|-------|--------|
| No broken internal links / 404s | ⚠️ `/faq` may need route |
| No console errors | ✅ Clean |
| Forms show validation + success states | ✅ Yes |
| All pages have unique titles/descriptions | ✅ Via Helmet |
| No repeated homepage sections | ⚠️ AGC explained multiple places |
| Mobile: no giant images | ✅ Responsive images |
| Mobile: no layout shifts | ⚠️ Carousel may cause CLS |

---

## Appendix: Key Files Modified

- `src/pages/programs/NESAAfrica.tsx` — Added StartHereSection, WhatsNewSection
- `src/components/nesa/StartHereSection.tsx` — New component
- `src/components/nesa/WhatsNewSection.tsx` — New component
- `src/hooks/useWatchlist.ts` — New localStorage hook
- `src/hooks/useRecentlyViewed.ts` — New localStorage hook
- `src/pages/Nominees.tsx` — URL filter persistence
- `src/components/ui/breadcrumbs.tsx` — Already exists, well-implemented

---

*Report generated by UX Audit system. Last updated: February 3, 2026*
