import collageAsset from "@/assets/school-support/inclusive-learning-collage.png.asset.json";
import cat01 from "@/assets/school-support/category-01-visual-support.jpg.asset.json";
import cat02 from "@/assets/school-support/category-02-deaf-and-hearing.jpg.asset.json";
import cat03 from "@/assets/school-support/category-03-physical-and-mobility.jpg.asset.json";
import cat04 from "@/assets/school-support/category-04-intellectual-and-developmental.jpg.asset.json";
import cat05 from "@/assets/school-support/category-05-autism-and-communication.jpg.asset.json";
import cat06 from "@/assets/school-support/category-06-learning-emotional-and-behavioural.jpg.asset.json";
import cat07 from "@/assets/school-support/category-07-multiple-and-complex.jpg.asset.json";
import cat08 from "@/assets/school-support/category-08-inclusive-early-intervention-and-vocational.jpg.asset.json";

/** School intervention actions are independent of NESA award nomination. */
export const SCHOOL_SUPPORT_ACTIONS = {
  nominate: { href: "/impact/nominate-school", label: "Nominate a Special-Needs School in Africa", shortLabel: "Nominate a School" },
  support: { href: "/impact/special-needs-schools", label: "Support a Special-Needs School in Africa", shortLabel: "Support a Verified School" },
} as const;

export const SCHOOL_SUPPORT_ROUTE = "/support-a-special-needs-school";
export const SCHOOL_SUPPORT_PARTICIPATE_ROUTE = `${SCHOOL_SUPPORT_ROUTE}/participate`;

/** CONTENT REQUIRED: supply the authorised NESA-Africa Google Form URL. */
export const SNS_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfSFHcQc9ehWdnPTfPRyzeMruCVOzVyjyI29uUSRR6E2g1JWw/viewform";

/** Voting remains unavailable until technical and governance approval authorises this flag. */
export const VOTING_OPEN = false;
export const VOTING_PENDING_LABEL = "Voting Opens in September 2027, Subject to Verification and Approval";
export const VOTING_OPEN_LABEL = "Vote for a School in Your Region";

export function getSchoolVotingLabel(votingOpen: boolean = VOTING_OPEN): string {
  return votingOpen ? VOTING_OPEN_LABEL : VOTING_PENDING_LABEL;
}

/** Only authorised HTTPS Google Forms links may become public participation links. */
export function getSnsFormUrl(value: string = SNS_FORM_URL): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    const isGoogleForm = url.hostname === "forms.gle" || url.hostname === "docs.google.com";
    return url.protocol === "https:" && isGoogleForm ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Fail closed until the programme supplies explicit publication approval. */
export function canPublishSupportSchool(record: { verificationStatus?: string | null; publicationApproved?: boolean | null }): boolean {
  return record.verificationStatus === "verified" && record.publicationApproved === true;
}

export const SCHOOL_SUPPORT_PROGRAMME = {
  name: "Africa Special Needs Education Support Fund 2027",
  presenters: "Jointly presented by NESA-Africa and EduAid-Africa",
  serviceLine: "An education-support service of Santos Creations Educational Foundation, supported by Friends of EduAid-Africa and the Africa Education Enablers Network.",
  headline: "Support a Special-Needs School Across Africa",
  introduction: "Help identify, verify and support specialist schools and inclusive mainstream schools serving learners with disabilities and additional support needs. This is a joint NESA-Africa and EduAid-Africa education-support programme under Santos Creations Educational Foundation, supported through Friends of EduAid-Africa and the Africa Education Enablers Network. It is not a NESA-Africa award tier.",
  selection: "Eight operational regions: North Africa · West Africa · Central Africa · East Africa · Southern Africa · Sahel Region · Horn of Africa · Indian Ocean Islands. These are programme-operational regions, not an official African Union classification. The 2027 programme aims to identify one priority school in each region for verified intervention support. Fundraising target: US$150,000 per region · eight regions · US$1.2 million continental target. This is a fundraising target, not secured funding.",
  supportQualifier: "Subject to due diligence, available funds and written approval, each selected school may receive:",
  supportWarning: "Do not promise a fixed grant amount or intervention until funding, verification, project scope and approval are confirmed.",
  campaignLine: "Eight African Regions. Eight Supported Schools. One Inclusive Future.",
  supportingLine: "Regional school selection is separate from NESA-Africa award recognition. Donations, sponsorship and regional participation do not affect NESA-Africa judging or recognition decisions.",
} as const;

