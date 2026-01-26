/**
 * NESA-Africa API Client - HTTP Transport Layer
 * 
 * Base HTTP client for Edge Function calls with typed responses,
 * authentication, error handling, and request/response logging.
 */

import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get current auth token for authenticated requests
 */
async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

/**
 * Make HTTP request to Edge Function
 */
export async function request<T>(
  functionName: string,
  path: string = "",
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    requireAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, params, requireAuth = false } = options;

  // Build URL with query params
  const url = new URL(`${SUPABASE_URL}/functions/v1/${functionName}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };

  // Add auth token if required or available
  const token = await getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (requireAuth) {
    return {
      data: null,
      error: "Authentication required",
      status: 401,
    };
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data: data as T,
      error: null,
      status: response.status,
    };
  } catch (err: any) {
    console.error(`API request failed: ${functionName}${path}`, err);
    return {
      data: null,
      error: err.message || "Network request failed",
      status: 0,
    };
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: <T>(fn: string, path?: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(fn, path, { method: "GET", params }),

  post: <T>(fn: string, path?: string, body?: unknown) =>
    request<T>(fn, path, { method: "POST", body, requireAuth: true }),

  put: <T>(fn: string, path?: string, body?: unknown) =>
    request<T>(fn, path, { method: "PUT", body, requireAuth: true }),

  patch: <T>(fn: string, path?: string, body?: unknown) =>
    request<T>(fn, path, { method: "PATCH", body, requireAuth: true }),

  delete: <T>(fn: string, path?: string) =>
    request<T>(fn, path, { method: "DELETE", requireAuth: true }),
};

export default api;
