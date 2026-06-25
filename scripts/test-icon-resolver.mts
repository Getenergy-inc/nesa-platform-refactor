import { resolveIconImage } from '../src/data/iconAward/imageManifest';
const tests = [
  'dr-akinwumi-adesina','dr-bitange-ndemo','dr-hakim-adi','dr-donald-kaberuka-philanthropy',
  'dr-ibrahim-mayaki','dr-obiageli-ezekwesili-curriculum','dr-vera-songwe','dr-wandia-njoya',
  'dr-tajudeen-abdul-raheem-posthumous-influence','chinua-achebe-posthumous-global-impact',
  'audrey-cheng-africa-based-programmes','amina-mohammed-global-un-role',
  'chimamanda-adichie-nigeria-based-influence','alhaji-aliko-dangote-rural-education-focus',
  'angelina-jolie-curriculum','bill-gates','elon-musk-tech','unknown-person-xyz',
  'dr-oby-ezekwesili-philanthropy','sir-fazle-hasan-abed',
];
let hits=0,miss=0;
for (const t of tests) { const r=resolveIconImage(t); console.log(t.padEnd(55),'→',r??'MISS'); r?hits++:miss++; }
console.log(`\n${hits} hits / ${miss} misses`);
