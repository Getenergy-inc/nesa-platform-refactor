// subpages2026.ts — source of truth for all 22 NESA-Africa 2026 award subpages.
//
// The registry is generated from the canonical category taxonomy in
// `src/config/recognition2026/categories/index.ts` so we never fork content:
//   • Africa Education Icon     → 3 subpages (3 subcategories of the Icon category)
//   • Influencer Education Impact → 3 subpages (3 subcategories of the Influencer category)
//   • Platinum Recognition        → 7 subpages (one per Platinum category)
//   • Gold-Blue Garnet Recognition → 9 subpages (one per GBG category)
// Total: 22.
//
// The template renders each subpage. Copy overrides live in `OVERRIDES` below —
// use them to sharpen hero copy or examples without duplicating structure.

import type {
  AwardSubpageContent,
  SubpageFaq,
  SubpageStep,
} from "@/components/awards/subpage/AwardSubpageTemplate";
import {
  CATEGORIES,
  type CategoryDefinition,
  type SubcategoryDef,
} from "@/config/recognition2026/categories";
import type { TierSlug } from "@/config/recognition2026/tiers";
import { getSubpageHeroImage } from "@/config/awards/subpageHeroImages";

// ── Shared building blocks ──────────────────────────────────────────────────

const INTEGRITY_2026 =
  "NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, Gala tickets, merchandise, endorsements, GFAwzip Wallet transactions, AGC Participation Credits, follower numbers and public popularity do not influence verification or recognition.";

const DEFAULT_STEPS: SubpageStep[] = [
  { title: "Nominate", description: "Submit the nominee with verifiable evidence of impact." },
  { title: "NRC verification", description: "The Nominee Review Committee validates documents and citations." },
  { title: "Independent assessment", description: "Assigned reviewers score against the published EDI matrix." },
  { title: "Governance approval", description: "The Governance Board ratifies verified Education Enablers." },
  { title: "Recognition", description: "Enablers are announced and honoured at the 2026 Recognition Edition." },
];

const DEFAULT_FAQS: SubpageFaq[] = [
  { q: "Is public voting used?", a: "No. Recognition is verified by the NRC, independent reviewers and the Governance Board." },
  { q: "Who can submit a nomination?", a: "Any verified NESA.Africa account holder — institutions, peers, alumni networks, chapters, or the nominee themselves." },
  { q: "What evidence is required?", a: "Independently verifiable citations, letters of endorsement, programme reports and impact records." },
  { q: "Is there a nomination fee?", a: "No. Nomination is free. Verified Enablers may opt into a paid profile upgrade." },
  { q: "When does nomination close?", a: "Category-specific dates apply. See the timeline for the current window." },
];

const TIER_LABEL: Record<TierSlug, string> = {
  "africa-education-icon": "Africa Education Icon",
  "influencer-education-impact": "Influencer Education Impact",
  platinum: "Platinum Recognition",
  "gold-blue-garnet": "Gold-Blue Garnet Recognition",
};

const TIER_NOTICE_KIND: Record<TierSlug, AwardSubpageContent["notice"] extends infer T
  ? T extends { kind: infer K } ? K : never : never> = {
  "africa-education-icon": "icon",
  "influencer-education-impact": "impact-based",
  platinum: "jury-only",
  "gold-blue-garnet": "recognition",
};

const GEOGRAPHY_REGIONS: Record<CategoryDefinition["geographyModel"], string[]> = {
  ICON_CLASSIFICATION: [
    "African in Africa",
    "Diaspora African",
    "Friend of Africa",
  ],
  AFRICA_REGION_COUNTRY: [
    "West Africa",
    "East Africa",
    "Central Africa",
    "Southern Africa",
    "North Africa",
    "Horn of Africa",
    "Sahel",
    "Indian Ocean Africa",
  ],
  MULTI_COUNTRY_AFRICA: ["Multi-country (≥2 African countries)", "Continental reach"],
  NIGERIA_STATE_ZONE: ["Nigeria (36 states + FCT)", "6 geopolitical zones"],
  NIGERIA_STATE_ONLY: ["Nigeria (36 states + FCT)"],
  INTERNATIONAL_PARTNERSHIP: ["Africa + international partner country", "Multi-country African footprint"],
  DIASPORA_COUNTRY_IMPACT: ["Diaspora country of residence", "African country of programme impact"],
};

// ── Overrides for hero examples per tier ────────────────────────────────────

