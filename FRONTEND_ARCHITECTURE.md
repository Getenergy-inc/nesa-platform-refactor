# NESA-Africa Frontend Architecture

This document maps out the complete frontend page structure and navigation system.

## Navigation Configuration

All navigation is centralized in `src/config/navigation.ts`.

## Page Count Summary

| Category | Count |
|----------|-------|
| Public Pages | 36 |
| Auth Pages | 5 |
| User Dashboard | 8 |
| NRC Dashboard | 5 |
| Jury Dashboard | 4 |
| Chapter Dashboard | 4 |
| Admin Dashboard | 8 |
| Legal Pages | 4 |
| Utility Pages | 3 |
| **Total** | **77 core routes** |

*Note: Dynamic routes (category/:slug, nominee/:slug) expand this to 100+ effective pages*

---

## Public Pages (36)

### Landing & About
| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/` | Home | NESAAfrica | ✅ Implemented |
| `/about` | About NESA-Africa | About | ⏳ Pending |
| `/about/vision-2035` | Vision 2035 | Vision2035 | ⏳ Pending |
| `/about/governance` | Governance & Firewalls | Governance | ⏳ Pending |
| `/about/timeline` | Programme Timeline | Timeline | ⏳ Pending |
| `/about/scef` | SCEF Foundation | SCEF | ⏳ Pending |

### Awards
| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/categories` | Award Categories | Categories | ✅ Implemented |
| `/categories/:slug` | Category Detail | CategoryDetail | ⏳ Pending |
| `/awards/platinum` | Platinum Certificate | PlatinumAward | ⏳ Pending |
| `/awards/icon` | Africa Education Icon | IconAward | ⏳ Pending |
| `/awards/gold` | Gold Certificate | GoldAward | ⏳ Pending |
| `/awards/blue-garnet` | Blue Garnet Award | BlueGarnetAward | ⏳ Pending |
| `/awards/winners` | Past Winners | Winners | ⏳ Pending |
| `/nominees` | Nominees | Nominees | ⏳ Pending |
| `/nominees/:slug` | Nominee Profile | NomineeProfile | ⏳ Pending |

### Participate
| Route | Title | Component | Stage-Gated | Status |
|-------|-------|-----------|-------------|--------|
| `/nominate` | Nominate | Nominate | nominations | ✅ Implemented |
| `/vote` | Vote | Vote | public_voting | ⏳ Pending |
| `/partners` | Partners & Sponsors | Partners | - | ⏳ Pending |
| `/chapters` | Local Chapters | Chapters | - | ⏳ Pending |
| `/volunteer` | Volunteer | Volunteer | - | ⏳ Pending |

### Media
| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/media` | Media Hub | MediaHub | ⏳ Pending |
| `/media/tv` | NESA Africa TV | NESATV | ⏳ Pending |
| `/media/shows` | Online Shows | Shows | ⏳ Pending |
| `/media/webinars` | Webinar Hub | Webinars | ⏳ Pending |
| `/media/gala` | Awards Gala | Gala | ⏳ Pending |
| `/press` | Press & News | Press | ⏳ Pending |

### Events
| Route | Title | Component | Stage-Gated | Status |
|-------|-------|-----------|-------------|--------|
| `/events` | Events | Events | - | ⏳ Pending |
| `/tickets` | Tickets | Tickets | tickets | ⏳ Pending |
| `/events/tourism` | Education Tourism | Tourism | - | ⏳ Pending |

### Support
| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/donate` | Donate | Donate | ⏳ Pending |
| `/eduaid` | EduAid-Africa | EduAid | ⏳ Pending |
| `/rebuild` | Rebuild My School | Rebuild | ⏳ Pending |
| `/contact` | Contact | Contact | ⏳ Pending |
| `/faq` | FAQs | FAQ | ⏳ Pending |

---

## Auth Pages (5)

| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/login` | Sign In | Login | ✅ Implemented |
| `/register` | Sign Up | Register | ✅ Implemented |
| `/forgot-password` | Forgot Password | ForgotPassword | ⏳ Pending |
| `/reset-password` | Reset Password | ResetPassword | ⏳ Pending |
| `/verify-email` | Verify Email | VerifyEmail | ⏳ Pending |

---

## User Dashboard (8)

| Route | Title | Component | Required Roles | Status |
|-------|-------|-----------|----------------|--------|
| `/dashboard` | Dashboard | Dashboard | user | ✅ Implemented |
| `/dashboard/profile` | My Profile | Profile | user | ⏳ Pending |
| `/dashboard/nominations` | My Nominations | MyNominations | user | ✅ Partial |
| `/dashboard/votes` | My Votes | MyVotes | user | ⏳ Pending |
| `/dashboard/certificates` | Certificates | Certificates | user | ⏳ Pending |
| `/dashboard/wallet` | Wallet | Wallet | user | ⏳ Pending |
| `/dashboard/notifications` | Notifications | Notifications | user | ⏳ Pending |
| `/dashboard/settings` | Settings | Settings | user | ⏳ Pending |

---

## NRC Dashboard (5)

| Route | Title | Component | Required Roles | Status |
|-------|-------|-----------|----------------|--------|
| `/nrc` | NRC Dashboard | NRCDashboard | nrc, admin | ✅ Implemented |
| `/nrc/assigned` | Assigned Reviews | NRCAssigned | nrc, admin | ⏳ Pending |
| `/nrc/evidence` | Evidence Validation | NRCEvidence | nrc, admin | ⏳ Pending |
| `/nrc/logs` | Approval Logs | NRCLogs | nrc, admin | ⏳ Pending |
| `/nrc/audit` | Audit Trail | NRCAudit | nrc, admin | ⏳ Pending |

---

## Jury Dashboard (4)

| Route | Title | Component | Required Roles | Stage-Gated | Status |
|-------|-------|-----------|----------------|-------------|--------|
| `/jury` | Jury Dashboard | JuryDashboard | jury, admin | jury_scoring | ⏳ Pending |
| `/jury/scoring` | Scoring | JuryScoring | jury, admin | jury_scoring | ⏳ Pending |
| `/jury/chat` | Jury Discussion | JuryChat | jury, admin | jury_scoring | ⏳ Pending |
| `/jury/results` | Locked Results | JuryResults | jury, admin | results | ⏳ Pending |

---

## Chapter Dashboard (4)

| Route | Title | Component | Required Roles | Status |
|-------|-------|-----------|----------------|--------|
| `/chapter` | Chapter Dashboard | ChapterDashboard | chapter, admin | ⏳ Pending |
| `/chapter/events` | Local Events | ChapterEvents | chapter, admin | ⏳ Pending |
| `/chapter/nominations` | Local Nominations | ChapterNominations | chapter, admin | ⏳ Pending |
| `/chapter/reports` | Reports | ChapterReports | chapter, admin | ⏳ Pending |

---

## Admin Dashboard (8)

| Route | Title | Component | Required Roles | Status |
|-------|-------|-----------|----------------|--------|
| `/admin` | Admin Dashboard | AdminDashboard | admin | ⏳ Pending |
| `/admin/stages` | Stage Control | AdminStages | admin | ⏳ Pending |
| `/admin/categories` | Category Control | AdminCategories | admin | ⏳ Pending |
| `/admin/users` | User Roles | AdminUsers | admin | ⏳ Pending |
| `/admin/cms` | CMS | AdminCMS | admin | ⏳ Pending |
| `/admin/media` | Media Scheduling | AdminMedia | admin | ⏳ Pending |
| `/admin/logs` | Audit Logs | AdminLogs | admin | ⏳ Pending |
| `/admin/compliance` | Compliance | AdminCompliance | admin | ⏳ Pending |

---

## Legal Pages (4)

| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/policies/privacy` | Privacy Policy | PrivacyPolicy | ⏳ Pending |
| `/policies/terms` | Terms of Service | Terms | ⏳ Pending |
| `/policies/coi` | Conflict of Interest | COIPolicy | ⏳ Pending |
| `/policies/voting-integrity` | Voting Integrity | VotingIntegrity | ⏳ Pending |

---

## Utility Pages (3)

| Route | Title | Component | Status |
|-------|-------|-----------|--------|
| `/certificates/verify/:code` | Verify Certificate | VerifyCertificate | ⏳ Pending |
| `/unauthorized` | Unauthorized | Unauthorized | ✅ Implemented |
| `*` | Not Found | NotFound | ✅ Implemented |

---

## Navigation Structure

### Main Navbar (Desktop)
```
Home | About ▾ | Awards ▾ | Participate ▾ | Media ▾ | Events ▾ | Support ▾ | [User Menu]
```

### About Dropdown
- About NESA-Africa
- Vision 2035
- Governance & Firewalls
- Programme Timeline
- SCEF Foundation

### Awards Dropdown
- Award Categories (180+ subcategories badge)
- Platinum Certificate
- Africa Education Icon
- Gold Certificate
- Blue Garnet Award
- Past Winners

### Participate Dropdown
- Nominate (stage-gated)
- Vote (stage-gated)
- Become a Partner
- Join Local Chapter
- Volunteer

### Media Dropdown
- NESA Africa TV (Live badge)
- Online Shows
- Webinar Hub
- Awards Gala
- Press & News

### Events Dropdown
- Upcoming Events
- Get Tickets (stage-gated)
- Education Tourism

### Support Dropdown
- Donate
- EduAid-Africa
- Rebuild My School

### Mobile Navigation
Quick grid: Home, Categories, Nominate, Vote, NESA TV, Donate

Full accordion menu with all sections expandable.

---

## Implementation Notes

1. **Stage Gating**: Pages marked with `stageGated` use the `StageGate` component
2. **Role Protection**: Pages with `requiredRoles` use `ProtectedRoute`
3. **Season Awareness**: All dates/years derive from `useSeason()` context
4. **Navigation Config**: Centralized in `src/config/navigation.ts`
5. **New MainNav**: Located at `src/components/navigation/MainNav.tsx`

---

## File Structure

```
src/
├── config/
│   └── navigation.ts          # All navigation configuration
├── components/
│   └── navigation/
│       └── MainNav.tsx        # New responsive navbar
├── pages/
│   ├── programs/
│   │   └── NESAAfrica.tsx     # Landing page
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Categories.tsx
│   ├── Dashboard.tsx
│   ├── NRCDashboard.tsx
│   ├── Nominate.tsx
│   └── ...
└── features/
    └── landing/
        └── NESALandingPage.tsx
```
