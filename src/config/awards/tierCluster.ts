// Tier cluster config — single source of truth for the standardized
// 5-subpage cluster (Overview · About · Criteria · Nominees · Nominate)
// rendered for each of the 4 Recognition Tiers.
//
// The tier "overview" (index) pages live as bespoke files:
//   /awards/africa-education-icon       -> IconAward.tsx
//   /awards/gold-blue-garnet            -> BlueGarnetAward.tsx
//   /awards/platinum-recognition        -> PlatinumAward.tsx
//   /awards/influencer-education-impact -> InfluencerImpact2026.tsx
//
// The 4 remaining subpages per tier are rendered by TierClusterPage.tsx
// reading this config via getTierCluster(slug).

export type TierSubpage = "overview" | "about" | "criteria" | "nominees" | "nominate";

export interface TierCriterionPillar {
  title: string;
  body: string;
  weight?: string;
}

export interface TierEvidenceItem {
  label: string;
  description: string;
}

export interface TierClusterConfig {
  /** URL slug under /awards/ */
  slug: string;
  /** Analytics + display id */
  tierId: "icon" | "blue-garnet" | "platinum" | "influencer";
  name: string;
  shortName: string;
  tagline: string;
  accent: "gold" | "blue-garnet" | "platinum" | "coral";

  // ── About ────────────────────────────────────────────────────────
  about: {
    mission: string;
    whoQualifies: string[];
    integrityModel: string;
    positioning: string;
  };

  // ── Criteria ─────────────────────────────────────────────────────
  criteria: {
    intro: string;
    pillars: TierCriterionPillar[];
    evidence: TierEvidenceItem[];
    disqualifiers: string[];
    timelineNote: string;
  };

  // ── Nominees (directory summary) ─────────────────────────────────
  nominees: {
    directoryFilterKey: string;   // ?tier= query used on /nominees
    directoryLabel: string;
    empty: string;
    highlight: string;
  };

  // ── Nominate (deep-links to /nominate) ───────────────────────────
  nominate: {
    intro: string;
    steps: string[];
    ctaHref: string;              // includes preselect query
    ctaLabel: string;
    supportHref: string;          // secondary CTA (guide / FAQs)
    supportLabel: string;
  };

  // ── SEO ──────────────────────────────────────────────────────────
  seo: Record<Exclude<TierSubpage, "overview">, {
    title: string;
    description: string;
  }>;
}

// ─── Shared constants ────────────────────────────────────────────────
const INTEGRITY_LINE =
  "Recognition is decided by evidence-based NRC verification, independent Icon judging where applicable and governance approval. Sponsorship, donations and AGC Participation Credits do not influence recognition.";

