// International & Bilateral Contributors to Education — 2026 nominee data
// 7 partner-type tabs. Institutions are named openly (no consent gate).

export type VerificationStatus = "documented" | "pending_verification";
export type MediaType = "photo" | "video" | "none";

export interface IntlNominee {
  name: string;
  initiative: string;
  focus?: string;
  impact?: string;
  verification_status: VerificationStatus;
  edi_score?: number | null;
  media_type: MediaType;
}

export interface IntlSubcategory {
  key: string;
  title: string;
  desc: string;
  subcategoryId: string; // nominate?subcategory=<id>
  nominees: IntlNominee[];
}

export const PRIMARY_NOMINATE_HREF =
  "/nominate?subcategory=51dcefcf-e410-4372-85de-65c997c587bf";

export const INTL_SUBCATEGORIES: IntlSubcategory[] = [
  {
    key: "embassies",
    title: "Embassies & High Commissions",
    desc: "Diplomatic missions running scholarship, exchange, or school-support programmes in Africa.",
    subcategoryId: "51dcefcf-e410-4372-85de-65c997c587bf",
    nominees: [
      { name: "U.S. Embassy / USAID Nigeria", initiative: "LEARN to Read activity", focus: "Foundational literacy", impact: "3.5M+ children · 5,900 schools", verification_status: "documented", media_type: "none" },
      { name: "British High Commission / UK Government", initiative: "PLANE programme", focus: "Seven-year learning outcomes initiative", impact: "Up to 2M children", verification_status: "documented", media_type: "none" },
      { name: "Japanese Embassy / JICA", initiative: "Mathematics & science education strengthening", focus: "School construction, teacher quality", verification_status: "documented", media_type: "none" },
      { name: "South Korean Embassy / KOICA", initiative: "Smart Education Project with UBEC", focus: "Digital learning", impact: "8,000+ learners · 21 states", verification_status: "documented", media_type: "none" },
      { name: "French Embassy / AFD / Campus France", initiative: "Human capital development", focus: "Education and skills financing", verification_status: "documented", media_type: "none" },
    ],
  },
  {
    key: "bilateral",
    title: "Bilateral Aid Agencies",
    desc: "Government development agencies funding education infrastructure or systems reform.",
    subcategoryId: "f8b06b24-3b59-41d8-a6bb-21d0350c4d95",
    nominees: [
      { name: "USAID Nigeria", initiative: "LEARN to Read", impact: "Millions of children · thousands of schools", verification_status: "documented", media_type: "none" },
      { name: "UK FCDO / PLANE", initiative: "Inclusive education system reform", focus: "Marginalised groups, girls, children with disability", verification_status: "documented", media_type: "none" },
      { name: "GIZ Germany (SKYE II)", initiative: "TVET standards & youth employment", focus: "Labour-market-linked skills", verification_status: "documented", media_type: "none" },
      { name: "JICA Japan", initiative: "Mathematics / science education strengthening", focus: "2024 UBEC survey collaboration", verification_status: "documented", media_type: "none" },
      { name: "KOICA Korea", initiative: "Smart Education Project", focus: "Video resources, teacher training, school studios", verification_status: "documented", media_type: "none" },
      { name: "AFD France", initiative: "Human capital development", focus: "Education and skills financing", verification_status: "documented", media_type: "none" },
    ],
  },
  {
    key: "multilateral",
    title: "Multilateral & International NGOs",
    desc: "Cross-border institutions delivering education programmes across multiple African countries.",
    subcategoryId: "ccc8a182-5444-42c9-9588-d153489045c3",
    nominees: [
      { name: "UNICEF Nigeria", initiative: "Out-of-school children programme", focus: "Basic education and access", impact: "10.5M out-of-school children aged 5–14", verification_status: "documented", media_type: "none" },
      { name: "Save the Children Nigeria", initiative: "Literacy, numeracy & crisis learning continuity", focus: "Temporary learning spaces", verification_status: "documented", media_type: "none" },
      { name: "FHI 360 Nigeria", initiative: "Early-grade reading & teacher PD", focus: "Education in emergencies (FMoE)", verification_status: "documented", media_type: "none" },
      { name: "FHI 360 / RANA", initiative: "Early-grade reading pilot", impact: "Scaled 200 → 3,390 schools + 29,170 collaborating schools", verification_status: "documented", media_type: "none" },
      { name: "Plan International Nigeria", initiative: "Child rights, girls' education and equality", verification_status: "documented", media_type: "none" },
    ],
  },
  {
    key: "foundations",
    title: "Global Education Grant Foundations",
    desc: "Foundations issuing grants for African education research, access, or innovation.",
    subcategoryId: "90f1d466-d309-4599-82ca-7729ad50784d",
    nominees: [
      { name: "Bill & Melinda Gates Foundation", initiative: "Global Education Program", focus: "Foundational literacy/numeracy in sub-Saharan Africa", verification_status: "documented", media_type: "none" },
      { name: "Mastercard Foundation", initiative: "Scholars Program", impact: "58,000+ scholarships · target 100,000 by 2030", verification_status: "documented", media_type: "none" },
      { name: "MacArthur Foundation", initiative: "Girls' secondary education grantmaking", impact: "73 grants · ~$24.5M (2011–2017)", verification_status: "documented", media_type: "none" },
      { name: "Global Partnership for Education", initiative: "NIPEP", impact: "$100M grant for Nigeria basic education", verification_status: "documented", media_type: "none" },
      { name: "Education Cannot Wait", initiative: "Crisis education", focus: "Refugee and host-community support", verification_status: "documented", media_type: "none" },
    ],
  },
  {
    key: "corporations",
    title: "Multinational Corporations",
    desc: "Companies running CSR-funded education, skills, or digital-access programmes in Africa.",
    subcategoryId: "9fa17b0b-cf85-4860-b9b0-a4ae9bafb778",
    nominees: [
      { name: "Ethiopian Airlines / Ethiopian Aviation University", initiative: "Aircraft maintenance, pilot, cabin crew & leadership training", verification_status: "documented", media_type: "none" },
      { name: "Qatar Airways / Education Above All", initiative: "Out-of-school children support", focus: "Fundraising and advocacy", verification_status: "documented", media_type: "none" },
      { name: "Emirates Airline Foundation", initiative: "Education access and child welfare support globally", verification_status: "documented", media_type: "none" },
      { name: "British Airways Community Fund (BA Better World)", initiative: "Social mobility, employability, girls in STEM", verification_status: "documented", media_type: "none" },
      { name: "Ethiopian Aviation Academy", initiative: "Aviation professional training", impact: "16,000+ aviation professionals trained", verification_status: "documented", media_type: "none" },
    ],
  },
  {
    key: "un",
    title: "UN Agencies",
    desc: "United Nations bodies delivering education, child welfare, or development programming.",
    subcategoryId: "c42182bd-0c0c-472a-b647-ff5fd73ffcc2",
    nominees: [
      { name: "UNICEF", initiative: "Global education systems & child welfare programming", verification_status: "documented", media_type: "none" },
      { name: "UNESCO", initiative: "Global education policy & literacy programming", verification_status: "documented", media_type: "none" },
      { name: "UNHCR", initiative: "Refugee education programmes", verification_status: "documented", media_type: "none" },
      { name: "WFP", initiative: "School feeding programmes", verification_status: "documented", media_type: "none" },
      { name: "UN Girls' Education Initiative (UNGEI)", initiative: "Girls' education advocacy and coordination", verification_status: "pending_verification", media_type: "none" },
      { name: "ILO", initiative: "TVET and youth employment programming", verification_status: "pending_verification", media_type: "none" },
    ],
  },
  {
    key: "ingos",
    title: "International NGOs",
    desc: "Non-governmental organisations with continent-wide education interventions.",
    subcategoryId: "8da86667-869f-4852-a596-7ef1fbb52780",
    nominees: [
      { name: "African Leadership Academy", initiative: "Pan-African secondary leadership programme", impact: "1,865 students since 2008 · 40,000+ applicants", verification_status: "documented", media_type: "none" },
      { name: "ALA Networks Programme", initiative: "Career pathways for young leaders", impact: "5,000+ jobs and internships", verification_status: "documented", media_type: "none" },
      { name: "YALI (Young African Leaders Initiative)", initiative: "U.S. Government's signature African leadership investment", verification_status: "documented", media_type: "none" },
      { name: "LEAP Africa", initiative: "Youth leadership, entrepreneurship, employability, active citizenship", verification_status: "documented", media_type: "none" },
      { name: "International Youth Foundation", initiative: "Citizenship, employment and entrepreneurship curricula for youth", verification_status: "documented", media_type: "none" },
    ],
  },
];

