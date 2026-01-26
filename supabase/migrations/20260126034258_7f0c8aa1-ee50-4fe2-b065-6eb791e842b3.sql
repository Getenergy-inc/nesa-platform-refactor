-- ============================================================================
-- FIX SECURITY ISSUES & ADD SEED DATA
-- ============================================================================

-- 1) Fix Security Definer View - use security_invoker instead
-- ============================================================================

DROP VIEW IF EXISTS public.wallet_balances;

CREATE VIEW public.wallet_balances 
WITH (security_invoker = true)
AS
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

-- 2) Fix function search_path for generate_referral_code
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_referral_code(p_prefix TEXT DEFAULT 'REF')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 3) Fix handle_new_user_wallet to use user_id instead of id
-- ============================================================================

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
  -- Create wallet account for new user (owner_id = user_id from profiles)
  INSERT INTO public.wallet_accounts (owner_type, owner_id)
  VALUES ('USER', NEW.user_id)
  RETURNING id INTO v_wallet_id;
  
  -- Create referral record with unique code
  v_referral_code := public.generate_referral_code('U');
  INSERT INTO public.referrals (owner_type, owner_id, referral_code)
  VALUES ('USER', NEW.user_id, v_referral_code);
  
  -- Add default USER role_code to existing user_roles entry
  UPDATE public.user_roles 
  SET role_code = 'USER'
  WHERE user_id = NEW.user_id AND role_code IS NULL;
  
  RETURN NEW;
END;
$$;

-- 4) Create Platform wallet account
-- ============================================================================

INSERT INTO public.wallet_accounts (owner_type, owner_id, currency)
VALUES ('PLATFORM', '00000000-0000-0000-0000-000000000000'::uuid, 'USD')
ON CONFLICT (owner_type, owner_id) DO NOTHING;

-- 5) Seed Revenue Splits for active season
-- ============================================================================

INSERT INTO public.revenue_splits (season_id, split_key, percent, destination_description)
SELECT 
  s.id,
  split_key,
  percent,
  description
FROM public.seasons s
CROSS JOIN (VALUES 
  ('NESA_PLATFORM', 40.00, 'NESA Operations & Development'),
  ('EDUAID', 20.00, 'EduAid-Africa Student Support'),
  ('RMSA', 15.00, 'Rebuild My School Africa'),
  ('CVO_FUND', 10.00, 'CVO Office Fund'),
  ('ADMIN_COST', 10.00, 'Administrative Costs'),
  ('CHAPTER_POOL', 5.00, 'Chapter Incentive Pool')
) AS splits(split_key, percent, description)
WHERE s.is_active = true
ON CONFLICT (season_id, split_key) DO NOTHING;