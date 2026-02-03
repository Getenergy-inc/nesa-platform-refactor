# NESA-Africa Site Audit & QA Report

**Audit Date:** 2026-02-03  
**Auditor:** Lovable AI  
**Status:** In Progress

---

## Executive Summary

This comprehensive audit identifies bounce-rate issues, content repetition, and UX friction across the NESA-Africa platform. The primary focus is reducing cognitive overload on the landing page, consolidating duplicate messaging, and improving navigation consistency.

### Key Findings

| Severity | Count | Category |
|----------|-------|----------|
| 🔴 Blocker | 0 | Critical functionality broken |
| 🟠 Major | 5 | High bounce-rate contributors |
| 🟡 Minor | 8 | Polish and consistency issues |

---

## Phase 1: Page Inventory

### Public Routes (45+ pages)

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Landing page / conversion hub | ⚠️ Content repetition |
| `/about` | Mission and vision | ✅ OK |
| `/about/vision-2035` | Strategic roadmap | ✅ OK |
| `/about/governance` | Integrity frameworks | ✅ OK |
| `/about/timeline` | Key dates and milestones | ✅ OK |
| `/about/scef` | Parent foundation | ✅ OK |
| `/categories` | Award categories listing | ✅ OK |
| `/categories/:slug` | Category detail | ⚠️ Needs breadcrumbs |
| `/awards/platinum` | Platinum Certificate info | ✅ OK |
| `/awards/icon` | Icon Award info | ✅ OK |
| `/awards/gold` | Gold Certificate info | ✅ OK |
| `/awards/blue-garnet` | Blue Garnet Award info | ✅ OK |
| `/awards/winners` | Past winners | ✅ OK |
| `/nominees` | Nominee directory | ⚠️ Needs loading states |
| `/nominees/:slug` | Nominee profile | ⚠️ Needs back navigation |
| `/nominate` | Nomination form | ✅ OK |
| `/vote` | Voting page | ✅ OK |
| `/vote-with-agc` | AGC voting info | ⚠️ Overlaps with landing |
| `/about-agc` | AGC explanation | ⚠️ Overlaps with landing |
| `/earn-voting-credits` | Earning methods | ⚠️ Overlaps with landing |
| `/media` | Media hub | ✅ OK |
| `/media/tv` | NESA Africa TV | ✅ OK |
| `/media/shows` | Online shows | ✅ OK |
| `/media/webinars` | Webinars | ✅ OK |
| `/media/gala` | Gala broadcast | ✅ OK |
| `/judges` | Judge panel info | ✅ OK |
| `/judge/apply` | Judge application | ✅ OK |
| `/partners` | Partnership info | ✅ OK |
| `/chapters` | Local chapters | ✅ OK |
| `/volunteer` | Volunteer signup | ✅ OK |
| `/ambassadors` | Ambassador program | ✅ OK |
| `/donate` | Donation page | ✅ OK |
| `/contact` | Contact form | ✅ OK |
| `/shop` | Merchandise shop | ✅ OK |
| `/shop/:slug` | Product detail | ✅ OK |
| `/shop/cart` | Shopping cart | ✅ OK |
| `/shop/checkout` | Checkout | ✅ OK |
| `/buy-your-ticket` | Ticket purchase | ✅ OK |
| `/gfawzip` | GFAWzip wallet | ✅ OK |
| `/login` | Authentication | ✅ OK |
| `/register` | Registration | ✅ OK |

### Dashboard/Admin Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/dashboard` | User dashboard | ✅ Yes |
| `/nrc/*` | NRC portal | ✅ Yes (NRC role) |
| `/judge/*` | Judge portal | ✅ Yes (Jury role) |
| `/admin/*` | Admin portal | ✅ Yes (Admin role) |
| `/olc/*` | OLC coordinator | ✅ Yes (OLC role) |

---

## Phase 2: Issues Table

### 🟠 Major Issues

| ID | Description | Route | Reproduction | Proposed Fix |
|----|-------------|-------|--------------|--------------|
| M1 | **AGC messaging repeated 6+ times** on landing | `/` | Scroll through page | Consolidate into 1 section; remove from Hero, Campaign, VoteWithAGC, Gold, Final CTA |
| M2 | **"Earn. Vote. Impact." appears 3 times** | `/` | Hero + VoteWithAGC + FinalCTA | Single instance in dedicated section |
| M3 | **Nominate CTA appears 5+ times** | `/` | Hero, Campaign, FinalCTA, etc. | Limit to Hero + sticky bar + final CTA |
| M4 | **AGC disclaimer repeated** in IntegritySection + VoteWithAGCSection | `/` | Both sections | Single disclaimer at bottom |
| M5 | **Too many sections above fold compete for attention** | `/` | Initial page load | Reduce to Hero + TrustLogos only |

### 🟡 Minor Issues

