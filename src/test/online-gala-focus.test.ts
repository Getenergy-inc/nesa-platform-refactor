import { describe, expect, it } from "vitest";
import { ONLINE_GALA, PROGRAMME_END_DATE } from "@/config/programme";
import { ICON_SELECTION_CRITERIA } from "@/config/iconSelectionCriteria";
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
  it("retains the 13 December gala date", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-13");
    expect(MASTER_TIMELINE_2026.find((entry) => entry.id === "recognition-gala")?.startsAt).toBe("2026-12-13T00:00:00Z");
  });
  it("keeps continuing recognition open until 31 March 2027", () => {
    expect(ONLINE_GALA.continuingRecognitionEndsOn).toBe("2027-03-31");
  });
  it("publishes the existing eight Icon criteria with their approved weights", () => {
    expect(ICON_SELECTION_CRITERIA.map(({ name, weight }) => ({ name, weight }))).toEqual([
      { name: "Lifetime Education Impact", weight: 25 },
      { name: "Scale and Reach", weight: 15 },
      { name: "Sustainability and Legacy", weight: 15 },
      { name: "Innovation or Knowledge Contribution", weight: 10 },
      { name: "Inclusion and Equity", weight: 10 },
      { name: "Leadership and Integrity", weight: 10 },
      { name: "Evidence Quality", weight: 10 },
      { name: "Continental Relevance", weight: 5 },
    ]);
  });
  it("keeps the public criteria complete and weighted to 100 percent", () => {
    expect(ICON_SELECTION_CRITERIA.reduce((total, criterion) => total + criterion.weight, 0)).toBe(100);
    expect(ICON_SELECTION_CRITERIA.every((criterion) => criterion.description.length > 0)).toBe(true);
  });
});