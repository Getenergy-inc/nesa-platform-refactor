import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SeasonInfo {
  key: string;
  name: string;
  displayYear: number;
  ceremonyYear: number;
  tagline: string;
  theme: string;
  isActive: boolean;
}

interface SeasonResponse {
  current: SeasonInfo;
  next: SeasonInfo | null;
  serverTime: string;
}

// Default season configuration
const DEFAULT_SEASONS: Record<string, SeasonInfo> = {
  "2025": {
    key: "2025",
    name: "NESA-Africa 2025",
    displayYear: 2025,
    ceremonyYear: 2026,
    tagline: "Honoring Africa's Changemakers",
    theme: "Building the Future of Education",
    isActive: true,
  },
  "2026": {
    key: "2026",
    name: "NESA-Africa 2026",
    displayYear: 2026,
    ceremonyYear: 2027,
    tagline: "Elevating African Excellence",
    theme: "Innovation in Education",
    isActive: false,
  },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch active season
    const { data: seasonData, error: seasonError } = await supabase
      .from("seasons")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (seasonError) {
      throw new Error(`Season fetch error: ${seasonError.message}`);
    }

    let current: SeasonInfo;
    
    if (seasonData) {
      const key = seasonData.year.toString();
      current = {
        key,
        name: seasonData.name,
        displayYear: seasonData.year,
        ceremonyYear: seasonData.year + 1,
        tagline: DEFAULT_SEASONS[key]?.tagline ?? "Honoring Africa's Changemakers",
        theme: DEFAULT_SEASONS[key]?.theme ?? "Building the Future of Education",
        isActive: true,
      };
    } else {
      current = DEFAULT_SEASONS["2025"];
    }

    // Calculate next season
    const nextKey = (current.displayYear + 1).toString();
    const next = DEFAULT_SEASONS[nextKey] ?? null;

    const response: SeasonResponse = {
      current,
      next,
      serverTime: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Season API error:", error);
    
    // Return default fallback
    const fallback: SeasonResponse = {
      current: DEFAULT_SEASONS["2025"],
      next: DEFAULT_SEASONS["2026"],
      serverTime: new Date().toISOString(),
    };

    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
