/**
 * Response Utilities for Edge Functions
 * 
 * Provides consistent JSON response formatting across all Edge Functions.
 * All responses follow the { ok, data, meta?, error? } envelope pattern.
 */

import { corsHeaders } from "./cors.ts";

/**
 * Success response with data
 * 
 * @example
 * return ok({ user: { id: "123", name: "John" } });
 * // => { ok: true, data: { user: { id: "123", name: "John" } } }
 * 
 * @example with pagination
 * return ok(users, { page: 1, total: 100 });
 * // => { ok: true, data: [...], meta: { page: 1, total: 100 } }
 */
export function ok(data: unknown, meta?: Record<string, unknown>, status = 200): Response {
  return new Response(
    JSON.stringify({ ok: true, data, ...(meta && { meta }) }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Error response
 * 
 * @example
 * return err("User not found", 404);
 * // => { ok: false, error: "User not found" }
 */
export function err(message: string, status = 400): Response {
  return new Response(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Create JSON response with custom structure (for legacy compatibility)
 */
export function json(data: unknown, status = 200): Response {
  return new Response(
    JSON.stringify(data),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
