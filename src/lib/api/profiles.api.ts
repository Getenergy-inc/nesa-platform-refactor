import { http, uploadRequest } from "./client";
import type { AuthUser } from "@/types/api/auth";

export type UpdateProfilePayload = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  region: string;
  bio: string;
}>;

export const profilesApi = {
  me: () => http.get<AuthUser>("/profiles/me"),
  updateMe: (body: UpdateProfilePayload) => http.patch<AuthUser>("/profiles/me", body),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("avatar", file);
    return uploadRequest<{ avatarUrl: string }>("/profiles/me/avatar", fd);
  },
};
