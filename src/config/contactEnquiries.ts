export const CONTACT_ENQUIRY_TYPES = [
  "General enquiry",
  "Nomination help",
  "Nominee acceptance",
  "Evidence submission",
  "Correction or update",
  "Consent or privacy",
  "NRRC or judging",
  "Certificates",
  "Online programme",
  "Media or podcast",
  "Volunteering",
  "Local chapters",
  "Partnership",
  "Sponsorship",
  "Donation",
  "Merchandise",
  "School support",
  "Technical support",
] as const;

export type ContactEnquiryType = (typeof CONTACT_ENQUIRY_TYPES)[number];

/** Public labels map to existing values; historical enquiries stay unchanged. */
export const PUBLIC_CONTACT_TOPICS: ReadonlyArray<{ label: string; value: ContactEnquiryType }> = [
  { label: "Nomination", value: "Nomination help" },
  { label: "School support", value: "School support" },
  { label: "Partnership", value: "Partnership" },
  { label: "Media", value: "Media or podcast" },
  { label: "Correction", value: "Correction or update" },
  { label: "Other", value: "General enquiry" },
];

export const CONTACT_SUBJECT_PREFILLS: Record<string, ContactEnquiryType> = {
  merchandise: "Merchandise",
  "afri-edutourism": "General enquiry",
  media: "Media or podcast",
  nomination: "Nomination help",
  acceptance: "Nominee acceptance",
  evidence: "Evidence submission",
  correction: "Correction or update",
  privacy: "Consent or privacy",
  judging: "NRRC or judging",
  certificates: "Certificates",
  programme: "Online programme",
  volunteer: "Volunteering",
  chapter: "Local chapters",
  partnership: "Partnership",
  sponsorship: "Sponsorship",
  donation: "Donation",
  "school-support": "School support",
  technical: "Technical support",
  other: "General enquiry",
  "school support": "School support",
};

export const CONTACT_ENQUIRY_STATUSES = ["new", "in_progress", "waiting_for_sender", "resolved", "closed"] as const;
