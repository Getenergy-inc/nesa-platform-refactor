// NESA-Africa & EduAid-Africa 2026 Master Timeline
// Source: "NESA-Africa 2026 — CORRECTED Complete Timeline Set".
// 8 July 2026 – 13 December 2027 (recognition cycle + legacy phase).
//
// Governance notes carried from the corrected source document:
//  • Public nominations open 6 September 2026 (supersedes 30 August).
//  • Africa Education Icon nominations: 6 September – 6 October 2026.
//  • Gold-Blue Garnet, Platinum & Influencer Education Impact:
//    6 September – 21 November 2026.
//  • Recognition Gala: 13 December 2026, Lagos — re-confirmed, unchanged.
//  • Retired terminology: "voting", "public vote", "winners" (outside the Icon
//    judges-only internal ranking). Gold-Blue Garnet, Platinum and Influencer
//    Education Impact are NRC-verified Certificates of Recognition.
//
// Date labels for nomination windows are imported from
// `@/config/nominationWindows2026` and the Gala from `@/config/programme` —
// never retyped.
//
// Source of truth for the Timeline page master calendar, homepage public notice
// banner and any dated milestone lookups site-wide.

import {
  CERTIFICATE_WINDOW_CLOSE_LABEL,
  CERTIFICATE_WINDOW_LABEL,
  ICON_WINDOW_CLOSE_LABEL,
  ICON_WINDOW_LABEL,
  NOMINATIONS_OPEN_LABEL,
} from "@/config/nominationWindows2026";
import { PROGRAMME_END_LABEL } from "@/config/programme";

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
  /** Date genuinely unconfirmed in the source — shown honestly, never invented. */
  toBeConfirmed?: boolean;
  /** Flagged as an unresolved item in the internal open-items list. */
  flagged?: boolean;
  /** Optional expandable breakdown lines (e.g. TV showcase pathway notes). */
  details?: string[];
}

/**
 * Two explicit nomination windows — Icon closes early so judges can complete
 * their review, while the other three tiers stay open to 21 November so
 * nominees have time to request physical printed certificates before the Gala.
 */
export const MASTER_TIMELINE_NOMINATION_WINDOWS = [
  {
    id: "icon",
    tier: "Africa Education Icon",
    window: ICON_WINDOW_LABEL,
    verification:
      "NRC reviews all Icon nominees 7 – 20 October, then pushes verified dossiers to the Judges Arena.",
    href: "/nominate?tier=icon",
  },
  {
    id: "gold-blue-garnet",
    tier: "Gold-Blue Garnet",
    window: CERTIFICATE_WINDOW_LABEL,
    verification: `Rolling NRC verification, 23 September – ${PROGRAMME_END_LABEL}.`,
    href: "/nominate?tier=gold-blue-garnet",
  },
  {
    id: "platinum",
    tier: "Platinum Recognition",
    window: CERTIFICATE_WINDOW_LABEL,
    verification: "NRC verification only — no dated verification window confirmed.",
    href: "/nominate?tier=platinum",
  },
  {
    id: "influencer",
    tier: "Influencer Education Impact",
    window: CERTIFICATE_WINDOW_LABEL,
    verification: "NRC verification only — no dated verification window confirmed.",
    href: "/nominate?tier=influencer",
  },
] as const;

export const MASTER_TIMELINE_PUBLIC_NOTICE = {
  title: `Public Nominations Open ${NOMINATIONS_OPEN_LABEL}`,
  body: `Africa Education Icon Award: ${ICON_WINDOW_LABEL}. Education Impact Certificates (all six recognition families): ${CERTIFICATE_WINDOW_LABEL} — the longer window gives nominees time to request physical printed certificates ahead of the Gala.`,
  effectiveDate: "2026-09-06T00:00:00Z",
  ctaLabel: "Nominate Now",
  ctaHref: "/nominate",
} as const;

