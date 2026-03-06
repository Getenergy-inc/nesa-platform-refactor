import { API_BASE } from "@/contexts/AuthContext";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import { NRCReviewerRole } from "@/config/nrcConfig";
import { TeamInfo } from "@/components/nrc/TeamSection";

export type NominationQueueStatus =
  | "ASSIGNED"
  | "IN_REVIEW"
  | "COMPLETED"
  | "REASSIGNED";

export interface TeamInfoRes {
  team: {
    id: string;
    name: string;
    description: string;
  };
}

export interface PendingNrcResponse {
  user: {
    email: string;
    id: string;
    createdAt: Date;
    firstName: string | null;
    lastName: string | null;
    profilePic: string | null;
    role: string;
  };
}

export interface ApprovedNrcReponse extends PendingNrcResponse {
  role: string;
  approvedAt: Date | null;
}
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
export interface NrcDetail {
  id: string;
  approvedAt: Date | null;
  role: "NRC_REVIEWER" | "NRC_LEAD" | "NRC_AUDITOR";
  status: string;
  teamId: string | null;
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
  fetchNrcDetails: async (accessToken: string) => {
    const res: ApiResponse<NrcDetail> = await apiRequest(
      `${API_BASE}/nrc/details`,
      {
        accessToken,
        credentials: "include",
      },
    );
    return res.data;
  },
  removeTeamMember: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/member?userId=${userId}`, {
      credentials: "include",
      accessToken,
      method: "DELETE",
    });
  },
  fetchTeamInfo: async (accessToken: string) => {
    const res: ApiResponse<TeamInfoRes> = await apiRequest(
      `${API_BASE}/nrc/yourteamdetail`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data.team;
  },
  updateTeamInfo: async (accessToken: string, team: TeamInfo) => {
    await apiRequest(`${API_BASE}/nrc/team`, {
      method: "PUT",
      credentials: "include",
      accessToken,
      body: JSON.stringify({
        id: team.id,
        teamName: team.name,
        teamDescription: team.description,
      }),
    });
  },

  fetchPendingNrc: async (accessToken: string) => {
    const res: ApiResponse<PendingNrcResponse[]> = await apiRequest(
      `${API_BASE}/nrc/pending`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  fetchApprovedNrc: async (accessToken: string) => {
    const res: ApiResponse<ApprovedNrcReponse[]> = await apiRequest(
      `${API_BASE}/nrc/approved`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  approveNrc: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/approve?userId=${userId}`, {
      method: "PUT",
      credentials: "include",
      accessToken,
    });
  },

  removeNrc: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/remove?userId=${userId}`, {
      method: "PUT",
      credentials: "include",
      accessToken,
    });
  },
  makeLead: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/assignlead?userId=${userId}`, {
      method: "PUT",
      credentials: "include",
      accessToken,
    });
  },

  suspendNrc: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/suspend?userId=${userId}`, {
      credentials: "include",
      method: "PUT",
      accessToken,
    });
  },
  unSuspendNrc: async (accessToken: string, userId: string) => {
    await apiRequest(`${API_BASE}/nrc/unsuspend?userId=${userId}`, {
      credentials: "include",
      method: "PUT",
      accessToken,
    });
  },

  fetchSuspendedNrc: async (accessToken: string) => {
    const res: ApiResponse<ApprovedNrcReponse[]> = await apiRequest(
      `${API_BASE}/nrc/suspended`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },
};
