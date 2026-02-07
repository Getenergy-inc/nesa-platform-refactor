/**
 * Database-driven Nominees Hook
 * Fetches nominees from Supabase with real-time updates
 * Uses canonical 7-region structure from regions.ts
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GeographicCategory, NomineeImageType } from "@/lib/nesaData";
import { normalizeRegion, isContinentalRegion, type AfricanRegion } from "@/lib/regions";

// Keywords indicating an organization/company (vs a person)
const ORGANIZATION_KEYWORDS = [
  "ltd", "limited", "inc", "llc", "company", "corporation", "corp", "group",
  "foundation", "ministry", "university", "college", "school", "institute",
  "bank", "plc", "ngo", "association", "society", "council", "commission",
  "agency", "authority", "department", "organization", "organisation",
  "trust", "charity", "network", "alliance", "centre", "center", "hospital",
  "clinic", "media", "broadcast", "television", "radio", "press", "publishing"
];

function isOrganization(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ORGANIZATION_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

function getImageType(name: string): NomineeImageType {
  return isOrganization(name) ? "logo" : "photo";
}

// Map AfricanRegion to GeographicCategory for display filtering
const AFRICAN_REGION_TO_GEOGRAPHIC: Record<AfricanRegion, GeographicCategory> = {
  "North Africa": "north-africa",
  "West Africa": "west-africa",
  "Central Africa": "central-africa",
  "East Africa": "east-africa",
  "Southern Africa": "south-africa",
  "Diaspora": "diaspora",
  "Friends of Africa": "friends-of-africa",
};

/**
 * Convert region string from database to GeographicCategory
 * Uses canonical normalizeRegion from regions.ts
 */
function getGeographicCategory(region: string | null, categoryName: string | null): GeographicCategory {
  // First try to normalize using the canonical region system
  if (region) {
    const normalizedRegion = normalizeRegion(region);
    return AFRICAN_REGION_TO_GEOGRAPHIC[normalizedRegion];
  }
  
  // Check category name for diaspora/international keywords
  if (categoryName) {
    const lowerCategory = categoryName.toLowerCase();
    if (lowerCategory.includes("diaspora")) return "diaspora";
    if (lowerCategory.includes("international") || lowerCategory.includes("bilateral") || lowerCategory.includes("global")) {
      return "friends-of-africa";
    }
  }
  
  // Default to general Africa regions bucket
  return "africa-regions";
}

/**
 * Check if a GeographicCategory is a continental African region
 */
function isAfricanRegion(category: GeographicCategory): boolean {
  return ["north-africa", "east-africa", "west-africa", "south-africa", "central-africa"].includes(category);
}

export interface DatabaseNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photo_url: string | null;
  logo_url: string | null;
  status: string | null;
  is_platinum: boolean | null;
  public_votes: number | null;
  subcategory_id: string;
  season_id: string;
  // Joined fields
  subcategory_name?: string;
  subcategory_slug?: string;
  category_name?: string;
  category_slug?: string;
}

export interface EnrichedDatabaseNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photoUrl: string;
  imageType: NomineeImageType;
  status: string;
  isPlatinum: boolean;
  publicVotes: number;
  subcategoryName: string;
  subcategorySlug: string;
  categoryName: string;
  categorySlug: string;
  geographicCategory: GeographicCategory;
  achievement: string;
}

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

