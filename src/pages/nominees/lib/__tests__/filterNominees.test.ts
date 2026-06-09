import { describe, it, expect } from "vitest";
import {
  parseFilterParams,
  applyFilterChange,
  activeFilterCount,
  filterNominees,
  DEFAULT_FILTERS,
  type FilterableNominee,
  type NomineeFilterState,
} from "@/pages/nominees/lib/filterNominees";

// ---------- URL ⇄ state deep-link coverage ----------------------------------

describe("parseFilterParams (deep-link state coverage)", () => {
  it("returns full defaults for an empty URL", () => {
    expect(parseFilterParams(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });

  it("decodes every Pass-D first-class filter from the URL", () => {
    const url = new URLSearchParams(
      "q=ada&category=best-csr-education-nigeria&country=Nigeria&region=west-africa" +
        "&awardFamily=platinum&recognitionClass=institutional&zone=south-west&state=lagos" +
        "&edition=2024&group=africans-in-africa&type=institution",
    );
    expect(parseFilterParams(url)).toEqual({
      q: "ada",
      category: "best-csr-education-nigeria",
      country: "Nigeria",
      region: "west-africa",
      awardFamily: "platinum",
      recognitionClass: "institutional",
      zone: "south-west",
      state: "lagos",
      edition: "2024",
      group: "africans-in-africa",
      type: "institution",
    });
  });
});

describe("applyFilterChange (cascade + default-stripping)", () => {
  it("drops a value when it equals the default 'all'", () => {
    const start = new URLSearchParams("category=x");
    const next = applyFilterChange(start, "category", "all");
    expect(next.has("category")).toBe(false);
  });

  it("drops the edition param when set back to 2026", () => {
    const next = applyFilterChange(new URLSearchParams("edition=2024"), "edition", "2026");
    expect(next.has("edition")).toBe(false);
  });

  it("clears zone & state when country switches away from Nigeria", () => {
    const start = new URLSearchParams("country=nigeria&zone=south-west&state=lagos");
    const next = applyFilterChange(start, "country", "ghana");
    expect(next.get("country")).toBe("ghana");
    expect(next.has("zone")).toBe(false);
    expect(next.has("state")).toBe(false);
  });

  it("clears state when zone resets to 'all'", () => {
    const start = new URLSearchParams("country=nigeria&zone=south-west&state=lagos");
    const next = applyFilterChange(start, "zone", "all");
    expect(next.has("zone")).toBe(false);
    expect(next.has("state")).toBe(false);
    // country preserved
    expect(next.get("country")).toBe("nigeria");
  });

  it("survives a round-trip: URL → state → URL", () => {
    const original = new URLSearchParams(
      "awardFamily=icon&recognitionClass=diaspora&country=Kenya&region=east-africa",
    );
    const state = parseFilterParams(original);
    let rebuilt = new URLSearchParams();
    (Object.keys(state) as (keyof NomineeFilterState)[]).forEach((k) => {
      rebuilt = applyFilterChange(rebuilt, k, state[k]);
    });
    expect(parseFilterParams(rebuilt)).toEqual(state);
  });
});

describe("activeFilterCount", () => {
  it("counts zero for the default state", () => {
    expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0);
  });

  it("counts the search query and every non-default dropdown", () => {
    const s: NomineeFilterState = {
      ...DEFAULT_FILTERS,
      q: "ada",
      country: "Nigeria",
      awardFamily: "platinum",
      zone: "south-west",
    };
    expect(activeFilterCount(s)).toBe(4);
  });

  it("ignores edition / group toggles (they live outside the chip count)", () => {
    const s: NomineeFilterState = { ...DEFAULT_FILTERS, edition: "2024", group: "diaspora" };
    expect(activeFilterCount(s)).toBe(0);
  });
});

// ---------- Pure filter coverage --------------------------------------------

const fixtures: FilterableNominee[] = [
  {
    name: "Ada Okeke",
    status: "approved",
    categorySlug: "best-csr-education-nigeria",
    categoryName: "Best CSR — Nigeria",
    country: "Nigeria",
    region: "West Africa",
    awardFamily: "platinum",
    recognitionClass: "institutional",
    zoneSlug: "south-west",
    stateSlug: "lagos",
  },
  {
    name: "Kwame Asante",
    status: "approved",
    categorySlug: "best-csr-education-africa",
    categoryName: "Best CSR — Africa",
    country: "Ghana",
    region: "West Africa",
    awardFamily: "gold-bluegarnet",
    recognitionClass: "africa-resident",
  },
  {
    name: "Wanjiku Mwangi",
    status: "platinum",
    categorySlug: "best-edutech-organisation-africa",
    categoryName: "Best EduTech",
    country: "Kenya",
    region: "East Africa",
    awardFamily: "platinum",
    recognitionClass: "institutional",
  },
  {
    name: "Rejected Entry",
    status: "rejected",
    categorySlug: "best-csr-education-africa",
    country: "Nigeria",
    region: "West Africa",
  },
];

describe("filterNominees", () => {
  it("drops rejected rows even with no active filters", () => {
    const out = filterNominees(fixtures, DEFAULT_FILTERS);
    expect(out.map((n) => n.name)).toEqual(["Ada Okeke", "Kwame Asante", "Wanjiku Mwangi"]);
  });

  it("filters by category", () => {
    const out = filterNominees(fixtures, {
      ...DEFAULT_FILTERS,
      category: "best-csr-education-nigeria",
    });
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe("Ada Okeke");
  });

  it("filters by country case-insensitively", () => {
    const out = filterNominees(fixtures, { ...DEFAULT_FILTERS, country: "nigeria" });
    expect(out.map((n) => n.name)).toEqual(["Ada Okeke"]);
  });

  it("filters by African region slug", () => {
    const out = filterNominees(fixtures, { ...DEFAULT_FILTERS, region: "east-africa" });
    expect(out.map((n) => n.name)).toEqual(["Wanjiku Mwangi"]);
  });

  it("filters by awardFamily + recognitionClass simultaneously", () => {
    const out = filterNominees(fixtures, {
      ...DEFAULT_FILTERS,
      awardFamily: "platinum",
      recognitionClass: "institutional",
    });
    expect(out.map((n) => n.name)).toEqual(["Ada Okeke", "Wanjiku Mwangi"]);
  });

  it("filters by Nigeria zone + state cascade", () => {
    const out = filterNominees(fixtures, {
      ...DEFAULT_FILTERS,
      country: "Nigeria",
      zone: "south-west",
      state: "lagos",
    });
    expect(out.map((n) => n.name)).toEqual(["Ada Okeke"]);
  });

  it("returns an empty array when zone/state has no matching rows (drives empty-state UI)", () => {
    const out = filterNominees(fixtures, {
      ...DEFAULT_FILTERS,
      country: "Nigeria",
      zone: "north-east",
    });
    expect(out).toEqual([]);
  });

  it("filters by free-text search across name + category + country", () => {
    expect(filterNominees(fixtures, { ...DEFAULT_FILTERS, q: "kwame" })).toHaveLength(1);
    expect(filterNominees(fixtures, { ...DEFAULT_FILTERS, q: "edutech" })).toHaveLength(1);
    expect(filterNominees(fixtures, { ...DEFAULT_FILTERS, q: "ghana" })).toHaveLength(1);
  });
});
