/**
 * NESA-Africa API Client - Nominations Endpoints
 *
 * Nomination submission, acceptance, and status APIs.
 */

import api from "./http";

// ==========================================
// TYPES
// ==========================================

export type NominationSource = "START_MEMBER" | "NRC" | "PUBLIC";
export type AcceptanceStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface NominationPayload {
  nominee_name: string;
  nominee_email?: string;
  nominee_phone?: string;
  nominee_country?: string;
  nominee_title?: string;
  nominee_organization?: string;
  nominee_bio?: string;
  nominee_photo_url?: string;
  nominee_logo_url?: string;
  subcategory_id: string;
  justification: string;
  evidence_urls?: string[];
  source?: NominationSource;
}

export interface NominationResult {
  success: boolean;
  nomination_id: string;
  nominee_id: string;
  is_renomination: boolean;
  first_letter_sent: boolean;
}

export interface NomineeStatus {
  nominee_id: string;
  name: string;
  slug: string;
  acceptance_status: AcceptanceStatus;
  renomination_count: number;
  nrc_verified: boolean;
  certificate: {
    id: string;
    tier: string;
    download_locked: boolean;
    status: string;
    verification_code: string;
  } | null;
  progress_to_unlock: number;
  renominations_needed: number;
}

export interface AcceptanceResult {
  success: boolean;
  message: string;
  certificate_issued?: boolean;
  certificate_download_locked?: boolean;
  renominations_needed?: number;
}

export interface AcceptanceDetails {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  bio?: string;
  photo_url?: string;
  logo_url?: string;
  country?: string;
  region?: string;
  acceptance_status: AcceptanceStatus;
  is_expired: boolean;
  renomination_count: number;
  categories: Array<{
    category: string;
    subcategory: string;
    justification?: string;
  }>;
  primary_justification?: string;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Submit a new nomination
 */
export async function submitNomination(payload: NominationPayload) {
  return api.post<NominationResult>("nominations", "/", payload);
}

/**
 * Accept nomination (nominee response)
 */
export async function acceptNomination(token: string) {
  return api.post<AcceptanceResult>("nominations", "/accept", { token });
}

/**
 * Decline nomination (nominee response)
 */
export async function declineNomination(token: string, reason?: string) {
  return api.post<{ success: boolean; message: string }>(
    "nominations",
    "/decline",
    { token, reason },
  );
}

/**
 * Get nominee status (acceptance, renominations, certificate)
 */
export async function getNomineeStatus(nomineeId: string) {
  return api.get<NomineeStatus>("nominations", `/status/${nomineeId}`);
}

/**
 * Get nominee details for acceptance page (by token)
 */
export async function getAcceptanceDetails(token: string) {
  return api.get<AcceptanceDetails>("nominations", `/accept-details/${token}`);
}

export default {
  submit: submitNomination,
  accept: acceptNomination,
  decline: declineNomination,
  getStatus: getNomineeStatus,
  getAcceptanceDetails,
};
