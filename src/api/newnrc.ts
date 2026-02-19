import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import { NRCReviewerRole } from "@/config/nrcConfig";

export type NominationQueueStatus =
  | "ASSIGNED"
  | "IN_REVIEW"
  | "COMPLETED"
  | "REASSIGNED";
export interface NominationQueueResponse {
  nomination: {
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
    accountType: string;
    createdAt: string;
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
    nominationQueues: {
      id: string;
      assignedTo: string[];
      priority: number;
      dueDate: string | null;
      notes: string | null;
      status: NominationQueueStatus;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}
export interface NoTeamVolunteersResponse {
  id: string;
  approvedAt: string | null;
  role: string;
  status: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string;
    profilePic: string | null;
    accountType: string;
    country: string;
    state: string | null;
    city: string | null;
    address: string | null;
  };
}

export interface NrcTeamMembersResponse {
  teamId: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string;
    profilePic: string | null;
  };
}

export interface NominationReviewers {
  nominationId: string;
  reviewersIds: string[];
  queue: NominationQueue;
}

export interface NominationQueue {
  priority: number;
  dueDate: Date;
  notes: string | null;
}
export interface TeamInvite {
  inviteeEmail: string;
  inviteeId: string;
  inviteeName: string;
}

export const nrcApi = {
  fetchQueue: async (accessToken: string) => {
    const res: ApiResponse<NominationQueueResponse[]> = await apiRequest(
      `${API_BASE}/nrc/assignednominations`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  createTeam: async (
    accessToken: string,
    teamName: string,
    teamDescription: string,
  ) => {
    await apiRequest(`${API_BASE}/nrc/team`, {
      method: "POST",
      accessToken,
      credentials: "include",
      body: JSON.stringify({
        teamName,
        teamDescription,
      }),
    });
  },

  fetchNonTeamVolunteers: async (accessToken: string) => {
    const res: ApiResponse<NoTeamVolunteersResponse[]> = await apiRequest(
      `${API_BASE}/nrc/noteam`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },

  fetchTeamMembers: async (accessToken: string) => {
    const res: ApiResponse<NrcTeamMembersResponse[]> = await apiRequest(
      `${API_BASE}/nrc/yourteam`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },
  assignNomination: async (
    accessToken: string,
    payload: NominationReviewers,
  ) => {
    await apiRequest(`${API_BASE}/nrc/assign`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
      accessToken,
    });
  },

  inviteToTeam: async (accessToken: string, payload: TeamInvite) => {
    await apiRequest(`${API_BASE}/nrc/team/invite`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
      accessToken,
    });
  },

  verifyInviteToken: async (
    accessToken: string,
    token: string,
    teamId: string,
  ) => {
    const res: ApiResponse<{ name: string; description: string }> =
      await apiRequest(
        `${API_BASE}/nrc/team/verifytoken?token=${token}&teamId=${teamId}`,
        {
          credentials: "include",
          accessToken,
        },
      );
    return res.data;
  },

  acceptTeamInvite: async (accessToken: string, teamId: string) => {
    await apiRequest(`${API_BASE}/nrc/team/acceptinvitation?teamId=${teamId}`, {
      credentials: "include",
      accessToken,
    });
  },
};
