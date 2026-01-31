-- ============================================================================
-- FUND ACCOUNTS (internal ledger destinations)
-- ============================================================================
CREATE TABLE public.fund_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed default fund accounts
INSERT INTO public.fund_accounts (key, display_name, description) VALUES
  ('NESA', 'NESA-Africa Master Program', 'Multi-currency master program fund'),
  ('EDUAID', 'EduAid-Africa', 'Educational aid initiatives'),
  ('SCEF', 'Santos Creations Educational Foundation', 'Foundation operations'),
  ('REBUILD', 'Rebuild My School Africa', 'School reconstruction projects'),
  ('CVO', 'CVO Discretionary Funds', 'Chief Visionary Officer discretionary'),
  ('LOCAL_CHAPTER:UNASSIGNED', 'Unassigned Chapter Funds', 'Chapter funds pending assignment');

-- Enable RLS
ALTER TABLE public.fund_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fund accounts viewable by admins"
  ON public.fund_accounts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Fund accounts manageable by admins"
  ON public.fund_accounts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- SETTLEMENT SPLIT RULES (configurable without redeploy)
-- ============================================================================
CREATE TABLE public.settlement_split_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL DEFAULT 'DAILY_MASTER_SPLIT',
  allocations jsonb NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(scope)
);

-- Seed default split rule (must sum to 100%)
INSERT INTO public.settlement_split_rules (scope, allocations) VALUES
  ('DAILY_MASTER_SPLIT', '[
    {"target": "FUND:NESA", "mode": "PERCENT", "value": 0.50},
    {"target": "FUND:EDUAID", "mode": "PERCENT", "value": 0.10},
    {"target": "FUND:SCEF", "mode": "PERCENT", "value": 0.20},
    {"target": "FUND:LOCAL_CHAPTER", "mode": "PERCENT", "value": 0.07},
    {"target": "FUND:REBUILD", "mode": "PERCENT", "value": 0.10},
    {"target": "FUND:CVO", "mode": "PERCENT", "value": 0.03}
  ]'::jsonb);

-- Enable RLS
ALTER TABLE public.settlement_split_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Split rules viewable by admins"
  ON public.settlement_split_rules FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Split rules manageable by admins"
  ON public.settlement_split_rules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- SETTLEMENT STATUS ENUM
-- ============================================================================
CREATE TYPE public.settlement_status AS ENUM ('STARTED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- ============================================================================
-- SETTLEMENT RUNS (track each 24h execution)
-- ============================================================================
CREATE TABLE public.settlement_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  status public.settlement_status NOT NULL DEFAULT 'STARTED',
  totals_json jsonb DEFAULT '{}'::jsonb,
  payments_processed integer DEFAULT 0,
  idempotency_key text UNIQUE NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.settlement_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settlement runs viewable by admins"
  ON public.settlement_runs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Settlement runs manageable by admins"
  ON public.settlement_runs FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- DISBURSEMENT STATUS ENUM  
-- ============================================================================
CREATE TYPE public.transfer_status AS ENUM ('CREATED', 'PENDING', 'PROCESSING', 'SENT', 'CONFIRMED', 'FAILED');

-- ============================================================================
-- DISBURSEMENT BATCHES
-- ============================================================================
CREATE TABLE public.disbursement_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_run_id uuid REFERENCES public.settlement_runs(id) ON DELETE CASCADE NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  total_gross numeric NOT NULL DEFAULT 0,
  total_fees numeric NOT NULL DEFAULT 0,
  total_net numeric NOT NULL DEFAULT 0,
  status public.transfer_status NOT NULL DEFAULT 'CREATED',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disbursement_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disbursement batches viewable by admins"
  ON public.disbursement_batches FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Disbursement batches manageable by admins"
  ON public.disbursement_batches FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- DISBURSEMENT TRANSFERS (individual fund allocations)
-- ============================================================================
CREATE TABLE public.disbursement_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  disbursement_batch_id uuid REFERENCES public.disbursement_batches(id) ON DELETE CASCADE NOT NULL,
  fund_account_key text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  percentage_applied numeric NOT NULL,
  destination_account_ref text,
  partner_key text,
  status public.transfer_status NOT NULL DEFAULT 'CREATED',
  external_reference text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.disbursement_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disbursement transfers viewable by admins"
  ON public.disbursement_transfers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Disbursement transfers manageable by admins"
  ON public.disbursement_transfers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- SETTLEMENT ADJUSTMENTS (for refunds/chargebacks)
-- ============================================================================
CREATE TABLE public.settlement_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_run_id uuid REFERENCES public.settlement_runs(id),
  original_payment_id uuid,
  adjustment_type text NOT NULL, -- REFUND, CHARGEBACK, CORRECTION
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  fund_reversals jsonb NOT NULL DEFAULT '[]'::jsonb,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settlement_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settlement adjustments viewable by admins"
  ON public.settlement_adjustments FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Settlement adjustments manageable by admins"
  ON public.settlement_adjustments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- ADD SETTLEMENT TRACKING TO PAYMENT_INTENTS
-- ============================================================================
ALTER TABLE public.payment_intents 
  ADD COLUMN IF NOT EXISTS is_settled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS settled_run_id uuid REFERENCES public.settlement_runs(id),
  ADD COLUMN IF NOT EXISTS settled_at timestamptz,
  ADD COLUMN IF NOT EXISTS processor_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount numeric,
  ADD COLUMN IF NOT EXISTS chapter_id uuid REFERENCES public.chapters(id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_settlement_runs_window ON public.settlement_runs(window_start, window_end);
CREATE INDEX idx_settlement_runs_status ON public.settlement_runs(status);
CREATE INDEX idx_disbursement_batches_run ON public.disbursement_batches(settlement_run_id);
CREATE INDEX idx_disbursement_transfers_batch ON public.disbursement_transfers(disbursement_batch_id);
CREATE INDEX idx_payment_intents_settlement ON public.payment_intents(is_settled, status) WHERE is_settled = false;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_fund_accounts_updated_at
  BEFORE UPDATE ON public.fund_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_settlement_split_rules_updated_at
  BEFORE UPDATE ON public.settlement_split_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_disbursement_batches_updated_at
  BEFORE UPDATE ON public.disbursement_batches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();