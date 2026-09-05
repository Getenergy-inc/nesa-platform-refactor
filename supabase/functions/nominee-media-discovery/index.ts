// Nominee media discovery — BACKEND/ADMIN INGESTION ONLY.
//
// Public pages never call this. It is invoked by admin/NRC staff to:
//   POST { action: "websites", limit? }  -> propose official websites for
//         organisation nominees that have none, into nominee_website_candidates
//         (pending review — nothing is written into `nominees`).
//   POST { action: "logos", limit? }     -> for nominees with a confirmed
//         website, pull the organisation's own brand mark from that domain into
//         nominee_media_sourcing as `candidate_found` (never auto-published).
//
// Auth: caller must be signed in with the `admin` or `nrc` role.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Domains that are never an organisation's own official site. */
const BLOCKED_HOSTS = [
  "facebook.com", "twitter.com", "x.com", "instagram.com", "linkedin.com",
  "youtube.com", "tiktok.com", "wikipedia.org", "wikimedia.org", "wikidata.org",
  "crunchbase.com", "glassdoor.com", "indeed.com", "devex.com", "guidestar.org",
  "charitynavigator.org", "medium.com", "blogspot.com", "wordpress.com",
  "sites.google.com", "yellowpages", "vconnect.com", "businesslist",
];

const STOP_WORDS = new Set([
  "the", "of", "for", "and", "in", "on", "a", "an", "africa", "african",
  "foundation", "trust", "initiative", "organisation", "organization",
  "international", "limited", "ltd", "inc", "plc", "group", "network",
]);

function tokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function candidateDomains(name: string): string[] {
  const core = tokens(name).join("");
  const acronym = tokens(name).map((t) => t[0]).join("");
  const bases = [core, acronym].filter((b) => b.length >= 3 && b.length <= 30);
  const tlds = [".org", ".org.ng", ".africa", ".com", ".ng"];
  const out: string[] = [];
  for (const base of bases) for (const tld of tlds) out.push(`${base}${tld}`);
  return [...new Set(out)];
}

async function fetchText(url: string, timeoutMs = 8000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "NESA-Africa nominee media verifier (+https://nesa.africa)" },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html")) return null;
    return (await res.text()).slice(0, 200_000);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function meta(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  return re.exec(html)?.[1] ?? null;
}

/** Token overlap between the nominee name and the site's own identity text. */
function confidenceFor(name: string, html: string): number {
  const title = (/<title[^>]*>([^<]{0,200})<\/title>/i.exec(html)?.[1] ?? "").toLowerCase();
  const site = (meta(html, "og:site_name") ?? "").toLowerCase();
  const desc = (meta(html, "description") ?? "").toLowerCase();
  const haystack = `${title} ${site} ${desc}`;
  const t = tokens(name);
  if (!t.length) return 0;
  const hits = t.filter((tok) => haystack.includes(tok)).length;
  return Math.round((hits / t.length) * 1000) / 1000;
}

function absolute(base: string, url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

/** Only the organisation's own brand mark — never building photos or posters. */
function extractLogo(html: string, base: string): { url: string; how: string } | null {
  const patterns: Array<[RegExp, string]> = [
    [/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i, "apple_touch_icon"],
    [/<img[^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i, "header_logo_asset"],
    [/<img[^>]+src=["']([^"']*logo[^"']*\.(?:svg|png|webp))["']/i, "logo_filename_asset"],
    [/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+\.(?:svg|png))["']/i, "site_icon"],
  ];
  for (const [re, how] of patterns) {
    const found = absolute(base, re.exec(html)?.[1] ?? null);
    if (found) return { url: found, how };
  }
  const og = absolute(base, meta(html, "og:logo") ?? null);
  if (og) return { url: og, how: "og_logo" };
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  const { data: userData } = await admin.auth.getUser(token);
  const user = userData?.user;
  if (!user) return json(401, { error: "Sign in required" });

  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "nrc");
  if (!allowed) return json(403, { error: "Admin or NRC role required" });

  let body: { action?: string; limit?: number };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  const limit = Math.min(Math.max(body.limit ?? 25, 1), 100);

  if (body.action === "websites") {
    const { data: nominees, error } = await admin
      .from("nominees")
      .select("id, name, organization, website, publication_status")
      .is("website", null)
      .not("organization", "is", null)
      .eq("publication_status", "published")
      .limit(limit);
    if (error) return json(500, { error: error.message });

    let accepted = 0;
    let rejected = 0;
    for (const n of nominees ?? []) {
      const label = (n.organization as string) || (n.name as string);
      let best: { domain: string; url: string; confidence: number } | null = null;
      for (const domain of candidateDomains(label).slice(0, 6)) {
        if (BLOCKED_HOSTS.some((h) => domain.includes(h))) continue;
        const url = `https://${domain}`;
        const html = await fetchText(url);
        if (!html) continue;
        const confidence = confidenceFor(label, html);
        if (!best || confidence > best.confidence) best = { domain, url, confidence };
      }
      if (!best) {
        rejected += 1;
        continue;
      }
      const status = best.confidence >= 0.7 ? "pending" : "rejected";
      if (status === "rejected") rejected += 1;
      else accepted += 1;
      await admin.from("nominee_website_candidates").upsert(
        {
          nominee_id: n.id,
          nominee_name: n.name,
          candidate_domain: best.domain,
          candidate_url: best.url,
          discovery_method: "name_normalised_domain_probe",
          confidence: best.confidence,
          review_status: status,
          rejection_reason: status === "rejected" ? "Site identity did not match the organisation name" : null,
        },
        { onConflict: "nominee_id,candidate_domain" },
      );
    }
    return json(200, { action: "websites", checked: nominees?.length ?? 0, accepted, rejected });
  }

  if (body.action === "logos") {
    const { data: confirmed, error } = await admin
      .from("nominee_website_candidates")
      .select("nominee_id, nominee_name, candidate_url, candidate_domain, confidence")
      .eq("review_status", "approved")
      .limit(limit);
    if (error) return json(500, { error: error.message });

    let found = 0;
    let none = 0;
    for (const c of confirmed ?? []) {
      const html = await fetchText(c.candidate_url as string);
      if (!html) {
        none += 1;
        continue;
      }
      const logo = extractLogo(html, c.candidate_url as string);
      if (!logo) {
        none += 1;
        continue;
      }
      found += 1;
      await admin.from("nominee_media_sourcing").upsert(
        {
          nominee_id: c.nominee_id,
          nominee_name: c.nominee_name,
          entity_type: "organization",
          media_kind: "logo",
          media_status: "candidate_found",
          candidate_image_url: logo.url,
          source_url: c.candidate_url,
          source_domain: c.candidate_domain,
          source_type: `official_site:${logo.how}`,
          confidence: c.confidence,
          date_checked: new Date().toISOString(),
          approved_for_public: false,
          verification_note: "Discovered on the organisation's own confirmed domain — awaiting human review",
        },
        { onConflict: "nominee_id" },
      );
    }
    return json(200, { action: "logos", checked: confirmed?.length ?? 0, found, none });
  }

  return json(400, { error: "Unknown action. Use 'websites' or 'logos'." });
});
