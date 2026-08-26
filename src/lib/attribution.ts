/**
 * Campaign attribution persistence.
 *
 * Mirrors the storage strategy already used by `useReferralCode`
 * (60-day cookie + localStorage) but for the five standard UTM params.
 * First-touch wins: an existing captured campaign is not overwritten by a
 * later visit without UTM params, and is only replaced when a new visit
 * carries a fresh `utm_source`.
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const UTM_STORAGE_KEY = "nesa_utm_params";
const UTM_COOKIE_NAME = "nesa_utm";
const UTM_EXPIRY_DAYS = 60;

/** Referral keys — kept in sync with `useReferralCode`. */
const REFERRAL_STORAGE_KEY = "nesa_referral_code";
const REFERRAL_COOKIE_NAME = "nesa_ref_code";

/** Anonymous session id — same key the nomination draft layer already uses. */
const SESSION_KEY = "nesa.nom-session-id";

// ============== Cookie helpers (same shape as useReferralCode) ==============

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  for (const cookie of document.cookie.split(";")) {
    const c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

// ============== UTM capture / read ==============

/**
 * Reads UTM params from a query string and persists them (first-touch).
 * Safe to call on every route change.
 */
export function captureUtmFromSearch(search: string): UtmParams {
  if (typeof window === "undefined") return {};
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    return getStoredUtm();
  }

  const found: UtmParams = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v && v.trim()) found[key] = v.trim().slice(0, 200);
  }

  if (Object.keys(found).length === 0) return getStoredUtm();

  const serialized = JSON.stringify(found);
  try {
    window.localStorage.setItem(UTM_STORAGE_KEY, serialized);
  } catch {
    /* storage unavailable */
  }
  try {
    setCookie(UTM_COOKIE_NAME, serialized, UTM_EXPIRY_DAYS);
  } catch {
    /* cookies unavailable */
  }
  return found;
}

/** Returns the persisted UTM params (localStorage first, then cookie). */
export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(UTM_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) {
    try {
      raw = getCookie(UTM_COOKIE_NAME);
    } catch {
      raw = null;
    }
  }
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as UtmParams;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Clears the persisted campaign params. */
export function clearStoredUtm() {
  try {
    window.localStorage.removeItem(UTM_STORAGE_KEY);
  } catch {
    /* no-op */
  }
  document.cookie = `${UTM_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// ============== Referral code (read-only mirror of useReferralCode) ==============

/** Persisted referral code, readable outside React. */
export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const local = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (local) return local;
  } catch {
    /* no-op */
  }
  try {
    return getCookie(REFERRAL_COOKIE_NAME);
  } catch {
    return null;
  }
}

/** Captures `?ref=` outside React so non-nomination landings attribute too. */
export function captureReferralFromSearch(search: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const code = new URLSearchParams(search).get("ref");
    if (code && code.trim()) {
      const value = code.trim();
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, value);
      setCookie(REFERRAL_COOKIE_NAME, value, UTM_EXPIRY_DAYS);
      return value;
    }
  } catch {
    /* no-op */
  }
  return getStoredReferralCode();
}

// ============== Session id ==============

/** Stable anonymous session id shared with the nomination draft layer. */
export function getAttributionSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let v = window.localStorage.getItem(SESSION_KEY) ?? "";
    if (!v) {
      v = `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(SESSION_KEY, v);
    }
    return v;
  } catch {
    return `sess_${Date.now().toString(36)}`;
  }
}

/** Everything the nomination submit path needs to attribute a row. */
export function getAttribution(): {
  utm: UtmParams;
  referralCode: string | null;
  sessionId: string;
} {
  return {
    utm: getStoredUtm(),
    referralCode: getStoredReferralCode(),
    sessionId: getAttributionSessionId(),
  };
}
