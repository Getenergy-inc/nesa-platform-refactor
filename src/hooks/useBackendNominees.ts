import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import type { AwardTier } from "@/config/nesaCategories";
import { ApprovedNominees, nominationApi } from "@/api/nomination";
import { AwardType, categoryApi } from "@/api/category";

// This matches the GeographicCategory type from the component
type GeographicCategory =
  | "africa-regions"
  | "north-africa"
  | "west-africa"
  | "central-africa"
  | "east-africa"
  | "south-africa"
  | "diaspora"
  | "friends-of-africa";

// This is the shape of the data after transformation
export interface DisplayNominee {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  country: string;
  stateRegion: string;
  achievement: string;
  status: "approved" | "platinum" | "pending" | string;
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  geographicCategory: GeographicCategory;
  nominationCount: number;
  categoryAwardType: string;
}

// Helper function to determine geographic category based on country
function getGeographicCategory(country: string): GeographicCategory {
  // Define which countries belong to which African regions
  const northAfrica = [
    "Egypt",
    "Morocco",
    "Algeria",
    "Tunisia",
    "Libya",
    "Sudan",
  ];
  const westAfrica = [
    "Nigeria",
    "Ghana",
    "Senegal",
    "Ivory Coast",
    "Mali",
    "Burkina Faso",
    "Liberia",
    "Sierra Leone",
    "Guinea",
    "Benin",
    "Togo",
  ];
  const centralAfrica = [
    "Cameroon",
    "DRC",
    "Congo",
    "Gabon",
    "Central African Republic",
    "Chad",
    "Equatorial Guinea",
  ];
  const eastAfrica = [
    "Kenya",
    "Tanzania",
    "Uganda",
    "Ethiopia",
    "Rwanda",
    "Somalia",
    "Burundi",
    "South Sudan",
    "Eritrea",
    "Djibouti",
  ];
  const southAfrica = [
    "South Africa",
    "Zambia",
    "Zimbabwe",
    "Botswana",
    "Namibia",
    "Mozambique",
    "Angola",
    "Malawi",
    "Lesotho",
    "Eswatini",
  ];

  if (northAfrica.includes(country)) return "north-africa";
  if (westAfrica.includes(country)) return "west-africa";
  if (centralAfrica.includes(country)) return "central-africa";
  if (eastAfrica.includes(country)) return "east-africa";
  if (southAfrica.includes(country)) return "south-africa";

  // If country exists but not in Africa, it's diaspora
  if (country && country.trim() !== "") return "diaspora";

  // Default fallback
  return "africa-regions";
}

// Helper function to determine if a nominee is platinum
function isPlatinumNominee(nominee: ApprovedNominees): boolean {
  // You can implement your own logic here based on your business rules
  // For example, check if they've reached a certain number of votes or have a special status
  return false; // Default to false for now
}

