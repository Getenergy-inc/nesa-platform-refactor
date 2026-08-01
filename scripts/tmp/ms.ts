import { MASTER_CATALOGUE_NOMINEES } from "../../src/lib/directory/masterCatalogueSource";
console.log(MASTER_CATALOGUE_NOMINEES.length, MASTER_CATALOGUE_NOMINEES.slice(0,3).map(n=>n.slug).join(" | "));
