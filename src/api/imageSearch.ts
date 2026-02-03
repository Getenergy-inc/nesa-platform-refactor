/**
 * Image Search API Client
 * Frontend API for searching and managing nominee images
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  NomineeKind,
  ImageCandidate,
  NomineeImageSuggestion,
  NomineeImageOverride,
  ImageSearchResponse,
} from "@/types/nomineeImages";

/**
 * Search for images for a single nominee
 */
export async function searchNomineeImages(
  nomineeName: string,
  kind: NomineeKind,
  additionalContext?: string
): Promise<ImageSearchResponse> {
  const { data, error } = await supabase.functions.invoke("image-search", {
    body: {
      nomineeName,
      kind,
      additionalContext,
    },
  });

  if (error) {
    console.error("Image search error:", error);
    return {
      success: false,
      candidates: [],
      query: nomineeName,
      error: error.message,
    };
  }

  return data as ImageSearchResponse;
}

/**
 * Search for images for multiple nominees (batch)
 */
export async function searchNomineeImagesBatch(
  nominees: Array<{
    nomineeSlug: string;
    nomineeName: string;
    kind: NomineeKind;
  }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Record<string, NomineeImageSuggestion>> {
  const results: Record<string, NomineeImageSuggestion> = {};
  const total = nominees.length;
  let completed = 0;

  // Process in batches of 3 to avoid rate limits
  const batchSize = 3;
  
  for (let i = 0; i < nominees.length; i += batchSize) {
    const batch = nominees.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (nominee) => {
      try {
        const response = await searchNomineeImages(nominee.nomineeName, nominee.kind);
        
        results[nominee.nomineeSlug] = {
          nomineeSlug: nominee.nomineeSlug,
          nomineeName: nominee.nomineeName,
          kind: nominee.kind,
          query: response.query,
          candidates: response.candidates,
          searchedAt: new Date().toISOString(),
          error: response.error,
        };
      } catch (err) {
        results[nominee.nomineeSlug] = {
          nomineeSlug: nominee.nomineeSlug,
          nomineeName: nominee.nomineeName,
          kind: nominee.kind,
          query: nominee.nomineeName,
          candidates: [],
          searchedAt: new Date().toISOString(),
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
      
      completed++;
      onProgress?.(completed, total);
    });
    
    await Promise.all(batchPromises);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < nominees.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

// ============================================================================
// Local Storage for Suggestions & Overrides
// Using localStorage for now - can be migrated to Supabase later
// ============================================================================

const SUGGESTIONS_KEY = "nesa_nominee_image_suggestions";
const OVERRIDES_KEY = "nesa_nominee_image_overrides";

/**
 * Get all stored image suggestions
 */
export function getStoredSuggestions(): Record<string, NomineeImageSuggestion> {
  try {
    const stored = localStorage.getItem(SUGGESTIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save image suggestions to local storage
 */
export function storeSuggestions(
  suggestions: Record<string, NomineeImageSuggestion>
): void {
  try {
    const existing = getStoredSuggestions();
    const merged = { ...existing, ...suggestions };
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error("Failed to store suggestions:", err);
  }
}

/**
 * Get all stored image overrides
 */
export function getStoredOverrides(): Record<string, NomineeImageOverride> {
  try {
    const stored = localStorage.getItem(OVERRIDES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save a single override
 */
export function storeOverride(override: NomineeImageOverride): void {
  try {
    const existing = getStoredOverrides();
    existing[override.nomineeSlug] = override;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to store override:", err);
  }
}

/**
 * Remove an override
 */
export function removeOverride(nomineeSlug: string): void {
  try {
    const existing = getStoredOverrides();
    delete existing[nomineeSlug];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to remove override:", err);
  }
}

/**
 * Export overrides as JSON for version control
 */
export function exportOverridesAsJson(): string {
  const overrides = getStoredOverrides();
  return JSON.stringify(overrides, null, 2);
}

/**
 * Import overrides from JSON
 */
export function importOverridesFromJson(json: string): void {
  try {
    const overrides = JSON.parse(json);
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error("Failed to import overrides:", err);
    throw new Error("Invalid JSON format");
  }
}

/**
 * Get the resolved image URL for a nominee
 * Priority: override > first high-confidence suggestion > fallback
 */
export function getResolvedImageUrl(
  nomineeSlug: string,
  fallbackUrl = "/images/placeholder.svg"
): { 
  imageUrl: string; 
  source: "override" | "suggestion" | "fallback";
  license?: string;
} {
  // Check overrides first
  const overrides = getStoredOverrides();
  if (overrides[nomineeSlug]?.approved) {
    return {
      imageUrl: overrides[nomineeSlug].imageUrl,
      source: "override",
      license: overrides[nomineeSlug].license,
    };
  }

  // Check suggestions
  const suggestions = getStoredSuggestions();
  const suggestion = suggestions[nomineeSlug];
  if (suggestion?.candidates?.[0]?.confidence >= 0.7) {
    return {
      imageUrl: suggestion.candidates[0].imageUrl,
      source: "suggestion",
      license: suggestion.candidates[0].license,
    };
  }

  // Fallback
  return {
    imageUrl: fallbackUrl,
    source: "fallback",
  };
}

/**
 * Clear all stored data (for testing)
 */
export function clearStoredImageData(): void {
  localStorage.removeItem(SUGGESTIONS_KEY);
  localStorage.removeItem(OVERRIDES_KEY);
}
