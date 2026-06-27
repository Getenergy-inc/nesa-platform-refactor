/**
 * Lightweight analytics shim.
 *
 * Emits events to:
 *  1. `window.dataLayer` (GA4 / GTM compatible) when present
 *  2. A `CustomEvent("nesa:analytics")` on `window` so any in-app
 *     listener (debug overlay, downstream pipeline) can subscribe.
 *
 * No external dependency — safe to call in SSR/build (guards `window`).
 */

export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  const data = { event, ts: Date.now(), ...payload };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    window.dispatchEvent(new CustomEvent("nesa:analytics", { detail: data }));
  } catch {
    /* no-op */
  }
}

export function trackPageView(path: string, title?: string) {
  trackEvent("page_view", { page_path: path, page_title: title });
}

// ============================================================================
// Recognition architecture discovery events
// Emitted as users traverse Pathway → Category → Subcategory → Region → Nominee.
// ============================================================================

export interface DiscoveryContext {
  pathway?: string;
  category?: string;
  subcategory?: string;
  region?: string;
  country?: string;
  nominee?: string;
}

export function trackPathwayView(pathway: string, ctx: DiscoveryContext = {}) {
  trackEvent("pathway_view", { pathway, ...ctx });
}

export function trackCategoryView(category: string, ctx: DiscoveryContext = {}) {
  trackEvent("category_view", { category, ...ctx });
}

export function trackSubcategoryView(subcategory: string, ctx: DiscoveryContext = {}) {
  trackEvent("subcategory_view", { subcategory, ...ctx });
}

export function trackRegionView(region: string, ctx: DiscoveryContext = {}) {
  trackEvent("region_view", { region, ...ctx });
}

export function trackNomineeView(nominee: string, ctx: DiscoveryContext = {}) {
  trackEvent("nominee_view", { nominee, ...ctx });
}

export function trackDiscoveryStep(step: string, ctx: DiscoveryContext = {}) {
  trackEvent("discovery_step", { step, ...ctx });
}

