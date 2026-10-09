/**
 * Sophia — WhatsApp Business Cloud API webhook handler.
 *
 * STATUS: fully implemented, NOT yet live. It becomes operational the moment
 * Meta Business verification is complete and these secrets are configured:
 *   WHATSAPP_VERIFY_TOKEN   — the token you type into Meta's webhook setup screen
 *   WHATSAPP_ACCESS_TOKEN   — permanent system-user token from the WhatsApp app
 *   WHATSAPP_PHONE_NUMBER_ID — the phone number id for +234 907 962 1110
 *
 * Until those exist this handler reports its real state (503 / not configured).
 * It never fakes a delivered message.
 */

import {
  createServiceClient,
  detectLanguage,
  matchQuestion,
  logUnanswered,
  HUMAN_HANDOFF_EN,
} from "../_shared/sophiaKb.ts";

const GRAPH_VERSION = "v21.0";

// deno-lint-ignore no-explicit-any
async function logMessage(supabase: any, row: Record<string, unknown>) {
  try {
    await supabase.from("sophia_whatsapp_messages").insert(row);
  } catch (e) {
    console.error("WhatsApp log failed", e);
  }
}

async function sendWhatsAppMessage(to: string, body: string) {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneNumberId) {
    return { ok: false, status: "not_configured", detail: "WhatsApp API credentials are not configured." };
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body },
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, status: "failed", detail: JSON.stringify(payload).slice(0, 500) };
  }
  return { ok: true, status: "sent", detail: null, payload };
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. Meta webhook verification handshake
  if (req.method === "GET") {
    const verifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
    if (!verifyToken) {
      return new Response("WhatsApp webhook is not configured yet.", { status: 503 });
    }
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === verifyToken && challenge) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    // deno-lint-ignore no-explicit-any
    const entries = (payload as any)?.entry ?? [];
    for (const entry of entries) {
      for (const change of entry?.changes ?? []) {
        const value = change?.value ?? {};
        const messages = value?.messages ?? [];
        for (const msg of messages) {
          if (msg?.type !== "text") continue;
          const from: string = msg.from;
          const text: string = msg.text?.body ?? "";
          const lang = detectLanguage(text);

          const match = await matchQuestion(supabase, text, lang);
          const reply = match.answer ?? HUMAN_HANDOFF_EN;

          await logMessage(supabase, {
            direction: "inbound",
            wa_message_id: msg.id ?? null,
            wa_from: from,
            wa_to: value?.metadata?.display_phone_number ?? null,
            body: text,
            detected_language: lang,
            matched_faq_id: match.faq?.id ?? null,
            delivery_status: "received",
            raw: msg,
          });

          if (!match.answer) {
            await logUnanswered(supabase, {
              question: text,
              lang,
              channel: "whatsapp",
              conversationId: from,
              bestMatchScore: match.score,
            });
          }

          const send = await sendWhatsAppMessage(from, reply);
          await logMessage(supabase, {
            direction: "outbound",
            wa_to: from,
            body: reply,
            detected_language: match.answeredInLang,
            matched_faq_id: match.faq?.id ?? null,
            delivery_status: send.status,
            error_detail: send.detail ?? null,
          });
        }
      }
    }
  } catch (e) {
    console.error("WhatsApp webhook processing error", e);
  }

  // Always 200 so Meta does not retry-storm; real state is in the message log.
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
