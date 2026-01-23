# NESA-Africa QA Plan

This document outlines the quality assurance criteria for the NESA-Africa platform.

## Pre-Deployment Checklist

### 1. Build Verification

- [ ] `npm run build` completes without errors
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes with no critical errors
- [ ] All unit tests pass (`npm run test`)

### 2. Landing Page Rendering

- [ ] Landing page loads at `/` route
- [ ] Landing page loads at `/programs/nesa-africa` route
- [ ] All sections render correctly:
  - [ ] Header with navigation
  - [ ] Hero section with video background
  - [ ] Key dates banner
  - [ ] Upcoming events with countdowns
  - [ ] Nomination paths
  - [ ] Stats strip
  - [ ] Programme overview
  - [ ] Phase 1 (EduAid Webinars)
  - [ ] Award phases
  - [ ] Timeline
  - [ ] Legacy section
  - [ ] Quote block
  - [ ] How it works
  - [ ] Watch live
  - [ ] Get involved
  - [ ] Firewalls & integrity
  - [ ] Sponsors
  - [ ] Categories
  - [ ] Vision 2035 document
  - [ ] Watch media
  - [ ] Final CTA
  - [ ] Footer

### 3. No Hardcoded Dates/Years

**Critical: Search the codebase for hardcoded dates**

Run these searches and verify 0 results in UI components:

```bash
# Search for hardcoded years (should only appear in config files)
grep -r "2025" src/components/ --include="*.tsx"
grep -r "2026" src/components/ --include="*.tsx"
grep -r "2027" src/components/ --include="*.tsx"

# Search for hardcoded date strings
grep -r "January\|February\|March\|April\|May\|June\|July\|August\|September\|October\|November\|December" src/components/ --include="*.tsx"
```

**Expected Results:**
- All date/year references should use:
  - `useSeason()` hook for edition data
  - `buildScheduledEvents()` for event dates
  - `buildTimeline()` for timeline items
  - `buildAwardPhases()` for phase data

### 4. Stage Gating Verification

Test each stage action:

| Action | When Open | When Closed |
|--------|-----------|-------------|
| `nominations` | Show nomination form | Show StageLocked message |
| `public_voting` | Show voting interface | Show StageLocked message |
| `jury_scoring` | Allow jury access | Show StageLocked message |
| `results` | Show winners | Show StageLocked message |
| `certificates` | Allow downloads | Show StageLocked message |

**Test Procedure:**
1. Use Supabase to toggle `is_open` for each stage
2. Refresh the page and verify correct behavior
3. Verify banner text updates dynamically

### 5. Route Verification

- [ ] `/` renders landing page
- [ ] `/programs` renders programs page
- [ ] `/programs/nesa-africa` renders landing page
- [ ] `/categories` renders categories page
- [ ] `/nominate` renders nomination form (or StageLocked)
- [ ] `/login` renders login form
- [ ] `/register` renders registration form
- [ ] `/dashboard` redirects to login if unauthenticated
- [ ] `/nrc` redirects to unauthorized if not NRC role
- [ ] `/404-test` renders NotFound page

### 6. Responsive Design

Test on these breakpoints:
- [ ] Mobile (320px - 480px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1280px+)

### 7. Accessibility

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

### 8. Performance

- [ ] Lighthouse score > 80 for Performance
- [ ] No console errors on page load
- [ ] Video background lazy loads
- [ ] Images are optimized

### 9. API Verification

- [ ] `/functions/v1/stage` returns valid JSON
- [ ] `/functions/v1/season` returns valid JSON
- [ ] APIs return fallback data on error

## Post-Deployment Verification

After deploying to production:

1. [ ] Clear browser cache and test landing page
2. [ ] Verify stage banner reflects database state
3. [ ] Verify countdown timers are accurate
4. [ ] Test nomination flow end-to-end
5. [ ] Verify mobile experience
6. [ ] Check all external links work

## Known Limitations

- Video background may not autoplay on some mobile browsers
- Some older browsers may not support CSS backdrop-filter

## Rollback Procedure

If critical issues are found:

1. Revert to previous deployment in Lovable
2. Notify stakeholders
3. Document issue in bug tracker
4. Apply fix and re-deploy
