import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { Nomination } from "@/pages/Nominate";
import { ApiResponse } from "./http";
import { approveNomination, assignNomination, rejectNomination } from "./nrc";
import { AcceptanceStatus, acceptNomination } from "./nominations";

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
};
