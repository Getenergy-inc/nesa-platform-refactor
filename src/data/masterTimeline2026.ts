// NESA-Africa & EduAid-Africa 2026 Master Timeline
// 1 July – 22 October 2026 — updated per official notice:
// PUBLIC NOMINATIONS FOR ALL 4 TIERS OPEN 1 AUGUST 2026.
// Source of truth for the Timeline page master calendar, homepage
// public notice banner and any dated milestone lookups site-wide.

export type MasterTimelineTrack =
  | "activation"
  | "nominations"
  | "webinar"
  | "podcast"
  | "judging"
  | "showcase"
  | "gala"
  | "news";

export interface MasterTimelineEntry {
  id: string;
  dateLabel: string;
  /** ISO start date used for sorting and countdowns. */
  startsAt: string;
  /** Optional ISO end for ranged milestones. */
  endsAt?: string;
  milestone: string;
  activity: string;
  outcome: string;
  track: MasterTimelineTrack;
  href?: string;
  highlight?: boolean;
}

export const MASTER_TIMELINE_PUBLIC_NOTICE = {
  title: "Public Nominations for All 4 Recognition Tiers Open 1 August 2026",
  body: "Africa Education Icon · Gold-Blue Garnet · Platinum Recognition · Influencer Education Impact. Nominate an Enabler of Education for All Across Africa.",
  effectiveDate: "2026-08-01T00:00:00Z",
  ctaLabel: "Nominate Now",
  ctaHref: "/nominate",
} as const;

