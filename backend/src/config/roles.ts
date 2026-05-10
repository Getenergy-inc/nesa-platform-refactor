/**
 * Canonical NESA Africa user roles.
 * Mirrored on the frontend at src/types/api/auth.ts and in docs/openapi.yaml.
 */
export const ROLES = [
  "SUPER_ADMIN", "ADMIN", "OPERATIONS_MANAGER", "PROGRAM_MANAGER",
  "NOMINEE", "NOMINATOR", "JUDGE", "HEAD_JUDGE", "VOTER",
  "CHAPTER_LEAD", "NRC_RESEARCHER", "PARTNER", "SPONSOR",
  "CSR_APPLICANT", "GLOBAL_PARTNER", "DIGITAL_VOICE",
  "MEDIA_EDITOR", "FINANCE_MANAGER",
] as const;

export type UserRole = (typeof ROLES)[number];

/** Hierarchy used by the `requireRole` middleware. Higher = more power. */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  VOTER: 1,
  NOMINATOR: 1,
  NOMINEE: 1,
  CSR_APPLICANT: 1,
  DIGITAL_VOICE: 1,
  PARTNER: 2,
  SPONSOR: 2,
  GLOBAL_PARTNER: 2,
  CHAPTER_LEAD: 3,
  NRC_RESEARCHER: 3,
  MEDIA_EDITOR: 3,
  JUDGE: 4,
  HEAD_JUDGE: 5,
  FINANCE_MANAGER: 6,
  PROGRAM_MANAGER: 6,
  OPERATIONS_MANAGER: 7,
  ADMIN: 9,
  SUPER_ADMIN: 10,
};
