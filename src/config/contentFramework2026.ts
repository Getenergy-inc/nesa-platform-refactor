// Approved copy from the NESA-Africa 2026–2027 Website Content, CTA and
// Participation Framework (13 Nov 2026). Presentation only.
import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";
import { PROGRAMME_END_LONG_LABEL } from "@/config/programme";

export interface FwCta { label: string; href: string; external?: boolean }

export const NOMINATE: FwCta = { label: "Submit a Nomination", href: OFFICIAL_NOMINATION_FORM_URL, external: true };
export const HOW_IT_WORKS: FwCta = { label: "How Recognition Works", href: "/about#how-it-works" };

export const INTEGRITY = {
  title: "Recognition Cannot Be Bought",
  body: "Nomination is free. Sponsorship, donations, partnerships, endorsements, publicity and media participation do not influence eligibility, scoring, judging or recognition decisions.",
};

export const CORE_PROMISE =
  "Evidence before acclaim. Consent before publicity. Research before judging. Recognition without financial influence.";

export const HOME = {
  eyebrow: "NESA-Africa 2026",
  title: "Recognising Africa’s Education Enablers",
  intro: "NESA-Africa identifies, documents and recognises the people, institutions and initiatives expanding educational opportunity across Africa.",
  trustStatement: "Evidence-led research. Independent Icon judging. No public voting in 2026.",
  trustBand: [
    "Four recognition tiers",
    "22 main awards",
    "90 subcategories",
    "Nine independent Icon judges",
    "Nine Icon NRRC members",
    "No public voting in 2026",
    "Nomination is free",
  ],
  steps: [
    { title: "Identify", body: "Invite credible nominations from African communities, institutions, Diaspora participants and Friends of Africa." },
    { title: "Verify", body: "Check identity, contact information, consent, eligibility and supporting evidence." },
    { title: "Document", body: "Prepare responsible, evidence-based profiles of education contribution." },
    { title: "Assess", body: "Apply the appropriate NRRC, governance and Icon-judging processes." },
    { title: "Recognise", body: "Issue approved recognition decisions, profiles and certificates." },
    { title: "Connect", body: "Use interviews, documentaries, webinars, podcasts and partnerships to strengthen education impact." },
  ],
  finalTitle: "Help Us Document Education Impact Responsibly",
  finalBody: "Know a person, institution or programme making a verifiable contribution to education?",
  finalCtas: [NOMINATE, { label: "Read the Nomination Guide", href: "/nominate" }] as FwCta[],
};

export const TIERS = [
  {
    name: "Tier 1 — Africa Education Icon",
    items: ["Education Philanthropy Icon", "Literary and New Curriculum Advocate Icon", "Technical Educator Icon"],
    note: "Pathways: Africans in Africa · Africans in the Diaspora · Friends of Africa. Up to nine Icons may be recognised.",
    ctas: [{ label: "Explore the Icon Categories", href: "/recognition/africa-education-icon" }, { ...NOMINATE, label: "Submit an Icon Nomination" }],
  },
  {
    name: "Tier 2 — Influencers Education Impact",
    items: ["Social Media Influencers Supporting Education", "Sports Icons Supporting Education", "Music Icons Supporting Education"],
    ctas: [{ label: "Explore Influencer Recognition", href: "/awards/influencer-education-impact" }, NOMINATE],
  },
  {
    name: "Tier 3 — Platinum Certificate",
    items: ["Tertiary-institution libraries", "Research and development", "Christian education", "Islamic education", "Political leadership", "International partnerships", "Diaspora educational impact"],
    ctas: [{ label: "Explore Platinum Recognition", href: "/awards/platinum-recognition" }, { ...NOMINATE, label: "Recommend an Education Enabler" }],
  },
  {
    name: "Tier 4 — Gold–Blue Garnet",
    items: ["CSR for Education in Africa", "CSR for Education in Nigeria", "EduTech Innovation", "Media for Education Advocacy", "NGO for Education Advancement in Nigeria", "NGO for Education Advancement in Africa", "STEM Education Programmes", "Creative Arts Contribution", "Education Policy and Implementation"],
    ctas: [{ label: "Explore Gold–Blue Garnet", href: "/awards/gold-blue-garnet" }, NOMINATE],
  },
] as { name: string; items: string[]; note?: string; ctas: FwCta[] }[];

export const CERTIFICATE_NOTICE =
  "A Certificate of Recognition documents an approved contribution. It must not be presented as a competitive award won unless the recipient has separately received a formal award decision.";

