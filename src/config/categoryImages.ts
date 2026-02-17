// Category Images Configuration
// Maps category slugs to their representative images

import csrAfricaImg from "@/assets/categories/csr-africa.jpg";
import csrNigeriaImg from "@/assets/categories/csr-nigeria.jpg";
import edutechImg from "@/assets/categories/edutech.jpg";
import mediaNigeriaImg from "@/assets/categories/media-nigeria.jpg";
import ngoNigeriaImg from "@/assets/categories/ngo-nigeria.jpg";
import ngoAfricaImg from "@/assets/categories/ngo-africa.jpg";
import stemImg from "@/assets/categories/stem.jpg";
import creativeArtsImg from "@/assets/categories/creative-arts.jpg";
import educationStateImg from "@/assets/categories/education-state.jpg";
import libraryImg from "@/assets/categories/library.jpg";
import researchImg from "@/assets/categories/research.jpg";
import christianEducationImg from "@/assets/categories/christian-education.jpg";
import islamicEducationImg from "@/assets/categories/islamic-education.jpg";
import politicalLeadersImg from "@/assets/categories/political-leaders.jpg";
import internationalImg from "@/assets/categories/international.jpg";
import diasporaImg from "@/assets/categories/diaspora.jpg";
import iconAwardImg from "@/assets/categories/icon-award.jpg";

// Gold Special Recognition nominee images
import sportsNomineeImg from "@/assets/nominees/sports-nominee-1.jpg";
import musicNomineeImg from "@/assets/nominees/music-nominee-1.jpg";
import socialNomineeImg from "@/assets/nominees/social-nominee-1.jpg";

export const CATEGORY_IMAGES: Record<string, string> = {
  // Category 1 - Best CSR in Education (Africa Regional)
  "best-csr-education-africa": csrAfricaImg,
  
  // Category 2 - Best CSR in Education (Nigeria)
  "best-csr-education-nigeria": csrNigeriaImg,
  
  // Category 3 - Best EduTech Organisation (Africa Regional)
  "best-edutech-organisation-africa": edutechImg,
  
  // Category 4 - Best Media Organisation in Educational Advocacy (Nigeria)
  "best-media-educational-advocacy-nigeria": mediaNigeriaImg,
  
  // Category 5 - Best NGO Contribution to Education (Nigeria)
  "best-ngo-education-nigeria": ngoNigeriaImg,
  
  // Category 6 - Best NGO Contribution to Education for All (Africa Regional)
  "best-ngo-education-africa": ngoAfricaImg,
  
  // Category 7 - Best STEM Education Programme (Africa Regional)
  "best-stem-education-africa": stemImg,
  
  // Category 8 - Creative Arts Industry Contribution to Education (Nigeria)
  "creative-arts-education-nigeria": creativeArtsImg,
  
  // Category 9 - Best Education-Friendly State (Nigeria)
  "best-education-friendly-state-nigeria": educationStateImg,
  
  // Category 10 - Best Library in Nigerian Tertiary Institutions
  "best-library-tertiary-nigeria": libraryImg,
  
  // Category 11 - Best Research & Development Contribution to Education (Nigeria)
  "best-research-development-nigeria": researchImg,
  
  // Category 12 - Christian Education Impact (Africa Regional)
  "christian-education-impact-africa": christianEducationImg,
  
  // Category 13 - Islamic Education Impact (Africa Regional)
  "islamic-education-impact-africa": islamicEducationImg,
  
  // Category 14 - Political Leaders' Educational Support (Nigeria)
  "political-leaders-education-nigeria": politicalLeadersImg,
  
  // Category 15 - International & Bilateral Contributors to Education
  "international-bilateral-education": internationalImg,
  
  // Category 16 - Diaspora Association Educational Impact
  "diaspora-education-impact": diasporaImg,
  
  // Category 17 - Africa Education Icon Award (2005–2025)
  "africa-education-icon-award": iconAwardImg,

  // Gold Special Recognition — 2025 Edition
  "africa-sports-education-impact": sportsNomineeImg,
  "africa-music-education-impact": musicNomineeImg,
  "africa-social-media-education-impact": socialNomineeImg,
};

// Get category image by slug with fallback
export function getCategoryImage(slug: string): string | null {
  return CATEGORY_IMAGES[slug] || null;
}
