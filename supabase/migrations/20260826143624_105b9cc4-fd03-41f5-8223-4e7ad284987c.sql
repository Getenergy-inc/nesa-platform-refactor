
CREATE OR REPLACE FUNCTION public.record_nomination_referral(p_referral_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text := nullif(btrim(COALESCE(p_referral_code, '')), '');
  v_referral record;
BEGIN
  IF v_code IS NULL OR auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT r.owner_type, r.owner_id INTO v_referral
    FROM public.referrals r
   WHERE upper(r.referral_code) = upper(v_code)
     AND COALESCE(r.is_active, true)
   LIMIT 1;

  IF NOT FOUND OR v_referral.owner_id = auth.uid() THEN
    RETURN false;
  END IF;

  INSERT INTO public.referral_events(
    referrer_type, referrer_id, referred_user_id, event_type, value_usd, reward_agc, is_paid
  ) VALUES (
    v_referral.owner_type, v_referral.owner_id, auth.uid(),
    'NOMINATION_PAID'::referral_event_type, 0, 0, false
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.record_nomination_referral(text) FROM public;
GRANT EXECUTE ON FUNCTION public.record_nomination_referral(text) TO authenticated, service_role;
