-- ============================================================================
-- NESA-Africa Identity, RBAC & GFA Wallet Schema
-- ============================================================================

-- 1) ENUMS
-- ============================================================================

-- Owner type for wallet accounts
CREATE TYPE public.wallet_owner_type AS ENUM ('USER', 'CHAPTER', 'PLATFORM');

-- Wallet ledger entry types
CREATE TYPE public.wallet_entry_type AS ENUM (
  'TOPUP', 
  'NOMINATION_FEE', 
  'VOTE_FEE', 
  'DONATION', 
  'TICKET', 
  'REFERRAL_BONUS', 
  'AMBASSADOR_BONUS', 
  'CHAPTER_BONUS', 
  'WITHDRAW_REQUEST', 
  'WITHDRAW_APPROVED', 
  'ADJUSTMENT'
);

-- Ledger direction
CREATE TYPE public.wallet_direction AS ENUM ('CREDIT', 'DEBIT');

-- Payment provider
CREATE TYPE public.payment_provider AS ENUM ('PAYSTACK', 'FLUTTERWAVE', 'LEMFI', 'TAPTAPSEND');

-- Payment status
CREATE TYPE public.payment_status AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- Referral owner type
CREATE TYPE public.referral_owner_type AS ENUM ('USER', 'CHAPTER');

-- Referral event type
CREATE TYPE public.referral_event_type AS ENUM ('SIGNUP', 'NOMINATION_PAID', 'VOTE_PAID', 'DONATION', 'TICKET');

-- Disbursement status
CREATE TYPE public.disbursement_status AS ENUM ('DRAFT', 'COMPLETED', 'FAILED');

-- Extended role codes (keeping existing app_role for compatibility)
CREATE TYPE public.role_code AS ENUM (
  'USER', 
  'NOMINEE', 
  'AMBASSADOR', 
  'OLC_COORDINATOR', 
  'NRC', 
  'JURY', 
  'SPONSOR', 
  'ADMIN', 
  'SUPER_ADMIN'
);

-- 2) ROLES REFERENCE TABLE
-- ============================================================================

CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code role_code UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed role definitions
INSERT INTO public.roles (code, label, description) VALUES
  ('USER', 'User', 'Standard platform user'),
  ('NOMINEE', 'Nominee', 'Nominated individual or organization'),
  ('AMBASSADOR', 'Ambassador', 'NESA brand ambassador'),
  ('OLC_COORDINATOR', 'OLC Coordinator', 'Online Local Chapter coordinator'),
  ('NRC', 'NRC Member', 'National Review Committee member'),
  ('JURY', 'Jury Member', 'Awards jury panel member'),
  ('SPONSOR', 'Sponsor', 'Platform sponsor'),
  ('ADMIN', 'Administrator', 'Platform administrator'),
  ('SUPER_ADMIN', 'Super Admin', 'Full system access');

-- 3) EXTEND PROFILES TABLE
-- ============================================================================

-- Add referral tracking to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referred_by_user_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS referred_by_chapter_id UUID;

-- 4) ENHANCED USER_ROLES TABLE (scope support)
-- ============================================================================

-- Add scope column for chapter-specific roles
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS role_code role_code,
  ADD COLUMN IF NOT EXISTS scope_chapter_id UUID;

-- Add foreign key for chapter scope
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_scope_chapter_fkey 
  FOREIGN KEY (scope_chapter_id) REFERENCES public.chapters(id) ON DELETE SET NULL;

-- 5) EXTEND CHAPTERS TABLE
-- ============================================================================

ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS coordinator_user_id UUID REFERENCES public.profiles(user_id);

-- Generate referral codes for existing chapters
UPDATE public.chapters 
SET referral_code = 'CH-' || UPPER(SUBSTRING(slug, 1, 3)) || '-' || SUBSTRING(id::text, 1, 4)
WHERE referral_code IS NULL;

-- 6) WALLET ACCOUNTS
-- ============================================================================

CREATE TABLE public.wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type wallet_owner_type NOT NULL,
  owner_id UUID NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(owner_type, owner_id)
);

-- Create index for owner lookup
CREATE INDEX idx_wallet_accounts_owner ON public.wallet_accounts(owner_type, owner_id);

-- 7) WALLET LEDGER ENTRIES (Source of Truth)
-- ============================================================================

CREATE TABLE public.wallet_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.wallet_accounts(id) ON DELETE CASCADE,
  entry_type wallet_entry_type NOT NULL,
  direction wallet_direction NOT NULL,
  agc_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  usd_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_withdrawable BOOLEAN DEFAULT false,
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for account balance queries
CREATE INDEX idx_wallet_ledger_account ON public.wallet_ledger_entries(account_id, created_at DESC);
CREATE INDEX idx_wallet_ledger_reference ON public.wallet_ledger_entries(reference_type, reference_id);

-- 8) PAYMENT INTENTS
-- ============================================================================

