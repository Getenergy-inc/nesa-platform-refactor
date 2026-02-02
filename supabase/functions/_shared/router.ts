/**
 * Simple Router for Edge Functions
 * 
 * Provides a lightweight routing mechanism for organizing endpoint handlers.
 */

import { handleCorsPreflightRequest } from "./cors.ts";
import { err } from "./response.ts";

export type RouteHandler = (
  req: Request,
  params: RouteParams
) => Promise<Response> | Response;

export interface RouteParams {
  /** URL path segments after the function name */
  pathParts: string[];
  /** First path segment (e.g., "me", "queue", "products") */
  action: string;
  /** Second path segment (e.g., "init", "verify") */
  subAction: string;
  /** Third path segment (often a resource ID) */
  resourceId: string;
  /** URL search params */
  searchParams: URLSearchParams;
}

export interface Route {
  method: string;
  /** Pattern to match - use "*" for catch-all */
  pattern: string;
  handler: RouteHandler;
}

/**
 * Parse request URL into route params
 */
export function parseRouteParams(req: Request, basePath: string): RouteParams {
  const url = new URL(req.url);
  const pathParts = url.pathname
    .replace(basePath, "")
    .split("/")
    .filter(Boolean);

  return {
    pathParts,
    action: pathParts[0] || "",
    subAction: pathParts[1] || "",
    resourceId: pathParts[2] || "",
    searchParams: url.searchParams,
  };
}

/**
 * Create a request handler with routing
 * 
 * @example
 * const handler = createRouter("/wallet", [
 *   { method: "GET", pattern: "me", handler: getMyWallet },
 *   { method: "POST", pattern: "topup/init", handler: initTopup },
 *   { method: "*", pattern: "*", handler: () => err("Not found", 404) },
 * ]);
 * 
 * Deno.serve(handler);
 */
export function createRouter(basePath: string, routes: Route[]) {
  return async (req: Request): Promise<Response> => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return handleCorsPreflightRequest();
    }

    try {
      const params = parseRouteParams(req, basePath);
      const pattern = params.action 
        ? (params.subAction ? `${params.action}/${params.subAction}` : params.action)
        : "";

      // Find matching route
      for (const route of routes) {
        const methodMatch = route.method === "*" || route.method === req.method;
        const patternMatch = 
          route.pattern === "*" || 
          route.pattern === pattern ||
          (route.pattern.endsWith("/*") && pattern.startsWith(route.pattern.slice(0, -2)));

        if (methodMatch && patternMatch) {
          return await route.handler(req, params);
        }
      }

      return err("Not found", 404);
    } catch (error: unknown) {
      console.error(`${basePath} error:`, error);
      const message = error instanceof Error ? error.message : "Internal server error";
      const status = (error as { status?: number }).status || 500;
      return err(message, status);
    }
  };
}
