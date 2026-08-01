import { getMasterCatalogueNominees } from "../../src/lib/directory/masterCatalogueSource";
const l = getMasterCatalogueNominees();
console.log(l.length, l.slice(0,3).map(n=>n.slug).join(" | "));
