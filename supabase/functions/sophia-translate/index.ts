/**
 * Admin-only batch translator for the Sophia knowledge base.
 *
 * Fills missing answer_<lang> columns in public.sophia_faqs using the
 * Lovable AI Gateway. It never touches answer_en (the source of truth) and
 * never writes to any other table. Idempotent: rows that already have a
 * translation for a language are skipped.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const LANGS: Record<string, string> = {
  fr: "French",
  ar: "Arabic",
  pt: "Portuguese (European)",
  sw: "Swahili",
  ha: "Hausa",
  yo: "Yoruba",
  ig: "Igbo",
  am: "Amharic",
  zu: "Zulu",
  zh: "Simplified Chinese",
  hi: "Hindi",
};

const MODEL = "google/gemini-3.1-pro-preview";

async function translate(apiKey: string, lang: string, texts: string[]): Promise<string[]> {
  const payload = texts.map((t, i) => ({ i, text: t }));
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            `You are a professional translator for NESA-Africa, an African education awards platform. ` +
            `Translate each item's "text" from English into ${LANGS[lang]}. ` +
            `Keep the meaning exact — never add, remove or soften facts, dates or figures. ` +
            `Keep URLs, paths (like /support), brand names (NESA-Africa, SCEF, AGC, Afri-Gold Coin, ` +
            `Blue-Garnet, Nominee Research Corps, EduAid Africa, Rebuild My School Africa) unchanged. ` +
            `Return ONLY a JSON array of objects: [{"i": number, "text": "translation"}].`,
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gateway ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const json = await res.json();
  const raw: string = json?.choices?.[0]?.message?.content ?? "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Translator returned no JSON array");
  const parsed = JSON.parse(match[0]) as { i: number; text: string }[];
  const out = new Array<string>(texts.length).fill("");
  for (const item of parsed) {
    if (typeof item?.i === "number" && typeof item?.text === "string" && out[item.i] !== undefined) {
      out[item.i] = item.text.trim();
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    // ---- gate: platform admin, or the maintenance key ---------------------
    const admin = createClient(supabaseUrl, serviceKey);
    const maintenanceKey = Deno.env.get("SOPHIA_TRANSLATE_KEY");
    const providedKey = req.headers.get("x-sophia-translate-key");
    let allowed = Boolean(maintenanceKey && providedKey && providedKey === maintenanceKey);

    if (!allowed) {
      const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
      if (!token) return json({ error: "Unauthorized" }, 401);
      const { data: userData, error: userErr } = await admin.auth.getUser(token);
      if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
      const { data: isAdmin } = await admin.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      allowed = Boolean(isAdmin);
    }
    if (!allowed) return json({ error: "Forbidden" }, 403);

    // ---- work -------------------------------------------------------------
    const body = await req.json().catch(() => ({}));
    const langs: string[] = Array.isArray(body?.langs)
      ? body.langs.filter((l: string) => l in LANGS)
      : Object.keys(LANGS);
    const batchSize: number = Math.min(Number(body?.batch_size) || 25, 40);

    const { data: rows, error } = await admin
      .from("sophia_faqs")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;

    const results: Record<string, { translated: number; skipped: number; error?: string }> = {};

    for (const lang of langs) {
      const col = `answer_${lang}`;
      const pending = (rows ?? []).filter(
        (r: Record<string, unknown>) => !String(r[col] ?? "").trim(),
      );
      results[lang] = { translated: 0, skipped: (rows?.length ?? 0) - pending.length };
      if (pending.length === 0) continue;

      try {
        for (let i = 0; i < pending.length; i += batchSize) {
          const chunk = pending.slice(i, i + batchSize);
          const translations = await translate(
            apiKey,
            lang,
            chunk.map((r: Record<string, unknown>) => String(r.answer_en)),
          );
          for (let k = 0; k < chunk.length; k++) {
            const text = translations[k];
            if (!text) continue;
            const { error: upErr } = await admin
              .from("sophia_faqs")
              .update({ [col]: text })
              .eq("id", chunk[k].id as string);
            if (!upErr) results[lang].translated += 1;
          }
        }
      } catch (e) {
        results[lang].error = e instanceof Error ? e.message : String(e);
      }
    }

    return json({ ok: true, results });
  } catch (e) {
    console.error("sophia-translate failed", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
