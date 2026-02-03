# NESA-Africa UX Audit Report

**Audit Date:** February 3, 2026  
**Auditor:** External UI/UX Consultant  
**Status:** AUDIT ONLY — No fixes implemented yet

---

## 1. Route/Page Inventory

| Route | Purpose | Notes |
|-------|---------|-------|
| `/` | Homepage landing (NESAAfrica) | Has own header/footer |
| `/programs/nesa-africa` | Same as `/` | Duplicate route |
| `/programs` | Programs overview | Uses PublicLayout |
| `/about` | About NESA page | Institutional info |
| `/about/vision-2035` | Vision 2035 strategy | |
| `/about/governance` | Governance structure | |
| `/about/timeline` | Event timeline | |
| `/about/scef` | SCEF foundation | |
| `/categories` | Award categories (17 official) | With DB-backed subcategories |
| `/categories/:slug` | Category detail with subcategories | Has breadcrumbs |
| `/awards/platinum` | Platinum tier info | |
| `/awards/icon` | Icon tier info | |
| `/awards/gold` | Gold tier info | |
| `/awards/blue-garnet` | Blue Garnet tier info | |
| `/awards/winners` | Winners hall of fame | |
| `/nominees` | Nominee directory with filters | Supports URL params |
| `/nominees/:slug` | Individual nominee profile | Has related nominees |
| `/nominate` | Nomination form (multi-step) | 1103 lines — very large file |
| `/vote` | Voting page with filters | Stage-gated |
| `/vote-with-agc` | AGC voting info | |
| `/about-agc` | AGC explanation | |
| `/earn-voting-credits` | How to earn AGC | |
| `/claim-voting-credits` | Claim sponsor credits | |
| `/media` | Media hub | |
| `/media/tv` | NESA TV | |
| `/media/shows` | Online shows | |
| `/media/webinars` | Webinars | |
| `/media/gala` | Gala coverage | |
| `/tickets` | Ticket info | |
| `/buy-your-ticket` | Ticket purchase | |
| `/shop` | Merchandise store | |
| `/shop/cart` | Shopping cart | |
| `/shop/checkout` | Checkout flow | |
| `/donate` | Donation page | |
| `/judges` | Judge recruitment | |
| `/judge/apply` | Judge application | |
| `/contact` | Contact form | |
| `/login` | Login page | |
| `/register` | Registration page | |
| `/dashboard` | User dashboard | Own layout |
| `/wallet` | User wallet | |
| `/gfawzip` | GFAWzip wallet | Multiple route aliases |
| `/admin/*` | Admin routes | Protected |
| `/nrc/*` | NRC portal routes | Protected |
| `/olc/*` | OLC portal routes | Protected |
| `/judge/*` | Judge portal routes | Protected + OTP |

**Observations:**
- 90+ routes defined in App.tsx
- Multiple route aliases (e.g., `/shop`, `/merchandise`, `/store` all go to Shop)
- Homepage has two identical routes (`/` and `/programs/nesa-africa`)

---

## 2. Top User Journeys to Test

### Journey A: Home → Awards → Subcategory → Nominee → Back → Continue Browsing
1. Load `/` 
2. Click on "Explore Awards" or Categories CTA
3. Navigate to `/categories`
4. Expand a category → click subcategory link (goes to `/nominate?subcategory=ID`)
5. ⚠️ **Issue:** Subcategory links go to nomination form, not to filtered nominees

### Journey B: Directory/Search → Filter → Open Nominee → Back to Results
1. Navigate to `/nominees`
2. Use search and filter controls
3. Click on nominee card → opens `/nominees/:slug`
4. ✅ URL preserves filters (q, category, award, sort, page)
5. Back button returns to filtered view

### Journey C: Vote Flow
1. Navigate to `/vote`
2. Page shows hero + "View My Wallet" + "Earn Voting Credits" CTAs
3. ⚠️ **Issue:** StageGate blocks voting when not in voting phase
4. Voting requires authentication
5. 1 vote = 1 AGC (clearly stated)

### Journey D: Renominate Flow
1. View nominee profile at `/nominees/:slug`
2. RenominateCard component visible
3. ⚠️ **Issue:** Requires auth — no guest flow

---

## 3. Issues Table

