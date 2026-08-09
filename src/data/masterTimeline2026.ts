// NESA-Africa & EduAid-Africa 2026 Master Timeline
// Source: "NESA-Africa 2026 — Complete Timeline Set" (Sections 1, 2, 3, 6, 8, 9, 10, 11).
// 1 July – 13 December 2026.
//
// Governance notes carried from the source document:
//  • Public nominations open 30 August 2026 (NOT 1 August).
//  • Africa Education Icon nominations: 30 Aug – 12 Sep 2026.
//  • Gold-Blue Garnet, Platinum & Influencer Education Impact: 30 Aug – 14 Nov 2026.
//  • Retired terminology: "voting", "public vote", "winners" (outside the Icon
//    judges-only internal ranking). Gold-Blue Garnet, Platinum and Influencer
//    Education Impact are NRC-verified Certificates of Recognition.
//
// Source of truth for the Timeline page master calendar, homepage public notice
// banner and any dated milestone lookups site-wide.

export type MasterTimelineTrack =
  | "activation"
  | "nominations"
  | "verification"
  | "webinar"
  | "podcast"
  | "judging"
  | "showcase"
  | "gala"
  | "news"
  | "legacy";

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
  /** Flagged as an unresolved item in the Master Open Items List. */
  flagged?: boolean;
}

/**
 * Two explicit nomination windows — Icon closes early so judges can complete
 * the 26 Sep – 31 Oct review; the other three tiers stay open to 14 November so
 * nominees have time to request physical printed certificates before the Gala.
 */
export const MASTER_TIMELINE_NOMINATION_WINDOWS = [
  {
    id: "icon",
    tier: "Africa Education Icon",
    window: "30 August – 12 September 2026",
    verification:
      "NRC pre-verifies, then pushes to the Judges Arena (13–26 Sep) for judges' ranking.",
    href: "/nominate?tier=icon",
  },
  {
    id: "gold-blue-garnet",
    tier: "Gold-Blue Garnet",
    window: "30 August – 14 November 2026",
    verification: "Rolling NRC verification, 16 September – 13 December 2026.",
    href: "/nominate?tier=gold-blue-garnet",
  },
  {
    id: "platinum",
    tier: "Platinum Recognition",
    window: "30 August – 14 November 2026",
    verification: "NRC verification only — no dated verification window confirmed.",
    href: "/nominate?tier=platinum",
  },
  {
    id: "influencer",
    tier: "Influencer Education Impact",
    window: "30 August – 14 November 2026",
    verification: "NRC verification only — no dated verification window confirmed.",
    href: "/nominate?tier=influencer",
  },
] as const;

export const MASTER_TIMELINE_PUBLIC_NOTICE = {
  title: "Public Nominations Open 30 August 2026",
  body: "Africa Education Icon Award: 30 August – 12 September 2026. Education Impact Certificates (all six recognition families): 30 August – 14 November 2026 — the longer window gives nominees time to request physical printed certificates ahead of the Gala.",
  effectiveDate: "2026-08-30T00:00:00Z",
  ctaLabel: "Nominate Now",
  ctaHref: "/nominate",
} as const;

/** Master Open Items List — published as flagged/pending, never silently resolved. */
export const MASTER_TIMELINE_OPEN_ITEMS: { id: string; item: string; detail: string }[] = [
  {
    id: "gala-production-sequencing",
    item: "Final Verification & Gala Production (10–14 Oct) vs. Icon selection lock (31 Oct)",
    detail:
      "Production finalises profiles and scripts before the Icon selection is confirmed. Sequencing conflict — referred to the production team, unresolved.",
  },
  {
    id: "platinum-influencer-verification",
    item: "Platinum & Influencer Education Impact NRC verification window",
    detail:
      "No dedicated verification date range exists (unlike Gold-Blue Garnet's rolling 16 Sep – 13 Dec window). Left as a confirmed gap — no dates invented.",
  },
  {
    id: "podcast-8-9",
    item: "Education Enablers Podcast — Episodes 8 and 9",
    detail:
      "Absent from every source document. The schedule jumps from Episode 7 (29 Sep) to Episode 10 (20 Oct); the gap is shown rather than implied continuity.",
  },
  {
    id: "social-media",
    item: "Social media timeline",
    detail: "No confirmed cadence, platform plan or content calendar exists. Not published.",
  },
  {
    id: "platform-go-live",
    item: "Judges Arena platform build / go-live date",
    detail:
      "Unconfirmed. The platform must be production-ready before 12 September 2026 (Judges Onboarding start), but this has not been independently confirmed.",
  },
];

