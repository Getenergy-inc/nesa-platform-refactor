// EduAid-Africa Journal — content-stream registry.
//
// The Journal is the quarterly impact, evidence and policy publication of
// EduAid-Africa. This file only declares STREAMS and their destinations.
// It never declares statistics, issues, webinar reports or policy columns —
// those must come from real data or render an honest empty state.

export const JOURNAL_ROUTE = "/journal";

export const JOURNAL_BRAND = {
  name: "EduAid-Africa Journal",
  tagline: "Documenting Education Impact. Advancing Africa's Education Agenda.",
  intro:
    "The official quarterly publication of EduAid-Africa. A living record of school interventions, project evidence, human stories, regional impact, and continental policy insights — supported by the global community of Friends of EduAid-Africa.",
  secondaryLine: "Impact Reports · Stories · Webinar Reports · Policy Columns · Data",
  cadence: "Quarterly",
} as const;

export interface JournalStream {
  id: string;
  title: string;
  description: string;
  href: string;
  /** true when the destination is a real, populated page elsewhere on the site. */
  live: boolean;
}

export const JOURNAL_STREAMS: JournalStream[] = [
  {
    id: "latest-issue",
    title: "Latest Issue",
    description: "The current quarterly edition of the Journal.",
    href: "#latest-issue",
    live: false,
  },
  {
    id: "impact-reports",
    title: "Impact Reports",
    description: "Verified intervention reporting against a fixed disclosure set.",
    href: "#impact-reports",
    live: true,
  },
  {
    id: "impact-stories",
    title: "Impact Stories",
    description: "School, teacher, learner and community stories from across Africa.",
    href: "/impact/stories",
    live: true,
  },
  {
    id: "school-transformation",
    title: "School Transformation",
    description: "Individual school records — need, intervention, delivery and outcome.",
    href: "#school-transformation",
    live: true,
  },
  {
    id: "regional-impact",
    title: "Regional Impact",
    description: "Interventions grouped across the 8 African regions and the Diaspora.",
    href: "/impact/regional",
    live: true,
  },
  {
    id: "webinar-reports",
    title: "Webinar Reports",
    description: "Written reports published after each EduAid-Africa webinar episode.",
    href: "#webinar-reports",
    live: false,
  },
  {
    id: "policy-columns",
    title: "Policy & White Paper Columns",
    description: "Continental education policy analysis and invited columns.",
    href: "#policy-columns",
    live: false,
  },
  {
    id: "friends",
    title: "Friends of EduAid-Africa",
    description: "The global movement funding and supporting education interventions.",
    href: "/impact/friends-of-eduaid-africa",
    live: true,
  },
  {
    id: "impact-data",
    title: "Education Impact Data",
    description: "Live programme figures read directly from verified records.",
    href: "#impact-data",
    live: true,
  },
  {
    id: "annual-review",
    title: "Annual Impact Review",
    description: "The consolidated year-end review of delivered education impact.",
    href: "#annual-review",
    live: false,
  },
];

/** How the Journal works — cadence and dual role. */
export const JOURNAL_HOW_IT_WORKS: { title: string; body: string }[] = [
  {
    title: "Quarterly cadence",
    body: "The Journal publishes four times a year. Each issue consolidates the interventions verified, stories documented and evidence gathered during that quarter — nothing is published ahead of verification.",
  },
  {
    title: "An operational impact record",
    body: "Every intervention is reported against the same disclosure set: funds received, allocation, intervention delivered, beneficiaries, location, status, evidence, outcomes and remaining needs.",
  },
  {
    title: "A continental white paper platform",
    body: "Alongside the operational record, the Journal carries policy columns and white papers on education access, inclusion, financing and quality across Africa — including invited contributions.",
  },
];

export const JOURNAL_CONTACT = {
  editorMailto: "mailto:journal@nesa.africa?subject=EduAid-Africa%20Journal%20—%20Editorial%20enquiry",
  columnMailto: "mailto:journal@nesa.africa?subject=EduAid-Africa%20Journal%20—%20Column%20submission",
  partnerHref: "/contact",
  webinarsHref: "/media/webinars",
} as const;
