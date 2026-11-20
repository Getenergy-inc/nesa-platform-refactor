/** Public actions shared by navigation, page CTAs and regression tests. */
export const PUBLIC_ACTIONS_2026 = {
  nominate: {
    label: "Submit a Nomination",
    href: "/nominate",
    external: false,
  },
  exploreAwards: { label: "Explore Recognition", href: "/recognition", external: false },
  recognitionProcess: { label: "How Recognition Works →", href: "/how-it-works", external: false },
  onlineGala: { label: "Receive Programme Updates", href: "/programme/2026#updates", external: false },
  supportEducation: { label: "Support Education", href: "/donate", external: false },
} as const;

/** SCEF must supply these destinations; never substitute a local form or payment URL. */
export const SCEF_FORM_REQUIRED = {
  contact: "SCEF contact Google Form URL",
  donation: "SCEF donation-enquiry Google Form URL",
  sponsorship: "SCEF sponsorship-enquiry Google Form URL",
} as const;