// ─── ICON ────────────────────────────────────────────────────────────
const ICON: TierClusterConfig = {
  slug: "africa-education-icon",
  tierId: "icon",
  name: "Africa Education Icon Award",
  shortName: "Icon",
  tagline: "Africa's highest lifetime recognition for Education Enablers (2006–2026).",
  accent: "gold",

  about: {
    mission:
      "The Africa Education Icon Award honours the individuals whose sustained, evidence-based work over two decades has reshaped how Africa learns — across curriculum, philanthropy, and technical education.",
    whoQualifies: [
      "Lifetime Education Enablers with 10+ years of continuously verified impact",
      "Individuals whose work has scaled across borders, sectors or generations",
      "Africans in Africa, Africans in the Diaspora and Friends of Africa",
    ],
    integrityModel:
      "Nine laureate positions across three pathways. Every nomination is reviewed by 27 independent Icon Judges — never by sponsors or organisers.",
    positioning:
      "Two decades. Three pathways. Nine laureates. One continental legacy.",
  },

  criteria: {
    intro:
      "Icon nominations are evaluated on sustained lifetime impact, evidence quality and continental reach.",
    pillars: [
      { title: "Sustained Impact", body: "Ten or more years of verified education contribution.", weight: "30%" },
      { title: "Scale & Reach", body: "Impact that crosses institutions, regions or borders.", weight: "25%" },
      { title: "Evidence Quality", body: "Third-party, citable and verifiable documentation.", weight: "25%" },
      { title: "Legacy & Influence", body: "Work that continues to shape African learning today.", weight: "20%" },
    ],
    evidence: [
      { label: "Career citation record", description: "Publications, curricula, programmes attributed to the nominee." },
      { label: "Independent testimonials", description: "Letters from institutions or beneficiaries — not self-issued." },
      { label: "Longitudinal outcomes", description: "Measurable learner or system outcomes over time." },
    ],
    disqualifiers: [
      "Self-nomination without independent evidence",
      "Impact under 10 years of continuous engagement",
      "Undisclosed conflicts of interest",
    ],
    timelineNote:
      "Icon nominations open 1 August 2026 and close 12 September 2026. Governance-approved laureates are announced at the NESA-Africa 2026 Recognition Gala on 22 October 2026 in Lagos.",
  },

  nominees: {
    directoryFilterKey: "africa-education-icon",
    directoryLabel: "Explore Africa Education Icon nominees",
    empty: "Icon nominations open 1 August 2026. Confirmed nominees will appear here as NRC verification completes.",
    highlight: "Two decades of laureates (2006–2026) are catalogued in the Impact Directory.",
  },

  nominate: {
    intro:
      "Nominate a lifetime Education Enabler for the Africa Education Icon Award. Nominations are public but Icon judging is fully independent.",
    steps: [
      "Choose the Icon pathway (Curriculum · Philanthropy · Technical).",
      "Submit citable evidence of 10+ years of impact.",
      "NRC verifies · 27 Icon Judges review · Governance approves.",
    ],
    ctaHref: "/nominate?tier=africa-education-icon",
    ctaLabel: "Start Icon Nomination",
    supportHref: "/awards/africa-education-icon",
    supportLabel: "See laureate archive",
  },

  seo: {
    about: {
      title: "About the Africa Education Icon Award | NESA-Africa 2026",
      description:
        "Africa's highest lifetime education honour: mission, pathways, and how the Icon Award recognises two decades of continental impact (2006–2026).",
    },
    criteria: {
      title: "Icon Award Criteria & Evidence | NESA-Africa 2026",
      description:
        "Evaluation pillars, evidence standards and disqualifiers for the Africa Education Icon Award. Governed by 27 independent Icon Judges.",
    },
    nominees: {
      title: "Africa Education Icon Nominees | NESA-Africa 2026",
      description:
        "Browse verified Icon nominees and laureates across Curriculum, Philanthropy and Technical Education pathways (2006–2026).",
    },
    nominate: {
      title: "Nominate for the Africa Education Icon Award | NESA-Africa 2026",
      description:
        "Nominate a lifetime Education Enabler for Africa's highest education honour. Evidence-based process, independent Icon judging.",
    },
  },
};

