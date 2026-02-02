/**
 * Shared Utilities Index
 * 
 * Re-exports all shared utilities for convenient imports in Edge Functions.
 * 
 * @example
 * import { corsHeaders, ok, err, createUserClient, getAuthUser, hasRole } from "../_shared/index.ts";
 */

// CORS utilities
export { corsHeaders, handleCorsPreflightRequest } from "./cors.ts";

// Response utilities
export { ok, err, json } from "./response.ts";

// Authentication utilities
export {
  getAuthUser,
  getAuthUserFull,
  hasRole,
  hasRoleCode,
  requireAuth,
  requireRole,
  AuthError,
  type AppRole,
  type RoleCode,
} from "./auth.ts";

// Database utilities
export {
  createUserClient,
  createAdminClient,
  getActiveSeason,
  isStageOpen,
} from "./db.ts";

// Router utilities
export {
  createRouter,
  parseRouteParams,
  type Route,
  type RouteHandler,
  type RouteParams,
} from "./router.ts";