| Severity | Page/Route | Issue | How to Reproduce | Likely Cause (file) | Fix Recommendation |
|----------|------------|-------|------------------|---------------------|-------------------|
| **BLOCKER** | `/` (homepage) | React error crashes NomineesShowcaseSection | Load homepage, scroll to nominees showcase | `NomineesShowcaseSection.tsx` line 338 uses NESALogo as child of Link without forwardRef | Ensure NESALogo has forwardRef or restructure component |
| **BLOCKER** | Global | Console errors on every page load | Open any page with DevTools | NESALogo in NomineesShowcaseSection not handling refs | Same as above |
| **Major** | `/categories` | Subcategory links go to nomination form, not nominee list | Click any subcategory in expanded category card | `Categories.tsx` line 406-409 links to `/nominate?subcategory=` | Link to `/nominees?subcategory=` instead |
| **Major** | `/nominees` | No way to filter by subcategory despite URL support | Navigate to `/nominees?subcategory=ID` | `Nominees.tsx` doesn't parse subcategory param | Add subcategory filter logic |
| **Major** | `/nominate` | File is 1103 lines — unmaintainable | Open file for editing | Organic growth without refactoring | Split into smaller components |
| **Major** | Homepage | AGC explained in 7+ different places | Scroll homepage, visit VoteWithAGCSection, GoldCertificateSection, NominationPathsCards, etc. | Content duplication across components | Consolidate to single VoteWithAGCSection |
| **Major** | `/vote` | Votes table may not exist yet | Attempt to vote | `Vote.tsx` line 211 inserts to `votes` table | Verify table exists in DB |
| **Minor** | Homepage | "What's New" section uses hardcoded dates from Feb 2026 | View WhatsNewSection | `WhatsNewSection.tsx` lines 14-40 | Make dates relative or dynamic |
| **Minor** | `/nominees` | Sort by "Newest" just reverses array | Use sort dropdown | `Nominees.tsx` line 240-241 | Sort by created_at if available |
| **Minor** | `/categories` | Tab count shows Africa(17)/Nigeria(0) — Nigeria tab empty | Switch to Nigeria tab | No Nigeria-scoped categories in config | Verify category scopes |
| **Minor** | Nav | Mobile bottom nav icons lack labels on some items | View on mobile | `MainNav.tsx` MobileBottomNav | Add labels for accessibility |
| **Minor** | Multiple | Repeated phrase "Earn. Vote. Impact." appears 5+ times | Search codebase | Scattered across components | Define in constants |

---

## 4. Top 10 Bounce Drivers (Ranked)

1. **BLOCKER: Console errors crash NomineesShowcaseSection** — Users see broken page or React error boundary
2. **Confusing subcategory navigation** — Clicking subcategory goes to nomination form instead of nominees
3. **AGC jargon overload** — "AGC", "voting points", "credits" explained differently in 7+ places
4. **No clear first-time visitor path** — StartHereSection exists but below hero fold
5. **CTA overload in hero** — 3 buttons + stats strip compete for attention
6. **Voting blocked by StageGate** — Users can't vote outside voting windows with no clear explanation
7. **Missing subcategory filter in directory** — URL param exists but filter doesn't work
8. **Long forms without progress** — Nominate page has 4 steps but no visual progress bar
9. **Hardcoded dates in "What's New"** — Content appears stale after dates pass
10. **No breadcrumbs on many pages** — CategoryDetail has them, but Award pages and media pages don't

---

## 5. Mobile Review Notes (320 / 375 / 414 widths)

### 320px (iPhone SE, small Android)
- ⚠️ Trophy carousel in hero is cramped
- ⚠️ Category tabs overflow and require horizontal scroll
- ⚠️ Long category names truncate awkwardly
- ✅ Nominee cards stack correctly
- ✅ Bottom nav visible with safe area padding

### 375px (iPhone 12/13/14)
- ✅ Hero CTAs stack vertically
- ✅ Stats strip scrolls horizontally
- ⚠️ Filter tabs in /nominees still tight
- ✅ Cards have appropriate padding

### 414px (iPhone Plus, larger Android)
- ✅ Two-column grid works for some card layouts
- ✅ Bottom nav icons have adequate spacing
- ⚠️ Some modals still cramped

### General Mobile Issues
- Bottom nav height is 52px — meets 48px minimum but could be 60px
- Video autoplay in hero may drain battery
- No explicit loading="lazy" on hero video
- Filter dropdowns work but feel small on touch

---

## 6. Accessibility Notes

### Headings
- ✅ Most pages have single H1
- ⚠️ Homepage has H1 in TrophyHeroSection + potentially duplicate in nested sections
- ✅ Heading hierarchy generally respected (H1 → H2 → H3)

### Keyboard Focus
- ⚠️ Some buttons lack visible focus states
- ✅ Tabs and collapsibles are keyboard accessible
- ⚠️ Modal focus trap needs verification

### Alt Text
- ✅ Trophy images have alt text ("Blue Garnet Award Trophy")
- ✅ NESALogo has alt="NESA Africa"
- ⚠️ Nominee photos have alt but fallback div doesn't have role
- ⚠️ Category images have alt but no fallback

### Contrast
- ✅ Gold on charcoal meets AA
- ✅ White text on dark backgrounds good
- ⚠️ Some `text-white/40` and `text-white/50` may fail contrast

### Screen Reader
- ⚠️ Video lacks captions/transcript
- ✅ ARIA labels on icon-only buttons
- ✅ Breadcrumbs have nav role

---

## 7. Performance Notes

