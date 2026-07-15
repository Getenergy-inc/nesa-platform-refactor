// subpages2026.ts — source of truth for all 22 NESA-Africa 2026 award subpages.
// Each entry drives the reusable <AwardSubpageTemplate />.
//
// Structure (per §9 of the 22-page master architecture):
//   Africa Education Icon      → 3 subpages
//   Influencer Education Impact → 3 subpages
//   Gold-Blue Garnet Recognition → 9 subpages
//   Platinum Recognition         → 7 subpages
//
// This file seeds the template contract with the tier hero + 2 canonical
// examples per tier so Phase C (all 22) can be filled in without touching
// the template itself. New subpages: append to `SUBPAGES_2026`.

import type { AwardSubpageContent } from "@/components/awards/subpage/AwardSubpageTemplate";

const INTEGRITY_2026 =
  "NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, Gala tickets, merchandise, endorsements, GFAwzip Wallet transactions, AGC Participation Credits, follower numbers and public popularity do not influence verification or recognition.";

const DEFAULT_STEPS = [
  { title: "Nominate", description: "Submit the nominee with verifiable evidence of impact." },
  { title: "NRC verification", description: "The Nominee Review Committee validates documents and citations." },
  { title: "Independent assessment", description: "Assigned reviewers score against the published EDI matrix." },
  { title: "Governance approval", description: "The Governance Board ratifies verified Education Enablers." },
  { title: "Recognition", description: "Enablers are announced and honoured at the 2026 Recognition Edition." },
];

const AFRICA_REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Horn of Africa",
  "Sahel",
  "Indian Ocean Africa",
  "Diaspora",
];

// ── Africa Education Icon (3 subpages) ──────────────────────────────────────

const iconAfrican: AwardSubpageContent = {
  slug: "icon-african-in-africa",
  tier: "africa-education-icon",
  parentTierHref: "/recognition/africa-education-icon",
  parentTierLabel: "Africa Education Icon",
  seoTitle: "Africa Education Icon — African in Africa | NESA-Africa 2026",
  metaDescription:
    "Lifetime recognition (2006–2026) for Africans on the continent whose legacy has transformed education across Africa.",
  canonicalPath: "/recognition/africa-education-icon/african-in-africa",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Recognition", path: "/recognition" },
    { name: "Africa Education Icon", path: "/recognition/africa-education-icon" },
    { name: "African in Africa", path: "/recognition/africa-education-icon/african-in-africa" },
  ],
  hero: {
    eyebrow: "Africa Education Icon · 2006–2026",
    title: "African in Africa — Lifetime Education Enablers",
    lede: "Twenty years of transformative work by Africans on the continent. Verified impact only — no public voting.",
    primary: { label: "Nominate an Education Enabler", href: "/nominate?tier=africa-education-icon&class=african-in-africa" },
    secondary: { label: "Explore the Hall of Fame", href: "/nominees?tier=africa-education-icon&class=african-in-africa" },
  },
  notice: {
    kind: "no-voting",
    heading: "Icon awards are jury-verified",
    body: "Recognition is determined by NRC verification, independent assessment and governance ratification.",
  },
  recognises: {
    body: "Individuals born in and based on the African continent whose careers demonstrate two decades or more of measurable impact on learning access, quality or systems.",
    highlights: [
      "20+ years of documented education impact",
      "Continental or multi-country reach",
      "Independently verifiable citations",
      "Alignment with SDG 4 and AU Agenda 2063",
    ],
  },
  whoItsFor: {
    canBeNominated: [
      "Africans (by birth or naturalisation) resident in Africa",
      "Educators, founders, policymakers, philanthropists, researchers",
      "Living nominees only",
    ],
    whoCanNominate: [
      "Any verified account holder on NESA.Africa",
      "Institutions, alumni networks, chapters and peers",
    ],
  },
  examples: {
    items: [
      { title: "Systems reform", description: "Led national or continental curriculum, teacher or finance reform.", body: "Led national or continental curriculum, teacher or finance reform." } as any,
      { title: "Access at scale", body: "Founded or scaled programmes reaching 100,000+ learners across borders." },
      { title: "Research legacy", body: "Sustained peer-reviewed contributions cited across African universities." },
      { title: "Institution building", body: "Founded or transformed institutions still operating and independently governed." },
    ].map(({ title, body }) => ({ title, body })),
  },
  geography: {
    body: "Impact evidence must span multiple African countries or demonstrate national scale over at least two decades.",
    regions: AFRICA_REGIONS.filter((r) => r !== "Diaspora"),
  },
  featured: {
    exploreAllHref: "/nominees?tier=africa-education-icon&class=african-in-africa",
    exploreAllLabel: "Explore all Icon nominees",
    nominees: [],
  },
  howItWorks: { steps: DEFAULT_STEPS },
  integrity: { body: INTEGRITY_2026 },
  faqs: [
    { q: "Is public voting used?", a: "No. Icon recognition is verified by the NRC, an independent jury and the Governance Board." },
    { q: "Are posthumous nominations accepted?", a: "Not for the 2026 edition. Living nominees only." },
    { q: "How much evidence is required?", a: "A minimum of five independently verifiable citations spanning at least two decades." },
    { q: "Can family members nominate?", a: "Yes, provided the evidence submitted is independent and verifiable." },
    { q: "What is the outcome?", a: "Verified Enablers are announced at the 2026 Recognition Edition and enter the permanent Hall of Fame." },
  ],
  finalCta: {
    heading: "Recognise a lifetime of Education Enablement",
    body: "Submit a fully evidenced nomination for a living African Enabler. NRC review begins as soon as evidence is complete.",
    primary: { label: "Nominate now", href: "/nominate?tier=africa-education-icon&class=african-in-africa" },
    secondary: { label: "See the Icon Hall of Fame", href: "/nominees?tier=africa-education-icon" },
  },
};

