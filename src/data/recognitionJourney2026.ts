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
    dateRange: "1 – 30 July 2026",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-07-30T23:59:59Z",
    status: "registration_open",
    tier: "Cross-Tier",
    iconName: "Megaphone",
    accent: "rose",
    purpose:
      "Launch the continental public awareness campaign introducing NESA-Africa 2026 and preparing the public to nominate Education Enablers. Public Nominations for all 4 Recognition Tiers open on 1 August 2026.",
    description:
      "Activates public participation through social media storytelling, regional outreach, ambassador campaigns, educational content and pre-nomination forms — uncovering outstanding people and organisations enabling Education for All across Africa, the Diaspora and Friends of Africa. On 1 August 2026 public nominations open simultaneously for Africa Education Icon, Gold-Blue Garnet, Platinum Recognition and Influencer Education Impact.",
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
      "Community nominations",
      "Regional campaigns",
      "Ambassador activations",
    ],
    outcomes: [
      "Continental pre-nomination database",
      "Verified pipeline for official nominations",
    ],
    ctas: [
      { label: "Join the Movement", to: "/volunteer" },
      { label: "Submit a Pre-Nomination", to: "/nominate?stage=pre-nomination" },
    ],
  },
  {
    id: "jury-onboarding",
    number: 2,
    name: "Independent Jury Onboarding",
    shortName: "Jury Onboarding",
    dateRange: "29 June – 10 September 2026",
    startsAt: "2026-06-29T00:00:00Z",
    endsAt: "2026-09-10T23:59:59Z",
    status: "current",
    tier: "Cross-Tier",
    iconName: "Users",
    accent: "slate",
    purpose:
      "Prepare the independent judging panels responsible for maintaining the integrity of the recognition process.",
    description:
      "Selected jury members complete orientation, governance review, conflict-of-interest declarations, EDI matrix training, scoring calibration and confidentiality protocols on the NESA digital judging platform.",
    activities: [
      "Governance orientation",
      "Conflict of interest review",
      "Scoring framework calibration",
      "EDI matrix training",
      "Digital platform training",
      "Ethics & confidentiality",
    ],
    participants: ["Independent Jury", "Awards Council", "Governance Council", "NRC Leadership"],
    outcomes: ["Calibrated jury panels ready for scoring"],
    ctas: [{ label: "Meet the Judges", to: "/judges/directory" }],
  },
  {
    id: "icon-nominations",
    number: 3,
    name: "Africa Education Icon Nominations",
    shortName: "Icon Nominations",
    dateRange: "1 August – 12 September 2026",
    startsAt: "2026-08-01T00:00:00Z",
    endsAt: "2026-09-12T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "Crown",
    accent: "amber",
    purpose:
      "Receive nominations for Africa's highest lifetime recognition — celebrating transformational Education Enablers whose contributions have shaped African education over two decades (2006–2026).",
    description:
      "A two-month nomination window for lifetime achievement entries across three Icon of the Decade categories. Selection is by Independent Jury only — no public voting.",
    categories: [
      "Africa Education Philanthropy Icon",
      "Literary & New Curriculum Advocate Icon",
      "Africa Technical Educator Icon",
    ],
    selection: "Independent Jury only · No Public Voting",
    outcomes: ["9 Icons honoured: 3 Residents · 3 Diaspora · 3 Friends of Africa"],
    ctas: [
      { label: "Nominate an Education Icon", to: "/nominate?tier=icon" },
      { label: "Explore the Hall of Fame", to: "/awards/africa-education-icon" },
    ],
  },
  {
    id: "platinum-showcase",
    number: 4,
    name: "Platinum Recognition Showcase",
    shortName: "Platinum Showcase",
    dateRange: "7 August 2026",
    startsAt: "2026-08-07T00:00:00Z",
    endsAt: "2026-08-07T23:59:59Z",
    status: "upcoming",
    tier: "Tier 3",
    iconName: "Star",
    accent: "slate",
    purpose:
      "Celebrate governments, ministries, universities, libraries, faith-based organisations, international partners and institutional leaders enabling Education for All through policy, systems, leadership and long-term investment.",
    description:
      "The Platinum Recognition Showcase opens the public season with non-competitive institutional recognition verified by the NESA Nominee Research Corps (NRC).",
    selection: "Institutional Recognition · No Public Voting",
    outcomes: ["Continental visibility for institutional Education Enablers"],
    ctas: [{ label: "Explore Platinum Recognition", to: "/awards/platinum" }],
  },
  {
    id: "icon-showcase",
    number: 5,
    name: "Africa Education Icon Showcase",
    shortName: "Icon Showcase",
    dateRange: "21 August 2026",
    startsAt: "2026-08-21T00:00:00Z",
    endsAt: "2026-08-21T23:59:59Z",
    status: "upcoming",
    tier: "Tier 1",
    iconName: "Crown",
    accent: "amber",
    purpose:
      "Celebrate two decades of transformational leadership by highlighting outstanding Education Enablers whose legacy has shaped learning across Africa.",
    description:
      "A live continental broadcast honouring lifetime Icons from across the Eight Africa Regions, the Diaspora and Friends of Africa.",
    ctas: [{ label: "Explore the Hall of Fame", to: "/awards/africa-education-icon" }],
  },
  {
    id: "influencer-nominations-close",
    number: 6,
    name: "Influencer Education Impact Nominations Close",
    shortName: "Influencer Nominations Close",
    dateRange: "Close: 10 August 2026",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-10T23:59:59Z",
    status: "closing_soon",
    tier: "Tier 4",
    iconName: "Sparkles",
    accent: "yellow",
    purpose:
      "Receive nominations for sports icons, music icons and social media creators using their influence to advance Education for All.",
    description:
      "Final deadline for Influencer Education Impact Award entries before public voting opens.",
    categories: [
      "Social Media Education Champions",
      "Sports Icons Supporting Education",
      "Music Icons Supporting Education",
    ],
    ctas: [{ label: "Nominate an Influencer", to: "/nominate?tier=influencer" }],
  },
  {
    id: "influencer-voting",
    number: 7,
    name: "Influencer Education Impact Voting",
    shortName: "Influencer Voting",
    dateRange: "15 August – 15 September 2026",
    startsAt: "2026-08-15T00:00:00Z",
    endsAt: "2026-09-15T23:59:59Z",
    status: "upcoming",
    tier: "Tier 4",
    iconName: "Vote",
    accent: "yellow",
    purpose:
      "Enable the public to celebrate influential voices using their platforms to support education across Africa.",
    description:
      "A continent-wide public voting window powered 100% by AfriGold Coin (AGC) participation credits.",
    votingModel: "100% AfriGold Coin (AGC) Public Participation",
    ctas: [
      { label: "Explore Recognition", to: "/awards/gold-blue-garnet" },
      { label: "How AGC Works", to: "/earn-agc" },
    ],
  },
  {
    id: "influencer-winners-show",
    number: 8,
    name: "Influencer Education Impact Winners Show",
    shortName: "Influencer Winners Show",
    dateRange: "16 September 2026",
    startsAt: "2026-09-16T00:00:00Z",
    endsAt: "2026-09-16T23:59:59Z",
    status: "upcoming",
    tier: "Tier 4",
    iconName: "Tv",
    accent: "yellow",
    purpose:
      "Announce the winners of the Influencer Education Impact Award and officially launch the final continental campaign toward the Gold-Blue Garnet Awards Gala.",
    description:
      "Broadcast live on NESA-Africa TV, media partners and digital platforms — kicking off the Blue Garnet voting window.",
    outcomes: ["Live winners announcement", "Gold-Blue Garnet voting launch"],
    ctas: [{ label: "Watch on NESA-Africa TV", to: "/media" }],
  },
  {
    id: "momentum-phase",
    number: 9,
    name: "Continental Momentum Phase",
    shortName: "Momentum Phase",
    dateRange: "16 September – 15 October 2026",
    startsAt: "2026-09-16T00:00:00Z",
    endsAt: "2026-10-15T23:59:59Z",
    status: "upcoming",
    tier: "Cross-Tier",
    iconName: "Megaphone",
    accent: "violet",
    purpose:
      "Maintain continent-wide visibility through education storytelling, media campaigns, sponsor activations, webinars, regional events, volunteer mobilisation and strategic partnerships.",
    description:
      "A focused build-up phase that carries momentum from the Influencer Winners Show into the final stretch before the Gala.",
    activities: [
      "NESA TV programming",
      "Media interviews",
      "Sponsor campaigns",
      "Regional chapter events",
      "EduAid-Africa webinars",
      "Ambassador activities",
    ],
    ctas: [{ label: "Partner With Us", to: "/partners" }],
  },
  {
    id: "blue-garnet-voting",
    number: 10,
    name: "Gold-Blue Garnet Public Voting",
    shortName: "Gold-Blue Garnet Voting",
    dateRange: "16 September – 22 October 2026",
    startsAt: "2026-09-16T00:00:00Z",
    endsAt: "2026-10-22T23:59:59Z",
    status: "voting_open",
    tier: "Tier 2",
    iconName: "Gem",
    accent: "blue",
    purpose:
      "Determine the final Gold-Blue Garnet honourees through transparent, independently governed judging and verified public participation.",
    description:
      "The final competitive voting window — closes on Gala day for transparency and suspense.",
    votingModel: "60% Independent Jury · 40% Public Participation (AGC)",
    ctas: [
      { label: "Learn More", to: "/awards/gold-blue-garnet" },
      { label: "How Voting Works", to: "/vote/how-it-works" },
    ],
  },
  {
    id: "blue-garnet-gala",
    number: 11,
    name: "Gold-Blue Garnet Awards Gala",
    shortName: "Awards Gala",
    dateRange: "22 October 2026",
    startsAt: "2026-10-22T00:00:00Z",
    endsAt: "2026-10-22T23:59:59Z",
    status: "upcoming",
    tier: "Tier 2",
    iconName: "Trophy",
    accent: "blue",
    purpose:
      "Celebrate Africa's leading Education Enablers during the continent's flagship recognition ceremony.",
    description:
      "A live continental broadcast bringing together honourees, sponsors, partners, judges, ambassadors and media for Africa's flagship education recognition moment.",
    activities: [
      "Recognition ceremony",
      "Media coverage",
      "Sponsor recognition",
      "Hall of Fame induction",
      "Continental networking",
      "Education impact announcements",
    ],
    ctas: [{ label: "Attend the Gala", to: "/media/gala" }],
  },
  {
    id: "impact-legacy",
    number: 12,
    name: "Recognition → Impact → Legacy",
    shortName: "Impact & Legacy",
    dateRange: "October 2026 – October 2027",
    startsAt: "2026-10-23T00:00:00Z",
    endsAt: "2027-10-22T23:59:59Z",
    status: "upcoming",
    tier: "Legacy",
    iconName: "Heart",
    accent: "emerald",
    purpose:
      "Recognition is only the beginning. NESA-Africa activates post-recognition programmes that transform visibility into measurable education impact.",
    description:
      "A 12-month continental impact phase translating recognition into action across schools, scholarships, infrastructure, partnerships and storytelling.",
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
  {
    id: "media-continuous-engagement",
    number: 13,
    name: "Continuous Media & EduAid-Africa Engagement",
    shortName: "Media & Webinar Engagement",
    dateRange: "July – October 2026 (parallel operational track)",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-10-22T23:59:59Z",
    status: "current",
    tier: "Cross-Tier",
    iconName: "Tv",
    accent: "blue",
    purpose:
      "Sustain continental momentum between milestones through a Media Department operational calendar — a 7-week EduAid-Africa Webinar Series (thematic focus group discussions uniting award categories), weekly news, TV programming and daily social engagement that mobilises nominees, sponsors, partners, volunteers and the general public.",
    description:
      "Runs alongside the 12-phase Recognition Journey as the continuous engagement layer. Each Tuesday webinar convenes the award categories under a shared weekly theme so that nominees, judges, sponsors and audiences co-create the collaborative strategy, momentum and endorsement narrative for that theme. Weekly news, focus group discussions, regional TV reports, NESA-Africa TV Live and daily social sessions maintain visibility from launch through the Awards Gala.",
    participants: [
      "Media Team & TV Presenters",
      "Nominees & Award Categories",
      "Judges & Category Chairs",
      "Sponsors & Partners",
      "Volunteers & Ambassadors",
      "Diaspora & Friends of Africa",
      "General Public",
    ],
    activities: [
      "EduAid-Africa Webinar Series — every Tuesday, 3 August – 15 September 2026 (7 thematic weeks uniting award categories via focus group discussions)",
      "EduAid Focus Group Discussions — weekly (August – September 2026) for nominee engagement and stakeholder dialogue",
      "NESA-Africa Weekly News — every Friday (July – October 2026) covering the entire recognition campaign",
      "Regional TV Reports — weekly across all eight African regions, Diaspora and Friends of Africa",
      "NESA-Africa TV Live — daily during major events (recognition shows, voting campaigns, Awards Gala)",
      "Social Media Live Sessions — daily public engagement, nominee spotlights and countdowns",
    ],
    outcomes: [
      "Collaborative strategy across award categories per weekly theme",
      "Sustained momentum, endorsements and sponsor activation",
      "Continental storytelling archive for the Media Team",
      "Higher nominee visibility and public voting turnout",
    ],
    ctas: [
      { label: "Watch the Webinar Series", to: "/media/webinars" },
      { label: "Explore the Media Hub", to: "/media" },
    ],
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
