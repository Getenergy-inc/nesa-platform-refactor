import type { AwardCategoryConfig } from "./types";
import { buildStandardFaqs } from "./faqBuilder";

const G = "influencers" as const;
const PARENT = "/awards/influencers-education-impact";
const url = (slug: string) => `${PARENT}/${slug}`;

const review =
  "NRC eligibility → influencer jury review (verifying campaigns, reach, authenticity, outcomes) → public engagement signal → final score.";

export const INFLUENCERS_CATEGORIES: AwardCategoryConfig[] = [
  {
    slug: "sports",
    finalName: "Africa Sports — Education Impact",
    group: G,
    url: url("sports"),
    parentPage: PARENT,
    shortDescription:
      "Athletes and sports figures using their platforms to advance African education through campaigns, scholarships and infrastructure.",
    eligibilitySummary:
      "Athletes, retired sports figures or sports organisations with verifiable education campaigns or programmes.",
    whoCanBeNominated:
      "Active or retired athletes, coaches, sports foundations and sports federations with education work.",
    whoCanNominate: "Anyone — fans, partners, peers, foundations or self-nomination.",
    requiredEvidence: [
      "Campaign or programme overview",
      "Reach metrics (audience, beneficiaries)",
      "Outcome evidence with citations",
      "Partner or foundation attestation",
    ],
    reviewMethod: review,
    votingRole: "Public engagement signal (used as a tie-break, not a sole determinant).",
    judgingRole: "Influencer jury review and final scoring.",
    relatedCategories: ["music", "social-media"],
    seoTitle: "Africa Sports — Education Impact | NESA-Africa 2026",
    metaDescription:
      "Nominate the African athletes and sports figures using their platforms to advance education.",
    faqs: buildStandardFaqs({
      eligibility: "Athletes, retired sports figures or sports organisations with verifiable education campaigns.",
      whoCanNominate: "Anyone, including fans, partners, peers and self-nomination.",
      evidence: "Campaign overview, reach metrics, outcome evidence with citations, partner/foundation attestation.",
      publicVoting: "There is a public engagement signal, but final selection is jury-led.",
      review: "NRC eligibility, influencer jury review (campaigns, reach, authenticity, outcomes), then final score.",
    }),
    mergedFrom: ["/awards/africa-sports-education-impact"],
  },
  {
    slug: "music",
    finalName: "Africa Music — Education Impact",
    group: G,
    url: url("music"),
    parentPage: PARENT,
    shortDescription:
      "Musicians and music industry figures channelling their reach into African education impact.",
    eligibilitySummary:
      "Recording artists, music producers and music industry figures with verifiable education campaigns or programmes.",
    whoCanBeNominated: "Artists, producers, labels and music foundations.",
    whoCanNominate: "Anyone — fans, partners, peers, foundations or self-nomination.",
    requiredEvidence: [
      "Campaign or programme overview",
      "Reach metrics",
      "Outcome evidence with citations",
      "Partner or foundation attestation",
    ],
    reviewMethod: review,
    votingRole: "Public engagement signal (tie-break only).",
    judgingRole: "Influencer jury review and final scoring.",
    relatedCategories: ["sports", "social-media"],
    seoTitle: "Africa Music — Education Impact | NESA-Africa 2026",
    metaDescription:
      "Nominate African musicians and music industry figures advancing education through their platforms.",
    faqs: buildStandardFaqs({
      eligibility: "Recording artists, producers or industry figures with verifiable education campaigns.",
      whoCanNominate: "Anyone, including fans, partners, peers and self-nomination.",
      evidence: "Campaign overview, reach metrics, outcome evidence with citations, partner attestation.",
      publicVoting: "There is a public engagement signal, but final selection is jury-led.",
      review: "NRC eligibility, influencer jury review, then final score.",
    }),
    mergedFrom: ["/awards/africa-music-education-impact"],
  },
  {
    slug: "social-media",
    finalName: "Africa Social Media — Education Impact",
    group: G,
    url: url("social-media"),
    parentPage: PARENT,
    shortDescription:
      "Digital creators, advocates and online educators advancing African education through social media platforms.",
    eligibilitySummary:
      "Creators, advocates or online educators with verifiable, sustained education-focused content and audience.",
    whoCanBeNominated: "Individual creators, advocacy accounts, online education platforms and digital collectives.",
    whoCanNominate: "Anyone — audiences, peers, partners or self-nomination.",
    requiredEvidence: [
      "Channel / handle links",
      "Audience and engagement metrics",
      "Sample content portfolio",
      "Outcome or behaviour-change evidence (where available)",
    ],
    reviewMethod: review,
    votingRole: "Public engagement signal (tie-break only).",
    judgingRole: "Influencer jury review and final scoring (authenticity + outcome focus).",
    relatedCategories: ["sports", "music"],
    seoTitle: "Africa Social Media — Education Impact | NESA-Africa 2026",
    metaDescription:
      "Nominate the African creators, advocates and online educators advancing education on social media.",
    faqs: buildStandardFaqs({
      eligibility: "Creators, advocates or online educators with sustained education-focused content and audience.",
      whoCanNominate: "Anyone — audiences, peers, partners or self-nomination.",
      evidence: "Channel links, audience metrics, sample portfolio, outcome evidence where available.",
      publicVoting: "There is a public engagement signal, but final selection is jury-led with an authenticity check.",
      review: "NRC eligibility, influencer jury review with authenticity check, then final score.",
    }),
    mergedFrom: [
      "/awards/digital-voices",
      "/awards/influencer-education",
      "/awards/africa-social-media-education-impact",
    ],
  },
];
