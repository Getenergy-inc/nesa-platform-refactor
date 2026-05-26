export type CategoryGroup =
  | "blue_garnet"
  | "platinum"
  | "icon"
  | "influencers"
  | "special_recognition";

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface AwardCategoryConfig {
  /** kebab-case slug used in the URL */
  slug: string;
  /** Final canonical category name */
  finalName: string;
  /** Group bucket */
  group: CategoryGroup;
  /** Final canonical URL */
  url: string;
  /** Parent index URL */
  parentPage: string;
  /** Short marketing description */
  shortDescription: string;
  /** Eligibility one-liner */
  eligibilitySummary: string;
  /** Who can be nominated */
  whoCanBeNominated: string;
  /** Who can submit nominations */
  whoCanNominate: string;
  /** Required evidence bullets */
  requiredEvidence: string[];
  /** Review / selection method */
  reviewMethod: string;
  /** Voting role: "public" | "none" | "advisory" */
  votingRole: string;
  /** Judging role */
  judgingRole: string;
  /** CTA link for nomination — auto-resolves to /nominate?category=<slug> if omitted */
  ctaNominateHref?: string;
  /** Related slugs */
  relatedCategories: string[];
  /** SEO */
  seoTitle: string;
  metaDescription: string;
  /** FAQs (8 standard questions) */
  faqs: CategoryFaq[];
  /** Optional override of existing rich page component to render above the metadata panel */
  legacyComponentKey?: string;
  /** Merged from legacy URLs (used for redirect generation + documentation) */
  mergedFrom?: string[];
}

export const GROUP_META: Record<
  CategoryGroup,
  { label: string; indexUrl: string; tagline: string; tone: string }
> = {
  blue_garnet: {
    label: "Blue Garnet Award Categories",
    indexUrl: "/awards/blue-garnet-categories",
    tagline: "Competitive, voting-enabled awards across NGO, CSR, EduTech, STEM, Media, Creative Arts and State leadership.",
    tone: "Public voting + jury review",
  },
  platinum: {
    label: "Platinum Certificate Categories",
    indexUrl: "/awards/platinum-certificate-categories",
    tagline: "Elite institutional recognition decided by jury review — no public vote.",
    tone: "Jury-only",
  },
  icon: {
    label: "Africa Education Icon Lifetime Achievement (2006–2026)",
    indexUrl: "/awards/africa-education-icon",
    tagline: "Hall-of-fame lifetime recognition for two decades of measurable continental impact.",
    tone: "By invitation",
  },
  influencers: {
    label: "Influencers Education Impact 2026",
    indexUrl: "/awards/influencers-education-impact",
    tagline: "Sports, music, and social media voices using their platforms to advance African education.",
    tone: "Jury review + public engagement",
  },
  special_recognition: {
    label: "Special Recognition / Legacy",
    indexUrl: "/awards/categories#special-recognition",
    tagline: "Honourable mentions, partner recognitions and legacy citations.",
    tone: "Editorial",
  },
};
