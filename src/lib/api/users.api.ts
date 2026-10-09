import { http } from "./client";
import type { AuthUser, UserRole } from "@/types/api/auth";
import type { ListQuery } from "@/types/api/common";

export type UserListQuery = ListQuery & { role?: UserRole; status?: string };

export const usersApi = {
  list: (q: UserListQuery = {}) => http.get<AuthUser[]>("/users", q),
  get: (id: string) => http.get<AuthUser>(`/users/${id}`),
  update: (id: string, body: Partial<AuthUser>) => http.patch<AuthUser>(`/users/${id}`, body),
  remove: (id: string) => http.del<null>(`/users/${id}`),
  assignRole: (id: string, role: UserRole) =>
    http.patch<AuthUser>(`/users/${id}/role`, { role }),
};