export const SCHOOL_SUPPORT_POSSIBILITIES = [
  "an education-support grant",
  "renovation or accessibility assistance",
  "equipment or learning materials",
  "assistive technology",
  "professional and technical advisory services",
  "volunteer support",
  "corporate or institutional sponsorship",
  "a combination of approved interventions",
] as const;

export const SCHOOL_SUPPORT_PROCESS = [
  { title: "Identify", description: "eligible special-needs and inclusive schools." },
  { title: "Nominate", description: "a school through an authorised form." },
  { title: "Verify", description: "its identity, learners, needs and safeguarding arrangements." },
  { title: "Classify", description: "the school by its principal services and intervention needs." },
  { title: "Publish", description: "only approved school profiles." },
  { title: "Vote", description: "for an eligible school within the appropriate African region." },
  { title: "Select", description: "the highest-voted eligible school from each region." },
  { title: "Complete due diligence", description: "and confirm the appropriate intervention." },
  { title: "Fund, advise or support", description: "the approved regional school." },
  { title: "Monitor and report", description: "the intervention and educational impact." },
] as const;

export const SCHOOL_SUPPORT_DUE_DILIGENCE = [
  "identity and registration verification",
  "safeguarding approval",
  "evidence of educational need",
  "accurate project costing",
  "school-management consent",
  "site or remote assessment",
  "funding availability",
  "absence of voting manipulation",
  "written programme approval",
] as const;

export const SCHOOL_SUPPORT_CATEGORIES = [
  { title: "Visual Support Education", description: "Schools supporting learners who are blind or have low vision." },
  { title: "Deaf and Hearing Support Education", description: "Schools supporting Deaf and hard-of-hearing learners." },
  { title: "Physical and Mobility Support Education", description: "Schools supporting learners with physical disabilities, mobility challenges or cerebral palsy." },
  { title: "Intellectual and Developmental Support Education", description: "Schools supporting learners with intellectual or developmental disabilities, including Down syndrome." },
  { title: "Autism and Communication Support Education", description: "Schools supporting autistic learners and learners with speech, language or communication needs." },
  { title: "Learning, Emotional and Behavioural Support Education", description: "Schools supporting learners with dyslexia, dyscalculia, ADHD and significant emotional, behavioural or psychosocial needs." },
  { title: "Multiple and Complex Disabilities", description: "Schools serving learners with more than one disability or substantial multidisciplinary support needs." },
  { title: "Inclusive, Early-Intervention and Vocational Education", description: "Inclusive mainstream schools, specialist units, early-intervention centres, resource centres and vocational or transition programmes." },
] as const;

export const SCHOOL_SUPPORT_INTERVENTIONS = [
  "building construction",
  "classroom renovation",
  "ramps and physical accessibility",
  "accessible toilets and water systems",
  "Braille and large-print resources",
  "sign-language and captioning facilities",
  "assistive technology",
  "communication devices",
  "mobility equipment",
  "adapted furniture",
  "sensory or therapy rooms",
  "school transportation",
  "teacher and caregiver training",
  "digital-learning facilities",
  "internet connectivity",
  "solar and backup electricity",
  "vocational-training workshops",
  "learning materials",
  "safeguarding and psychosocial support",
  "technical or operational advice",
] as const;

export const SCHOOL_SUPPORT_NOMINATION_NOTICE = "A nomination begins a verification process. It does not guarantee publication, voting eligibility, funding, sponsorship, a grant or an intervention.";

export const SCHOOL_SUPPORT_VOTING_REQUIREMENTS = [
  "all participating schools have passed verification",
  "publication consent has been obtained",
  "safeguarding reviews are complete",
  "regional classifications are approved",
  "voting rules are published",
  "duplicate and fraudulent-vote controls are tested",
  "technical and governance approval is recorded",
] as const;

export const SCHOOL_SUPPORT_VOTING_SAFEGUARDS = [
  "verified email or telephone confirmation",
  "one controlled voting entitlement per verified participant",
  "anti-bot protection",
  "duplicate detection",
  "audit logs",
  "regional eligibility controls",
  "published opening and closing times",
  "documented recount and dispute procedures",
] as const;

