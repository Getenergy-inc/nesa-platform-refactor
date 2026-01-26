# NESA-Africa API Compliance Checklist

**Last Updated:** 2026-01-26  
**Backend:** Supabase Edge Functions (Lovable Cloud)

---

## ✅ Implemented Edge Functions

| Function | Endpoints | Status |
|----------|-----------|--------|
| `health` | GET / | ✅ Deployed |
| `season` | GET / | ✅ Deployed |
| `stage` | GET /, POST /switch, POST /update, GET /all | ✅ Deployed |
| `nrc` | GET /queue, GET /stats, POST /assign, POST /decision, GET /logs | ✅ Deployed |
| `voting` | GET /eligibility, GET /tally, GET /me, POST /vote | ✅ Deployed |
| `certificates` | GET /verify/:code, GET /me, POST /issue, POST /:id/renew | ✅ Deployed |
| `import-nominees` | POST / (dry_run + actual) | ✅ Deployed |

---

## ✅ Frontend API Client Modules

| Module | Path | Exports |
|--------|------|---------|
| HTTP | `src/api/http.ts` | `api`, `request`, `ApiError` |
| Config | `src/api/config.ts` | `getHealth`, `getSeason`, `getStage`, `configAdmin` |
| NRC | `src/api/nrc.ts` | `getQueue`, `getStats`, `submitDecision`, `approveNomination` |
| Voting | `src/api/voting.ts` | `getEligibility`, `getTally`, `castVote`, `getMyVotes` |
| Certificates | `src/api/certificates.ts` | `verify`, `getMyCertificates`, `certificatesAdmin` |
| Admin | `src/api/admin.ts` | `migrations`, `roles`, `audit` |
| Index | `src/api/index.ts` | Unified exports |

---

## PRD Compliance

- ✅ 17 official categories (no entertainment/sports/film)
- ✅ 138 subcategories with region-first logic
- ✅ Stage-gated voting (public_voting, jury_scoring)
- ✅ NRC workflow (APPROVE/REJECT/NEEDS_INFO)
- ✅ Certificate verification (QR/code)
- ✅ Audit logging for all sensitive actions
- ✅ RBAC enforcement via `has_role()` function

---

## Security

- ✅ All Edge Functions use `verify_jwt = false` with manual token validation
- ✅ Admin endpoints check `has_role(admin)`
- ✅ NRC endpoints check `has_role(nrc)` OR `has_role(admin)`
- ✅ Jury endpoints check `has_role(jury)`
- ✅ Sponsor firewall: No voting/nomination data exposed to sponsors
