# NESA Africa API

Public REST contract for the **New Education Standard Award Africa** platform.
Drives the public website, nomination system, dashboards, voting, judging,
partners, events, payments, media, certificates, and admin operations.

## Stack

- **Backend** (`/backend`) — Express + TypeScript, JWT auth, Zod validation,
  Helmet, rate limiting, Swagger UI. Prisma-ready (Postgres). Source-only —
  deploy to Render / Railway / Fly / your own VPS.
- **Frontend** (`/src`) — Vite + React + Tailwind + shadcn/ui. New unified
  client at `src/lib/api/*` consumes the contract; legacy `src/api/*`
  (Supabase Edge Functions) keeps working in parallel.
- **Spec** — `docs/openapi.yaml` (OpenAPI 3.0). Served at `/docs` by the
  Express backend when running locally.

## Base URL

```
https://api.nesa.africa/api/v1     # production
http://localhost:4000/api/v1       # local dev
```

Frontend reads `VITE_API_BASE_URL`. If unset it falls back to the Supabase
Edge Functions origin so the app still works without a separate backend.

## Envelope

All responses use a single envelope:

```json
{ "success": true, "message": "OK", "data": { }, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }
```

Errors:

```json
{ "success": false, "message": "Validation failed",
  "error": { "code": "VALIDATION_ERROR", "details": [{ "field": "email", "message": "Email is required" }] } }
```

| Code | Meaning           | Code | Meaning           |
|------|-------------------|------|-------------------|
| 200  | Success           | 409  | Conflict          |
| 201  | Created           | 422  | Validation error  |
| 400  | Bad request       | 429  | Too many requests |
| 401  | Unauthorized      | 500  | Server error      |
| 403  | Forbidden         |      |                   |
| 404  | Not found         |      |                   |

## Auth flow

```
POST /auth/register  →  { user, accessToken, refreshToken }
POST /auth/login     →  { user, accessToken, refreshToken }
GET  /auth/me        →  current user (requires Bearer accessToken)
POST /auth/refresh   →  new tokens (using refreshToken)
POST /auth/logout    →  invalidate session
```

Send the access token as `Authorization: Bearer <token>` on every protected
request. The frontend client (`src/lib/api/client.ts`) does this for you and
stores tokens via `tokenStore` (localStorage by default — swap for cookies
if you move to SSR).

## User roles

Canonical list (mirrored in `backend/src/config/roles.ts`,
`src/types/api/auth.ts`, and `docs/openapi.yaml`):

```
SUPER_ADMIN, ADMIN, OPERATIONS_MANAGER, PROGRAM_MANAGER,
NOMINEE, NOMINATOR, JUDGE, HEAD_JUDGE, VOTER,
CHAPTER_LEAD, NRC_RESEARCHER, PARTNER, SPONSOR,
CSR_APPLICANT, GLOBAL_PARTNER, DIGITAL_VOICE,
MEDIA_EDITOR, FINANCE_MANAGER
```

The Supabase database currently uses a smaller set
(`admin, user, jury, nrc, chapter, sponsor`) — `src/lib/api/roles.ts`
provides the bidirectional mapping used by the new client.

## Modules (28)

Public • Auth • Users • Profiles • Award seasons • Categories • Nominations •
Nominees • Evidence • Judging • Voting • Vote integrity • Regions / Chapters •
NRC • Partners • CSR • Global grants • Digital voices • Media • Events •
Tickets • Payments • Wallet / Ledger • Certificates • Grievances •
Notifications • Analytics • Settings • Audit logs

Full route list lives in `docs/openapi.yaml`. Browse interactively at
`http://localhost:4000/docs` once the backend is running.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev               # http://localhost:4000/api/v1
```

### Frontend (already wired in this repo)

```bash
cp .env.example .env      # set VITE_API_BASE_URL=http://localhost:4000/api/v1
npm install
npm run dev
```

## Frontend usage

```ts
import { authApi, nominationsApi, votingApi, ApiError } from "@/lib/api";

// login
await authApi.login({ email, password });

// list nominations
const { data, meta } = await nominationsApi.list({ page: 1, limit: 20 });

// error handling
try {
  await votingApi.castVote({ nomineeId, categoryId });
} catch (e) {
  if (e instanceof ApiError && e.code === "RATE_LIMITED") { /* … */ }
}
```

## Folder structure

```
backend/
  src/
    config/         env, roles
    middleware/     auth, validation, rate limit, errors
    routes/         auth.routes.ts, stubs.routes.ts (one router per module)
    utils/          envelope helpers, ApiError
    server.ts       app entrypoint
  .env.example
  package.json

src/
  lib/api/          new client (auth, users, profiles, categories,
                    nominations, nominees, judging, voting, payments + 18 stubs)
  types/api/        common, auth, domain
  api/              legacy Supabase clients (kept alongside)

docs/
  openapi.yaml
  API_README.md     ← this file
```

## Adding a new endpoint

1. Add the route to `docs/openapi.yaml`.
2. Implement the handler in `backend/src/routes/*.routes.ts` with a Zod
   schema, `requireAuth` / `requireRole` middleware, and the `ok` / `created`
   envelope helpers.
3. Add a typed method to the matching frontend file in `src/lib/api/*.api.ts`.
4. Use it from a component: `const { data } = await myApi.something()`.

## Security rules

1. Never expose private judge scores publicly.
2. Never let sponsors / partners influence judging.
3. Never serve private nominee evidence without approval — use signed URLs.
4. Log every admin action (`/audit-logs`).
5. Rate-limit login, voting, contact, uploads, password reset.
6. Validate every upload (type, size, virus scan if available).
7. Sanitize all user-generated rich text.
8. Strong permissions for payments, ledger, role changes, certificate
   generation.

## License

Proprietary — © Santos Creations Educational Foundation (SCEF).
