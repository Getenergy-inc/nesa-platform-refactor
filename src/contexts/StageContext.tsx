import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCurrentStage } from "@/lib/api";
import type { StageAction, StageStatus } from "@/config/season";

interface StageContextType {
  stages: StageStatus[];
  loading: boolean;
  isOpen: (action: StageAction) => boolean;
  getStage: (action: StageAction) => StageStatus | undefined;
  refresh: () => Promise<void>;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export function StageProvider({ children }: { children: ReactNode }) {
  const [stages, setStages] = useState<StageStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStages = async () => {
    try {
      const data = await fetchCurrentStage();
      setStages(data);
    } catch (error) {
      console.error("Failed to load stages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStages();
  }, []);

  const isOpen = (action: StageAction): boolean => {
    const stage = stages.find(s => s.action === action);
    return stage?.isOpen ?? false;
  };

  const getStage = (action: StageAction): StageStatus | undefined => {
    return stages.find(s => s.action === action);
  };

  return (
    <StageContext.Provider value={{ stages, loading, isOpen, getStage, refresh: loadStages }}>
      {children}
    </StageContext.Provider>
  );
}

export function useStage() {
  const context = useContext(StageContext);
  if (context === undefined) {
    throw new Error("useStage must be used within a StageProvider");
  }
  return context;
}
