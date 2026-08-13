/**
 * EduAid-Africa Webinar Series 2026 — canonical timetable.
 * ------------------------------------------------------
 * Single source of truth for the 7-week series starting Thursday
 * 27 August 2026 (corrected schedule). Every NESA-Africa surface that shows
 * a webinar timetable must read from this module — no hard-coded episode
 * dates elsewhere.
 *
 * Platform firewall: full episode detail, speaker rosters and FGD structure
 * live on EduAid-Africa's own platform. nesa.africa carries the timetable
 * recall plus the single cross-reference line below.
 */
import {
  ICON_JUDGING_WINDOW_LABEL,
  NOMINATIONS_OPEN_LABEL,
} from "@/config/nominationWindows2026";
import { PROGRAMME_END_LABEL } from "@/config/programme";

export type WebinarCompetitiveStatus = "non-competitive" | "icon-boundary";

export interface EduAidWebinarEpisode {
  /** Episode / week number, 1-7 */
  episode: number;
  id: string;
  /** ISO date (episode air date) */
  isoDate: string;
  dateLabel: string;
  title: string;
  /** Full descriptive subtitle from the corrected schedule. */
  subtitle: string;
  summary: string;
  /** What the episode promotes — reproduced from the corrected schedule. */
  promotes: string[];
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
    id: "week-1-fame-with-purpose",
    isoDate: "2026-08-27",
    dateLabel: "Thursday, 27 August 2026",
    title: "Week 1 — Fame With Purpose",
    subtitle:
      "How Africa's Sports, Music and Digital Icons Can Turn Influence Into Education Opportunity",
    summary:
      "Mobilising influence — sport, music and digital platforms — behind scholarships and school support.",
    promotes: [
      "Africa Sports — Education Impact",
      "Africa Music — Education Impact",
      "Africa Social Media — Education Impact",
      "Youth advocacy",
      "Scholarship mobilisation",
      "School-support campaigns",
    ],
    tiers: "Influencer Education Impact",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
    pilot: true,
  },
  {
    episode: 2,
    id: "week-2-legacies-that-teach",
    isoDate: "2026-09-10",
    dateLabel: "Thursday, 10 September 2026",
    title: "Week 2 — Legacies That Teach Generations",
    subtitle:
      "The Literary, Technical and Philanthropic Leaders Who Changed African Learning",
    summary:
      "Lifetime contribution pathways — literature and curriculum, technical education, and education philanthropy.",
    promotes: [
      "Literary and New Curriculum Advocate Icon",
      "Africa Technical Educator Icon",
      "Africa Education Philanthropy Icon",
      "Legacy projects",
      "Scholarships",
      "TVET",
      "Curriculum and knowledge development",
    ],
    tiers: "Africa Education Icon",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 3,
    id: "week-3-funding-the-future",
    isoDate: "2026-09-24",
    dateLabel: "Thursday, 24 September 2026",
    title: "Week 3 — Funding the Future of African Education",
    subtitle:
      "How CSR, ESG, Technology and Digital Training Can Deliver Measurable Education Impact",
    summary:
      "Structured funding and technology pathways for measurable education outcomes.",
    promotes: [
      "Best CSR in Education — Africa",
      "Best CSR in Education — Nigeria",
      "Best EduTech Organisation — Africa",
      "CSR Education Fund Pool",
      "Digital learning",
      "School adoption",
      "Teacher and youth training",
    ],
    tiers: "Gold-Blue Garnet",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 4,
    id: "week-4-stories-that-mobilise",
    isoDate: "2026-10-08",
    dateLabel: "Thursday, 8 October 2026",
    title: "Week 4 — Stories That Mobilise, Organisations That Deliver",
    subtitle:
      "How Media, NGOs and Community Networks Can Move Africa From Awareness to Action",
    summary:
      "Advocacy and delivery — the media and civil-society engine behind education access.",
    promotes: [
      "Best Media in Educational Advocacy — Nigeria",
      "Best NGO Contribution to Education — Nigeria",
      "Best NGO Contribution to Education — Africa",
      "Advocacy",
      "Implementation partnerships",
      "Community mobilisation",
      "Impact storytelling",
    ],
    tiers: "Gold-Blue Garnet",
    competitiveStatus: "icon-boundary",
    competitiveLabel: "Content boundary applies — no Icon nominee may be named",
  },
  {
    episode: 5,
    id: "week-5-future-ready-school",
    isoDate: "2026-10-22",
    dateLabel: "Thursday, 22 October 2026",
    title: "Week 5 — Building the Future-Ready African School",
    subtitle:
      "STEM, Creative Learning, Teacher Development, Government Action and School Transformation",
    summary:
      "What it takes to transform a school — teaching, curriculum, facilities and state-level action.",
    promotes: [
      "Best STEM Education Champion — Africa",
      "Creative Arts Education Impact — Nigeria",
      "Best Education-Friendly State — Nigeria",
      "Rebuild My School Africa",
      "Teacher CPD",
      "Digital classrooms",
      "Women and girls in STEM",
    ],
    tiers: "Gold-Blue Garnet / Platinum Recognition",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 6,
    id: "week-6-knowledge-skills-volunteers",
    isoDate: "2026-11-05",
    dateLabel: "Thursday, 5 November 2026",
    title: "Week 6 — Africa's Knowledge, Skills and Volunteer Teaching Network",
    subtitle:
      "Libraries, Research, Digital Learning, NYSC, Youth Skills and Educators Sharing Knowledge Across Borders",
    summary:
      "Knowledge infrastructure and the volunteer teaching network that carries it across borders.",
    promotes: [
      "Best Library in Nigerian Tertiary Institutions",
      "Best R&D Contribution to Education — Nigeria",
      "EduAid Volunteer Teachers",
      "NYSC Online SAED Plus",
      "Digital skills",
      "TVET",
      "Professional certification",
      "Youth employability",
    ],
    tiers: "Gold-Blue Garnet / Platinum Recognition",
    competitiveStatus: "non-competitive",
    competitiveLabel: "Non-competitive",
  },
  {
    episode: 7,
    id: "week-7-global-alliance",
    isoDate: "2026-11-19",
    dateLabel: "Thursday, 19 November 2026",
    title: "Week 7 — The Global Alliance for African Education",
    subtitle:
      "Faith, Leadership, Diaspora, Tourism and International Partnerships for Schools, Teachers and Learners",
    summary:
      "Closing episode — faith, government, diaspora and international partners aligned behind African education.",
    promotes: [
      "Christian Education Impact — Africa",
      "Islamic Education Impact — Africa",
      "Political Leaders' Contribution to Education — Nigeria",
      "International and Bilateral Education Partnerships",
      "Diaspora Association Educational Impact",
      "Afri-EduTourism 2027",
      "International volunteer missions",
      "Regional education funds",
    ],
    tiers: "Platinum Recognition / Africa Education Icon",
    competitiveStatus: "icon-boundary",
    competitiveLabel: "Content boundary applies — no Icon nominee may be named",
  },
];