export const EDI_ROWS: Array<{ area: string; score: number; measured: string }> = [
  { area: "Evidence Quality", score: 20, measured: "Official reports, MoUs, partner pages, verified beneficiary proof" },
  { area: "Education Access", score: 15, measured: "Learners reached, out-of-school children supported, scholarships" },
  { area: "Learning Quality", score: 15, measured: "Literacy/numeracy, teacher training, STEM, TVET, digital learning" },
  { area: "Equity & Inclusion", score: 15, measured: "Girls, children with disabilities, refugees, rural learners" },
  { area: "Scale & Reach", score: 10, measured: "Number of schools, states, countries, learners reached" },
  { area: "Sustainability", score: 10, measured: "Long-term programme, government partnership, institutional capacity" },
  { area: "Innovation", score: 10, measured: "EdTech, smart schools, ICT labs, scalable pilots" },
  { area: "Story / Documentary Value", score: 5, measured: "Human-interest story, visible impact, testimonials" },
];

export const TIMELINE_ROWS = [
  { step: "Nominations open", date: "Now – 31 March 2026", what: "Submit partner nominations and supporting evidence via the online portal" },
  { step: "EDI Verification", date: "April 2026", what: "SCEF panels score submissions against the EDI Matrix (Evidence, Development Impact, Institutional Sustainability)" },
  { step: "Platinum Recognition Show", date: "5 July 2026", what: "Certificates awarded; feature spotlight on NESA TV" },
];

export const WHO_QUALIFIES = [
  "Embassies and High Commissions running education programmes in Africa",
  "Bilateral aid agencies (e.g. USAID, FCDO, GIZ, JICA, AFD)",
  "Multilateral institutions and international NGOs",
  "Global education grant foundations",
  "Multinational corporations with African education CSR programmes",
  "UN agencies",
  "International NGOs with continent-wide education footprints",
];

export const FAQS_SPECIFIC = [
  {
    q: "What is the difference between Blue Garnet and Platinum?",
    a: "Blue Garnet is competitive and publicly voted. Platinum is honorary, EDI-scored, and documentation-based — no voting, no fee.",
  },
  {
    q: "What documents or evidence may be required?",
    a: "At least 3 of: official programme page, partner confirmation, beneficiary numbers, delivery photos/video, signed MoU, testimonial, independent media coverage, or evidence of continuity.",
  },
  {
    q: "How are nominees verified?",
    a: "Through the EDI Matrix — scored across Evidence Quality, Education Access, Learning Quality, Equity & Inclusion, Scale, Sustainability, Innovation, and Documentary Value, validated by regional SCEF panels.",
  },
  {
    q: "Can a Platinum recipient also compete for Blue Garnet?",
    a: "Yes, if their programme meets the higher competitive thresholds.",
  },
];
