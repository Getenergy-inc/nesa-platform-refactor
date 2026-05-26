import type { AwardCategoryConfig } from "./types";
import { buildStandardFaqs } from "./faqBuilder";

export const ICON_CATEGORY: AwardCategoryConfig = {
  slug: "africa-education-icon",
  finalName: "Africa Education Icon Lifetime Achievement Award (2006–2026)",
  group: "icon",
  url: "/awards/africa-education-icon",
  parentPage: "/awards/categories",
  shortDescription:
    "Hall-of-fame lifetime recognition for individuals whose two decades of work have shaped African education.",
  eligibilitySummary:
    "Individuals with at least 15 years of documented, continent-relevant contribution to African education.",
  whoCanBeNominated: "Educators, philanthropists, founders, advocates and policy leaders meeting the lifetime threshold.",
  whoCanNominate:
    "By invitation. The NESA-Africa secretariat may invite nominations from peers, institutions and the public; all entries are vetted.",
  requiredEvidence: [
    "Long-form biography with citations",
    "Documented body of work spanning 15+ years",
    "Independent third-party endorsements",
    "Verifiable impact references",
  ],
  reviewMethod:
    "Secretariat invitation → NRC verification → Icon jury review (with integrity check) → governance ratification.",
  votingRole: "No public voting.",
  judgingRole: "Dedicated Icon jury + governance ratification.",
  relatedCategories: [],
  seoTitle: "Africa Education Icon Lifetime Achievement 2006–2026 | NESA-Africa",
  metaDescription:
    "The hall-of-fame lifetime recognition for individuals whose 15+ years of work have shaped African education.",
  faqs: buildStandardFaqs({
    eligibility: "Individuals with 15+ years of documented continent-relevant contribution to African education.",
    whoCanNominate: "By invitation only. Secretariat invites peer, institutional and public nominations.",
    evidence: "Biography with citations, 15+ years body of work, independent endorsements, verifiable impact references.",
    publicVoting: "No. The Icon Award is decided by jury and governance review, not public vote.",
    review: "Secretariat invitation, NRC verification, Icon jury review with integrity check, then governance ratification.",
    announcement:
      "Icon laureates are revealed at the NESA-Africa 2026 Gala alongside a published honour roll covering 2006–2026.",
  }),
  legacyComponentKey: "AfricaEducationIcon",
  mergedFrom: ["/categories/africa-icon", "/awards/icon-award", "/awards/icon", "/category/africa-education-icon"],
};
