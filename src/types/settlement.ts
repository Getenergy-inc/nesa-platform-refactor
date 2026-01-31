/**
 * NESA-Africa Settlement System Types
 * 
 * TypeScript types for the 24-hour revenue settlement splitter.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type SettlementStatus = 'STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type TransferStatus = 'CREATED' | 'PENDING' | 'PROCESSING' | 'SENT' | 'CONFIRMED' | 'FAILED';

// ============================================================================
// TABLES
// ============================================================================

export interface FundAccount {
  id: string;
  key: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SplitAllocation {
  target: string;
  mode: 'PERCENT' | 'FIXED';
  value: number;
}

export interface SettlementSplitRule {
  id: string;
  scope: string;
  allocations: SplitAllocation[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettlementRun {
  id: string;
  window_start: string;
  window_end: string;
  status: SettlementStatus;
  totals_json: SettlementTotals;
  payments_processed: number;
  idempotency_key: string;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface SettlementTotals {
  currencies: CurrencyTotal[];
  gfa_wzip_markup_percent?: number;
  model?: 'ADDITIVE_MARKUP' | 'DEDUCTIVE'; // ADDITIVE = markup on top, DEDUCTIVE = markup from net
  message?: string;
}

export interface CurrencyTotal {
  currency: string;
  gross: number;
  fees: number;
  net: number;
  gfa_wzip_markup: number;
  base_to_funds: number;      // Full base amount distributed to funds (not reduced by markup)
  total_distributed: number;  // base_to_funds + gfa_wzip_markup
  allocations: AllocationTotal[];
}

export interface AllocationTotal {
  fundKey: string;
  amount: number;
  percentage: number;
}

export interface DisbursementBatch {
  id: string;
  settlement_run_id: string;
  currency: string;
  total_gross: number;
  total_fees: number;
  total_net: number;
  status: TransferStatus;
  created_at: string;
  updated_at: string;
}

export interface DisbursementTransfer {
  id: string;
  disbursement_batch_id: string;
  fund_account_key: string;
  amount: number;
  currency: string;
  percentage_applied: number;
  destination_account_ref: string | null;
  partner_key: string | null;
  status: TransferStatus;
  external_reference: string | null;
  created_at: string;
  confirmed_at: string | null;
}

export interface SettlementAdjustment {
  id: string;
  settlement_run_id: string | null;
  original_payment_id: string | null;
  adjustment_type: 'REFUND' | 'CHARGEBACK' | 'CORRECTION';
  amount: number;
  currency: string;
  fund_reversals: Array<{ fundKey: string; amount: number }>;
  reason: string | null;
  created_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface SettlementRunResponse {
  ok: boolean;
  message: string;
  run_id: string;
  payments_processed: number;
  totals?: SettlementTotals;
  dry_run?: boolean;
  skipped?: boolean;
}

export interface SettlementDashboardData {
  recentRuns: SettlementRun[];
  splitRules: SettlementSplitRule[];
  fundAccounts: FundAccount[];
  pendingAdjustments: SettlementAdjustment[];
}

// ============================================================================
// SPLIT CONFIGURATION (DISPLAY CONSTANTS)
// ============================================================================

// GFA Wzip 2% markup (ADDITIVE - charged on top, not deducted from fund distributions)
// Customer pays: base * 1.02, funds receive full base amount, GFA Wzip receives 2% markup
export const GFA_WZIP_MARKUP_PERCENT = 2;

export const SETTLEMENT_SPLIT_DISPLAY = [
  { key: 'GFA_WZIP', name: 'GFA Wzip Processing (+2%)', percent: 2, color: 'hsl(var(--chart-1))', isMarkup: true, note: 'Additive markup on top of base' },
  { key: 'NESA', name: 'NESA-Africa', percent: 50, color: 'hsl(var(--primary))', note: '50% of base amount' },
  { key: 'SCEF', name: 'SCEF', percent: 20, color: 'hsl(var(--accent))', note: '20% of base amount' },
  { key: 'EDUAID', name: 'EduAid-Africa', percent: 10, color: 'hsl(210 100% 50%)', note: '10% of base amount' },
  { key: 'REBUILD', name: 'Rebuild My School Africa', percent: 10, color: 'hsl(150 100% 40%)', note: '10% of base amount' },
  { key: 'LOCAL_CHAPTER', name: 'Local Chapter', percent: 7, color: 'hsl(45 100% 50%)', note: '7% of base amount' },
  { key: 'CVO', name: 'CVO Discretionary', percent: 3, color: 'hsl(280 100% 60%)', note: '3% of base amount' },
] as const;
