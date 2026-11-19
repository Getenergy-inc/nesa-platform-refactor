import { supabase } from "@/integrations/supabase/client";
import { CONTACT_ENQUIRY_TYPES, type ContactEnquiryType } from "@/config/contactEnquiries";

export interface ContactEnquiryInput {
  name: string;
  email: string;
  organisation?: string;
  enquiry_type: ContactEnquiryType;
  country: string;
  phone?: string;
  preferred_contact: "Email" | "Phone" | "Either";
  subject: string;
  message: string;
  related_reference?: string;
  consent: boolean;
  website?: string;
}

export function makeContactReference(now = new Date()): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `NESA-${now.getUTCFullYear()}-${random}`;
}

export async function submitContactEnquiry(input: ContactEnquiryInput): Promise<string> {
  if (input.website) throw new Error("We could not submit your enquiry. Please try again.");
  if (!input.consent) throw new Error("Please confirm that we may record and review your enquiry.");
  if (!CONTACT_ENQUIRY_TYPES.includes(input.enquiry_type)) throw new Error("Please select a valid enquiry type.");
  if (input.name.trim().length < 2) throw new Error("Please enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(input.email)) throw new Error("Please enter a valid email address.");
  if (input.country.trim().length < 2) throw new Error("Please enter your country.");
  if (input.subject.trim().length < 3) throw new Error("Please enter a subject.");
  if (input.message.trim().length < 20) throw new Error("Please provide at least 20 characters so the team can route your enquiry.");
  if (input.message.length > 5000) throw new Error("Please keep your message under 5,000 characters.");

  const reference = makeContactReference();
  const { error } = await supabase.from("contact_enquiries").insert({
    reference,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    organisation: input.organisation?.trim() || null,
    enquiry_type: input.enquiry_type,
    country: input.country.trim(),
    phone: input.phone?.trim() || null,
    preferred_contact: input.preferred_contact,
    subject: input.subject.trim(),
    message: input.message.trim(),
    related_reference: input.related_reference?.trim() || null,
    consent: true,
    status: "new",
  } as never);
  if (error) throw new Error("We could not save your enquiry. Please try again without including sensitive documents or financial details.");
  return reference;
}
