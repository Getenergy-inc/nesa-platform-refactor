// Shared helpers + reusable subcategory packs used across the per-family
// form files (iconForms, influencerForms, goldBlueGarnetForms, platinumForms).
//
// All forms ship as `Link Pending` — `withResolvedStatus(es)` auto-promotes
// to "Active" once both public + embed URLs are present.

import type { NominationSubcategory } from "./types";

export const TODAY = "2026-06-06";

export const placeholderSubs = (
  names: string[],
): NominationSubcategory[] =>
  names.map((name) => ({
    slug: name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name,
  }));

// ── Region-scoped base subcategory packs (consumed by africaRegionalBuilder)
export const CSR_REGIONAL_BASE_SUBS = [
  "Banking & Finance CSR",
  "Telecommunications CSR",
  "Technology & ICT CSR",
  "Oil & Gas CSR",
  "Food & Beverages CSR",
  "Aviation CSR",
];

export const EDUTECH_REGIONAL_BASE_SUBS = [
  "EduTech Startup",
  "EduTech Established Company",
  "EduTech Social Impact Initiative",
  "EduTech Social Impact",
];

export const NGO_REGIONAL_BASE_SUBS = [
  "Educational Infrastructure",
  "Education Aid & Scholarships",
  "Educational Materials & Resources",
  "Youth Skills & Learning Programmes",
  "Women & Girls Education Advocacy",
  "Teacher Training",
  "Girl-Child Education",
  "Special Needs Education",
  "Community Development",
];

export const STEM_REGIONAL_BASE_SUBS = [
  "Inclusive STEM Programme",
  "Digital STEM Innovation",
  "Community-Based STEM Outreach",
  "Girls in STEM Advancement",
  "Women in STEM",
  "Youth STEM",
  "Institutional STEM",
];

export const FAITH_REGIONAL_BASE_SUBS = [
  "Faith-Based Schools Network",
  "Faith-Based Scholarship Programmes",
  "Community Education Projects",
  "Special Needs Inclusion",
  "Teacher Training",
];
