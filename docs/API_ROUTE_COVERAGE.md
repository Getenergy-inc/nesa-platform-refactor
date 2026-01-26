# NESA-Africa API Route Coverage Matrix

**Last Updated:** 2026-01-26  
**Backend:** Supabase Edge Functions + Lovable Cloud

---

## Route Coverage Matrix

### Legend
- ✅ Exists and complete
- 🔶 Partially implemented
- ❌ Not implemented
- 🔧 Needs refactoring

---

## A) System & Config Endpoints

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/health` | GET | ❌ | — | Add basic health check |
| `/config/season` | GET | ✅ | `supabase/functions/season/index.ts` | Returns current/next season info |
| `/config/stage` | GET | ✅ | `supabase/functions/stage/index.ts` | Returns stage flags |

---

## B) Authentication Endpoints

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/auth/signup` | POST | ✅ | Supabase Auth (client SDK) | `supabase.auth.signUp()` |
| `/auth/login` | POST | ✅ | Supabase Auth (client SDK) | `supabase.auth.signInWithPassword()` |
| `/auth/logout` | POST | ✅ | Supabase Auth (client SDK) | `supabase.auth.signOut()` |
| `/auth/me` | GET | ✅ | `src/lib/api.ts:fetchUserProfile()` | Via client SDK |
| `/auth/verify-email` | POST | ✅ | Supabase Auth | Built-in magic link flow |
| `/auth/request-password-reset` | POST | ✅ | Supabase Auth | `supabase.auth.resetPasswordForEmail()` |
| `/auth/reset-password` | POST | ✅ | Supabase Auth | `supabase.auth.updateUser()` |
| `/auth/mfa/*` | * | ❌ | — | Scaffold for future |

---

## C) Categories & Subcategories

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/categories` | GET | ✅ | `src/lib/api.ts:fetchCategories()` | Direct Supabase query |
| `/categories/:slug` | GET | ✅ | `src/lib/api.ts:fetchCategoryBySlug()` | — |
| `/categories/:slug/subcategories` | GET | ✅ | `src/lib/api.ts:fetchSubcategories()` | Supports categorySlug filter |

**Database:** 17 categories, 138 subcategories seeded ✅

---

## D) Nominees

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/nominees` | GET | ✅ | `src/lib/api.ts:fetchNominees()` | Filters: subcategoryId, categorySlug, status, isPlatinum |
| `/nominees/:slug` | GET | ✅ | `src/lib/api.ts:fetchNomineeBySlug()` | — |
| `/nominees/:id/public` | GET | 🔶 | — | Need dedicated public view |
| `/nominees` | POST | ✅ | `src/lib/api.ts:submitNomination()` | Creates nomination, not nominee directly |
| `/nominees/:id` | PATCH | 🔶 | Via NRC workflow | Admin/NRC only |
| `/nominees/:id/accept` | POST | ❌ | — | NRC approval action |
| `/nominees/:id/renominate` | POST | ✅ | `src/lib/api.ts:renominateNominee()` | Increments counter, audit log |

---

## E) Evidence Uploads

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/uploads/evidence/init` | POST | ❌ | — | Need signed URL generator |
| `/nominees/:id/evidence` | POST | 🔶 | Evidence URLs in nomination | Uses Supabase Storage |
| `/nominees/:id/evidence` | GET | 🔶 | Via nominee query | — |

**Storage Bucket:** `nomination-evidence` exists ✅

---

## F) NRC Workflow

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/nrc/queue` | GET | ❌ | — | Need Edge Function |
| `/nrc/assign` | POST | ❌ | — | Need Edge Function |
| `/nrc/decision` | POST | ❌ | — | APPROVE/REJECT/NEEDS_INFO |
| `/nrc/logs` | GET | 🔶 | Via audit_logs table | — |

---

