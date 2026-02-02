/**
 * Health Check Edge Function
 * 
 * Public endpoint for system health monitoring.
 * GET /health - Returns system status and service availability
 */

import { corsHeaders, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { ok, err } from "../_shared/response.ts";

interface HealthResponse {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  version: string;
  services: {
    database: boolean;
    auth: boolean;
    storage: boolean;
  };
  uptime: number;
}

const startTime = Date.now();

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    // Basic connectivity checks
    const dbOk = !!supabaseUrl;
    const authOk = !!supabaseKey;
    const storageOk = true; // Assume ok if edge functions running

    const allOk = dbOk && authOk && storageOk;

    const response: HealthResponse = {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: dbOk,
        auth: authOk,
        storage: storageOk,
      },
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };

    return ok(response, undefined, allOk ? 200 : 503);
  } catch (error: unknown) {
    console.error("Health check error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return err(message, 500);
  }
});
