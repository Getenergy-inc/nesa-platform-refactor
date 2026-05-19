/**
 * NESA Africa — Best NGO Contribution to Education (5-Africa Regional)
 * ──────────────────────────────────────────────────────────────────────
 * Cleaned, classified, region-mapped NGO nominee data layer.
 *
 * Sources:
 *  - 14 verified records migrated from `src/data/nominees-2025.ts`
 *    (rows 232–245, "Best NGO Education Support Recognition Award (Africa-Regional)")
 *  - Curated public-record NGOs for East, North, Central, Southern Africa
 *    (flagged `requiresManualReview: true` until admin verification)
 *
 * Subcategory taxonomy (collapsed from 4 legacy → 3 impact pillars):
 *  - education-infrastructure-impact     (schools, libraries, ICT labs, WASH)
 *  - teacher-student-support-impact      (materials, training, scholarships, aid)
 *  - youth-girls-empowerment-impact      (girls' ed, leadership, inclusion)
 */

export type NGOSubcategory =
  | "education-infrastructure-impact"
  | "teacher-student-support-impact"
  | "youth-girls-empowerment-impact";

export type NGORegion =
  | "west-africa"
  | "east-africa"
  | "north-africa"
  | "central-africa"
  | "southern-africa";

export type NGOMigrationConfidence = "high" | "medium" | "low" | "manual_review_required";

export interface NGONominee {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: NGORegion;
  subcategory: NGOSubcategory;
  organizationType: "NGO" | "Foundation" | "Charity" | "Civil Society";
  impactSummary: string;
  educationContribution: string;
  beneficiaries?: string;
  logoUrl?: string;
  imageUrl?: string;
  verificationStatus: "verified" | "pending" | "curated";
  voteEnabled: boolean;
  nominationYear: number;
  migrationConfidence: NGOMigrationConfidence;
  requiresManualReview: boolean;
  previousCategories: string[];
  previousSubcategories: string[];
  legacyId?: number;
  tags: string[];
}

export const NGO_SUBCATEGORIES: { slug: NGOSubcategory; name: string; description: string }[] = [
  {
    slug: "education-infrastructure-impact",
    name: "Education Infrastructure Impact",
    description:
      "NGOs building or renovating schools, libraries, ICT labs, classrooms, and WASH facilities that expand learning access.",
  },
  {
    slug: "teacher-student-support-impact",
    name: "Teacher & Student Support Impact",
    description:
      "NGOs delivering teacher training, learning materials, scholarships, textbooks, and direct educational aid.",
  },
  {
    slug: "youth-girls-empowerment-impact",
    name: "Youth & Girls' Empowerment Impact",
    description:
      "NGOs advancing girls' education, leadership, gender inclusion, and youth skills development across Africa.",
  },
];

export const NGO_REGIONS: { slug: NGORegion; name: string; countries: string[] }[] = [
  {
    slug: "west-africa",
    name: "West Africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Sierra Leone", "Liberia", "Côte d'Ivoire", "Togo", "Benin", "Burkina Faso", "Mali", "Niger", "Guinea", "Gambia", "Cape Verde", "Guinea-Bissau"],
  },
  {
    slug: "east-africa",
    name: "East Africa",
    countries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "Ethiopia", "Somalia", "South Sudan", "Eritrea", "Djibouti", "Seychelles", "Comoros", "Mauritius"],
  },
  {
    slug: "north-africa",
    name: "North Africa",
    countries: ["Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Sudan", "Western Sahara"],
  },
  {
    slug: "central-africa",
    name: "Central Africa",
    countries: ["Cameroon", "Chad", "Central African Republic", "DR Congo", "Republic of Congo", "Gabon", "Equatorial Guinea", "São Tomé and Príncipe", "Angola"],
  },
  {
    slug: "southern-africa",
    name: "Southern Africa",
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Malawi", "Mozambique", "Lesotho", "Eswatini", "Madagascar"],
  },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const ngo = (
  name: string,
  country: string,
  region: NGORegion,
  subcategory: NGOSubcategory,
  impactSummary: string,
  educationContribution: string,
  opts: Partial<NGONominee> = {},
): NGONominee => ({
  id: `ngo-${slugify(name)}-${slugify(country)}`,
  slug: slugify(name),
  name,
  country,
  region,
  subcategory,
  organizationType: "NGO",
  impactSummary,
  educationContribution,
  verificationStatus: opts.verificationStatus ?? "curated",
  voteEnabled: true,
  nominationYear: 2025,
  migrationConfidence: opts.migrationConfidence ?? "medium",
  requiresManualReview: opts.requiresManualReview ?? true,
  previousCategories: opts.previousCategories ?? ["Best NGO Education Support Recognition Award (Africa-Regional)"],
  previousSubcategories: opts.previousSubcategories ?? [],
  tags: opts.tags ?? [],
  ...opts,
});

