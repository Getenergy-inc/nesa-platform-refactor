// Gold-Blue Garnet — Competitive Excellence — 9 categories / 25 forms once
// regional categories (4) are expanded × 5 regions = 20 + 5 non-regional = 25.
// Audit reference: nesa_54_forms_audit_v1 rows 7-31.

import type { AwardCategoryForm } from "./types";
import { TODAY, placeholderSubs } from "./_shared";

const CSR_SUBS = placeholderSubs([
  "Scholarships",
  "School infrastructure",
  "Digital learning support",
  "Teacher development",
  "Special needs education support",
  "Girls' education",
  "STEM support",
  "Learning materials",
  "Other",
]);

const NGO_SUBS = placeholderSubs([
  "School access support",
  "Learning materials support",
  "Girls' education",
  "Special needs education",
  "Community education advocacy",
  "Teacher training",
  "Digital learning",
  "Other",
]);

const STEM_SUBS = placeholderSubs([
  "Robotics",
  "Coding",
  "Science labs",
  "Girls in STEM",
  "STEM clubs",
  "STEM teacher development",
  "Innovation challenge",
  "Other",
]);

const EDUTECH_SUBS = placeholderSubs([
  "K-12 learning platform",
  "Higher-education platform",
  "Teacher tooling",
  "Inclusive / assistive tech",
  "AI for learning",
  "Offline / low-bandwidth solutions",
  "Other",
]);

const MEDIA_SUBS = placeholderSubs([
  "Investigative education reporting",
  "Education campaigns",
  "Documentary series",
  "Public-interest broadcasting",
  "Digital storytelling",
  "Other",
]);

const CREATIVE_ARTS_SUBS = placeholderSubs([
  "Theatre & performance",
  "Visual arts in schools",
  "Film & documentary",
  "Music & dance education",
  "Creative writing programmes",
  "Other",
]);

const POLICY_STATE_SUBS = placeholderSubs([
  "Basic education policy",
  "Tertiary education policy",
  "Teacher welfare reform",
  "Out-of-school children intervention",
  "Education infrastructure delivery",
  "Other",
]);

const AUDIT_FAMILY = "Gold-Blue Garnet — Competitive Excellence" as const;
const GROUP = "Gold-Blue Garnet — Competitive Excellence";

export const GOLD_BLUE_GARNET_FORMS: AwardCategoryForm[] = [
  {
    slug: "best-csr-for-education-africa-regional",
    name: "Best CSR for Education — Africa Regional",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "csreduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — Best CSR for Education — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CSR_SUBS,
  },
  {
    slug: "best-csr-for-education-nigeria",
    name: "Best CSR for Education — Nigeria",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "csredunigerianesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — Best CSR for Education — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CSR_SUBS,
  },
  {
    slug: "best-edutech-innovation-for-education-africa-regional",
    name: "Best EduTech Innovation for Education — Africa Regional",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "edtechafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best EduTech Innovation for Education — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: EDUTECH_SUBS,
  },
  {
    slug: "best-media-organisation-for-education-advocacy-nigeria",
    name: "Best Media Organisation for Education Advocacy — Nigeria",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "mediaadvocacyngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best Media Organisation for Education Advocacy — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: MEDIA_SUBS,
  },
  {
    slug: "best-ngo-for-education-advancement-nigeria",
    name: "Best NGO for Education Advancement — Nigeria",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "ngoadvancementngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — Best NGO for Education Advancement — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: NGO_SUBS,
  },
  {
    slug: "best-ngo-for-education-advancement-africa-regional",
    name: "Best NGO for Education Advancement — Africa Regional",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "ngoadvanceafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best NGO for Education Advancement — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: NGO_SUBS,
  },
  {
    slug: "best-stem-education-programme-africa-regional",
    name: "Best STEM Education Programme — Africa Regional",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "stemprogramafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best STEM Education Programme — Africa Regional",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: STEM_SUBS,
  },
  {
    slug: "best-creative-arts-contribution-to-education-nigeria",
    name: "Best Creative Arts Contribution to Education — Nigeria",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "creativeartsngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best Creative Arts Contribution to Education — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CREATIVE_ARTS_SUBS,
  },
  {
    slug: "best-education-policy-implementation-state-nigeria",
    name: "Best Education Policy & Implementation State — Nigeria",
    family: "gold-blue-garnet",
    awardFamilyName: AUDIT_FAMILY,
    group: GROUP,
    gmail: "edupolicystatenesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle:
      "NESA2026 — Best Education Policy & Implementation State — Nigeria",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: POLICY_STATE_SUBS,
  },
];
