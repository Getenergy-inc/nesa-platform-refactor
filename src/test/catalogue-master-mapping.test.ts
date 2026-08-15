import { describe, it, expect } from "vitest";
import { getMasterCatalogueNominees, masterNomineeId } from "@/lib/directory/masterCatalogueSource";
import { buildCatalogue } from "@/lib/directory/buildCatalogue";
import { getAllMasterNominees } from "@/lib/nomineeMasterData";

describe("Recognition catalogue — master nominee mapping", () => {
  const list = getMasterCatalogueNominees();
  const catalogue = buildCatalogue(list as never);

  // `toCatalogueNominee` intentionally drops master rows with no nominee name:
  // they stay in the register for audit but are never published as a public
  // profile. So the projected count is master rows MINUS unnamed rows, not the
  // raw master count (the old assertion). Both sides are asserted explicitly so
  // any change in either number still fails the test.
  it("projects every named master nominee and drops only unnamed rows", () => {
    const master = getAllMasterNominees();
    const unnamed = master.filter((n) => !n.name || !n.name.trim());
    expect(master.length).toBe(1703);
    expect(unnamed.length).toBe(7);
    expect(list.length).toBe(master.length - unnamed.length);
    expect(list.every((n) => n.name.trim().length > 0)).toBe(true);
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
