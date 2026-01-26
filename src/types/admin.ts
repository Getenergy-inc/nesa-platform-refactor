/**
 * NESA-Africa Admin Dashboard Types
 */

// ==========================================
// FINANCIAL TYPES
// ==========================================

export interface FinanceOverview {
  total_agc_circulation: number;
  total_usd_equivalence: number;
  fx_rate: number;
  fx_rate_updated_at: string;
  revenue_by_category: {
    nomination: number;
    vote: number;
    donation: number;
    ticket: number;
  };
  transactions_summary: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface FXRate {
  id: string;
  rate: number;
  currency_pair: string;
  effective_date: string;
  set_by: string | null;
  created_at: string;
}

// ==========================================
// PLATFORM MONITORING TYPES
// ==========================================

export interface NominationTrend {
  date: string;
  count: number;
  category?: string;
}

export interface ChapterPerformance {
  id: string;
  name: string;
  country: string;
  total_signups: number;
  paid_conversions: number;
  total_agc_earned: number;
}

export interface AmbassadorPerformance {
  user_id: string;
  full_name: string;
  email: string;
  total_referrals: number;
  total_agc_earned: number;
}

export interface VoteLog {
  id: string;
  voter_id: string;
  nominee_id: string;
  nominee_name: string;
  vote_type: string;
  created_at: string;
  ip_address?: string;
  risk_flags?: string[];
}

export interface RiskFlag {
  id: string;
  type: 'duplicate_vote' | 'velocity' | 'ip_cluster' | 'device_fingerprint';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affected_votes: string[];
  created_at: string;
  resolved: boolean;
}

// ==========================================
// DISBURSEMENT TYPES
// ==========================================

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
  status: 'DRAFT' | 'COMPLETED' | 'FAILED';
  total_amount_usd: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
  lines?: DisbursementLine[];
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

// ==========================================
// GOVERNANCE & COMPLIANCE TYPES
// ==========================================

export interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface RefundRequest {
  id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface CertificateRequest {
  id: string;
  nominee_id: string;
  nominee_name: string;
  tier: string;
  status: 'pending' | 'approved' | 'issued';
  requested_at: string;
  approved_at: string | null;
}

export interface StageConfig {
  id: string;
  season_id: string;
  action: 'nominations' | 'public_voting' | 'jury_scoring' | 'results' | 'certificates';
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// TECHNICAL MONITORING TYPES
// ==========================================

export interface APILogSummary {
  endpoint: string;
  method: string;
  total_requests: number;
  avg_response_time_ms: number;
  error_rate: number;
  last_request_at: string;
}

export interface PaymentProviderStatus {
  provider: 'PAYSTACK' | 'FLUTTERWAVE' | 'LEMFI' | 'TAPTAPSEND';
  status: 'online' | 'degraded' | 'offline';
  last_ping_at: string;
  response_time_ms: number;
  success_rate_24h: number;
}

// ==========================================
// ADMIN DASHBOARD AGGREGATES
// ==========================================

export interface AdminDashboardData {
  finance: FinanceOverview;
  nominations: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    trends: NominationTrend[];
  };
  chapters: ChapterPerformance[];
  ambassadors: AmbassadorPerformance[];
  stages: StageConfig[];
  recent_audit_logs: AuditLogEntry[];
  provider_status: PaymentProviderStatus[];
}
