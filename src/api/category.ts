import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import { CategoryScope } from "@/config/nesaCategories";

export interface Category {
  id: string;
  title: string;
  description: string;
  awardType: string;
  image: string | null;
  scope: CategoryScope;
}

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
};
