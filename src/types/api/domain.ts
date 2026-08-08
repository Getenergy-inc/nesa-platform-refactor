/**
 * Domain types shared between the frontend client and the Express backend
 * contract. Keep these in sync with docs/openapi.yaml.
 */
import type { Id } from "./common";

export type NomineeType = "INDIVIDUAL" | "ORGANIZATION" | "COMPANY" | "PARTNER" | "INSTITUTION";

/**
 * Africa Education Icon Lifetime Achievement Award (2006–2026) nominee
 * recognition classes. Locked to these three by governance.
 * Source of truth: src/config/nomination/iconTaxonomy.ts
 */
export type IconNomineeType =
  | "Africans in Africa"
  | "Diaspora Africans"
  | "Friends of Africa";

/**
 * The 3 audit-aligned Icon of the Decade categories. Jury-only pathway.
 */
export type IconCategoryName =
  | "Literary & New Curriculum Advocate Icon of the Decade"
  | "Africa Technical Educator Icon of the Decade"
  | "Africa Education Philanthropy Icon of the Decade";

export type NominationStatus =
  | "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "INFO_REQUESTED"
  | "APPROVED" | "REJECTED" | "WITHDRAWN";

export type Category = {
  id: Id;
  slug: string;
  name: string;
  description?: string;
  type?: string;
  seasonId?: Id;
  isPublic: boolean;
  subcategoryCount?: number;
};

export type CreateNominationPayload = {
  categoryId: Id;
  nomineeType: NomineeType;
  nomineeName: string;
  nomineeEmail?: string;
  country: string;
  region: string;
  summary: string;
  impactStatement: string;
};

export type Nomination = CreateNominationPayload & {
  id: Id;
  status: NominationStatus;
  createdAt: string;
  updatedAt: string;
};

export type Nominee = {
  id: Id;
  slug: string;
  name: string;
  type: NomineeType;
  category?: Pick<Category, "id" | "slug" | "name">;
  country?: string;
  region?: string;
  imageUrl?: string | null;
};

export type EvidenceFile = {
  id: Id;
  nominationId: Id;
  fileType: string;
  url: string;
  caption?: string;
  verified: boolean;
  createdAt: string;
};

export type JudgeAssignment = {
  id: Id;
  nominationId: Id;
  judgeId: Id;
  status: "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "RECUSED";
  dueAt?: string;
};

export type JudgeScorePayload = {
  assignmentId: Id;
  nominationId: Id;
  scores: Array<{ criterion: string; score: number }>;
  comments?: string;
};

export type CastVotePayload = {
  nomineeId: Id;
  categoryId: Id;
  voterEmail?: string;
};

export type VoteReceipt = {
  id: Id;
  nomineeId: Id;
  categoryId: Id;
  createdAt: string;
  receiptCode: string;
};

export type InitializePaymentPayload = {
  purpose: "TICKET_PURCHASE" | "SPONSORSHIP" | "DONATION" | "NOMINATION_FEE";
  referenceId: string;
  amount: number;
  currency: string;
  email: string;
};

export type PaymentInit = {
  reference: string;
  authorizationUrl: string;
  provider: string;
};
