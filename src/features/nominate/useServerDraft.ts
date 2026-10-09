import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Server-side draft persistence for the "Nominate first, account at submission"
 * flow. Creates a `nomination_drafts` row on first meaningful keystroke (no
 * account required) and debounces updates thereafter, so form data survives a
 * refresh, a navigation away, or an inline sign-in — on any device.
 *
 * Falls back silently to localStorage-only persistence if the network call
 * fails; the nomination is never blocked by draft persistence.
 */
const LOCAL_PREFIX = "nesa.nom-draft-token.";

export interface ServerDraftMeta {
  formType: string;
  awardTier?: string | null;
  categorySlug?: string | null;
  subcategorySlug?: string | null;
  nominatorEmail?: string | null;
}

function sessionId(): string {
  const key = "nesa.nom-session-id";
  let v = "";
  try {
    v = window.localStorage.getItem(key) ?? "";
    if (!v) {
      v = `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(key, v);
    }
  } catch {
    v = `sess_${Date.now().toString(36)}`;
  }
  return v;
}

export function useServerDraft<T extends Record<string, unknown>>(
  formKey: string,
  values: T,
  meta: ServerDraftMeta,
  options?: { debounceMs?: number; enabled?: boolean },
) {
  const debounceMs = options?.debounceMs ?? 1200;
  const enabled = options?.enabled ?? true;
  const tokenKey = `${LOCAL_PREFIX}${formKey}`;

  const [draftToken, setDraftToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const creating = useRef(false);
  const timer = useRef<number | null>(null);
  const metaRef = useRef(meta);
  metaRef.current = meta;

  // Hydrate an existing draft for this form (cross-session recovery).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let existing: string | null = null;
      try {
        existing = window.localStorage.getItem(tokenKey);
      } catch {
        /* ignore */
      }
      if (!existing) return;
      const { data, error } = await supabase.rpc("get_nomination_draft", {
        p_token: existing,
      });
      if (cancelled) return;
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row || (row as { status?: string }).status === "converted") {
        try {
          window.localStorage.removeItem(tokenKey);
        } catch {
          /* ignore */
        }
        return;
      }
      setDraftToken(existing);
      const nomineeData = (row as { nominee_data?: unknown }).nominee_data;
      if (nomineeData && typeof nomineeData === "object") {
        setHydrated(nomineeData as T);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tokenKey]);

  const persist = useCallback(
    async (payload: T) => {
      setSaving(true);
      try {
        if (!draftToken) {
          if (creating.current) return;
          creating.current = true;
          const { data, error } = await supabase.rpc("create_nomination_draft", {
            p_form_type: metaRef.current.formType,
            p_award_tier: metaRef.current.awardTier ?? null,
            p_category_slug: metaRef.current.categorySlug ?? null,
            p_subcategory_slug: metaRef.current.subcategorySlug ?? null,
            p_nominee_data: JSON.parse(JSON.stringify(payload)),
            p_nominator_email: metaRef.current.nominatorEmail ?? null,
            p_session_id: sessionId(),
          });
          creating.current = false;
          if (error) return;
          const row = Array.isArray(data) ? data[0] : data;
          const token = (row as { draft_token?: string } | null)?.draft_token ?? null;
          if (token) {
            setDraftToken(token);
            try {
              window.localStorage.setItem(tokenKey, token);
            } catch {
              /* ignore */
            }
            setSavedAt(Date.now());
          }
          return;
        }
        const { error } = await supabase.rpc("update_nomination_draft", {
          p_token: draftToken,
          p_nominee_data: JSON.parse(JSON.stringify(payload)),
          p_nominator_email: metaRef.current.nominatorEmail ?? null,
          p_award_tier: metaRef.current.awardTier ?? null,
          p_category_slug: metaRef.current.categorySlug ?? null,
          p_subcategory_slug: metaRef.current.subcategorySlug ?? null,
        });
        if (!error) setSavedAt(Date.now());
      } finally {
        setSaving(false);
      }
    },
    [draftToken, tokenKey],
  );

  // Debounced autosave — only once the visitor has typed something meaningful.
  useEffect(() => {
    if (!enabled) return;
    const meaningful = Object.values(values).some(
      (v) => (typeof v === "string" && v.trim().length > 2) || (Array.isArray(v) && v.length > 0),
    );
    if (!meaningful) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void persist(values), debounceMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [values, persist, debounceMs, enabled]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(tokenKey);
    } catch {
      /* ignore */
    }
    setDraftToken(null);
  }, [tokenKey]);

  const flush = useCallback(async () => {
    if (timer.current) window.clearTimeout(timer.current);
    await persist(values);
  }, [persist, values]);

  return { draftToken, hydratedValues: hydrated, saving, savedAt, clearDraft, flush };
}

export default useServerDraft;
