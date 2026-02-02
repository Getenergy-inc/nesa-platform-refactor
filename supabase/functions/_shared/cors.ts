/**
 * CORS Headers for Edge Functions
 * 
 * Standard CORS headers that allow cross-origin requests from any origin.
 * Used by all Edge Functions for preflight and response headers.
 */

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Handle CORS preflight request
 */
export function handleCorsPreflightRequest(): Response {
  return new Response(null, { headers: corsHeaders });
}
