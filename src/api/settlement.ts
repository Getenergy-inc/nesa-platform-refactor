import { api } from "./http";
import type {
  SettlementRun,
  SettlementSplitRule,
  FundAccount,
  DisbursementBatch,
  DisbursementTransfer,
  SettlementAdjustment,
  SettlementRunResponse,
} from "@/types/settlement";

// ============================================================================
// SETTLEMENT RUNS
// ============================================================================

/**
 * Fetch recent settlement runs
 */
export async function getSettlementRuns(limit = 20, offset = 0) {
  return api.get<{ runs: SettlementRun[]; total: number }>(
    "admin",
    "/settlement/runs",
    { limit, offset }
  );
}

/**
 * Get a specific settlement run with details
 */
export async function getSettlementRun(runId: string) {
  return api.get<{
    run: SettlementRun;
    batches: DisbursementBatch[];
    transfers: DisbursementTransfer[];
  }>("admin", `/settlement/runs/${runId}`);
}

/**
 * Trigger a manual settlement run
 */
export async function triggerSettlement(options?: {
  windowStart?: string;
  windowEnd?: string;
  dryRun?: boolean;
}) {
  return api.post<SettlementRunResponse>("settlement", "/", {
    window: options?.windowStart && options?.windowEnd
      ? { start: options.windowStart, end: options.windowEnd }
      : undefined,
    dryRun: options?.dryRun ?? false,
  });
}

// ============================================================================
// SPLIT RULES
// ============================================================================

/**
 * Fetch all settlement split rules
 */
export async function getSplitRules() {
  return api.get<{ rules: SettlementSplitRule[] }>("admin", "/settlement/split-rules");
}

/**
 * Update a split rule's allocations
 */
export async function updateSplitRule(
  ruleId: string,
  allocations: SettlementSplitRule["allocations"]
) {
  return api.put<{ rule: SettlementSplitRule }>(
    "admin",
    `/settlement/split-rules/${ruleId}`,
    { allocations }
  );
}

// ============================================================================
// FUND ACCOUNTS
// ============================================================================

/**
 * Fetch all fund accounts
 */
export async function getFundAccounts() {
  return api.get<{ accounts: FundAccount[] }>("admin", "/settlement/fund-accounts");
}

/**
 * Create a new fund account (e.g., for a new chapter)
 */
export async function createFundAccount(data: {
  key: string;
  display_name: string;
  description?: string;
}) {
  return api.post<{ account: FundAccount }>("admin", "/settlement/fund-accounts", data);
}

// ============================================================================
// DISBURSEMENTS
// ============================================================================

/**
 * Get disbursement batches for a settlement run
 */
export async function getDisbursementBatches(runId: string) {
  return api.get<{ batches: DisbursementBatch[] }>(
    "admin",
    `/settlement/runs/${runId}/batches`
  );
}

/**
 * Get transfers for a disbursement batch
 */
export async function getDisbursementTransfers(batchId: string) {
  return api.get<{ transfers: DisbursementTransfer[] }>(
    "admin",
    `/settlement/batches/${batchId}/transfers`
  );
}

// ============================================================================
// ADJUSTMENTS
// ============================================================================

/**
 * Create a settlement adjustment (for refunds/chargebacks)
 */
export async function createAdjustment(data: {
  original_payment_id?: string;
  adjustment_type: "REFUND" | "CHARGEBACK" | "CORRECTION";
  amount: number;
  currency: string;
  reason?: string;
}) {
  return api.post<{ adjustment: SettlementAdjustment }>(
    "admin",
    "/settlement/adjustments",
    data
  );
}

/**
 * Get pending adjustments
 */
export async function getPendingAdjustments() {
  return api.get<{ adjustments: SettlementAdjustment[] }>(
    "admin",
    "/settlement/adjustments/pending"
  );
}

// ============================================================================
// REPORTS
// ============================================================================

/**
 * Export settlement report as CSV
 */
export async function exportSettlementReport(runId: string) {
  return api.get<{ csv_url: string }>("admin", `/settlement/runs/${runId}/export`);
}
