// NESA-Africa 2026 Recognition Journey — single source of truth for the 12-phase
// continental roadmap. Used by the Timeline page and every "Voting Timeline" /
// "Recognition Timeline" section site-wide.

export type JourneyStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "live"
  | "registration_open"
  | "nomination_open"
  | "voting_open"
  | "closing_soon"
  | "closed";

export type JourneyTier = "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4" | "Cross-Tier" | "Legacy";

export interface JourneyCta {
  label: string;
  to: string;
}

export interface JourneyPhase {
  id: string;
  number: number;
  name: string;
  shortName: string;
  dateRange: string;
  /** ISO start date (UTC midnight) for countdowns and progress maths. */
  startsAt: string;
  /** ISO end date (UTC end-of-day) for countdowns and progress maths. */
  endsAt: string;
  status: JourneyStatus;
  tier?: JourneyTier;
  iconName: string;
  accent: "amber" | "blue" | "slate" | "yellow" | "emerald" | "violet" | "rose";
  purpose: string;
  description: string;
  participants?: string[];
  activities?: string[];
  categories?: string[];
  selection?: string;
  votingModel?: string;
  outcomes?: string[];
  programmes?: string[];
  ctas?: JourneyCta[];
}

export const RECOGNITION_JOURNEY_2026: JourneyPhase[] = [
  {
    id: "pre-nomination-activation",
    number: 1,
    name: "Public Pre-Nomination Activation",
    shortName: "Pre-Nomination Activation",
    dateRange: "1 July – 30 August 2026",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    status: "registration_open",
    tier: "Cross-Tier",
    iconName: "Megaphone",
    accent: "rose",
    purpose:
      "Launch the continental awareness campaign, introduce the four recognition tiers and prepare the public to nominate Education Enablers. Public nominations for all four tiers open on 30 August 2026.",
    description:
      "Activates public participation through storytelling, regional outreach, ambassador campaigns and educational content — uncovering outstanding people and organisations enabling Education for All across the Eight Africa Regions, the Diaspora and Friends of Africa.",
    participants: [
      "General Public",
      "Youth & Gen Z",
      "Schools & Universities",
      "NGOs",
      "Media",
      "Diaspora Communities",
      "Friends of Africa",
    ],
    activities: [
      "Weekly storytelling calendar",
      "Public graphics & short videos",
      "Regional campaigns",
      "Volunteer & sponsor mobilisation",
      "Ambassador activations",
    ],
    outcomes: ["High readiness for nominations", "Verified pipeline for official nominations"],
    ctas: [
      { label: "Join the Movement", to: "/volunteer" },
      { label: "Explore the Recognition Tiers", to: "/awards" },
    ],
  },
  {
    id: "nrc-member-onboarding",
    number: 2,
    name: "NRC Member Onboarding",
    shortName: "NRC Onboarding",
    dateRange: "1 – 28 August 2026",
    startsAt: "2026-08-01T00:00:00Z",
    endsAt: "2026-08-28T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Users",
    accent: "slate",
    purpose:
      "Onboard and train the Nominee Research Corps (NRC) responsible for verifying every nomination across all four recognition tiers.",
    description:
      "Members complete governance orientation, conflict-of-interest declarations, EDI Matrix training, evidence standards and Icon-relevant verification training before nominations open.",
    activities: [
      "Governance orientation",
      "Conflict of interest declarations",
      "EDI Matrix training",
      "Evidence & sourcing standards",
      "Digital platform training",
    ],
    participants: ["Nominee Research Corps", "Governance Council", "NRC Leadership"],
    outcomes: ["Verification corps ready before nominations open"],
    ctas: [{ label: "Visit the NRC Arena", to: "/nrc" }],
  },
  {
    id: "public-nominations-open",
    number: 3,
    name: "Public Nominations Open — All 4 Tiers",
    shortName: "Nominations Open",
    dateRange: "From 30 August 2026",
    startsAt: "2026-08-30T00:00:00Z",
    endsAt: "2026-11-14T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Sparkles",
    accent: "amber",
    purpose:
      "Open nominations simultaneously for Africa Education Icon, Gold-Blue Garnet, Platinum Recognition and Influencer Education Impact.",
    description:
      "Two distinct windows apply: Africa Education Icon closes early on 12 September 2026 so judges can complete their review, while Gold-Blue Garnet, Platinum Recognition and Influencer Education Impact stay open to 14 November 2026 — giving nominees time to request physical printed certificates before the Gala.",
    selection: "NRC verification · Independent judging for Icon only",
    outcomes: ["Steady flow of nominations across all four tiers"],
    ctas: [{ label: "Nominate an Enabler", to: "/nominate" }],
  },
  {
    id: "icon-nominations",
    number: 4,
    name: "Africa Education Icon Nominations",
    shortName: "Icon Nominations",
    dateRange: "30 August – 12 September 2026",
    startsAt: "2026-08-30T00:00:00Z",
    endsAt: "2026-09-12T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "Crown",
    accent: "amber",
    purpose:
      "Receive nominations for Africa's highest lifetime recognition — celebrating transformational Education Enablers whose contributions shaped African education between 2006 and 2026.",
    description:
      "A two-week nomination window across three Icon subcategories and three origin groups. Selection is by the independent Icon judges only — there is no public vote.",
    categories: [
      "Africa Education Philanthropy Icon",
      "Literary & New Curriculum Advocate Icon",
      "Africa Technical Educator Icon",
    ],
    selection: "Independent Icon Judges only · No public vote",
    outcomes: ["9 Icons recognised: 3 Residents · 3 Diaspora · 3 Friends of Africa"],
    ctas: [
      { label: "Nominate an Education Icon", to: "/nominate?tier=icon" },
      { label: "Explore the Hall of Fame", to: "/awards/africa-education-icon" },
    ],
  },
  {
    id: "tier234-nominations",
    number: 5,
    name: "Gold-Blue Garnet, Platinum & Influencer Nominations",
    shortName: "Tiers 2–4 Nominations",
    dateRange: "30 August – 14 November 2026",
    startsAt: "2026-08-30T00:00:00Z",
    endsAt: "2026-11-14T23:59:59Z",
    status: "upcoming",
    tier: "Tier 2",
    iconName: "Gem",
    accent: "blue",
    purpose:
      "Receive nominations for Gold-Blue Garnet, Platinum Recognition and Influencer Education Impact — all NRC-verified Certificates of Recognition.",
    description:
      "The extended window closes on 14 November 2026 so verified Enablers have time to request physical printed certificates ahead of the Recognition Gala. These tiers are recognition-based, not competitive contests.",
    selection: "NRC verification against the EDI Matrix · No public vote",
    outcomes: ["Verified Certificates of Recognition across three tiers"],
    ctas: [{ label: "Choose Your Category", to: "/nominate" }],
  },
  {
    id: "icon-judges-onboarding",
    number: 6,
    name: "Icon Judges' Onboarding & Calibration",
    shortName: "Judges Onboarding",
    dateRange: "12 – 25 September 2026",
    startsAt: "2026-09-12T00:00:00Z",
    endsAt: "2026-09-25T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "Users",
    accent: "slate",
    purpose:
      "Confirm the 27 Icon judges and calibrate them before any nominee data enters the Judges Arena.",
    description:
      "Conflict-of-interest declarations, rubric training and sample scoring take place in the Judges Arena with no live nominee data present.",
    activities: [
      "Confirm 27 judges",
      "Conflict of interest declarations",
      "Rubric training",
      "Sample scoring calibration",
    ],
    outcomes: ["Calibrated judging panel ready"],
    ctas: [{ label: "Meet the Judges", to: "/judges/directory" }],
  },
  {
    id: "nrc-icon-review",
    number: 7,
    name: "NRC Review of All Icon Nominees",
    shortName: "NRC Icon Review",
    dateRange: "13 – 26 September 2026",
    startsAt: "2026-09-13T00:00:00Z",
    endsAt: "2026-09-26T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "ShieldCheck",
    accent: "emerald",
    purpose:
      "Verify every Icon nomination and push assessment-ready dossiers into the Judges Arena.",
    description:
      "The Nominee Research Corps checks eligibility, evidence, citations and duplicate records before any nomination reaches a judge.",
    outcomes: ["Assessment-ready Icon pool in the Judges Arena"],
    ctas: [{ label: "How Verification Works", to: "/nrc" }],
  },
  {
    id: "gold-blue-garnet-verification",
    number: 8,
    name: "Gold-Blue Garnet NRC Verification (rolling)",
    shortName: "Gold-Blue Garnet Verification",
    dateRange: "16 September – 13 December 2026",
    startsAt: "2026-09-16T00:00:00Z",
    endsAt: "2026-12-13T23:59:59Z",
    status: "upcoming",
    tier: "Tier 2",
    iconName: "ShieldCheck",
    accent: "blue",
    purpose:
      "Verify Gold-Blue Garnet nominations on a rolling basis against the EDI Matrix and evidence standards.",
    description:
      "Verification runs continuously from 16 September through Gala day so Certificates of Recognition can be issued as nominations clear review. Platinum and Influencer Education Impact verification windows are not yet dated — see the Master Open Items List.",
    selection: "NRC verification only · No public vote",
    outcomes: ["NRC-verified Certificates of Recognition"],
    ctas: [{ label: "Explore Gold-Blue Garnet", to: "/awards/gold-blue-garnet" }],
  },
  {
    id: "judges-final-review",
    number: 9,
    name: "Judges' Final Review & Selection",
    shortName: "Icon Final Review",
    dateRange: "26 September – 31 October 2026",
    startsAt: "2026-09-26T00:00:00Z",
    endsAt: "2026-10-31T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "Gavel",
    accent: "amber",
    purpose:
      "All 27 judges deliberate, score and lock results across the 9 Africa Education Icon pathways (3 subcategories × 3 origin groups).",
    description:
      "Deliberation and scoring take place in the Judges Arena under full audit logging. All 9 Icon recipients are confirmed by 31 October 2026.",
    selection: "Independent Icon Judges · Locked per pathway",
    outcomes: ["All 9 Africa Education Icon recipients confirmed"],
    ctas: [{ label: "Judging Governance", to: "/governance" }],
  },
  {
    id: "final-verification-gala-production",
    number: 10,
    name: "Final Verification & Gala Production",
    shortName: "Gala Production",
    dateRange: "10 – 14 October 2026",
    startsAt: "2026-10-10T00:00:00Z",
    endsAt: "2026-10-14T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Clapperboard",
    accent: "violet",
    purpose:
      "Complete profiles, scripts and rehearsals for the Recognition Gala broadcast.",
    description:
      "Flagged open item: this production window precedes the 31 October Icon selection lock. The sequencing conflict has been referred to the production team and remains unresolved — it is published rather than silently corrected.",
    outcomes: ["Gala-ready programme (pending sequencing resolution)"],
    ctas: [{ label: "See the Master Timeline", to: "/timeline" }],
  },
  {
    id: "tv-showcases",
    number: 11,
    name: "TV Showcases — Icon, Influencer, Gold-Blue Garnet & Platinum",
    shortName: "TV Showcases",
    dateRange: "15 November & 1 December 2026",
    startsAt: "2026-11-15T00:00:00Z",
    endsAt: "2026-12-01T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Tv",
    accent: "yellow",
    purpose:
      "Present Africa Education Icon recipients and every NRC-verified Enabler to a continental television audience ahead of the Gala.",
    description:
      "TV Show 1 (15 November) presents the Icon recipients and Influencer Education Impact Certificates of Recognition. TV Show 2 (1 December) presents verified Gold-Blue Garnet and Platinum Recognition Enablers.",
    outcomes: ["Continental broadcast moments", "Gala momentum"],
    ctas: [{ label: "Watch on NESA-Africa TV", to: "/media" }],
  },
  {
    id: "recognition-gala",
    number: 12,
    name: "NESA-Africa 2026 Recognition Gala",
    shortName: "Recognition Gala",
    dateRange: "13 December 2026 · Lagos",
    startsAt: "2026-12-13T00:00:00Z",
    endsAt: "2026-12-13T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Trophy",
    accent: "yellow",
    purpose:
      "Honour the 9 Africa Education Icons and every NRC-verified Education Enabler across the four recognition tiers.",
    description:
      "A live continental broadcast bringing together honourees, sponsors, partners, judges, ambassadors and media — with TV Show 3 providing live Gala coverage on the same day.",
    activities: [
      "Recognition ceremony",
      "Hall of Fame induction",
      "Sponsor recognition",
      "Live media coverage",
      "Continental networking",
    ],
    outcomes: ["Recognition stage concluded"],
    ctas: [{ label: "Attend the Gala", to: "/media/gala" }],
  },
  {
    id: "impact-legacy",
    number: 13,
    name: "Recognition → Impact → Legacy",
    shortName: "Impact & Legacy",
    dateRange: "December 2026 – December 2027",
    startsAt: "2026-12-15T00:00:00Z",
    endsAt: "2027-12-13T23:59:59Z",
    status: "upcoming",
    tier: "Legacy",
    iconName: "Heart",
    accent: "emerald",
    purpose:
      "Recognition is only the beginning. NESA-Africa activates post-recognition programmes that convert visibility into measurable education impact.",
    description:
      "A 12-month continental impact phase across schools, scholarships, infrastructure, partnerships and storytelling — including Rebuild My School Africa 2027, whose special-needs school nominations open on 1 October 2026.",
    programmes: [
      "EduAid-Africa",
      "Rebuild My School Africa",
      "Afri-EduTourism",
      "Scholarships",
      "Special Needs School Interventions",
      "Strategic Partnerships",
      "Volunteer Engagement",
      "Education Webinars",
      "Annual Impact Reporting",
    ],
    ctas: [{ label: "See Our Impact Programmes", to: "/programs" }],
  },
];



