/**
 * Customer Care Chat Edge Function
 * 
 * AI-powered FAQ chat assistant using Lovable AI Gateway.
 * Answers user questions based on FAQ database content.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { messages } = await req.json() as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch active FAQs from database
    const { data: faqs, error: faqError } = await supabase
      .from("faqs")
      .select("id, question, answer, category")
      .eq("is_active", true)
      .order("category")
      .order("display_order");

    if (faqError) {
      console.error("FAQ fetch error:", faqError);
    }

    // Build FAQ context for the AI
    const faqContext = faqs && faqs.length > 0
      ? faqs.map((faq: FAQ) => 
          `Category: ${faq.category || 'General'}\nQ: ${faq.question}\nA: ${faq.answer}`
        ).join("\n\n---\n\n")
      : "No FAQs available. Please provide general helpful responses about NESA-Africa awards program.";

    const systemPrompt = `You are a friendly and professional customer care assistant for NESA-Africa (National Education Stakeholders Awards Africa). Your role is to help users with their questions about the awards program, nominations, voting, certificates, and general inquiries.

IMPORTANT GUIDELINES:
1. Answer questions based on the FAQ knowledge base provided below
2. If a question is covered in the FAQs, use that information to provide accurate answers
3. For questions not covered in FAQs, provide helpful general guidance about NESA-Africa
4. Be warm, professional, and helpful in your responses
5. If you're unsure about something specific, suggest contacting support@nesa.africa
6. Keep responses concise but informative
7. Use markdown formatting for better readability when appropriate

FAQ KNOWLEDGE BASE:
${faqContext}

ABOUT NESA-AFRICA:
- NESA-Africa honors excellence in education across Africa
- The awards recognize educators, institutions, and organizations making significant contributions
- Categories include teaching excellence, innovation, leadership, and community impact
- Nominations are open to the public during nomination periods
- Winners receive certificates and recognition at the annual ceremony

Remember: You're here to help users navigate the NESA-Africa platform and answer their questions professionally.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Customer care chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
