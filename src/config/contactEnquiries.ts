export const CONTACT_ENQUIRY_TYPES = [
  "Nomination assistance",
  "Nominee acceptance",
  "Consent",
  "Profile correction",
  "Evidence submission",
  "NRRC support",
  "Judges Arena support",
  "Volunteer",
  "Chapter",
  "Partnership",
  "Sponsorship",
  "Donation",
  "Merchandise",
  "EduAid-Africa programme",
  "Special-needs school support",
  "Media",
  "Privacy request",
  "Safeguarding concern",
  "Technical support",
  "General enquiry",
] as const;

export type ContactEnquiryType = (typeof CONTACT_ENQUIRY_TYPES)[number];

export const CONTACT_SUBJECT_PREFILLS: Record<string, ContactEnquiryType> = {
  general: "General enquiry",
  merchandise: "Merchandise",
  "afri-edutourism": "General enquiry",
  media: "Media",
  nomination: "Nomination assistance",
  acceptance: "Nominee acceptance",
  evidence: "Evidence submission",
  correction: "Profile correction",
  privacy: "Privacy request",
  consent: "Consent",
  judging: "Judges Arena support",
  nrrc: "NRRC support",
  certificates: "General enquiry",
  programme: "General enquiry",
  volunteer: "Volunteer",
  chapter: "Chapter",
  partnership: "Partnership",
  sponsorship: "Sponsorship",
  donation: "Donation",
  "school-support": "Special-needs school support",
  "eduaid-programme": "EduAid-Africa programme",
  safeguarding: "Safeguarding concern",
  technical: "Technical support",
};

export const CONTACT_SUBJECT_LABELS: Record<string, string> = {
  merchandise: "Merchandise enquiry",
  "afri-edutourism": "Afri-EduTourism mission",
  certificates: "Certificates enquiry",
  programme: "Online programme enquiry",
};

export const CONTACT_ENQUIRY_STATUSES = ["new", "in_progress", "waiting_for_sender", "resolved", "closed"] as const;
