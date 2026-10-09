import { describe, it, expect } from "vitest";
import {
  getResultVisibility,
  sortByLowestTotal,
  RANK_POINTS,
  type GrandJuryGroupRecord,
} from "@/lib/judges/resultVisibility";

const NOW = new Date("2026-10-03T12:00:00Z");

const openGroup: GrandJuryGroupRecord = {
  voting_status: "open",
  voting_opens_at: "2026-10-01T00:00:00Z",
  voting_closes_at: "2026-10-07T23:59:59Z",
};

describe("Grand Jury result visibility invariant", () => {
  it("never reveals results while the badge says Voting Live", () => {
    const v = getResultVisibility(openGroup, NOW);
    expect(v.badgeLabel).toBe("Voting Live");
    expect(v.canRevealResults).toBe(false);
    expect(v.withheldReason).toBeTruthy();
  });

  it("reveals results ONLY when the badge reads Verified & Approved", () => {
    const v = getResultVisibility(
      { ...openGroup, voting_status: "locked", ballots_locked_at: NOW.toISOString(), results_locked_at: NOW.toISOString() },
      NOW,
    );
    expect(v.badgeLabel).toBe("Verified & Approved");
    expect(v.badgeTone).toBe("locked");
    expect(v.canRevealResults).toBe(true);
    expect(v.withheldReason).toBeNull();
  });

  it("holds results back after voting closes until governance locks them", () => {
    const v = getResultVisibility(
      { ...openGroup, voting_status: "tallied", ballots_locked_at: NOW.toISOString() },
      NOW,
    );
    expect(v.canRevealResults).toBe(false);
    expect(v.canCastBallot).toBe(false);
    expect(v.badgeLabel).toBe("Awaiting Governance Validation");
  });

  it("blocks ballots outside the voting window", () => {
    expect(getResultVisibility(openGroup, new Date("2026-09-20T00:00:00Z")).canCastBallot).toBe(false);
    expect(getResultVisibility(openGroup, new Date("2026-11-01T00:00:00Z")).canCastBallot).toBe(false);
  });

  it("treats an unknown / missing group as sealed", () => {
    expect(getResultVisibility(null).canRevealResults).toBe(false);
    expect(getResultVisibility({ voting_status: "pending" }).canRevealResults).toBe(false);
  });

  /**
   * The core invariant, exhaustively: across every representable group state,
   * results are revealed if and only if the badge tone is "locked".
   */
  it("badge tone and result completeness always agree", () => {
    const statuses = ["pending", "open", "closed", "tallied", "reopened", "locked"];
    const flags = [null, NOW.toISOString()];
    for (const voting_status of statuses) {
      for (const ballots_locked_at of flags) {
        for (const results_locked_at of flags) {
          for (const when of [new Date("2026-09-01T00:00:00Z"), NOW, new Date("2026-12-01T00:00:00Z")]) {
            const v = getResultVisibility(
              { ...openGroup, voting_status, ballots_locked_at, results_locked_at },
              when,
            );
            expect(v.canRevealResults).toBe(v.badgeTone === "locked");
            // A live badge must never coexist with revealed standings.
            if (v.badgeTone === "live") expect(v.canRevealResults).toBe(false);
            // Withheld results must always explain themselves.
            expect(v.canRevealResults ? v.withheldReason === null : typeof v.withheldReason === "string").toBe(true);
          }
        }
      }
    }
  });
});

describe("ranked-choice scoring direction", () => {
  it("scores 1st=1, 2nd=2, 3rd=3", () => {
    expect(RANK_POINTS[1]).toBe(1);
    expect(RANK_POINTS[2]).toBe(2);
    expect(RANK_POINTS[3]).toBe(3);
  });

  it("ranks the LOWEST total first", () => {
    const sorted = sortByLowestTotal([
      { points: 54, name: "c" },
      { points: 31, name: "a" },
      { points: 47, name: "b" },
    ]);
    expect(sorted.map((r) => r.name)).toEqual(["a", "b", "c"]);
  });
});
