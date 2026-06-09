// Influencer Education Impact Award 2026 — 3 forms.
// Audit reference: nesa_54_forms_audit_v1 rows 1-3.
// All forms ship "Link Pending" until URLs are pasted by the data team.

import type { AwardCategoryForm } from "./types";
import { TODAY, placeholderSubs } from "./_shared";

const INFLUENCER_CONTENT_SUBS = placeholderSubs([
  "Digital learning content",
  "Career guidance content",
  "Public education content",
  "Skills training content",
  "Youth mentorship content",
  "STEM learning content",
  "Language / literacy content",
  "Other",
]);

const SPORTS_SUBS = placeholderSubs([
  "Scholarships funded",
  "Schools built / renovated",
  "Youth academy education",
  "Girls' education advocacy",
  "Community learning programmes",
  "Other",
]);

const MUSIC_SUBS = placeholderSubs([
  "Scholarships funded",
  "School / library projects",
  "Music education programmes",
  "Youth mentorship",
  "Education advocacy campaigns",
  "Other",
]);

export const INFLUENCER_FORMS: AwardCategoryForm[] = [
  {
    slug: "education-content-social-media-influencers",
    name: "African Social Media Influencers Education Impact Award",
    family: "influencer",
    awardFamilyName: "Influencer Education Impact Award 2026",
    recognitionClass: "Africa-Resident / Diaspora",
    group: "Influencer Education Impact",
    gmail: "socialinfl4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — African Social Media Influencers Education Impact Award",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Creators using social platforms to teach, mentor, and advance education across Africa.",
    subcategories: INFLUENCER_CONTENT_SUBS,
  },
  {
    slug: "african-footballers-supporting-education",
    name: "African Sports Icons Supporting Education",
    family: "influencer",
    awardFamilyName: "Influencer Education Impact Award 2026",
    recognitionClass: "Africa-Resident / Diaspora",
    group: "Influencer Education Impact",
    gmail: "footballers4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — African Sports Icons Supporting Education",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "African sports icons funding scholarships, schools, and youth education programmes.",
    subcategories: SPORTS_SUBS,
  },
  {
    slug: "african-musicians-supporting-education",
    name: "African Music Icons Supporting Education",
    family: "influencer",
    awardFamilyName: "Influencer Education Impact Award 2026",
    recognitionClass: "Africa-Resident / Diaspora",
    group: "Influencer Education Impact",
    gmail: "musicians4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA2026 — African Music Icons Supporting Education",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "African music icons advancing education through philanthropy, campaigns, and programmes.",
    subcategories: MUSIC_SUBS,
  },
];
