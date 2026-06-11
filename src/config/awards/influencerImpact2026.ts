/**
 * Influencer Education Impact Award 2026 — single source of truth.
 *
 * Drives:
 *   - Hero stats bar
 *   - 3 category cards (Social Media, Sports, Music)
 *   - Nominee discovery filters and chips
 *   - Nomination flow conditional logic
 *   - DB column naming (mirrors `public.influencer_impact_nominees`)
 *
 * Never duplicate these lists in components — import from here.
 */

import didierDrogba from "@/assets/nominees/didier-drogba.jpg";
import teglaLoroupe from "@/assets/nominees/tegla-loroupe.jpg";
import siyaKolisi from "@/assets/nominees/siya-kolisi.jpg";
import burnaBoy from "@/assets/nominees/burna-boy.jpg";
import angeliqueKidjo from "@/assets/nominees/angelique-kidjo.jpg";
import tems from "@/assets/nominees/tems.jpg";
import socialA from "@/assets/nominees/social-nominee-1.jpg";
import socialB from "@/assets/nominees/social-nominee-2.jpg";
import socialC from "@/assets/nominees/social-nominee-3.jpg";

export const AWARD_FAMILY = "Influencer Education Impact Award 2026";
export const AWARD_ROUTE =
  "/awards/influencers-education-impact-2026-recognition";

export type CategoryId = "social-media" | "sports" | "music";
export type RecognitionClass =
  | "African Living in Africa"
  | "African in the Diaspora";
export type RegionId =
  | "North Africa"
  | "West Africa"
  | "East Africa"
  | "Central Africa"
  | "Southern Africa"
  | "Horn of Africa"
  | "Sahel"
  | "Indian Ocean Islands"
  | "African Diaspora";
export type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";

export const RECOGNITION_CLASSES: RecognitionClass[] = [
  "African Living in Africa",
  "African in the Diaspora",
];

// 8 African regions + African Diaspora
export const REGIONS: RegionId[] = [
  "North Africa",
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "Horn of Africa",
  "Sahel",
  "Indian Ocean Islands",
  "African Diaspora",
];

// ── Countries grouped by region ─────────────────────────────────────
// 55 African countries (AU member states incl. Sahrawi Republic) +
// principal African Diaspora host countries.
export const COUNTRIES_BY_REGION: Record<RegionId, string[]> = {
  "North Africa": [
    "Algeria",
    "Egypt",
    "Libya",
    "Mauritania",
    "Morocco",
    "Sudan",
    "Tunisia",
    "Western Sahara",
  ],
  "West Africa": [
    "Benin",
    "Cape Verde",
    "Côte d'Ivoire",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Liberia",
    "Nigeria",
    "Senegal",
    "Sierra Leone",
    "Togo",
  ],
  "Sahel": ["Burkina Faso", "Chad", "Mali", "Niger"],
  "East Africa": [
    "Burundi",
    "Kenya",
    "Rwanda",
    "South Sudan",
    "Tanzania",
    "Uganda",
  ],
  "Horn of Africa": ["Djibouti", "Eritrea", "Ethiopia", "Somalia"],
  "Central Africa": [
    "Angola",
    "Cameroon",
    "Central African Republic",
    "Republic of the Congo",
    "Democratic Republic of the Congo",
    "Equatorial Guinea",
    "Gabon",
    "São Tomé and Príncipe",
  ],
  "Southern Africa": [
    "Botswana",
    "Eswatini",
    "Lesotho",
    "Malawi",
    "Mozambique",
    "Namibia",
    "South Africa",
    "Zambia",
    "Zimbabwe",
  ],
  "Indian Ocean Islands": ["Comoros", "Madagascar", "Mauritius", "Seychelles"],
  "African Diaspora": [
    "United States",
    "Canada",
    "United Kingdom",
    "Ireland",
    "France",
    "Germany",
    "Netherlands",
    "Belgium",
    "Italy",
    "Spain",
    "Portugal",
    "Switzerland",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Austria",
    "Greece",
    "Turkey",
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Kuwait",
    "Australia",
    "New Zealand",
    "China",
    "India",
    "Japan",
    "South Korea",
    "Brazil",
    "Argentina",
    "Mexico",
    "Colombia",
    "Jamaica",
    "Trinidad and Tobago",
    "Barbados",
    "Haiti",
    "Guyana",
    "Suriname",
  ],
};

