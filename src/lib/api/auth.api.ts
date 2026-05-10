import { http, tokenStore } from "./client";
import type { AuthUser, AuthTokens, LoginPayload, RegisterPayload } from "@/types/api/auth";

export const authApi = {
  register: (payload: RegisterPayload) =>
    http.post<{ user: AuthUser } & AuthTokens>("/auth/register", payload),

  login: async (payload: LoginPayload) => {
    const res = await http.post<{ user: AuthUser } & AuthTokens>("/auth/login", payload);
    if (res.data?.accessToken) tokenStore.set(res.data.accessToken, res.data.refreshToken);
    return res;
  },

  refresh: async () => {
    const refreshToken = tokenStore.getRefresh();
    const res = await http.post<AuthTokens>("/auth/refresh", { refreshToken });
    if (res.data?.accessToken) tokenStore.set(res.data.accessToken, res.data.refreshToken);
    return res;
  },

  logout: async () => {
    try { await http.post<null>("/auth/logout"); } finally { tokenStore.clear(); }
  },

  me: () => http.get<AuthUser>("/auth/me"),

  forgotPassword: (email: string) => http.post<null>("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    http.post<null>("/auth/reset-password", { token, password }),
  verifyEmail: (token: string) => http.post<null>("/auth/verify-email", { token }),
};
