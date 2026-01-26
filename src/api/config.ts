/**
 * NESA-Africa API Client - Configuration Endpoints
 * 
 * Endpoints for system health, season, and stage configuration.
 */

import api from "./http";

// ==========================================
// TYPES
// ==========================================

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  version: string;
  services: {
    database: boolean;
    auth: boolean;
    storage: boolean;
  };
  uptime: number;
}

export interface SeasonInfo {
  key: string;
  name: string;
  displayYear: number;
  ceremonyYear: number;
  tagline?: string;
  theme?: string;
  isActive: boolean;
}

export interface SeasonResponse {
  current: SeasonInfo;
  next: SeasonInfo | null;
  serverTime: string;
}

export interface StageInfo {
  action: string;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export interface StageResponse {
  currentEditionKey: string;
  edition: {
    key: string;
    name: string;
    displayYear: number;
    ceremonyYear: number;
    isActive: boolean;
  };
  stages: StageInfo[];
  transitionRules: {
    showNextEditionPreview: boolean;
    votingLockoutDays: number;
    certificateAvailableDays: number;
    allowArchiveAccess: boolean;
  };
  serverTime: string;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Get system health status
 */
export async function getHealth() {
  return api.get<HealthStatus>("health");
}

/**
 * Get current and next season info
 */
export async function getSeason() {
  return api.get<SeasonResponse>("season");
}

/**
 * Get current stage configuration
 */
export async function getStage() {
  return api.get<StageResponse>("stage");
}

/**
 * Check if a specific stage is open
 */
export async function isStageOpen(action: string): Promise<boolean> {
  const response = await getStage();
  if (!response.data) return false;
  const stage = response.data.stages.find((s) => s.action === action);
  return stage?.isOpen ?? false;
}

// Admin endpoints
export const configAdmin = {
  /**
   * Switch active season (admin only)
   */
  async switchSeason(seasonYear: number) {
    return api.post<{ success: boolean; season: any }>("stage", "/switch", { seasonYear });
  },

  /**
   * Update stage flags (admin only)
   */
  async updateStage(payload: {
    action: string;
    isOpen?: boolean;
    opensAt?: string | null;
    closesAt?: string | null;
  }) {
    return api.post<{ success: boolean; stage: StageInfo }>("stage", "/update", payload);
  },

  /**
   * Get all seasons (admin only)
   */
  async getAllSeasons() {
    return api.get<{ seasons: any[] }>("stage", "/all");
  },
};

export default {
  getHealth,
  getSeason,
  getStage,
  isStageOpen,
  admin: configAdmin,
};
