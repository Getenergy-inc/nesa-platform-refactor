// Nominee types available across the 18 categories.

export type NomineeType =
  | "individual"
  | "public_figure"
  | "corporate_organisation"
  | "corporate_foundation"
  | "ngo"
  | "media_organisation"
  | "government"
  | "nigerian_state"
  | "research_institution"
  | "tertiary_library"
  | "faith_based"
  | "diaspora_association"
  | "international_partner"
  | "programme"
  | "edtech_organisation";

export const NOMINEE_TYPE_LABELS: Record<NomineeType, string> = {
  individual: "Individual",
  public_figure: "Public Figure",
  corporate_organisation: "Corporate Organisation",
  corporate_foundation: "Corporate Foundation",
  ngo: "NGO",
  media_organisation: "Media Organisation",
  government: "Government",
  nigerian_state: "Nigerian State",
  research_institution: "Research Institution",
  tertiary_library: "Tertiary Institution Library",
  faith_based: "Faith-Based Organisation",
  diaspora_association: "Diaspora Association",
  international_partner: "International Partner",
  programme: "Programme or Initiative",
  edtech_organisation: "EdTech Organisation",
};
