/**
 * EduAid-Africa Webinar Series 2026 — canonical timetable.
 * ------------------------------------------------------
 * Single source of truth for the 7-episode, bi-weekly series starting
 * 20 August 2026. Every NESA-Africa surface that shows a webinar timetable
 * must read from this module — no hard-coded episode dates elsewhere.
 *
 * Platform firewall: full episode detail, speaker rosters and FGD structure
 * live on EduAid-Africa's own platform. nesa.africa carries the timetable
 * recall plus the single cross-reference line below.
 */

export type WebinarCompetitiveStatus = "non-competitive" | "icon-boundary";

export interface EduAidWebinarEpisode {
  /** Episode number, 1-7 */
  episode: number;
  id: string;
  /** ISO date (episode air date) */
  isoDate: string;
  dateLabel: string;
  title: string;
  summary: string;
  /** Linked NESA-Africa recognition tier(s) */
  tiers: string;
  competitiveStatus: WebinarCompetitiveStatus;
  competitiveLabel: string;
  /** Episode 1 is the pilot that calibrates the 80-seat / 4-room model */
  pilot?: boolean;
}

export const EDUAID_WEBINAR_SERIES_2026: EduAidWebinarEpisode[] = [
  {
    episode: 1,
    id: "ep-1-fame-with-purpose",
    isoDate: "2026-08-20",
    dateLabel: "20 August 2026",
    title: "Fame With Purpose",
    summary: "Mobilising influencers and public figures around scholarship support.",
    tiers: "Influencer Education Impact",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
    pilot: true,
  },
  {
    episode: 2,
    id: "ep-2-women-and-girls",
    isoDate: "2026-09-03",
    dateLabel: "3 September 2026",
    title: "Women & Girls in Education",
    summary: "Removing access barriers, in partnership with FAWE Africa.",
    tiers: "Influencer / Platinum / Gold-Blue Garnet",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 3,
    id: "ep-3-csr-corporate-partnership",
    isoDate: "2026-09-17",
    dateLabel: "17 September 2026",
    title: "CSR & Corporate Partnership",
    summary: "Structured funding pathways for corporate education investment.",
    tiers: "Gold-Blue Garnet",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 4,
    id: "ep-4-curriculum-innovation",
    isoDate: "2026-10-01",
    dateLabel: "1 October 2026",
    title: "Curriculum Innovation & Future of Work",
    summary: "Reforming what and how Africa's children learn.",
    tiers: "Africa Education Icon + Gold-Blue Garnet",
    competitiveStatus: "icon-boundary",
    competitiveLabel: "Icon only — content boundary applies",
  },
  {
    episode: 5,
    id: "ep-5-edutech-digital-learning",
    isoDate: "2026-10-15",
    dateLabel: "15 October 2026",
    title: "EduTech & Digital Learning",
    summary: "Technology-driven access and learning outcomes.",
    tiers: "Gold-Blue Garnet",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 6,
    id: "ep-6-faith-leadership-institutional",
    isoDate: "2026-10-29",
    dateLabel: "29 October 2026",
    title: "Faith, Leadership & Institutional Impact",
    summary: "Faith-based, political, and institutional contributions to education.",
    tiers: "Platinum (Christian, Islamic, Political Leadership, International Partnership)",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 7,
    id: "ep-7-diaspora-international",
    isoDate: "2026-11-12",
    dateLabel: "12 November 2026",
    title: "Diaspora & International Partnership",
    summary:
      "Closing episode — global partners and Diaspora Africans investing in education.",
    tiers: "Africa Education Icon + Platinum",
    competitiveStatus: "icon-boundary",
    competitiveLabel: "Icon only — content boundary applies",
  },
];

export const EDUAID_SERIES_META = {
  name: "EduAid-Africa Webinar Series",
  strapline: "The 7-Episode Series, Bi-Weekly, Starting 20 August 2026",
  episodeCount: EDUAID_WEBINAR_SERIES_2026.length,
  cadence: "Bi-weekly",
  seriesStartLabel: "20 August 2026",
  seriesEndLabel: "12 November 2026",
  seriesStartIso: "2026-08-20",
  seriesEndIso: "2026-11-12",
  masterTimelineLine: "20 August 2026 | EduAid-Africa Webinar Series begins",
} as const;

/** Content boundary applying to Episodes 4 and 7 (Icon judging window). */
export const EDUAID_CONTENT_BOUNDARY = {
  heading: "Content boundary — Episodes 4 and 7",
  iconJudgingWindow: "1 September – 12 October 2026",
  body:
    "Both episodes air during or immediately adjacent to the Icon Judging window (1 September – 12 October 2026). No naming, promoting, comparing, or commenting on any specific Icon nominee under active review.",
} as const;

/** Core integrity rule — displayed on every episode surface. */
export const EDUAID_INTEGRITY_RULE =
  "Participation in any EduAid-Africa webinar — as a volunteer, presenter, guest, sponsor, advertiser, or attendee — does not influence NESA-Africa nominee approval, category-fit review, evidence verification, judging, or Governance decisions, at any tier.";

/** Production model — publicity-recruited, not standing staff. */
export const EDUAID_PRODUCTION_MODEL = {
  heading: "Production Model — Publicity-Recruited, Not Standing Staff",
  seats: 80,
  breakoutRooms: [
    "Regional Priorities",
    "Category & Evidence",
    "Rebuild My School Africa",
    "Sponsorship & Partnership",
  ],
  notes: [
    "80-seat Focus Group Discussion model, 4 breakout rooms per episode.",
    "Seats and facilitators are recruited per episode via public campaign, not a standing internal team.",
    "Episode 1 (20 August) serves as the pilot — actual sign-up numbers and facilitator availability from this episode determine whether the 80-seat / 4-room model holds for Episodes 2–7, or needs adjusting.",
  ],
} as const;

/** Standard call-to-action set, identical for every episode. */
export const EDUAID_STANDARD_CTAS: { label: string; href: string }[] = [
  { label: "Nominate an Education Enabler", href: "/nominate" },
  { label: "Suggest a School for Rebuild My School Africa verification", href: "/impact/nominate-school" },
  { label: "Become a Sponsor or Partner", href: "/sponsor" },
  { label: "Donate or Adopt a School Project through EduAid-Africa", href: "/donate" },
  { label: "Contribute to the White Paper 2026 Consultation", href: "/resources" },
];

/** The single cross-reference line nesa.africa carries (platform firewall). */
export const EDUAID_CROSS_REFERENCE = {
  text: "Pre-Award Webinars, FGDs & Podcasts — Hosted by EduAid-Africa, NESA-Africa's sister programme.",
  linkLabel: "Visit the EduAid-Africa Webinar Series →",
  href: "https://eduaid.africa/webinars",
} as const;

/** Where the series sits in the wider 2026 cycle calendar. */
export const EDUAID_SERIES_CONTEXT =
  "This 7-episode run is one line in the larger 2026 cycle calendar — \"20 August 2026 | EduAid-Africa Webinar Series begins\" — running in parallel with the nomination window (30 August onward) and the Icon judging window (1 September – 12 October), and concluding on 12 November, roughly a month before the 14 December Recognition Gala.";
