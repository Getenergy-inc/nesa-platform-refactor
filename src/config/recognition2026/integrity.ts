// Shared integrity + FAQs applied to every 2026 category page.

export const INTEGRITY_NOTICE_2026 =
  "NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, Gala tickets, merchandise, endorsements, GFAwzip Wallet transactions, AGC Participation Credits, follower numbers and public popularity do not influence verification or recognition.";

export interface FAQ {
  q: string;
  a: string;
}

export const STANDARD_FAQS: FAQ[] = [
  { q: "Who may nominate?", a: "Any verified user, institution, chapter or partner may submit a nomination through this platform." },
  { q: "Is self-nomination allowed?", a: "Yes, self-nomination is permitted but subject to the same verification, evidence and governance rules as third-party nominations." },
  { q: "How many nominees may I submit?", a: "There is no limit — you may submit as many nominations as you can support with verifiable evidence." },
  { q: "Can the same nominee receive several nominations?", a: "Yes. Multiple nominations for the same nominee are consolidated into one master nominee profile and treated as supporting endorsements." },
  { q: "What evidence is required?", a: "Category-specific evidence is listed on this page. Nominations without the required evidence cannot be advanced by the NRC." },
  { q: "How are duplicate nominations handled?", a: "The system detects duplicates automatically and links them to the canonical nominee profile. No nomination is deleted." },
  { q: "Does nomination guarantee recognition?", a: "No. Nomination is the first step. Recognition follows verification and governance approval." },
  { q: "When do nominations close?", a: "Public nominations for all four tiers close on 12 September 2026 unless extended by governance notice." },
  { q: "What happens after submission?", a: "You receive a reference number. The nominee is invited to accept, complete their profile and submit supporting evidence. The NRC then verifies the record." },
];
