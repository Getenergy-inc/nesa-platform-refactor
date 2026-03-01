import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";

export type AwardType =
  | "PLATINUM_CERTIFICATE"
  | "GOLD_CERTIFICATE"
  | "BLUE_GARNET_AND_GOLD_CERTIFICATE"
  | "AFRICAN_ICON_BLUE_GARNET";

export interface CreateCertificatResponse {
  id: string;
  createdAt: string;
  userId: string;
  authCode: string;
  type: AwardType;
  yearOfIssuance: string;
  url: string;
  validTill: Date | null;
}

export const certificateApi = {
  generateCertificate: async (accessToken: string, award: AwardType) => {
    const res: ApiResponse<CreateCertificatResponse> = await apiRequest(
      `${API_BASE}/certificate?awardType=${award}`,
      {
        method: "POST",
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },
};
