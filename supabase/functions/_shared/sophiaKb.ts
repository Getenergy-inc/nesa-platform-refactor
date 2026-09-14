/**
 * Sophia shared knowledge-base retrieval layer.
 * Used by both the web chat endpoint and the WhatsApp webhook handler.
 * Read-only: it never writes to nominee, nomination or admin data.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPPORTED_LANGS = [
  "en", "fr", "ar", "sw", "zu", "yo", "ha", "hi", "am", "zh", "pt", "ig",
] as const;
export type SophiaLang = typeof SUPPORTED_LANGS[number];

export interface SophiaFaq {
  id: string;
  question: string;
  category: string;
  tags: string[];
  intent_keywords: string[];
  cta_label: string | null;
  cta_href: string | null;
  escalate: boolean;
  [key: string]: unknown;
}

export interface SophiaMatch {
  faq: SophiaFaq | null;
  score: number;
  answer: string | null;
  answeredInLang: SophiaLang;
}

export const HUMAN_HANDOFF_EN =
  "I can't answer that one yet. Our team can help directly — please use the Support page at /support, and a member of the NESA-Africa team will follow up.";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "do", "does", "how", "what", "when", "where",
  "who", "i", "my", "to", "of", "for", "in", "on", "and", "can", "you", "me",
  "it", "this", "that", "with", "about", "please", "hi", "hello",
]);

export function createServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
  );
}

/**
 * Lightweight language detection: script detection first (unambiguous),
 * then distinctive stopwords for the Latin-script languages we support.
 * Returns "en" whenever confidence is low — the user can switch explicitly.
 */
export function detectLanguage(text: string): SophiaLang {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u1200-\u137F]/.test(text)) return "am";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";

  const t = ` ${text.toLowerCase()} `;
  const hints: Array<[SophiaLang, string[]]> = [
    ["fr", [" bonjour ", " comment ", " je ", " nous ", " merci ", " pourquoi ", " candidature "]],
    ["pt", [" ola ", " olá ", " obrigado ", " como ", " voce ", " você ", " indicação "]],
    ["sw", [" habari ", " asante ", " jinsi ", " tafadhali ", " nini ", " elimu "]],
    ["zu", [" sawubona ", " ngiyabonga ", " kanjani ", " yini ", " imfundo "]],
    ["yo", [" bawo ", " pele ", " kini ", " ese ", " eko ", " ẹkọ "]],
    ["ha", [" sannu ", " yaya ", " nagode ", " na gode ", " ilimi ", " menene "]],
    ["ig", [" kedu ", " ndewo ", " daalu ", " gini ", " gịnị ", " agumakwukwo "]],
  ];
  for (const [lang, words] of hints) {
    if (words.some((w) => t.includes(w))) return lang;
  }
  return "en";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** Keyword-overlap scoring across question text, tags and intent keywords. */
export function scoreFaq(query: string, faq: SophiaFaq): number {
  const q = tokenize(query);
  if (q.length === 0) return 0;
  const haystack = [
    faq.question,
    (faq.tags ?? []).join(" "),
    (faq.intent_keywords ?? []).join(" "),
    faq.category,
  ].join(" ").toLowerCase();

  let hits = 0;
  for (const token of q) if (haystack.includes(token)) hits += 1;

  // Strong boost when a full intent phrase appears verbatim.
  const lowerQuery = query.toLowerCase();
  const phraseHit = (faq.intent_keywords ?? []).some(
    (k) => k.length > 4 && lowerQuery.includes(k.toLowerCase()),
  );

  const base = hits / q.length;
  return Math.min(1, phraseHit ? base + 0.35 : base);
}

export const MATCH_THRESHOLD = 0.34;

export function pickAnswer(faq: SophiaFaq, lang: SophiaLang): { answer: string; answeredInLang: SophiaLang } {
  const localised = faq[`answer_${lang}`];
  if (typeof localised === "string" && localised.trim().length > 0) {
    return { answer: localised, answeredInLang: lang };
  }
  return { answer: String(faq.answer_en ?? ""), answeredInLang: "en" };
}

// deno-lint-ignore no-explicit-any
export async function matchQuestion(supabase: any, query: string, lang: SophiaLang): Promise<SophiaMatch> {
  const { data, error } = await supabase
    .from("sophia_faqs")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;

  let best: SophiaFaq | null = null;
  let bestScore = 0;
  for (const faq of (data ?? []) as SophiaFaq[]) {
    const score = scoreFaq(query, faq);
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  if (!best || bestScore < MATCH_THRESHOLD) {
    return { faq: null, score: bestScore, answer: null, answeredInLang: "en" };
  }
  const { answer, answeredInLang } = pickAnswer(best, lang);
  return { faq: best, score: bestScore, answer, answeredInLang };
}

// deno-lint-ignore no-explicit-any
export async function logUnanswered(supabase: any, params: {
  question: string;
  lang: SophiaLang;
  channel: "web" | "whatsapp";
  conversationId?: string | null;
  bestMatchId?: string | null;
  bestMatchScore?: number;
}) {
  try {
    await supabase.from("sophia_unanswered").insert({
      question: params.question.slice(0, 2000),
      detected_language: params.lang,
      channel: params.channel,
      conversation_id: params.conversationId ?? null,
      best_match_id: params.bestMatchId ?? null,
      best_match_score: params.bestMatchScore ?? null,
    });
  } catch (e) {
    console.error("Failed to log unanswered question", e);
  }
}
