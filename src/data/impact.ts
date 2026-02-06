/**
 * Social Impact Data
 * Impact activities, programs, milestones, and partnerships for Education For All
 */

export interface ImpactItem {
  id: string;
  title: string;
  organization: string;
  type: 'program' | 'milestone' | 'partnership' | 'initiative' | 'campaign';
  year: number;
  date?: string;
  description: string;
  location?: string;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  sourceUrl: string;
  imageUrl?: string;
}

export const impactItems: ImpactItem[] = [
  {
    id: "scef-membership-program",
    title: "SCEF Membership & Advocacy Program",
    organization: "Santos Creations Educational Foundation",
    type: "program",
    year: 2024,
    date: "Ongoing",
    description: "Transformative membership-based NGO advancing education as an essential right for everyone across Nigeria and Africa, transcending barriers of privilege.",
    location: "Lagos, Nigeria",
    metrics: [
      { label: "Years Active", value: "17+" },
      { label: "Focus Areas", value: "Education Advocacy" },
    ],
    sourceUrl: "https://www.santoscreations.org/",
  },
  {
    id: "au-year-of-education-2024",
    title: "African Union Year of Education 2024",
    organization: "African Union",
    type: "initiative",
    year: 2024,
    date: "2024",
    description: "Historic continental initiative putting education at the forefront of policy agenda, transforming African education systems to equip generations with 21st century skills.",
    location: "Africa-wide",
    metrics: [
      { label: "Countries", value: 55 },
      { label: "Theme", value: "21st Century Skills" },
    ],
    sourceUrl: "https://www.globalpartnership.org/blog/making-education-africa-fit-21st-century",
  },
  {
    id: "gpe-results-2024",
    title: "GPE Results & Impact 2024",
    organization: "Global Partnership for Education",
    type: "partnership",
    year: 2024,
    date: "December 2024",
    description: "Comprehensive partnership support to build resilient education systems, addressing learning poverty affecting over 80% of children in West and Central Africa.",
    location: "Global",
    metrics: [
      { label: "Partner Countries", value: "76+" },
      { label: "Focus", value: "Learning Outcomes" },
    ],
    sourceUrl: "https://www.globalpartnership.org/content/results-report-2024",
  },
  {
    id: "nesa-nrc-volunteer-corps",
    title: "NESA Nominee Research Corps (NRC)",
    organization: "NESA Africa / SCEF",
    type: "initiative",
    year: 2025,
    date: "2025",
    description: "Volunteer corps of researchers dedicated to verifying and documenting education excellence across Africa through the Hybrid NRC model.",
    location: "Nigeria & Africa",
    metrics: [
      { label: "Volunteers", value: 30 },
      { label: "Model", value: "Hybrid NRC" },
    ],
    sourceUrl: "https://nesa.africa/",
  },
  {
    id: "rebuild-my-school-africa",
    title: "Rebuild My School Africa Initiative",
    organization: "NESA Africa",
    type: "campaign",
    year: 2025,
    date: "2024-2025",
    description: "Infrastructure improvement campaign focusing on school rebuilding and educational facility development across underserved African communities.",
    location: "Africa",
    metrics: [
      { label: "Focus", value: "Infrastructure" },
      { label: "Regions", value: 5 },
    ],
    sourceUrl: "https://nesa.africa/",
  },
  {
    id: "ace-centres-excellence",
    title: "Africa Higher Education Centres of Excellence",
    organization: "African Union / World Bank / AAU",
    type: "program",
    year: 2024,
    date: "Ongoing",
    description: "Transforming pedagogy to enhance employability of graduates and harness the potential of research and innovation across African universities.",
    location: "Africa",
    metrics: [
      { label: "Universities", value: "50+" },
      { label: "Focus", value: "Research & Innovation" },
    ],
    sourceUrl: "https://ace.aau.org/",
  },
  {
    id: "world-bank-qbe-rwanda",
    title: "Quality Basic Education Project - Rwanda",
    organization: "MINEDUC / World Bank",
    type: "milestone",
    year: 2024,
    date: "2024",
    description: "Significant implementation progress with 13 model schools, 11,000 classrooms, and 621 resilience upgrades under the Quality Basic Education for Human Capital Development Project.",
    location: "Rwanda",
    metrics: [
      { label: "Model Schools", value: 13 },
      { label: "Classrooms Built", value: "11,000" },
      { label: "Resilience Upgrades", value: 621 },
    ],
    sourceUrl: "https://www.mineduc.gov.rw/news-detail/mineduc-world-bank-report-13-model-schools-11000-classrooms-and-621-resilience-upgrades-under-quality-basic-education-project",
  },
  {
    id: "pacted-2025",
    title: "PACTED 2025 - Pan-African Conference on Teacher Education",
    organization: "African Union",
    type: "initiative",
    year: 2025,
    date: "October 2025",
    description: "Launch of multilingual platform and recognition of Africa's best teachers, advancing teacher development as the first strategic objective of CESA 16-25.",
    location: "Addis Ababa, Ethiopia",
    metrics: [
      { label: "Languages", value: "6" },
      { label: "Teachers Recognized", value: "Top 10" },
    ],
    sourceUrl: "https://au.int/en/pressreleases/20251006/au-concludes-pacted-2025-launch-multilingual-platform-and-recognition",
  },
];

/**
 * Validate impact data at runtime
 */
export function validateImpactItems(): boolean {
  return impactItems.every(item => 
    item.id && 
    item.title && 
    item.organization && 
    item.type && 
    item.year && 
    item.description && 
    item.sourceUrl &&
    item.sourceUrl.startsWith('http')
  );
}

/**
 * Get impact items by type
 */
export function getImpactByType(type: ImpactItem['type']): ImpactItem[] {
  return impactItems.filter(item => item.type === type);
}

/**
 * Get impact items by year
 */
export function getImpactByYear(year: number): ImpactItem[] {
  return impactItems.filter(item => item.year === year);
}
