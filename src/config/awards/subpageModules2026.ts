// subpageModules2026.ts — authored benefits, timeline, countdown and terms content
// for all 22 NESA-Africa 2026 award subpages.
//
// Content is authored per recognition tier (the governance route, evidence bar and
// calendar differ by tier, not by individual category) and personalised with the
// award name where it improves clarity. Merged into every subpage by
// `src/config/awards/subpages2026.ts`.

import type {
  SubpageBenefit,
  SubpageCountdown,
  SubpageTerms,
  SubpageTimelineEntry,
} from "@/components/awards/subpage/AwardSubpageTemplate";
import type { TierSlug } from "@/config/recognition2026/tiers";
import { PROGRAMME_END_DATETIME, PROGRAMME_END_LABEL } from "@/config/programme";

export interface SubpageModules {
  benefits: { heading?: string; items: SubpageBenefit[] };
  timeline: { heading?: string; entries: SubpageTimelineEntry[] };
  countdown: SubpageCountdown;
  terms: SubpageTerms;
}

// ── Shared clauses ───────────────────────────────────────────────────────────

const COMMON_TERMS: string[] = [
  "Nomination is free. No payment, sponsorship, donation, Gala ticket, merchandise purchase, GFAwzip Wallet transaction or AGC Participation Credit balance influences verification, assessment or recognition.",
  "Every claim submitted must be independently verifiable. The Nominee Research Corps (NRC) may request original documents, referee contacts or third-party confirmation before a nomination proceeds.",
  "Nominations containing falsified, plagiarised or unverifiable evidence are disqualified, and the submitting account may be suspended.",
  "Nominees must consent to publication of their verified profile, category, region and recognition status on NESA.Africa.",
  "Reviewers, NRC members and Governance Board members must declare and recuse themselves from any conflict of interest before assessing a nomination.",
  "NESA-Africa reserves the right to reclassify a nomination into the correct category, subcategory or region where the submitted placement is incorrect.",
  "Recognition decisions of the Governance Board are final. An evidence-correction window is offered before any nomination is closed as unverified.",
  "Personal data is processed solely for verification, recognition and Gala administration, in line with the NESA-Africa privacy policy.",
];

const ICON_TERMS: string[] = [
  "The Africa Education Icon recognition covers the 2006–2026 period and requires at least twenty years of documented education contribution.",
  "Icon recognition is decided exclusively by the Icon Jury following NRC verification. There is no public vote and no public shortlist ballot.",
  "Posthumous nominations are accepted where an authorised representative provides the evidence and consents on the nominee's behalf.",
];

const INFLUENCER_TERMS: string[] = [
  "Follower counts, engagement rates and audience size are contextual data only. They are never scored as impact.",
  "Recognition requires auditable education outcomes — funds mobilised, learners reached, schools supported or campaigns with independently confirmed results.",
  "Brand partnerships and paid promotional content must be disclosed in the nomination.",
];

const PLATINUM_TERMS: string[] = [
  "Platinum Recognition is institutional. Nominees must be a registered entity with published governance and, where applicable, audited financial statements.",
  "Recognition is jury-determined only. There is no public vote in this tier.",
  "Safeguarding, child-protection and inclusion policies must be provided where the nominee works directly with learners.",
];

const GBG_TERMS: string[] = [
  "Gold-Blue Garnet Recognition requires documented delivery at scale, evidenced by monitoring data, evaluations or publicly available reports.",
  "Where a nomination covers a multi-country programme, evidence must be supplied for each country claimed.",
  "Recognition status is issued for the 2026 cycle and does not imply endorsement of a nominee's commercial products or political positions.",
];

// ── Benefits ─────────────────────────────────────────────────────────────────

const COMMON_BENEFITS: SubpageBenefit[] = [
  {
    title: "Verified public profile",
    body: "A permanent NESA.Africa profile carrying the NRC verification mark, searchable in Africa's Education Impact Directory.",
  },
  {
    title: "Digital certificate & seal",
    body: "A verifiable certificate with a public verification code, plus a recognition seal for use on your own channels.",
  },
  {
    title: "Continental visibility",
    body: "Inclusion in NESA-Africa media coverage, weekly news features, podcasts and the online Award TV showcases.",
  },
  {
    title: "Enabler network access",
    body: `Introductions to chapters, partners and fellow Enablers across 15 regions, culminating at the Recognition Gala on ${PROGRAMME_END_LABEL}.`,
  },
];