export const SCHOOL_SUPPORT_SPONSOR_TYPES = [
  "individuals",
  "companies",
  "foundations",
  "development organisations",
  "professional associations",
  "educational institutions",
  "technology companies",
  "construction and engineering companies",
  "media organisations",
  "healthcare and rehabilitation providers",
  "Diaspora organisations",
  "faith-based and community organisations",
] as const;

export const SCHOOL_SUPPORT_SPONSORSHIP_OPPORTUNITIES = [
  "one verified school",
  "one approved African region",
  "a specific renovation project",
  "accessible classrooms",
  "assistive technology",
  "accessible transportation",
  "learning materials",
  "teacher training",
  "renewable energy",
  "water and sanitation",
  "vocational training",
  "connectivity and digital learning",
  "programme verification and monitoring",
  "approved documentary and impact reporting",
] as const;

export const SCHOOL_SUPPORT_PARTNERSHIP_OPPORTUNITIES = [
  "funding",
  "professional expertise",
  "construction and renovation services",
  "assistive equipment",
  "technology",
  "teaching and training",
  "logistics",
  "monitoring and evaluation",
  "media and public education",
  "volunteer mobilisation",
  "safeguarding expertise",
  "independent audit or programme assurance",
] as const;

export const SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY = "Sponsorship, donations and partnerships support approved education interventions. They do not influence school verification, voting totals, NESA-Africa award judging or recognition decisions.";
export const SCHOOL_SUPPORT_DONATION_NOTICE = "Completing a donation or sponsorship form does not confirm that payment has been received. Support is confirmed only after successful reconciliation and an official acknowledgement or receipt.";
export const SCHOOL_SUPPORT_TIMETABLE_NOTICE = "The timetable is subject to governance approval, funding availability, school verification, safeguarding requirements and operational readiness.";

export const SCHOOL_SUPPORT_DONATION_STATUSES = [
  "expression of interest",
  "pledge received",
  "invoice or payment instruction issued",
  "payment received",
  "payment reconciled",
  "receipt issued",
  "intervention allocated",
  "utilisation reported",
] as const;

export const SCHOOL_SUPPORT_TIMETABLE = [
  { period: "February–March 2027", activity: "Governance, fundraising, financial controls, forms and regional rules" },
  { period: "April 2027", activity: "School nominations open" },
  { period: "April–August 2027", activity: "Verification, consent, needs assessment, safeguarding review and regional classification" },
  { period: "August 2027", activity: "Regional shortlist and public-information review" },
  { period: "September 2027", activity: "Authorised regional selection" },
  { period: "October–November 2027", activity: "Controlled funding releases, intervention delivery and EduTourism activities" },
  { period: "December 2027", activity: "Outcome presentation, partner recognition and preliminary reporting" },
  { period: "2028 onward", activity: "Intervention completion, monitoring and public impact reporting where required" },
  { period: "2028 onward", activity: "Intervention completion, monitoring and public impact reporting where required" },
] as const;

export const SCHOOL_SUPPORT_DASHBOARD_FIELDS = [
  "schools nominated",
  "unique schools after duplicate review",
  "schools under verification",
  "schools approved for voting",
  "verified regional vote totals",
  "funds pledged",
  "funds received and reconciled",
  "interventions approved",
  "interventions started",
  "interventions completed",
  "last-updated date",
] as const;

export type SchoolParticipationId = "nominate" | "vote" | "donate" | "sponsor" | "region" | "partner" | "volunteer" | "equipment";

export const SCHOOL_SUPPORT_PARTICIPATION: ReadonlyArray<{
  id: SchoolParticipationId;
  label: string;
  description: string;
}> = [
  { id: "nominate", label: "Nominate a school", description: "Begin the verification and needs-assessment process for an eligible special-needs or inclusive school." },
  { id: "vote", label: "Vote for a verified school", description: "Take part in school-only regional participation after verification, safeguarding and governance approval." },
  { id: "donate", label: "Donate", description: "Express interest in donating to the Support Fund without providing payment credentials in the form." },
  { id: "sponsor", label: "Sponsor a school", description: "Support one verified school or an approved intervention, subject to due diligence and available funds." },
  { id: "region", label: "Support a region", description: "Support an approved African programme region and its verified education interventions." },
  { id: "partner", label: "Become a partner", description: "Offer corporate, institutional, technical or community partnership to the programme." },
  { id: "volunteer", label: "Volunteer professional services", description: "Offer approved professional, technical, safeguarding, teaching or monitoring expertise." },
  { id: "equipment", label: "Donate equipment or materials", description: "Offer assistive technology, equipment, learning materials or other approved resources." },
];

