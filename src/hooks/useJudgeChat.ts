import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_to_id: string | null;
  // Joined from profiles
  user_name?: string;
  user_avatar?: string;
}

export function useJudgeChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get messages with user profiles
      const { data: chatMessages, error: msgError } = await supabase
        .from("judge_chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (msgError) throw msgError;

      // Get unique user IDs
      const userIds = [...new Set(chatMessages?.map((m) => m.user_id) || [])];

      // Fetch profiles for those users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(
        profiles?.map((p) => [p.user_id, p]) || []
      );

      // Enrich messages with user info
      const enrichedMessages: ChatMessage[] = (chatMessages || []).map((msg) => {
        const profile = profileMap.get(msg.user_id);
        return {
          ...msg,
          user_name: profile?.full_name || "Judge",
          user_avatar: profile?.avatar_url || undefined,
        };
      });

      setMessages(enrichedMessages);
    } catch (err: any) {
      console.error("Error fetching chat messages:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(
    async (messageText: string, replyToId?: string) => {
      if (!user || !messageText.trim()) return;

      try {
        setSending(true);
        setError(null);

        const { data, error: insertError } = await supabase
          .from("judge_chat_messages")
          .insert({
            user_id: user.id,
            message: messageText.trim(),
            reply_to_id: replyToId || null,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Message will be added via realtime subscription
        return data;
      } catch (err: any) {
        console.error("Error sending message:", err);
        setError(err.message || "Failed to send message");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [user]
  );

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("judge_chat_messages")
        .delete()
        .eq("id", messageId);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error("Error deleting message:", err);
      setError(err.message || "Failed to delete message");
      throw err;
    }
  }, []);

  // Edit a message
  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      try {
        const { error: updateError } = await supabase
          .from("judge_chat_messages")
          .update({ message: newText.trim(), is_edited: true })
          .eq("id", messageId);

        if (updateError) throw updateError;
      } catch (err: any) {
        console.error("Error editing message:", err);
        setError(err.message || "Failed to edit message");
        throw err;
      }
    },
    []
  );

  // Subscribe to realtime updates
  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel("judge-chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "judge_chat_messages",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Fetch profile for the new message
            const { data: profile } = await supabase
              .from("profiles")
              .select("user_id, full_name, avatar_url")
              .eq("user_id", (payload.new as any).user_id)
              .single();

            const newMessage: ChatMessage = {
              ...(payload.new as any),
              user_name: profile?.full_name || "Judge",
              user_avatar: profile?.avatar_url || undefined,
            };

            setMessages((prev) => [...prev, newMessage]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === (payload.new as any).id
                  ? { ...m, ...(payload.new as any) }
                  : m
              )
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((m) => m.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    deleteMessage,
    editMessage,
    refetch: fetchMessages,
  };
}
