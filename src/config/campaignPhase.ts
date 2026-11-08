// Campaign actions for the public header. No voting or ticket phase is public in 2026.
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

export type CampaignPhase = "nomination" | "voting" | "gala";

export interface CampaignCTA {
  label: string;
  href: string;
  analyticsId: string;
}

export interface PhaseConfig {
  phase: CampaignPhase;
  primary: CampaignCTA;
  secondary: CampaignCTA;
}

export const PHASE_MAP: Record<CampaignPhase, PhaseConfig> = {
  nomination: {
    phase: "nomination",
    primary: { label: PUBLIC_ACTIONS_2026.nominate.label, href: PUBLIC_ACTIONS_2026.nominate.href, analyticsId: "nominate_now" },
    secondary: { label: PUBLIC_ACTIONS_2026.supportEducation.label, href: PUBLIC_ACTIONS_2026.supportEducation.href, analyticsId: "support_education" },
  },
  voting: {
    phase: "voting",
    primary: { label: "Research & Judging", href: "/governance#judging", analyticsId: "research_judging" },
    secondary: { label: PUBLIC_ACTIONS_2026.exploreAwards.label, href: PUBLIC_ACTIONS_2026.exploreAwards.href, analyticsId: "explore_awards" },
  },
  gala: {
    phase: "gala",
    primary: { label: PUBLIC_ACTIONS_2026.onlineGala.label, href: PUBLIC_ACTIONS_2026.onlineGala.href, analyticsId: "online_gala" },
    secondary: { label: PUBLIC_ACTIONS_2026.exploreAwards.label, href: PUBLIC_ACTIONS_2026.exploreAwards.href, analyticsId: "explore_awards" },
  },
};

export const ACTIVE_PHASE: CampaignPhase = "nomination";
export const CURRENT_PHASE: PhaseConfig = PHASE_MAP[ACTIVE_PHASE];

export const NOMINATE_CTA = {
  label: PUBLIC_ACTIONS_2026.nominate.label,
  href: PUBLIC_ACTIONS_2026.nominate.href,
  analyticsId: "nominate_now",
} as const;
