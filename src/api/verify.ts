/**
 * NESA-Africa API Client - Verification Endpoints
 * 
 * Certificate verification and misuse reporting.
 */

import api from "./http";

// ==========================================
// TYPES
// ==========================================

export type CertificateVerificationStatus = "VALID" | "EXPIRED" | "REVOKED" | "NOT_FOUND";

export interface CertificateVerificationResult {
  valid: boolean;
  status: CertificateVerificationStatus;
  certificate?: {
    id: string;
    tier: string;
    serialNumber: string;
    verificationCode: string;
    issuedAt: string;
    expiresAt: string | null;
    isLifetime: boolean;
    isExpired: boolean;
    isRevoked: boolean;
    downloadLocked: boolean;
  };
  nominee?: {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    organization: string | null;
    photoUrl: string | null;
  };
  season?: {
    id: string;
    name: string;
    year: number;
  };
  issuer?: string;
  year?: number;
  error?: string;
}

export interface MisuseReportPayload {
  certificate_id?: string;
  verification_hash?: string;
  reporter_name?: string;
  reporter_email?: string;
  reason: string;
  evidence_urls?: string[];
}

export interface MisuseReportResult {
  success: boolean;
  report_id: string;
  message: string;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Verify certificate by code/hash (public endpoint)
 */
export async function verifyCertificate(hashOrCode: string) {
  return api.get<CertificateVerificationResult>("verify", `/${hashOrCode}`);
}

/**
 * Report certificate misuse
 */
export async function reportMisuse(payload: MisuseReportPayload) {
  return api.post<MisuseReportResult>("verify", "/misuse-report", payload);
}

export default {
  verify: verifyCertificate,
  reportMisuse,
};