// ═══════════════════════════════════════════════════════════════════
// WEST AFRICA — 14 verified records from nominees-2025.ts (rows 232–245)
// ═══════════════════════════════════════════════════════════════════
const WEST_AFRICA: NGONominee[] = [
  ngo("Teach For Nigeria", "Nigeria", "west-africa", "education-infrastructure-impact",
    "Improving rural education access in underserved Nigerian communities, with a focus on girls' learning outcomes.",
    "Deploys fellows to under-resourced schools, expanding infrastructure and teacher coverage in rural Nigeria.",
    { legacyId: 232, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Best Educational Infrastructure Initiative By An NGO"], tags: ["rural-education", "fellowship"] }),
  ngo("Slum2School Africa", "Nigeria", "west-africa", "education-infrastructure-impact",
    "Brings out-of-school children in slum communities into structured learning environments.",
    "Builds digital learning centres and renovates classrooms in Lagos slum communities.",
    { legacyId: 233, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Best Educational Infrastructure Initiative By An NGO"], tags: ["urban-poverty", "digital-learning"] }),
  ngo("ActionAid Nigeria", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Implements the Safe Cities for Women and Girls initiative protecting learners from violence.",
    "Combines education infrastructure with safeguarding programs for girls in Nigerian cities.",
    { legacyId: 234, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Best Educational Infrastructure Initiative By An NGO", "Women And Girls' Empowerment In Education By An NGO In Nigeria"], tags: ["safe-cities", "girls"] }),
  ngo("Plan International Nigeria", "Nigeria", "west-africa", "education-infrastructure-impact",
    "Child-rights NGO improving school access and infrastructure for vulnerable communities.",
    "Builds classrooms, latrines, and water facilities in northern Nigeria schools.",
    { legacyId: 235, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Best Educational Infrastructure Initiative By An NGO"], tags: ["child-rights", "WASH"] }),
  ngo("Malala Fund Nigeria", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Champions 12 years of free, safe, quality education for every girl in Nigeria.",
    "Funds activist-led education programs and policy advocacy for girls' secondary schooling.",
    { legacyId: 236, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Best Educational Infrastructure Initiative By An NGO"], tags: ["girls-secondary", "advocacy"] }),
  ngo("The Tony Elumelu Foundation", "Nigeria", "west-africa", "teacher-student-support-impact",
    "Africa's largest entrepreneurship-focused philanthropy with deep education funding pillars.",
    "Provides learning materials, scholarships, and youth training across 54 African countries.",
    { legacyId: 237, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Exceptional Donation Of Educational Materials By An NGO"], tags: ["entrepreneurship", "scholarships"] }),
  ngo("LEAP Africa", "Nigeria", "west-africa", "teacher-student-support-impact",
    "Develops dynamic young leaders through ethical, value-based learning programs.",
    "Distributes teaching toolkits and runs leadership curricula in Nigerian secondary schools.",
    { legacyId: 238, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Exceptional Donation Of Educational Materials By An NGO"], tags: ["leadership", "curriculum"] }),
  ngo("Oando Foundation", "Nigeria", "west-africa", "teacher-student-support-impact",
    "Education-focused foundation adopting public primary schools across Nigeria.",
    "Trains teachers, donates learning materials, and renovates adopted government schools.",
    { legacyId: 239, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Exceptional Donation Of Educational Materials By An NGO"], tags: ["adopt-a-school", "teacher-training"] }),
  ngo("Youth for Technology Foundation", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Provides technology training and entrepreneurship education to young people.",
    "Equips youth with ICT, 3D printing, and digital entrepreneurship skills.",
    { legacyId: 240, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Youth Empowerment Through Educational Services By An NGO In Nigeria"], tags: ["tech-skills", "youth"] }),
  ngo("Junior Achievement Nigeria", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Empowers youths with financial literacy, work-readiness, and entrepreneurship education.",
    "Runs JA programs in 200+ secondary schools across Nigeria each year.",
    { legacyId: 241, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Youth Empowerment Through Educational Services By An NGO In Nigeria"], tags: ["financial-literacy", "work-readiness"] }),
  ngo("YALI Network Nigeria", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Leadership and professional development opportunities for young Nigerians.",
    "Delivers YALI civic-leadership and business-skills training to thousands annually.",
    { legacyId: 242, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Youth Empowerment Through Educational Services By An NGO In Nigeria"], tags: ["leadership", "civic"] }),
  ngo("Girls Education Mission International", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Provides educational scholarships, mentorship, and advocacy for girls' education.",
    "Sponsors girls through secondary school in northern Nigeria with full mentorship cycles.",
    { legacyId: 243, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Women And Girls' Empowerment In Education By An NGO In Nigeria"], tags: ["scholarships", "mentorship"] }),
  ngo("Women for Women International Nigeria", "Nigeria", "west-africa", "youth-girls-empowerment-impact",
    "Provides educational programs and vocational skills training for women survivors of conflict.",
    "Year-long social and economic empowerment curriculum for marginalised women in Plateau and Borno.",
    { legacyId: 245, verificationStatus: "verified", migrationConfidence: "high", requiresManualReview: false, previousSubcategories: ["Women And Girls' Empowerment In Education By An NGO In Nigeria"], tags: ["post-conflict", "vocational"] }),
  ngo("Camfed Ghana", "Ghana", "west-africa", "youth-girls-empowerment-impact",
    "Supports marginalised girls through secondary school and into leadership.",
    "Funds school fees, uniforms, and learning materials for thousands of Ghanaian girls.",
    { migrationConfidence: "high", requiresManualReview: false, tags: ["girls", "scholarships"], verificationStatus: "verified" }),
];

// ═══════════════════════════════════════════════════════════════════
// EAST AFRICA — curated public-record NGOs (manual review required)
// ═══════════════════════════════════════════════════════════════════
const EAST_AFRICA: NGONominee[] = [
  ngo("BRAC Uganda", "Uganda", "east-africa", "teacher-student-support-impact",
    "Largest NGO in the world delivering scholarships, ELA clubs, and adolescent education.",
    "Runs Empowerment & Livelihoods for Adolescents centres training out-of-school girls."),
  ngo("Forum for African Women Educationalists (FAWE)", "Kenya", "east-africa", "youth-girls-empowerment-impact",
    "Pan-African network advancing girls' and women's education in 33 countries.",
    "Provides bursaries, science camps, and gender-responsive pedagogy training."),
  ngo("Camara Education Kenya", "Kenya", "east-africa", "education-infrastructure-impact",
    "Transforms education in disadvantaged communities through digital learning.",
    "Installs ICT labs and trains teachers in 600+ schools across East Africa."),
  ngo("Imbuto Foundation", "Rwanda", "east-africa", "youth-girls-empowerment-impact",
    "Supports girls' education, adolescent health, and youth empowerment in Rwanda.",
    "Annual Best Performing Girls awards plus secondary-school scholarship program."),
  ngo("Educate!", "Uganda", "east-africa", "youth-girls-empowerment-impact",
    "Reforms secondary education to develop young African leaders and entrepreneurs.",
    "Integrates skills-based curriculum into national education systems in Uganda, Rwanda, Kenya."),
  ngo("Link Education Ethiopia", "Ethiopia", "east-africa", "teacher-student-support-impact",
    "Improves learning outcomes for girls and marginalised learners.",
    "Distributes literacy kits and trains teachers in Tigray and Amhara regions."),
];

// ═══════════════════════════════════════════════════════════════════
// NORTH AFRICA — curated public-record NGOs (manual review required)
// ═══════════════════════════════════════════════════════════════════
const NORTH_AFRICA: NGONominee[] = [
  ngo("Misr El Kheir Foundation", "Egypt", "north-africa", "education-infrastructure-impact",
    "One of Egypt's largest development foundations with a major education pillar.",
    "Builds and renovates schools and provides scholarships across Upper Egypt."),
  ngo("Educate Me Foundation", "Egypt", "north-africa", "teacher-student-support-impact",
    "Reimagines education in Egypt through learner-centred community schools.",
    "Trains teachers in active learning and operates partner community schools in Giza."),
  ngo("Anou Cooperative", "Morocco", "north-africa", "youth-girls-empowerment-impact",
    "Artisan-led education and economic empowerment platform for rural Moroccans.",
    "Runs adult literacy and digital-skills training for women artisans."),
  ngo("Fondation Orient-Occident", "Morocco", "north-africa", "youth-girls-empowerment-impact",
    "Supports vulnerable youth, migrants, and women through education and integration.",
    "Operates learning centres in Rabat and Casablanca for refugees and at-risk youth."),
  ngo("Tunisian Forum for Youth Empowerment", "Tunisia", "north-africa", "youth-girls-empowerment-impact",
    "Civil society organisation building youth civic and digital skills.",
    "Delivers MOOCs, hackathons, and leadership training to Tunisian university students."),
  ngo("Sudanese Red Crescent Education Programme", "Sudan", "north-africa", "education-infrastructure-impact",
    "Humanitarian response combining shelter, WASH, and education in emergencies.",
    "Builds temporary learning spaces in displacement camps across Sudan."),
];

// ═══════════════════════════════════════════════════════════════════
// CENTRAL AFRICA — curated public-record NGOs (manual review required)
// ═══════════════════════════════════════════════════════════════════
const CENTRAL_AFRICA: NGONominee[] = [
  ngo("Hope in Action Cameroon", "Cameroon", "central-africa", "education-infrastructure-impact",
    "Builds primary schools and libraries in rural Cameroonian villages.",
    "Constructs classroom blocks and water points serving 12+ communities."),
  ngo("Congo Children Trust", "DR Congo", "central-africa", "youth-girls-empowerment-impact",
    "Supports street-connected children in DRC with education and protection.",
    "Operates Kimbilio centres providing schooling, vocational training, and family reunification."),
  ngo("Action pour l'Éducation et la Promotion de la Femme (AEPF)", "DR Congo", "central-africa", "youth-girls-empowerment-impact",
    "Promotes girls' education and women's economic empowerment in Kinshasa.",
    "Runs literacy classes and entrepreneurship training for displaced women."),
  ngo("CEFA Onlus Angola", "Angola", "central-africa", "teacher-student-support-impact",
    "Italian-Angolan NGO supporting rural school systems.",
    "Trains rural teachers and distributes learning materials in Bié province."),
  ngo("Right To Play Chad", "Chad", "central-africa", "teacher-student-support-impact",
    "Uses play-based learning to improve education outcomes in fragile settings.",
    "Trains teacher-coaches and equips schools with play-based learning kits."),
  ngo("Caritas Centrafrique", "Central African Republic", "central-africa", "education-infrastructure-impact",
    "Rebuilds education infrastructure damaged by conflict in CAR.",
    "Rehabilitates schools and supports back-to-school campaigns in Bangui and prefectures."),
];

// ═══════════════════════════════════════════════════════════════════
// SOUTHERN AFRICA — curated public-record NGOs (manual review required)
// ═══════════════════════════════════════════════════════════════════
const SOUTHERN_AFRICA: NGONominee[] = [
  ngo("Equal Education", "South Africa", "southern-africa", "education-infrastructure-impact",
    "Movement of learners, parents, and teachers advocating for quality public education.",
    "Campaigns and litigates for school infrastructure norms and standards in South Africa."),
  ngo("Read Educational Trust", "South Africa", "southern-africa", "teacher-student-support-impact",
    "South Africa's largest literacy NGO improving reading, writing and learning outcomes.",
    "Trains teachers and donates libraries to under-resourced schools nationwide."),
  ngo("CAMFED Zimbabwe", "Zimbabwe", "southern-africa", "youth-girls-empowerment-impact",
    "Supports marginalised girls through secondary school and economic empowerment.",
    "Provides bursaries, mentoring, and post-school transition support."),
  ngo("Sentebale Lesotho", "Lesotho", "southern-africa", "youth-girls-empowerment-impact",
    "Supports children and young people affected by HIV in Lesotho and Botswana.",
    "Operates the Mamohato Children's Centre and youth leadership academies."),
  ngo("Forum for African Women Educationalists Malawi", "Malawi", "southern-africa", "youth-girls-empowerment-impact",
    "Advances girls' education through bursaries, mentoring, and policy advocacy.",
    "Supports thousands of Malawian girls through secondary and tertiary education."),
  ngo("Help Lesotho", "Lesotho", "southern-africa", "teacher-student-support-impact",
    "Builds resilience and leadership in vulnerable Basotho youth and grandmothers.",
    "Runs leadership academies and donates learning materials to rural schools."),
];

export const NGO_NOMINEES: NGONominee[] = [
  ...WEST_AFRICA,
  ...EAST_AFRICA,
  ...NORTH_AFRICA,
  ...CENTRAL_AFRICA,
  ...SOUTHERN_AFRICA,
];

// ═══════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════
export function getNGOsByRegion(region: NGORegion): NGONominee[] {
  return NGO_NOMINEES.filter((n) => n.region === region);
}

export function getNGOsBySubcategory(
  region: NGORegion | "all",
  sub: NGOSubcategory | "all",
): NGONominee[] {
  return NGO_NOMINEES.filter(
    (n) => (region === "all" || n.region === region) && (sub === "all" || n.subcategory === sub),
  );
}

export function getNGOBySlug(slug: string): NGONominee | undefined {
  return NGO_NOMINEES.find((n) => n.slug === slug);
}

export function getNGORegionMeta(slug: NGORegion) {
  return NGO_REGIONS.find((r) => r.slug === slug)!;
}

export function getNGOSubcategoryMeta(slug: NGOSubcategory) {
  return NGO_SUBCATEGORIES.find((s) => s.slug === slug)!;
}

export function getNGOStats() {
  const byRegion = Object.fromEntries(
    NGO_REGIONS.map((r) => [r.slug, getNGOsByRegion(r.slug).length]),
  ) as Record<NGORegion, number>;
  const bySubcategory = Object.fromEntries(
    NGO_SUBCATEGORIES.map((s) => [s.slug, NGO_NOMINEES.filter((n) => n.subcategory === s.slug).length]),
  ) as Record<NGOSubcategory, number>;
  return {
    total: NGO_NOMINEES.length,
    verified: NGO_NOMINEES.filter((n) => n.verificationStatus === "verified").length,
    curated: NGO_NOMINEES.filter((n) => n.verificationStatus === "curated").length,
    requiresManualReview: NGO_NOMINEES.filter((n) => n.requiresManualReview).length,
    byRegion,
    bySubcategory,
  };
}
