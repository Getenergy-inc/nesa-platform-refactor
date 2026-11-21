import type { ContactEnquiryType } from "./contactEnquiries";
import { SNS_CATEGORIES, SNS_REGIONS } from "./schoolSupport";

export type InterestKind = "involved" | "school" | "reminder" | "scholarships" | "offers" | "edutourism" | "academy" | "items";
export type InterestField = { name: string; label: string; type?: "text" | "number" | "date" | "email"; options?: readonly string[]; multiple?: boolean; optional?: boolean };
const regions = SNS_REGIONS.map(r => r.name);
const categories = SNS_CATEGORIES.slice(0, 8).map(c => c.title);
export const INTEREST_FORMS: Record<InterestKind, { name: string; topic: ContactEnquiryType; fields: InterestField[] }> = {
  involved: { name: "Get involved registration", topic: "School support", fields: [{ name: "interests", label: "Interests", options: ["Nominate", "Vote", "Donate", "Volunteer", "Partner", "Academy"], multiple: true }] },
  school: { name: "School nomination", topic: "School support", fields: [{ name: "school", label: "School name" }, { name: "schoolCountry", label: "School country" }, { name: "region", label: "Region", options: regions }, { name: "principal", label: "Principal category", options: categories }, { name: "otherCategories", label: "Other categories", options: categories, multiple: true, optional: true }, { name: "schoolContact", label: "School adult contact name" }, { name: "schoolEmail", label: "School contact email", type: "email" }] },
  reminder: { name: "Voting reminder request", topic: "School support", fields: [] },
  scholarships: { name: "Scholarships and school fees pledge", topic: "School support", fields: [{ name: "level", label: "Education level" }, { name: "region", label: "Region", options: regions }, { name: "amount", label: "Amount and currency" }] },
  offers: { name: "Support offer", topic: "School support", fields: [{ name: "offer", label: "Support type", options: ["Equipment", "Expertise", "Volunteering", "Renovation"] }, { name: "region", label: "Region", options: regions }, { name: "availability", label: "Availability" }] },
  edutourism: { name: "EduTourism interest", topic: "General enquiry", fields: [{ name: "destination", label: "Country of interest" }, { name: "from", label: "Preferred start date", type: "date" }, { name: "until", label: "Preferred end date", type: "date" }, { name: "group", label: "Group size", type: "number" }] },
  academy: { name: "Academy interest", topic: "General enquiry", fields: [{ name: "course", label: "Course interest", options: ["Special-needs education teacher training", "Webinars and podcast learning", "Youth digital and AI skills", "Volunteer, chapter, NRRC and judge training"] }, { name: "role", label: "Your role" }] },
  items: { name: "Item donation offer", topic: "Donation", fields: [{ name: "item", label: "Item or equipment offered" }, { name: "region", label: "Region", options: regions }, { name: "category", label: "Category", options: categories }] },
};

export function participationMessage(kind: InterestKind, values: Record<string, string>): string {
  const form = INTEREST_FORMS[kind];
  return [`${form.name} — NESA-Africa website`, ...form.fields.map(field => `${field.label}: ${values[field.name] || "Not supplied"}`)].join("\n");
}