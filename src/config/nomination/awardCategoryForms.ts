// 23 Award Category Google Forms — NESA-Africa 2026.
// Form URLs marked "" with status "Link Pending" until the SCEF / NESA-Africa
// data team creates the Google Form inside the listed Gmail inbox and pastes
// the public + embed URLs here. Flip status to "Active" once both are filled.
//
// See: docs/NOMINATION_FORM_MAPPING.md for the full operational register.

import type { AwardCategoryForm, NominationSubcategory } from "./types";

const placeholderSubs = (
  names: string[],
): NominationSubcategory[] =>
  names.map((name) => ({
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name,
  }));

const TODAY = "2026-06-06";

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

const PLATINUM_SUBS = placeholderSubs([
  "Institutional leadership",
  "Research impact",
  "Partnership impact",
  "Public education contribution",
  "Community education support",
  "Special needs inclusion",
  "Other",
]);

const ICON_SUBS = placeholderSubs([
  "Lifetime education leadership",
  "Continental advocacy",
  "Policy & governance",
  "Curriculum & literary",
  "Technical & vocational",
  "Philanthropy",
  "Other",
]);

const FOOTBALL_SUBS = placeholderSubs([
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

const POLITICAL_SUBS = placeholderSubs([
  "Legislative advocacy",
  "Budget & financing",
  "Implementation oversight",
  "Public-private partnership",
  "Reform leadership",
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

const EDUTECH_SUBS = placeholderSubs([
  "K-12 learning platform",
  "Higher-education platform",
  "Teacher tooling",
  "Inclusive / assistive tech",
  "AI for learning",
  "Offline / low-bandwidth solutions",
  "Other",
]);

export const AWARD_CATEGORY_FORMS: AwardCategoryForm[] = [
  // ── Influencer Education Impact ────────────────────────────────────────
  {
    slug: "education-content-social-media-influencers",
    name: "Education Content Social Media Influencers",
    family: "influencer",
    group: "Influencer Education Impact",
    gmail: "socialinfl4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Education Content Social Media Influencers — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Creators using social platforms to teach, mentor, and advance education across Africa.",
    subcategories: INFLUENCER_CONTENT_SUBS,
  },
  {
    slug: "african-footballers-supporting-education",
    name: "African Footballers Supporting Education",
    family: "influencer",
    group: "Influencer Education Impact",
    gmail: "footballers4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — African Footballers Supporting Education — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "African footballers funding scholarships, schools, and youth education programmes.",
    subcategories: FOOTBALL_SUBS,
  },
  {
    slug: "african-musicians-supporting-education",
    name: "African Musicians Supporting Education",
    family: "influencer",
    group: "Influencer Education Impact",
    gmail: "musicians4edafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — African Musicians Supporting Education — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "African musicians advancing education through philanthropy, campaigns, and programmes.",
    subcategories: MUSIC_SUBS,
  },

  // ── Africa Education Icon ──────────────────────────────────────────────
  {
    slug: "africa-education-icon-lifetime-achievement-2006-2026",
    name: "Africa Education Icon Lifetime Achievement Award 2006–2026",
    family: "africa-education-icon",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "eduicon2006to2026nesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Africa Education Icon Lifetime Achievement — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Two decades of measurable continental education impact (2006–2026).",
    subcategories: ICON_SUBS,
    notes: "By invitation; public recommendation allowed.",
  },
  {
    slug: "africa-education-philanthropy-icon-of-the-decade",
    name: "Africa Education Philanthropy Icon of the Decade",
    family: "africa-education-icon",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "eduphilanthropynesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Africa Education Philanthropy Icon of the Decade — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
  },
  {
    slug: "literary-new-curriculum-advocate-icon-of-the-decade",
    name: "Literary & New Curriculum Advocate Icon of the Decade",
    family: "africa-education-icon",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "literarycurriculumnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Literary & New Curriculum Advocate Icon — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
  },
  {
    slug: "africa-technical-educator-icon-of-the-decade",
    name: "Africa Technical Educator Icon of the Decade",
    family: "africa-education-icon",
    group: "Africa Education Icon — Lifetime Achievement",
    gmail: "technicaleducatornesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Africa Technical Educator Icon — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: ICON_SUBS,
  },

  // ── Gold-Blue Garnet — Competitive Excellence ─────────────────────────
  {
    slug: "best-csr-for-education-africa-regional",
    name: "Best CSR for Education — Africa Regional",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "csreduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best CSR for Education Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CSR_SUBS,
  },
  {
    slug: "best-csr-for-education-nigeria",
    name: "Best CSR for Education — Nigeria",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "csredunigerianesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best CSR for Education Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CSR_SUBS,
  },
  {
    slug: "best-edutech-innovation-for-education-africa-regional",
    name: "Best EduTech Innovation for Education — Africa Regional",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "edtechafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best EduTech Innovation Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: EDUTECH_SUBS,
  },
  {
    slug: "best-media-organisation-for-education-advocacy-nigeria",
    name: "Best Media Organisation for Education Advocacy — Nigeria",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "mediaadvocacyngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best Media Organisation for Education Advocacy Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: MEDIA_SUBS,
  },
  {
    slug: "best-ngo-for-education-advancement-nigeria",
    name: "Best NGO for Education Advancement — Nigeria",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "ngoadvancementngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best NGO for Education Advancement Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: NGO_SUBS,
  },
  {
    slug: "best-ngo-for-education-advancement-africa-regional",
    name: "Best NGO for Education Advancement — Africa Regional",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "ngoadvanceafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best NGO for Education Advancement Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: NGO_SUBS,
  },
  {
    slug: "best-stem-education-programme-africa-regional",
    name: "Best STEM Education Programme — Africa Regional",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "stemprogramafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best STEM Education Programme Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: STEM_SUBS,
  },
  {
    slug: "best-creative-arts-contribution-to-education-nigeria",
    name: "Best Creative Arts Contribution to Education — Nigeria",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "creativeartsngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best Creative Arts Contribution Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: CREATIVE_ARTS_SUBS,
  },
  {
    slug: "best-education-policy-implementation-state-nigeria",
    name: "Best Education Policy & Implementation State — Nigeria",
    family: "gold-blue-garnet",
    group: "Gold-Blue Garnet — Competitive Excellence",
    gmail: "edupolicystatenesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best Education Policy & Implementation State Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: POLICY_STATE_SUBS,
  },

  // ── Platinum — Institutional Leadership ───────────────────────────────
  {
    slug: "best-tertiary-institution-library-nigeria",
    name: "Best Tertiary Institution Library — Nigeria",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "tertiarylibraryngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Best Tertiary Institution Library Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: LIBRARY_SUBS,
  },
  {
    slug: "excellence-in-research-development-for-education-nigeria",
    name: "Excellence in Research & Development for Education — Nigeria",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "researchdevngnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in Research & Development Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: RD_SUBS,
  },
  {
    slug: "excellence-in-christian-education-impact-africa-regional",
    name: "Excellence in Christian Education Impact — Africa Regional",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "christianeduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in Christian Education Impact Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: FAITH_SUBS,
  },
  {
    slug: "excellence-in-islamic-education-impact-africa-regional",
    name: "Excellence in Islamic Education Impact — Africa Regional",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "islamiceduafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in Islamic Education Impact Africa Regional — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: FAITH_SUBS,
  },
  {
    slug: "excellence-in-political-leadership-for-education-nigeria",
    name: "Excellence in Political Leadership for Education — Nigeria",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "politicaledungnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in Political Leadership Nigeria — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: POLITICAL_SUBS,
  },
  {
    slug: "excellence-in-international-partnership-for-education-africa",
    name: "Excellence in International Partnership for Education — Africa",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "intlpartnerafricanesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in International Partnership Africa — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: INTL_PARTNER_SUBS,
  },
  {
    slug: "excellence-in-diaspora-educational-impact-international",
    name: "Excellence in Diaspora Educational Impact — International",
    family: "platinum",
    group: "Platinum — Institutional Leadership",
    gmail: "diasporaeduimpactnesa2026@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026 — Excellence in Diaspora Educational Impact International — Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    subcategories: PLATINUM_SUBS,
  },
];

export function getCategoryFormBySlug(
  slug: string,
): AwardCategoryForm | undefined {
  return AWARD_CATEGORY_FORMS.find((c) => c.slug === slug);
}

export function getCategoryFormsByFamily(
  family: string,
): AwardCategoryForm[] {
  return AWARD_CATEGORY_FORMS.filter((c) => c.family === family);
}
