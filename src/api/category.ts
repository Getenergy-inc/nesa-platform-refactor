import { API_BASE } from "@/lib/apiBase";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import { CategoryScope } from "@/config/nesaCategories";
import { Subcategory } from "@/lib/nesaData";

export interface Category {
  id: string;
  title: string;
  description: string;
  awardType: string;
  image: string | null;
  scope: CategoryScope;
  subCategories: Subcategory[];
}
export type AwardType =
  | "AFRICA_ICON_BLUE_GARNET"
  | "BLUE_GARNET_AND_GOLD_CERTIFICATE"
  | "PLATINUM_CERTIFICATE"
  | "GOLD_CERTIFICATE"
  | "GOLD_SPECIAL";
export type SubCategory = Omit<Category, "awardType">;

export const categoryApi = {
  fetchAllCategories: async (accessToken: string) => {
    const res: ApiResponse<Category[]> = await apiRequest(
      `${API_BASE}/category/all`,
      {
        credentials: "include",
        accessToken,
        method: "GET",
      },
    );
    return res.data;
  },

  fetchSubcategories: async (accessToken: string, categoryId: string) => {
    const res: ApiResponse<SubCategory[]> = await apiRequest(
      `${API_BASE}/category/sub/all?categoryId=${categoryId}`,
      {
        credentials: "include",
        accessToken,
        method: "GET",
      },
    );
    return res.data;
  },

  fetchCategoriesByTier: async (accessToken: string, tier: AwardType) => {
    const res: ApiResponse<Category[]> = await apiRequest(
      `${API_BASE}/category/tier?tier=${tier}`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },
};