export function buildSchoolParticipationHref(id: SchoolParticipationId): string {
  return `${SCHOOL_SUPPORT_PARTICIPATE_ROUTE}?participation=${encodeURIComponent(id)}`;
}

/* ===================================================================
 * 2027 page source of truth — Support a Special-Needs School Across Africa
 * =================================================================== */
export const SNS_BASE = "/support-a-special-needs-school";
export const SNS_CANONICAL = "https://eduaid.africa/support-a-special-needs-school";
export const COUNTRY_MAP_APPROVED = false;
export const SUPPORTER_DASHBOARD_ENABLED = false;
export const SUPPORTER_DASHBOARD_URL = "https://eduaid.africa/account";
export const REGION_TARGET_USD = 150_000;
export const CONTINENTAL_TARGET_USD = 1_200_000;

export const SNS_OWNERSHIP_LINE = "Support a Special-Needs School Across Africa is a service of Rebuild My School Africa (RMSA), an EduAid-Africa programme of Santos Creations Educational Foundation (SCEF).";
export const SNS_RMSA_ROUTE = "/rebuild-my-school";
export const SNS_BODY_BAND = "A Rebuild My School Africa service · EduAid-Africa · presented with NESA-Africa";
export const SNS_UTILITY_LINE = "A service of Rebuild My School Africa · EduAid-Africa · Santos Creations Educational Foundation · Jointly presented with NESA-Africa";
export const SNS_NOT_A_TIER = "Regional school selection is separate from NESA-Africa award recognition. Donations, sponsorship and regional participation do not affect NESA-Africa judging or recognition decisions.";
export const SNS_PAYMENT_NOTICE = "Completing this form does not confirm payment. Support is confirmed only after reconciliation and an official receipt.";
export const SNS_NARRATION_NOTICE = "Put your EA reference in the transfer narration. Pay only into accounts named EduAid Africa Ltd.";
export const SNS_PERSONAL_ACCOUNT_WARNING = "EduAid-Africa will never ask you to pay into a personal account.";
export const SNS_TARGET_NOTICE = "targets, not secured funding";
export const SNS_GRANT_QUALIFIER = "subject to due diligence, available funds and written approval";
export const SNS_VIDEO_CAPTION = "Illustrative AI-generated video · not a beneficiary school";

export const SNS_CTAS = {
  nominate: { label: "Nominate a Special-Needs School", href: `${SNS_BASE}/participate?participation=nominate` },
  verified: { label: "View Verified Schools", href: `${SNS_BASE}#verified-schools` },
  vote: { label: VOTING_PENDING_LABEL, href: "#vote", disabled: true },
  donate: { label: "Donate to the Support Fund", href: "#donate" },
  sponsor: { label: "Sponsor a Regional School", href: "#sponsor-form" },
  partner: { label: "Become a Programme Partner", href: "#sponsor-form" },
  volunteer: { label: "Volunteer Your Skills", href: `${SNS_BASE}/participate?participation=volunteer` },
} as const;

export const SNS_GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSfSFHcQc9ehWdnPTfPRyzeMruCVOzVyjyI29uUSRR6E2g1JWw/viewform";
export const SNS_GOOGLE_FORM_EMBED = `${SNS_GOOGLE_FORM}?embedded=true`;
export const NESA_AWARD_NOMINATION_FORM = "https://forms.gle/E2FmpTkRq53JxRbS7";
export const SNS_VIDEOS = [
  { id: "Hdu_qlFLfrQ", title: "Special Needs Education" },
  { id: "aP0SskrfioI", title: "EduAid-Africa" },
] as const;

