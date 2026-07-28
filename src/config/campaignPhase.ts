// Campaign phase configuration for NESA-Africa 2026.
// Single source of truth for the header's primary + secondary CTA labels
// and the announcement bar's active messaging. Flip `ACTIVE_PHASE` to switch.

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
    primary: { label: "Nominate Now", href: "/nominate", analyticsId: "nominate_now" },
    secondary: {
      label: "Explore Nominees",
      href: "/nominees",
      analyticsId: "explore_nominees",
    },
  },
  voting: {
    phase: "voting",
    primary: { label: "Vote & Earn AGC", href: "/awards/gold-blue-garnet", analyticsId: "vote_earn_agc" },
    secondary: {
      label: "Explore Categories",
      href: "/awards/categories",
      analyticsId: "explore_categories",
    },
  },
  gala: {
    phase: "gala",
    primary: { label: "Get Gala Tickets", href: "/tickets", analyticsId: "gala_tickets" },
    secondary: {
      label: "Explore Finalists",
      href: "/nominees",
      analyticsId: "explore_finalists",
    },
  },
};

// Flip this to switch the header + announcement bar campaign phase.
export const ACTIVE_PHASE: CampaignPhase = "nomination";

export const CURRENT_PHASE: PhaseConfig = PHASE_MAP[ACTIVE_PHASE];

// Nominate Now is the single strongest CTA regardless of phase; the phase
// controls the *secondary* action label.
export const NOMINATE_CTA = {
  label: "Nominate Now",
  href: "/nominate",
  analyticsId: "nominate_now",
} as const;
