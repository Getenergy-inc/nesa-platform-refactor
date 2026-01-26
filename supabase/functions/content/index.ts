import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } }
    );

    // Helper to check admin role
    const checkAdmin = async () => {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) return false;
      
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error } = await supabase.auth.getClaims(token);
      if (error || !claimsData?.claims) return false;
      
      const { data: hasAdmin } = await supabase.rpc("has_role", {
        _user_id: claimsData.claims.sub,
        _role: "admin",
      });
      return hasAdmin === true;
    };

    // Route handling
    switch (action) {
      case "pages": {
        // GET /content/pages/:slug
        if (req.method === "GET") {
          const slug = pathParts[2];
          
          if (slug) {
            // Get single page
            const { data, error } = await supabase
              .from("content_pages")
              .select("*")
              .eq("slug", slug)
              .single();

            if (error) throw error;
            return new Response(
              JSON.stringify({ page: data }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // List all pages (admin sees all, public sees published)
          const isAdmin = await checkAdmin();
          let query = supabase.from("content_pages").select("*");
          
          if (!isAdmin) {
            query = query.eq("is_published", true);
          }

          const { data, error } = await query.order("updated_at", { ascending: false });
          if (error) throw error;

          return new Response(
            JSON.stringify({ pages: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // POST /content/pages - Create page (admin only)
        if (req.method === "POST") {
          const isAdmin = await checkAdmin();
          if (!isAdmin) {
            return new Response(
              JSON.stringify({ error: "Forbidden" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const body = await req.json();
          const { slug, title, content, metadata, is_published } = body;

          const { data, error } = await supabase
            .from("content_pages")
            .insert({ slug, title, content, metadata, is_published })
            .select()
            .single();

          if (error) throw error;
          return new Response(
            JSON.stringify({ page: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // PUT /content/pages/:slug - Update page (admin only)
        if (req.method === "PUT") {
          const isAdmin = await checkAdmin();
          if (!isAdmin) {
            return new Response(
              JSON.stringify({ error: "Forbidden" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const slug = pathParts[2];
          const body = await req.json();

          const { data, error } = await supabase
            .from("content_pages")
            .update(body)
            .eq("slug", slug)
            .select()
            .single();

          if (error) throw error;
          return new Response(
            JSON.stringify({ page: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "faqs": {
        // GET /content/faqs
        if (req.method === "GET") {
          const category = url.searchParams.get("category");
          
          let query = supabase
            .from("faqs")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

          if (category) {
            query = query.eq("category", category);
          }

          const { data, error } = await query;
          if (error) throw error;

          return new Response(
            JSON.stringify({ faqs: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // POST /content/faqs - Create FAQ (admin only)
        if (req.method === "POST") {
          const isAdmin = await checkAdmin();
          if (!isAdmin) {
            return new Response(
              JSON.stringify({ error: "Forbidden" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const body = await req.json();
          const { question, answer, category, display_order } = body;

          const { data, error } = await supabase
            .from("faqs")
            .insert({ question, answer, category, display_order })
            .select()
            .single();

          if (error) throw error;
          return new Response(
            JSON.stringify({ faq: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "press": {
        // Press releases - stored as content_pages with category='press'
        if (req.method === "GET") {
          const { data, error } = await supabase
            .from("content_pages")
            .select("*")
            .eq("is_published", true)
            .contains("metadata", { category: "press" })
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(
            JSON.stringify({ articles: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Content function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
