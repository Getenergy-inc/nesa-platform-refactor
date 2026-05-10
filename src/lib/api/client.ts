/**
 * NESA Africa — New unified API client (spec v1).
 *
 * Implements the public contract documented in docs/openapi.yaml:
 *   { success, message, data, meta? } envelope
 *   { success: false, message, error: { code, details } } for errors
 *
 * This client lives ALONGSIDE the legacy `src/api/*` Supabase clients —
 * existing pages keep working; new code should prefer this layer.
 *
 * Base URL is read from `VITE_API_BASE_URL`. If that is not set, it falls
 * back to the Supabase Edge Functions origin so we still get a working
 * endpoint in development.
 */

import type { ApiErrorBody, ApiSuccess } from "@/types/api/common";

const VITE_API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

const SUPABASE_FALLBACK = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : "";

export const API_BASE_URL = VITE_API_BASE_URL || SUPABASE_FALLBACK;

const ACCESS_TOKEN_KEY = "nesa_access_token";
const REFRESH_TOKEN_KEY = "nesa_refresh_token";

/** Token storage helpers — swap for cookie storage if you move to SSR. */
export const tokenStore = {
  getAccess(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Array<{ field?: string; message: string }>;
  constructor(status: number, body: ApiErrorBody | { message?: string }) {
    const b = body as ApiErrorBody;
    super(b.message || "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.code = b.error?.code || `HTTP_${status}`;
    this.details = b.error?.details;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Skip Authorization header even if we have a token (for /auth/login etc.). */
  noAuth?: boolean;
};

function buildUrl(endpoint: string, query?: RequestOptions["query"]): string {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiSuccess<T>> {
  const { method = "GET", body, query, noAuth, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (!noAuth) {
    const token = tokenStore.getAccess();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(endpoint, query), {
      ...rest,
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e: any) {
    throw new ApiError(0, { success: false, message: e?.message || "Network error" });
  }

  let json: any = null;
  const text = await res.text();
  if (text) {
    try { json = JSON.parse(text); } catch { /* non-JSON */ }
  }

  if (!res.ok) {
    throw new ApiError(res.status, json ?? { success: false, message: res.statusText });
  }

  // Tolerate endpoints that return raw payloads (no envelope) — wrap them.
  if (json && typeof json === "object" && "success" in json) {
    return json as ApiSuccess<T>;
  }
  return { success: true, message: "OK", data: json as T };
}

/** Multipart upload (FormData). Same envelope contract. */
export async function uploadRequest<T>(
  endpoint: string,
  formData: FormData,
  opts: { noAuth?: boolean; query?: RequestOptions["query"] } = {}
): Promise<ApiSuccess<T>> {
  const headers: Record<string, string> = {};
  if (!opts.noAuth) {
    const token = tokenStore.getAccess();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(endpoint, opts.query), {
    method: "POST",
    headers,
    body: formData,
  });

  const text = await res.text();
  const json = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

  if (!res.ok) {
    throw new ApiError(res.status, json ?? { success: false, message: res.statusText });
  }
  if (json && "success" in json) return json as ApiSuccess<T>;
  return { success: true, message: "OK", data: json as T };
}

/** Convenience verbs. */
export const http = {
  get: <T>(p: string, query?: RequestOptions["query"]) => apiRequest<T>(p, { method: "GET", query }),
  post: <T>(p: string, body?: unknown) => apiRequest<T>(p, { method: "POST", body }),
  put: <T>(p: string, body?: unknown) => apiRequest<T>(p, { method: "PUT", body }),
  patch: <T>(p: string, body?: unknown) => apiRequest<T>(p, { method: "PATCH", body }),
  del: <T>(p: string) => apiRequest<T>(p, { method: "DELETE" }),
};
