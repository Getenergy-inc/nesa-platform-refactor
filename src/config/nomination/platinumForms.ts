// Platinum / Institutional Leadership — 7 categories / 15 forms once
// regional faith categories (2) are expanded × 5 regions = 10 + 5 non-regional = 15.
// Audit reference: nesa_54_forms_audit_v1 rows 32-46.

import type { AwardCategoryForm } from "./types";
import { TODAY, placeholderSubs } from "./_shared";
import {
  NIGERIA_EDU_IMPACT_SUBCATEGORIES,
  NIGERIA_POLITICAL_ROLES,
} from "./nigeriaZones";

const LIBRARY_SUBS = placeholderSubs([
  "Print collection",
  "Digital library services",
  "Research support services",
  "Accessibility services",
  "Community outreach",
  "Other",
]);

const RD_SUBS = placeholderSubs([
  "Applied research",
  "Industry partnership",
  "Patents & innovation",
  "Postgraduate research",
  "Knowledge translation",
  "Other",
]);

const FAITH_SUBS = placeholderSubs([
  "Faith-based schools network",
  "Scholarship programmes",
  "Community education projects",
  "Special needs inclusion",
  "Teacher training",
  "Other",
]);

const INTL_PARTNER_SUBS = placeholderSubs([
  "Bilateral partnership",
  "Multilateral programme",
  "Foundation partnership",
  "South-South cooperation",
  "Cross-border research",
  "Other",
]);

const DIASPORA_SUBS = placeholderSubs([
  "Diaspora scholarship fund",
  "Knowledge transfer programme",
  "Mentorship network",
  "Curriculum partnership",
  "Education infrastructure support",
  "Other",
]);

const POLITICAL_SUBS = placeholderSubs(NIGERIA_EDU_IMPACT_SUBCATEGORIES);

const AUDIT_FAMILY = "Platinum / Institutional Leadership" as const;
const GROUP = "Platinum — Institutional Leadership";

export const PLATINUM_FORMS: AwardCategoryForm[] = [
  {
    slug: "best-tertiary-institution-library-nigeria",
    name: "Best Tertiary Institution Library — Nigeria",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "tertiarylibraryngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — Best Tertiary Institution Library — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: LIBRARY_SUBS,
  },
  {
    slug: "excellence-in-research-development-for-education-nigeria",
    name: "Excellence in Research & Development for Education — Nigeria",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "researchdevngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in Research & Development for Education — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: RD_SUBS,
  },
  {
    slug: "excellence-in-christian-education-impact-africa-regional",
    name: "Excellence in Christian Education Impact — Africa Regional",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "christianeduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in Christian Education Impact — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: FAITH_SUBS,
  },
  {
    slug: "excellence-in-islamic-education-impact-africa-regional",
    name: "Excellence in Islamic Education Impact — Africa Regional",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "islamiceduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in Islamic Education Impact — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: FAITH_SUBS,
  },
  {
    slug: "excellence-in-political-leadership-for-education-nigeria",
    name: "Excellence in Political Leadership for Education — Nigeria",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "politicaledungnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in Political Leadership for Education — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: POLITICAL_SUBS,
    isNigeriaZonalCategory: true,
    leadershipRoles: NIGERIA_POLITICAL_ROLES,
    shortDescription:
      "Nominate Nigerian political leaders whose policies, reforms or interventions delivered measurable education impact. Nominations are organized by Nigeria's 6 geopolitical zones and 36 states + FCT.",
  },
  {
    slug: "excellence-in-international-partnership-for-education-africa",
    name: "Excellence in International Partnership for Education — Africa",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Institutional",
    group: GROUP,
    gmail: "intlpartnerafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in International Partnership for Education — Africa",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: INTL_PARTNER_SUBS,
  },
  {
    slug: "excellence-in-diaspora-educational-impact-international",
    name: "Excellence in Diaspora Educational Impact — International",
    family: "platinum",
    awardFamilyName: AUDIT_FAMILY,
    recognitionClass: "Diaspora",
    group: GROUP,
    gmail: "diasporaeduimpactnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Excellence in Diaspora Educational Impact — International",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: DIASPORA_SUBS,
  },
];
