-- Create transaction type enum
DO $$ BEGIN
  CREATE TYPE wallet_tx_type AS ENUM ('EARN', 'CONVERT', 'SPEND', 'ADJUSTMENT', 'REVERSAL', 'TRANSFER_IN', 'TRANSFER_OUT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create AGC source enum
DO $$ BEGIN
  CREATE TYPE agc_source AS ENUM (
    'DAILY_SIGNIN',
    'NOMINATION_VERIFIED',
    'REFERRAL_SIGNUP',
    'REFERRAL_FIRST_PAYMENT',
    'REFERRAL_SECOND_PAYMENT',
    'WATCH_TV',
    'SOCIAL_SHARE',
    'SPONSOR_FUNDED',
    'CONVERSION',
    'VOTE_SPEND',
    'ADMIN_BONUS',
    'PURCHASE_BONUS',
    'WELCOME_CREDITS'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.wallet_accounts(id) ON DELETE CASCADE,
  tx_type wallet_tx_type NOT NULL,
  source agc_source NULL,
  amount_agcc INTEGER NOT NULL DEFAULT 0,
  amount_agc NUMERIC(12, 2) NOT NULL DEFAULT 0,
  balance_agcc_after INTEGER NOT NULL DEFAULT 0,
  balance_agc_after NUMERIC(12, 2) NOT NULL DEFAULT 0,
  reference_type TEXT NULL,
  reference_id UUID NULL,
  description TEXT NULL,
  metadata JSONB NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallet_tx_account_id ON public.wallet_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_reference ON public.wallet_transactions(reference_type, reference_id);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users view own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "System inserts transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admins manage transactions" ON public.wallet_transactions;

-- Users can view their own transactions
CREATE POLICY "Users view own transactions"
  ON public.wallet_transactions
  FOR SELECT
  USING (
    account_id IN (
      SELECT id FROM public.wallet_accounts 
      WHERE owner_type = 'USER' AND owner_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- System can insert transactions
CREATE POLICY "System inserts transactions"
  ON public.wallet_transactions
  FOR INSERT
  WITH CHECK (true);

-- Admins can manage all transactions
CREATE POLICY "Admins manage transactions"
  ON public.wallet_transactions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop and recreate the wallet_balances view
DROP VIEW IF EXISTS public.wallet_balances CASCADE;

CREATE VIEW public.wallet_balances AS
SELECT 
  wa.id AS account_id,
  wa.owner_type,
  wa.owner_id,
  wa.currency,
  wa.is_active,
  COALESCE(
    (SELECT wt.balance_agcc_after FROM public.wallet_transactions wt 
     WHERE wt.account_id = wa.id ORDER BY wt.created_at DESC LIMIT 1),
    0
  )::INTEGER AS balance_agcc,
  COALESCE(
    (SELECT wt.balance_agc_after FROM public.wallet_transactions wt 
     WHERE wt.account_id = wa.id ORDER BY wt.created_at DESC LIMIT 1),
    0
  )::NUMERIC AS balance_agc,
  COALESCE(
    (SELECT wt.balance_agc_after FROM public.wallet_transactions wt 
     WHERE wt.account_id = wa.id ORDER BY wt.created_at DESC LIMIT 1),
    0
  )::NUMERIC AS agc_total,
  0::NUMERIC AS agc_withdrawable,
  COALESCE(
    (SELECT wt.balance_agc_after FROM public.wallet_transactions wt 
     WHERE wt.account_id = wa.id ORDER BY wt.created_at DESC LIMIT 1),
    0
  )::NUMERIC AS agc_non_withdrawable,
  0::NUMERIC AS agc_bonus,
  0::NUMERIC AS usd_balance,
  wa.created_at,
  wa.updated_at
FROM public.wallet_accounts wa;

GRANT SELECT ON public.wallet_balances TO authenticated;

-- Recreate get_wallet_balance function that depends on the view
CREATE OR REPLACE FUNCTION public.get_wallet_balance(p_account_id uuid)
 RETURNS TABLE(agc_total numeric, agc_withdrawable numeric, agc_non_withdrawable numeric, agc_bonus numeric, usd_balance numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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

-- Create function to record a wallet transaction
CREATE OR REPLACE FUNCTION public.record_wallet_transaction(
  _account_id UUID,
  _tx_type wallet_tx_type,
  _source agc_source,
  _amount_agcc INTEGER,
  _amount_agc NUMERIC,
  _reference_type TEXT DEFAULT NULL,
  _reference_id UUID DEFAULT NULL,
  _description TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb,
  _created_by UUID DEFAULT NULL
)
RETURNS public.wallet_transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_agcc INTEGER;
  _current_agc NUMERIC;
  _new_agcc INTEGER;
  _new_agc NUMERIC;
  _result public.wallet_transactions;
BEGIN
  SELECT balance_agcc, balance_agc INTO _current_agcc, _current_agc
  FROM public.wallet_balances
  WHERE account_id = _account_id;
  
  _current_agcc := COALESCE(_current_agcc, 0);
  _current_agc := COALESCE(_current_agc, 0);
  
  _new_agcc := _current_agcc + _amount_agcc;
  _new_agc := _current_agc + _amount_agc;
  
  IF _tx_type = 'SPEND' THEN
    IF _new_agc < 0 THEN
      RAISE EXCEPTION 'Insufficient AGC balance. Required: %, Available: %', ABS(_amount_agc), _current_agc;
    END IF;
    IF _new_agcc < 0 THEN
      RAISE EXCEPTION 'Insufficient AGCc balance. Required: %, Available: %', ABS(_amount_agcc), _current_agcc;
    END IF;
  END IF;
  
  INSERT INTO public.wallet_transactions (
    account_id, tx_type, source, amount_agcc, amount_agc,
    balance_agcc_after, balance_agc_after,
    reference_type, reference_id, description, metadata, created_by
  ) VALUES (
    _account_id, _tx_type, _source, _amount_agcc, _amount_agc,
    _new_agcc, _new_agc,
    _reference_type, _reference_id, _description, _metadata, _created_by
  )
  RETURNING * INTO _result;
  
  RETURN _result;
END;
$$;

-- Create function to get user wallet balance
CREATE OR REPLACE FUNCTION public.get_user_wallet_balance(_user_id UUID)
RETURNS TABLE(account_id UUID, balance_agcc INTEGER, balance_agc NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wb.account_id,
    wb.balance_agcc,
    wb.balance_agc
  FROM public.wallet_balances wb
  WHERE wb.owner_type = 'USER' AND wb.owner_id = _user_id
  LIMIT 1;
END;
$$;

-- Create function to ensure user has a wallet account
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _account_id UUID;
BEGIN
  SELECT id INTO _account_id
  FROM public.wallet_accounts
  WHERE owner_type = 'USER' AND owner_id = _user_id;
  
  IF _account_id IS NULL THEN
    INSERT INTO public.wallet_accounts (owner_type, owner_id, currency)
    VALUES ('USER', _user_id, 'USD')
    RETURNING id INTO _account_id;
    
    PERFORM public.record_wallet_transaction(
      _account_id,
      'EARN'::wallet_tx_type,
      'WELCOME_CREDITS'::agc_source,
      5, 0, NULL, NULL,
      'Welcome credits for new account',
      '{}'::jsonb,
      _user_id
    );
  END IF;
  
  RETURN _account_id;
END;
$$;

-- Add unique constraint on votes to prevent duplicates
DO $$ BEGIN
  ALTER TABLE public.votes 
  ADD CONSTRAINT votes_unique_per_session 
  UNIQUE (voter_id, nominee_id, season_id, vote_type);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;