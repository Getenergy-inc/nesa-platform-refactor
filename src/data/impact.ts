/**
 * Social Impact Data
 * Impact activities, programs, and milestones for Education For All
 */

export interface ImpactItem {
  title: string;
  date: string;
  description: string;
  location?: string;
  sourceUrl: string;
}

export const impactItems: ImpactItem[] = [
  {
    title: "SCEF Membership & Advocacy Program",
    date: "2024",
    description: "Transformative membership-based NGO advancing education as an essential right for everyone across Nigeria and Africa, transcending barriers of privilege.",
    location: "Lagos, Nigeria",
    sourceUrl: "https://www.santoscreations.org/",
  },
  {
    title: "African Union Year of Education 2024",
    date: "2024-01-01",
    description: "Historic continental initiative putting education at the forefront of policy agenda, transforming African education systems to equip generations with 21st century skills.",
    location: "Africa-wide",
    sourceUrl: "https://www.globalpartnership.org/blog/making-education-africa-fit-21st-century",
  },
  {
    title: "GPE Results & Impact 2024",
    date: "2024-12-01",
    description: "Comprehensive partnership support to build resilient education systems, addressing learning poverty affecting over 80% of children in West and Central Africa.",
    location: "Global",
    sourceUrl: "https://www.globalpartnership.org/content/results-report-2024",
  },
  {
    title: "NESA Nominee Research Corps (NRC)",
    date: "2025-01-01",
    description: "Volunteer corps of 30 researchers dedicated to verifying and documenting education excellence across Africa through the Hybrid NRC model.",
    location: "Nigeria & Africa",
    sourceUrl: "https://nesa.africa/",
  },
  {
    title: "Rebuild My School Africa Initiative",
    date: "2024-2025",
    description: "Infrastructure improvement campaign focusing on school rebuilding and educational facility development across 5 underserved African regions.",
    location: "Africa",
    sourceUrl: "https://nesa.africa/",
  },
  {
    title: "Africa Higher Education Centres of Excellence",
    date: "2024",
    description: "Transforming pedagogy at 50+ universities to enhance employability of graduates and harness the potential of research and innovation.",
    location: "Africa",
    sourceUrl: "https://ace.aau.org/",
  },
  {
    title: "Quality Basic Education Project - Rwanda",
    date: "2024-06-15",
    description: "Significant implementation progress with 13 model schools, 11,000 classrooms, and 621 resilience upgrades under the Quality Basic Education for Human Capital Development Project.",
    location: "Rwanda",
    sourceUrl: "https://www.mineduc.gov.rw/news-detail/mineduc-world-bank-report-13-model-schools-11000-classrooms-and-621-resilience-upgrades-under-quality-basic-education-project",
  },
  {
    title: "PACTED 2025 - Pan-African Conference on Teacher Education",
    date: "2025-10-06",
    description: "Launch of multilingual platform in 6 languages and recognition of Africa's top 10 teachers, advancing teacher development as the first strategic objective of CESA 16-25.",
    location: "Addis Ababa, Ethiopia",
    sourceUrl: "https://au.int/en/pressreleases/20251006/au-concludes-pacted-2025-launch-multilingual-platform-and-recognition",
  },
];