const EXAMPLES_BY_TIER: Record<TierSlug, { title: string; body: string }[]> = {
  "africa-education-icon": [
    { title: "Institution building", body: "Founded or transformed an institution still operating and independently governed." },
    { title: "Continental reach", body: "Documented programme impact across at least three African countries." },
    { title: "Legacy leadership", body: "Twenty or more verifiable years of sustained education contribution." },
    { title: "Curriculum influence", body: "Curriculum or policy adopted by ministries, universities or exam boards." },
  ],
  "influencer-education-impact": [
    { title: "Scholarships raised", body: "Verified funds mobilised for African learners through campaigns." },
    { title: "Schools supported", body: "Documented partnerships and programme delivery in African schools." },
    { title: "Campaign outcomes", body: "Independent evidence of behaviour, enrolment or policy change." },
    { title: "Beneficiary reach", body: "Auditable records of learners, teachers or institutions supported." },
  ],
  platinum: [
    { title: "Documented outcomes", body: "Independent evaluations, safeguarding standards and public reporting." },
    { title: "Institutional legitimacy", body: "Registered entity with published governance and financial disclosures." },
    { title: "Partnership evidence", body: "Signed agreements, MoUs and letters from partner institutions." },
    { title: "Sustained delivery", body: "Continuous programme operation with year-on-year outputs." },
  ],
  "gold-blue-garnet": [
    { title: "Reach at scale", body: "Country or multi-country footprint with independent monitoring data." },
    { title: "Verifiable delivery", body: "Publicly available reports, audits and beneficiary evidence." },
    { title: "Inclusion focus", body: "Documented reach for girls, rural learners and vulnerable groups." },
    { title: "Systems change", body: "Contributions to policy, curriculum or ministry-level adoption." },
  ],
};

const WHO_CAN_NOMINATE_DEFAULT = [
  "Verified NESA.Africa account holders",
  "Institutions, alumni networks and chapters",
  "Peers, mentees and partner organisations",
  "The nominee themselves (self-nomination is permitted)",
];

// ── Generators ──────────────────────────────────────────────────────────────

function buildBreadcrumbs(
  tier: TierSlug,
  tierLabel: string,
  slug: string,
  name: string,
): AwardSubpageContent["breadcrumbs"] {
  return [
    { name: "Home", path: "/" },
    { name: "Recognition", path: "/recognition" },
    { name: tierLabel, path: `/recognition/${tier}` },
    { name, path: `/recognition/subpage/${slug}` },
  ];
}

function fromCategory(cat: CategoryDefinition): AwardSubpageContent {
  const tierLabel = TIER_LABEL[cat.tier];
  const slug = cat.slug; // category slug is globally unique in this registry
  const nominateHref = `/nominate?tier=${cat.tier}&category=${cat.slug}`;
  const directoryHref = `/nominees?tier=${cat.tier}&category=${cat.slug}`;

  return {
    slug,
    tier: cat.tier,
    parentTierHref: `/recognition/${cat.tier}`,
    parentTierLabel: tierLabel,

    seoTitle: cat.seo.title,
    metaDescription: cat.seo.description,
    canonicalPath: `/recognition/subpage/${slug}`,
    breadcrumbs: buildBreadcrumbs(cat.tier, tierLabel, slug, cat.shortName),

    hero: {
      eyebrow: `${tierLabel} · Enablers of Education for All Across Africa`,
      title: cat.name,
      lede: cat.summary,
      primary: { label: "Nominate an Education Enabler", href: nominateHref },
      secondary: { label: "Explore verified Enablers", href: directoryHref },
      imageSrc: getSubpageHeroImage(slug),
      imageAlt: `${cat.name} — Enablers of Education for All Across Africa`,
    },
    notice: {
      kind: TIER_NOTICE_KIND[cat.tier],
      body: "Recognition is determined by NRC verification, independent assessment and governance ratification.",
    },

    recognises: {
      body: cat.overview,
      highlights: cat.evidenceRequired,
    },
    whoItsFor: {
      canBeNominated: [
        ...cat.eligibility,
        `Nominee types: ${cat.nomineeTypes.join(", ")}`,
      ],
      whoCanNominate: WHO_CAN_NOMINATE_DEFAULT,
    },
    examples: { items: EXAMPLES_BY_TIER[cat.tier] },
    geography: {
      body: `Geography model: ${cat.geographyModel.replace(/_/g, " ").toLowerCase()}.`,
      regions: GEOGRAPHY_REGIONS[cat.geographyModel],
    },
    featured: {
      exploreAllHref: directoryHref,
      exploreAllLabel: `Explore all ${cat.shortName} Enablers`,
      nominees: [],
    },
    howItWorks: {
      steps: cat.reviewRoute.length
        ? [
            { title: "Nominate", description: "Submit the nominee with verifiable evidence of impact." },
            ...cat.reviewRoute.map((r) => ({ title: r, description: `Stage: ${r}.` })),
          ].slice(0, 6)
        : DEFAULT_STEPS,
    },
    integrity: { body: INTEGRITY_2026 },
    faqs: DEFAULT_FAQS,
    finalCta: {
      heading: `Recognise an Enabler of ${cat.shortName}`,
      body: "Submit a fully evidenced nomination. NRC review begins as soon as evidence is complete.",
      primary: { label: "Nominate now", href: nominateHref },
      secondary: { label: "See existing nominees", href: directoryHref },
    },
  };
}