// Flat alphabetised list of all selectable countries.
export const ALL_COUNTRIES: string[] = Array.from(
  new Set(Object.values(COUNTRIES_BY_REGION).flat()),
).sort((a, b) => a.localeCompare(b));

// ── Category taxonomies ─────────────────────────────────────────────

export const SOCIAL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "X",
  "LinkedIn",
  "WhatsApp Communities",
  "Telegram Communities",
  "Podcast Platforms",
  "Blogs",
  "Online Learning Platforms",
  "Multi-Platform Influencers",
] as const;

export const SOCIAL_CONTENT_IMPACT_AREAS = [
  "Education Content Creator",
  "STEM Creator",
  "Scholarship Advocate",
  "Career Guidance Influencer",
  "Youth Empowerment Influencer",
  "Special Needs Education Advocate",
  "Girls Education Advocate",
  "Digital Learning Influencer",
  "Education Podcast Host",
  "Leadership Education Advocate",
] as const;

export const SPORT_AREAS = [
  "Football",
  "Basketball",
  "Athletics",
  "Tennis",
  "Rugby",
  "Boxing",
  "Swimming",
  "Paralympic Sports",
  "Sports Academy Founder",
  "Sports Coach",
  "Multi-Sport Athlete",
] as const;

export const SPORTS_IMPACT_AREAS = [
  "Scholarship Support",
  "School Building",
  "Sports Academies",
  "Youth Mentorship",
  "Girls Education",
  "Special Needs Education",
  "Digital Learning Support",
  "Community Education Programmes",
  "Out-of-School Child Support",
] as const;

export const MUSIC_GENRES = [
  "Afrobeats",
  "Gospel",
  "Hip-Hop",
  "Afro-pop",
  "Highlife",
  "Amapiano",
  "Reggae",
  "Traditional Music",
  "Jazz",
  "Multi-Genre Artist",
] as const;

export const MUSIC_IMPACT_AREAS = [
  "Scholarships",
  "School Projects",
  "Educational Music Campaigns",
  "Girls Education",
  "Creative Education",
  "Youth Mentorship",
  "Digital Learning",
  "Education Fundraising Concerts",
  "Cultural Identity Education",
] as const;

export const EVIDENCE_CATEGORIES = [
  "Scholarships Supported",
  "Schools Supported",
  "Students Reached",
  "Teachers Trained",
  "Communities Impacted",
  "Education Campaigns Led",
  "Digital Learning Access Enabled",
  "Girls Education Projects Supported",
] as const;

export const GOVERNANCE_RULES = [
  "Follower count alone does not qualify a nominee.",
  "Popularity alone does not qualify a nominee.",
  "Music success alone does not qualify a nominee.",
  "Sports success alone does not qualify a nominee.",
] as const;

export const EDX_WEIGHTS = {
  education: 25, // Education Impact
  development: 30, // Development Contribution
  excellence: 45, // Excellence & Reach
} as const;

export interface CategoryConfig {
  id: CategoryId;
  title: string;
  shortName: string;
  description: string;
  primaryFieldLabel: string;
  primaryFieldOptions: readonly string[];
  impactFieldLabel: string;
  impactFieldOptions: readonly string[];
  /** DB column names this category populates */
  classificationFields: readonly string[];
  ctaLabel: string;
  accent: string; // tailwind gradient
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "social-media",
    title: "African Social Media Influencers Education Impact Award",
    shortName: "Social Media",
    description:
      "Recognising creators, educators, digital advocates, podcasters, bloggers, and online personalities advancing education through digital influence.",
    primaryFieldLabel: "Primary Social Media Platform",
    primaryFieldOptions: SOCIAL_PLATFORMS,
    impactFieldLabel: "Content Impact Area",
    impactFieldOptions: SOCIAL_CONTENT_IMPACT_AREAS,
    classificationFields: [
      "primary_social_media_platform",
      "content_impact_area",
    ],
    ctaLabel: "Explore Social Media Nominees",
    accent: "from-sky-500/30 to-gold/10",
  },
  {
    id: "sports",
    title: "African Sports Icons Supporting Education",
    shortName: "Sports",
    description:
      "Recognising athletes, sports foundations, academies, coaches, and sports leaders using sports as a tool for educational transformation.",
    primaryFieldLabel: "Area of Sport",
    primaryFieldOptions: SPORT_AREAS,
    impactFieldLabel: "Sports-for-Education Impact Area",
    impactFieldOptions: SPORTS_IMPACT_AREAS,
    classificationFields: ["primary_sport_area", "sports_education_impact_area"],
    ctaLabel: "Explore Sports Nominees",
    accent: "from-amber-500/30 to-gold/10",
  },
  {
    id: "music",
    title: "African Music Icons Supporting Education",
    shortName: "Music",
    description:
      "Recognising musicians, performers, producers, music executives, and cultural icons using music, entertainment, concerts, lyrics, influence, and public campaigns to advance education awareness and youth empowerment across Africa.",
    primaryFieldLabel: "Music Genre",
    primaryFieldOptions: MUSIC_GENRES,
    impactFieldLabel: "Music-for-Education Impact Area",
    impactFieldOptions: MUSIC_IMPACT_AREAS,
    classificationFields: ["music_genre", "music_education_impact_area"],
    ctaLabel: "Explore Music Nominees",
    accent: "from-rose-500/30 to-gold/10",
  },
];