| ID | Description | Route | Proposed Fix |
|----|-------------|-------|--------------|
| m1 | No breadcrumbs on deep pages | `/categories/:slug`, `/nominees/:slug` | Add Breadcrumb component |
| m2 | "Back to..." links missing on profiles | `/nominees/:slug` | Add back navigation |
| m3 | Stats (5 regions, 135 subcategories) repeated | Multiple sections | Create shared `<KeyStats />` |
| m4 | Voting timeline shown twice | GoldCertificate + UpcomingEvents | Single timeline section |
| m5 | "Sponsors cannot influence outcomes" repeated | Integrity + VoteWithAGC | Remove from VoteWithAGC |
| m6 | Empty loading states missing | `/nominees` | Add skeleton loaders |
| m7 | Some pages lack unique meta descriptions | Various | Add unique SEO meta |
| m8 | CampaignBanner duplicates Hero message | `/` | Differentiate purpose or remove |

---

## Phase 3: Content Repetition Analysis

### Landing Page Section Audit

The landing page (`NESAAfrica.tsx`) renders **19 sections**:

```
1. TrophyHeroSection       - Hero with CTAs + AGC info ⚠️
2. TrustLogosStrip         - Endorsements ✅
3. CampaignBanner          - Nominate CTA + Platinum ⚠️ DUPLICATE
4. QuickActionBar          - Sticky actions ✅
5. WhatsLiveSection        - Current shows ✅
6. NominationPathsCards    - Award tiers ✅
7. GoldCertificateSection  - Gold detail + AGC ⚠️ DUPLICATE
8. VoteWithAGCSection      - Full AGC explainer ⚠️ DUPLICATE
9. HowItWorksVisual        - Process steps ✅
10. LegacyImpactSection    - Rebuild My School ✅
11. IntegritySection       - Firewalls + AGC disclaimer ⚠️ DUPLICATE
12. UpcomingEventsSection  - Countdowns ✅
13. AwardPhasesSection     - Timeline phases ⚠️ SIMILAR TO #12
14. TimelineSection        - Full timeline ⚠️ SIMILAR TO #12, #13
15. WatchSection           - Media links ✅
16. NomineesShowcaseSection - Featured nominees ✅
17. SponsorsSection        - Sponsors ✅
18. JudgesSection          - Jury panel ✅
19. CategoriesSection      - Category cards ✅
20. FinalCTASection        - Final CTA + AGC ⚠️ DUPLICATE
```

### Repetition Breakdown

| Content | Occurrences | Should Be |
|---------|-------------|-----------|
| AGC voting points explanation | 6 | 1 |
| "Earn. Vote. Impact." | 3 | 1 |
| "1 Vote = 1 AGC" | 5 | 1-2 |
| Nominate CTA button | 5 | 2-3 |
| AGC non-tradeable disclaimer | 2 | 1 |
| Timeline/dates | 3 sections | 1 |
| Stats (regions, categories) | 4 | 1 |

---

## Phase 4: Fixes Applied

### ✅ Completed Fixes

1. **Streamlined landing page** - Reduced from 19 to 14 sections by removing:
   - CampaignBanner (duplicate Nominate CTA)
   - GoldCertificateSection (AGC info duplicated)
   - IntegritySection (moved AGC disclaimer to VoteWithAGCSection)
   - AwardPhasesSection (timeline duplicated)
   - TimelineSection (timeline duplicated)
   - JudgesSection (moved to dedicated /judges page)
2. **Simplified Hero** - Removed embedded AGC cards, focused on clear value proposition
3. **FinalCTASection** - Removed duplicate AGC messaging
4. **Added Breadcrumbs component** - `src/components/ui/breadcrumbs.tsx`
5. **CategoryDetail** - Added breadcrumb navigation
6. **NomineeProfile** - Added breadcrumbs + SEO meta tags

---

## Phase 5: User Journeys Tested

### Primary Flows

| Journey | Steps | Status |
|---------|-------|--------|
| Browse → Nominate | Landing → Categories → Category → Nominate | ✅ Works |
| Search → Vote | Landing → Nominees → Profile → Vote | ✅ Works |
| Renominate flow | Profile → Endorse button → Form | ✅ Works |
| Shop flow | Shop → Product → Cart → Checkout | ✅ Works |
| Judge application | Judges → Apply → Form submission | ✅ Works |

---

## Phase 6: Before vs After Summary

### Before (Issues)
- 19 sections on landing causing scroll fatigue
- AGC explained 6 times with identical messaging
- 3 timeline/countdown sections
- No clear single CTA focus
- Repetitive "Earn. Vote. Impact." tagline

### After (Improvements)
- 14 focused sections on landing
- AGC explained once in dedicated section
- 1 consolidated events/timeline section
- Clear Nominate → Vote → Watch hierarchy
- Streamlined messaging throughout

---

## Known Issues (Won't Fix)

| Issue | Reason |
|-------|--------|
| Some pages have minimal content | Awaiting CMS content population |
| Mobile nav overlap on very small screens | Edge case (<320px) |

---

## Final Verification Checklist

- [x] No duplicate header/footer
- [x] All primary routes accessible
- [x] Forms submit correctly
- [x] No console errors
- [x] Mobile responsive (320-414px tested)
- [x] Desktop layouts correct (1024-1920px)
- [x] AGC messaging consolidated
- [x] Navigation breadcrumbs added
- [ ] Loading skeletons (in progress)
- [ ] Full SEO meta audit (in progress)

---

*Report generated by Lovable AI audit system*
