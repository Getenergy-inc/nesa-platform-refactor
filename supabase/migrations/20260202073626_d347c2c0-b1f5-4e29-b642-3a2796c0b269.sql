-- =============================================================
-- FIX 1: Wallet Balances View - Add security_invoker
-- =============================================================
DROP VIEW IF EXISTS public.wallet_balances CASCADE;

CREATE VIEW public.wallet_balances
WITH (security_invoker = true)
AS
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

-- =============================================================
-- FIX 2: Public Nominees View - Exclude PII (email, phone)
-- =============================================================
CREATE VIEW public.public_nominees
WITH (security_invoker = true)
AS
SELECT 
  id, subcategory_id, season_id, name, slug, title, organization, 
  bio, photo_url, logo_url, status, is_platinum, public_votes, 
  jury_score, final_score, renomination_count, region, country,
  acceptance_status, nrc_verified, created_at, updated_at
FROM public.nominees
WHERE status IN ('approved', 'platinum');

GRANT SELECT ON public.public_nominees TO authenticated, anon;

-- Remove the overly permissive public policy
DROP POLICY IF EXISTS "Approved nominees are public" ON public.nominees;