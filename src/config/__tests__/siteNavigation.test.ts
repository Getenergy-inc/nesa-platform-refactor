import { describe, it, expect } from "vitest";
import { SITE_NAV, UTILITY_NAV } from "@/config/siteNavigation";
import { PROGRAMME_END_DATE, PROGRAMME_END_LONG_LABEL } from "@/config/programme";

describe("2026–2027 navigation", () => {
  it("uses the approved seven main menu groups in order", () => {
    expect(SITE_NAV.map((g) => g.label)).toEqual([
      "About", "Recognition", "Nominees", "Impact", "Media", "Get Involved", "Contact",
    ]);
  });
  it("has no voting, AGC, ticket or table links anywhere", () => {
    const all = [...SITE_NAV.flatMap((g) => [g, ...(g.children ?? [])]), ...UTILITY_NAV];
    for (const i of all) expect(i.href).not.toMatch(/vote|agc|ticket|table|wallet/i);
  });
});

describe("online programme date", () => {
  it("is Monday 28 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Monday, 28 December 2026 · Online");
  });
});
