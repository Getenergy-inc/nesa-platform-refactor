// NESA Africa Season Configuration
// Centralized configuration for phases, dates, categories, and stage management

export type NESAPhase = 
  | "pre-launch"
  | "nominations"
  | "nrc-review"
  | "public-voting"
  | "jury-scoring"
  | "results"
  | "ceremony"
  | "post-ceremony";

export type AwardTier = "platinum" | "gold" | "blue-garnet" | "icon";

export interface PhaseConfig {
  id: NESAPhase;
  name: string;
  shortName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface AwardCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  tier: AwardTier;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  regionMultiplied: boolean;
}

export interface SeasonEdition {
  year: number;
  name: string;
  theme: string;
  tagline: string;
  ceremonyDate: Date;
  ceremonyLocation: string;
  ceremonyVenue: string;
}

// Current Season Configuration
export const CURRENT_SEASON: SeasonEdition = {
  year: 2025,
  name: "NESA-Africa 2025",
  theme: "Building the Future of Education",
  tagline: "Honoring Africa's Changemakers",
  ceremonyDate: new Date("2026-06-15T18:00:00"),
  ceremonyLocation: "Lagos, Nigeria",
  ceremonyVenue: "Eko Convention Centre",
};

// Phase Configuration
export const PHASES: PhaseConfig[] = [
  {
    id: "pre-launch",
    name: "Pre-Launch",
    shortName: "Coming Soon",
    description: "Season announcement and preparation",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-14"),
    isActive: false,
    ctaText: "Get Notified",
    ctaLink: "/subscribe",
  },
  {
    id: "nominations",
    name: "Nominations Open",
    shortName: "Nominate",
    description: "Submit nominations for outstanding individuals and organizations",
    startDate: new Date("2025-01-15"),
    endDate: new Date("2025-06-30"),
    isActive: true,
    ctaText: "Nominate Now",
    ctaLink: "/nominate",
  },
  {
    id: "nrc-review",
    name: "NRC Review",
    shortName: "Review",
    description: "National Review Committee evaluates nominations",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-31"),
    isActive: false,
    ctaText: "View Progress",
    ctaLink: "/nominees",
  },
  {
    id: "public-voting",
    name: "Public Voting",
    shortName: "Vote",
    description: "Cast your vote for your favorite Gold tier nominees",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-10-31"),
    isActive: false,
    ctaText: "Vote Now",
    ctaLink: "/vote",
  },
  {
    id: "jury-scoring",
    name: "Jury Scoring",
    shortName: "Jury",
    description: "Expert jury evaluates Blue Garnet nominees",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-11-30"),
    isActive: false,
    ctaText: "Meet the Jury",
    ctaLink: "/jury",
  },
  {
    id: "results",
    name: "Results Announcement",
    shortName: "Results",
    description: "Winners announced across all categories",
    startDate: new Date("2025-12-01"),
    endDate: new Date("2026-01-31"),
    isActive: false,
    ctaText: "View Winners",
    ctaLink: "/winners",
  },
  {
    id: "ceremony",
    name: "Award Ceremony",
    shortName: "Ceremony",
    description: "Grand ceremony celebrating African excellence",
    startDate: new Date("2026-06-15"),
    endDate: new Date("2026-06-15"),
    isActive: false,
    ctaText: "Get Tickets",
    ctaLink: "/tickets",
  },
  {
    id: "post-ceremony",
    name: "Post Ceremony",
    shortName: "Archive",
    description: "Relive the moments and access certificates",
    startDate: new Date("2026-06-16"),
    endDate: new Date("2026-12-31"),
    isActive: false,
    ctaText: "View Archive",
    ctaLink: "/archive",
  },
];