/** Homepage participation and service bands, using the framework's CTAs. */
export const HOME_BANDS: { id: string; title: string; body?: string; ctas: FwCta[] }[] = [
  { id: "participate", title: "Participation Pathways", ctas: [NOMINATE, { label: "Volunteer", href: "/volunteer" }, { label: "Join a Local Chapter", href: "/chapters" }, { label: "Partner With Us", href: "/partners" }, { label: "Support Education", href: "/eduaid-africa" }] },
  { id: "nominees", title: "Approved Nominee Profiles", ctas: [{ label: "View Nominees", href: "/nominees" }] },
  { id: "programme", title: "NESA-Africa 2026 Online Recognition Programme", body: `${PROGRAMME_END_LONG_LABEL}. The focused digital programme will principally recognise up to nine Africa Education Icons, supported by approved Certificates of Recognition and education-impact media. No public physical gala, ticket sale, corporate table or public venue is currently authorised.`, ctas: [{ label: "Watch the Online Programme", href: "/media/gala" }, { label: "Explore the Africa Education Icons", href: "/recognition/africa-education-icon" }] },
  { id: "eduaid", title: "EduAid-Africa Social-Impact Services", ctas: [{ label: "Explore EduAid-Africa", href: "/eduaid-africa" }] },
  { id: "schools", title: "Support a Special-Needs School in Africa", body: "Special-needs-school selection is a separate 2027 EduAid-Africa service and is not part of award recognition.", ctas: [{ label: "Support a Special-Needs School", href: "/support-a-special-needs-school" }] },
  { id: "chapters", title: "NESA-Africa and SCEF Local Chapters", ctas: [{ label: "Join a Local Chapter", href: "/chapters" }, { label: "Volunteer", href: "/volunteer" }] },
  { id: "sponsors", title: "Sponsors and Partners", body: INTEGRITY.body, ctas: [{ label: "Sponsor", href: "/sponsors" }, { label: "Partner With Us", href: "/partners" }, { label: "Donate", href: "/donate" }] },
  { id: "media", title: "Media and Impact Stories", ctas: [{ label: "NESA-Africa TV", href: "/media/tv" }, { label: "Webinars", href: "/media/webinars" }, { label: "Africa Education Enablers Podcast", href: "/media/podcast" }] },
];

export const ABOUT = {
  title: "About NESA-Africa",
  intro: [
    "NESA-Africa is a pan-African education-recognition and documentation programme hosted by Santos Creations Educational Foundation.",
    "Its purpose is to make credible education contributions visible, preserve evidence of impact and encourage responsible cooperation around education for all.",
  ],
  identity: [
    ["Programme", "New Education Standard Award Africa—NESA-Africa"],
    ["Public identity", "The African Blue-Garnet Awards for Education"],
    ["Theme", "Recognising the Enablers of Education for All Across Africa"],
    ["Host", "Santos Creations Educational Foundation—SCEF"],
  ],
  serves: ["Africans in Africa", "Africans in the Diaspora", "Friends of Africa"],
  ctas: [{ label: "Explore the 2026 Programme", href: "/about/nesa-africa-2026" }, HOW_IT_WORKS, { label: "Meet the Global Team", href: "/about/team" }] as FwCta[],
  scef: {
    title: "About SCEF",
    points: ["Organisational host", "Governance owner", "Education-impact organisation", "Parent of the wider EduAid-Africa service ecosystem"],
    // "Visit SCEF" external URL: CONTENT REQUIRED.
    ctas: [{ label: "Explore EduAid-Africa", href: "/eduaid-africa" }, { label: "Partner With SCEF", href: "/partners" }] as FwCta[],
  },
  governance: {
    title: "Governance and Integrity",
    points: ["Sponsor neutrality", "Conflict declarations", "NRRC and judge separation", "Consent and privacy", "Evidence standards", "Appeals and corrections", "Role-based access", "Decision audit trails"],
    ctas: [{ label: "Read the Integrity Policy", href: "/governance" }, HOW_IT_WORKS, { label: "Report a Concern", href: "/contact" }] as FwCta[],
  },
};

export const ABOUT_2026 = {
  title: "NESA-Africa 2026",
  points: [
    "Four tiers, 22 awards and 90 subcategories",
    `Online programme on ${PROGRAMME_END_LONG_LABEL.replace(" · Online", "")}`,
    "Up to nine Africa Education Icons",
    "Nine Icon NRRC members",
    "Nine independent Icon judges",
    "No public voting",
    "Other tiers use verification and approved governance processes",
    "Certificates are separate from competitive awards",
  ],
  ctas: [{ label: "View the 2026 Timeline", href: "/timeline" }, NOMINATE, { label: "Explore the Four Tiers", href: "/categories" }] as FwCta[],
};