export type RegionKey = "north" | "west" | "central" | "east" | "southern" | "sahel" | "horn" | "indian";
export const SNS_REGIONS: ReadonlyArray<{ key: RegionKey; name: string; color: string; desk: string }> = [
  { key: "north", name: "North Africa", color: "#7B4A1E", desk: "rmsanafricaeduaidafrica@gmail.com" },
  { key: "west", name: "West Africa", color: "#2E7D32", desk: "rmsawafricaeduaidafrica@gmail.com" },
  { key: "central", name: "Central Africa", color: "#2563A6", desk: "rmsacafricaeduaidafrica@gmail.com" },
  { key: "east", name: "East Africa", color: "#A86B12", desk: "rmsaeafricaeduaidafrica@gmail.com" },
  { key: "southern", name: "Southern Africa", color: "#9B2C4A", desk: "rmsasafricaeduaidafrica@gmail.com" },
  { key: "sahel", name: "Sahel Region", color: "#C25E1F", desk: "rmsasaheleduaidafrica@gmail.com" },
  { key: "horn", name: "Horn of Africa", color: "#6B4FA0", desk: "rmsahornafricaeduaidafrica@gmail.com" },
  { key: "indian", name: "Indian Ocean Islands", color: "#0F8A84", desk: "rmsaindianoceaneduaidafrica@gmail.com" },
];
export const SNS_REGIONS_NOTE = "These are programme-operational regions, not an African Union classification.";
export const SNS_MAP_DRAFT_NOTE = "Draft regional map, pending written programme approval";

const C = (name: string, id: string, region: RegionKey) => ({ name, id, region });
export const SNS_COUNTRIES = [
  C("Algeria","012","north"),C("Egypt","818","north"),C("Libya","434","north"),C("Morocco","504","north"),C("Tunisia","788","north"),
  C("Burkina Faso","854","sahel"),C("Chad","148","sahel"),C("Mali","466","sahel"),C("Mauritania","478","sahel"),C("Niger","562","sahel"),C("Sudan","729","sahel"),
  C("Benin","204","west"),C("Cabo Verde","132","west"),C("Côte d'Ivoire","384","west"),C("The Gambia","270","west"),C("Ghana","288","west"),C("Guinea","324","west"),C("Guinea-Bissau","624","west"),C("Liberia","430","west"),C("Nigeria","566","west"),C("Senegal","686","west"),C("Sierra Leone","694","west"),C("Togo","768","west"),
  C("Cameroon","120","central"),C("Central African Republic","140","central"),C("Republic of the Congo","178","central"),C("DR Congo","180","central"),C("Equatorial Guinea","226","central"),C("Gabon","266","central"),C("São Tomé and Príncipe","678","central"),
  C("Burundi","108","east"),C("Kenya","404","east"),C("Rwanda","646","east"),C("South Sudan","728","east"),C("Tanzania","834","east"),C("Uganda","800","east"),
  C("Djibouti","262","horn"),C("Eritrea","232","horn"),C("Ethiopia","231","horn"),C("Somalia","706","horn"),
  C("Angola","024","southern"),C("Botswana","072","southern"),C("Eswatini","748","southern"),C("Lesotho","426","southern"),C("Malawi","454","southern"),C("Mozambique","508","southern"),C("Namibia","516","southern"),C("South Africa","710","southern"),C("Zambia","894","southern"),C("Zimbabwe","716","southern"),
  C("Comoros","174","indian"),C("Madagascar","450","indian"),C("Mauritius","480","indian"),C("Seychelles","690","indian"),
] as const;
/** Somaliland renders as Somalia; Western Sahara is shown grey and unassigned. */
export const SNS_UNASSIGNED = { id: "732", name: "Western Sahara", color: "#C9C4B4", note: "disputed territory, not assigned" } as const;
export const SNS_ISLAND_DOTS = ["132", "678", "174", "480", "690"] as const;

