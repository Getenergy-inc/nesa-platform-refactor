import { getAllMasterNominees } from "../../src/lib/nomineeMasterData";
const m = new Map<string,{name:string,c:number}>();
for (const n of getAllMasterNominees()) {
  const e = m.get(n.categorySlug); if(e) e.c++; else m.set(n.categorySlug,{name:n.category,c:1});
}
console.log(getAllMasterNominees().length);
for (const [s,v] of [...m].sort((a,b)=>b[1].c-a[1].c)) console.log(v.c, "|", s, "|", v.name);
