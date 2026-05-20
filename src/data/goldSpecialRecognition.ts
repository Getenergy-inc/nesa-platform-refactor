/**
 * Influencers Education Impact Award 2026 Edition
 * Dedicated nominee ecosystem (3 cultural impact categories).
 * Source of truth for all `/nominees/gold-special-recognition/*` routes.
 */
import sportsNominee1 from "@/assets/nominees/didier-drogba.jpg";
import sportsNominee2 from "@/assets/nominees/tegla-loroupe.jpg";
import sportsNominee3 from "@/assets/nominees/siya-kolisi.jpg";
import musicNominee1 from "@/assets/nominees/burna-boy.jpg";
import musicNominee2 from "@/assets/nominees/music-nominee-2.jpg";
import musicNominee3 from "@/assets/nominees/music-nominee-3.jpg";
import socialNominee1 from "@/assets/nominees/social-nominee-1.jpg";
import socialNominee2 from "@/assets/nominees/social-nominee-2.jpg";
import socialNominee3 from "@/assets/nominees/social-nominee-3.jpg";

import { Trophy, Music, Smartphone, type LucideIcon } from "lucide-react";

export interface GoldNominee {
  slug: string;
  name: string;
  country: string;
  flag: string;
  region: string;
  discipline: string; // sport / genre / platform
  filterTags: string[]; // for filter chip matching (lowercased)
  followers?: string;
  badge: string;
  summary: string;
  impactStory: string;
  metrics?: { label: string; value: string }[];
  verified: boolean;
  votes: number;
  image: string;
}

export interface GoldCategory {
  slug: string;
  title: string;
  pageTitle: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  filters: string[]; // First entry should be "All"
  nominees: GoldNominee[];
  accent: string; // tailwind gradient
}