/** Owner-supplied illustrative pictures, one per category, in category order. */
export type SnsImage = { src: string; alt: string; credit: string };
const SNS_CATEGORY_IMAGES: SnsImage[] = [
  { src: cat01.url, alt: "A learner wearing sunglasses reads Braille at a desk while a teacher guides his hands, outside a school for the blind.", credit: "" },
  { src: cat02.url, alt: "Two schoolgirls in checkered uniforms practise sign language together in front of a signed-alphabet classroom poster.", credit: "" },
  { src: cat03.url, alt: "A smiling schoolgirl in a wheelchair uses a laptop on her lap in front of an accessible ramp with handrails.", credit: "" },
  { src: cat04.url, alt: "A young learner builds a structure from colourful wooden blocks at a classroom table.", credit: "" },
  { src: cat05.url, alt: "A learner wearing headphones points to a pictured daily-schedule board in a classroom.", credit: "" },
  { src: cat06.url, alt: "A learner in a white school uniform traces the letter A with a finger in a tray of sand.", credit: "" },
  { src: cat07.url, alt: "A smiling learner in a supportive wheelchair and her teacher look at an assistive communication tablet.", credit: "" },
  { src: cat08.url, alt: "A teacher and three pupils hold up emotion cards showing angry, happy and calm faces.", credit: "" },
];

/** Owner-supplied panoramic picture of the eight support categories in classroom use. */
export const SNS_HERO_IMAGE: SnsImage = {
  src: collageAsset.url,
  alt: "Panoramic picture of eight classroom scenes: a learner reading Braille with a teacher, two learners signing to each other, a learner using a wheelchair at a laptop, a learner building with counting blocks, a learner pointing at a visual schedule, a learner tracing a letter in sand, a learner using a communication tablet, and a teacher holding an emotion flashcard.",
  credit: "",
};

export const SNS_CATEGORIES = [
  { title: "Visual Support Education", description: "Schools supporting learners who are blind or have low vision", icon: "eye", color: "#2E7D32", tags: ["Braille", "Low vision"] },
  { title: "Deaf and Hearing Support Education", description: "Schools supporting Deaf and hard-of-hearing learners", icon: "ear", color: "#6B4521", tags: ["Sign language", "Captioning"] },
  { title: "Physical and Mobility Support Education", description: "Schools supporting learners with physical disabilities, mobility challenges or cerebral palsy", icon: "accessibility", color: "#1F5C22", tags: ["Access", "Mobility"] },
  { title: "Intellectual and Developmental Support Education", description: "Schools supporting learners with intellectual or developmental disabilities, including Down syndrome", icon: "puzzle", color: "#3D9B3D", tags: ["Adapted learning"] },
  { title: "Autism and Communication Support Education", description: "Schools supporting autistic learners and learners with speech, language or communication needs", icon: "message-circle", color: "#8A5A2B", tags: ["AAC", "Sensory"] },
  { title: "Learning, Emotional and Behavioural Support Education", description: "Schools supporting learners with dyslexia, dyscalculia, ADHD and significant emotional, behavioural or psychosocial needs", icon: "brain", color: "#4C8A3A", tags: ["Learning", "Wellbeing"] },
  { title: "Multiple and Complex Disabilities", description: "Schools serving learners with more than one disability or multidisciplinary needs", icon: "layers", color: "#553517", tags: ["Multidisciplinary care"] },
  { title: "Inclusive, Early-Intervention and Vocational Education", description: "Inclusive mainstream schools, specialist units, early-intervention centres, resource centres, vocational/transition programmes", icon: "sprout", color: "#24602A", tags: ["Inclusion", "Transition"] },
].map((c, i) => ({ ...c, image: SNS_CATEGORY_IMAGES[i] ?? null }));
export const SNS_CATEGORY_RULE = "Schools may select more than one category but state one principal category. Regional selection is one approved school per region, in any category, not eight category winners.";

/** Video slots stay empty and hidden until approved illustrative videos are supplied. */
export const CAT_VIDEOS: Array<string | null> = Array(8).fill(null);
export const REGION_VIDEOS: Partial<Record<RegionKey, string>> = {};
export const CAMPAIGN_VIDEOS: { fiveWays: string | null; eduTourism: string | null; donationTracking: string | null } = { fiveWays: null, eduTourism: null, donationTracking: null };