### Likely LCP Issues
1. **Hero video** (`stageBackdropVideo`) — Large MP4 autoplays on load
2. **Trophy carousel** — 3 images preloaded (`blueGarnetTrophyIcon`, `blueGarnetTrophyWinners`, NESA stamp)
3. **Multiple framer-motion animations** — Text fade-ins delay first paint

### Likely CLS Issues
1. **Trophy carousel switching** — No reserved height, may shift layout
2. **Lazy-loaded sections** — No skeleton reserving space
3. **Font loading** — Playfair Display may cause FOIT

### Heavy Renders
1. **NomineesShowcaseSection** — Renders 50 nominees with motion effects
2. **Nominees page** — Renders full filtered list without virtualization
3. **Categories page** — Collapsible items with nested queries

### Image Misuse
1. **No WebP sources** — Trophy images are PNG/JPG
2. **No srcset** — Images served at single resolution
3. **Large images not lazy-loaded** — Category images in grid

### Bundle Concerns
1. `framer-motion` ~150KB — used on many pages
2. `recharts` imported for dashboards but not code-split
3. Large Nominate.tsx (1103 lines) in main bundle

---

## 8. Content Problems

### Repeated Sections/Phrases

| Phrase/Concept | Locations Found |
|----------------|-----------------|
| "Earn. Vote. Impact." | VoteWithAGCSection, GoldCertificateSection, NominationPathsCards, NominationPathSection |
| "1 Vote = 1 AGC" | Vote.tsx, GoldAward.tsx, VoteWithAGCSection, GoldCertificateSection |
| "Vote with AGC" | 17 files (132 matches) |
| "Earn Voting Points" | 7 files (44 matches) |
| AGC explanation | VoteWithAGCSection, NESAHero, HowItWorksVisual, NominationPathsCards, GetInvolvedSection, GoldCertificateSection, TrophyHeroSection |

### Unclear Value Proposition
- Hero says "Honoring Africa's Education Changemakers" — good
- But immediately throws users into "Vote Gold" / "Vote Blue Garnet" CTAs without explaining what those mean
- AGC mentioned before user understands what NESA is

### Confusing Navigation Labels
- "Categories" vs "Awards" — users may conflate
- "Nominate" appears in nav + hero + multiple sections
- "Vote" vs "Vote with AGC" vs "Earn Voting Credits" — three separate nav items

### Duplicate Components
- `NESAHero.tsx` and `TrophyHeroSection.tsx` both exist — which is used?
- `NominationPathSection.tsx` and `NominationPathsCards.tsx` — similar purpose
- `HowItWorksSection.tsx` and `HowItWorksVisual.tsx` — both exist

---

## 9. Fix Plan

### NOW (Same Day) — Critical
1. **Fix NomineesShowcaseSection crash** — Remove NESALogo from inside Link or wrap in div
2. **Fix subcategory links** — Change `/nominate?subcategory=` to `/nominees?subcategory=` in Categories.tsx
3. **Add subcategory filter support** — Parse and use subcategory URL param in Nominees.tsx

### NEXT (This Week) — High Priority
4. **Consolidate AGC content** — Remove duplicate AGC explanations, keep only VoteWithAGCSection
5. **Add breadcrumbs to award pages** — PlatinumAward, GoldAward, BlueGarnetAward, IconAward
6. **Hero video optimization** — Add loading="lazy" + poster image preload
7. **Split Nominate.tsx** — Extract step components into separate files
8. **Make "What's New" dates dynamic** — Use relative date formatting

### LATER (Backlog) — Polish
9. **Improve mobile bottom nav** — Increase height to 60px, add labels
10. **Add virtualization to nominee list** — Use react-virtual for large lists
11. **WebP trophy images** — Convert and add srcset
12. **Verify votes table exists** — Check DB schema
13. **Delete unused hero component** — Remove NESAHero.tsx if not used
14. **Remove duplicate components** — Consolidate NominationPath* and HowItWorks*

---

## Appendix: File References

### Critical Files to Fix
- `src/components/nesa/NomineesShowcaseSection.tsx` — Line 338 (NESALogo crash)
- `src/pages/Categories.tsx` — Lines 406-409 (wrong subcategory link)
- `src/pages/Nominees.tsx` — Add subcategory filter

### Large Files to Refactor
- `src/pages/Nominate.tsx` — 1103 lines
- `src/pages/Nominees.tsx` — 697 lines
- `src/pages/Vote.tsx` — 548 lines

### Content Duplication Hotspots
- `src/components/nesa/VoteWithAGCSection.tsx` — Primary AGC section
- `src/components/nesa/GoldCertificateSection.tsx` — Duplicate AGC info
- `src/components/nesa/NESAHero.tsx` — AGC strip (may be unused)
- `src/components/nesa/NominationPathsCards.tsx` — AGC mentions
- `src/components/nesa/NominationPathSection.tsx` — Similar to above

---

*End of Audit Report. No fixes have been implemented. Ready for implementation phase.*