CREATE TABLE public.payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.wallet_accounts(id) ON DELETE CASCADE,
  provider payment_provider NOT NULL,
  provider_ref TEXT,
  status payment_status NOT NULL DEFAULT 'INITIATED',
  amount_usd NUMERIC(12, 2) NOT NULL,
  agc_amount NUMERIC(12, 2) NOT NULL,
  exchange_rate NUMERIC(10, 4) DEFAULT 1.0,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payment_intents_account ON public.payment_intents(account_id);
CREATE INDEX idx_payment_intents_provider_ref ON public.payment_intents(provider, provider_ref);

-- 9) REFERRALS
-- ============================================================================

CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type referral_owner_type NOT NULL,
  owner_id UUID NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  total_referrals INT DEFAULT 0,
  total_earnings_agc NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(owner_type, owner_id)
);

CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- 10) REFERRAL EVENTS
-- ============================================================================

CREATE TABLE public.referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_type referral_owner_type NOT NULL,
  referrer_id UUID NOT NULL,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  event_type referral_event_type NOT NULL,
  value_usd NUMERIC(12, 2) DEFAULT 0,
  reward_agc NUMERIC(12, 2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_referral_events_referrer ON public.referral_events(referrer_type, referrer_id);

-- 11) REVENUE SPLITS (Admin-Configured)
-- ============================================================================

CREATE TABLE public.revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  split_key TEXT NOT NULL,
  percent NUMERIC(5, 2) NOT NULL CHECK (percent >= 0 AND percent <= 100),
  destination_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(season_id, split_key)
);

-- 12) DISBURSEMENT RUNS
-- ============================================================================

CREATE TABLE public.disbursement_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  run_date DATE NOT NULL,
  status disbursement_status NOT NULL DEFAULT 'DRAFT',
  total_amount_usd NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  created_by UUID,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13) DISBURSEMENT LINES
-- ============================================================================

CREATE TABLE public.disbursement_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.disbursement_runs(id) ON DELETE CASCADE,
  split_key TEXT NOT NULL,
  amount_usd NUMERIC(12, 2) NOT NULL,
  destination_account_id UUID REFERENCES public.wallet_accounts(id),
  destination_external TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14) EXTEND SEASONS TABLE (Stage Gating)
-- ============================================================================

ALTER TABLE public.seasons
  ADD COLUMN IF NOT EXISTS code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS nomination_open BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gold_voting_open BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS blue_garnet_open BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS certificate_download_open BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS starts_at DATE,
  ADD COLUMN IF NOT EXISTS ends_at DATE,
  ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Update existing season with code
UPDATE public.seasons SET code = 'NESA_' || year WHERE code IS NULL;

-- 15) WALLET BALANCE VIEW (Computed from Ledger)
-- ============================================================================

CREATE OR REPLACE VIEW public.wallet_balances AS
SELECT 
  wa.id AS account_id,
  wa.owner_type,
  wa.owner_id,
  wa.currency,
  COALESCE(SUM(CASE WHEN wle.direction = 'CREDIT' THEN wle.agc_amount ELSE -wle.agc_amount END), 0) AS agc_total,
  COALESCE(SUM(CASE WHEN wle.direction = 'CREDIT' AND wle.is_withdrawable THEN wle.agc_amount 
                    WHEN wle.direction = 'DEBIT' AND wle.is_withdrawable THEN -wle.agc_amount 
                    ELSE 0 END), 0) AS agc_withdrawable,
  COALESCE(SUM(CASE WHEN wle.direction = 'CREDIT' AND NOT wle.is_withdrawable THEN wle.agc_amount 
                    WHEN wle.direction = 'DEBIT' AND NOT wle.is_withdrawable THEN -wle.agc_amount 
                    ELSE 0 END), 0) AS agc_non_withdrawable,
  COALESCE(SUM(CASE WHEN wle.entry_type IN ('REFERRAL_BONUS', 'AMBASSADOR_BONUS', 'CHAPTER_BONUS') 
                    AND wle.direction = 'CREDIT' THEN wle.agc_amount ELSE 0 END), 0) AS agc_bonus,
  COALESCE(SUM(CASE WHEN wle.direction = 'CREDIT' THEN wle.usd_amount ELSE -wle.usd_amount END), 0) AS usd_balance
FROM public.wallet_accounts wa
LEFT JOIN public.wallet_ledger_entries wle ON wa.id = wle.account_id
GROUP BY wa.id, wa.owner_type, wa.owner_id, wa.currency;

-- 16) HELPER FUNCTIONS
-- ============================================================================

