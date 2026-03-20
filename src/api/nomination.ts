import { apiNoAuthRequest, apiRequest } from "./client";
import { Nomination } from "@/pages/Nominate";
import { ApiResponse } from "./http";
import { approveNomination, assignNomination, rejectNomination } from "./nrc";
import { AcceptanceStatus, acceptNomination } from "./nominations";
import { NominationDashboardItem } from "@/types/nominee_dashboard";
import { API_BASE } from "@/lib/apiBase";
import { AwardType } from "./category";
import { NomineeProfileData } from "@/pages/NomineeProfile";

export interface NominationDetails {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  evidenceUrl: string[];
  appproved: string;
  accepted: AcceptanceStatus;
  nominationLinkExpiresAt: Date | null;
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  token: string | null;
  createdAt: Date;
  yearOfNomination: string;
  renominationCount: number;
  nominee: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  category: {
    id: string;
    title: string;
    description: string;
  };
  subCategory: {
    id: string;
    title: string;
    description: string;
    renominationCount: number;
  };
}
export interface NominatorNomination {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  evidenceUrl: string[];
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  nominationCount: number;
  categoryAwardType: string;
  approved: ApprovalState;
  createdAt: string;
  updatedAt: string;
}

export interface updateNomination {
  phone?: string | null | undefined;
  linkedInProfile?: string | null | undefined;
  website?: string | null | undefined;
  profileImage?: string | null | undefined;
  accountType?: "INDIVIDUAL" | "ORGANIZATION";
  yearOfNomination?: string | undefined;
  country?: string | undefined;
  stateRegion?: string | undefined;
  impactSummary?: string | undefined;
  achievementDescription?: string | undefined;
  evidenceUrl?: string[] | undefined;
  id: string;
  fullName: string;
}
export interface pendingNominationResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  evidenceUrl: string[];
  appproved: string;
  accepted: string;
  createdAt: Date;
  yearOfNomination: string;
  nominee: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  category: {
    id: string;
    title: string;
    description: string;
  };
  subCategory: {
    id: string;
    title: string;
    description: string;
  };
}

export interface assignednominationsResponse {
  createdAt: string;
  status: string;
  nominationId: string;
  assignedTo: { id: string; name: string }[];
  fullName: string;
  priority: number;
  dueDate: string | null;
  notes: string | null;
}
export type ApprovalState = "PENDING" | "APPROVED" | "REJECTED";
export interface ApprovedNominees {
  fullName: string;
  email: string;
  phone: string | null;
  linkedInProfile: string | null;
  website: string | null;
  profileImage: string | null;
  accountType: "INDIVIDUAL" | "ORGANIZATION";
  country: string;
  stateRegion: string;
  impactSummary: string;
  achievementDescription: string;
  evidenceUrl: string[];
  id: string;
  categoryId: string; // The ID of the category this nominee belongs to
  categoryName: string; // The title of that category (for display)
  subCategoryId: string; // The ID of the subcategory this nominee belongs to
  subCategoryName: string;
  nominationCount: number;
  categoryAwardType: string;
}

export interface AINominationResponse {
  score: number;
  recommendation: "approve" | "manual_review" | "reject";
  reasons: string[];
  flags: {
    spamLike: boolean;
    insufficientEvidence: boolean;
    categoryMismatch: boolean;
    inconsistentClaims: boolean;
  };
  verificationRequired: string[];
}

