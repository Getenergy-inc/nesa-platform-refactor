import { useEffect, useRef, useState } from "react";

/**
 * Lightweight browser-side draft persistence for the "Nominate First" flow.
 *
 * Stores the in-progress form values under a stable key so a visitor can
 * refresh, navigate away, close the tab, or bounce through authentication
 * without losing what they typed. The full DB-backed draft table
 * (`nomination_drafts`) is also available for cross-device recovery via the
 * corresponding RPCs, but for the common single-session path localStorage
 * is fast, private, and requires no network round-trip.
 *
 * Expiry: drafts older than `maxAgeMs` (default 30 days) are ignored.
 */
export interface DraftEnvelope<T> {
  token: string;
  savedAt: number;
  values: T;
}

const KEY_PREFIX = "nesa.nom-draft.";

function newToken(): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `NOM-DRAFT-2026-${rand}`;
}

export function useDraftPersistence<T>(
  formKey: string,
  values: T,
  options?: { debounceMs?: number; maxAgeMs?: number },
): {
  draftToken: string;
  hydratedValues: T | null;
  clearDraft: () => void;
} {
  const storageKey = `${KEY_PREFIX}${formKey}`;
  const debounceMs = options?.debounceMs ?? 600;
  const maxAgeMs = options?.maxAgeMs ?? 30 * 24 * 60 * 60 * 1000;

  const [draftToken, setDraftToken] = useState<string>("");
  const [hydratedValues, setHydratedValues] = useState<T | null>(null);
  const timer = useRef<number | null>(null);

  // Hydrate once.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as DraftEnvelope<T>;
        if (parsed && Date.now() - parsed.savedAt < maxAgeMs) {
          setDraftToken(parsed.token);
          setHydratedValues(parsed.values);
          return;
        }
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      /* ignore */
    }
    setDraftToken(newToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Debounced autosave.
  useEffect(() => {
    if (!draftToken) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        const envelope: DraftEnvelope<T> = {
          token: draftToken,
          savedAt: Date.now(),
          values,
        };
        window.localStorage.setItem(storageKey, JSON.stringify(envelope));
      } catch {
        /* quota / private mode */
      }
    }, debounceMs);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [values, draftToken, storageKey, debounceMs]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return { draftToken, hydratedValues, clearDraft };
}