export const EDUAID_SERIES_META = {
  name: "EduAid-Africa Webinar Series",
  strapline: "The 7-Week Series, Bi-Weekly, Starting 27 August 2026",
  episodeCount: EDUAID_WEBINAR_SERIES_2026.length,
  cadence: "Bi-weekly, Thursdays",
  seriesStartLabel: "27 August 2026",
  seriesEndLabel: "19 November 2026",
  seriesStartIso: "2026-08-27",
  seriesEndIso: "2026-11-19",
  masterTimelineLine: "27 August 2026 | EduAid-Africa Webinar Series begins",
} as const;

/** Content boundary applying to Episodes 4 and 7 (Icon judging window). */
export const EDUAID_CONTENT_BOUNDARY = {
  heading: "Content boundary — Episodes 4 and 7",
  iconJudgingWindow: ICON_JUDGING_WINDOW_LABEL,
  body:
    `Both episodes air during or immediately adjacent to the Icon judging window (${ICON_JUDGING_WINDOW_LABEL}). No naming, promoting, comparing, or commenting on any specific Icon nominee under active review.`,
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
    "Week 1 (27 August) serves as the pilot — actual sign-up numbers and facilitator availability from this episode determine whether the 80-seat / 4-room model holds for Weeks 2–7, or needs adjusting.",
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
  `This 7-week run is one line in the larger 2026 cycle calendar — "${EDUAID_SERIES_META.masterTimelineLine}" — running in parallel with the nomination window (${NOMINATIONS_OPEN_LABEL} onward) and the Icon judging window (${ICON_JUDGING_WINDOW_LABEL}), and concluding on 19 November, weeks before the ${PROGRAMME_END_LABEL} Recognition Gala.`;
