// Unified Volunteer model used across public pages.
// Source of truth = `volunteers` table; falls back to static CONTRIBUTORS.
import { CONTRIBUTORS, type Contributor } from "@/data/contributors";

export type VolunteerVisibility = "public" | "hidden" | "alumni";
export type VolunteerVerification = "pending" | "approved" | "rejected";

export type TeamSlug =
  | "technology" | "design" | "media" | "data" | "content"
  | "gala" | "ambassadors" | "chapters" | "partnerships" | "support";

export const TEAM_LABELS: Record<TeamSlug, string> = {
  technology: "Technology",
  design: "Design & Creative",
  media: "Media & Content",
  data: "Data & Research",
  content: "Editorial & Writing",
  gala: "Gala & Events",
  ambassadors: "Ambassadors",
  chapters: "Chapter Coordinators",
  partnerships: "Partnerships",
  support: "Community Support",
};

export interface VolunteerSocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  github?: string;
  website?: string;
  email?: string;
}

export interface Volunteer {
  id: string;
  /** Shared cross-role person key (volunteers/judges/nrc_members). Absent for static roster entries. */
  personId?: string;
  slug: string;
  fullName: string;
  photoUrl?: string;
  headline?: string;
  bio?: string;
  country?: string;
  region?: string;
  city?: string;
  teamSlug?: TeamSlug;
  role?: string;
  badges: string[];
  socialLinks: VolunteerSocialLinks;
  contributionScore: number;
  referralCode: string;
  referralCount: number;
  tasksCompleted: number;
  isFeatured: boolean;
  visibility: VolunteerVisibility;
  verification: VolunteerVerification;
  joinedAt: string;
  source: "db" | "static";
}

// Derive team from a contributor's roles + contribution areas.
function deriveTeam(c: Contributor): TeamSlug {
  const areas = (c.contributions ?? []).join(" ").toLowerCase();
  const role = (c.role ?? "").toLowerCase();
  if (role.includes("data")) return "data";
  if (role.includes("ambassador")) return "ambassadors";
  if (role.includes("lcp")) return "chapters";
  if (role.includes("judge")) return "data";
  if (role.includes("presenter") || role.includes("host")) return "media";
  if (areas.match(/design|brand|ui|ux|graphic/)) return "design";
  if (areas.match(/video|tv|webinar|media|social|photography/)) return "media";
  if (areas.match(/web|mobile|devops|tech/)) return "technology";
  if (areas.match(/data/)) return "data";
  if (areas.match(/writing|content|translation/)) return "content";
  if (areas.match(/chapter|community|regional/)) return "chapters";
  if (areas.match(/partnership|fundraising|public relations/)) return "partnerships";
  if (areas.match(/event|production/)) return "gala";
  return "support";
}

function pseudoSlug(name: string, id: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return base || id.toLowerCase();
}

function pseudoRef(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "V-";
  let n = h;
  for (let i = 0; i < 6; i++) { s += alpha[n % alpha.length]; n = Math.floor(n / alpha.length) + (h >>> (i * 3)); }
  return s;
}

export function contributorToVolunteer(c: Contributor): Volunteer {
  const teamSlug = deriveTeam(c);
  const isAlumni = c.yearEnd !== undefined;
  // Deterministic pseudo-stats so static cards still look alive.
  const baseScore = (parseInt(pseudoRef(c.id).slice(2), 36) % 1400) + 80;
  return {
    id: c.id,
    slug: pseudoSlug(c.name, c.id),
    fullName: c.name,
    photoUrl: c.imageUrl,
    headline: c.title,
    bio: c.bio ?? c.highlight,
    country: c.country,
    region: c.region,
    teamSlug,
    role: c.role,
    badges: [
      ...(c.role === "Ambassador" || c.role === "Regional Ambassador" ? ["ambassador"] : []),
      ...(c.role === "LCP" ? ["chapter_coordinator"] : []),
      ...(c.yearStart <= 2022 ? ["founding"] : []),
    ],
    socialLinks: {
      linkedin: c.socials?.linkedin,
      twitter: c.socials?.twitter,
      instagram: c.socials?.instagram,
      facebook: c.socials?.facebook,
      youtube: c.socials?.youtube,
      website: c.socials?.website,
      email: c.socials?.email,
    },
    contributionScore: baseScore,
    referralCode: pseudoRef(c.id),
    referralCount: baseScore % 17,
    tasksCompleted: (baseScore % 23) + 2,
    isFeatured: c.yearStart <= 2022,
    visibility: isAlumni ? "alumni" : "public",
    verification: "approved",
    joinedAt: `${c.yearStart}-01-01`,
    source: "static",
  };
}

export const STATIC_VOLUNTEERS: Volunteer[] = CONTRIBUTORS.map(contributorToVolunteer);

export type ContributionTier = "bronze" | "silver" | "gold" | "continental";
export function tierFor(score: number): ContributionTier {
  if (score >= 1500) return "continental";
  if (score >= 800) return "gold";
  if (score >= 300) return "silver";
  return "bronze";
}
export const TIER_LABEL: Record<ContributionTier, string> = {
  bronze: "Bronze Contributor",
  silver: "Silver Contributor",
  gold: "Gold Contributor",
  continental: "Continental Builder",
};
export const TIER_COLOR: Record<ContributionTier, string> = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-slate-400 to-slate-200",
  gold: "from-yellow-500 to-amber-300",
  continental: "from-amber-300 via-yellow-200 to-amber-400",
};

export function buildReferralUrl(code: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://nesa.africa";
  return `${base}/join?v=${encodeURIComponent(code)}`;
}
