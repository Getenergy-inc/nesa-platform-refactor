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
  message?: string;
}

export interface CurrencyTotal {
  currency: string;
  gross: number;
  fees: number;
  net: number;
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

export const SETTLEMENT_SPLIT_DISPLAY = [
  { key: 'NESA', name: 'NESA-Africa', percent: 50, color: 'hsl(var(--primary))' },
  { key: 'SCEF', name: 'SCEF', percent: 20, color: 'hsl(var(--accent))' },
  { key: 'EDUAID', name: 'EduAid-Africa', percent: 10, color: 'hsl(210 100% 50%)' },
  { key: 'REBUILD', name: 'Rebuild My School Africa', percent: 10, color: 'hsl(150 100% 40%)' },
  { key: 'LOCAL_CHAPTER', name: 'Local Chapter', percent: 7, color: 'hsl(45 100% 50%)' },
  { key: 'CVO', name: 'CVO Discretionary', percent: 3, color: 'hsl(280 100% 60%)' },
] as const;
