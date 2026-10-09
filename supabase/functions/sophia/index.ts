/**
 * Sophia — NESA-Africa customer care assistant (web channel).
 *
 * Knowledge-base driven: answers come only from public.sophia_faqs.
 * Read-only. Sophia cannot read or modify nominee, nomination or admin data.
 */

import { corsHeaders } from "../_shared/cors.ts";
import {
  createServiceClient,
  detectLanguage,
  matchQuestion,
  logUnanswered,
  HUMAN_HANDOFF_EN,
  SUPPORTED_LANGS,
  type SophiaLang,
} from "../_shared/sophiaKb.ts";

const INTRO: Record<string, string> = {
  en: "Hello, I'm Sophia — the NESA-Africa care assistant. I'm an automated assistant, not a person, and I answer from our published knowledge base. If I can't help, I'll point you to our team.",
  fr: "Bonjour, je suis Sophia — l'assistante de NESA-Africa. Je suis une assistante automatisée, pas une personne. Si je ne peux pas vous aider, je vous orienterai vers notre équipe.",
  pt: "Olá, sou a Sophia — a assistente de apoio da NESA-Africa. Sou uma assistente automatizada, não uma pessoa. Se não puder ajudar, encaminho-o para a nossa equipa.",
  ar: "مرحبًا، أنا صوفيا — مساعدة الدعم في نيسا-أفريقيا. أنا مساعدة آلية ولست شخصًا. إذا لم أستطع المساعدة، سأوجهك إلى فريقنا.",
  sw: "Habari, mimi ni Sophia — msaidizi wa huduma wa NESA-Africa. Mimi ni msaidizi wa kiotomatiki, si mtu. Nisipoweza kusaidia, nitakuelekeza kwa timu yetu.",
};

const HANDOFF: Record<string, string> = {
  en: HUMAN_HANDOFF_EN,
  fr: "Je ne peux pas encore répondre à cela. Notre équipe peut vous aider directement — rendez-vous sur la page /support.",
  pt: "Ainda não consigo responder a isso. A nossa equipa pode ajudar diretamente — visite a página /support.",
  ar: "لا أستطيع الإجابة عن ذلك بعد. يمكن لفريقنا مساعدتك مباشرة عبر صفحة /support.",
  sw: "Bado siwezi kujibu hilo. Timu yetu inaweza kukusaidia moja kwa moja — tembelea ukurasa wa /support.",
};

function pick(map: Record<string, string>, lang: SophiaLang) {
  return map[lang] ?? map.en;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null) as
      | { message?: string; conversationId?: string; language?: string; isFirstMessage?: boolean }
      | null;

    const message = (body?.message ?? "").toString().trim();
    if (!message || message.length > 2000) {
      return new Response(JSON.stringify({ error: "A message between 1 and 2000 characters is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const explicit = body?.language;
    const lang: SophiaLang = SUPPORTED_LANGS.includes(explicit as SophiaLang)
      ? (explicit as SophiaLang)
      : detectLanguage(message);

    const supabase = createServiceClient();
    const match = await matchQuestion(supabase, message, lang);

    let reply: string;
    if (match.answer) {
      reply = match.answer;
      if (match.answeredInLang !== lang) {
        reply += "\n\n_(This answer is not yet available in your language — shown in English.)_";
      }
    } else {
      reply = pick(HANDOFF, lang);
      await logUnanswered(supabase, {
        question: message,
        lang,
        channel: "web",
        conversationId: body?.conversationId ?? null,
        bestMatchScore: match.score,
      });
    }

    return new Response(
      JSON.stringify({
        reply,
        intro: body?.isFirstMessage ? pick(INTRO, lang) : null,
        matched: Boolean(match.faq),
        score: Number(match.score.toFixed(2)),
        language: lang,
        answeredInLanguage: match.answeredInLang,
        category: match.faq?.category ?? null,
        cta: match.faq?.cta_href ? { label: match.faq.cta_label, href: match.faq.cta_href } : null,
        escalate: match.faq?.escalate ?? !match.faq,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Sophia error", e);
    return new Response(JSON.stringify({ error: "Sophia is temporarily unavailable." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
