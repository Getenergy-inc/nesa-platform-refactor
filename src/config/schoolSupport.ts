/** School intervention actions are independent of NESA award nomination. */
export const SCHOOL_SUPPORT_ACTIONS = {
  nominate: { href: "/impact/nominate-school", label: "Nominate a Special-Needs School in Africa", shortLabel: "Nominate a School" },
  support: { href: "/impact/special-needs-schools", label: "Support a Special-Needs School in Africa", shortLabel: "Support a Verified School" },
} as const;

export const SCHOOL_SUPPORT_ROUTE = "/support-a-special-needs-school";
export const SCHOOL_SUPPORT_PARTICIPATE_ROUTE = `${SCHOOL_SUPPORT_ROUTE}/participate`;

/** CONTENT REQUIRED: supply the authorised NESA-Africa Google Form URL. */
export const SNS_FORM_URL = "";

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
  headline: "Support One Special-Needs School in Each African Region",
  introduction: "In 2027, the Africa Special Needs Education Support Fund will identify, verify and present eligible special-needs and inclusive schools across Africa.",
  selection: "Following verification and approved public participation, one eligible school will be selected from each of the eight approved African programme regions—producing up to eight regional beneficiary schools in 2027.",
  supportQualifier: "Subject to due diligence, available funds and written approval, each selected school may receive:",
  supportWarning: "Do not promise a fixed grant amount or intervention until funding, verification, project scope and approval are confirmed.",
  campaignLine: "Eight African Regions. Eight Supported Schools. One Inclusive Future.",
  supportingLine: "Nominate. Verify. Vote. Fund. Volunteer. Transform.",
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
  { period: "February–March 2027", activity: "Programme preparation, partner mobilisation, fundraising controls and regional coordination" },
  { period: "April 2027", activity: "School nominations open" },
  { period: "April–August 2027", activity: "Verification, safeguarding, needs assessment and regional classification" },
  { period: "August 2027", activity: "Approved school profiles prepared and voting system tested" },
  { period: "September 2027", activity: "Voting for verified schools" },
  { period: "October 2027", activity: "Due diligence, regional selection and approved interventions begin" },
  { period: "November 2027", activity: "Implementation monitoring, documentation and quality assurance" },
  { period: "December 2027", activity: "Regional beneficiaries and verified impact presented through the approved NESA-Africa programme" },
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
