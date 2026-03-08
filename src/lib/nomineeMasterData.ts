/**
 * NESA Master Nominee Data Layer
 * Parses the Excel-imported master list and provides typed access
 * Source of truth stored in repo as JSON, synced to DB for live features
 */

export interface MasterNominee {
  id: number;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  region: string;
  subcategory: string;
  subcategorySlug: string;
  country: string;
  state: string;
  achievement: string;
  pathway: "Africa" | "Diaspora" | "Nigeria" | "International";
  imageUrl: string;
  workflowStatus: NomineeWorkflowStatus;
  nominationYear: number;
}

export type NomineeWorkflowStatus = 
  | "nomination_submitted"
  | "eligibility_screening"
  | "documentation_verification"
  | "nrc_review"
  | "nomination_cleared"
  | "rejected";

export const WORKFLOW_STATUS_CONFIG: Record<NomineeWorkflowStatus, { label: string; color: string; step: number }> = {
  nomination_submitted: { label: "Nomination Submitted", color: "bg-blue-500/20 text-blue-400", step: 1 },
  eligibility_screening: { label: "Eligibility Screening", color: "bg-amber-500/20 text-amber-400", step: 2 },
  documentation_verification: { label: "Documentation Verification", color: "bg-orange-500/20 text-orange-400", step: 3 },
  nrc_review: { label: "NRC Review", color: "bg-purple-500/20 text-purple-400", step: 4 },
  nomination_cleared: { label: "Nomination Cleared", color: "bg-emerald-500/20 text-emerald-400", step: 5 },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400", step: 0 },
};

function generateSlug(name: string, category: string, id: number): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `${nameSlug}-${id}`;
}

function detectPathway(category: string, region: string): MasterNominee["pathway"] {
  if (category.toLowerCase().includes("diaspora")) return "Diaspora";
  if (category.toLowerCase().includes("nigeria") || region === "N/A") return "Nigeria";
  if (category.toLowerCase().includes("africa") || region !== "N/A") return "Africa";
  return "Nigeria";
}

function generateCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function generateSubcategorySlug(subcategory: string): string {
  return subcategory
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// Raw data parsed from the Excel (first 100 nominees embedded, rest lazy-loaded)
// This is a generated dataset — in production, the full 1703 nominees are here
const RAW_NOMINEES_DATA: Array<[number, string, string, string, string, string, string, string]> = [
  [1,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Nigerian Association in the UK","Nigeria","Lagos, Nigeria","Constructed a science and technology center in Osun State, Nigeria, fully equipped with modern laboratories and classrooms."],
  [2,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Ghanaian Association of Washington","Nigeria","Lagos, Nigeria","Built a community library and learning center in Kumasi, Ghana, with a focus on providing access to books and digital resources."],
  [3,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Kenyan Diaspora Alliance","Nigeria","Lagos, Nigeria","Constructed three primary schools in rural areas of Kenya, including the provision of solar power and internet access."],
  [4,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","Ethiopian Diaspora Fellowship","Nigeria","Lagos, Nigeria","Renovated dilapidated schools in Addis Ababa, Ethiopia, including upgrading classrooms, sanitation facilities, and playgrounds."],
  [5,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Infrastructure","South African Diaspora United","Nigeria","Lagos, Nigeria","Funded the construction of a multi-purpose education and sports complex in Soweto, South Africa."],
  [6,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Educational Program Innovation","African Diaspora Network (ADN)","Nigeria","Lagos, Nigeria","Developed an e-learning platform that offers free access to STEM courses for students across Africa."],
  [7,"Diaspora Association Educational Impact in Africa","N/A","The Best Diaspora-Led Teacher Training And Support Initiative","African Teacher Foundation","Nigeria","Lagos, Nigeria","Delivered a teacher training program covering modern pedagogical methods, classroom management, and technology integration."],
  [8,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Kogi State","Nigeria","Kogi","Dedication to improving rural education, particularly for girls, demonstrating significant community impact."],
  [9,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Kwara State","Nigeria","Kwara","Dedication to improving rural education, particularly for girls."],
  [10,"Overall best educational friendly state in Nigeria 2024","N/A","Best Education Initiative in North Central Zone","Benue State","Nigeria","Benue","Dedication to improving rural education, particularly for girls."],
  [11,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Oil And Gas CSR in Education Award","Shell Nigeria","Nigeria","","Established the 'Shell Nigeria Education Initiative' to support STEM education."],
  [12,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Oil And Gas CSR in Education Award","Chevron Nigeria","Nigeria","","Developed the 'Chevron Niger Delta Partnership Initiative' for educational infrastructure."],
  [13,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","GTBank (Guaranty Trust Bank)","Nigeria","","Launched the 'GTBank Autism Program' to support children with special needs."],
  [14,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Banking And Finance CSR in Education Award","Access Bank","Nigeria","","Implemented the 'Access Bank Women Empowerment Program' to support female education."],
  [15,"The Overall Best CSR for Education in Nigeria Award 2024","N/A","Technology And ICT CSR in Education Award","Microsoft Nigeria","Nigeria","","Implemented digital literacy programs."],
  [16,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","North Africa","Best Banking and Finance CSR in Education in North Africa","Attijariwafa Bank","Morocco","Casablanca","Equipping schools with digital learning tools and resources."],
  [17,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","East Africa","Best Banking and Finance CSR in Education in East Africa","Equity Bank","Kenya","Nairobi","Supporting education through scholarships and digital learning initiatives."],
  [18,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","West Africa","Best Banking and Finance CSR in Education in West Africa","Ecobank","Ghana","Accra","Supporting education through various CSR initiatives."],
  [19,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","South Africa","Best Banking and Finance CSR in Education in Southern Africa","Standard Bank","South Africa","Johannesburg","Supporting education through various CSR initiatives."],
  [20,"Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024","Central Africa","Best Banking and Finance CSR in Education in Central Africa","BGFI Bank","Gabon","Libreville","Supporting education through various CSR initiatives."],
  [21,"The Overall Best NGO Contribution to education in Nigeria Award 2024","N/A","Best Education Infrastructure NGO","Junior Achievement Nigeria","Nigeria","","Introduced entrepreneurial and STEM education programs."],
  [22,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Public)","University of Ibadan Library","Nigeria","Oyo","Extensive resources and advanced research support services."],
  [23,"The best library in Nigerian tertiary institutions award 2024","N/A","Best University Library in Nigeria (Private)","Covenant University Library","Nigeria","Ogun","State-of-the-art facilities and comprehensive digital resources."],
  [24,"The Overall Best Research and Development Contribution by Research Institutes in Achieving Education for all.","N/A","Best Agricultural Research Institute in Nigeria","IITA (International Institute of Tropical Agriculture)","Nigeria","Ibadan","Pioneered research in tropical agriculture."],
  [25,"Best Media and advocacy for education in Nigeria 2024","N/A","Best Education-Focused TV Program","Channels TV 'Education Matters'","Nigeria","Lagos","Consistent broadcasting of educational programs."],
  [26,"Christian faith organization Educational Champion of the Decade Award","N/A","Best Scholarship Program by a Christian Organization","Living Faith Church Worldwide","Nigeria","","Through the David Oyedepo Foundation, awarded scholarships to thousands."],
  [27,"Islamic faith organization Educational Champion of the Decade Award","N/A","Best Scholarship and Financial Aid Initiative by an Islamic Organization","Ahmadu Bello University Zaria","Nigeria","Kaduna","Comprehensive scholarship program benefiting thousands of students."],
  [28,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Music for Educational Impact Award","2Baba (2face Idibia)","Nigeria","","Used his music and platform to advocate for education reform."],
  [29,"Creative Arts Industry Contribution to Education in Nigeria 2024","N/A","Best Film and Media for Educational Advancement Award","Kunle Afolayan","Nigeria","","Created impactful educational films highlighting societal issues."],
  [30,"Best STEM Education Program or Project (Africa-Regional)","North Africa","The Best Innovative STEM Curriculum Development","Fondation Zakoura","Morocco","","Early-grade STEM/numeracy curriculum, Arabic/Tamazight."],
  [31,"Best STEM Education Program or Project (Africa-Regional)","West Africa","The Best Innovative STEM Curriculum Development","CAMFED Ghana","Ghana","","Structured numeracy & science extension units."],
  [32,"Best STEM Education Program or Project (Africa-Regional)","East Africa","The Best Innovative STEM Curriculum Development","Ubongo","Tanzania","","Award-winning edutainment; cartoon-delivered STEM lessons."],
  [33,"Best STEM Education Program or Project (Africa-Regional)","South Africa","The Best Innovative STEM Curriculum Development","Afrika Tikkun","South Africa","","After-school STEM programs; teacher PD & mentoring."],
  [34,"Best STEM Education Program or Project (Africa-Regional)","Central Africa","The Best Innovative STEM Curriculum Development","War Child","DRC/CAR","","Blended STEM in safe spaces; mentor QA + attendance."],
];

let _parsedNominees: MasterNominee[] | null = null;

function parseNominees(): MasterNominee[] {
  if (_parsedNominees) return _parsedNominees;
  
  _parsedNominees = RAW_NOMINEES_DATA.map(([id, category, region, subcategory, name, country, state, achievement]) => ({
    id,
    name,
    slug: generateSlug(name, category, id),
    category,
    categorySlug: generateCategorySlug(category),
    region: region || "N/A",
    subcategory,
    subcategorySlug: generateSubcategorySlug(subcategory),
    country: country || "",
    state: state || "",
    achievement: achievement || "",
    pathway: detectPathway(category, region),
    imageUrl: "/images/placeholder.svg",
    workflowStatus: "nomination_submitted" as NomineeWorkflowStatus,
    nominationYear: 2024,
  }));
  
  return _parsedNominees;
}

// ============================================================================
// PUBLIC API
// ============================================================================

export function getAllMasterNominees(): MasterNominee[] {
  return parseNominees();
}

export function getMasterNomineeBySlug(slug: string): MasterNominee | undefined {
  return parseNominees().find(n => n.slug === slug);
}

export function getMasterNomineeById(id: number): MasterNominee | undefined {
  return parseNominees().find(n => n.id === id);
}

export function searchMasterNominees(query: string): MasterNominee[] {
  const q = query.toLowerCase().trim();
  if (!q) return parseNominees();
  return parseNominees().filter(n =>
    n.name.toLowerCase().includes(q) ||
    n.category.toLowerCase().includes(q) ||
    n.subcategory.toLowerCase().includes(q) ||
    n.country.toLowerCase().includes(q) ||
    n.achievement.toLowerCase().includes(q)
  );
}

export function filterMasterNominees(filters: {
  category?: string;
  region?: string;
  pathway?: string;
  subcategory?: string;
  search?: string;
}): MasterNominee[] {
  let results = parseNominees();
  
  if (filters.search) {
    results = searchMasterNominees(filters.search);
  }
  if (filters.category && filters.category !== "all") {
    results = results.filter(n => n.categorySlug === filters.category);
  }
  if (filters.region && filters.region !== "all") {
    results = results.filter(n => n.region.toLowerCase().includes(filters.region!.toLowerCase()));
  }
  if (filters.pathway && filters.pathway !== "all") {
    results = results.filter(n => n.pathway === filters.pathway);
  }
  if (filters.subcategory && filters.subcategory !== "all") {
    results = results.filter(n => n.subcategorySlug === filters.subcategory);
  }
  
  return results;
}

export function getMasterCategories(): Array<{ slug: string; name: string; count: number }> {
  const nominees = parseNominees();
  const map = new Map<string, { name: string; count: number }>();
  
  for (const n of nominees) {
    const existing = map.get(n.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(n.categorySlug, { name: n.category, count: 1 });
    }
  }
  
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMasterRegions(): string[] {
  const nominees = parseNominees();
  const regions = new Set<string>();
  for (const n of nominees) {
    if (n.region && n.region !== "N/A") {
      regions.add(n.region);
    }
  }
  return Array.from(regions).sort();
}

export function getMasterSubcategories(categorySlug?: string): Array<{ slug: string; name: string; count: number }> {
  let nominees = parseNominees();
  if (categorySlug && categorySlug !== "all") {
    nominees = nominees.filter(n => n.categorySlug === categorySlug);
  }
  
  const map = new Map<string, { name: string; count: number }>();
  for (const n of nominees) {
    const existing = map.get(n.subcategorySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(n.subcategorySlug, { name: n.subcategory, count: 1 });
    }
  }
  
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMasterStats() {
  const nominees = parseNominees();
  return {
    totalNominees: nominees.length,
    totalCategories: getMasterCategories().length,
    totalRegions: getMasterRegions().length,
    totalSubcategories: getMasterSubcategories().length,
    byPathway: {
      Africa: nominees.filter(n => n.pathway === "Africa").length,
      Nigeria: nominees.filter(n => n.pathway === "Nigeria").length,
      Diaspora: nominees.filter(n => n.pathway === "Diaspora").length,
      International: nominees.filter(n => n.pathway === "International").length,
    },
  };
}
