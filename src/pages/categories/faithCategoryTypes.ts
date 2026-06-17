// Shared types for faith-based Africa Regional category pages
// (Islamic Education Impact + Christian Education Impact)

export type FaithNominee = {
  name: string;
  /** Generic institution description shown while in Pending Verification. */
  desc: string;
  /** Organisation-level contact ONLY. Never a personal-format email. */
  email: string;
};

export type NomineeWorkflowState =
  | "pending_verification"
  | "accepted"
  | "profile_complete";

export type FaithSubcategory = {
  title: string;
  description: string;
  /** UUID for /nominate?subcategory=...; null = "Nominations opening soon". */
  uuid: string | null;
  tabKey: "infrastructure" | "scholarship" | "holistic" | "advocacy";
};

export type FaithEdiRow = {
  area: string;
  score: number;
  what: string;
};

export type FaithCategoryConfig = {
  faith: "islamic" | "christian";
  routePath: string;
  pageTitle: string;
  pageSubheading: string;
  primaryNominateUuid: string;
  subcategories: FaithSubcategory[];
  overviewParagraphs: string[];
  whoQualifies: string[];
  ediTable: FaithEdiRow[];
  evidenceNote: string;
  recognitionPackage: string[];
  faqEvidence: string;
  tabs: Record<FaithSubcategory["tabKey"], FaithNominee[]>;
};
