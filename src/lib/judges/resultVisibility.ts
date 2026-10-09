/**
 * Africa Education Icon — Grand Jury result visibility contract.
 *
 * SINGLE SOURCE OF TRUTH for the status badge AND for whether results may be
 * revealed. Both values are derived here from the same group record so they can
 * never disagree: a "Voting Live" badge next to revealed standings is a bug, and
 * this module makes that combination unrepresentable.
 *
 * Governance rule: no provisional or partial standings are ever shown while a
 * vote is still open. Results render only once governance has locked them.
 */

export type GrandJuryPhase = "pending" | "open" | "closed" | "tallied" | "locked";
export type BadgeTone = "idle" | "live" | "sealed" | "locked";

export interface GrandJuryGroupRecord {
  voting_status?: string | null;
  voting_opens_at?: string | null;
  voting_closes_at?: string | null;
  ballots_locked_at?: string | null;
  results_locked_at?: string | null;
}

export interface ResultVisibility {
  phase: GrandJuryPhase;
  /** True ONLY when governance has locked the result. */
  canRevealResults: boolean;
  /** True while judges may still cast or revise a ballot. */
  canCastBallot: boolean;
  badgeLabel: string;
  badgeTone: BadgeTone;
  /** Shown in place of standings whenever results are withheld. */
  withheldReason: string | null;
}

export function getResultVisibility(
  group: GrandJuryGroupRecord | null | undefined,
  now: Date = new Date(),
): ResultVisibility {
  if (!group) {
    return {
      phase: "pending",
      canRevealResults: false,
      canCastBallot: false,
      badgeLabel: "Not Yet Convened",
      badgeTone: "idle",
      withheldReason: "This pathway has not been convened for Grand Jury voting.",
    };
  }

  const locked = Boolean(group.results_locked_at);
  if (locked) {
    return {
      phase: "locked",
      canRevealResults: true,
      canCastBallot: false,
      badgeLabel: "Verified & Approved",
      badgeTone: "locked",
      withheldReason: null,
    };
  }

  const ballotsLocked = Boolean(group.ballots_locked_at);
  const status = group.voting_status ?? "pending";
  const opensAt = group.voting_opens_at ? new Date(group.voting_opens_at) : null;
  const closesAt = group.voting_closes_at ? new Date(group.voting_closes_at) : null;
  const withinWindow =
    (!opensAt || now >= opensAt) && (!closesAt || now <= closesAt);

  if (status === "tallied" || ballotsLocked) {
    return {
      phase: "tallied",
      canRevealResults: false,
      canCastBallot: false,
      badgeLabel: "Awaiting Governance Validation",
      badgeTone: "sealed",
      withheldReason:
        "Voting has closed and the tally is sealed pending governance validation. Standings are not released until the result is locked.",
    };
  }

  if (status === "open" && withinWindow) {
    return {
      phase: "open",
      canRevealResults: false,
      canCastBallot: true,
      badgeLabel: "Voting Live",
      badgeTone: "live",
      withheldReason:
        "Voting is still open. No provisional standings are published while a ballot is live.",
    };
  }

  if (status === "open" || status === "closed" || status === "reopened") {
    return {
      phase: "closed",
      canRevealResults: false,
      canCastBallot: false,
      badgeLabel: "Voting Closed",
      badgeTone: "sealed",
      withheldReason:
        "The voting window for this pathway is closed. Results are released only after governance validation.",
    };
  }

  return {
    phase: "pending",
    canRevealResults: false,
    canCastBallot: false,
    badgeLabel: "Not Yet Open",
    badgeTone: "idle",
    withheldReason: "Grand Jury voting has not opened for this pathway.",
  };
}

/**
 * Ranked-choice scoring: 1st = 1pt, 2nd = 2pts, 3rd = 3pts. LOWEST total wins.
 * Mirrors public.compute_icon_grand_jury_results so the UI never re-implements
 * the rule with a different direction.
 */
export const RANK_POINTS: Record<1 | 2 | 3, number> = { 1: 1, 2: 2, 3: 3 };
export const UNRANKED_PENALTY = 4;
export const SCORING_RULE_LABEL = "1st = 1pt · 2nd = 2pts · 3rd = 3pts · lowest total wins";

export function sortByLowestTotal<T extends { points: number | null }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.points ?? Infinity) - (b.points ?? Infinity));
}
