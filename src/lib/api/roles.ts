/**
 * Bidirectional mapping between the public API role enum (UserRole, used by
 * the OpenAPI contract) and the smaller AppRole enum used inside the
 * Supabase database (`user_roles.role`).
 *
 * Used by the new client to translate roles when reading/writing through
 * either layer without losing fidelity.
 */
import type { AppRole } from "@/config/roles";
import type { UserRole } from "@/types/api/auth";

export const PUBLIC_TO_DB: Record<UserRole, AppRole> = {
  SUPER_ADMIN: "admin",
  ADMIN: "admin",
  OPERATIONS_MANAGER: "admin",
  PROGRAM_MANAGER: "admin",
  NOMINEE: "user",
  NOMINATOR: "user",
  JUDGE: "jury",
  HEAD_JUDGE: "jury",
  VOTER: "user",
  CHAPTER_LEAD: "chapter",
  NRC_RESEARCHER: "nrc",
  PARTNER: "sponsor",
  SPONSOR: "sponsor",
  CSR_APPLICANT: "user",
  GLOBAL_PARTNER: "sponsor",
  DIGITAL_VOICE: "user",
  MEDIA_EDITOR: "admin",
  FINANCE_MANAGER: "admin",
};

/** Coarse — multiple public roles map to one DB role; default sensibly. */
export const DB_TO_PUBLIC: Record<AppRole, UserRole> = {
  admin: "ADMIN",
  user: "NOMINATOR",
  jury: "JUDGE",
  nrc: "NRC_RESEARCHER",
  chapter: "CHAPTER_LEAD",
  sponsor: "SPONSOR",
};

export const toDbRole = (r: UserRole): AppRole => PUBLIC_TO_DB[r];
export const toPublicRole = (r: AppRole): UserRole => DB_TO_PUBLIC[r];