function fromSubcategory(
  parent: CategoryDefinition,
  sub: SubcategoryDef,
): AwardSubpageContent {
  const tierLabel = TIER_LABEL[parent.tier];
  const slug = sub.code.toLowerCase().replace(/[^a-z0-9]+/g, "-"); // e.g. icon-phil → icon-phil
  const nominateHref = `/nominate?tier=${parent.tier}&category=${parent.slug}&subcategory=${sub.code}`;
  const directoryHref = `/nominees?tier=${parent.tier}&category=${parent.slug}&subcategory=${sub.code}`;

  return {
    slug,
    tier: parent.tier,
    parentTierHref: `/recognition/${parent.tier}`,
    parentTierLabel: tierLabel,

    seoTitle: `${sub.name} | NESA-Africa 2026`,
    metaDescription: sub.description,
    canonicalPath: `/recognition/subpage/${slug}`,
    breadcrumbs: buildBreadcrumbs(parent.tier, tierLabel, slug, sub.name),

    hero: {
      eyebrow: `${tierLabel} · ${parent.shortName}`,
      title: sub.name,
      lede: sub.description,
      primary: { label: "Nominate an Education Enabler", href: nominateHref },
      secondary: { label: "Explore verified Enablers", href: directoryHref },
      imageSrc: getSubpageHeroImage(slug),
      imageAlt: `${sub.name} — ${parent.shortName}`,
    },
    notice: {
      kind: TIER_NOTICE_KIND[parent.tier],
      body: "Recognition is determined by NRC verification, independent assessment and governance ratification.",
    },

    recognises: {
      body: sub.description,
      highlights: [sub.evidenceSummary, ...parent.evidenceRequired.slice(0, 3)],
    },
    whoItsFor: {
      canBeNominated: [
        ...parent.eligibility,
        `Nominee types: ${sub.nomineeTypes.join(", ")}`,
      ],
      whoCanNominate: WHO_CAN_NOMINATE_DEFAULT,
    },
    examples: { items: EXAMPLES_BY_TIER[parent.tier] },
    geography: {
      body: `Geography model: ${parent.geographyModel.replace(/_/g, " ").toLowerCase()}.`,
      regions: GEOGRAPHY_REGIONS[parent.geographyModel],
    },
    featured: {
      exploreAllHref: directoryHref,
      exploreAllLabel: `Explore all ${sub.name} Enablers`,
      nominees: [],
    },
    howItWorks: {
      steps: [
        { title: "Nominate", description: "Submit the nominee with verifiable evidence of impact." },
        ...parent.reviewRoute.map((r) => ({ title: r, description: `Stage: ${r}.` })),
      ].slice(0, 6),
    },
    integrity: { body: INTEGRITY_2026 },
    faqs: DEFAULT_FAQS,
    finalCta: {
      heading: `Recognise an Enabler — ${sub.name}`,
      body: "Submit a fully evidenced nomination. NRC review begins as soon as evidence is complete.",
      primary: { label: "Nominate now", href: nominateHref },
      secondary: { label: "See existing nominees", href: directoryHref },
    },
  };
}

// ── Build the 22 ────────────────────────────────────────────────────────────

function buildAllSubpages(): AwardSubpageContent[] {
  const list: AwardSubpageContent[] = [];

  for (const cat of CATEGORIES) {
    if (cat.tier === "africa-education-icon" || cat.tier === "influencer-education-impact") {
      // 3 subpages per tier — one per subcategory
      for (const sub of cat.subcategories) {
        list.push(fromSubcategory(cat, sub));
      }
    } else {
      // Platinum & Gold-Blue Garnet: 1 subpage per category
      list.push(fromCategory(cat));
    }
  }

  return list;
}

export const SUBPAGES_2026: AwardSubpageContent[] = buildAllSubpages();

export function getSubpage(slug: string): AwardSubpageContent | undefined {
  return SUBPAGES_2026.find((s) => s.slug === slug);
}

export function listSubpagesForTier(tier: TierSlug): AwardSubpageContent[] {
  return SUBPAGES_2026.filter((s) => s.tier === tier);
}

// Runtime assertion: catch drift from the 22-subpage spec early.
if (typeof console !== "undefined") {
  const counts = SUBPAGES_2026.reduce<Record<string, number>>((acc, s) => {
    acc[s.tier] = (acc[s.tier] ?? 0) + 1;
    return acc;
  }, {});
  const expected = { "africa-education-icon": 3, "influencer-education-impact": 3, platinum: 7, "gold-blue-garnet": 9 };
  for (const [tier, want] of Object.entries(expected)) {
    if ((counts[tier] ?? 0) !== want) {
      // eslint-disable-next-line no-console
      console.warn(
        `[subpages2026] tier ${tier} has ${counts[tier] ?? 0} subpages, expected ${want}. Update src/config/recognition2026/categories to match the 22-page spec.`,
      );
    }
  }
}
