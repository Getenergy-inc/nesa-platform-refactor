import { http } from "./client";
import type { CastVotePayload, VoteReceipt, Nominee, Category } from "@/types/api/domain";

export const votingApi = {
  getCategories: () => http.get<Category[]>("/voting/categories"),
  getNomineesByCategory: (categoryId: string) =>
    http.get<Nominee[]>(`/voting/categories/${categoryId}/nominees`),
  castVote: (body: CastVotePayload) => http.post<VoteReceipt>("/voting/votes", body),
  verifyVote: (receiptCode: string) => http.post<VoteReceipt>("/voting/verify", { receiptCode }),
  myReceipts: () => http.get<VoteReceipt[]>("/voting/my-receipts"),
  results: (q: { categoryId?: string; region?: string; country?: string } = {}) =>
    http.get<unknown>("/voting/results", q),
};