export const STATUS_LABELS: Record<JourneyStatus, string> = {
  completed: "Completed",
  current: "In Progress",
  upcoming: "Upcoming",
  live: "Live",
  registration_open: "Registration Open",
  nomination_open: "Nomination Open",
  voting_open: "Voting Open",
  closing_soon: "Closing Soon",
  closed: "Closed",
};

/** Derive a runtime status from start/end dates. Falls back to authored status. */
export function computeLiveStatus(phase: JourneyPhase, now: Date = new Date()): JourneyStatus {
  const start = new Date(phase.startsAt).getTime();
  const end = new Date(phase.endsAt).getTime();
  const t = now.getTime();
  if (t < start) return phase.status === "registration_open" ? "registration_open" : "upcoming";
  if (t > end) return "closed";
  // active window
  if (phase.id.includes("voting")) return "voting_open";
  if (phase.id.includes("nomination")) return "nomination_open";
  if (phase.status === "registration_open") return "registration_open";
  return "current";
}

/** % progress through a phase window (0–100). */
export function phaseProgress(phase: JourneyPhase, now: Date = new Date()): number {
  const start = new Date(phase.startsAt).getTime();
  const end = new Date(phase.endsAt).getTime();
  const t = now.getTime();
  if (t <= start) return 0;
  if (t >= end) return 100;
  return Math.round(((t - start) / (end - start)) * 100);
}
