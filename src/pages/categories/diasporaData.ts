// Diaspora Education Impact — 2026 nominee data
// One Platinum category, 8 geographic regions.
// Identity consent and media consent are tracked independently.

export type IdentityStatus = "awaiting_consent" | "confirmed";
export type MediaType = "photo" | "video" | "none";
export type MediaConsent = "awaiting_consent" | "confirmed";

export interface DiasporaNominee {
  role: string;
  org: string; // base → home
  impact: string;
  identity_status: IdentityStatus;
  media_type: MediaType;
  media_consent: MediaConsent;
  media_url?: string;
  duration?: string; // for video, e.g. "0:42"
}

export interface DiasporaSubcategory {
  track: string;
  title: string;
  slug: string; // subcategory UUID
  desc: string;
}

export type DiasporaRegion =
  | "North Africa"
  | "West Africa"
  | "Central Africa"
  | "East Africa"
  | "Southern Africa"
  | "Sahel Region"
  | "Horn of Africa"
  | "Indian Ocean";

export const DIASPORA_REGIONS: DiasporaRegion[] = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Southern Africa",
  "Sahel Region",
  "Horn of Africa",
  "Indian Ocean",
];

export const PRIMARY_NOMINATE_HREF =
  "/nominate?subcategory=9d4d70e8-0d49-432b-8275-55a5725f7d45";

const awaiting = (
  role: string,
  org: string,
  impact: string,
): DiasporaNominee => ({
  role,
  org,
  impact,
  identity_status: "awaiting_consent",
  media_type: "none",
  media_consent: "awaiting_consent",
});

export const NOMINEES_BY_REGION: Record<DiasporaRegion, DiasporaNominee[]> = {
  "North Africa": [
    awaiting("Cardiologist & Education Philanthropist", "Egyptians in UK Trust (UK → Egypt)", "Funded 6 STEM labs, 4,500 learners"),
    awaiting("EdTech Founder", "Egypt Learning Canada (CA → Egypt)", "Low-data LMS, 4,000 learners"),
    awaiting("OER Producer", "Algeria Science UK (UK → Algeria)", "Arabic science OER, 1M+ reached"),
    awaiting("Scholarship Lead", "Tunisia Scholars CH (CH → Tunisia)", "95 HE scholars"),
    awaiting("Librarian", "Libya Heritage Italy (IT → Libya)", "3 libraries rehabilitated"),
  ],
  "West Africa": [
    awaiting("Tech Investor", "Ghana STEM US (US → Ghana)", "10 STEM classrooms"),
    awaiting("Scholarship Lead", "Nigeria Scholars UK (UK → Nigeria)", "500 bursaries"),
    awaiting("Systems Engineer", "Nigeria Labs CA (CA → Nigeria)", "12 smart labs, 3 LGAs"),
    awaiting("STEM Mentor", "Ghana Women in STEM UK (UK → Ghana)", "2,000 girls mentored"),
    awaiting("Publisher", "Guinea Readers CA (CA → Guinea)", "8,000 bilingual readers"),
    awaiting("Makerspaces", "Ghana TVET NL (NL → Ghana)", "6 TVET makerspaces"),
  ],
  "Central Africa": [
    awaiting("School Builder", "Cameroon UK (UK → Cameroon)", "4 schools built"),
    awaiting("STEM Centres", "DRC BE (BE → DRC)", "3 centres, 1,800 learners"),
    awaiting("Scholarship Lead", "Gabon FR (FR → Gabon)", "500 scholarships"),
    awaiting("Coding Coach", "Cameroon DE (DE → Cameroon)", "Robotics for 2,000 learners"),
    awaiting("STEM Labs", "DRC US (US → DRC)", "10 labs, 6 provinces"),
    awaiting("Summit Convenor", "Central Africa Education Forum (BE → Regional)", "Annual diaspora summit"),
  ],
  "East Africa": [
    awaiting("Lab Builder", "Kenya Labs US (US → Kenya)", "Smart labs, 5 counties"),
    awaiting("Scholarship Director", "Rwanda Girls BE (BE → Rwanda)", "1,200 scholars, 92% completion"),
    awaiting("Remote CPD", "Kenya Teachers US (US → Kenya)", "3,500 teachers"),
    awaiting("e-Libraries", "Kenya Hubs UK (UK → Kenya)", "6 e-libraries"),
    awaiting("Solar Access", "Tanzania Solar CA (CA → Tanzania)", "Solarized 12 schools"),
  ],
  "Southern Africa": [
    awaiting("Rural Builder", "South Africa UK (UK → South Africa)", "2,000 learners"),
    awaiting("Girls' Scholarships", "Malawi CA (CA → Malawi)", "2,000 scholarships, +18pt retention"),
    awaiting("Mentorship", "South Africa UK (UK → South Africa)", "5,000 mentees"),
    awaiting("School Rehab", "Zambia US (US → Zambia)", "15 schools rehabbed"),
    awaiting("HE Devices", "Angola PT (PT → Angola)", "100 PCs to universities"),
    awaiting("SADC Teacher Training Lead", "SADC Diaspora Education Collective (Multi-base → SADC)", "Regional grant for teacher CPD"),
  ],
  "Sahel Region": [
    awaiting("Education Relief Coordinator", "Sudanese Professionals UAE (UAE → Sudan)", "Temporary classrooms, books at 9 sites"),
    awaiting("WASH Lead", "Niger Water AE (AE → Niger)", "Boreholes + WASH for desert schools"),
    awaiting("Community Dev", "Mali Centre FR (FR → Mali)", "Learning centre, night study with solar"),
    awaiting("CPD Trainer", "Chad FR (FR → Chad)", "200 teachers trained, coaching cycles"),
  ],
  "Horn of Africa": [
    awaiting("Women in Tech", "Somalia Digital UK (UK → Somalia)", "1,200 women trained"),
    awaiting("ICT Hub Lead", "Eritrea Tech DE (DE → Eritrea)", "ICT hub + library, uptime 92%"),
    awaiting("School Builder", "Ethiopia Schools US (US → Ethiopia)", "Built 2 high schools, MoE MoUs"),
    awaiting("Teacher Trainer", "South Sudan Refugee CA (CA → South Sudan)", "200 teachers trained"),
  ],
  "Indian Ocean": [],
};

