/**
 * Hook for managing nominee image suggestions and overrides
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllNominees, type EnrichedNominee } from "@/lib/nesaData";
import { classifyNominee } from "@/lib/nomineeClassifier";
import {
  searchNomineeImages,
  searchNomineeImagesBatch,
  getStoredSuggestions,
  storeSuggestions,
  getStoredOverrides,
  storeOverride,
  removeOverride,
  exportOverridesAsJson,
  importOverridesFromJson,
} from "@/api/imageSearch";
import type {
  NomineeKind,
  NomineeImageSuggestion,
  NomineeImageOverride,
  NomineeForImageSearch,
  ImageReviewFilters,
  ImageCandidate,
} from "@/types/nomineeImages";

interface UseNomineeImagesReturn {
  // Data
  nominees: NomineeForImageSearch[];
  suggestions: Record<string, NomineeImageSuggestion>;
  overrides: Record<string, NomineeImageOverride>;
  
  // Filtered data
  filteredNominees: NomineeForImageSearch[];
  
  // Filters
  filters: ImageReviewFilters;
  setFilters: (filters: Partial<ImageReviewFilters>) => void;
  
  // Stats
  stats: {
    total: number;
    withImages: number;
    missingImages: number;
    approved: number;
    pending: number;
    persons: number;
    organizations: number;
  };
  
  // Awards/Subcategories for filters
  availableAwards: Array<{ slug: string; title: string }>;
  availableSubcategories: Array<{ slug: string; title: string }>;
  
  // Actions
  searchSingle: (nomineeSlug: string) => Promise<void>;
  searchBatch: (nomineeSlug: string[]) => Promise<void>;
  searchMissingImages: () => Promise<void>;
  
  approveImage: (nomineeSlug: string, candidate: ImageCandidate, kind: NomineeKind) => void;
  setManualImage: (nomineeSlug: string, imageUrl: string, kind: NomineeKind, notes?: string) => void;
  toggleKindOverride: (nomineeSlug: string) => void;
  removeApproval: (nomineeSlug: string) => void;
  
  exportOverrides: () => string;
  importOverrides: (json: string) => void;
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  searchProgress: { completed: number; total: number } | null;
}

export function useNomineeImages(): UseNomineeImagesReturn {
  const [nominees, setNominees] = useState<NomineeForImageSearch[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, NomineeImageSuggestion>>({});
  const [overrides, setOverrides] = useState<Record<string, NomineeImageOverride>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState<{ completed: number; total: number } | null>(null);
  
  const [filters, setFiltersState] = useState<ImageReviewFilters>({
    missingOnly: true,
    kind: "all",
    status: "all",
    searchQuery: "",
  });
  
  // Load nominees from data layer
  useEffect(() => {
    try {
      const enrichedNominees = getAllNominees();
      
      const nomineeList: NomineeForImageSearch[] = enrichedNominees.map(nominee => ({
        nomineeSlug: nominee.slug,
        nomineeName: nominee.name,
        awardTitle: nominee.awardTitle,
        awardSlug: nominee.awardSlug,
        subcategoryTitle: nominee.subcategoryTitle,
        subcategorySlug: nominee.subcategorySlug,
        groupName: nominee.regionName,
        groupSlug: nominee.regionSlug,
        currentImageUrl: nominee.imageUrl !== "/images/placeholder.svg" ? nominee.imageUrl : undefined,
        country: nominee.country,
      }));
      
      setNominees(nomineeList);
      
      // Load stored data
      setSuggestions(getStoredSuggestions());
      setOverrides(getStoredOverrides());
    } catch (err) {
      console.error("Failed to load nominees:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get unique awards and subcategories for filters
  const availableAwards = useMemo(() => {
    const seen = new Set<string>();
    return nominees
      .filter(n => {
        if (seen.has(n.awardSlug)) return false;
        seen.add(n.awardSlug);
        return true;
      })
      .map(n => ({ slug: n.awardSlug, title: n.awardTitle }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [nominees]);
  
  const availableSubcategories = useMemo(() => {
    const seen = new Set<string>();
    let filtered = nominees;
    
    // Filter by award if selected
    if (filters.awardSlug) {
      filtered = filtered.filter(n => n.awardSlug === filters.awardSlug);
    }
    
    return filtered
      .filter(n => {
        if (seen.has(n.subcategorySlug)) return false;
        seen.add(n.subcategorySlug);
        return true;
      })
      .map(n => ({ slug: n.subcategorySlug, title: n.subcategoryTitle }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [nominees, filters.awardSlug]);
  
  // Apply filters
  const filteredNominees = useMemo(() => {
    let result = [...nominees];
    
    // Missing images filter
    if (filters.missingOnly) {
      result = result.filter(n => {
        const hasOverride = overrides[n.nomineeSlug]?.approved;
        const hasSuggestion = (suggestions[n.nomineeSlug]?.candidates?.length ?? 0) > 0;
        const hasCurrentImage = !!n.currentImageUrl;
        return !hasOverride && !hasCurrentImage;
      });
    }
    
    // Kind filter
    if (filters.kind !== "all") {
      result = result.filter(n => {
        const override = overrides[n.nomineeSlug];
        const kind = override?.kind || classifyNominee(n.nomineeName);
        return kind === filters.kind;
      });
    }
    
    // Status filter
    if (filters.status !== "all") {
      result = result.filter(n => {
        const override = overrides[n.nomineeSlug];
        if (filters.status === "approved") return override?.approved === true;
        if (filters.status === "pending") return !override?.approved;
        return true;
      });
    }
    
    // Award filter
    if (filters.awardSlug) {
      result = result.filter(n => n.awardSlug === filters.awardSlug);
    }
    
    // Subcategory filter
    if (filters.subcategorySlug) {
      result = result.filter(n => n.subcategorySlug === filters.subcategorySlug);
    }
    
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(n => 
        n.nomineeName.toLowerCase().includes(query) ||
        n.awardTitle.toLowerCase().includes(query) ||
        n.subcategoryTitle.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [nominees, suggestions, overrides, filters]);
  
  // Calculate stats
  const stats = useMemo(() => {
    let withImages = 0;
    let approved = 0;
    let persons = 0;
    let organizations = 0;
    
    nominees.forEach(n => {
      const override = overrides[n.nomineeSlug];
      const kind = override?.kind || classifyNominee(n.nomineeName);
      
      if (kind === "person") persons++;
      else organizations++;
      
      if (override?.approved) {
        approved++;
        withImages++;
      } else if (n.currentImageUrl) {
        withImages++;
      }
    });
    
    return {
      total: nominees.length,
      withImages,
      missingImages: nominees.length - withImages,
      approved,
      pending: nominees.length - approved,
      persons,
      organizations,
    };
  }, [nominees, overrides]);
  
  // Set filters
  const setFilters = useCallback((newFilters: Partial<ImageReviewFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  // Search for a single nominee
  const searchSingle = useCallback(async (nomineeSlug: string) => {
    const nominee = nominees.find(n => n.nomineeSlug === nomineeSlug);
    if (!nominee) return;
    
    setIsSearching(true);
    try {
      const kind = overrides[nomineeSlug]?.kind || classifyNominee(nominee.nomineeName);
      const response = await searchNomineeImages(nominee.nomineeName, kind);
      
      const suggestion: NomineeImageSuggestion = {
        nomineeSlug,
        nomineeName: nominee.nomineeName,
        kind,
        query: response.query,
        candidates: response.candidates,
        searchedAt: new Date().toISOString(),
        error: response.error,
      };
      
      setSuggestions(prev => {
        const updated = { ...prev, [nomineeSlug]: suggestion };
        storeSuggestions({ [nomineeSlug]: suggestion });
        return updated;
      });
    } finally {
      setIsSearching(false);
    }
  }, [nominees, overrides]);
  
  // Search for multiple nominees
  const searchBatch = useCallback(async (nomineeSlugs: string[]) => {
    const toSearch = nominees
      .filter(n => nomineeSlugs.includes(n.nomineeSlug))
      .map(n => ({
        nomineeSlug: n.nomineeSlug,
        nomineeName: n.nomineeName,
        kind: overrides[n.nomineeSlug]?.kind || classifyNominee(n.nomineeName),
      }));
    
    if (toSearch.length === 0) return;
    
    setIsSearching(true);
    setSearchProgress({ completed: 0, total: toSearch.length });
    
    try {
      const results = await searchNomineeImagesBatch(toSearch, (completed, total) => {
        setSearchProgress({ completed, total });
      });
      
      setSuggestions(prev => {
        const updated = { ...prev, ...results };
        storeSuggestions(results);
        return updated;
      });
    } finally {
      setIsSearching(false);
      setSearchProgress(null);
    }
  }, [nominees, overrides]);
  
  // Search all nominees missing images
  const searchMissingImages = useCallback(async () => {
    const missing = nominees.filter(n => {
      const hasOverride = overrides[n.nomineeSlug]?.approved;
      const hasSuggestion = (suggestions[n.nomineeSlug]?.candidates?.length ?? 0) > 0;
      const hasCurrentImage = !!n.currentImageUrl;
      return !hasOverride && !hasSuggestion && !hasCurrentImage;
    });
    
    await searchBatch(missing.map(n => n.nomineeSlug));
  }, [nominees, overrides, suggestions, searchBatch]);
  
  // Approve an image candidate
  const approveImage = useCallback((
    nomineeSlug: string, 
    candidate: ImageCandidate,
    kind: NomineeKind
  ) => {
    const override: NomineeImageOverride = {
      nomineeSlug,
      kind,
      imageUrl: candidate.imageUrl,
      thumbnailUrl: candidate.thumbnailUrl,
      sourceUrl: candidate.sourceUrl,
      license: candidate.license,
      approved: true,
      approvedAt: new Date().toISOString(),
    };
    
    setOverrides(prev => {
      const updated = { ...prev, [nomineeSlug]: override };
      storeOverride(override);
      return updated;
    });
  }, []);
  
  // Set a manual image URL
  const setManualImage = useCallback((
    nomineeSlug: string,
    imageUrl: string,
    kind: NomineeKind,
    notes?: string
  ) => {
    const override: NomineeImageOverride = {
      nomineeSlug,
      kind,
      imageUrl,
      sourceUrl: "manual",
      approved: true,
      approvedAt: new Date().toISOString(),
      notes,
    };
    
    setOverrides(prev => {
      const updated = { ...prev, [nomineeSlug]: override };
      storeOverride(override);
      return updated;
    });
  }, []);
  
  // Toggle kind override
  const toggleKindOverride = useCallback((nomineeSlug: string) => {
    const nominee = nominees.find(n => n.nomineeSlug === nomineeSlug);
    if (!nominee) return;
    
    const currentOverride = overrides[nomineeSlug];
    const currentKind = currentOverride?.kind || classifyNominee(nominee.nomineeName);
    const newKind: NomineeKind = currentKind === "person" ? "organization" : "person";
    
    const override: NomineeImageOverride = {
      ...currentOverride,
      nomineeSlug,
      kind: newKind,
      imageUrl: currentOverride?.imageUrl || "",
      approved: currentOverride?.approved ?? false,
    };
    
    setOverrides(prev => {
      const updated = { ...prev, [nomineeSlug]: override };
      storeOverride(override);
      return updated;
    });
  }, [nominees, overrides]);
  
  // Remove approval
  const removeApproval = useCallback((nomineeSlug: string) => {
    setOverrides(prev => {
      const updated = { ...prev };
      delete updated[nomineeSlug];
      removeOverride(nomineeSlug);
      return updated;
    });
  }, []);
  
  // Export/Import
  const exportOverrides = useCallback(() => {
    return exportOverridesAsJson();
  }, []);
  
  const importOverrides = useCallback((json: string) => {
    importOverridesFromJson(json);
    setOverrides(getStoredOverrides());
  }, []);
  
  return {
    nominees,
    suggestions,
    overrides,
    filteredNominees,
    filters,
    setFilters,
    stats,
    availableAwards,
    availableSubcategories,
    searchSingle,
    searchBatch,
    searchMissingImages,
    approveImage,
    setManualImage,
    toggleKindOverride,
    removeApproval,
    exportOverrides,
    importOverrides,
    isLoading,
    isSearching,
    searchProgress,
  };
}