// ─── BLUE-GARNET ─────────────────────────────────────────────────────
const BLUE_GARNET: TierClusterConfig = {
  slug: "gold-blue-garnet",
  tierId: "blue-garnet",
  name: "Gold-Blue Garnet Awards",
  shortName: "Blue-Garnet",
  tagline: "Africa's competitive recognition for measurable education impact.",
  accent: "blue-garnet",

  about: {
    mission:
      "The Gold-Blue Garnet Awards recognise the corporate, NGO, EdTech, media and civic actors delivering measurable education impact across Africa in the 2026 cycle.",
    whoQualifies: [
      "Corporates and CSR programmes advancing education",
      "NGOs, foundations and EdTech scaling learning",
      "Media, creative and policy actors expanding access",
    ],
    integrityModel:
      "Two-stage flow: NRC evidence verification, then competitive judging against the Blue-Garnet 20-point rubric. Governance approves finalists.",
    positioning: "Nine competitive categories · Africa-wide · One 2026 cycle.",
  },

  criteria: {
    intro:
      "Blue-Garnet uses a deterministic 20-point rubric applied uniformly across all nine categories.",
    pillars: [
      { title: "Reach", body: "Number and diversity of learners impacted in the cycle.", weight: "5 pts" },
      { title: "Depth", body: "Quality and measurability of learning outcomes.", weight: "5 pts" },
      { title: "Innovation", body: "Novelty and scalability of the intervention.", weight: "4 pts" },
      { title: "Sustainability", body: "Financial and operational continuity.", weight: "3 pts" },
      { title: "Evidence", body: "Third-party documentation and audit trail.", weight: "3 pts" },
    ],
    evidence: [
      { label: "Impact report", description: "Signed 2025–2026 programme or impact report." },
      { label: "Third-party attestation", description: "Independent evaluator, auditor or partner statement." },
      { label: "Media / citation record", description: "Verifiable news, research or dataset references." },
    ],
    disqualifiers: [
      "Impact claims without third-party evidence",
      "Programmes outside the 2025–2026 cycle window",
      "Undisclosed conflicts of interest with judges",
    ],
    timelineNote:
      "Nominations open 1 August 2026, close 12 September 2026. Finalists announced 5 October 2026. Winners revealed at the Gala on 22 October 2026.",
  },

  nominees: {
    directoryFilterKey: "gold-blue-garnet",
    directoryLabel: "Explore Blue-Garnet nominees",
    empty: "Blue-Garnet nominations open 1 August 2026 across nine competitive categories.",
    highlight: "Every Blue-Garnet nominee is verified and scored against the same public rubric.",
  },

  nominate: {
    intro:
      "Nominate a corporate, NGO, EdTech, media or civic Education Enabler for Blue-Garnet 2026 competitive recognition.",
    steps: [
      "Pick one of the nine Blue-Garnet categories.",
      "Upload signed impact evidence for the 2025–2026 cycle.",
      "NRC verifies · Judges score · Governance approves finalists.",
    ],
    ctaHref: "/nominate?tier=gold-blue-garnet",
    ctaLabel: "Start Blue-Garnet Nomination",
    supportHref: "/awards/gold-blue-garnet",
    supportLabel: "See the nine categories",
  },

  seo: {
    about: {
      title: "About the Gold-Blue Garnet Awards | NESA-Africa 2026",
      description:
        "Africa's competitive recognition for measurable 2026 education impact — how Blue-Garnet works, who qualifies and how it is judged.",
    },
    criteria: {
      title: "Blue-Garnet Criteria & 20-Point Rubric | NESA-Africa 2026",
      description:
        "The public 20-point Blue-Garnet rubric: reach, depth, innovation, sustainability and evidence. Deterministic and auditable.",
    },
    nominees: {
      title: "Blue-Garnet Nominees & Finalists | NESA-Africa 2026",
      description:
        "Browse Blue-Garnet 2026 nominees across nine competitive categories, verified by NRC and scored on the public rubric.",
    },
    nominate: {
      title: "Nominate for Blue-Garnet 2026 | NESA-Africa",
      description:
        "Nominate a corporate, NGO, EdTech, media or civic Education Enabler for the 2026 Blue-Garnet competitive recognition.",
    },
  },
};

