import { describe, expect, it } from "vitest";
import { createProgrammeIcs } from "@/lib/programmeCalendar";

 describe("online programme calendar", () => {
  it("creates a two-hour online event at 18:00 WAT on Monday 28 December 2026", () => {
    const ics = createProgrammeIcs(new Date("2026-11-20T00:00:00.000Z"));
    expect(ics).toContain("DTSTART:20261228T170000Z");
    expect(ics).toContain("DTEND:20261228T190000Z");
    expect(ics).toContain("SUMMARY:NESA-Africa 2026 Online Recognition Programme");
    expect(ics).toContain("LOCATION:Online only");
    expect(ics).toContain("DESCRIPTION:Online Recognition Programme · Monday 28 December 2026 · Online only");
  });
});
