/**
 * NESA-Africa GFA Wallet API Client
 * 
 * API methods for wallet operations, payments, and referrals.
 */

import { api } from "./http";
import type {
  WalletAccount,
  WalletBalance,
  WalletLedgerEntry,
  PaymentIntent,
  Referral,
  ReferralEvent,
  WalletDashboardData,
  TopupRequest,
  TopupResponse,
  PaymentProvider,
} from "@/types/wallet";

// ============================================================================
// WALLET ACCOUNT
// ============================================================================

/**
 * Get the current user's wallet account
 */
export async function getMyWallet() {
  return api.get<{ account: WalletAccount; balance: WalletBalance }>("wallet", "/me");
}

/**
 * Get wallet dashboard data (account, balance, recent transactions, referral)
 */
export async function getWalletDashboard() {
  return api.get<WalletDashboardData>("wallet", "/dashboard");
}

/**
 * Get wallet by account ID (admin)
 */
export async function getWalletById(accountId: string) {
  return api.get<{ account: WalletAccount; balance: WalletBalance }>("wallet", `/${accountId}`);
}

// ============================================================================
// LEDGER ENTRIES
// ============================================================================

/**
 * Get ledger entries for the current user's wallet
 */
export async function getMyLedgerEntries(limit = 50, offset = 0) {
  return api.get<{ entries: WalletLedgerEntry[]; total: number }>(
    "wallet",
    "/ledger",
    { limit, offset }
  );
}

/**
 * Get ledger entries by entry type
 */
export async function getLedgerByType(entryType: string, limit = 50, offset = 0) {
  return api.get<{ entries: WalletLedgerEntry[]; total: number }>(
    "wallet",
    "/ledger",
    { entry_type: entryType, limit, offset }
  );
}

// ============================================================================
// PAYMENTS / TOP-UP
// ============================================================================

/**
 * Initialize a top-up payment
 */
export async function initTopup(request: TopupRequest) {
  return api.post<TopupResponse>("wallet", "/topup", request);
}

/**
 * Get payment intent by ID
 */
export async function getPaymentIntent(paymentId: string) {
  return api.get<{ payment: PaymentIntent }>("wallet", `/payments/${paymentId}`);
}

/**
 * Get payment history
 */
export async function getPaymentHistory(limit = 20, offset = 0) {
  return api.get<{ payments: PaymentIntent[]; total: number }>(
    "wallet",
    "/payments",
    { limit, offset }
  );
}

// ============================================================================
// REFERRALS
// ============================================================================

/**
 * Get the current user's referral info
 */
export async function getMyReferral() {
  return api.get<{ referral: Referral; events: ReferralEvent[] }>("wallet", "/referral");
}

/**
 * Get referral by code (public lookup for signup)
 */
export async function lookupReferralCode(code: string) {
  return api.get<{ valid: boolean; owner_type?: string; owner_id?: string }>(
    "wallet",
    `/referral/lookup/${encodeURIComponent(code)}`
  );
}

/**
 * Get referral events (people referred + earnings)
 */
export async function getReferralEvents(limit = 50, offset = 0) {
  return api.get<{ events: ReferralEvent[]; total: number }>(
    "wallet",
    "/referral/events",
    { limit, offset }
  );
}

// ============================================================================
// ADMIN OPERATIONS
// ============================================================================

export const walletAdmin = {
  /**
   * Credit a wallet (admin only)
   */
  async creditWallet(
    accountId: string,
    agcAmount: number,
    entryType: string,
    description: string,
    options?: {
      usdAmount?: number;
      isWithdrawable?: boolean;
      referenceType?: string;
      referenceId?: string;
    }
  ) {
    return api.post<{ entry: WalletLedgerEntry }>("wallet", "/admin/credit", {
      account_id: accountId,
      agc_amount: agcAmount,
      entry_type: entryType,
      description,
      ...options,
    });
  },

  /**
   * Debit a wallet (admin only)
   */
  async debitWallet(
    accountId: string,
    agcAmount: number,
    entryType: string,
    description: string,
    options?: {
      usdAmount?: number;
      referenceType?: string;
      referenceId?: string;
    }
  ) {
    return api.post<{ entry: WalletLedgerEntry }>("wallet", "/admin/debit", {
      account_id: accountId,
      agc_amount: agcAmount,
      entry_type: entryType,
      description,
      ...options,
    });
  },

  /**
   * Get all wallets (admin)
   */
  async listWallets(ownerType?: string, limit = 50, offset = 0) {
    return api.get<{ accounts: WalletAccount[]; total: number }>(
      "wallet",
      "/admin/accounts",
      { owner_type: ownerType, limit, offset }
    );
  },

  /**
   * Get platform wallet
   */
  async getPlatformWallet() {
    return api.get<{ account: WalletAccount; balance: WalletBalance }>(
      "wallet",
      "/admin/platform"
    );
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get entry type display label
 */
export function getEntryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TOPUP: 'Top Up',
    NOMINATION_FEE: 'Nomination Fee',
    VOTE_FEE: 'Voting Fee',
    DONATION: 'Donation',
    TICKET: 'Ticket Purchase',
    REFERRAL_BONUS: 'Referral Bonus',
    AMBASSADOR_BONUS: 'Ambassador Bonus',
    CHAPTER_BONUS: 'Chapter Bonus',
    WITHDRAW_REQUEST: 'Withdrawal Request',
    WITHDRAW_APPROVED: 'Withdrawal Approved',
    ADJUSTMENT: 'Adjustment',
  };
  return labels[type] || type;
}

/**
 * Check if entry type is a credit type
 */
export function isCredit(direction: string): boolean {
  return direction === 'CREDIT';
}