function enrichNominee(nominee: DatabaseNominee): EnrichedDatabaseNominee {
  const imageType = getImageType(nominee.name);
  const photoUrl = (imageType === "logo" ? nominee.logo_url : nominee.photo_url) || PLACEHOLDER_IMAGE;
  
  return {
    id: nominee.id,
    name: nominee.name,
    slug: nominee.slug,
    title: nominee.title,
    bio: nominee.bio,
    organization: nominee.organization,
    country: nominee.country,
    region: nominee.region,
    photoUrl: photoUrl.startsWith("http") ? photoUrl : (photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`),
    imageType,
    status: nominee.status || "pending",
    isPlatinum: nominee.is_platinum || false,
    publicVotes: nominee.public_votes || 0,
    subcategoryName: nominee.subcategory_name || "Uncategorized",
    subcategorySlug: nominee.subcategory_slug || "uncategorized",
    categoryName: nominee.category_name || "General",
    categorySlug: nominee.category_slug || "general",
    geographicCategory: getGeographicCategory(nominee.region, nominee.category_name || null),
    achievement: nominee.bio || nominee.title || "",
  };
}

async function fetchNominees(): Promise<EnrichedDatabaseNominee[]> {
  // Fetch from public_nominees view (security-hardened, excludes PII)
  const { data: nominees, error: nomineesError } = await supabase
    .from("public_nominees")
    .select("*")
    .order("name");

  if (nomineesError) {
    console.error("Error fetching nominees:", nomineesError);
    throw nomineesError;
  }

  if (!nominees || nominees.length === 0) return [];

  // Get subcategory IDs to fetch category info
  const subcategoryIds = [...new Set(nominees.map(n => n.subcategory_id))];
  
  const { data: subcategories, error: subcatError } = await supabase
    .from("subcategories")
    .select(`
      id,
      name,
      slug,
      category_id,
      categories!inner (
        id,
        name,
        slug
      )
    `)
    .in("id", subcategoryIds);

  if (subcatError) {
    console.error("Error fetching subcategories:", subcatError);
  }

  // Build subcategory lookup map
  const subcatMap = new Map<string, { name: string; slug: string; categoryName: string; categorySlug: string }>();
  subcategories?.forEach((sc: any) => {
    subcatMap.set(sc.id, {
      name: sc.name,
      slug: sc.slug,
      categoryName: sc.categories?.name || "General",
      categorySlug: sc.categories?.slug || "general",
    });
  });

  // Transform nominees with category info
  return nominees.map((row: any) => {
    const subcatInfo = subcatMap.get(row.subcategory_id);
    
    const nominee: DatabaseNominee = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      title: row.title,
      bio: row.bio,
      organization: row.organization,
      country: row.country,
      region: row.region,
      photo_url: row.photo_url,
      logo_url: row.logo_url,
      status: row.status,
      is_platinum: row.is_platinum,
      public_votes: row.public_votes,
      subcategory_id: row.subcategory_id,
      season_id: row.season_id,
      subcategory_name: subcatInfo?.name,
      subcategory_slug: subcatInfo?.slug,
      category_name: subcatInfo?.categoryName,
      category_slug: subcatInfo?.categorySlug,
    };
    return enrichNominee(nominee);
  });
}

export function useNominees() {
  return useQuery({
    queryKey: ["nominees"],
    queryFn: fetchNominees,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Geographic grouping utilities
export function getNomineesByGeography(
  nominees: EnrichedDatabaseNominee[],
  category: GeographicCategory
): EnrichedDatabaseNominee[] {
  if (category === "all") return nominees;
  
  if (category === "africa-regions") {
    return nominees.filter(n => isAfricanRegion(n.geographicCategory));
  }
  
  return nominees.filter(n => n.geographicCategory === category);
}

export function getGeographicStats(nominees: EnrichedDatabaseNominee[]) {
  const stats = {
    total: nominees.length,
    africaRegions: 0,
    diaspora: 0,
    friendsOfAfrica: 0,
    byRegion: {} as Record<GeographicCategory, number>,
  };

  nominees.forEach(n => {
    stats.byRegion[n.geographicCategory] = (stats.byRegion[n.geographicCategory] || 0) + 1;
    
    if (isAfricanRegion(n.geographicCategory)) {
      stats.africaRegions++;
    } else if (n.geographicCategory === "diaspora") {
      stats.diaspora++;
    } else if (n.geographicCategory === "friends-of-africa") {
      stats.friendsOfAfrica++;
    }
  });

  return stats;
}

export function getCategoryOptions(nominees: EnrichedDatabaseNominee[]) {
  const categories = new Map<string, string>();
  nominees.forEach(n => {
    if (n.categorySlug && n.categoryName) {
      categories.set(n.categorySlug, n.categoryName);
    }
  });
  return Array.from(categories.entries()).map(([value, label]) => ({ value, label }));
}
