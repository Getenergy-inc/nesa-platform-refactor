import { http } from "./client";
import type { ListQuery } from "@/types/api/common";
import type { Nominee } from "@/types/api/domain";

export type NomineeListQuery = ListQuery & {
  categoryId?: string;
  region?: string;
  country?: string;
  status?: string;
};

export const nomineesApi = {
  listPublic: (q: NomineeListQuery = {}) => http.get<Nominee[]>("/nominees/public", q),
  getPublic: (slug: string) => http.get<Nominee>(`/nominees/public/${slug}`),
  me: () => http.get<Nominee>("/nominees/me"),
  updateMe: (body: Partial<Nominee>) => http.patch<Nominee>("/nominees/me", body),
  adminList: (q: NomineeListQuery = {}) => http.get<Nominee[]>("/nominees", q),
};