const TIER_BENEFITS: Record<TierSlug, SubpageBenefit[]> = {
  "africa-education-icon": [
    {
      title: "Hall of Fame induction",
      body: "A permanent place in the Africa Education Icon Hall of Fame (2006–2026) with an archived legacy dossier.",
    },
    {
      title: "Legacy citation",
      body: "A formal jury citation documenting two decades of verified contribution to Education for All.",
    },
    ...COMMON_BENEFITS.slice(0, 3),
  ],
  "influencer-education-impact": [
    {
      title: "Impact-verified status",
      body: "Public confirmation that your education outcomes — not your follower count — were independently checked.",
    },
    ...COMMON_BENEFITS,
  ],
  platinum: [
    {
      title: "Institutional standing",
      body: "Recognition of your organisation's governance, safeguarding and sustained delivery record.",
    },
    ...COMMON_BENEFITS,
  ],
  "gold-blue-garnet": [
    {
      title: "Recognition at scale",
      body: "Confirmation of verified delivery across your country or multi-country footprint.",
    },
    ...COMMON_BENEFITS,
  ],
};

// ── Timelines ────────────────────────────────────────────────────────────────

const ICON_TIMELINE: SubpageTimelineEntry[] = [
  { date: "1 – 31 July 2026", title: "Pre-launch activation", description: "Tier briefings, media mobilisation and chapter readiness." , status: "upcoming" },
  { date: "30 August 2026", title: "Nominations open", description: "Public nominations open for the Africa Education Icon tier.", status: "upcoming" },
  { date: "12 September 2026", title: "Nominations close", description: "Icon nominations close at 23:59 WAT.", status: "upcoming" },
  { date: "13 – 16 September 2026", title: "Final Icon verification", description: "NRC completes document, citation and referee checks.", status: "upcoming" },
  { date: "17 – 30 September 2026", title: "Icon Jury assessment", description: "Independent assessment, moderation and final jury decisions.", status: "upcoming" },
  { date: "10 – 14 October 2026", title: "Ratification & production", description: "Governance Board ratification and Gala production.", status: "upcoming" },
  { date: PROGRAMME_END_LABEL, title: "Recognition Gala", description: "Icons honoured at the NESA-Africa 2026 Recognition Gala, Lagos.", status: "upcoming" },
];

const STANDARD_TIMELINE: SubpageTimelineEntry[] = [
  { date: "1 – 31 July 2026", title: "Pre-launch activation", description: "Category briefings, evidence guidance and partner mobilisation.", status: "upcoming" },
  { date: "30 August 2026", title: "Nominations open", description: "Public nominations open across all four recognition tiers.", status: "upcoming" },
  { date: "August – September 2026", title: "Rolling NRC verification", description: "Evidence checks begin as soon as a nomination is complete.", status: "upcoming" },
  { date: "1 – 6 September 2026", title: "Reviewer calibration", description: "Assessors calibrate against the published EDI matrix.", status: "upcoming" },
  { date: "17 – 30 September 2026", title: "Independent assessment", description: "Scoring, moderation and final reviewer decisions.", status: "upcoming" },
  { date: "10 – 14 October 2026", title: "Ratification & production", description: "Governance Board ratification and Gala production.", status: "upcoming" },
  { date: PROGRAMME_END_LABEL, title: "Recognition Gala", description: "Verified Enablers honoured in Lagos, Nigeria.", status: "upcoming" },
];

// ── Countdowns ───────────────────────────────────────────────────────────────

const ICON_COUNTDOWN: SubpageCountdown = {
  heading: "Time left to nominate an Africa Education Icon",
  targetIso: "2026-09-12T23:59:00+01:00",
  label: "Icon nominations close · 12 September 2026, 23:59 WAT",
  note: "Nominations submitted with complete evidence enter NRC verification immediately.",
};

const STANDARD_COUNTDOWN: SubpageCountdown = {
  heading: "Countdown to the 2026 Recognition Gala",
  targetIso: GALA_COUNTDOWN_DATETIME,
  label: `NESA-Africa 2026 Recognition Gala · ${PROGRAMME_END_LABEL}, Lagos`,
  note: "Nominations open 30 August 2026. Verification runs continuously until the Gala.",
};

// ── Public API ───────────────────────────────────────────────────────────────

export function getSubpageModules(tier: TierSlug, awardName: string): SubpageModules {
  const isIcon = tier === "africa-education-icon";

  const extraTerms =
    tier === "africa-education-icon"
      ? ICON_TERMS
      : tier === "influencer-education-impact"
        ? INFLUENCER_TERMS
        : tier === "platinum"
          ? PLATINUM_TERMS
          : GBG_TERMS;

  return {
    benefits: {
      heading: "What recognition unlocks",
      items: TIER_BENEFITS[tier],
    },
    timeline: {
      heading: `${awardName} — 2026 recognition timeline`,
      entries: isIcon ? ICON_TIMELINE : STANDARD_TIMELINE,
    },
    countdown: isIcon ? ICON_COUNTDOWN : STANDARD_COUNTDOWN,
    terms: {
      heading: "Terms & conditions",
      intro: `These terms govern nominations to ${awardName} in the NESA-Africa 2026 recognition cycle.`,
      clauses: [...extraTerms, ...COMMON_TERMS],
      documentHref: "/policies",
    },
  };
}
