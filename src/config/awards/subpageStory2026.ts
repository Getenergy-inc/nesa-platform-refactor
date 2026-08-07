// subpageStory2026.ts — narrative ("the story of this category under its tier"),
// pathway/subcategory cards and the category video advert for each of the
// 22 NESA-Africa 2026 award category pages.
//
// Every string is generated from the canonical taxonomy so the pages can never
// drift from `src/config/recognition2026/categories`.

import type { TierSlug } from "@/config/recognition2026/tiers";
import type {
  CategoryDefinition,
  SubcategoryDef,
} from "@/config/recognition2026/categories";
import { getSubcategoryImage } from "@/config/awards/subcategoryImages";
import type { SubpageVideo } from "@/components/awards/subpage/AwardSubpageBlocks";

export interface StoryChapter {
  heading: string;
  body: string;
}

export interface AwardStory {
  eyebrow: string;
  headline: string;
  standfirst: string;
  chapters: StoryChapter[];
}

export interface PathwayCard {
  code: string;
  name: string;
  description: string;
  image: string;
  evidence?: string;
  nominateHref: string;
  directoryHref: string;
}

// ── Tier narrative frames ────────────────────────────────────────────────────

const TIER_FRAME: Record<
  TierSlug,
  { label: string; promise: string; standard: string; route: string }
> = {
  "africa-education-icon": {
    label: "Africa Education Icon",
    promise:
      "the continent's highest lifetime honour for Enablers of Education for All Across Africa — two decades of work, one enduring legacy",
    standard:
      "Icon recognition is not awarded for a good year. It is awarded for twenty years of documented, independently verifiable contribution that changed institutions, curricula or the life-chances of learners at continental scale.",
    route:
      "Nomination → NRC verification → Icon Jury assessment → Governance Board ratification → Hall of Fame induction at the 13 December 2026 Gala.",
  },
  "influencer-education-impact": {
    label: "Influencer Education Impact",
    promise:
      "recognition for public voices who converted attention into classrooms, scholarships and measurable learning outcomes",
    standard:
      "Audience size is context, never a score. What is assessed is what the platform produced: funds mobilised, schools supported, learners reached and campaigns with independently confirmed outcomes.",
    route:
      "Nomination → NRC verification of every outcome claimed → independent assessment against the published EDI matrix → Governance Board ratification.",
  },
  platinum: {
    label: "Platinum Recognition",
    promise:
      "institutional recognition for organisations whose governance, safeguarding and delivery set the standard for African education",
    standard:
      "Platinum is jury-determined and institution-facing. Nominees must be registered, governed and accountable, with published reporting and evidence of sustained delivery — not a single flagship project.",
    route:
      "Nomination → NRC verification → independent institutional assessment → Governance Board ratification. There is no public vote in this tier.",
  },
  "gold-blue-garnet": {
    label: "Gold-Blue Garnet Recognition",
    promise:
      "recognition for delivery at scale — the programmes, platforms and public bodies moving Education for All from ambition to arithmetic",
    standard:
      "Gold-Blue Garnet rewards documented reach. Monitoring data, evaluations, audited reports and beneficiary records are the currency; every country claimed must be evidenced separately.",
    route:
      "Nomination → NRC verification → independent assessment against the category EDI matrix → Governance Board ratification.",
  },
};

// ── Category videos (YouTube IDs only) ───────────────────────────────────────

const TIER_VIDEO: Record<TierSlug, string> = {
  "africa-education-icon": "Hdu_qlFLfrQ",
  "influencer-education-impact": "aP0SskrfioI",
  platinum: "nQCXDX_X3rs",
  "gold-blue-garnet": "DDREAU_bmRk",
};

const SLUG_VIDEO: Record<string, string> = {
  "icon-phil": "Hdu_qlFLfrQ",
  "icon-lit": "Hdu_qlFLfrQ",
  "icon-tech": "Hdu_qlFLfrQ",
  "inf-soc": "aP0SskrfioI",
  "inf-spt": "aP0SskrfioI",
  "inf-mus": "aP0SskrfioI",
};

export function getCategoryVideos(
  tier: TierSlug,
  slug: string,
  name: string,
): { heading: string; items: SubpageVideo[] } {
  const videoId = SLUG_VIDEO[slug] ?? TIER_VIDEO[tier];
  return {
    heading: `${name} — category film`,
    items: [
      {
        videoId,
        title: `${name} · NESA-Africa 2026`,
        description:
          "Enablers of Education for All Across Africa — how this recognition is verified, assessed and honoured.",
      },
      {
        videoId: TIER_VIDEO[tier],
        title: `${TIER_FRAME[tier].label} — tier overview`,
        description: "The recognition standard, review route and governance firewall for this tier.",
      },
    ].filter((v, i, arr) => arr.findIndex((x) => x.videoId === v.videoId) === i),
  };
}

