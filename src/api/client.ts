import { authFetch } from "@/contexts/AuthContext";

/**
 * Standard API error shape returned by the backend
 * Adjust if your backend uses a different format
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Configuration for API requests
 */
interface ApiRequestOptions extends RequestInit {
  accessToken: string | null;
}

/**
 * Base API client
 * - Handles auth headers
 * - Parses JSON
 * - Normalizes errors
 */
export async function apiRequest<T>(
  url: string,
  { accessToken, headers, ...options }: ApiRequestOptions,
): Promise<T> {
  const res = await authFetch(
    url,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    },
    accessToken,
  );

  // Handle non-OK responses
  if (!res.ok) {
    let errorBody: ApiError = {
      message: "Something went wrong",
      statusCode: res.status,
    };

    try {
      const json = await res.json();
      errorBody = {
        ...errorBody,
        ...json,
      };
    } catch {
      // response was not JSON
      console.warn("response was not json");
    }

    throw errorBody;
  }

  // No content (204)
  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}
