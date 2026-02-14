import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Region {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

interface UserChapterInfo {
  chapter_id: string | null;
  chapter_name: string | null;
  chapter_country: string | null;
  region_id: string | null;
  region_name: string | null;
  region_slug: string | null;
  membership_level: string;
}

interface RegionContextType {
  regions: Region[];
  activeRegion: Region | null;
  setActiveRegion: (region: Region | null) => void;
  userChapter: UserChapterInfo | null;
  isNigeriaMode: boolean;
  setNigeriaMode: (v: boolean) => void;
  showRegionPicker: boolean;
  setShowRegionPicker: (v: boolean) => void;
  loading: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeRegion, setActiveRegionState] = useState<Region | null>(null);
  const [isNigeriaMode, setNigeriaMode] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  // Fetch all regions
  const { data: regions = [], isLoading: regionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("regions")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      return (data || []) as Region[];
    },
    staleTime: 1000 * 60 * 30,
  });

  // Fetch user's chapter/region assignment
  const { data: userChapter, isLoading: chapterLoading } = useQuery({
    queryKey: ["user-region-chapter", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: profile } = await supabase
        .from("profiles")
        .select("region_id, chapter_id, membership_level, country")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return null;

      let chapterInfo: UserChapterInfo = {
        chapter_id: profile.chapter_id,
        chapter_name: null,
        chapter_country: null,
        region_id: profile.region_id,
        region_name: null,
        region_slug: null,
        membership_level: profile.membership_level || "basic",
      };

      // Get chapter details
      if (profile.chapter_id) {
        const { data: ch } = await supabase
          .from("chapters")
          .select("name, country, region")
          .eq("id", profile.chapter_id)
          .maybeSingle();
        if (ch) {
          chapterInfo.chapter_name = ch.name;
          chapterInfo.chapter_country = ch.country;
        }
      }

      // Get region details
      if (profile.region_id) {
        const { data: reg } = await supabase
          .from("regions")
          .select("name, slug")
          .eq("id", profile.region_id)
          .maybeSingle();
        if (reg) {
          chapterInfo.region_name = reg.name;
          chapterInfo.region_slug = reg.slug;
        }
      }

      return chapterInfo;
    },
    enabled: !!user?.id,
  });

  // Auto-set active region from user profile
  useEffect(() => {
    if (userChapter?.region_id && regions.length > 0 && !activeRegion) {
      const match = regions.find((r) => r.id === userChapter.region_id);
      if (match) setActiveRegionState(match);
    }
  }, [userChapter, regions, activeRegion]);

  // Restore saved region for visitors (no blocking modal on first visit)
  useEffect(() => {
    if (!user && !regionsLoading && regions.length > 0) {
      const stored = localStorage.getItem("nesa_selected_region");
      if (stored) {
        const match = regions.find((r) => r.slug === stored);
        if (match) setActiveRegionState(match);
      }
      // Don't auto-show picker — let user explore first, they can pick via nav switcher
    }
  }, [user, regionsLoading, regions]);

  const setActiveRegion = useCallback((region: Region | null) => {
    setActiveRegionState(region);
    if (region) {
      localStorage.setItem("nesa_selected_region", region.slug);
    } else {
      localStorage.removeItem("nesa_selected_region");
    }
    setNigeriaMode(false);
  }, []);

  return (
    <RegionContext.Provider
      value={{
        regions,
        activeRegion,
        setActiveRegion,
        userChapter,
        isNigeriaMode,
        setNigeriaMode,
        showRegionPicker,
        setShowRegionPicker,
        loading: regionsLoading || chapterLoading,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) throw new Error("useRegion must be used within RegionProvider");
  return context;
}
