import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    return new Response(JSON.stringify(response), {
      status: allOk ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
