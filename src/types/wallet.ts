/**
 * NESA-Africa GFA Wallet Types
 *
 * TypeScript types for the wallet, referral, and payment systems.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type WalletOwnerType = "USER" | "CHAPTER" | "PLATFORM";

export type WalletEntryType =
  | "TOPUP"
  | "NOMINATION_FEE"
  | "VOTE_FEE"
  | "DONATION"
  | "TICKET"
  | "REFERRAL_BONUS"
  | "AMBASSADOR_BONUS"
  | "CHAPTER_BONUS"
  | "WITHDRAW_REQUEST"
  | "WITHDRAW_APPROVED"
  | "ADJUSTMENT";

export type WalletDirection = "CREDIT" | "DEBIT";
export type PaymentType = "TOPUP" | "TICKET";

export type PaymentProvider =
  | "PAYSTACK"
  | "FLUTTERWAVE"
  | "LEMFI"
  | "TAPTAPSEND";

export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type ReferralOwnerType = "USER" | "CHAPTER";

export type ReferralEventType =
  | "SIGNUP"
  | "NOMINATION_PAID"
  | "VOTE_PAID"
  | "DONATION"
  | "TICKET";

export type DisbursementStatus = "DRAFT" | "COMPLETED" | "FAILED";

export type RoleCode =
  | "USER"
  | "NOMINEE"
  | "AMBASSADOR"
  | "OLC_COORDINATOR"
  | "NRC"
  | "JURY"
  | "SPONSOR"
  | "ADMIN"
  | "SUPER_ADMIN";

// ============================================================================
// TABLES
// ============================================================================

export interface Role {
  id: string;
  code: RoleCode;
  label: string;
  description: string | null;
  created_at: string;
}

export interface WalletAccount {
  id: string;
  owner_type: WalletOwnerType;
  owner_id: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletLedgerEntry {
  id: string;
  walletId: string;
  transactionType: WalletEntryType;
  agcAmount: number;
  walletDirection: WalletDirection;
  createdAt: Date;
  updatedAt: Date;
  // entry_type: WalletEntryType;
  // direction: WalletDirection;
  // agc_amount: number;
  // usd_amount: number;
  // is_withdrawable: boolean;
  // reference_type: string | null;
  // reference_id: string | null;
  // description: string | null;
  // created_by: string | null;
  // created_at: string;
}

export interface WalletBalance {
  // account_id: string;
  // owner_type: WalletOwnerType;
  // owner_id: string;
  // currency: string;
  agc_total: string;
  // agc_withdrawable: number;
  // agc_non_withdrawable: number;
  // agc_bonus: number;
  // usd_balance: number;
}

enum PaymentMethod {
  CARD,
  TRANSFER,
}

export interface PaymentIntent {
  id: string;
  account_id: string;
  provider: PaymentProvider;
  provider_ref: string | null;
  status: PaymentStatus;
  amount_usd: number;
  agc_amount: number;
  exchange_rate: number;
  metadata: Record<string, unknown>;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  owner_type: ReferralOwnerType;
  owner_id: string;
  referral_code: string;
  is_active: boolean;
  total_referrals: number;
  total_earnings_agc: number;
  created_at: string;
}

export interface ReferralEvent {
  id: string;
  referrer_type: ReferralOwnerType;
  referrer_id: string;
  referred_user_id: string;
  event_type: ReferralEventType;
  value_usd: number;
  reward_agc: number;
  is_paid: boolean;
  created_at: string;
}

export interface RevenueSplit {
  id: string;
  season_id: string;
  split_key: string;
  percent: number;
  destination_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DisbursementRun {
  id: string;
  season_id: string;
  run_date: string;
  status: DisbursementStatus;
  total_amount_usd: number;
  notes: string | null;
  created_by: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface DisbursementLine {
  id: string;
  run_id: string;
  split_key: string;
  amount_usd: number;
  destination_account_id: string | null;
  destination_external: string | null;
  status: string;
  created_at: string;
}

// ============================================================================
// EXTENDED PROFILE (with referral tracking)
// ============================================================================

export interface ProfileWithReferral {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  avatar_url: string | null;
  bio: string | null;
  referred_by_user_id: string | null;
  referred_by_chapter_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EXTENDED USER ROLE (with scope)
// ============================================================================

export interface UserRoleWithScope {
  id: string;
  user_id: string;
  role: string; // app_role enum
  role_code: RoleCode | null;
  scope_chapter_id: string | null;
  created_at: string;
}

// ============================================================================
// EXTENDED CHAPTER (with referral & coordinator)
// ============================================================================

export interface ChapterWithReferral {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  logo_url: string | null;
  lead_user_id: string | null;
  coordinator_user_id: string | null;
  referral_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// EXTENDED SEASON (with stage gating)
// ============================================================================

export interface SeasonWithStages {
  id: string;
  name: string;
  code: string | null;
  year: number;
  is_active: boolean;
  nomination_open: boolean;
  gold_voting_open: boolean;
  blue_garnet_open: boolean;
  certificate_download_open: boolean;
  starts_at: string | null;
  ends_at: string | null;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface WalletDashboardData {
  account: WalletAccount;
  balance: WalletBalance;
  recentTransactions: WalletLedgerEntry[];
  referral: Referral | null;
}

export interface TopupRequest {
  amount_usd: number;
  provider: PaymentProvider;
  metadata?: Record<string, unknown>;
}

export interface TopupResponse {
  payment_intent: PaymentIntent;
  payment_url: string;
}

export interface LedgerEntryRequest {
  account_id: string;
  entry_type: WalletEntryType;
  direction: WalletDirection;
  agc_amount: number;
  usd_amount?: number;
  is_withdrawable?: boolean;
  reference_type?: string;
  reference_id?: string;
  description?: string;
}

export type Currency = "NGN" | "USD";
