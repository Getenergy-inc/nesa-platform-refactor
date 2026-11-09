import { describe, expect, it } from "vitest";
import { ONLINE_GALA, PROGRAMME_END_DATE } from "@/config/programme";
import { MASTER_TIMELINE_2026 } from "@/data/masterTimeline2026";

describe("approved online gala scope", () => {
  it("limits recognition to up to nine Icons without guaranteeing recipients", () => {
    expect(ONLINE_GALA.maximumIcons).toBe(9);
  });
  it("retains the three approved presentation categories", () => {
    expect(ONLINE_GALA.copy.categories).toEqual([
      "Education Philanthropy Icon",
      "Literary and New Curriculum Advocate Icon",
      "Technical Educator Icon",
    ]);
  });
  it("uses approximately 20–30 approved production participants", () => {
    expect(ONLINE_GALA.productionParticipants).toEqual({ approximateMinimum: 20, approximateMaximum: 30 });
  });
  it("remains online only", () => expect(ONLINE_GALA.onlineOnly).toBe(true));
  it("does not sell tickets", () => expect(ONLINE_GALA.ticketSales).toBe(false));
  it("does not enable public voting", () => expect(ONLINE_GALA.publicVoting).toBe(false));
  it("retains the 28 December gala date", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(MASTER_TIMELINE_2026.find((entry) => entry.id === "recognition-gala")?.startsAt).toBe("2026-12-28T00:00:00Z");
  });
  it("keeps continuing recognition open until 31 March 2027", () => {
    expect(ONLINE_GALA.continuingRecognitionEndsOn).toBe("2027-03-31");
  });
});