export const HERO_STATS = [
  { value: "27", label: "Countries Represented" },
  { value: "3", label: "Recognition Categories" },
  { value: "1,000+", label: "Potential Nominees" },
  { value: "54", label: "African Countries Eligible" },
  { value: "Africa & Diaspora", label: "Coverage" },
];

// ── Nominee shape (mirrors DB row) ──────────────────────────────────

export interface InfluencerNominee {
  slug: string;
  award_family: string; // AWARD_FAMILY
  award_category: CategoryId;
  recognition_class: RecognitionClass;
  nominee_name: string;
  nominee_country: string;
  flag: string;
  nominee_region: RegionId;
  education_impact_summary: string;
  evidence_links: string[];
  verification_status: VerificationStatus;
  verified_nominations: number;
  image: string;

  // Social Media
  primary_social_media_platform?: (typeof SOCIAL_PLATFORMS)[number];
  other_platforms?: string[];
  content_impact_area?: (typeof SOCIAL_CONTENT_IMPACT_AREAS)[number];
  follower_count_range?: string;
  platform_profile_link?: string;

  // Sports
  primary_sport_area?: (typeof SPORT_AREAS)[number];
  club_team_or_foundation?: string;
  sports_education_impact_area?: (typeof SPORTS_IMPACT_AREAS)[number];
  athlete_status?: string;
  sports_profile_link?: string;

  // Music
  music_genre?: (typeof MUSIC_GENRES)[number];
  other_music_genres?: string[];
  stage_name?: string;
  label_or_foundation?: string;
  music_education_impact_area?: (typeof MUSIC_IMPACT_AREAS)[number];
  artist_profile_link?: string;
}

// ── Seed nominees (classified per spec; reused 9 known figures) ─────