// Helper function to determine nominee status
function getNomineeStatus(
  nominee: ApprovedNominees,
): "approved" | "platinum" | "pending" {
  // You can implement your own logic here
  // For now, return "approved" as default
  return "approved";
}
export function useNomineesByTier(tier: AwardTier) {
  return useQuery({
    queryKey: ["nominees", "tier", tier],
    queryFn: async () => {
      // Map your AwardTier to the backend AwardType
      const tierMap: Record<AwardTier, string> = {
        platinum: "PLATINUM_CERTIFICATE",
        gold: "GOLD_CERTIFICATE",
        "blue-garnet": "BLUE_GARNET_AND_GOLD_CERTIFICATE",
        icon: "AFRICA_ICON_BLUE_GARNET",
        "gold-special": "GOLD_SPECIAL",
      };

      const backendTier = tierMap[tier];

      // 1. Fetch all categories for this tier
      const categories = await categoryApi.fetchCategoriesByTier(
        backendTier as AwardType,
      );

      if (!categories || categories.length === 0) return [];

      // 2. Build a map of categoryId -> categoryName
      const categoryMap = new Map(categories.map((cat) => [cat.id, cat.title]));

      // 3. Fetch all nominees for all subcategories
      const allNominees: DisplayNominee[] = [];

      for (const category of categories) {
        // Fetch subcategories for this category
        const subcategories = await categoryApi.fetchSubcategories(category.id);

        for (const subcategory of subcategories) {
          // Fetch nominees for this subcategory
          const nominees = await nominationApi.fetchSubCategoryNominees(
            subcategory.id,
          );

          // Transform nominees with the correct category and subcategory info
          const transformed = nominees.map((nominee) => {
            const achievement = [
              nominee.impactSummary || "",
              nominee.achievementDescription || "",
            ]
              .filter(Boolean)
              .join(" ")
              .trim();

            const geographicCategory = getGeographicCategory(
              nominee.country || "",
            );

            return {
              id: nominee.id,
              name: nominee.fullName,
              categoryId: category.id,
              categoryName: category.title,
              subCategoryId: subcategory.id,
              subCategoryName: subcategory.title,
              country: nominee.country || "",
              stateRegion: nominee.stateRegion || "",
              achievement: achievement,
              status: "approved", // Set based on your logic
              isPlatinum: false, // Set based on your logic
              publicVotes: 0, // Set based on your logic
              profileImage: nominee.profileImage || null,
              accountType: nominee.accountType || "INDIVIDUAL",
              geographicCategory: geographicCategory,
              nominationCount: nominee.nominationCount,
              categoryAwardType: nominee.categoryAwardType,
            };
          });

          allNominees.push(...transformed);
        }
      }

      return allNominees;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Alternative version if you need to fetch nominees for all subcategories of a tier
export function useNomineesByTierAlternative(tier: AwardTier) {
  const { data: categories } = useQuery({
    queryKey: ["categories", "tier", tier],
    queryFn: async () => {
      // You need to create this endpoint
      const tierMap: Record<AwardTier, AwardType> = {
        platinum: "PLATINUM_CERTIFICATE",
        gold: "GOLD_CERTIFICATE",
        "blue-garnet": "BLUE_GARNET_AND_GOLD_CERTIFICATE",
        icon: "AFRICA_ICON_BLUE_GARNET",
        "gold-special": "GOLD_SPECIAL",
      };
      const backendTier = tierMap[tier];
      const response = await categoryApi.fetchCategoriesByTier(backendTier);
      return response;
    },
  });

  return useQuery({
    queryKey: ["nominees", "tier", tier, "alternative"],
    queryFn: async () => {
      if (!categories) throw new Error("No categories");

      // Fetch nominees for all subcategories of all categories in this tier
      const allNominees: DisplayNominee[] = [];

      for (const category of categories) {
        // Fetch subcategories for this category
        const subcategories = await categoryApi.fetchSubcategories(category.id);

        for (const subcategory of subcategories) {
          // Fetch nominees for this subcategory
          const nominees = await nominationApi.fetchSubCategoryNominees(
            subcategory.id,
          );

          // Transform and add to allNominees
          const transformed = nominees.map((nominee: any) => {
            const achievement = [
              nominee.impactSummary || "",
              nominee.achievementDescription || "",
            ]
              .filter(Boolean)
              .join(" ")
              .trim();

            const geographicCategory = getGeographicCategory(
              nominee.country || "",
            );

            return {
              id: nominee.id,
              name: nominee.fullName,
              categoryId: category.id,
              categoryName: category.title,
              subCategoryId: subcategory.id,
              subCategoryName: subcategory.title,
              country: nominee.country || "",
              stateRegion: nominee.stateRegion || "",
              achievement: achievement,
              status: getNomineeStatus(nominee),
              isPlatinum: isPlatinumNominee(nominee),
              publicVotes: 0,
              profileImage: nominee.profileImage || null,
              accountType: nominee.accountType || "INDIVIDUAL",
              geographicCategory: geographicCategory,
            };
          });

          allNominees.push(...transformed);
        }
      }

      return allNominees;
    },
    enabled: !!categories,
    staleTime: 1000 * 60 * 5,
  });
}