export const MASTER_TIMELINE_2026: MasterTimelineEntry[] = [
  {
    id: "pre-launch",
    dateLabel: "1 – 31 July 2026",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-07-31T23:59:59Z",
    milestone: "Pre-Launch Public Activation",
    activity:
      "Build awareness, introduce the four recognition tiers, mobilise media, volunteers, sponsors and partners.",
    outcome: "High readiness for nominations",
    track: "activation",
    href: "/about/timeline",
  },
  {
    id: "public-nominations-open",
    dateLabel: "From 1 August 2026",
    startsAt: "2026-08-01T00:00:00Z",
    milestone: "Public Nominations Open for All 4 Tiers",
    activity:
      "Nominations open for Africa Education Icon, Gold-Blue Garnet, Platinum and Influencer Education Impact.",
    outcome: "Steady flow of nominations begins",
    track: "nominations",
    href: "/nominate",
    highlight: true,
  },
  {
    id: "weekly-news",
    dateLabel: "From Friday, 7 August 2026",
    startsAt: "2026-08-07T00:00:00Z",
    milestone: "Weekly NESA-Africa News",
    activity:
      "Weekly updates on nominations, Enablers, partners and Gala preparation.",
    outcome: "Sustained public visibility",
    track: "news",
    href: "/media",
  },
  {
    id: "icon-nominations",
    dateLabel: "1 August – 12 September 2026",
    startsAt: "2026-08-01T00:00:00Z",
    endsAt: "2026-09-12T23:59:59Z",
    milestone: "Africa Education Icon Nominations",
    activity: "Receive nominations and evidence for the three Icon pathways.",
    outcome: "Build verified Icon pool",
    track: "nominations",
    href: "/nominate?tier=icon",
  },
  {
    id: "webinar-1",
    dateLabel: "Thursday, 6 August 2026",
    startsAt: "2026-08-06T00:00:00Z",
    milestone: "EduAid-Africa Webinar 1",
    activity: "Fame With Purpose",
    outcome: "Mobilise influencers & scholarship supporters",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "webinar-2",
    dateLabel: "Thursday, 13 August 2026",
    startsAt: "2026-08-13T00:00:00Z",
    milestone: "EduAid-Africa Webinar 2",
    activity: "Legacies That Teach Generations",
    outcome: "Generate Icon nominations & legacy projects",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-1",
    dateLabel: "Tuesday, 18 August 2026",
    startsAt: "2026-08-18T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 1",
    activity: "Who Is an Education Enabler?",
    outcome: "Launch volunteer contributor network",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-3",
    dateLabel: "Thursday, 20 August 2026",
    startsAt: "2026-08-20T00:00:00Z",
    milestone: "EduAid-Africa Webinar 3",
    activity: "Funding the Future of African Education",
    outcome: "Attract CSR, EduTech and philanthropic partners",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "icon-judges-onboarding",
    dateLabel: "24 – 31 August 2026",
    startsAt: "2026-08-24T00:00:00Z",
    endsAt: "2026-08-31T23:59:59Z",
    milestone: "Icon Judges' Onboarding",
    activity: "Confirm 27 judges, orientation, conflict declarations.",
    outcome: "Judges ready for assessment",
    track: "judging",
    href: "/judges/directory",
  },
  {
    id: "podcast-2",
    dateLabel: "Tuesday, 25 August 2026",
    startsAt: "2026-08-25T00:00:00Z",
    milestone: "Podcast Episode 2",
    activity: "Fame With Purpose",
    outcome: "Promote influencer advocacy",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-4",
    dateLabel: "Thursday, 27 August 2026",
    startsAt: "2026-08-27T00:00:00Z",
    milestone: "EduAid-Africa Webinar 4",
    activity: "Stories That Mobilise",
    outcome: "Recruit media & NGO partners",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "judges-calibration",
    dateLabel: "1 – 6 September 2026",
    startsAt: "2026-09-01T00:00:00Z",
    endsAt: "2026-09-06T23:59:59Z",
    milestone: "Judges' Calibration",
    activity: "Score sample nominations, align standards.",
    outcome: "Consistent judging",
    track: "judging",
  },
  {
    id: "podcast-3",
    dateLabel: "Tuesday, 1 September 2026",
    startsAt: "2026-09-01T00:00:00Z",
    milestone: "Podcast Episode 3",
    activity: "Education Legacies That Must Be Preserved",
    outcome: "Drive Icon nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-5",
    dateLabel: "Thursday, 3 September 2026",
    startsAt: "2026-09-03T00:00:00Z",
    milestone: "EduAid-Africa Webinar 5",
    activity: "Building the Future-Ready African School",
    outcome: "Mobilise school support",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "judges-preliminary-review",
    dateLabel: "7 – 12 September 2026",
    startsAt: "2026-09-07T00:00:00Z",
    endsAt: "2026-09-12T23:59:59Z",
    milestone: "Judges' Preliminary Review",
    activity: "Review early verified submissions.",
    outcome: "Reduce final workload",
    track: "judging",
  },
  {
    id: "podcast-4",
    dateLabel: "Tuesday, 8 September 2026",
    startsAt: "2026-09-08T00:00:00Z",
    milestone: "Podcast Episode 4",
    activity: "Funding Education for All",
    outcome: "Attract investment",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-6",
    dateLabel: "Thursday, 10 September 2026",
    startsAt: "2026-09-10T00:00:00Z",
    milestone: "EduAid-Africa Webinar 6",
    activity: "Africa's Knowledge & Skills Network",
    outcome: "Recruit volunteer teachers",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "icon-nominations-close",
    dateLabel: "Saturday, 12 September 2026",
    startsAt: "2026-09-12T00:00:00Z",
    milestone: "Africa Education Icon Nominations Close",
    activity: "Close Icon nominations.",
    outcome: "Begin final verification",
    track: "nominations",
    highlight: true,
  },
  {
    id: "final-icon-verification",
    dateLabel: "13 – 16 September 2026",
    startsAt: "2026-09-13T00:00:00Z",
    endsAt: "2026-09-16T23:59:59Z",
    milestone: "Final Icon Verification",
    activity: "Complete verification and assign to judges.",
    outcome: "Assessment-ready pool",
    track: "judging",
  },
  {
    id: "podcast-5",
    dateLabel: "Tuesday, 15 September 2026",
    startsAt: "2026-09-15T00:00:00Z",
    milestone: "Podcast Episode 5",
    activity: "Rebuild My School Africa 2027",
    outcome: "Prepare school nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-7",
    dateLabel: "Thursday, 17 September 2026",
    startsAt: "2026-09-17T00:00:00Z",
    milestone: "EduAid-Africa Webinar 7",
    activity: "The Global Alliance for African Education",
    outcome: "Build international partnerships",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "judges-independent-assessment",
    dateLabel: "17 – 23 September 2026",
    startsAt: "2026-09-17T00:00:00Z",
    endsAt: "2026-09-23T23:59:59Z",
    milestone: "Judges' Independent Assessment",
    activity: "Judges review and score Icon nominations.",
    outcome: "Independent assessments",
    track: "judging",
  },
  {
    id: "podcast-6",
    dateLabel: "Tuesday, 22 September 2026",
    startsAt: "2026-09-22T00:00:00Z",
    milestone: "Podcast Episode 6",
    activity: "No Learner Left Behind",
    outcome: "Prepare special-needs nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "judges-moderation",
    dateLabel: "24 – 27 September 2026",
    startsAt: "2026-09-24T00:00:00Z",
    endsAt: "2026-09-27T23:59:59Z",
    milestone: "Judges' Moderation",
    activity: "Resolve scoring variations.",
    outcome: "Finalise Icon recommendations",
    track: "judging",
  },
  {
    id: "judges-final-decisions",
    dateLabel: "28 – 30 September 2026",
    startsAt: "2026-09-28T00:00:00Z",
    endsAt: "2026-09-30T23:59:59Z",
    milestone: "Judges' Final Decisions",
    activity: "Confirm nine Africa Education Icons.",
    outcome: "Complete Icon jury process",
    track: "judging",
  },
  {
    id: "podcast-7",
    dateLabel: "Tuesday, 29 September 2026",
    startsAt: "2026-09-29T00:00:00Z",
    milestone: "Podcast Episode 7",
    activity: "Volunteers Sharing Knowledge",
    outcome: "Recruit volunteers",
    track: "podcast",
    href: "/media",
  },
  {
    id: "online-award-tv-show-2",
    dateLabel: "Wednesday, 30 September 2026",
    startsAt: "2026-09-30T00:00:00Z",
    milestone: "Online Award TV Show 2",
    activity: "Platinum & Gold-Blue Garnet Recognition.",
    outcome: "Build Gala momentum",
    track: "showcase",
    href: "/media",
  },
  {
    id: "special-needs-nominations-open",
    dateLabel: "From Thursday, 1 October 2026",
    startsAt: "2026-10-01T00:00:00Z",
    milestone: "Special-Needs School Nominations Open",
    activity: "Open nominations for Rebuild My School Africa 2027.",
    outcome: "Build intervention database",
    track: "nominations",
    href: "/programs/rebuild-my-school-africa",
  },
  {
    id: "final-verification-gala-production",
    dateLabel: "10 – 14 October 2026",
    startsAt: "2026-10-10T00:00:00Z",
    endsAt: "2026-10-14T23:59:59Z",
    milestone: "Final Verification & Gala Production",
    activity: "Complete profiles, scripts, rehearsals.",
    outcome: "Gala-ready programme",
    track: "gala",
  },
  {
    id: "podcast-10",
    dateLabel: "Tuesday, 20 October 2026",
    startsAt: "2026-10-20T00:00:00Z",
    milestone: "Podcast Episode 10",
    activity: "From Recognition to Social Impact",
    outcome: "Connect to post-award delivery",
    track: "podcast",
    href: "/media",
  },
  {
    id: "recognition-gala",
    dateLabel: "Thursday, 22 October 2026",
    startsAt: "2026-10-22T00:00:00Z",
    milestone: "NESA-Africa 2026 Recognition Gala",
    activity: "Present 9 Icons + recognised Education Enablers.",
    outcome: "Conclude recognition season",
    track: "gala",
    href: "/media/gala",
    highlight: true,
  },
];

export const MASTER_TIMELINE_TRACK_LABELS: Record<MasterTimelineTrack, string> = {
  activation: "Public Activation",
  nominations: "Nominations",
  webinar: "EduAid-Africa Webinar",
  podcast: "Education Enablers Podcast",
  judging: "Judging Process",
  showcase: "TV Showcase",
  gala: "Recognition Gala",
  news: "Weekly News",
};

export const MASTER_TIMELINE_TRACK_ACCENT: Record<MasterTimelineTrack, string> = {
  activation: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  nominations: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  webinar: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  podcast: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  judging: "bg-slate-500/15 text-slate-200 border-slate-400/30",
  showcase: "bg-blue-500/15 text-blue-200 border-blue-400/30",
  gala: "bg-yellow-500/15 text-yellow-200 border-yellow-400/30",
  news: "bg-sky-500/15 text-sky-200 border-sky-400/30",
};
