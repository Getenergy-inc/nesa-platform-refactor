import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  categoryApi,
  type Category,
  type AwardType,
  SubCategory,
} from "@/api/category";
import { useAuth } from "@/contexts/AuthContext";
import type { AwardTier } from "@/config/nesaCategories";
import { ApprovedNominees, nominationApi } from "@/api/nomination";

// Map your frontend AwardTier to backend AwardType
const tierToAwardTypeMap: Record<AwardTier, AwardType> = {
  platinum: "PLATINUM_CERTIFICATE",
  gold: "GOLD_CERTIFICATE",
  "blue-garnet": "BLUE_GARNET_AND_GOLD_CERTIFICATE",
  icon: "AFRICA_ICON_BLUE_GARNET",
  "gold-special": "GOLD_SPECIAL",
};
export interface CategoryPageData {
  category: Category;
  subcategories: (SubCategory & {
    nominees: ApprovedNominees[];
    nomineeCount: number;
  })[];
}

interface UseCategoriesOptions {
  enabled?: boolean;
}

// Extended Category type with computed properties for UI
export interface CategoryWithMetadata extends Category {
  subcategoryCount: number;
  // Add any other computed fields you need
}

export function useCategoriesByTier(
  tier: AwardTier,
  options: UseCategoriesOptions = {},
) {
  if (tier == "gold") {
    tier = "blue-garnet";
  }
  const awardType = tierToAwardTypeMap[tier];

  return useQuery({
    queryKey: ["categories", "tier", tier],
    queryFn: async () => {
      const categories = await categoryApi.fetchCategoriesByTier(awardType);

      // Add metadata to each category
      const categoriesWithMetadata: CategoryWithMetadata[] = (
        categories || []
      ).map((cat) => ({
        ...cat,
        subcategoryCount: cat.subCategories?.length || 0,
      }));

      return categoriesWithMetadata;
    },
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAllCategories(options: UseCategoriesOptions = {}) {
  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      const categories = await categoryApi.fetchAllCategories();

      // Add metadata to each category
      const categoriesWithMetadata: CategoryWithMetadata[] = (
        categories || []
      ).map((cat) => ({
        ...cat,
        subcategoryCount: cat.subCategories?.length || 0,
      }));

      return categoriesWithMetadata;
    },
    enabled: options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategory(
  categoryId: string | null,
  options: UseCategoriesOptions = {},
) {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;

      const allCategories = await categoryApi.fetchAllCategories();
      const category = allCategories.find((c) => c.id === categoryId);

      if (!category) return null;

      // Add metadata
      return {
        ...category,
        subcategoryCount: category.subCategories?.length || 0,
      } as CategoryWithMetadata;
    },
    enabled: !!categoryId && options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubcategories(
  categoryId: string | null,
  options: UseCategoriesOptions = {},
) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const subcategories = await categoryApi.fetchSubcategories(categoryId);

      return subcategories || [];
    },
    enabled: !!categoryId && options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

// Helper hook to get all categories grouped by tier
export function useCategoriesGrouped() {
  const { data: allCategories, isLoading, error } = useAllCategories();

  const grouped = useMemo(() => {
    if (!allCategories) return null;

    const grouped = {
      blueGarnet: [] as Category[],
      platinum: [] as Category[],
      lifetime: [] as Category[],
      goldSpecial: [] as Category[],
    };

    allCategories.forEach((category) => {
      // Map backend awardType to visual tiers
      switch (category.awardType) {
        case "BLUE_GARNET_AND_GOLD_CERTIFICATE":
          grouped.blueGarnet.push(category);
          break;
        case "PLATINUM_CERTIFICATE":
          grouped.platinum.push(category);
          break;
        case "AFRICA_ICON_BLUE_GARNET":
          grouped.lifetime.push(category);
          break;
        case "GOLD_SPECIAL":
          grouped.goldSpecial.push(category);
          break;
        case "GOLD_CERTIFICATE":
          // Gold certificate might go to blue garnet or have its own group
          // Adjust based on your business logic
          grouped.blueGarnet.push(category);
          break;
        default:
          // Default to platinum if no match
          grouped.platinum.push(category);
      }
    });

    return grouped;
  }, [allCategories]);

  return {
    grouped,
    isLoading,
    error,
    allCategories,
  };
}

export function useCategoryPage(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["category-page", categoryId],
    queryFn: async () => {
      if (!categoryId) throw new Error("Category ID is required");

      // 1. Fetch all categories and find the one we need
      // Alternatively, you could create a dedicated endpoint: /category/:id
      const category = await categoryApi.fetchCategory(categoryId);

      if (!category) {
        throw new Error("Category not found");
      }

      // 2. Fetch subcategories for this category
      const subcategories = await categoryApi.fetchSubcategories(categoryId);

      // 3. Fetch nominees for each subcategory
      const subcategoriesWithNominees = await Promise.all(
        subcategories.map(async (sub) => {
          const nominees = await nominationApi.fetchSubCategoryNominees(sub.id);
          return {
            ...sub,
            nominees: nominees || [],
            nomineeCount: nominees?.length || 0,
          };
        }),
      );

      return {
        category,
        subcategories: subcategoriesWithNominees,
      };
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
