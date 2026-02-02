# NESA-Africa Backend Architecture

## Overview

The backend is built on Supabase Edge Functions (Deno). All functions follow a consistent pattern using shared utilities from `_shared/`.

## Directory Structure

```
supabase/functions/
├── _shared/              # Shared utilities (imported by all functions)
│   ├── index.ts          # Re-exports all utilities
│   ├── cors.ts           # CORS headers and preflight handling
│   ├── response.ts       # Standard JSON responses (ok, err)
│   ├── auth.ts           # JWT verification and role checks
│   ├── db.ts             # Database client factories
│   └── router.ts         # Lightweight routing helper
├── admin/                # Admin-only endpoints
├── dashboard/            # Role-based dashboard data
├── health/               # Public health check
├── nominations/          # Nomination submission workflow
├── nrc/                  # NRC reviewer portal
├── olc/                  # Chapter coordinator portal
├── payments/             # Payment processing
├── referrals/            # Referral program
├── settlement/           # Revenue settlement (24h cron)
├── shop/                 # Merchandise store
├── uploads/              # File uploads (signed URLs)
├── verify/               # Certificate verification
├── voting/               # Public/jury voting
└── wallet/               # AGC wallet operations
```

## Shared Utilities

### Response Helpers

```typescript
import { ok, err } from "../_shared/index.ts";

// Success response: { ok: true, data: {...} }
return ok({ user: { id: "123" } });

// With pagination: { ok: true, data: [...], meta: { page, total } }
return ok(users, { page: 1, total: 100 });

// Error response: { ok: false, error: "message" }
return err("Not found", 404);
```

### Authentication

```typescript
import { getAuthUser, hasRole, hasRoleCode } from "../_shared/index.ts";

// Get authenticated user ID (or null)
const userId = await getAuthUser(supabase, req);
if (!userId) return err("Unauthorized", 401);

// Check roles
if (!(await hasRole(supabase, userId, "admin"))) {
  return err("Forbidden", 403);
}

// Check role codes (e.g., OLC_COORDINATOR)
if (await hasRoleCode(supabase, userId, "OLC_COORDINATOR")) {
  // User is a chapter coordinator
}
```

### Database Clients

```typescript
import { createUserClient, createAdminClient } from "../_shared/index.ts";

// User client (RLS enforced)
const supabase = createUserClient(req);

// Admin client (bypasses RLS)
const adminSupabase = createAdminClient();
```

## Creating a New Edge Function

1. Create folder: `supabase/functions/my-function/`
2. Create `index.ts`:

```typescript
import {
  handleCorsPreflightRequest,
  ok,
  err,
  createUserClient,
  createAdminClient,
  getAuthUser,
} from "../_shared/index.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const supabase = createUserClient(req);
    const userId = await getAuthUser(supabase, req);
    if (!userId) return err("Unauthorized", 401);

    // Your logic here...

    return ok({ success: true });
  } catch (error: unknown) {
    console.error("Error:", error);
    return err(error instanceof Error ? error.message : "Internal error", 500);
  }
});
```

3. Add to `supabase/config.toml`:
```toml
[functions.my-function]
verify_jwt = false
```

## Roles & Permissions

| Role | Code | Description |
|------|------|-------------|
| user | USER | Standard user |
| nrc | NRC | National Review Committee |
| jury | JURY | Jury scorer |
| chapter | OLC_COORDINATOR | Chapter coordinator |
| sponsor | SPONSOR | Sponsor access |
| admin | ADMIN | Full admin |

## Best Practices

1. **Always use shared utilities** - Don't duplicate CORS/auth/response code
2. **Parallel queries** - Use `Promise.all()` for independent queries
3. **Audit logging** - Log sensitive operations to `audit_logs` or `audit_events`
4. **Input validation** - Use zod for admin endpoints (see `admin/index.ts`)
5. **Error handling** - Catch errors and return consistent `err()` responses