export const GOLD_CATEGORIES: GoldCategory[] = [
  {
    slug: "sports-for-education",
    shortName: "Sports for Education",
    title: "Sports for Education",
    pageTitle: "Africa Sports Education Impact Recognition",
    description:
      "Recognizing sportsmen, sportswomen, coaches, sports foundations, and athletic role models championing education advocacy, youth mentorship, scholarships, school support, and learning access across Africa.",
    icon: Trophy,
    filters: ["All", "Football", "Basketball", "Athletics", "Combat Sports", "Paralympics", "Youth Sports Development", "Sports Foundations"],
    accent: "from-amber-500/30 to-gold/10",
    nominees: [
      {
        slug: "didier-drogba",
        name: "Didier Drogba",
        country: "Côte d'Ivoire", flag: "🇨🇮", region: "West Africa",
        discipline: "Football",
        filterTags: ["football", "sports foundations"],
        badge: "Sports for Education",
        summary: "Built hospitals, schools, and funded education for thousands of Ivorian youth.",
        impactStory:
          "Through the Didier Drogba Foundation, invested over $8M in education infrastructure including school construction, scholarship programs, and healthcare facilities across Côte d'Ivoire. Named UNDP Goodwill Ambassador for championing education access.",
        metrics: [
          { label: "Investment", value: "$8M+" },
          { label: "Schools Supported", value: "12" },
          { label: "Scholarships", value: "1,400+" },
        ],
        verified: true, votes: 142, image: sportsNominee1,
      },
      {
        slug: "tegla-loroupe",
        name: "Tegla Loroupe",
        country: "Kenya", flag: "🇰🇪", region: "East Africa",
        discipline: "Athletics",
        filterTags: ["athletics", "youth sports development", "sports foundations"],
        badge: "Sports for Education",
        summary: "Peace Foundation supporting education for refugee and marginalized youth.",
        impactStory:
          "World record marathon holder who established the Tegla Loroupe Peace Foundation, providing education and sports training to over 10,000 refugee children across Kenya and Uganda. UN Ambassador for Sport.",
        metrics: [
          { label: "Children Reached", value: "10,000+" },
          { label: "Countries", value: "2" },
        ],
        verified: true, votes: 98, image: sportsNominee2,
      },
      {
        slug: "siya-kolisi",
        name: "Siya Kolisi",
        country: "South Africa", flag: "🇿🇦", region: "Southern Africa",
        discipline: "Rugby",
        filterTags: ["sports foundations", "youth sports development"],
        badge: "Sports for Education",
        summary: "Kolisi Foundation drives education, nutrition, and GBV awareness in townships.",
        impactStory:
          "South Africa's first Black Rugby World Cup-winning captain. The Kolisi Foundation has impacted 500,000+ lives through education programs, school feeding schemes, and youth sports development in underserved communities.",
        metrics: [
          { label: "Lives Impacted", value: "500K+" },
          { label: "Programs", value: "4" },
        ],
        verified: true, votes: 117, image: sportsNominee3,
      },
    ],
  },
  {
    slug: "music-for-education",
    shortName: "Music for Education",
    title: "Music for Education",
    pageTitle: "Africa Music Education Impact Recognition",
    description:
      "Recognizing musicians, performers, producers, music executives, and cultural icons using music, entertainment, concerts, lyrics, influence, and public campaigns to advance education awareness and youth empowerment across Africa.",
    icon: Music,
    filters: ["All", "Afrobeats", "Gospel", "Hip-Hop", "Traditional Music", "Educational Music Campaigns", "Youth Advocacy", "Music Foundations"],
    accent: "from-rose-500/25 to-gold/10",
    nominees: [
      {
        slug: "burna-boy",
        name: "Burna Boy",
        country: "Nigeria", flag: "🇳🇬", region: "West Africa",
        discipline: "Afrobeats",
        filterTags: ["afrobeats", "youth advocacy"],
        badge: "Music for Education",
        summary: "Grammy-winning artist funding scholarships and youth education initiatives.",
        impactStory:
          "Grammy Award-winning Afrobeats pioneer who has funded scholarship programs for 200+ Nigerian students. Advocates for African youth empowerment through education and cultural identity. Concert proceeds regularly support school construction.",
        metrics: [
          { label: "Scholarships Funded", value: "200+" },
          { label: "Reach", value: "Global" },
        ],
        verified: true, votes: 156, image: musicNominee1,
      },
      {
        slug: "angelique-kidjo",
        name: "Angélique Kidjo",
        country: "Benin", flag: "🇧🇯", region: "West Africa",
        discipline: "World / Traditional",
        filterTags: ["traditional music", "music foundations", "youth advocacy"],
        badge: "Music for Education",
        summary: "Batonga Foundation empowering girls' education across 10 African countries.",
        impactStory:
          "Multiple Grammy winner and UNICEF Goodwill Ambassador. Founded the Batonga Foundation in 2006, providing secondary education and leadership training to thousands of girls across Benin, Ethiopia, and 8 other African countries.",
        metrics: [
          { label: "Girls Educated", value: "Thousands" },
          { label: "Countries", value: "10" },
        ],
        verified: true, votes: 134, image: musicNominee2,
      },
      {
        slug: "tems",
        name: "Tems",
        country: "Nigeria", flag: "🇳🇬", region: "West Africa",
        discipline: "Afrobeats / R&B",
        filterTags: ["afrobeats", "youth advocacy", "educational music campaigns"],
        badge: "Music for Education",
        summary: "Global icon championing youth creative education and mentorship.",
        impactStory:
          "Grammy-winning vocalist using her global platform to advocate for creative arts education in African schools. Supports music and arts scholarships for young Nigerians, promoting education through cultural expression and mentorship.",
        metrics: [
          { label: "Awards", value: "Grammy" },
          { label: "Focus", value: "Creative Arts" },
        ],
        verified: true, votes: 89, image: musicNominee3,
      },
    ],
  },
  {
    slug: "social-media-for-education",
    shortName: "Social Media for Education",
    title: "Social Media for Education",
    pageTitle: "Africa Social Media Education Impact Recognition",
    description:
      "Recognizing influencers, digital creators, educators, public advocates, and online personalities using social media platforms to promote literacy, learning access, education awareness, mentorship, and youth empowerment across Africa.",
    icon: Smartphone,
    filters: ["All", "TikTok", "YouTube", "Instagram", "X / Twitter", "LinkedIn", "Educational Content Creators", "Online Advocacy Campaigns"],
    accent: "from-sky-500/25 to-gold/10",
    nominees: [
      {
        slug: "mark-angel",
        name: "Mark Angel",
        country: "Nigeria", flag: "🇳🇬", region: "West Africa",
        discipline: "YouTube",
        filterTags: ["youtube", "instagram", "educational content creators"],
        followers: "10M+ YouTube",
        badge: "Social Media for Education",
        summary: "Africa's most-subscribed YouTuber using comedy to promote literacy.",
        impactStory:
          "Creator of Mark Angel Comedy with 10M+ YouTube subscribers. Uses comedic storytelling to promote education awareness and literacy. Funds school supplies and scholarship programs across Nigeria through content revenue.",
        metrics: [
          { label: "Subscribers", value: "10M+" },
          { label: "Platform", value: "YouTube" },
        ],
        verified: true, votes: 128, image: socialNominee1,
      },
      {
        slug: "elsa-majimbo",
        name: "Elsa Majimbo",
        country: "Kenya", flag: "🇰🇪", region: "East Africa",
        discipline: "Instagram / TikTok",
        filterTags: ["instagram", "tiktok", "online advocacy campaigns"],
        followers: "2M+",
        badge: "Social Media for Education",
        summary: "Forbes 30U30 voice championing African youth education.",
        impactStory:
          "Forbes 30 Under 30 honoree using her global platform to champion African youth education. Partners with education NGOs to raise awareness for scholarship access and youth empowerment programs across East Africa.",
        metrics: [
          { label: "Reach", value: "Global" },
          { label: "Partners", value: "NGOs" },
        ],
        verified: true, votes: 76, image: socialNominee2,
      },
      {
        slug: "wode-maya",
        name: "Wode Maya",
        country: "Ghana", flag: "🇬🇭", region: "West Africa",
        discipline: "YouTube",
        filterTags: ["youtube", "x / twitter", "educational content creators"],
        followers: "3M+ YouTube",
        badge: "Social Media for Education",
        summary: "Pan-African travel creator reshaping education narratives.",
        impactStory:
          "YouTube creator with 3M+ subscribers documenting African stories. Built schools in rural Ghana through content revenue, promotes Pan-African education initiatives, and has inspired thousands of diaspora youth to invest in African education.",
        metrics: [
          { label: "Subscribers", value: "3M+" },
          { label: "Schools Built", value: "Multiple" },
        ],
        verified: true, votes: 94, image: socialNominee3,
      },
    ],
  },
];