-- Get wallet account for a user
CREATE OR REPLACE FUNCTION public.get_user_wallet(p_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.wallet_accounts 
  WHERE owner_type = 'USER' AND owner_id = p_user_id
  LIMIT 1
$$;

-- Get wallet balance for an account
CREATE OR REPLACE FUNCTION public.get_wallet_balance(p_account_id UUID)
RETURNS TABLE (
  agc_total NUMERIC,
  agc_withdrawable NUMERIC,
  agc_non_withdrawable NUMERIC,
  agc_bonus NUMERIC,
  usd_balance NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    agc_total,
    agc_withdrawable,
    agc_non_withdrawable,
    agc_bonus,
    usd_balance
  FROM public.wallet_balances
  WHERE account_id = p_account_id
$$;

-- Generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(p_prefix TEXT DEFAULT 'REF')
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := p_prefix || '-' || UPPER(SUBSTRING(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$;

-- Check if user has a specific role code
CREATE OR REPLACE FUNCTION public.has_role_code(p_user_id UUID, p_role_code role_code)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id AND role_code = p_role_code
  )
$$;

-- 17) TRIGGERS FOR AUTOMATIC WALLET/REFERRAL CREATION
-- ============================================================================

-- Enhanced signup handler
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_id UUID;
  v_referral_code TEXT;
BEGIN
  -- Create wallet account for new user
  INSERT INTO public.wallet_accounts (owner_type, owner_id)
  VALUES ('USER', NEW.id)
  RETURNING id INTO v_wallet_id;
  
  -- Create referral record with unique code
  v_referral_code := public.generate_referral_code('U');
  INSERT INTO public.referrals (owner_type, owner_id, referral_code)
  VALUES ('USER', NEW.id, v_referral_code);
  
  -- Add default USER role_code
  UPDATE public.user_roles 
  SET role_code = 'USER'
  WHERE user_id = NEW.id AND role_code IS NULL;
  
  RETURN NEW;
END;
$$;

-- Trigger on profile creation
CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_wallet();

-- Chapter wallet creation
CREATE OR REPLACE FUNCTION public.handle_new_chapter_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code TEXT;
BEGIN
  -- Create wallet account for chapter
  INSERT INTO public.wallet_accounts (owner_type, owner_id)
  VALUES ('CHAPTER', NEW.id);
  
  -- Generate referral code if not set
  IF NEW.referral_code IS NULL THEN
    v_referral_code := public.generate_referral_code('CH');
    NEW.referral_code := v_referral_code;
    
    -- Create chapter referral record
    INSERT INTO public.referrals (owner_type, owner_id, referral_code)
    VALUES ('CHAPTER', NEW.id, v_referral_code);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_chapter_created_wallet
  BEFORE INSERT ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_chapter_wallet();

-- 18) ENABLE RLS ON ALL NEW TABLES
-- ============================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disbursement_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disbursement_lines ENABLE ROW LEVEL SECURITY;

-- 19) RLS POLICIES
-- ============================================================================

-- Roles: public read
CREATE POLICY "Roles are public" ON public.roles FOR SELECT USING (true);

-- Wallet Accounts: users see own, admins see all
CREATE POLICY "Users view own wallet" ON public.wallet_accounts
  FOR SELECT USING (
    (owner_type = 'USER' AND owner_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins manage wallets" ON public.wallet_accounts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Chapter coordinators can view chapter wallet
CREATE POLICY "Coordinators view chapter wallet" ON public.wallet_accounts
  FOR SELECT USING (
    owner_type = 'CHAPTER' AND
    EXISTS (
      SELECT 1 FROM public.chapters c
      WHERE c.id = owner_id AND c.coordinator_user_id = auth.uid()
    )
  );

-- Wallet Ledger: users see own account entries
CREATE POLICY "Users view own ledger" ON public.wallet_ledger_entries
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM public.wallet_accounts 
      WHERE owner_type = 'USER' AND owner_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins manage ledger" ON public.wallet_ledger_entries
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Payment Intents: users see own
CREATE POLICY "Users view own payments" ON public.payment_intents
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM public.wallet_accounts 
      WHERE owner_type = 'USER' AND owner_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can create payments" ON public.payment_intents
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT id FROM public.wallet_accounts 
      WHERE owner_type = 'USER' AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage payments" ON public.payment_intents
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Referrals: users see own
CREATE POLICY "Users view own referrals" ON public.referrals
  FOR SELECT USING (
    (owner_type = 'USER' AND owner_id = auth.uid()) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins manage referrals" ON public.referrals
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Referral Events: referrers see their events
CREATE POLICY "Referrers view own events" ON public.referral_events
  FOR SELECT USING (
    (referrer_type = 'USER' AND referrer_id = auth.uid()) OR
    referred_user_id = auth.uid() OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins manage referral events" ON public.referral_events
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Revenue Splits: admin only
CREATE POLICY "Admins view splits" ON public.revenue_splits
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage splits" ON public.revenue_splits
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Disbursements: admin only
CREATE POLICY "Admins view disbursements" ON public.disbursement_runs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage disbursements" ON public.disbursement_runs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins view disbursement lines" ON public.disbursement_lines
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage disbursement lines" ON public.disbursement_lines
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 20) UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER update_wallet_accounts_updated_at
  BEFORE UPDATE ON public.wallet_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payment_intents_updated_at
  BEFORE UPDATE ON public.payment_intents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_revenue_splits_updated_at
  BEFORE UPDATE ON public.revenue_splits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();