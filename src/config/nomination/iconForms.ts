// Africa Education Icon Lifetime Achievement Award 2006–2026.
// Audit reference: nesa_54_forms_audit_v1 rows 4-6 (the 3 jury-only icons).
// The historical "Lifetime Achievement (parent)" entry is preserved as a
// non-audit umbrella so legacy consumers in src/data/iconAward and
// src/pages/categories/AfricaEducationIcon.tsx keep resolving — it is NOT
// counted toward the 46 award forms in the audit.

import type { AwardCategoryForm } from "./types";
import { TODAY, placeholderSubs } from "./_shared";

// Locked to the 3 audit-aligned Icon of the Decade categories.
// Source of truth: src/config/nomination/iconTaxonomy.ts
const ICON_SUBS = placeholderSubs([
  "Literary & New Curriculum Advocate Icon of the Decade",
  "Africa Technical Educator Icon of the Decade",
  "Africa Education Philanthropy Icon of the Decade",
]);

export const ICON_FORMS: AwardCategoryForm[] = [
  // ── Umbrella entry (legacy; not in 54-form audit) ───────────────────────
  {
    slug: "africa-education-icon-lifetime-achievement-2006-2026",
    name: "Africa Education Icon Lifetime Achievement Award 2006–2026",
    family: "africa-education-icon",
    awardFamilyName:
      "Africa Education Icon Lifetime Achievement Award 2006–2026",
    recognitionClass: "Africa-Resident / Diaspora / Friend of Africa",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "eduicon2006to2026nesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA 2026 — Africa Education Icon Lifetime Achievement — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Two decades of measurable continental education impact (2006–2026).",
    subcategories: ICON_SUBS,
    notes:
      "Umbrella entry — by invitation; public recommendation allowed. Not counted in the 46 audit forms.",
  },

  // ── 3 audit-aligned Icon forms (jury-only, no public vote) ─────────────
  {
    slug: "africa-education-philanthropy-icon-of-the-decade",
    name: "Africa Education Philanthropy Icon of the Decade",
    family: "africa-education-icon",
    awardFamilyName:
      "Africa Education Icon Lifetime Achievement Award 2006–2026",
    recognitionClass: "Africa-Resident / Diaspora / Friend of Africa",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "eduphilanthropynesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Africa Education Philanthropy Icon of the Decade",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
    notes: "Jury-only; no public vote.",
  },
  {
    slug: "literary-new-curriculum-advocate-icon-of-the-decade",
    name: "Literary & New Curriculum Advocate Icon of the Decade",
    family: "africa-education-icon",
    awardFamilyName:
      "Africa Education Icon Lifetime Achievement Award 2006–2026",
    recognitionClass: "Africa-Resident / Diaspora / Friend of Africa",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "literarycurriculumnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Literary & New Curriculum Advocate Icon of the Decade",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
    notes: "Jury-only; no public vote.",
  },
  {
    slug: "africa-technical-educator-icon-of-the-decade",
    name: "Africa Technical Educator Icon of the Decade",
    family: "africa-education-icon",
    awardFamilyName:
      "Africa Education Icon Lifetime Achievement Award 2006–2026",
    recognitionClass: "Africa-Resident / Diaspora / Friend of Africa",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "technicaleducatornesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Africa Technical Educator Icon of the Decade",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
    notes: "Jury-only; no public vote.",
  },
];