export const SNS_ACCOUNTS = [
  { label: "Website", value: "eduaid.africa", href: "https://eduaid.africa" },
  { label: "Webinars", value: "eduaid.africa/webinars", href: "https://eduaid.africa/webinars" },
  { label: "LinkedIn", value: "EduAid-Africa", href: "https://www.linkedin.com/in/eduaid-africa-6b4b3838a" },
  { label: "YouTube", value: "EduAid-Africa", href: "https://www.youtube.com/watch?v=aP0SskrfioI" },
  { label: "SCEF", value: "santoscreations.org", href: "https://santoscreations.org" },
  { label: "NESA-Africa", value: "nesa.africa · info@nesa.africa", href: "https://nesa.africa" },
] as const;
/** Hidden until official handles are supplied. */
export const SNS_HIDDEN_SOCIAL: Record<"facebook" | "instagram" | "x" | "tiktok" | "whatsapp", string | null> = { facebook: null, instagram: null, x: null, tiktok: null, whatsapp: null };

export type SnsCurrency = "NGN" | "USD" | "EUR" | "GBP";
export const SNS_BANK_HOLDER = "EduAid Africa Ltd";
export const SNS_BANK_NAME = "Providus Bank";
export const SNS_BANK_ACCOUNTS: ReadonlyArray<{ currency: SnsCurrency; number: string; purpose: string }> = [
  { currency: "NGN", number: "1305744507", purpose: "Scholarships & Education Support" },
  { currency: "USD", number: "1307264500", purpose: "International Education Support" },
  { currency: "EUR", number: "1307264531", purpose: "European Education Funding" },
  { currency: "GBP", number: "1307264548", purpose: "UK Education Support" },
];
export const SNS_DONATION_PRESETS: Record<SnsCurrency, number[]> = {
  USD: [25, 50, 100, 250, 500, 1000], NGN: [10000, 25000, 50000, 100000, 250000, 500000],
  GBP: [20, 40, 80, 200, 400, 800], EUR: [25, 50, 100, 250, 500, 1000],
};
export const SNS_SPONSOR_PRESETS = [5000, 10000, 25000, 50000, 75000, 150000];
export const SNS_DONOR_TYPES = ["Individual", "Family", "Diaspora supporter", "Company/CSR", "NGO/foundation", "Faith-based organisation", "School/institution", "Volunteer group"] as const;
export const SNS_SPONSOR_SCOPES = [
  { id: "region", label: "Whole region (US$150,000)" }, { id: "share", label: "Share of a regional target" },
  { id: "school", label: "One verified school" }, { id: "project", label: "Specific project" }, { id: "in-kind", label: "In-kind" },
] as const;
export const SNS_SPONSOR_PROJECTS = ["Accessible classrooms", "Assistive technology", "Accessible transportation", "Learning materials", "Teacher training", "Renewable energy", "Water and sanitation", "Vocational training", "Connectivity and digital learning", "A specific renovation project", "Programme verification and monitoring", "Approved documentary and impact reporting"] as const;
export const SNS_PARTNER_CONTRIBUTIONS = ["Funding", "Professional expertise", "Construction and renovation services", "Assistive equipment", "Technology", "Teaching and training", "Logistics", "Monitoring and evaluation", "Media and public education", "Volunteer mobilisation", "Safeguarding expertise", "Independent audit or programme assurance"] as const;

export const SNS_FIVE_WAYS = [
  { key: "nominate", n: 1, title: "Nominate", timing: "Opens April 2027", text: "Put forward a specialist or inclusive school for verification." },
  { key: "vote", n: 2, title: "Vote", timing: "Opens September 2027*", text: "Free regional voting among verified schools, once approved." },
  { key: "donate", n: 3, title: "Donate", timing: "Pledges open now", text: "Give to the ring-fenced Support Fund by bank transfer." },
  { key: "sponsor", n: 4, title: "Sponsor", timing: "US$150,000 per region", text: "Sponsor a regional school, a project or in-kind support." },
  { key: "attend", n: 5, title: "Attend", timing: "October–December 2027", text: "Join EduTourism 2027 and regional commissioning ceremonies." },
] as const;
export const SNS_VOTE_FOOTNOTE = `*${VOTING_PENDING_LABEL}. Voting is free and never linked to money.`;

