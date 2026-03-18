import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_SEASON_CONFIG,
  type SeasonConfig,
  type Edition,
  type StageAction,
  type StageStatus,
  type TransitionRules,
  getEditionSafe,
  getEditionBannerText,
} from "@/config/season";

interface SeasonContextType {
  config: SeasonConfig;
  currentEdition: Edition;
  stages: StageStatus[];
  loading: boolean;
  error: string | null;
  // Stage helpers
  isStageOpen: (action: StageAction) => boolean;
  getStage: (action: StageAction) => StageStatus | undefined;
  getOpenStage: () => StageAction | null;
  // Edition helpers
  getBannerText: () => string;
  getEdition: (key?: string) => Edition;
  // Refresh
  refresh: () => Promise<void>;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SeasonConfig>(DEFAULT_SEASON_CONFIG);
  const [stages, setStages] = useState<StageStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeasonData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch current active season from database
      const { data: seasonData, error: seasonError } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (seasonError) throw seasonError;

      // Fetch stage configuration
      const { data: stageData, error: stageError } = await supabase
        .from("stage_config")
        .select(`
          action,
          is_open,
          opens_at,
          closes_at,
          seasons!inner(is_active)
        `)
        .eq("seasons.is_active", true);

      if (stageError) throw stageError;

      // Build stages array
      const stagesArray: StageStatus[] = (stageData || []).map((s) => ({
        action: s.action as StageAction,
        isOpen: s.is_open,
        opensAt: s.opens_at,
        closesAt: s.closes_at,
      }));

      setStages(stagesArray);

      // Update config with database values if available
      if (seasonData) {
        const editionKey = seasonData.year.toString();
        
        setConfig((prev) => ({
          ...prev,
          currentEditionKey: editionKey,
          editions: {
            ...prev.editions,
            [editionKey]: {
              ...prev.editions[editionKey],
              key: editionKey,
              name: seasonData.name,
              displayYear: seasonData.year,
              ceremonyYear: seasonData.year + 1,
              isActive: seasonData.is_active,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error("Failed to load season data:", err);
      setError(err.message || "Failed to load season configuration");
      // Keep using defaults on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeasonData();
  }, [loadSeasonData]);

  const currentEdition = getEditionSafe(config);

  const isStageOpen = useCallback(
    (action: StageAction): boolean => {
      const stage = stages.find((s) => s.action === action);
      return stage?.isOpen ?? false;
    },
    [stages]
  );

  const getStage = useCallback(
    (action: StageAction): StageStatus | undefined => {
      return stages.find((s) => s.action === action);
    },
    [stages]
  );

  const getOpenStage = useCallback((): StageAction | null => {
    const openStage = stages.find((s) => s.isOpen);
    return openStage?.action ?? null;
  }, [stages]);

  const getBannerText = useCallback((): string => {
    const openStage = getOpenStage();
    return getEditionBannerText(currentEdition, openStage);
  }, [currentEdition, getOpenStage]);

  const getEdition = useCallback(
    (key?: string): Edition => {
      return getEditionSafe(config, key);
    },
    [config]
  );

  return (
    <SeasonContext.Provider
      value={{
        config,
        currentEdition,
        stages,
        loading,
        error,
        isStageOpen,
        getStage,
        getOpenStage,
        getBannerText,
        getEdition,
        refresh: loadSeasonData,
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
}

// Hook for stage-specific logic
export function useStageGate(action: StageAction) {
  const { isStageOpen, getStage, loading } = useSeason();
  const stage = getStage(action);

  return {
    isOpen: isStageOpen(action),
    stage,
    loading,
    opensAt: stage?.opensAt ? new Date(stage.opensAt) : null,
    closesAt: stage?.closesAt ? new Date(stage.closesAt) : null,
  };
}
