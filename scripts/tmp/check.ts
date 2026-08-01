import { getMasterCatalogueNominees, resolveMasterCategorySlug } from "../../src/lib/directory/masterCatalogueSource";
import { buildCatalogue } from "../../src/lib/directory/buildCatalogue";
const list = getMasterCatalogueNominees();
console.log("total", list.length, "ids unique", new Set(list.map(n=>n.id)).size);
const c = buildCatalogue(list as any);
console.log("mapped", c.counters.mapped, "review", c.counters.review, "cats", c.counters.categories, "subs", c.counters.subcategories);
c.tiers.forEach(t=>console.log("tier", t.slug, t.count));
