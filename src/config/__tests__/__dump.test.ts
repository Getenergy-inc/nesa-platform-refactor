import { describe, it } from "vitest";
import { SITE_NAV } from "@/config/siteNavigation";
describe("dump", () => { it("d", () => { console.log(JSON.stringify(SITE_NAV.map(g=>({l:g.label,h:g.href,sec:g.sections?.map(s=>s.title),ch:g.children?.map(c=>c.href)})),null,1)); }); });
