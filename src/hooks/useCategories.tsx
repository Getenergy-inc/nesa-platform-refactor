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
  const { accessToken } = useAuth();
  const awardType = tierToAwardTypeMap[tier];

  return useQuery({
    queryKey: ["categories", "tier", tier],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const categories = await categoryApi.fetchCategoriesByTier(
        accessToken,
        awardType,
      );

      // Add metadata to each category
      const categoriesWithMetadata: CategoryWithMetadata[] = (
        categories || []
      ).map((cat) => ({
        ...cat,
        subcategoryCount: cat.subCategories?.length || 0,
      }));

      return categoriesWithMetadata;
    },
    enabled: !!accessToken && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAllCategories(options: UseCategoriesOptions = {}) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const categories = await categoryApi.fetchAllCategories(accessToken);

      // Add metadata to each category
      const categoriesWithMetadata: CategoryWithMetadata[] = (
        categories || []
      ).map((cat) => ({
        ...cat,
        subcategoryCount: cat.subCategories?.length || 0,
      }));

      return categoriesWithMetadata;
    },
    enabled: !!accessToken && options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategory(
  categoryId: string | null,
  options: UseCategoriesOptions = {},
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      if (!accessToken) throw new Error("No access token");

      const allCategories = await categoryApi.fetchAllCategories(accessToken);
      const category = allCategories.find((c) => c.id === categoryId);

      if (!category) return null;

      // Add metadata
      return {
        ...category,
        subcategoryCount: category.subCategories?.length || 0,
      } as CategoryWithMetadata;
    },
    enabled: !!categoryId && !!accessToken && options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubcategories(
  categoryId: string | null,
  options: UseCategoriesOptions = {},
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      if (!categoryId) {
        throw new Error("Category ID is required");
      }

      const subcategories = await categoryApi.fetchSubcategories(
        accessToken,
        categoryId,
      );

      return subcategories || [];
    },
    enabled: !!accessToken && !!categoryId && options.enabled !== false,
    staleTime: 1000 * 60 * 5,
  });
}

// Helper hook to get all categories grouped by tier
export function useCategoriesGrouped() {
  const { data: allCategories, isLoading, error } = useAllCategories();

  const grouped = useMemo(() => {
    if (!allCategories) return null;

    const grouped = {
      platinum: [] as CategoryWithMetadata[],
      gold: [] as CategoryWithMetadata[],
      "blue-garnet": [] as CategoryWithMetadata[],
      icon: [] as CategoryWithMetadata[],
      "gold-special": [] as CategoryWithMetadata[],
    };

    allCategories.forEach((category) => {
      switch (category.awardType) {
        case "PLATINUM_CERTIFICATE":
          grouped.platinum.push(category);
          break;
        case "GOLD_CERTIFICATE":
          grouped.gold.push(category);
          break;
        case "BLUE_GARNET_AND_GOLD_CERTIFICATE":
          grouped["blue-garnet"].push(category);
          break;
        case "AFRICA_ICON_BLUE_GARNET":
          grouped.icon.push(category);
          break;
        case "GOLD_SPECIAL":
          grouped["gold-special"].push(category);
          break;
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
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["category-page", categoryId],
    queryFn: async () => {
      if (!accessToken) throw new Error("No access token");
      if (!categoryId) throw new Error("Category ID is required");

      // 1. Fetch all categories and find the one we need
      // Alternatively, you could create a dedicated endpoint: /category/:id
      const allCategories = await categoryApi.fetchAllCategories(accessToken);
      const category = allCategories.find((c) => c.id === categoryId);

      if (!category) {
        throw new Error("Category not found");
      }

      // 2. Fetch subcategories for this category
      const subcategories = await categoryApi.fetchSubcategories(
        accessToken,
        categoryId,
      );

      // 3. Fetch nominees for each subcategory
      const subcategoriesWithNominees = await Promise.all(
        subcategories.map(async (sub) => {
          const nominees = await nominationApi.fetchSubCategoryNominees(
            accessToken,
            sub.id,
          );
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
    enabled: !!accessToken && !!categoryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
