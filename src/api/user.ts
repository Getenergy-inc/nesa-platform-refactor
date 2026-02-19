import { API_BASE } from "@/contexts/AuthContext";
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
};
