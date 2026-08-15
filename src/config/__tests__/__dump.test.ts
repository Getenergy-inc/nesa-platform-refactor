import { describe, it } from "vitest";
import { getCategoryFormBySlug, AWARD_CATEGORY_FORMS } from "@/config/nomination/awardCategoryForms";
const slugs = `africa-education-icon-award
best-creative-arts-contribution-to-education-nigeria
best-education-policy-and-implementation-state-nigeria
best-media-organisation-for-education-advocacy-nigeria
csr-education
csr-for-education
edtech-and-ai-innovation
education-philanthropy
education-policy-and-government
excellence-in-research-and-development-for-education-nigeria
faith-based-organisations
icon
institutional-and-bilateral-grants
libraries-and-knowledge-systems
media-and-journalism-for-education
ngos-advancing-education
research-and-curriculum-development
special-needs`.split("\n");
describe("d", () => { it("d", () => { console.log("BAD:", slugs.filter(s=>!getCategoryFormBySlug(s)).join("\n")); console.log("ALL:", AWARD_CATEGORY_FORMS.map(f=>f.slug).join("\n")); }); });
