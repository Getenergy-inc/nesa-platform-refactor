/**
 * NESA-Africa API Client - Certificates Endpoints
 * 
 * Certificate issuance, verification, and management.
 */

import api from "./http";

// ==========================================
// TYPES
// ==========================================

export interface Certificate {
  id: string;
  tier: "platinum" | "gold" | "blue_garnet" | "icon";
  verificationCode: string;
  issuedAt: string;
  expiresAt: string | null;
  isLifetime: boolean;
  isExpired?: boolean;
  downloadUrl?: string | null;
  nominee: {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    organization: string | null;
    photo_url: string | null;
  };
  season: {
    id: string;
    name: string;
    year: number;
  };
}

export interface VerificationResult {
  valid: boolean;
  certificate?: Certificate;
  error?: string;
}

export interface IssueCertificatePayload {
  nomineeId: string;
  tier: "platinum" | "gold" | "blue_garnet" | "icon";
  isLifetime?: boolean;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Verify certificate by code (public endpoint)
 */
export async function verify(code: string) {
  return api.get<VerificationResult>("certificates", `/verify/${code}`);
}

/**
 * Get user's certificates
 */
export async function getMyCertificates() {
  return api.get<{ data: Certificate[] }>("certificates", "/me");
}

/**
 * Get certificate by ID
 */
export async function getById(id: string) {
  return api.get<Certificate>("certificates", `/${id}`);
}

// Admin endpoints
export const certificatesAdmin = {
  /**
   * Issue new certificate (admin only)
   */
  async issue(payload: IssueCertificatePayload) {
    return api.post<{ success: boolean; certificate: any }>("certificates", "/issue", payload);
  },

  /**
   * Renew certificate (admin only)
   */
  async renew(certificateId: string) {
    return api.post<{ success: boolean; certificate: any }>(
      "certificates",
      `/${certificateId}/renew`,
      {}
    );
  },
};

export default {
  verify,
  getMyCertificates,
  getById,
  admin: certificatesAdmin,
};