export const MASTER_TIMELINE_2026: MasterTimelineEntry[] = [
  {
    id: "pre-launch",
    dateLabel: "1 July – 30 August 2026",
    startsAt: "2026-07-01T00:00:00Z",
    endsAt: "2026-08-30T23:59:59Z",
    milestone: "Public Pre-Nomination Activation",
    activity:
      "Build awareness, introduce the four recognition tiers, mobilise media, volunteers, sponsors and partners.",
    outcome: "High readiness for nominations",
    track: "activation",
    href: "/about/timeline",
  },
  {
    id: "nrc-member-onboarding",
    dateLabel: "1 – 28 August 2026",
    startsAt: "2026-08-01T00:00:00Z",
    endsAt: "2026-08-28T23:59:59Z",
    milestone: "NRC Member Onboarding",
    activity:
      "Onboard and train Nominee Research Corps members across all four tiers, including Icon-relevant verification training.",
    outcome: "Verification corps ready before nominations open",
    track: "verification",
    href: "/nrc",
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
    id: "webinar-1",
    dateLabel: "Thursday, 20 August 2026",
    startsAt: "2026-08-20T00:00:00Z",
    milestone: "EduAid-Africa Webinar 1 · Fame With Purpose (pilot)",
    activity:
      "Mobilising influencers and public figures around scholarship support. Pilot episode of the 7-part series.",
    outcome: "Non-competitive · Influencer Education Impact",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-2",
    dateLabel: "Tuesday, 25 August 2026",
    startsAt: "2026-08-25T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 2",
    activity: "Fame With Purpose",
    outcome: "Promote influencer advocacy",
    track: "podcast",
    href: "/media",
  },
  {
    id: "public-nominations-open",
    dateLabel: "From 30 August 2026",
    startsAt: "2026-08-30T00:00:00Z",
    milestone: "Public Nominations Open — All 4 Tiers",
    activity:
      "Nominations open for Africa Education Icon, Gold-Blue Garnet, Platinum Recognition and Influencer Education Impact.",
    outcome: "Steady flow of nominations begins",
    track: "nominations",
    href: "/nominate",
    highlight: true,
  },
  {
    id: "icon-nominations",
    dateLabel: "30 August – 12 September 2026",
    startsAt: "2026-08-30T00:00:00Z",
    endsAt: "2026-09-12T23:59:59Z",
    milestone: "Africa Education Icon Nominations",
    activity:
      "Receive nominations and evidence for the three Icon subcategories across three origin groups (2006–2026 eligibility window).",
    outcome: "Build verified Icon pool",
    track: "nominations",
    href: "/nominate?tier=icon",
    highlight: true,
  },
  {
    id: "tier234-nominations",
    dateLabel: "30 August – 14 November 2026",
    startsAt: "2026-08-30T00:00:00Z",
    endsAt: "2026-11-14T23:59:59Z",
    milestone:
      "Gold-Blue Garnet, Platinum & Influencer Education Impact Nominations",
    activity:
      "Extended nomination window so nominees have time to request physical printed certificates ahead of the Gala.",
    outcome: "NRC-verified Certificates of Recognition pipeline",
    track: "nominations",
    href: "/nominate",
    highlight: true,
  },
  {
    id: "webinar-2",
    dateLabel: "Thursday, 3 September 2026",
    startsAt: "2026-09-03T00:00:00Z",
    milestone: "EduAid-Africa Webinar 2 · Women & Girls in Education",
    activity: "Removing access barriers, in partnership with FAWE Africa.",
    outcome: "Non-competitive · Influencer / Platinum / Gold-Blue Garnet",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-3",
    dateLabel: "Tuesday, 1 September 2026",
    startsAt: "2026-09-01T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 3",
    activity: "Education Legacies That Must Be Preserved",
    outcome: "Drive Icon nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "podcast-4",
    dateLabel: "Tuesday, 8 September 2026",
    startsAt: "2026-09-08T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 4",
    activity: "Funding Education for All",
    outcome: "Attract investment",
    track: "podcast",
    href: "/media",
  },
  {
    id: "icon-nominations-close",
    dateLabel: "Saturday, 12 September 2026",
    startsAt: "2026-09-12T00:00:00Z",
    milestone: "Africa Education Icon Nominations Close",
    activity: "Close Icon nominations and hand the pool to the NRC.",
    outcome: "Begin NRC review of all Icon nominees",
    track: "nominations",
  },
  {
    id: "icon-judges-onboarding",
    dateLabel: "12 – 25 September 2026",
    startsAt: "2026-09-12T00:00:00Z",
    endsAt: "2026-09-25T23:59:59Z",
    milestone: "Icon Judges' Onboarding & Calibration",
    activity:
      "Confirm 27 judges, conflict-of-interest declarations, rubric training and sample scoring. Judges Arena opens for onboarding with no live nominee data.",
    outcome: "Calibrated judging panel ready",
    track: "judging",
    href: "/judges/directory",
  },
  {
    id: "nrc-icon-review",
    dateLabel: "13 – 26 September 2026",
    startsAt: "2026-09-13T00:00:00Z",
    endsAt: "2026-09-26T23:59:59Z",
    milestone: "NRC Review of All Icon Nominees → Judges Arena",
    activity:
      "The Nominee Research Corps verifies every Icon nomination and pushes the verified dossiers into the Judges Arena.",
    outcome: "Assessment-ready Icon pool in the Arena",
    track: "verification",
    href: "/nrc",
  },
  {
    id: "webinar-3",
    dateLabel: "Thursday, 17 September 2026",
    startsAt: "2026-09-17T00:00:00Z",
    milestone: "EduAid-Africa Webinar 3 · CSR & Corporate Partnership",
    activity: "Structured funding pathways for corporate education investment.",
    outcome: "Non-competitive · Gold-Blue Garnet",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "gold-blue-garnet-verification",
    dateLabel: "16 September – 13 December 2026",
    startsAt: "2026-09-16T00:00:00Z",
    endsAt: "2026-12-13T23:59:59Z",
    milestone: "Gold-Blue Garnet NRC Verification (rolling)",
    activity:
      "Rolling Nominee Research Corps verification of Gold-Blue Garnet nominations against the EDI Matrix and evidence standards.",
    outcome: "NRC-verified Certificates of Recognition",
    track: "verification",
    href: "/nrc",
  },
  {
    id: "podcast-5",
    dateLabel: "Tuesday, 15 September 2026",
    startsAt: "2026-09-15T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 5",
    activity: "Rebuild My School Africa 2027",
    outcome: "Prepare school nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "podcast-6",
    dateLabel: "Tuesday, 22 September 2026",
    startsAt: "2026-09-22T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 6",
    activity: "No Learner Left Behind",
    outcome: "Prepare special-needs nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "judges-final-review",
    dateLabel: "26 September – 31 October 2026",
    startsAt: "2026-09-26T00:00:00Z",
    endsAt: "2026-10-31T23:59:59Z",
    milestone: "Judges' Final Review & Selection — all 9 Icon pathways",
    activity:
      "All 27 judges deliberate, score and lock results per pathway in the Judges Arena (3 Icon subcategories × 3 origin groups).",
    outcome: "All 9 Africa Education Icon recipients confirmed by 31 October 2026",
    track: "judging",
    href: "/judges/directory",
    highlight: true,
  },
  {
    id: "podcast-7",
    dateLabel: "Tuesday, 29 September 2026",
    startsAt: "2026-09-29T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 7",
    activity: "Volunteers Sharing Knowledge",
    outcome: "Recruit volunteers",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-4",
    dateLabel: "Thursday, 1 October 2026",
    startsAt: "2026-10-01T00:00:00Z",
    milestone: "EduAid-Africa Webinar 4 · Curriculum Innovation & Future of Work",
    activity:
      "Reforming what and how Africa's children learn. Content boundary applies — no naming, promoting or comparing any Icon nominee under review.",
    outcome: "Icon only — content boundary applies",
    track: "webinar",
    href: "/media/webinars",
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
    milestone: "Final Verification & Gala Production ⚑",
    activity:
      "Complete profiles, scripts and rehearsals. Flagged open item: this window precedes the 31 October Icon selection lock — sequencing referred to the production team.",
    outcome: "Gala-ready programme (pending sequencing resolution)",
    track: "gala",
    flagged: true,
  },
  {
    id: "webinar-5",
    dateLabel: "Thursday, 15 October 2026",
    startsAt: "2026-10-15T00:00:00Z",
    milestone: "EduAid-Africa Webinar 5 · EduTech & Digital Learning",
    activity: "Technology-driven access and learning outcomes.",
    outcome: "Non-competitive · Gold-Blue Garnet",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-8-9-gap",
    dateLabel: "Date to be confirmed",
    startsAt: "2026-10-06T00:00:00Z",
    milestone: "Education Enablers Podcast — Episodes 8 & 9 ⚑",
    activity:
      "No date or topic exists in any source document. The schedule jumps from Episode 7 (29 September) to Episode 10 (20 October).",
    outcome: "Open item — confirm whether these episodes exist or were cut",
    track: "podcast",
    flagged: true,
  },
  {
    id: "podcast-10",
    dateLabel: "Tuesday, 20 October 2026",
    startsAt: "2026-10-20T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 10",
    activity: "From Recognition to Social Impact",
    outcome: "Connect to post-award delivery",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-6",
    dateLabel: "Thursday, 29 October 2026",
    startsAt: "2026-10-29T00:00:00Z",
    milestone: "EduAid-Africa Webinar 6 · Faith, Leadership & Institutional Impact",
    activity: "Faith-based, political and institutional contributions to education.",
    outcome: "Non-competitive · Platinum",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "webinar-7",
    dateLabel: "Thursday, 12 November 2026",
    startsAt: "2026-11-12T00:00:00Z",
    milestone: "EduAid-Africa Webinar 7 · Diaspora & International Partnership",
    activity:
      "Closing episode — global partners and Diaspora Africans investing in education. Content boundary applies.",
    outcome: "Icon only — content boundary applies",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "tv-show-1",
    dateLabel: "Sunday, 15 November 2026",
    startsAt: "2026-11-15T00:00:00Z",
    milestone: "TV Show 1 — Icon + Influencer Education Impact",
    activity:
      "Africa Education Icon recipients presented; Influencer Education Impact Certificates of Recognition announced.",
    outcome: "Continental broadcast moment",
    track: "showcase",
    href: "/media",
  },
  {
    id: "tv-show-2",
    dateLabel: "Tuesday, 1 December 2026",
    startsAt: "2026-12-01T00:00:00Z",
    milestone: "TV Show 2 — Gold-Blue Garnet + Platinum",
    activity:
      "NRC-verified Gold-Blue Garnet and Platinum Recognition Enablers presented ahead of the Gala.",
    outcome: "Build Gala momentum",
    track: "showcase",
    href: "/media",
  },
  {
    id: "tv-show-3",
    dateLabel: "Sunday, 13 December 2026",
    startsAt: "2026-12-13T00:00:00Z",
    milestone: "TV Show 3 — Gala Live Coverage",
    activity: "Live broadcast of the NESA-Africa 2026 Recognition Gala.",
    outcome: "Continental live coverage",
    track: "showcase",
    href: "/media",
  },
  {
    id: "recognition-gala",
    dateLabel: "Sunday, 13 December 2026",
    startsAt: "2026-12-13T00:00:00Z",
    milestone: "NESA-Africa 2026 Recognition Gala, Lagos",
    activity:
      "Honour the 9 Africa Education Icons and every NRC-verified Education Enabler across the four recognition tiers.",
    outcome: "Conclude the recognition stage",
    track: "gala",
    href: "/media/gala",
    highlight: true,
  },
  {
    id: "impact-legacy",
    dateLabel: "December 2026 – December 2027",
    startsAt: "2026-12-15T00:00:00Z",
    endsAt: "2027-12-13T23:59:59Z",
    milestone: "Impact & Legacy Phase",
    activity:
      "EduAid-Africa, Rebuild My School Africa, Afri-EduTourism and Scholarships programmes run through the year.",
    outcome: "Recognition converted into measurable education impact",
    track: "legacy",
    href: "/programs",
  },
];

export const MASTER_TIMELINE_TRACK_LABELS: Record<MasterTimelineTrack, string> = {
  activation: "Public Activation",
  nominations: "Nominations",
  verification: "NRC Verification",
  webinar: "EduAid-Africa Webinar",
  podcast: "Education Enablers Podcast",
  judging: "Icon Judging",
  showcase: "TV Showcase",
  gala: "Recognition Gala",
  news: "Weekly News",
  legacy: "Impact & Legacy",
};

export const MASTER_TIMELINE_TRACK_ACCENT: Record<MasterTimelineTrack, string> = {
  activation: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  nominations: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  verification: "bg-teal-500/15 text-teal-200 border-teal-400/30",
  webinar: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  podcast: "bg-violet-500/15 text-violet-200 border-violet-400/30",
  judging: "bg-slate-500/15 text-slate-200 border-slate-400/30",
  showcase: "bg-blue-500/15 text-blue-200 border-blue-400/30",
  gala: "bg-yellow-500/15 text-yellow-200 border-yellow-400/30",
  news: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  legacy: "bg-lime-500/15 text-lime-200 border-lime-400/30",
};
