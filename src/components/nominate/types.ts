// Shared types for the new nominee-first nomination flow.
// Pure frontend state until backend storage is wired up.

export type NominationPathway =
  | "icon"
  | "gold-bluegarnet"
  | "platinum"
  | "influencer"
  | "special-needs-school";

export interface NomineeEntry {
  id: string; // local uuid
  pathway: NominationPathway;
  nomineeName: string;
  nomineeType: string;
  awardFamily: string;
  category: string;
  subcategory?: string;
  country: string;
  region: string;
  city?: string;
  organization?: string;
  contact?: string;
  website?: string;
  socialLinks?: string;
  biography?: string;
  impactSummary: string;
  reason: string;
  evidenceLinks?: string;
  consent: boolean;
}

export interface SubmitterIdentity {
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  countryOfOrigin: string;
  consent: boolean;
}

export type FlowStep =
  | "flash"
  | "pathway"
  | "entry"
  | "review"
  | "identity"
  | "auth"
  | "confirmation";

export interface FlowState {
  step: FlowStep;
  pathway: NominationPathway | null;
  entries: NomineeEntry[];
  editingId: string | null;
  submitter: SubmitterIdentity | null;
  preselect: {
    family?: string;
    category?: string;
    region?: string;
  };
}
