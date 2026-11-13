import { describe, expect, it } from "vitest";
import { PROGRAMME_END_DATE, PROGRAMME_END_LABEL, PROGRAMME_END_LONG_LABEL } from "@/config/programme";
import { ANNOUNCEMENTS } from "@/config/announcements";
import { MASTER_TIMELINE_2026 } from "@/data/masterTimeline2026";
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";

describe("rescheduled Online Recognition Programme", () => {
  it("takes place on Monday 28 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LABEL).toBe("28 December 2026");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Monday, 28 December 2026 · Online");
  });
  it("links the announcement to the online programme with the new date", () => {
    const announcement = ANNOUNCEMENTS.find((item) => item.id === "nominations-and-online-gala");
    expect(announcement?.text).toContain("Online Recognition Programme: 13 December 2026. Learn More");
    expect(announcement?.href).toBe("/programme-2026");
  });
  it("moves the gala and its live coverage together", () => {
    for (const id of ["recognition-gala", "tv-show-3"]) {
      const milestone = MASTER_TIMELINE_2026.find((item) => item.id === id);
      expect(milestone?.startsAt).toBe("2026-12-28T00:00:00Z");
      expect(milestone?.dateLabel).toBe("Monday, 28 December 2026");
    }
  });
  it("does not reschedule nomination or independent verification deadlines", () => {
    expect(NOMINATION_WINDOW_LABEL).toBe("9 November 2026 – 31 March 2027");
    expect(MASTER_TIMELINE_2026.find((item) => item.id === "gold-blue-garnet-verification")?.endsAt).toBe("2026-12-13T23:59:59Z");
  });
});