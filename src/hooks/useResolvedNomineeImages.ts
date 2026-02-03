/**
 * Hook to get resolved image URLs for nominees
 * Merges overrides, suggestions, and current images
 */

import { useMemo } from "react";
import { getStoredOverrides, getStoredSuggestions } from "@/api/imageSearch";
import { classifyNominee } from "@/lib/nomineeClassifier";
import type { NomineeKind } from "@/types/nomineeImages";

interface ResolvedImage {
  imageUrl: string;
  kind: NomineeKind;
  source: "override" | "suggestion" | "current" | "fallback";
  license?: string;
}

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/**
 * Get the resolved image for a single nominee
 */
export function getResolvedNomineeImage(
  nomineeSlug: string,
  nomineeName: string,
  currentImageUrl?: string
): ResolvedImage {
  const overrides = getStoredOverrides();
  const suggestions = getStoredSuggestions();
  
  // 1. Check overrides first (highest priority)
  const override = overrides[nomineeSlug];
  if (override?.approved && override.imageUrl) {
    return {
      imageUrl: override.imageUrl,
      kind: override.kind,
      source: "override",
      license: override.license,
    };
  }
  
  // 2. Check if we have a current image from the data layer
  if (currentImageUrl && currentImageUrl !== PLACEHOLDER_IMAGE) {
    return {
      imageUrl: currentImageUrl,
      kind: override?.kind || classifyNominee(nomineeName),
      source: "current",
    };
  }
  
  // 3. Check high-confidence suggestions
  const suggestion = suggestions[nomineeSlug];
  if (suggestion?.candidates?.[0]?.confidence >= 0.7) {
    return {
      imageUrl: suggestion.candidates[0].imageUrl,
      kind: override?.kind || suggestion.kind || classifyNominee(nomineeName),
      source: "suggestion",
      license: suggestion.candidates[0].license,
    };
  }
  
  // 4. Fallback
  return {
    imageUrl: PLACEHOLDER_IMAGE,
    kind: override?.kind || classifyNominee(nomineeName),
    source: "fallback",
  };
}

/**
 * Hook to get resolved images for multiple nominees
 * Memoizes the lookup for performance
 */
export function useResolvedNomineeImages(
  nominees: Array<{ nomineeSlug: string; nomineeName: string; currentImageUrl?: string }>
): Record<string, ResolvedImage> {
  return useMemo(() => {
    const result: Record<string, ResolvedImage> = {};
    
    for (const nominee of nominees) {
      result[nominee.nomineeSlug] = getResolvedNomineeImage(
        nominee.nomineeSlug,
        nominee.nomineeName,
        nominee.currentImageUrl
      );
    }
    
    return result;
  }, [nominees]);
}

/**
 * Get CSS classes for image display based on kind
 */
export function getImageDisplayClasses(kind: NomineeKind): {
  containerClass: string;
  imageClass: string;
  altSuffix: string;
} {
  if (kind === "organization") {
    return {
      containerClass: "bg-white/90 p-2",
      imageClass: "object-contain max-h-full max-w-full",
      altSuffix: "logo",
    };
  }
  
  return {
    containerClass: "bg-primary/20",
    imageClass: "object-cover w-full h-full",
    altSuffix: "photo",
  };
}
