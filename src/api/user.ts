import { API_BASE } from "@/lib/apiBase";
import { apiRequest } from "./client";
import { ApiResponse } from "./http";
import { WalletDirection, WalletEntryType } from "@/types/wallet";

export interface UserDetails {
  email: string;
  role: string;
  id: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  gender: string | null;
  country: string;
  state: string | null;
  city: string | null;
  profilePic: string | null;
  dateOfBirth: string | null;
  address: string | null;
  wallet: {
    id: string;
    createdAt: Date;
    balance: number;
    walletTransactions: {
      id: string;
      walletId: string;
      transactionType: WalletEntryType;
      agcAmount: number;
      walletDirection: WalletDirection;
      createdAt: Date;
      updatedAt: Date;
    }[];
  } | null;
  localChapters:
    | {
        name: true;
        country: true;
        createdAt: true;
        chapterLeader: true;
      }[]
    | null;
}
export interface UpdateUserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string | null;
  dateOfBirth: string | null;
  profilePic: string | null;
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
}

export const userApi = {
  fetchUserDetails: async (accessToken: string) => {
    const res: ApiResponse<UserDetails> = await apiRequest(
      `${API_BASE}/user/`,
      {
        method: "GET",
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  updateUserProfile: async (
    accessToken: string,
    userDetails: UpdateUserDetails,
  ) => {
    await apiRequest(`${API_BASE}/user`, {
      method: "POST",
      accessToken,
      credentials: "include",
      body: JSON.stringify(userDetails),
    });
  },
};
