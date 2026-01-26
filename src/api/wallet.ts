/**
 * NESA-Africa GFA Wallet API Client
 * 
 * API methods for wallet operations, payments, and withdrawals.
 */

import { api, type ApiResponse } from "./http";
import type {
  WalletAccount,
  WalletBalance,
  WalletLedgerEntry,
  PaymentIntent,
  WalletDashboardData,
  TopupRequest,
  TopupResponse,
} from "@/types/wallet";

// ============================================================================
// WALLET ACCOUNT
// ============================================================================

/**
 * Get the current user's wallet account
 * GET /wallet/me
 */
export async function getMyWallet(): Promise<ApiResponse<{ account: WalletAccount; balance: WalletBalance }>> {
  return api.get<{ account: WalletAccount; balance: WalletBalance }>("wallet", "/me");
}

/**
 * Get wallet balances (admin only)
 * GET /wallet/balances
 */
export async function getWalletBalances(): Promise<ApiResponse<WalletBalance[]>> {
  return api.get<WalletBalance[]>("wallet", "/balances");
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

interface TransactionsResponse {
  data: WalletLedgerEntry[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get paginated wallet transactions
 * GET /wallet/transactions?page=&limit=&type=
 */
export async function getWalletTransactions(
  page = 1,
  limit = 20,
  type?: string
): Promise<ApiResponse<WalletLedgerEntry[]>> {
  const params: Record<string, string | number> = { page, limit };
  if (type) params.type = type;
  return api.get<WalletLedgerEntry[]>("wallet", "/transactions", params);
}

// ============================================================================
// TOP-UP
// ============================================================================

/**
 * Initialize a top-up payment
 * POST /wallet/topup/init
 */
export async function initTopup(request: TopupRequest): Promise<ApiResponse<TopupResponse>> {
  return api.post<TopupResponse>("wallet", "/topup/init", request);
}

/**
 * Get payment intent by ID
 */
export async function getPaymentIntent(paymentId: string): Promise<ApiResponse<{ payment: PaymentIntent }>> {
  return api.get<{ payment: PaymentIntent }>("wallet", `/payments/${paymentId}`);
}

// ============================================================================
// WITHDRAWALS
// ============================================================================

interface WithdrawRequestPayload {
  amount_agc: number;
  destination: string;
}

interface WithdrawResponse {
  request_id: string;
  status: string;
  amount_agc: number;
}

/**
 * Request a withdrawal
 * POST /wallet/withdraw/request
 */
export async function requestWithdrawal(
  payload: WithdrawRequestPayload
): Promise<ApiResponse<WithdrawResponse>> {
  return api.post<WithdrawResponse>("wallet", "/withdraw/request", payload);
}

/**
 * Approve a withdrawal (admin only)
 * POST /wallet/withdraw/approve
 */
export async function approveWithdrawal(
  requestId: string
): Promise<ApiResponse<{ approved: boolean; request_id: string }>> {
  return api.post<{ approved: boolean; request_id: string }>("wallet", "/withdraw/approve", { request_id: requestId });
}

/**
 * Reject a withdrawal (admin only)
 * POST /wallet/withdraw/reject
 */
export async function rejectWithdrawal(
  requestId: string,
  reason?: string
): Promise<ApiResponse<{ rejected: boolean; request_id: string; refunded_agc: number }>> {
  return api.post<{ rejected: boolean; request_id: string; refunded_agc: number }>(
    "wallet",
    "/withdraw/reject",
    { request_id: requestId, reason }
  );
}

// ============================================================================
// ADMIN OPERATIONS
// ============================================================================

export const walletAdmin = {
  /**
   * Get all wallet accounts
   * GET /wallet/admin/accounts
   */
  async listWallets(
    ownerType?: string,
    limit = 50,
    offset = 0
  ): Promise<ApiResponse<{ accounts: WalletAccount[]; total: number }>> {
    return api.get<{ accounts: WalletAccount[]; total: number }>(
      "wallet",
      "/admin/accounts",
      { owner_type: ownerType, limit, offset }
    );
  },

  /**
   * Credit a wallet (admin only)
   * POST /wallet/admin/credit
   */
  async creditWallet(
    accountId: string,
    agcAmount: number,
    entryType: string,
    description: string,
    options?: {
      usdAmount?: number;
      isWithdrawable?: boolean;
    }
  ): Promise<ApiResponse<WalletLedgerEntry>> {
    return api.post<WalletLedgerEntry>("wallet", "/admin/credit", {
      account_id: accountId,
      agc_amount: agcAmount,
      entry_type: entryType,
      description,
      usd_amount: options?.usdAmount,
      is_withdrawable: options?.isWithdrawable,
    });
  },

  /**
   * Debit a wallet (admin only)
   * POST /wallet/admin/debit
   */
  async debitWallet(
    accountId: string,
    agcAmount: number,
    entryType: string,
    description: string,
    options?: {
      usdAmount?: number;
    }
  ): Promise<ApiResponse<WalletLedgerEntry>> {
    return api.post<WalletLedgerEntry>("wallet", "/admin/debit", {
      account_id: accountId,
      agc_amount: agcAmount,
      entry_type: entryType,
      description,
      usd_amount: options?.usdAmount,
    });
  },

  /**
   * Get platform wallet
   * GET /wallet/admin/platform
   */
  async getPlatformWallet(): Promise<ApiResponse<{ account: WalletAccount; balance: WalletBalance }>> {
    return api.get<{ account: WalletAccount; balance: WalletBalance }>("wallet", "/admin/platform");
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format AGC amount with currency symbol
 */
export function formatAgc(amount: number): string {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AGC`;
}

/**
 * Format USD amount
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Get entry type display label
 */
export function getEntryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TOPUP: "Top Up",
    NOMINATION_FEE: "Nomination Fee",
    VOTE_FEE: "Voting Fee",
    DONATION: "Donation",
    TICKET: "Ticket Purchase",
    REFERRAL_BONUS: "Referral Bonus",
    AMBASSADOR_BONUS: "Ambassador Bonus",
    CHAPTER_BONUS: "Chapter Bonus",
    WITHDRAW_REQUEST: "Withdrawal Request",
    WITHDRAW_APPROVED: "Withdrawal Approved",
    ADJUSTMENT: "Adjustment",
  };
  return labels[type] || type;
}

/**
 * Check if entry type is a credit type
 */
export function isCredit(direction: string): boolean {
  return direction === "CREDIT";
}
