import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { adminApi, EditionBase, EditionResponse } from "@/api/newadmin";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_SEASON_CONFIG,
  type SeasonConfig,
  type Edition,
  type StageAction,
  type StageStatus,
  type TransitionRules,
  type SeasonStageResponse,
  getEditionSafe,
  getEditionBannerText,
  STAGE_LABELS,
} from "@/config/season";

// Convert API Edition to our internal Edition format
const mapApiEditionToEdition = (apiEdition: EditionResponse): Edition => {
  // Extract year from displayYear (which is a string like "2025")
  const year = parseInt(apiEdition.displayYear);

  return {
    key: apiEdition.key,
    name: apiEdition.name,
    displayYear: year,
    ceremonyYear: parseInt(apiEdition.ceremonyYear) || year + 1,
    tagline: apiEdition.tagline,
    theme: apiEdition.theme,
    nominationsOpen: new Date(apiEdition.nominationsOpen)
      .toISOString()
      .split("T")[0],
    nominationsClose: new Date(apiEdition.nominationsClose)
      .toISOString()
      .split("T")[0],
    votingOpen: new Date(apiEdition.votingOpen).toISOString().split("T")[0],
    votingClose: new Date(apiEdition.votingClose).toISOString().split("T")[0],
    ceremonyDate: new Date(apiEdition.ceremonyDate).toISOString().split("T")[0],
    isActive: apiEdition.isActive,
  };
};

// Generate stages from edition dates
const generateStagesFromEdition = (edition: Edition): StageStatus[] => {
  const now = new Date();

  return [
    {
      action: "nominations",
      isOpen:
        now >= new Date(edition.nominationsOpen) &&
        now <= new Date(edition.nominationsClose),
      opensAt: edition.nominationsOpen,
      closesAt: edition.nominationsClose,
    },
    {
      action: "public_voting",
      isOpen:
        now >= new Date(edition.votingOpen) &&
        now <= new Date(edition.votingClose),
      opensAt: edition.votingOpen,
      closesAt: edition.votingClose,
    },
    {
      action: "jury_scoring",
      isOpen:
        now > new Date(edition.votingClose) &&
        now <= new Date(edition.ceremonyDate),
      opensAt: edition.votingClose,
      closesAt: edition.ceremonyDate,
    },
    {
      action: "results",
      isOpen: now >= new Date(edition.ceremonyDate),
      opensAt: edition.ceremonyDate,
      closesAt: null,
    },
    {
      action: "certificates",
      isOpen: now >= new Date(edition.ceremonyDate),
      opensAt: edition.ceremonyDate,
      closesAt: null,
    },
  ];
};

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
  getAllEditions: () => Edition[];
  // Refresh
  refresh: () => Promise<void>;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [config, setConfig] = useState<SeasonConfig>(DEFAULT_SEASON_CONFIG);
  const [stages, setStages] = useState<StageStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeasonData = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      // Fetch all editions from API
      const editions = await adminApi.fetchEditions(accessToken);

      // Find active edition
      const activeEdition = editions.find((e) => e.isActive);

      if (!activeEdition) {
        throw new Error("No active edition found");
      }

      // Convert API editions to internal format
      const editionsMap: Record<string, Edition> = {};
      editions.forEach((ed) => {
        const mapped = mapApiEditionToEdition(ed);
        editionsMap[ed.key] = mapped;
      });

      const currentEdition = mapApiEditionToEdition(activeEdition);

      // Generate stages from active edition
      const generatedStages = generateStagesFromEdition(currentEdition);

      // Build config
      const newConfig: SeasonConfig = {
        currentEditionKey: activeEdition.key,
        editions: editionsMap,
        transitionRules: {
          showNextEditionPreview: false,
          votingLockoutDays: 14,
          certificateAvailableDays: 30,
          allowArchiveAccess: true,
        },
      };

      setConfig(newConfig);
      setStages(generatedStages);
    } catch (err: any) {
      console.error("Failed to load season data:", err);
      setError(err.message || "Failed to load season configuration");
      // Keep using defaults on error
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadSeasonData();
  }, [loadSeasonData]);

  const currentEdition = getEditionSafe(config);

  const isStageOpen = useCallback(
    (action: StageAction): boolean => {
      const stage = stages.find((s) => s.action === action);
      return stage?.isOpen ?? false;
    },
    [stages],
  );

  const getStage = useCallback(
    (action: StageAction): StageStatus | undefined => {
      return stages.find((s) => s.action === action);
    },
    [stages],
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
    [config],
  );

  const getAllEditions = useCallback((): Edition[] => {
    return Object.values(config.editions);
  }, [config]);

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
        getAllEditions,
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

// Optional: Hook to get server-synced stage status if your API provides it
export function useServerStages() {
  const { accessToken } = useAuth();
  const [serverStages, setServerStages] = useState<SeasonStageResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const fetchServerStages = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      // You would need to add this endpoint to your adminApi
      // const response = await adminApi.fetchStageStatus(accessToken);
      // setServerStages(response);
    } catch (error) {
      console.error("Failed to fetch server stages:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  return {
    serverStages,
    loading,
    refresh: fetchServerStages,
  };
}
