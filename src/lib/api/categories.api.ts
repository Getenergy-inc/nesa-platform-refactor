import { http } from "./client";
import type { Category } from "@/types/api/domain";
import type { ListQuery } from "@/types/api/common";

export type CategoryListQuery = ListQuery & {
  seasonId?: string;
  type?: string;
  region?: string;
  status?: string;
};

export const categoriesApi = {
  list: (q: CategoryListQuery = {}) => http.get<Category[]>("/categories", q),
  getBySlug: (slug: string) => http.get<Category>(`/categories/${slug}`),
  create: (body: Omit<Category, "id">) => http.post<Category>("/categories", body),
  update: (id: string, body: Partial<Category>) => http.patch<Category>(`/categories/${id}`, body),
  remove: (id: string) => http.del<null>(`/categories/${id}`),
};