// ── Story builders ───────────────────────────────────────────────────────────

export function buildCategoryStory(cat: CategoryDefinition): AwardStory {
  const frame = TIER_FRAME[cat.tier];
  return {
    eyebrow: `${frame.label} · The story of this recognition`,
    headline: cat.shortName,
    standfirst: `${cat.name} sits inside ${frame.label} — ${frame.promise}.`,
    chapters: [
      { heading: "Why this category exists", body: cat.overview },
      { heading: `The ${frame.label} standard`, body: frame.standard },
      {
        heading: "What is inside this category",
        body: cat.subcategories.length
          ? `${cat.shortName} is delivered through ${cat.subcategories.length} recognised ${
              cat.subcategories.length === 1 ? "pathway" : "subcategories and pathways"
            }, each with its own evidence bar and its own scoring line in the EDI matrix. Choose the one that matches the nominee's work — the NRC will reclassify if a better fit exists.`
          : `${cat.shortName} is assessed as a single recognition pathway against the published EDI matrix.`,
      },
      { heading: "How recognition is reached", body: frame.route },
    ],
  };
}

export function buildSubcategoryStory(
  parent: CategoryDefinition,
  sub: SubcategoryDef,
): AwardStory {
  const frame = TIER_FRAME[parent.tier];
  return {
    eyebrow: `${frame.label} · The story of this pathway`,
    headline: sub.name,
    standfirst: `${sub.name} is a standalone pathway of ${parent.shortName} — ${frame.promise}.`,
    chapters: [
      { heading: "Why this pathway exists", body: sub.description },
      { heading: `The ${frame.label} standard`, body: frame.standard },
      {
        heading: "Evidence that counts",
        body: `${sub.evidenceSummary} Claims are checked line by line by the Nominee Review Committee before any assessment begins.`,
      },
      { heading: "How recognition is reached", body: frame.route },
    ],
  };
}

// ── Pathway cards ────────────────────────────────────────────────────────────

export function buildCategoryPathways(cat: CategoryDefinition): {
  heading: string;
  label: string;
  intro: string;
  items: PathwayCard[];
} {
  const items = cat.subcategories.map((sub) => ({
    code: sub.code,
    name: sub.name,
    description: sub.description,
    evidence: sub.evidenceSummary,
    image: getSubcategoryImage(sub.code, sub.name, [cat.slug, cat.tier]),
    nominateHref: `#nominate`,
    directoryHref: `/nominees?tier=${cat.tier}&category=${cat.slug}&subcategory=${sub.code}`,
  }));

  return {
    heading: `Subcategories & pathways of ${cat.shortName}`,
    label: "Subcategory",
    intro:
      "Every subcategory below is nominated through the same tailored form on this page — select it in step 1 of the form.",
    items,
  };
}

const ICON_CLASSES = [
  {
    code: "africa-resident",
    name: "African in Africa",
    description:
      "Nominees living and working on the continent whose lifetime contribution was delivered from within Africa.",
  },
  {
    code: "diaspora",
    name: "Diaspora African",
    description:
      "African-heritage nominees based outside the continent whose sustained work materially advanced African education.",
  },
  {
    code: "friend-of-africa",
    name: "Friend of Africa",
    description:
      "Non-African individuals and institutions whose long-term investment in African education is independently documented.",
  },
];

export function buildClassificationPathways(
  parent: CategoryDefinition,
  sub: SubcategoryDef,
): { heading: string; label: string; intro: string; items: PathwayCard[] } {
  const items = ICON_CLASSES.map((c) => ({
    code: c.code,
    name: c.name,
    description: c.description,
    image: getSubcategoryImage(c.code, `${c.name} ${sub.name}`, [sub.code.toLowerCase(), parent.slug, parent.tier]),
    nominateHref: "#nominate",
    directoryHref: `/nominees?tier=${parent.tier}&category=${parent.slug}&subcategory=${sub.code}&class=${c.code}`,
  }));

  return {
    heading: `Recognition classifications for ${sub.name}`,
    label: "Classification",
    intro:
      "This pathway has no subcategories beneath it. Instead, nominees are recognised under one of three classifications — select yours in step 1 of the form.",
    items,
  };
}
