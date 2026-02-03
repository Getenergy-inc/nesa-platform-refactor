/**
 * Hook for managing enriched nominee profiles
 * Handles storage, retrieval, and updates in localStorage
 */

import { useState, useEffect, useCallback } from "react";
import type { 
  EnrichedNomineeProfile, 
  NomineeProfilesStore, 
  PartialEnrichedProfile,
  NomineeProfileKind 
} from "@/types/nomineeProfile";
import { createEmptyProfile } from "@/types/nomineeProfile";

const PROFILES_STORAGE_KEY = "nesa_enriched_profiles";

// Get all stored profiles
function getStoredProfiles(): NomineeProfilesStore {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save all profiles
function saveProfiles(profiles: NomineeProfilesStore): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error("Failed to save profiles:", err);
  }
}

export function useEnrichedProfiles() {
  const [profiles, setProfiles] = useState<NomineeProfilesStore>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on mount
  useEffect(() => {
    setProfiles(getStoredProfiles());
    setIsLoading(false);
  }, []);

  // Get a single profile
  const getProfile = useCallback((nomineeSlug: string): EnrichedNomineeProfile | undefined => {
    return profiles[nomineeSlug];
  }, [profiles]);

  // Save a profile (create or update)
  const saveProfile = useCallback((profile: EnrichedNomineeProfile): void => {
    setProfiles(prev => {
      const updated = { 
        ...prev, 
        [profile.nomineeSlug]: {
          ...profile,
          lastGeneratedAt: new Date().toISOString(),
        }
      };
      saveProfiles(updated);
      return updated;
    });
  }, []);

  // Update partial profile data
  const updateProfile = useCallback((
    nomineeSlug: string, 
    updates: Partial<EnrichedNomineeProfile>
  ): void => {
    setProfiles(prev => {
      const existing = prev[nomineeSlug] || createEmptyProfile(nomineeSlug);
      const updated = {
        ...prev,
        [nomineeSlug]: {
          ...existing,
          ...updates,
          nomineeSlug, // Ensure slug is preserved
          lastGeneratedAt: new Date().toISOString(),
        }
      };
      saveProfiles(updated);
      return updated;
    });
  }, []);

  // Delete a profile
  const deleteProfile = useCallback((nomineeSlug: string): void => {
    setProfiles(prev => {
      const updated = { ...prev };
      delete updated[nomineeSlug];
      saveProfiles(updated);
      return updated;
    });
  }, []);

  // Create new profile from template
  const createProfile = useCallback((
    nomineeSlug: string, 
    kind: NomineeProfileKind = "person"
  ): EnrichedNomineeProfile => {
    const newProfile = createEmptyProfile(nomineeSlug, kind);
    saveProfile(newProfile);
    return newProfile;
  }, [saveProfile]);

  // Set profile status
  const setProfileStatus = useCallback((
    nomineeSlug: string, 
    status: EnrichedNomineeProfile["status"]
  ): void => {
    updateProfile(nomineeSlug, { status });
  }, [updateProfile]);

  // Export all profiles as JSON
  const exportProfiles = useCallback((): string => {
    return JSON.stringify(profiles, null, 2);
  }, [profiles]);

  // Import profiles from JSON
  const importProfiles = useCallback((json: string): number => {
    try {
      const imported = JSON.parse(json) as NomineeProfilesStore;
      const count = Object.keys(imported).length;
      setProfiles(prev => {
        const merged = { ...prev, ...imported };
        saveProfiles(merged);
        return merged;
      });
      return count;
    } catch (err) {
      console.error("Failed to import profiles:", err);
      throw new Error("Invalid JSON format");
    }
  }, []);

  // Get stats
  const stats = {
    total: Object.keys(profiles).length,
    approved: Object.values(profiles).filter(p => p.status === "approved").length,
    draft: Object.values(profiles).filter(p => p.status === "draft").length,
    pending: Object.values(profiles).filter(p => p.status === "pending_review").length,
  };

  return {
    profiles,
    isLoading,
    getProfile,
    saveProfile,
    updateProfile,
    deleteProfile,
    createProfile,
    setProfileStatus,
    exportProfiles,
    importProfiles,
    stats,
  };
}

/**
 * Get a single enriched profile (non-hook version for use in components)
 */
export function getEnrichedProfile(nomineeSlug: string): EnrichedNomineeProfile | undefined {
  const profiles = getStoredProfiles();
  return profiles[nomineeSlug];
}