export const SNS_ABOUT_CARDS = [
  { title: "Why it matters", text: "Many specialist and inclusive schools serving learners with disabilities lack accessible buildings, equipment, trained staff and reliable funding." },
  { title: "What we do", text: "We find, verify and support specialist and inclusive schools, then fund, advise or equip approved interventions." },
  { title: "Who it serves", text: "Learners with disabilities and additional support needs, their teachers and the schools that serve them, in every region of Africa." },
  { title: "How you can help", text: "Nominate a school, donate, sponsor a regional school, partner with the programme, volunteer your skills or attend in 2027." },
] as const;
export const SNS_PRINCIPLES = ["Evidence before support", "Safeguarding first", "Votes are never sold", "Open accountability"] as const;

export const SNS_PROCESS_STEPS = ["Identify", "Nominate", "Verify", "Classify", "Publish", "Vote", "Select", "Due diligence", "Fund & support", "Monitor & report"] as const;
export const SNS_NEXT_ELIGIBLE_NOTE = "If a selected school cannot complete due diligence, the next eligible verified school in the same region may be considered, subject to written approval.";
export const SNS_ATTEND_ITEMS = ["Regional EduTourism visits to approved schools (Oct–Nov 2027)", "Regional Grant Awarding and Commissioning Ceremonies", "Volunteer and professional-service days", "Partner and media briefings, where approved"] as const;

export const SNS_FAQ = [
  { q: "Who runs this programme?", a: "Support a Special-Needs School Across Africa is a service of Rebuild My School Africa (RMSA), an EduAid-Africa programme of Santos Creations Educational Foundation (SCEF), presented jointly with NESA-Africa." },
  { q: "Is it part of the NESA-Africa awards?", a: "No. It is not a NESA-Africa award tier. " + "Regional school selection is separate from NESA-Africa award recognition. Donations, sponsorship and regional participation do not affect NESA-Africa judging or recognition decisions." },
  { q: "Does a nomination guarantee a grant?", a: "No. A nomination begins verification. It does not guarantee publication, voting eligibility, funding, a grant or an intervention. Any support is subject to due diligence, available funds and written approval." },
  { q: "What is EduTourism 2027?", a: "Regional visits in October–November 2027 to approved schools, alongside Regional Grant Awarding and Commissioning Ceremonies. Dates and host cities will be announced." },
  { q: "Can I choose a region?", a: "Yes. Donations and sponsorships can be directed to one of the eight regions or to where most needed." },
  { q: "How is children's privacy protected?", a: "We never publish children's names, diagnoses, identity documents, personal contacts or unapproved school data. Only verified and approved school profiles are shown." },
] as const;

export type NullableNumber = number | null;
/** Public accountability figures — all null until the first approved figures. Later read from the shared eduaid.africa public-stats endpoint. */
export const PUBLIC_STATS: {
  schoolsNominated: NullableNumber; uniqueAfterReview: NullableNumber; underVerification: NullableNumber; approvedForVoting: NullableNumber;
  pledgedUsd: NullableNumber; transfersReportedUsd: NullableNumber; reconciledUsd: NullableNumber; receiptsIssued: NullableNumber;
  interventionsApproved: NullableNumber; interventionsStarted: NullableNumber; interventionsCompleted: NullableNumber;
  verifiedRegionalVotes: NullableNumber; lastUpdated: string | null;
  regions: Record<RegionKey, { pledgedUsd: NullableNumber; reconciledUsd: NullableNumber }>;
} = {
  schoolsNominated: null, uniqueAfterReview: null, underVerification: null, approvedForVoting: null,
  pledgedUsd: null, transfersReportedUsd: null, reconciledUsd: null, receiptsIssued: null,
  interventionsApproved: null, interventionsStarted: null, interventionsCompleted: null,
  verifiedRegionalVotes: null, lastUpdated: null,
  regions: Object.fromEntries(["north","west","central","east","southern","sahel","horn","indian"].map((k) => [k, { pledgedUsd: null, reconciledUsd: null }])) as never,
};
export const PUBLIC_STATS_URL: string | null = null;

export function bankAccountFor(currency: SnsCurrency) {
  return SNS_BANK_ACCOUNTS.find((a) => a.currency === currency)!;
}
export function regionByKey(key: string | null | undefined) {
  return SNS_REGIONS.find((r) => r.key === key) ?? null;
}
export function makeSupportRef(prefix: "DN" | "SP" | "PT", now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `EA-${prefix}-${d}-${rand}`;
}