export const SEED_NOMINEES: InfluencerNominee[] = [
  {
    slug: "didier-drogba",
    award_family: AWARD_FAMILY,
    award_category: "sports",
    recognition_class: "African in the Diaspora",
    nominee_name: "Didier Drogba",
    nominee_country: "Côte d'Ivoire",
    flag: "🇨🇮",
    nominee_region: "West Africa",
    education_impact_summary:
      "Didier Drogba Foundation invested $8M+ in school construction, scholarships, and healthcare across Côte d'Ivoire.",
    evidence_links: ["https://didierdrogbafoundation.org"],
    verification_status: "VERIFIED",
    verified_nominations: 142,
    image: didierDrogba,
    primary_sport_area: "Football",
    club_team_or_foundation: "Didier Drogba Foundation",
    sports_education_impact_area: "School Building",
    athlete_status: "Retired Professional",
  },
  {
    slug: "tegla-loroupe",
    award_family: AWARD_FAMILY,
    award_category: "sports",
    recognition_class: "African Living in Africa",
    nominee_name: "Tegla Loroupe",
    nominee_country: "Kenya",
    flag: "🇰🇪",
    nominee_region: "East Africa",
    education_impact_summary:
      "Tegla Loroupe Peace Foundation provides education and sports training to 10,000+ refugee children.",
    evidence_links: ["https://teglapeacefoundation.org"],
    verification_status: "VERIFIED",
    verified_nominations: 98,
    image: teglaLoroupe,
    primary_sport_area: "Athletics",
    club_team_or_foundation: "Tegla Loroupe Peace Foundation",
    sports_education_impact_area: "Out-of-School Child Support",
    athlete_status: "Retired Marathon Champion",
  },
  {
    slug: "siya-kolisi",
    award_family: AWARD_FAMILY,
    award_category: "sports",
    recognition_class: "African Living in Africa",
    nominee_name: "Siya Kolisi",
    nominee_country: "South Africa",
    flag: "🇿🇦",
    nominee_region: "Southern Africa",
    education_impact_summary:
      "Kolisi Foundation has impacted 500,000+ lives through education, feeding, and youth sport in townships.",
    evidence_links: ["https://kolisifoundation.org"],
    verification_status: "VERIFIED",
    verified_nominations: 117,
    image: siyaKolisi,
    primary_sport_area: "Rugby",
    club_team_or_foundation: "Kolisi Foundation",
    sports_education_impact_area: "Community Education Programmes",
    athlete_status: "Active Professional",
  },
  {
    slug: "burna-boy",
    award_family: AWARD_FAMILY,
    award_category: "music",
    recognition_class: "African Living in Africa",
    nominee_name: "Burna Boy",
    nominee_country: "Nigeria",
    flag: "🇳🇬",
    nominee_region: "West Africa",
    education_impact_summary:
      "Funded scholarship programs for 200+ Nigerian students; concert proceeds support school construction.",
    evidence_links: [],
    verification_status: "VERIFIED",
    verified_nominations: 156,
    image: burnaBoy,
    music_genre: "Afrobeats",
    stage_name: "Burna Boy",
    label_or_foundation: "Spaceship Entertainment",
    music_education_impact_area: "Scholarships",
  },
  {
    slug: "angelique-kidjo",
    award_family: AWARD_FAMILY,
    award_category: "music",
    recognition_class: "African in the Diaspora",
    nominee_name: "Angélique Kidjo",
    nominee_country: "Benin",
    flag: "🇧🇯",
    nominee_region: "West Africa",
    education_impact_summary:
      "Batonga Foundation delivers secondary education and leadership training to girls across 10 African countries.",
    evidence_links: ["https://batongafoundation.org"],
    verification_status: "VERIFIED",
    verified_nominations: 134,
    image: angeliqueKidjo,
    music_genre: "Traditional Music",
    other_music_genres: ["Afro-pop"],
    stage_name: "Angélique Kidjo",
    label_or_foundation: "Batonga Foundation",
    music_education_impact_area: "Girls Education",
  },
  {
    slug: "tems",
    award_family: AWARD_FAMILY,
    award_category: "music",
    recognition_class: "African Living in Africa",
    nominee_name: "Tems",
    nominee_country: "Nigeria",
    flag: "🇳🇬",
    nominee_region: "West Africa",
    education_impact_summary:
      "Advocates for creative-arts education in African schools; supports music and arts scholarships for young Nigerians.",
    evidence_links: [],
    verification_status: "VERIFIED",
    verified_nominations: 89,
    image: tems,
    music_genre: "Afrobeats",
    other_music_genres: ["Afro-pop"],
    stage_name: "Tems",
    music_education_impact_area: "Creative Education",
  },
  {
    slug: "mark-angel",
    award_family: AWARD_FAMILY,
    award_category: "social-media",
    recognition_class: "African Living in Africa",
    nominee_name: "Mark Angel",
    nominee_country: "Nigeria",
    flag: "🇳🇬",
    nominee_region: "West Africa",
    education_impact_summary:
      "10M+ YouTube subscribers; funds school supplies and scholarships across Nigeria via content revenue.",
    evidence_links: ["https://youtube.com/@MarkAngelComedy"],
    verification_status: "VERIFIED",
    verified_nominations: 128,
    image: socialA,
    primary_social_media_platform: "YouTube",
    other_platforms: ["Instagram"],
    content_impact_area: "Education Content Creator",
    follower_count_range: "10M+",
    platform_profile_link: "https://youtube.com/@MarkAngelComedy",
  },
  {
    slug: "elsa-majimbo",
    award_family: AWARD_FAMILY,
    award_category: "social-media",
    recognition_class: "African in the Diaspora",
    nominee_name: "Elsa Majimbo",
    nominee_country: "Kenya",
    flag: "🇰🇪",
    nominee_region: "East Africa",
    education_impact_summary:
      "Forbes 30U30 — partners with education NGOs to raise awareness for scholarship access across East Africa.",
    evidence_links: [],
    verification_status: "VERIFIED",
    verified_nominations: 76,
    image: socialB,
    primary_social_media_platform: "Instagram",
    other_platforms: ["TikTok"],
    content_impact_area: "Youth Empowerment Influencer",
    follower_count_range: "2M+",
  },
  {
    slug: "wode-maya",
    award_family: AWARD_FAMILY,
    award_category: "social-media",
    recognition_class: "African Living in Africa",
    nominee_name: "Wode Maya",
    nominee_country: "Ghana",
    flag: "🇬🇭",
    nominee_region: "West Africa",
    education_impact_summary:
      "3M+ YouTube subscribers documenting African stories; built schools in rural Ghana via content revenue.",
    evidence_links: ["https://youtube.com/@WodeMaya"],
    verification_status: "VERIFIED",
    verified_nominations: 94,
    image: socialC,
    primary_social_media_platform: "YouTube",
    other_platforms: ["X"],
    content_impact_area: "Education Content Creator",
    follower_count_range: "3M+",
    platform_profile_link: "https://youtube.com/@WodeMaya",
  },
];