// Award Categories
export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    id: "education-leadership",
    name: "Education Leadership",
    slug: "education-leadership",
    description: "Recognizing transformative leaders in education",
    icon: "GraduationCap",
    tier: "platinum",
    subcategories: [
      {
        id: "edu-policy",
        name: "Education Policy Innovation",
        slug: "education-policy",
        description: "Leaders driving policy change",
        regionMultiplied: true,
      },
      {
        id: "edu-admin",
        name: "Educational Administration",
        slug: "education-admin",
        description: "Excellence in school/institution management",
        regionMultiplied: true,
      },
    ],
  },
  {
    id: "teaching-excellence",
    name: "Teaching Excellence",
    slug: "teaching-excellence",
    description: "Outstanding educators making a difference",
    icon: "BookOpen",
    tier: "gold",
    subcategories: [
      {
        id: "primary-teacher",
        name: "Primary Education Teacher",
        slug: "primary-teacher",
        description: "Excellence in primary education",
        regionMultiplied: true,
      },
      {
        id: "secondary-teacher",
        name: "Secondary Education Teacher",
        slug: "secondary-teacher",
        description: "Excellence in secondary education",
        regionMultiplied: true,
      },
      {
        id: "tertiary-educator",
        name: "Tertiary Educator",
        slug: "tertiary-educator",
        description: "Excellence in higher education",
        regionMultiplied: true,
      },
    ],
  },
  {
    id: "edtech-innovation",
    name: "EdTech Innovation",
    slug: "edtech-innovation",
    description: "Technology-driven educational solutions",
    icon: "Cpu",
    tier: "blue-garnet",
    subcategories: [
      {
        id: "edtech-startup",
        name: "EdTech Startup of the Year",
        slug: "edtech-startup",
        description: "Innovative education technology companies",
        regionMultiplied: false,
      },
      {
        id: "digital-learning",
        name: "Digital Learning Platform",
        slug: "digital-learning",
        description: "Best online learning solutions",
        regionMultiplied: false,
      },
    ],
  },
  {
    id: "social-impact",
    name: "Social Impact in Education",
    slug: "social-impact",
    description: "Education initiatives creating lasting change",
    icon: "Heart",
    tier: "gold",
    subcategories: [
      {
        id: "ngo-education",
        name: "NGO in Education",
        slug: "ngo-education",
        description: "Non-profits advancing education",
        regionMultiplied: true,
      },
      {
        id: "community-education",
        name: "Community Education Initiative",
        slug: "community-education",
        description: "Grassroots education programs",
        regionMultiplied: true,
      },
    ],
  },
  {
    id: "institution-excellence",
    name: "Institution Excellence",
    slug: "institution-excellence",
    description: "Schools and institutions setting the standard",
    icon: "Building",
    tier: "platinum",
    subcategories: [
      {
        id: "primary-school",
        name: "Primary School of Excellence",
        slug: "primary-school",
        description: "Outstanding primary institutions",
        regionMultiplied: true,
      },
      {
        id: "secondary-school",
        name: "Secondary School of Excellence",
        slug: "secondary-school",
        description: "Outstanding secondary institutions",
        regionMultiplied: true,
      },
      {
        id: "university",
        name: "University of Excellence",
        slug: "university",
        description: "Outstanding universities",
        regionMultiplied: false,
      },
    ],
  },
  {
    id: "lifetime-achievement",
    name: "Lifetime Achievement",
    slug: "lifetime-achievement",
    description: "Honoring decades of educational impact",
    icon: "Award",
    tier: "icon",
    subcategories: [
      {
        id: "icon-award",
        name: "NESA Icon Award",
        slug: "icon-award",
        description: "Lifetime contribution to African education",
        regionMultiplied: false,
      },
    ],
  },
];

// Tier Descriptions
export const TIER_INFO: Record<AwardTier, { name: string; description: string; color: string; votingMethod: string }> = {
  platinum: {
    name: "Platinum",
    description: "Highest honor, NRC-selected nominees elevated from Gold",
    color: "#E5E4E2",
    votingMethod: "NRC Selection",
  },
  gold: {
    name: "Gold",
    description: "Public voting determines winners",
    color: "#FFD700",
    votingMethod: "Public Voting (100%)",
  },
  "blue-garnet": {
    name: "Blue Garnet",
    description: "Combined jury and public evaluation",
    color: "#1E90FF",
    votingMethod: "Jury (60%) + Public (40%)",
  },
  icon: {
    name: "Icon",
    description: "Lifetime achievement recognition",
    color: "#9B59B6",
    votingMethod: "Jury Selection",
  },
};

// Helper Functions
export function getCurrentPhase(): PhaseConfig | null {
  const now = new Date();
  return PHASES.find(phase => now >= phase.startDate && now <= phase.endDate) || null;
}

export function getActivePhase(): PhaseConfig {
  return PHASES.find(phase => phase.isActive) || PHASES[0];
}

export function getNextPhase(): PhaseConfig | null {
  const current = getCurrentPhase();
  if (!current) return PHASES[0];
  const currentIndex = PHASES.findIndex(p => p.id === current.id);
  return PHASES[currentIndex + 1] || null;
}

export function getPhaseById(id: NESAPhase): PhaseConfig | undefined {
  return PHASES.find(phase => phase.id === id);
}

