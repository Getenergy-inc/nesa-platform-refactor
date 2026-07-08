
CREATE OR REPLACE FUNCTION public.record_renomination_via_referral(
  p_referral_code text,
  p_message text DEFAULT NULL,
  p_device_hash text DEFAULT NULL,
  p_endorser_name text DEFAULT NULL,
  p_endorser_email text DEFAULT NULL
)
RETURNS TABLE(nominee_id uuid, new_count integer, was_duplicate boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nominee public.nominees%ROWTYPE;
  v_count integer;
  v_recent_exists boolean := false;
BEGIN
  SELECT * INTO v_nominee
  FROM public.nominees WHERE referral_code = p_referral_code;

  IF v_nominee.id IS NULL THEN
    RAISE EXCEPTION 'Invalid referral code' USING ERRCODE = 'P0001';
  END IF;

  IF p_device_hash IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.renominations
      WHERE nominee_id = v_nominee.id
        AND submitter_session_id = p_device_hash
        AND created_at > now() - interval '24 hours'
    ) INTO v_recent_exists;
  END IF;

  IF v_recent_exists THEN
    RETURN QUERY SELECT v_nominee.id, v_nominee.renomination_count, true;
    RETURN;
  END IF;

  INSERT INTO public.renominations (
    nominee_id, nominee_name, nominee_slug, note, contact_email,
    submitter_session_id, status, created_at
  ) VALUES (
    v_nominee.id, v_nominee.name, v_nominee.slug, p_message, p_endorser_email,
    p_device_hash, 'pending', now()
  );

  UPDATE public.nominees
     SET renomination_count = COALESCE(renomination_count, 0) + 1,
         updated_at = now()
   WHERE id = v_nominee.id
  RETURNING renomination_count INTO v_count;

  RETURN QUERY SELECT v_nominee.id, v_count, false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_renomination_via_referral(text, text, text, text, text)
  TO anon, authenticated, service_role;
