import { describe, it, expect } from "vitest";
import { getMasterCatalogueNominees, masterNomineeId } from "@/lib/directory/masterCatalogueSource";
import { buildCatalogue } from "@/lib/directory/buildCatalogue";
import { getAllMasterNominees } from "@/lib/nomineeMasterData";

describe("Recognition catalogue — master nominee mapping", () => {
  const list = getMasterCatalogueNominees();
  const catalogue = buildCatalogue(list as never);

  it("projects every master nominee", () => {
    expect(list.length).toBe(getAllMasterNominees().length);
    expect(list.length).toBeGreaterThanOrEqual(1674);
  });

  it("gives every nominee a stable, unique id", () => {
    expect(new Set(list.map((n) => n.id)).size).toBe(list.length);
    expect(list.every((n) => n.id.startsWith("nesa-2025-"))).toBe(true);
    expect(masterNomineeId(getAllMasterNominees()[0])).toBe(list.find((n) => n.slug === getAllMasterNominees()[0].slug)?.id);
  });

  it("maps every nominee to a tier, category and subcategory with none in review", () => {
    expect(catalogue.counters.mapped).toBe(list.length);
    expect(catalogue.counters.review).toBe(0);
    expect(catalogue.counters.categories).toBeGreaterThan(0);
    expect(catalogue.counters.subcategories).toBeGreaterThan(0);
    expect(list.every((n) => n.subcategoryName && n.subcategorySlug)).toBe(true);
  });
});