// ── Filter reducer (pure, testable) ─────────────────────────────────

export interface NomineeFilters {
  search?: string;
  category?: CategoryId | "all";
  recognitionClass?: RecognitionClass | "all";
  region?: RegionId | "all";
  country?: string | "all";
  platform?: string | "all";
  sportArea?: string | "all";
  musicGenre?: string | "all";
  impactArea?: string | "all";
  verification?: VerificationStatus | "all";
}

const norm = (s: string | undefined) => (s ?? "").trim().toLowerCase();
const isAll = (v: string | undefined) => !v || v === "all";

export function filterNominees(
  nominees: InfluencerNominee[],
  f: NomineeFilters,
): InfluencerNominee[] {
  const q = norm(f.search);
  return nominees.filter((n) => {
    if (!isAll(f.category) && n.award_category !== f.category) return false;
    if (!isAll(f.recognitionClass) && n.recognition_class !== f.recognitionClass)
      return false;
    if (!isAll(f.region) && n.nominee_region !== f.region) return false;
    if (!isAll(f.country) && n.nominee_country !== f.country) return false;
    if (!isAll(f.platform) && n.primary_social_media_platform !== f.platform)
      return false;
    if (!isAll(f.sportArea) && n.primary_sport_area !== f.sportArea) return false;
    if (!isAll(f.musicGenre) && n.music_genre !== f.musicGenre) return false;
    if (!isAll(f.impactArea)) {
      const impacts = [
        n.content_impact_area,
        n.sports_education_impact_area,
        n.music_education_impact_area,
      ];
      if (!impacts.includes(f.impactArea as any)) return false;
    }
    if (!isAll(f.verification) && n.verification_status !== f.verification)
      return false;
    if (q) {
      const hay = [
        n.nominee_name,
        n.stage_name,
        n.label_or_foundation,
        n.club_team_or_foundation,
        n.platform_profile_link,
        n.sports_profile_link,
        n.artist_profile_link,
        n.nominee_country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getCategory(id: CategoryId): CategoryConfig {
  const c = CATEGORIES.find((c) => c.id === id);
  if (!c) throw new Error(`Unknown influencer category: ${id}`);
  return c;
}

// Maps the 3 page categories onto the audit-aligned nomination form slugs
// in src/config/nomination/influencerForms.ts. URL-driven preselect bypasses
// the family cards in NominateFlow (see Pass C).
const CATEGORY_TO_FORM_SLUG: Record<CategoryId, string> = {
  "social-media": "education-content-social-media-influencers",
  sports: "african-footballers-supporting-education",
  music: "african-musicians-supporting-education",
};

export const NOMINATE_URL = (categoryId: CategoryId) =>
  `/nominate?family=influencer&awardFamily=${encodeURIComponent(
    "Influencer Education Impact Award 2026",
  )}&category=${CATEGORY_TO_FORM_SLUG[categoryId]}`;