export const nominationApi = {
  createNomination: async (accessToken: string, nomination: Nomination) => {
    await apiRequest(`${API_BASE}/nomination`, {
      credentials: "include",
      accessToken,
      method: "POST",
      body: JSON.stringify(nomination),
    });
  },
  fetchPendingNominations: async (accessToken: string) => {
    const res: ApiResponse<pendingNominationResponse[]> = await apiRequest(
      `${API_BASE}/nomination/pending`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },

  fetchAssignedNominations: async (accessToken: string) => {
    const res: ApiResponse<assignednominationsResponse[]> = await apiRequest(
      `${API_BASE}/nomination/assigned`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },

  aiReview: async (accessToken: string, nominationId: string) => {
    const res: ApiResponse<AINominationResponse> = await apiRequest(
      `${API_BASE}/nomination/review/ai?nominationId=${nominationId}`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },
  approveNomination: async (
    accessToken: string,
    nominationId: string,
    notes: string | null,
  ) => {
    await apiRequest(
      `${API_BASE}/nomination/approve?nominationId=${nominationId}`,
      {
        method: "PUT",
        credentials: "include",
        accessToken,
        body: JSON.stringify({ notes }),
      },
    );
  },
  disqualifyNomination: async (
    accessToken: string,
    nominationId: string,
    notes: string | null,
  ) => {
    await apiRequest(
      `${API_BASE}/nomination/disqualify?nominationId=${nominationId}`,
      {
        method: "PUT",
        credentials: "include",
        accessToken,
        body: JSON.stringify({ notes }),
      },
    );
  },

  validateLink: async (nominationId: string, nominationToken: string) => {
    const res = await fetch(
      `${API_BASE}/nomination/validatelink?nominationId=${nominationId}&nominationToken=${nominationToken}`,
      {
        credentials: "include",
      },
    );
    const data: ApiResponse<{
      nomineeName: string;
      nomineeEmail: string;
      nomineeCountry: string;
      nomineeState: string;
      nomineePhone: string;
    }> = await res.json();
    return data.data;
  },

  fetchNominationDetails: async (accessToken: string, nominationId: string) => {
    const res: ApiResponse<NominationDetails> = await apiRequest(
      `${API_BASE}/nomination?nominationId=${nominationId}`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  acceptNomination: async (accessToken: string, nominationId: string) => {
    await apiRequest(
      `${API_BASE}/nomination/accept?nominationId=${nominationId}`,
      {
        credentials: "include",
        accessToken,
        method: "PUT",
      },
    );
  },

  rejectNomination: async (accessToken: string, nominationId: string) => {
    await apiRequest(
      `${API_BASE}/nomination/reject?nominationId=${nominationId}`,
      {
        credentials: "include",
        accessToken,
        method: "PUT",
      },
    );
  },

  fetchNomineeDashboardData: async (accessToken: string) => {
    const res: ApiResponse<NominationDashboardItem[]> = await apiRequest(
      `${API_BASE}/nomination/nominee/dashboard`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  updateNominationDetails: async (
    accessToken: string,
    nomination: updateNomination,
  ) => {
    const res: ApiResponse<NominationDetails> = await apiRequest(
      `${API_BASE}/nomination`,
      {
        method: "PUT",
        credentials: "include",
        accessToken,
        body: JSON.stringify(nomination),
      },
    );
    return res.data;
  },

  fetchSubCategoryNominees: async (subCategoryId: string) => {
    const res: ApiResponse<ApprovedNominees[]> = await apiNoAuthRequest(
      `${API_BASE}/nomination/subcategory?subCategoryId=${subCategoryId}`,
      {
        credentials: "include",
      },
    );
    return res.data;
  },

  fetchNomineesByTier: async (tier: AwardType) => {
    const res: ApiResponse<ApprovedNominees[]> = await apiNoAuthRequest(
      `${API_BASE}/nomination/tier?tier=${tier}`,
      {
        credentials: "include",
      },
    );
    return res.data;
  },

  renominate: async (accessToken: string, nominationId: string) => {
    await apiRequest(
      `${API_BASE}/nomination/renominate?nominationId=${nominationId}`,
      {
        accessToken,
        credentials: "include",
        method: "POST",
      },
    );
  },
  fetchNomineeProfile: async (nomineeId: string) => {
    const res: ApiResponse<NomineeProfileData> = await apiNoAuthRequest(
      `${API_BASE}/nomination/profile?nomineeId=${nomineeId}`,
      {
        credentials: "include",
      },
    );
    return res.data;
  },

  fetchNominatorNominations: async (accessToken: string) => {
    const res: ApiResponse<NominatorNomination[]> = await apiRequest(
      `${API_BASE}/nomination/nominator`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },
};