// Merge in auto-classified migrated nominees from the 2025 master dataset.
// See REPORT at /mnt/documents/nesa-gold-migration/REPORT.md
import { MUSIC_MIGRATED, SPORTS_MIGRATED, SOCIAL_MIGRATED } from "./goldSpecialRecognitionMigrated";
const mergeBySlug = (existing: GoldNominee[], incoming: GoldNominee[]) => {
  const have = new Set(existing.map((n) => n.slug));
  return [...existing, ...incoming.filter((n) => !have.has(n.slug))];
};
for (const cat of GOLD_CATEGORIES) {
  if (cat.slug === "music-for-education") cat.nominees = mergeBySlug(cat.nominees, MUSIC_MIGRATED);
  if (cat.slug === "sports-for-education") cat.nominees = mergeBySlug(cat.nominees, SPORTS_MIGRATED);
  if (cat.slug === "social-media-for-education") cat.nominees = mergeBySlug(cat.nominees, SOCIAL_MIGRATED);
}

export function getGoldCategory(slug: string): GoldCategory | undefined {
  return GOLD_CATEGORIES.find((c) => c.slug === slug);
}

export function getGoldNominee(categorySlug: string, nomineeSlug: string) {
  const cat = getGoldCategory(categorySlug);
  if (!cat) return null;
  const nominee = cat.nominees.find((n) => n.slug === nomineeSlug);
  return nominee ? { category: cat, nominee } : null;
}

export function getAllGoldNominees(): { category: GoldCategory; nominee: GoldNominee }[] {
  return GOLD_CATEGORIES.flatMap((category) =>
    category.nominees.map((nominee) => ({ category, nominee }))
  );
}
