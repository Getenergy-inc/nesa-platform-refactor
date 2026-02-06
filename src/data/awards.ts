/**
 * Awards & Recognition Data
 * All awards, recognitions, and accolades related to Education For All initiatives
 */

export interface Award {
  title: string;
  organization: string;
  year: number;
  description: string;
  location?: string;
  sourceUrl: string;
}

export const awards: Award[] = [
  {
    title: "UNESCO International Literacy Prize Recognition",
    organization: "UNESCO",
    year: 2024,
    description: "UNESCO's International Literacy Prizes recognize outstanding and innovative literacy programmes worldwide, promoting literate environments across Africa.",
    location: "Paris, France",
    sourceUrl: "https://www.unesco.org/en/prizes/literacy/laureates",
  },
  {
    title: "UNESCO Prize for Girls' and Women's Education",
    organization: "UNESCO",
    year: 2024,
    description: "Awarded to transformative education projects in Uganda and Zambia advancing girls' and women's access to quality education.",
    location: "Africa",
    sourceUrl: "https://www.unesco.org/en/articles/unesco-awards-2024-prize-girls-and-womens-education-transformative-projects-uganda-and-zambia",
  },
  {
    title: "AU Continental Teacher Prize",
    organization: "African Union",
    year: 2025,
    description: "The African Union celebrates World Teachers' Day with Continental Teachers' Awards recognizing Africa's best educators advancing Agenda 2063.",
    location: "Addis Ababa, Ethiopia",
    sourceUrl: "https://au.int/en/pressreleases/20251005/au-celebrates-world-teachers-day-2025-continental-teachers-awards",
  },
  {
    title: "Innovating Education in Africa (IEA) Top 10",
    organization: "African Union",
    year: 2025,
    description: "African Union announces Top 10 Innovators for the Innovating Education in Africa program, recognizing breakthrough solutions in educational technology.",
    location: "Africa",
    sourceUrl: "https://au.int/en/pressreleases/20250923/au-announces-top-10-innovators-innovating-education-africa-iea-2025",
  },
  {
    title: "Global Partnership for Education Annual Recognition",
    organization: "Global Partnership for Education",
    year: 2024,
    description: "GPE's commitment to ensuring quality education for every child, supporting partner countries through economic shocks, climate change, and conflict.",
    location: "Global",
    sourceUrl: "https://www.globalpartnership.org/content/annual-report-2024",
  },
  {
    title: "WikiChallenge African Schools Award",
    organization: "Wiki in Africa / Fondation Orange",
    year: 2024,
    description: "Open Pedagogy award for WikiChallenge Ecoles d'Afrique, a writing competition enhancing digital literacy for pupils aged 8-13 across French-speaking African countries.",
    location: "South Africa",
    sourceUrl: "https://awards.oeglobal.org/awards/2024/open-pedagogy/wikichallenge-ecoles-dafrique-wikichallenge-african-schools/",
  },
  {
    title: "Education Africa Global Awards",
    organization: "Education Africa",
    year: 2024,
    description: "Legacy project honoring lifetime achievements in African education, continuing the tradition started in 2006 with HSBC Bank USA.",
    location: "New York, USA",
    sourceUrl: "https://educationafrica.org/legacy-project/education-africa-global-awards/",
  },
  {
    title: "UNESCO ICT in Education Prize",
    organization: "UNESCO",
    year: 2024,
    description: "Recognizing innovative use of information and communication technologies to expand educational access and quality across developing nations.",
    location: "Paris, France",
    sourceUrl: "https://www.unesco.org/en/prizes/ict-education",
  },
];
