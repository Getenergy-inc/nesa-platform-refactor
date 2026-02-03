/**
 * Nominee Image Finder System Types
 * Used for automatic image suggestion and admin review
 */

export type NomineeKind = "person" | "organization";

export interface ImageCandidate {
  imageUrl: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  license?: string;
  confidence: number;
  source: "wikimedia" | "wikidata" | "wikipedia" | "clearbit" | "manual";
}

export interface NomineeImageSuggestion {
  nomineeSlug: string;
  nomineeName: string;
  kind: NomineeKind;
  kindOverride?: boolean;
  query: string;
  candidates: ImageCandidate[];
  searchedAt?: string;
  error?: string;
}

export interface NomineeImageOverride {
  nomineeSlug: string;
  kind: NomineeKind;
  imageUrl: string;
  thumbnailUrl?: string;
  sourceUrl?: string;
  license?: string;
  approved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export interface NomineeForImageSearch {
  nomineeSlug: string;
  nomineeName: string;
  awardTitle: string;
  awardSlug: string;
  subcategoryTitle: string;
  subcategorySlug: string;
  groupName?: string;
  groupSlug?: string;
  currentImageUrl?: string;
  country?: string;
}

// API Request/Response types
export interface ImageSearchRequest {
  nomineeName: string;
  kind: NomineeKind;
  additionalContext?: string;
}

export interface ImageSearchResponse {
  success: boolean;
  candidates: ImageCandidate[];
  query: string;
  error?: string;
}

export interface BulkImageSearchRequest {
  nominees: Array<{
    nomineeSlug: string;
    nomineeName: string;
    kind: NomineeKind;
  }>;
}

export interface BulkImageSearchResponse {
  results: Record<string, NomineeImageSuggestion>;
  totalSearched: number;
  successCount: number;
  errorCount: number;
}

// Admin UI state
export interface ImageReviewFilters {
  missingOnly: boolean;
  kind: "all" | "person" | "organization";
  awardSlug?: string;
  subcategorySlug?: string;
  groupSlug?: string;
  searchQuery?: string;
  status: "all" | "pending" | "approved" | "skipped";
}

export interface ImageReviewState {
  nominees: NomineeForImageSearch[];
  suggestions: Record<string, NomineeImageSuggestion>;
  overrides: Record<string, NomineeImageOverride>;
  filters: ImageReviewFilters;
  isLoading: boolean;
  isSearching: boolean;
  selectedNomineeSlug?: string;
}