// ─── PLATINUM ────────────────────────────────────────────────────────
const PLATINUM: TierClusterConfig = {
  slug: "platinum-recognition",
  tierId: "platinum",
  name: "Platinum Recognition",
  shortName: "Platinum",
  tagline: "Institutional-tier recognition for systemic Education Enablers.",
  accent: "platinum",

  about: {
    mission:
      "Platinum Recognition honours the institutions — libraries, research bodies, faith-based education systems, states, international partners and diaspora institutions — whose systemic contribution enables Education for All.",
    whoQualifies: [
      "National and continental education institutions",
      "Faith-based education systems (Christian & Islamic)",
      "State governments, international partners, diaspora institutions",
    ],
    integrityModel:
      "Non-competitive institutional recognition. NRC verifies systemic evidence; governance approves. No head-to-head scoring.",
    positioning: "Seven institutional categories · Systemic · Non-competitive.",
  },

  criteria: {
    intro:
      "Platinum recognises institutions on systemic contribution, governance quality and enduring public benefit.",
    pillars: [
      { title: "Systemic Contribution", body: "Institutional role in advancing Education for All." },
      { title: "Governance & Transparency", body: "Verifiable governance, audits and reporting." },
      { title: "Public Benefit", body: "Enduring benefit to African learners and educators." },
      { title: "Partnership Readiness", body: "Ability to receive and mobilise post-recognition partnerships." },
    ],
    evidence: [
      { label: "Institutional profile", description: "Charter, governance and public reports." },
      { label: "Programme evidence", description: "Documented programmes with public outcomes." },
      { label: "Partner attestations", description: "Signed statements from partners or beneficiaries." },
    ],
    disqualifiers: [
      "Institutions under active governance sanction",
      "Missing or unverifiable public reporting",
      "Duplicate institutional records without consolidation",
    ],
    timelineNote:
      "Platinum institutional nominations open 1 August 2026 and close 12 September 2026. Recognised institutions are honoured at the Gala on 22 October 2026.",
  },

  nominees: {
    directoryFilterKey: "platinum-recognition",
    directoryLabel: "Explore Platinum nominees",
    empty: "Platinum institutional nominations open 1 August 2026 across seven categories.",
    highlight: "Platinum recognises institutions, not individuals — one recognised entity per institutional record.",
  },

  nominate: {
    intro:
      "Nominate an institution — library, research body, faith-based system, state, international partner or diaspora institution — for Platinum Recognition 2026.",
    steps: [
      "Choose the Platinum institutional category that fits.",
      "Attach charter, reports and third-party attestations.",
      "NRC verifies · Governance approves institutional recognition.",
    ],
    ctaHref: "/nominate?tier=platinum-recognition",
    ctaLabel: "Start Platinum Nomination",
    supportHref: "/awards/platinum-recognition",
    supportLabel: "See Platinum categories",
  },

  seo: {
    about: {
      title: "About Platinum Recognition | NESA-Africa 2026",
      description:
        "Institutional-tier recognition for systemic Education Enablers — libraries, research, faith-based, state, international and diaspora institutions.",
    },
    criteria: {
      title: "Platinum Criteria & Evidence | NESA-Africa 2026",
      description:
        "How Platinum Recognition evaluates institutions on systemic contribution, governance, public benefit and partnership readiness.",
    },
    nominees: {
      title: "Platinum Recognised Institutions | NESA-Africa 2026",
      description:
        "Browse Platinum-recognised institutions across seven institutional categories, verified by NRC and approved by governance.",
    },
    nominate: {
      title: "Nominate for Platinum Recognition | NESA-Africa 2026",
      description:
        "Nominate an institution for Platinum-tier recognition in the 2026 NESA-Africa Recognition cycle.",
    },
  },
};

