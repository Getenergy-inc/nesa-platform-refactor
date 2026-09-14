import { useState, useCallback, useRef } from "react";
import { createUuid } from "@/lib/uuid";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatMetadata {
  detectedIntent?: string;
  suggestedCta?: string;
  isEscalated?: boolean;
  language?: string;
}

const SOPHIA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sophia`;

export function useCustomerCareChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ChatMetadata>({});
  const conversationIdRef = useRef<string>(createUuid());
  const introducedRef = useRef(false);
  const [language, setLanguage] = useState<string | undefined>(undefined);

  const appendAssistant = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: createUuid(), role: "assistant", content, timestamp: new Date() },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      const userMessage: ChatMessage = {
        id: createUuid(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const resp = await fetch(SOPHIA_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationId: conversationIdRef.current,
            language,
            isFirstMessage: !introducedRef.current,
          }),
        });

        const data = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          throw new Error(data?.error || "Sophia could not respond right now.");
        }

        if (data.intro && !introducedRef.current) {
          introducedRef.current = true;
          appendAssistant(data.intro);
        }

        let reply: string = data.reply ?? "";
        if (data.cta?.href) {
          reply += `\n\n[${data.cta.label ?? "Continue"}](${data.cta.href})`;
        }
        appendAssistant(reply);

        setMetadata({
          detectedIntent: data.category ?? undefined,
          suggestedCta: data.cta?.href ?? undefined,
          isEscalated: Boolean(data.escalate),
          language: data.language,
        });
      } catch (err) {
        console.error("Sophia chat error:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, language, appendAssistant]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setMetadata({});
    introducedRef.current = false;
    conversationIdRef.current = createUuid();
  }, []);

  return {
    messages,
    isLoading,
    error,
    metadata,
    language,
    setLanguage,
    sendMessage,
    clearChat,
  };
}