/**
 * INTERNAL ONLY — editorial/production open questions.
 * Never rendered on public surfaces (see /timeline).
 */
export const MASTER_TIMELINE_OPEN_ITEMS: { id: string; item: string; detail: string }[] = [
  {
    id: "podcast-8-9-unconfirmed",
    item: "Education Enablers Podcast — Episodes 8 & 9 have no confirmed date or topic",
    detail:
      "No source record confirms air dates or themes for Episodes 8 and 9. Published as unconfirmed; no dates invented.",
  },
  {
    id: "gbg-verification-past-showcase-2",
    item:
      "Gold-Blue Garnet verification (closes 13 December) extends 5 days past TV Showcase 2 (8 December)",
    detail:
      "TV Showcase 2 on 8 December 2026 presents Gold-Blue Garnet recipients, but rolling NRC verification for that family runs to Gala day, 13 December 2026. Recipients verified between 9 and 13 December cannot appear in the broadcast. Flagged for the team — not silently resolved.",
  },
];

export const MASTER_TIMELINE_2026: MasterTimelineEntry[
  
] = [
  {
    id: "pre-launch",
    dateLabel: "8 July – 6 September 2026",
    startsAt: "2026-07-08T00:00:00Z",
    endsAt: "2026-09-06T23:59:59Z",
    milestone: "Public Pre-Nomination Activation",
    activity:
      "Build awareness, introduce the four recognition tiers, mobilise media, volunteers, sponsors and partners.",
    outcome: "High readiness for nominations",
    track: "activation",
    href: "/timeline",
  },
  {
    id: "nrc-member-onboarding",
    dateLabel: "8 August – 4 September 2026",
    startsAt: "2026-08-08T00:00:00Z",
    endsAt: "2026-09-04T23:59:59Z",
    milestone: "NRC Member Onboarding",
    activity:
      "Onboard and train Nominee Research Corps members across all four tiers, including Icon-relevant verification training.",
    outcome: "Verification corps ready before nominations open",
    track: "verification",
    href: "/nrc",
  },
  {
    id: "weekly-news",
    dateLabel: "From Friday, 14 August 2026",
    startsAt: "2026-08-14T00:00:00Z",
    milestone: "Weekly NESA-Africa News",
    activity:
      "Weekly updates on nominations, Enablers, partners and Gala preparation.",
    outcome: "Sustained public visibility",
    track: "news",
    href: "/media",
  },
  {
    id: "podcast-1",
    dateLabel: "Tuesday, 25 August 2026",
    startsAt: "2026-08-25T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 1",
    activity: "Who Is an Education Enabler?",
    outcome: "Launch volunteer contributor network",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-1",
    dateLabel: "Thursday, 27 August 2026",
    startsAt: "2026-08-27T00:00:00Z",
    milestone: "EduAid-Africa Webinar Week 1 · Fame With Purpose (pilot)",
    activity:
      "How Africa's Sports, Music and Digital Icons Can Turn Influence Into Education Opportunity. Pilot episode of the 7-week series.",
    outcome: "Non-competitive · Influencer Education Impact",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-2",
    dateLabel: "Tuesday, 1 September 2026",
    startsAt: "2026-09-01T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 2",
    activity: "Fame With Purpose",
    outcome: "Promote influencer advocacy",
    track: "podcast",
    href: "/media",
  },
  {
    id: "public-nominations-open",
    dateLabel: `From ${NOMINATIONS_OPEN_LABEL}`,
    startsAt: "2026-09-06T00:00:00Z",
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
    dateLabel: ICON_WINDOW_LABEL,
    startsAt: "2026-09-06T00:00:00Z",
    endsAt: "2026-10-06T23:59:59Z",
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
    dateLabel: CERTIFICATE_WINDOW_LABEL,
    startsAt: "2026-09-06T00:00:00Z",
    endsAt: "2026-11-21T23:59:59Z",
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
    id: "podcast-3",
    dateLabel: "Tuesday, 8 September 2026",
    startsAt: "2026-09-08T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 3",
    activity: "Education Legacies That Must Be Preserved",
    outcome: "Drive Icon nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-2",
    dateLabel: "Thursday, 10 September 2026",
    startsAt: "2026-09-10T00:00:00Z",
    milestone: "EduAid-Africa Webinar Week 2 · Legacies That Teach Generations",
    activity:
      "The Literary, Technical and Philanthropic Leaders Who Changed African Learning.",
    outcome: "Non-competitive · Africa Education Icon",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-4",
    dateLabel: "Tuesday, 15 September 2026",
    startsAt: "2026-09-15T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 4",
    activity: "Funding Education for All",
    outcome: "Attract investment",
    track: "podcast",
    href: "/media",
  },
  {
    id: "podcast-5",
    dateLabel: "Tuesday, 22 September 2026",
    startsAt: "2026-09-22T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 5",
    activity: "Rebuild My School Africa 2027",
    outcome: "Prepare school nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "gold-blue-garnet-verification",
    dateLabel: `23 September – ${PROGRAMME_END_LABEL}`,
    startsAt: "2026-09-23T00:00:00Z",
    endsAt: "2026-12-13T23:59:59Z",
    milestone: "Gold-Blue Garnet NRC Verification (rolling)",
    activity:
      "Rolling Nominee Research Corps verification of Gold-Blue Garnet nominations against the EDI Matrix and evidence standards, capped at the Gala.",
    outcome: "NRC-verified Certificates of Recognition",
    track: "verification",
    href: "/nrc",
  },
  {
    id: "webinar-3",
    dateLabel: "Thursday, 24 September 2026",
    startsAt: "2026-09-24T00:00:00Z",
    milestone: "EduAid-Africa Webinar Week 3 · Funding the Future of African Education",
    activity:
      "How CSR, ESG, Technology and Digital Training Can Deliver Measurable Education Impact.",
    outcome: "Non-competitive · Gold-Blue Garnet",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-6",
    dateLabel: "Tuesday, 29 September 2026",
    startsAt: "2026-09-29T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 6",
    activity: "No Learner Left Behind",
    outcome: "Prepare special-needs nominations",
    track: "podcast",
    href: "/media",
  },
  {
    id: "icon-nominations-close",
    dateLabel: `Tuesday, ${ICON_WINDOW_CLOSE_LABEL}`,
    startsAt: "2026-10-06T00:00:00Z",
    milestone: "Africa Education Icon Nominations Close",
    activity: "Close Icon nominations and hand the pool to the NRC.",
    outcome: "Begin NRC review of all Icon nominees",
    track: "nominations",
  },
  {
    id: "icon-judges-onboarding",
    dateLabel: "6 – 19 October 2026",
    startsAt: "2026-10-06T00:00:00Z",
    endsAt: "2026-10-19T23:59:59Z",
    milestone: "Icon Judges' Onboarding & Calibration",
    activity:
      "Confirm 27 judges, conflict-of-interest declarations, rubric training and sample scoring. Judges Arena opens for onboarding with no live nominee data.",
    outcome: "Calibrated judging panel ready",
    track: "judging",
    href: "/judges/directory",
  },
  {
    id: "podcast-7",
    dateLabel: "Tuesday, 6 October 2026",
    startsAt: "2026-10-06T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 7",
    activity: "Volunteers Sharing Knowledge",
    outcome: "Recruit volunteers",
    track: "podcast",
    href: "/media",
  },
  {
    id: "nrc-icon-review",
    dateLabel: "7 – 20 October 2026",
    startsAt: "2026-10-07T00:00:00Z",
    endsAt: "2026-10-20T23:59:59Z",
    milestone: "NRC Review of All Icon Nominees → Judges Arena",
    activity:
      "The Nominee Research Corps verifies every Icon nomination and pushes the verified dossiers into the Judges Arena.",
    outcome: "Assessment-ready Icon pool in the Arena",
    track: "verification",
    href: "/nrc",
  },
  {
    id: "special-needs-nominations-open",
    dateLabel: "From Thursday, 8 October 2026",
    startsAt: "2026-10-08T00:00:00Z",
    milestone: "Special-Needs School Nominations Open",
    activity: "Open nominations for Rebuild My School Africa 2027.",
    outcome: "Build intervention database",
    track: "nominations",
    href: "/impact/rebuild-my-school-africa",
  },
  {
    id: "webinar-4",
    dateLabel: "Thursday, 8 October 2026",
    startsAt: "2026-10-08T00:00:00Z",
    milestone:
      "EduAid-Africa Webinar Week 4 · Stories That Mobilise, Organisations That Deliver",
    activity:
      "How Media, NGOs and Community Networks Can Move Africa From Awareness to Action. Content boundary applies — no naming, promoting or comparing any Icon nominee under review.",
    outcome: "Content boundary applies",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-8-9",
    dateLabel: "To be confirmed",
    startsAt: "2026-10-13T00:00:00Z",
    milestone: "Education Enablers Podcast — Episodes 8 & 9",
    activity:
      "Dates and topics are not yet confirmed (indicatively around 13 October 2026). Published as unconfirmed rather than estimated.",
    outcome: "To be confirmed",
    track: "podcast",
    toBeConfirmed: true,
  },
  {
    id: "judges-final-review",
    dateLabel: "20 October – 24 November 2026",
    startsAt: "2026-10-20T00:00:00Z",
    endsAt: "2026-11-24T23:59:59Z",
    milestone: "Judges' Final Review & Selection — all 9 Icon pathways",
    activity:
      "All 27 judges deliberate, score and lock results per pathway in the Judges Arena (3 Icon subcategories × 3 origin groups).",
    outcome: "All 9 Africa Education Icon recipients confirmed by 24 November 2026",
    track: "judging",
    href: "/judges/directory",
    highlight: true,
  },
  {
    id: "webinar-5",
    dateLabel: "Thursday, 22 October 2026",
    startsAt: "2026-10-22T00:00:00Z",
    milestone: "EduAid-Africa Webinar Week 5 · Building the Future-Ready African School",
    activity:
      "STEM, Creative Learning, Teacher Development, Government Action and School Transformation.",
    outcome: "Non-competitive · Gold-Blue Garnet / Platinum Recognition",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "podcast-10",
    dateLabel: "Tuesday, 27 October 2026",
    startsAt: "2026-10-27T00:00:00Z",
    milestone: "Education Enablers Podcast — Episode 10",
    activity: "From Recognition to Social Impact",
    outcome: "Connect to post-award delivery",
    track: "podcast",
    href: "/media",
  },
  {
    id: "webinar-6",
    dateLabel: "Thursday, 5 November 2026",
    startsAt: "2026-11-05T00:00:00Z",
    milestone:
      "EduAid-Africa Webinar Week 6 · Africa's Knowledge, Skills and Volunteer Teaching Network",
    activity:
      "Libraries, Research, Digital Learning, NYSC, Youth Skills and Educators Sharing Knowledge Across Borders.",
    outcome: "Non-competitive · Gold-Blue Garnet / Platinum Recognition",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "icon-recipients-confirmed",
    dateLabel: "Tuesday, 24 November 2026",
    startsAt: "2026-11-24T00:00:00Z",
    milestone: "All 9 Africa Education Icon Recipients Confirmed",
    activity:
      "Judges lock every pathway result and the Governance Board ratifies the nine Icon recipients.",
    outcome: "Icon roll of honour finalised",
    track: "judging",
    highlight: true,
  },
  {
    id: "final-verification-gala-production",
    dateLabel: "25 – 29 November 2026",
    startsAt: "2026-11-25T00:00:00Z",
    endsAt: "2026-11-29T23:59:59Z",
    milestone: "Final Verification & Gala Production",
    activity:
      "Complete verified profiles, citations, broadcast scripts and rehearsal schedules following the 24 November Icon selection lock.",
    outcome: "Production-ready recognition programme",
    track: "gala",
    href: "/gala",
  },
  {
    id: "webinar-7",
    dateLabel: "Thursday, 19 November 2026",
    startsAt: "2026-11-19T00:00:00Z",
    milestone: "EduAid-Africa Webinar Week 7 · The Global Alliance for African Education",
    activity:
      "Faith, Leadership, Diaspora, Tourism and International Partnerships for Schools, Teachers and Learners. Closing episode — content boundary applies.",
    outcome: "Content boundary applies",
    track: "webinar",
    href: "/media/webinars",
  },
  {
    id: "tier234-nominations-close",
    dateLabel: `Saturday, ${CERTIFICATE_WINDOW_CLOSE_LABEL}`,
    startsAt: "2026-11-21T00:00:00Z",
    milestone:
      "Gold-Blue Garnet, Platinum & Influencer Education Impact Nominations Close",
    activity:
      "Final submissions accepted; remaining nominations move into rolling NRC verification.",
    outcome: "Nomination stage closed for the 2026 cycle",
    track: "nominations",
    highlight: true,
  },
  {
    id: "tv-show-1",
    dateLabel: "Sunday, 22 November 2026",
    startsAt: "2026-11-22T00:00:00Z",
    milestone: "TV Showcase 1 — Platinum + Influencer Education Impact",
    activity:
      "Platinum Recognition and Influencer Education Impact Certificates of Recognition presented to a continental audience.",
    outcome: "Continental broadcast moment",
    track: "showcase",
    href: "/media",
    details: [
      "Platinum Recognition — NRC verification → Governance Approval. No judges, no public vote.",
      "Influencer Education Impact — NRC verification → Governance Approval. No judges, no public vote.",
    ],
  },
  {
    id: "tv-show-2",
    dateLabel: "Tuesday, 8 December 2026",
    startsAt: "2026-12-08T00:00:00Z",
    milestone: "TV Showcase 2 — Icon + Gold-Blue Garnet",
    activity:
      "Africa Education Icon recipients presented alongside NRC-verified Gold-Blue Garnet Enablers ahead of the Gala.",
    outcome: "Build Gala momentum",
    track: "showcase",
    href: "/media",
    details: [
      "Africa Education Icon — NRC verification → Judges Arena → Grand Jury ranked-choice voting, locked 24 November 2026.",
      "Gold-Blue Garnet — NRC verification only. No judges, no public vote.",
    ],
  },
  {
    id: "tv-show-3",
    dateLabel: `Sunday, ${PROGRAMME_END_LABEL}`,
    startsAt: "2026-12-13T00:00:00Z",
    milestone: "TV Showcase 3 — Gala Live Coverage",
    activity: "Live broadcast of the NESA-Africa 2026 Recognition Gala.",
    outcome: "Continental live coverage",
    track: "showcase",
    href: "/media",
  },
  {
    id: "recognition-gala",
    dateLabel: `Sunday, ${PROGRAMME_END_LABEL}`,
    startsAt: "2026-12-13T00:00:00Z",
    milestone: "NESA-Africa 2026 Recognition Gala, Lagos",
    activity:
      "Honour the 9 Africa Education Icons and every NRC-verified Education Enabler across the four recognition tiers.",
    outcome: "Conclude the recognition stage",
    track: "gala",
    href: "/gala",
    highlight: true,
  },
  {
    id: "impact-legacy",
    dateLabel: "22 December 2026 – 13 December 2027",
    startsAt: "2026-12-22T00:00:00Z",
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

/** Chronological order (by ISO start) for timeline rendering. */
export const MASTER_TIMELINE_CHRONOLOGICAL: MasterTimelineEntry[] = [
  ...MASTER_TIMELINE_2026,
].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
