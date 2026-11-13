import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";

/** Public actions shared by navigation, page CTAs and regression tests. */
export const PUBLIC_ACTIONS_2026 = {
  nominate: {
    label: "Submit a Nomination",
    href: OFFICIAL_NOMINATION_FORM_URL,
    external: true,
  },
  exploreAwards: { label: "Explore the Awards", href: "/awards", external: false },
  recognitionProcess: { label: "How Recognition Works →", href: "/about/how-it-works", external: false },
  onlineGala: { label: "Explore the Online Awards Gala", href: "/programme-2026", external: false },
  supportEducation: { label: "Support Education", href: "/eduaid-africa", external: false },
} as const;

/** SCEF must supply these destinations; never substitute a local form or payment URL. */
export const SCEF_FORM_REQUIRED = {
  contact: "SCEF contact Google Form URL",
  donation: "SCEF donation-enquiry Google Form URL",
  sponsorship: "SCEF sponsorship-enquiry Google Form URL",
} as const;
