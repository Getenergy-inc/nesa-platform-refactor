// Africa Education Icon Award — Lifetime Achievement (2006–2026)
// Nested data layer: Subcategory → Classification → Nominee

export type IconSubcategorySlug =
  | "literary-new-curriculum-advocate"
  | "technical-educator-icon"
  | "education-philanthropy-icon";

export type IconClassificationSlug =
  | "africans-in-africa"
  | "diaspora-africans"
  | "friends-of-africa";

export type JuryStatus =
  | "nominated"
  | "verified"
  | "shortlisted"
  | "jury_reviewed"
  | "laureate";

export interface IconNominee {
  id: string;
  name: string;
  slug: string;
  award_subcategory_slug: IconSubcategorySlug;
  classification_slug: IconClassificationSlug;
  country: string;
  region: string;
  nationality?: string;
  manual_review_required?: boolean;
  residency_status?: string;
  heritage_identity?: string;
  sector?: string;
  impact_area: string[];
  years_of_contribution: string;
  impact_summary: string;
  full_impact_story?: string;
  impact_metrics?: Record<string, string | number>;
  jury_status: JuryStatus;
  verification_status: "pending" | "verified";
  image_url: string;
  banner_url?: string;
  media_gallery?: { type: "image" | "video" | "link"; url: string; title?: string }[];
  previous_categories?: string[];
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  nomination_year?: number;
  // ── Migration audit fields (Phase 2 plan) ──────────────────
  previous_category?: string;
  previous_subcategory?: string;
  migration_source?: "awards-nominees.csv" | "nominees-master.json" | "manual" | "legacy-archive";
  migration_reason?: string;
  migration_status?: "auto" | "manual" | "verified" | "pending-review";
  migration_confidence_score?: number; // 0..1
}

export interface IconSubcategory {
  slug: IconSubcategorySlug;
  title: string;
  short: string;
  description: string;
  purpose: string;
}

export interface IconClassification {
  slug: IconClassificationSlug;
  title: string;
  short: string;
  description: string;
}

export const ICON_AWARD = {
  slug: "africa-education-icon-award",
  title: "Africa Education Icon Award — Lifetime Achievement",
  yearRange: "2006–2026",
  subtitle:
    "Honouring transformational leaders whose long-term contributions have shaped education across Africa from 2006 to 2026.",
  status: "Jury Selection Only",
};

export const ICON_SUBCATEGORIES: IconSubcategory[] = [
  {
    slug: "literary-new-curriculum-advocate",
    title: "Literary & New Curriculum Advocate Icon of the Decade",
    short: "Literary & Curriculum",
    description:
      "Authors, publishers, curriculum reformers, education policy writers, and knowledge-system builders shaping how Africa learns.",
    purpose:
      "Classify literary leaders, curriculum reformers, writers, education content creators, policy writers, publishers, and knowledge-system builders.",
  },
  {
    slug: "technical-educator-icon",
    title: "Africa Technical Educator Icon of the Decade",
    short: "Technical Educator",
    description:
      "TVET, STEM, vocational and innovation training pioneers preparing Africa for the technical economy of tomorrow.",
    purpose:
      "Classify technical educators, vocational education leaders, STEM/TVET champions, innovation trainers, technology education leaders, and skills-development pioneers.",
  },
  {
    slug: "education-philanthropy-icon",
    title: "Africa Education Philanthropy Icon of the Decade",
    short: "Education Philanthropy",
    description:
      "Foundation leaders, scholarship sponsors, CSR funders and infrastructure backers whose generosity has scaled African education.",
    purpose:
      "Classify philanthropists, foundation leaders, CSR funders, education donors, scholarship sponsors, infrastructure supporters, and social impact investors.",
  },
];

export const ICON_CLASSIFICATIONS: IconClassification[] = [
  {
    slug: "africans-in-africa",
    title: "Africans in Africa",
    short: "Africans in Africa",
    description:
      "African nominees who live and work primarily within Africa, with direct education impact on the continent.",
  },
  {
    slug: "diaspora-africans",
    title: "Diaspora Africans",
    short: "Diaspora",
    description:
      "Nominees of African origin, heritage, or identity who live and work primarily outside Africa but contribute significantly to African education.",
  },
  {
    slug: "friends-of-africa",
    title: "Friends of Africa",
    short: "Friends of Africa",
    description:
      "Non-African individuals, organisations, institutions, or global partners with long-term contributions to African education.",
  },
];