## G) Voting

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/voting/eligibility` | GET | ❌ | — | Check if user can vote |
| `/votes` | POST | ✅ | `src/lib/api.ts:submitPublicVote()` | Stage-gated via RLS |
| `/votes/me` | GET | 🔶 | — | Need dedicated query |
| `/voting/tally` | GET | ❌ | — | Public vote counts |

---

## H) Jury

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/jury/assignments` | GET | ❌ | — | Need table + Edge Function |
| `/jury/scores` | POST | ✅ | `src/lib/api.ts:submitJuryScore()` | Stage-gated |

---

## I) Certificates

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/certificates/issue` | POST | ❌ | — | Admin action |
| `/certificates/me` | GET | 🔶 | — | Need dedicated query |
| `/certificates/:id` | GET | 🔶 | — | — |
| `/certificates/verify/:code` | GET | ✅ | `src/lib/api.ts:verifyCertificate()` | QR verification |
| `/certificates/:id/renew` | POST | ❌ | — | Renewal logic |

---

## J) Wallet & Payments

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/wallet/config` | GET | ❌ | — | AGC rates, limits |
| `/payments/init` | POST | ❌ | — | Paystack/Flutterwave |
| `/payments/webhook/paystack` | POST | ❌ | — | Webhook handler |
| `/wallet/transactions/me` | GET | 🔶 | Via transactions table | — |

---

## K) Media

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/media` | GET | ✅ | `src/lib/api.ts:fetchMedia()` | Filters: mediaType, isLive, isFeatured |
| `/media/:id` | GET | 🔶 | — | Need byId query |
| `/admin/media` | POST | ❌ | — | Admin create |

---

## L) Content/CMS

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/content/pages/:slug` | GET | ❌ | — | Need table + function |
| `/content/faqs` | GET | ❌ | — | — |
| `/content/policies` | GET | ❌ | — | — |
| `/content/press` | GET | ❌ | — | — |
| `/admin/content/pages` | POST | ❌ | — | — |

---

## M) Governance/Admin/Audit

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/audit` | GET | 🔶 | Direct table query | Admin-only |
| `/admin/stages/update` | POST | ✅ | `supabase/functions/stage/index.ts` | — |
| `/admin/roles` | GET | ❌ | — | List all roles |
| `/admin/roles/assign` | POST | ❌ | — | Assign role to user |

---

## N) Legacy Nominee Import

| Endpoint | Method | Status | Implementation | Notes |
|----------|--------|--------|----------------|-------|
| `/admin/migrations/import-nominees` | POST | ✅ | `supabase/functions/import-nominees/index.ts` | Bulk import with dry_run |
| `/admin/migrations/status` | GET | ❌ | — | Import job status |

---

## Summary Statistics

| Category | Total | Exists | Partial | Missing |
|----------|-------|--------|---------|---------|
| System/Config | 3 | 2 | 0 | 1 |
| Auth | 8 | 7 | 0 | 1 |
| Categories | 3 | 3 | 0 | 0 |
| Nominees | 7 | 4 | 2 | 1 |
| Evidence | 3 | 0 | 2 | 1 |
| NRC | 4 | 0 | 1 | 3 |
| Voting | 4 | 1 | 1 | 2 |
| Jury | 2 | 1 | 0 | 1 |
| Certificates | 5 | 1 | 2 | 2 |
| Wallet/Payments | 4 | 0 | 1 | 3 |
| Media | 3 | 1 | 1 | 1 |
| Content/CMS | 5 | 0 | 0 | 5 |
| Admin/Audit | 4 | 1 | 1 | 2 |
| Migrations | 2 | 1 | 0 | 1 |
| **TOTAL** | **57** | **22** | **11** | **24** |

---

## Implementation Priority

### Phase 1: Critical (This PR)
1. Health check endpoint
2. NRC workflow endpoints (queue, assign, decision)
3. Voting eligibility + tally
4. Evidence upload init

### Phase 2: Core Features
1. Jury assignments
2. Certificate issue + renew
3. Payment webhook
4. User vote history

### Phase 3: CMS/Content
1. Content pages
2. FAQs, policies, press
3. Admin content management

### Phase 4: Wallet
1. Wallet config
2. Payment init
3. Transaction history
