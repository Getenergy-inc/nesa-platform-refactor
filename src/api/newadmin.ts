import { API_BASE } from "@/lib/apiBase";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import {
  CreateCategoryPayload,
  CreateSubcategoryPayload,
  UpdateCategoryPayload,
  UpdateSubcategoryPayload,
} from "@/pages/admin/ManageCategories";

export interface EditionBase {
  key: string;
  name: string;
  displayYear: string;
  ceremonyYear: string;
  tagline: string;
  theme: string;
  nominationsOpen: Date;
  nominationsClose: Date;
  votingOpen: Date;
  votingClose: Date;
  ceremonyDate: Date;
  isActive: boolean;
  id: string;
}

export interface CreateEdition extends Omit<EditionBase, "id"> {}
export type UpdateEdition = EditionBase;
export type EditionResponse = EditionBase;

export const adminApi = {
  fetchEditions: async (accessToken: string) => {
    const res: ApiResponse<EditionResponse[]> = await apiRequest(
      `${API_BASE}/admin/edition/all`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },

  createEdition: async (accessToken: string, payload: CreateEdition) => {
    await apiRequest(`${API_BASE}/admin/edition`, {
      method: "POST",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },

  updateEdition: async (accessToken: string, payload: UpdateEdition) => {
    await apiRequest(`${API_BASE}/admin/edition`, {
      method: "PUT",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },

  activateEdition: async (accessToken: string, id: string) => {
    await apiRequest(`${API_BASE}/admin/edition/active?id=${id}`, {
      accessToken,
      credentials: "include",
      method: "PUT",
    });
  },

  createCategory: async (
    accessToken: string,
    payload: CreateCategoryPayload,
  ) => {
    await apiRequest(`${API_BASE}/category`, {
      method: "POST",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },

  updateCategory: async (
    accessToken: string,
    payload: UpdateCategoryPayload,
  ) => {
    await apiRequest(`${API_BASE}/category`, {
      method: "PUT",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },

  createSubCategory: async (
    accessToken: string,
    payload: CreateSubcategoryPayload,
  ) => {
    await apiRequest(`${API_BASE}/category/sub`, {
      method: "POST",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },
  updateSubCategory: async (
    accessToken: string,
    payload: UpdateSubcategoryPayload,
  ) => {
    await apiRequest(`${API_BASE}/category`, {
      method: "PUT",
      credentials: "include",
      accessToken,
      body: JSON.stringify(payload),
    });
  },

  deleteCategory: async (accessToken: string, id: string) => {
    await apiRequest(`${API_BASE}/category?categoryId=${id}`, {
      method: "DELETE",
      credentials: "include",
      accessToken,
    });
  },

  deleteSubCategory: async (accessToken: string, id: string) => {
    await apiRequest(`${API_BASE}/category/sub`, {
      method: "DELETE",
      credentials: "include",
      accessToken,
    });
  },
};