export function isPhaseActive(id: NESAPhase): boolean {
  const phase = getPhaseById(id);
  if (!phase) return false;
  const now = new Date();
  return now >= phase.startDate && now <= phase.endDate;
}

export function getTimeUntilPhase(id: NESAPhase): { days: number; hours: number; minutes: number; seconds: number } | null {
  const phase = getPhaseById(id);
  if (!phase) return null;
  
  const now = new Date();
  const diff = phase.startDate.getTime() - now.getTime();
  
  if (diff <= 0) return null;
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function getTimeUntilCeremony(): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const diff = CURRENT_SEASON.ceremonyDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function formatCountdown(time: { days: number; hours: number; minutes: number; seconds: number }): string {
  const parts: string[] = [];
  if (time.days > 0) parts.push(`${time.days}d`);
  if (time.hours > 0) parts.push(`${time.hours}h`);
  if (time.minutes > 0) parts.push(`${time.minutes}m`);
  if (time.seconds > 0) parts.push(`${time.seconds}s`);
  return parts.join(" ") || "Now";
}

export function getCategoryByTier(tier: AwardTier): AwardCategory[] {
  return AWARD_CATEGORIES.filter(cat => cat.tier === tier);
}

export function getCategoryBySlug(slug: string): AwardCategory | undefined {
  return AWARD_CATEGORIES.find(cat => cat.slug === slug);
}

export function getAllSubcategories(): SubCategory[] {
  return AWARD_CATEGORIES.flatMap(cat => cat.subcategories);
}

export function getRegionMultipliedCategories(): AwardCategory[] {
  return AWARD_CATEGORIES.filter(cat => 
    cat.subcategories.some(sub => sub.regionMultiplied)
  );
}

// Nomination Path Info
export interface NominationPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  eligibility: string[];
  process: string[];
  tier: AwardTier;
}

export const NOMINATION_PATHS: NominationPath[] = [
  {
    id: "public-nomination",
    name: "Public Nomination",
    description: "Anyone can nominate exceptional educators and institutions",
    icon: "Users",
    eligibility: [
      "Open to all registered users",
      "Must provide valid evidence",
      "One nomination per category per person",
    ],
    process: [
      "Register on platform",
      "Select category & subcategory",
      "Provide nominee details",
      "Upload supporting evidence",
      "Submit for NRC review",
    ],
    tier: "gold",
  },
  {
    id: "self-nomination",
    name: "Self Nomination",
    description: "Institutions and individuals can nominate themselves",
    icon: "User",
    eligibility: [
      "Must meet category requirements",
      "Provide comprehensive documentation",
      "Verification required",
    ],
    process: [
      "Complete detailed application",
      "Provide achievement evidence",
      "Submit references",
      "NRC verification",
    ],
    tier: "gold",
  },
  {
    id: "chapter-nomination",
    name: "Chapter Nomination",
    description: "Regional chapters can fast-track exceptional nominees",
    icon: "Globe",
    eligibility: [
      "Must be referred by official chapter",
      "Meet regional requirements",
      "Chapter lead endorsement",
    ],
    process: [
      "Chapter identification",
      "Chapter review",
      "Direct to NRC",
      "Fast-tracked processing",
    ],
    tier: "platinum",
  },
];

// Vision 2035 Pillars
export interface VisionPillar {
  id: string;
  name: string;
  description: string;
  icon: string;
  goals: string[];
}

export const VISION_2035_PILLARS: VisionPillar[] = [
  {
    id: "access",
    name: "Universal Access",
    description: "Education for every African child regardless of location or circumstance",
    icon: "Globe",
    goals: [
      "100% primary school enrollment",
      "Eliminate gender disparity",
      "Special needs inclusion",
      "Rural area coverage",
    ],
  },
  {
    id: "quality",
    name: "Quality Standards",
    description: "World-class education meeting international benchmarks",
    icon: "Star",
    goals: [
      "Standardized curriculum frameworks",
      "Teacher certification programs",
      "Learning outcome assessments",
      "Infrastructure modernization",
    ],
  },
  {
    id: "innovation",
    name: "Digital Innovation",
    description: "Technology-enabled learning for the 21st century",
    icon: "Cpu",
    goals: [
      "Digital literacy for all",
      "EdTech integration",
      "AI-powered personalization",
      "Virtual learning platforms",
    ],
  },
  {
    id: "sustainability",
    name: "Sustainable Impact",
    description: "Long-term investment in human capital development",
    icon: "Leaf",
    goals: [
      "Skills for green economy",
      "Entrepreneurship education",
      "Research and development",
      "Knowledge economy transition",
    ],
  },
];