export const SUBCATEGORIES: DiasporaSubcategory[] = [
  { track: "01", title: "Diaspora Association Educational Partnership Award", slug: "9d4d70e8-0d49-432b-8275-55a5725f7d45", desc: "Diaspora associations and national unions funding scholarships, infrastructure, or teacher training (≥$50,000, 2021–2026)." },
  { track: "02", title: "Outstanding Individual Diaspora Education Champion", slug: "e59bd164-6c73-4a51-9f23-15e0bcaa1114", desc: "Individuals abroad sponsoring classrooms, donating devices, or mentoring teachers." },
  { track: "03", title: "Diaspora-Led Institutional Development & Capacity-Building Award", slug: "160989b3-8028-4ea6-88ef-0137f9e5f225", desc: "Professional networks strengthening African institutions through knowledge transfer or policy support." },
  { track: "04", title: "Diaspora Philanthropy & CSR Impact Recognition", slug: "e039aefe-14aa-4ef1-8ca8-f8f62b52f28a", desc: "Diaspora-owned businesses or CSR foundations funding feeding programs, libraries, or TVET labs." },
  { track: "05", title: "Diaspora Scholarship Programmes", slug: "42bc39f2-7f52-4561-92f9-f0e62c457d23", desc: "Structured scholarship or bursary schemes covering fees, devices, or stipends." },
  { track: "06", title: "Diaspora Digital Education Innovation Award", slug: "c6ca46d0-87db-4fbe-8720-8b4ea99ca023", desc: "Platforms or apps for remote learning, teacher support, or school data management." },
];

export const WHO_QUALIFIES = [
  "Registered diaspora associations or national unions (e.g. NIDO chapters, alumni groups)",
  "Individual Africans abroad — financial, professional, or technical contributors",
  "Professional networks in academia, health, ICT, or engineering",
  "Private diaspora-owned businesses or CSR foundations",
  "Digital innovators building remote-learning or teacher-support platforms",
];

export const THRESHOLD_ROWS: Array<{ criterion: string; threshold: string }> = [
  { criterion: "Contribution", threshold: "Cash, kind, or expertise, 2021–2026" },
  { criterion: "Scale", threshold: "≥5 institutions or ≥5,000 beneficiaries" },
  { criterion: "Verification", threshold: "At least 1 public proof link" },
  { criterion: "Regional spread", threshold: "≥1 country per participating region" },
  { criterion: "Governance", threshold: "Transparent, auditable, or community-endorsed" },
];

export const TIMELINE_ROWS = [
  { step: "Nominations open", date: "Now – June 2026", what: "Submit nominee profiles and evidence via the online portal" },
  { step: "Verification", date: "June 2026", what: "SCEF regional panels validate submissions against the Platinum threshold" },
  { step: "Platinum Recognition Show", date: "5 July 2026", what: "Certificates awarded; feature spotlight on NESA TV" },
];

export const FAQS_SPECIFIC = [
  { q: "What is the difference between Blue Garnet and Platinum?", a: "Blue Garnet is competitive and publicly voted. Platinum is honorary and documentation-based — no voting, no fee." },
  { q: "Must contributions be monetary?", a: "No. Expertise, mentorship, materials, or digital resources qualify equally." },
  { q: "How are nominees verified?", a: "Through uploaded evidence, references, or validation from ministries, embassies, or partner NGOs." },
  { q: "Can a Platinum recipient also compete for Blue Garnet?", a: "Yes, if their project meets the higher competitive thresholds." },
];