// ---------- Migrated nominees from legacy awards-nominees.csv (2014–2024 records) ----------
// Migration source: src/data/awards-nominees.csv → "Africa Lifetime Education Icon Special Recognition Award"
// Classification rule:
//   - africans-in-africa: African national, primary base in Africa
//   - diaspora-africans: African heritage/nationality, primary base outside Africa
//   - friends-of-africa: Non-African nationals with sustained African education impact
// Original subcategory year range (2014–2024) is preserved in `previous_categories`.
const N = (n: IconNominee): IconNominee => n;

export const ICON_NOMINEES: IconNominee[] = [
  // ===== LITERARY & NEW CURRICULUM ADVOCATE =====
  // -- Africans in Africa --
  N({
    id: "ICON-LIT-001", name: "Chinua Achebe", slug: "chinua-achebe",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Literature & Curriculum",
    impact_area: ["African Literature", "Curriculum Reform"],
    years_of_contribution: "1958–2013 (legacy honoured 2006–2026)",
    impact_summary: "Founded the Chinua Achebe Foundation (1990), promoting African literature and shaping literary education across Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/chinua-achebe.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-002", name: "Mariama Ba", slug: "mariama-ba",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "africans-in-africa",
    country: "Senegal", region: "West Africa", nationality: "Senegalese",
    sector: "Girls' Education & Literature",
    impact_area: ["Girls' Education", "Literature"],
    years_of_contribution: "1979–present (legacy)",
    impact_summary: "Established the Mariama Ba School (1979), a beacon of girls' education in Senegal.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/mariama-ba.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-003", name: "Wole Soyinka", slug: "wole-soyinka",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Literature & Media Literacy",
    impact_area: ["Media Literacy", "Literature", "Investigative Journalism Training"],
    years_of_contribution: "2004–present",
    impact_summary: "Established the Wole Soyinka Centre for Investigative Journalism (2004), promoting media literacy and education in Nigeria.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/wole-soyinka.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-004", name: "Ama Ata Aidoo", slug: "ama-ata-aidoo",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "africans-in-africa",
    country: "Ghana", region: "West Africa", nationality: "Ghanaian",
    sector: "Women Writers & Literacy",
    impact_area: ["Women's Literature", "Literacy"],
    years_of_contribution: "2000–present",
    impact_summary: "Founded the Mbaasem Foundation (2000), supporting African women writers and promoting literacy in Ghana.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/ama-ata-aidoo.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  // -- Diaspora Africans --
  N({
    id: "ICON-LIT-005", name: "Ngugi wa Thiong'o", slug: "ngugi-wa-thiongo",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States", region: "Diaspora & Global Africa", nationality: "Kenyan",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Indigenous Language & Curriculum",
    impact_area: ["Indigenous Language", "Curriculum Reform"],
    years_of_contribution: "1980–present",
    impact_summary: "Founded the Ngugi wa Thiong'o Foundation (1980), promoting indigenous languages in education across Kenya and Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/ngugi-wa-thiongo.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-006", name: "Chris Abani", slug: "chris-abani",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States", region: "Diaspora & Global Africa", nationality: "Nigerian",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Literature & Rural Education Advocacy",
    impact_area: ["Rural Education", "Girls' Education", "Literature"],
    years_of_contribution: "2006–2026",
    impact_summary: "Dedication to improving rural education, particularly for girls, with significant community impact.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/chris-abani.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-007", name: "Buchi Emecheta", slug: "buchi-emecheta",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United Kingdom", region: "Diaspora & Global Africa", nationality: "Nigerian",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Women's Literature",
    impact_area: ["Girls' Education", "Women's Literature"],
    years_of_contribution: "1972–2017 (legacy)",
    impact_summary: "Sustained advocacy for rural and girls' education through literary work from the diaspora.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/buchi-emecheta.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-008", name: "Chimamanda Ngozi Adichie", slug: "chimamanda-ngozi-adichie",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States", region: "Diaspora & Global Africa", nationality: "Nigerian",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Literary Education & Mentorship",
    impact_area: ["Creative Writing", "Mentorship", "Literacy"],
    years_of_contribution: "2008–present",
    impact_summary: "Founded the Farafina Trust (2008), promoting literary education and supporting young writers in Nigeria.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/chimamanda-ngozi-adichie.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-009", name: "Nnedi Okorafor", slug: "nnedi-okorafor",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States", region: "Diaspora & Global Africa", nationality: "Nigerian-American",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Speculative Fiction & Literacy",
    impact_area: ["African Literature", "Speculative Fiction"],
    years_of_contribution: "2016–present",
    impact_summary: "Co-founded the African Speculative Fiction Society (2016), promoting African literature in science fiction and fantasy.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/nnedi-okorafor.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-LIT-010", name: "Teju Cole", slug: "teju-cole",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States", region: "Diaspora & Global Africa", nationality: "Nigerian-American",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Creative Writing",
    impact_area: ["Creative Writing", "Literature"],
    years_of_contribution: "2010–present",
    impact_summary: "Founded the Teju Cole Literary Project (2010), promoting literature and creative writing in Nigeria.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/teju-cole.png",
    previous_categories: ["Literary And New Curriculum Advocate Africa Education Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),

  // ===== AFRICA TECHNICAL EDUCATOR =====
  // -- Africans in Africa --
  N({
    id: "ICON-TECH-001", name: "Patrick Awuah", slug: "patrick-awuah",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Ghana", region: "West Africa", nationality: "Ghanaian",
    sector: "Higher Education & Leadership",
    impact_area: ["Liberal Arts", "Leadership", "Ethics", "Entrepreneurship"],
    years_of_contribution: "2002–present",
    impact_summary: "Founder of Ashesi University (2002), emphasising leadership, ethics, and entrepreneurship in technical and liberal arts education.",
    jury_status: "shortlisted", verification_status: "verified",
    image_url: "/images/africaicons/patrick-awuah.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-002", name: "Ndidi Nwuneli", slug: "ndidi-nwuneli",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Leadership Training",
    impact_area: ["Leadership", "Life Skills", "Youth Training"],
    years_of_contribution: "2002–present",
    impact_summary: "Co-founder of LEAP Africa (2002), focused on leadership and life-skills training for young Africans.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/ndidi-nwuneli.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-003", name: "Fred Swaniker", slug: "fred-swaniker",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Mauritius", region: "Indian Ocean Islands", nationality: "Ghanaian",
    sector: "Higher Education",
    impact_area: ["Higher Education", "Leadership", "Tech"],
    years_of_contribution: "2015–present",
    impact_summary: "Founder of African Leadership University (2015), developing Africa's next generation of leaders.",
    jury_status: "shortlisted", verification_status: "verified",
    image_url: "/images/africaicons/fred-swaniker.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-004", name: "Oluseun Onigbinde", slug: "oluseun-onigbinde",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Civic Tech & Data Literacy",
    impact_area: ["Data Literacy", "Civic Tech", "Governance Education"],
    years_of_contribution: "2011–present",
    impact_summary: "Co-founder of BudgIT (2011), using data to drive education in governance and public policy.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/oluseun-onigbinde.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-005", name: "Bright Simons", slug: "bright-simons",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Ghana", region: "West Africa", nationality: "Ghanaian",
    sector: "Mobile Tech for Education",
    impact_area: ["Mobile Technology", "Education Services"],
    years_of_contribution: "2007–present",
    impact_summary: "Founder of mPedigree (2007), using mobile technology to enhance healthcare and education services.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/bright-simons.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-006", name: "Rebecca Enonchong", slug: "rebecca-enonchong",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Cameroon", region: "Central Africa", nationality: "Cameroonian",
    sector: "Enterprise IT Education",
    impact_area: ["IT Education", "Enterprise Software"],
    years_of_contribution: "1999–present",
    impact_summary: "Founder of AppsTech (1999), providing enterprise application solutions and supporting IT education in Africa.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/rebecca-enonchong.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-007", name: "Judith Owigar", slug: "judith-owigar",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Kenya", region: "East Africa", nationality: "Kenyan",
    sector: "Women in Tech",
    impact_area: ["Software Development", "Women in Tech"],
    years_of_contribution: "2010–present",
    impact_summary: "Co-founder of AkiraChix (2010), empowering young Kenyan women through technical training in software development.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/judith-owigar.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-008", name: "Tunde Kehinde", slug: "tunde-kehinde",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Financial Literacy",
    impact_area: ["Financial Literacy", "Small Business Education"],
    years_of_contribution: "2016–present",
    impact_summary: "Co-founder of Lidya (2016), a digital financial services platform providing financial literacy to small businesses in Africa.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/tunde-kehinde.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-TECH-009", name: "Iyinoluwa Aboyeji", slug: "iyinoluwa-aboyeji",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Fintech Education",
    impact_area: ["Fintech", "Tech Training"],
    years_of_contribution: "2016–present",
    impact_summary: "Co-founder of Flutterwave (2016), supporting fintech education and training across Africa.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/iyinoluwa-aboyeji.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  // -- Friends of Africa --
  N({
    id: "ICON-TECH-010", name: "Audrey Cheng", slug: "audrey-cheng",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "friends-of-africa",
    country: "Kenya", region: "East Africa", nationality: "American",
    heritage_identity: "Non-African", residency_status: "Based in Africa",
    sector: "Coding & Software Training",
    impact_area: ["Coding Bootcamp", "Software Training"],
    years_of_contribution: "2014–present",
    impact_summary: "Founder of Moringa School (2014), a Nairobi-based technology and coding bootcamp training African software developers.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/audrey-cheng.png",
    previous_categories: ["Africa Technical Educator Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),

  // ===== AFRICA EDUCATION PHILANTHROPY =====
  // -- Africans in Africa --
  N({
    id: "ICON-PHIL-001", name: "Aliko Dangote", slug: "aliko-dangote",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Foundation Philanthropy",
    impact_area: ["Scholarships", "School Infrastructure"],
    years_of_contribution: "1993–present",
    impact_summary: "Established the Dangote Foundation (1993), investing millions in educational causes across Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/aliko-dangote.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-002", name: "Folorunso Alakija", slug: "folorunso-alakija",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Foundation Philanthropy",
    impact_area: ["Scholarships", "Widows & Orphans Education"],
    years_of_contribution: "2008–present",
    impact_summary: "Established the Rose of Sharon Foundation (2008), providing scholarships and educational support to widows and orphans.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/Folorunso-alakija.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-003", name: "Patrice Motsepe", slug: "patrice-motsepe",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "South Africa", region: "Southern Africa", nationality: "South African",
    sector: "Foundation Philanthropy",
    impact_area: ["Scholarships", "School Infrastructure"],
    years_of_contribution: "1999–present",
    impact_summary: "Founded the Motsepe Foundation (1999), focused on education, scholarships, and school infrastructure in South Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/patrice-motsepe.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-004", name: "Isabel dos Santos", slug: "isabel-dos-santos",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Angola", region: "Southern Africa", nationality: "Angolan",
    sector: "Foundation Philanthropy",
    impact_area: ["Scholarships", "Education Projects"],
    years_of_contribution: "2014–present",
    impact_summary: "Founded the Isabel dos Santos Foundation (2014), funding educational projects and scholarships in Angola.",
    jury_status: "nominated", verification_status: "pending",
    manual_review_required: true,
    image_url: "/images/africaicons/isabel-dos-santos.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  } as IconNominee & { manual_review_required?: boolean }),
  N({
    id: "ICON-PHIL-005", name: "Nassef Sawiris", slug: "nassef-sawiris",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Egypt", region: "North Africa", nationality: "Egyptian",
    sector: "Foundation Philanthropy",
    impact_area: ["Higher Education", "Scholarships"],
    years_of_contribution: "2001–present",
    impact_summary: "Founded the Sawiris Foundation for Social Development (2001), supporting higher education and scholarships in Egypt.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/nassef-sawiris.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-006", name: "Osei Kwame Despite", slug: "osei-kwame-despite",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Ghana", region: "West Africa", nationality: "Ghanaian",
    sector: "Foundation Philanthropy",
    impact_area: ["Scholarships", "School Building"],
    years_of_contribution: "2006–2026",
    impact_summary: "Founded the Despite Foundation, supporting education through scholarships and school-building projects in Ghana.",
    jury_status: "nominated", verification_status: "verified",
    image_url: "/images/africaicons/osei-kwame.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-007", name: "Tony Elumelu", slug: "tony-elumelu",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria", region: "West Africa", nationality: "Nigerian",
    sector: "Entrepreneurship Education",
    impact_area: ["Scholarships", "Entrepreneurship Education"],
    years_of_contribution: "2010–present",
    impact_summary: "Established the Tony Elumelu Foundation (2010), providing scholarships and promoting entrepreneurship education across Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/tony-elumelu.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  // -- Diaspora Africans --
  N({
    id: "ICON-PHIL-008", name: "Mo Ibrahim", slug: "mo-ibrahim",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "diaspora-africans",
    country: "United Kingdom", region: "Diaspora & Global Africa", nationality: "Sudanese-British",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Governance & Leadership Education",
    impact_area: ["Governance Education", "Leadership"],
    years_of_contribution: "2006–present",
    impact_summary: "Founded the Mo Ibrahim Foundation (2006), supporting governance and leadership education in Africa.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/mo-ibrahim.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-009", name: "Strive Masiyiwa", slug: "strive-masiyiwa",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "diaspora-africans",
    country: "United Kingdom", region: "Diaspora & Global Africa", nationality: "Zimbabwean",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Scholarships",
    impact_area: ["Scholarships", "Higher Education"],
    years_of_contribution: "1996–present",
    impact_summary: "Established the Higher Life Foundation (1996), providing scholarships to over 250,000 African students.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/strive-masiyiwa.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
  N({
    id: "ICON-PHIL-010", name: "Tsitsi Masiyiwa", slug: "tsitsi-masiyiwa",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "diaspora-africans",
    country: "United Kingdom", region: "Diaspora & Global Africa", nationality: "Zimbabwean",
    heritage_identity: "African", residency_status: "Diaspora",
    sector: "Scholarships for Orphans",
    impact_area: ["Scholarships", "Orphans & Vulnerable Children"],
    years_of_contribution: "1996–present",
    impact_summary: "Co-founded the Capernaum Trust (1996), providing scholarships and educational support to orphans and vulnerable children.",
    jury_status: "verified", verification_status: "verified",
    image_url: "/images/africaicons/tsitsi-masiyiwa.png",
    previous_categories: ["Africa Education Philanthropy Icon Of The Decade (2014-2024)"],
    nomination_year: 2024,
  }),
];

// Merge refactored 2005–2025 secretariat roster + 2026 workbook (deduped by slug).
// Keeps legacy entries authoritative when slugs collide.
import { REFACTORED_ICON_NOMINEES } from "./refactoredIconNominees";
import { WORKBOOK_ICON_NOMINEES } from "./workbookNominees";

export interface IconMergeCollision {
  slug: string;
  name: string;
  legacyName: string;
  legacySource: string;
  refactoredSource: string;
  legacySubcategory: string;
  refactoredSubcategory: string;
}

export interface IconMergeStats {
  legacyCount: number;
  refactoredCandidates: number;
  added: number;
  deduplicated: number;
  finalCount: number;
  collisions: IconMergeCollision[];
  sources: { legacy: string; refactored: string };
  bySubcategoryRefactored: Record<string, { candidates: number; added: number; deduped: number }>;
}

export const LEGACY_ICON_NOMINEES: IconNominee[] = [...ICON_NOMINEES];

// Resolve portrait URLs from the bundled image manifest so nominees always
// point at a file that actually exists in /public/images/africaicons.
import { resolveIconImage } from "./imageManifest";
const PLACEHOLDER_ICON_IMG = "/images/africaicons/placeholder-icon.svg";
const nameSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const applyImage = (n: IconNominee): IconNominee => {
  const resolved = resolveIconImage(n.slug, nameSlug(n.name));
  if (resolved) n.image_url = resolved;
  else if (!n.image_url || n.image_url.includes("undefined")) n.image_url = PLACEHOLDER_ICON_IMG;
  return n;
};
for (const n of ICON_NOMINEES) applyImage(n);

export const ICON_MERGE_STATS: IconMergeStats = (() => {
  const legacyCount = ICON_NOMINEES.length;
  const legacyBySlug = new Map(ICON_NOMINEES.map((n) => [n.slug, n]));
  const collisions: IconMergeCollision[] = [];
  const bySub: Record<string, { candidates: number; added: number; deduped: number }> = {};
  let added = 0;
  let deduped = 0;

  for (const n of REFACTORED_ICON_NOMINEES) {
    const sub = n.award_subcategory_slug;
    bySub[sub] ??= { candidates: 0, added: 0, deduped: 0 };
    bySub[sub].candidates++;
    const existing = legacyBySlug.get(n.slug);
    if (existing) {
      deduped++;
      bySub[sub].deduped++;
      collisions.push({
        slug: n.slug,
        name: n.name,
        legacyName: existing.name,
        legacySource: existing.migration_source ?? "legacy-archive",
        refactoredSource: n.migration_source ?? "manual",
        legacySubcategory: existing.award_subcategory_slug,
        refactoredSubcategory: n.award_subcategory_slug,
      });
    } else {
      ICON_NOMINEES.push(n);
      legacyBySlug.set(n.slug, n);
      added++;
      bySub[sub].added++;
    }
  }

  for (const n of WORKBOOK_ICON_NOMINEES) {
    const sub = n.award_subcategory_slug;
    bySub[sub] ??= { candidates: 0, added: 0, deduped: 0 };
    bySub[sub].candidates++;
    const existing = legacyBySlug.get(n.slug);
    if (existing) {
      deduped++;
      bySub[sub].deduped++;
    } else {
      ICON_NOMINEES.push(n);
      legacyBySlug.set(n.slug, n);
      added++;
      bySub[sub].added++;
    }
  }

  return {
    legacyCount,
    refactoredCandidates: REFACTORED_ICON_NOMINEES.length + WORKBOOK_ICON_NOMINEES.length,
    added,
    deduplicated: deduped,
    finalCount: ICON_NOMINEES.length,
    collisions,
    sources: {
      legacy: "src/data/iconAward/index.ts (awards-nominees.csv → 2014–2024 archive)",
      refactored: "refactoredIconNominees.ts (Mar 2026 secretariat shortlist) + workbookNominees.ts (NESA_Africa_Icon_Nominee_List 2006–2026, 285 entries)",
    },
    bySubcategoryRefactored: bySub,
  };
})();


// ---------- Selectors ----------
export const getSubcategory = (slug: string): IconSubcategory | undefined =>
  ICON_SUBCATEGORIES.find((s) => s.slug === slug);

export const getClassification = (slug: string): IconClassification | undefined =>
  ICON_CLASSIFICATIONS.find((c) => c.slug === slug);

export const bySubcategory = (sub: IconSubcategorySlug): IconNominee[] =>
  ICON_NOMINEES.filter((n) => n.award_subcategory_slug === sub);

export const byClassification = (
  sub: IconSubcategorySlug,
  cls: IconClassificationSlug
): IconNominee[] =>
  ICON_NOMINEES.filter(
    (n) => n.award_subcategory_slug === sub && n.classification_slug === cls
  );

export const featured = (
  sub: IconSubcategorySlug,
  cls?: IconClassificationSlug,
  n = 3
): IconNominee[] => {
  const pool = cls ? byClassification(sub, cls) : bySubcategory(sub);
  return pool.slice(0, n);
};

export const getIconNominee = (slug: string): IconNominee | undefined =>
  ICON_NOMINEES.find((n) => n.slug === slug);

export const classificationUrl = (
  sub: IconSubcategorySlug,
  cls: IconClassificationSlug
) => `/nominees/africa-education-icon-award/${sub}/${cls}`;

export const subcategoryUrl = (sub: IconSubcategorySlug) =>
  `/nominees/africa-education-icon-award/${sub}`;

export const profileUrl = (slug: string) => `/nominee/${slug}`;