const iconDiaspora: AwardSubpageContent = {
  ...iconAfrican,
  slug: "icon-diaspora-african",
  parentTierHref: "/recognition/africa-education-icon",
  seoTitle: "Africa Education Icon — Diaspora African | NESA-Africa 2026",
  metaDescription:
    "Lifetime recognition for Diaspora Africans whose sustained work has transformed education outcomes on the continent.",
  canonicalPath: "/recognition/africa-education-icon/diaspora-african",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Recognition", path: "/recognition" },
    { name: "Africa Education Icon", path: "/recognition/africa-education-icon" },
    { name: "Diaspora African", path: "/recognition/africa-education-icon/diaspora-african" },
  ],
  hero: {
    ...iconAfrican.hero,
    title: "Diaspora African — Lifetime Education Enablers",
    lede: "Africans in the Diaspora whose two-decade legacy has measurably advanced education on the continent.",
    primary: { label: "Nominate an Enabler", href: "/nominate?tier=africa-education-icon&class=diaspora-african" },
    secondary: { label: "Explore Diaspora Icons", href: "/nominees?tier=africa-education-icon&class=diaspora-african" },
  },
  whoItsFor: {
    canBeNominated: [
      "African-born or heritage Africans resident outside the continent",
      "Sustained programme, philanthropy or research contributions returning to Africa",
      "Living nominees only",
    ],
    whoCanNominate: iconAfrican.whoItsFor.whoCanNominate,
  },
  geography: {
    body: "Diaspora nominees must demonstrate documented programme reach or investment across at least two African countries.",
    regions: AFRICA_REGIONS,
  },
  featured: {
    exploreAllHref: "/nominees?tier=africa-education-icon&class=diaspora-african",
    exploreAllLabel: "Explore all Diaspora Icons",
    nominees: [],
  },
  finalCta: {
    ...iconAfrican.finalCta,
    primary: { label: "Nominate now", href: "/nominate?tier=africa-education-icon&class=diaspora-african" },
  },
};

const iconFriend: AwardSubpageContent = {
  ...iconAfrican,
  slug: "icon-friend-of-africa",
  seoTitle: "Africa Education Icon — Friend of Africa | NESA-Africa 2026",
  metaDescription:
    "Lifetime recognition for global Enablers, not of African heritage, whose sustained work has advanced African education.",
  canonicalPath: "/recognition/africa-education-icon/friend-of-africa",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Recognition", path: "/recognition" },
    { name: "Africa Education Icon", path: "/recognition/africa-education-icon" },
    { name: "Friend of Africa", path: "/recognition/africa-education-icon/friend-of-africa" },
  ],
  hero: {
    ...iconAfrican.hero,
    title: "Friend of Africa — Lifetime Education Enablers",
    lede: "Global partners whose sustained, verifiable work has advanced education for all across Africa.",
    primary: { label: "Nominate a Friend of Africa", href: "/nominate?tier=africa-education-icon&class=friend-of-africa" },
    secondary: { label: "See past honourees", href: "/nominees?tier=africa-education-icon&class=friend-of-africa" },
  },
  whoItsFor: {
    canBeNominated: [
      "Non-African individuals with 20+ years of documented commitment to African education",
      "Educators, philanthropists, researchers, policy advisors",
    ],
    whoCanNominate: iconAfrican.whoItsFor.whoCanNominate,
  },
  featured: {
    exploreAllHref: "/nominees?tier=africa-education-icon&class=friend-of-africa",
    exploreAllLabel: "Explore all Friends of Africa",
    nominees: [],
  },
  finalCta: {
    ...iconAfrican.finalCta,
    primary: { label: "Nominate now", href: "/nominate?tier=africa-education-icon&class=friend-of-africa" },
  },
};

// ── Public registry ────────────────────────────────────────────────────────

export const SUBPAGES_2026: AwardSubpageContent[] = [
  iconAfrican,
  iconDiaspora,
  iconFriend,
  // Phase C: append Influencer (3), Gold-Blue Garnet (9), Platinum (7).
];

export function getSubpage(slug: string): AwardSubpageContent | undefined {
  return SUBPAGES_2026.find((s) => s.slug === slug);
}

export function listSubpagesForTier(tier: AwardSubpageContent["tier"]): AwardSubpageContent[] {
  return SUBPAGES_2026.filter((s) => s.tier === tier);
}
