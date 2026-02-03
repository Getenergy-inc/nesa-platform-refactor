/**
 * Enriched Nominee Profile Types
 * Comprehensive data for nominee profiles with contributions, social links, and sources
 */

export type NomineeProfileKind = "person" | "organization";

export interface NomineeSource {
  url: string;
  title: string;
  publisher: string;
  publishedDate?: string;
  accessedAt: string;
  usedFor: string[];
}

export interface NomineeImage {
  imageUrl: string;
  type: "photo" | "logo";
  sourceUrl?: string;
  license?: string;
  approved: boolean;
}

export interface NomineeSocialLinks {
  website?: string;
  linkedin?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface EnrichedNomineeProfile {
  /** Unique slug key matching CSV-derived nominee */
  nomineeSlug: string;
  
  /** Classification: person or organization */
  kind: NomineeProfileKind;
  
  /** Data validity date for 2025 season */
  asOfDate: string;
  
  /** 150-250 word summary focusing on education contributions */
  summary_2025: string;
  
  /** 3-6 bullet points of measurable contributions */
  education_for_all_contributions: string[];
  
  /** Short highlights for quick display */
  highlights: string[];
  
  /** Social media and website links */
  social_links: NomineeSocialLinks;
  
  /** Image data with approval status */
  image: NomineeImage;
  
  /** Citation sources for generated content */
  sources: NomineeSource[];
  
  /** Approval status: draft, pending_review, approved, rejected */
  status: "draft" | "pending_review" | "approved" | "rejected";
  
  /** Timestamp of last generation/update */
  lastGeneratedAt: string;
  
  /** Admin notes for internal use */
  notes?: string;
}

/** Partial profile for saving drafts */
export type PartialEnrichedProfile = Partial<EnrichedNomineeProfile> & {
  nomineeSlug: string;
};

/** Storage format for all profiles */
export type NomineeProfilesStore = Record<string, EnrichedNomineeProfile>;

/** Default empty profile template */
export const createEmptyProfile = (nomineeSlug: string, kind: NomineeProfileKind = "person"): EnrichedNomineeProfile => ({
  nomineeSlug,
  kind,
  asOfDate: new Date().toISOString().split("T")[0],
  summary_2025: "",
  education_for_all_contributions: [],
  highlights: [],
  social_links: {},
  image: {
    imageUrl: "/images/placeholder.svg",
    type: kind === "organization" ? "logo" : "photo",
    approved: false,
  },
  sources: [],
  status: "draft",
  lastGeneratedAt: new Date().toISOString(),
});
