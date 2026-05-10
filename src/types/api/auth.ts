/**
 * Canonical NESA Africa user roles.
 * Mirrors the OpenAPI spec. The Supabase DB currently uses a smaller subset
 * (admin, user, jury, nrc, chapter, sponsor); see src/lib/api/roles.ts for
 * the bidirectional mapping.
 */
export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OPERATIONS_MANAGER"
  | "PROGRAM_MANAGER"
  | "NOMINEE"
  | "NOMINATOR"
  | "JUDGE"
  | "HEAD_JUDGE"
  | "VOTER"
  | "CHAPTER_LEAD"
  | "NRC_RESEARCHER"
  | "PARTNER"
  | "SPONSOR"
  | "CSR_APPLICANT"
  | "GLOBAL_PARTNER"
  | "DIGITAL_VOICE"
  | "MEDIA_EDITOR"
  | "FINANCE_MANAGER";

export const ALL_ROLES: UserRole[] = [
  "SUPER_ADMIN", "ADMIN", "OPERATIONS_MANAGER", "PROGRAM_MANAGER",
  "NOMINEE", "NOMINATOR", "JUDGE", "HEAD_JUDGE", "VOTER",
  "CHAPTER_LEAD", "NRC_RESEARCHER", "PARTNER", "SPONSOR",
  "CSR_APPLICANT", "GLOBAL_PARTNER", "DIGITAL_VOICE",
  "MEDIA_EDITOR", "FINANCE_MANAGER",
];

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  avatarUrl?: string | null;
  createdAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = { email: string; password: string };

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
};