// ─── INFLUENCER ──────────────────────────────────────────────────────
const INFLUENCER: TierClusterConfig = {
  slug: "influencer-education-impact",
  tierId: "influencer",
  name: "Influencer Education Impact Award",
  shortName: "Influencer",
  tagline: "Recognising public figures amplifying Education for All across Africa.",
  accent: "coral",

  about: {
    mission:
      "The Influencer Education Impact Award recognises the social-media creators, sports icons and music icons whose public voice materially advances education access, equity and outcomes across Africa.",
    whoQualifies: [
      "African social-media creators driving education campaigns",
      "African sports icons supporting education programmes",
      "African music icons championing learning access",
    ],
    integrityModel:
      "NRC impact verification → Governance approval. Reach alone does not qualify — evidence of education outcomes does.",
    positioning: "Three subcategories · Verified reach · Verified impact.",
  },

  criteria: {
    intro:
      "Influencer recognition is judged on documented education impact — not follower count.",
    pillars: [
      { title: "Education Outcomes", body: "Documented learner, campaign or programme outcomes." },
      { title: "Verified Reach", body: "Third-party analytics on audience and engagement." },
      { title: "Sustained Advocacy", body: "12+ months of consistent education advocacy." },
      { title: "Integrity", body: "No paid-for-recognition or vote-purchase behaviour." },
    ],
    evidence: [
      { label: "Analytics report", description: "Verified engagement and reach report." },
      { label: "Programme partnerships", description: "Signed partnership or programme documentation." },
      { label: "Outcome citations", description: "Independent citations attributing outcomes to the influencer." },
    ],
    disqualifiers: [
      "Purchased followers, engagement or votes",
      "Content promoting misinformation about education",
      "Undisclosed brand relationships in submitted evidence",
    ],
    timelineNote:
      "Influencer nominations open 1 August 2026, close 12 September 2026. Recognised influencers appear on the NESA-Africa Recognition Gala broadcast on 22 October 2026.",
  },

  nominees: {
    directoryFilterKey: "influencer-education-impact",
    directoryLabel: "Explore Influencer nominees",
    empty: "Influencer nominations open 1 August 2026 across the three subcategories.",
    highlight: "Verified reach + verified education outcomes — never reach alone.",
  },

  nominate: {
    intro:
      "Nominate a social-media, sports or music icon whose public voice is measurably advancing Education for All across Africa.",
    steps: [
      "Pick the Influencer subcategory (Social · Sports · Music).",
      "Attach analytics and independent outcome citations.",
      "NRC verifies impact · Governance approves recognition.",
    ],
    ctaHref: "/nominate?tier=influencer-education-impact",
    ctaLabel: "Start Influencer Nomination",
    supportHref: "/awards/influencer-education-impact/nominees",
    supportLabel: "See current nominees",
  },

  seo: {
    about: {
      title: "About the Influencer Education Impact Award | NESA-Africa 2026",
      description:
        "How NESA-Africa recognises social-media, sports and music icons whose public voice measurably advances Education for All across Africa.",
    },
    criteria: {
      title: "Influencer Award Criteria & Evidence | NESA-Africa 2026",
      description:
        "Documented outcomes over follower count — the evidence, pillars and disqualifiers for Influencer Education Impact Recognition.",
    },
    nominees: {
      title: "Influencer Education Impact Nominees | NESA-Africa 2026",
      description:
        "Browse verified Influencer nominees across social-media, sports and music icon subcategories.",
    },
    nominate: {
      title: "Nominate an Influencer for Education Impact | NESA-Africa 2026",
      description:
        "Nominate an African social-media creator, sports icon or music icon whose voice is advancing Education for All.",
    },
  },
};

export const TIER_CLUSTERS: TierClusterConfig[] = [ICON, BLUE_GARNET, PLATINUM, INFLUENCER];

export const TIER_CLUSTER_MAP: Record<string, TierClusterConfig> = Object.fromEntries(
  TIER_CLUSTERS.map((t) => [t.slug, t]),
);

export function getTierCluster(slug: string | undefined): TierClusterConfig | undefined {
  if (!slug) return undefined;
  return TIER_CLUSTER_MAP[slug];
}

export const TIER_INTEGRITY_LINE = INTEGRITY_LINE;

export const TIER_SUBPAGES: Array<{ key: TierSubpage; label: string; path: string }> = [
  { key: "overview", label: "Overview", path: "" },
  { key: "about", label: "About", path: "about" },
  { key: "criteria", label: "Criteria", path: "criteria" },
  { key: "nominees", label: "Nominees", path: "nominees" },
  { key: "nominate", label: "Nominate", path: "nominate" },
];
