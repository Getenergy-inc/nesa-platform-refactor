import { describe, it, expect } from "vitest";
import { getMasterCatalogueNominees } from "@/lib/directory/masterCatalogueSource";
import { buildCatalogue } from "@/lib/directory/buildCatalogue";
describe("master catalogue", () => {
  it("maps", () => {
    const list = getMasterCatalogueNominees();
    const c = buildCatalogue(list as any);
    console.log("total", list.length, "unique", new Set(list.map(n=>n.id)).size, "mapped", c.counters.mapped, "review", c.counters.review, "cats", c.counters.categories, "subs", c.counters.subcategories);
    c.tiers.forEach(t=>console.log(t.slug, t.count));
    expect(c.counters.review).toBe(0);
  });
});
