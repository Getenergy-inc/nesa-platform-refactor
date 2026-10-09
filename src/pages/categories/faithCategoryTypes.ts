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
  /**
   * Hard-coded UUID. May be null when the backend row does not exist yet —
   * the page will then attempt to resolve a live UUID via `slug` at runtime.
   */
  uuid: string | null;
  /**
   * Canonical `public.subcategories.slug`. When present, the page resolves
   * the live UUID at runtime so nominations enable automatically as soon as
   * the backend row is created (no code change required).
   */
  slug?: string;
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
