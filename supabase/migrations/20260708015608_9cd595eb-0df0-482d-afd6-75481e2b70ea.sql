
-- 1. referral_code column on nominees
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

CREATE INDEX IF NOT EXISTS nominees_referral_code_idx ON public.nominees(referral_code);

-- Backfill referral codes for existing nominees
DO $$
DECLARE r record; v_code text;
BEGIN
  FOR r IN SELECT id FROM public.nominees WHERE referral_code IS NULL LOOP
    LOOP
      v_code := 'N-' || UPPER(SUBSTRING(md5(random()::text || r.id::text), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.nominees WHERE referral_code = v_code);
    END LOOP;
    UPDATE public.nominees SET referral_code = v_code WHERE id = r.id;
  END LOOP;
END $$;

-- 2. mint acceptance token (service-role callers only via GRANT)
CREATE OR REPLACE FUNCTION public.mint_acceptance_token(p_nominee_id uuid)
RETURNS TABLE(token text, email text, name text, expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_expires timestamptz := now() + interval '30 days';
  v_email text;
  v_name text;
BEGIN
  SELECT n.email, n.name INTO v_email, v_name
  FROM public.nominees n WHERE n.id = p_nominee_id;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'Nominee % has no email on record', p_nominee_id;
  END IF;

  v_token := encode(gen_random_bytes(32), 'hex');

  UPDATE public.nominees
     SET acceptance_token = v_token,
         acceptance_token_expires_at = v_expires,
         updated_at = now()
   WHERE id = p_nominee_id;

  RETURN QUERY SELECT v_token, v_email, v_name, v_expires;
END;
$$;

-- 3. accept nomination by token
CREATE OR REPLACE FUNCTION public.accept_nomination_by_token(p_token text)
RETURNS TABLE(nominee_id uuid, slug text, name text, referral_code text, already_accepted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nominee public.nominees%ROWTYPE;
  v_code text;
BEGIN
  SELECT * INTO v_nominee
  FROM public.nominees
  WHERE acceptance_token = p_token
  LIMIT 1;

  IF v_nominee.id IS NULL THEN
    RAISE EXCEPTION 'Invalid acceptance token' USING ERRCODE = 'P0001';
  END IF;

  IF v_nominee.acceptance_token_expires_at IS NOT NULL
     AND v_nominee.acceptance_token_expires_at < now() THEN
    RAISE EXCEPTION 'Acceptance link has expired' USING ERRCODE = 'P0002';
  END IF;

  -- Already accepted: still return their info (idempotent)
  IF v_nominee.acceptance_status = 'ACCEPTED' AND v_nominee.referral_code IS NOT NULL THEN
    RETURN QUERY SELECT v_nominee.id, v_nominee.slug, v_nominee.name,
                        v_nominee.referral_code, true;
    RETURN;
  END IF;

  -- Mint referral code if missing
  IF v_nominee.referral_code IS NULL THEN
    LOOP
      v_code := 'N-' || UPPER(SUBSTRING(md5(random()::text || v_nominee.id::text), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.nominees WHERE referral_code = v_code);
    END LOOP;
  ELSE
    v_code := v_nominee.referral_code;
  END IF;

  UPDATE public.nominees
     SET acceptance_status = 'ACCEPTED',
         accepted_at = COALESCE(accepted_at, now()),
         referral_code = v_code,
         profile_status = CASE WHEN profile_status = 'draft'::nominee_profile_status
                               THEN 'published'::nominee_profile_status
                               ELSE profile_status END,
         updated_at = now()
   WHERE id = v_nominee.id;

  INSERT INTO public.audit_events (action, entity_type, entity_id, metadata)
  VALUES ('nomination_accepted', 'nominee', v_nominee.id,
          jsonb_build_object('slug', v_nominee.slug, 'via', 'acceptance_token'));

  RETURN QUERY SELECT v_nominee.id, v_nominee.slug, v_nominee.name, v_code, false;
END;
$$;

-- 4. Public: record renomination via referral link
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
  v_nominee_id uuid;
  v_count integer;
  v_recent_exists boolean := false;
BEGIN
  SELECT id INTO v_nominee_id
  FROM public.nominees WHERE referral_code = p_referral_code;

  IF v_nominee_id IS NULL THEN
    RAISE EXCEPTION 'Invalid referral code' USING ERRCODE = 'P0001';
  END IF;

  -- Rate limit: same device within 24h for same nominee
  IF p_device_hash IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.renominations
      WHERE nominee_id = v_nominee_id
        AND device_hash = p_device_hash
        AND created_at > now() - interval '24 hours'
    ) INTO v_recent_exists;
  END IF;

  IF v_recent_exists THEN
    SELECT renomination_count INTO v_count FROM public.nominees WHERE id = v_nominee_id;
    RETURN QUERY SELECT v_nominee_id, v_count, true;
    RETURN;
  END IF;

  INSERT INTO public.renominations (
    nominee_id, source, message, device_hash, renominator_name, renominator_email, created_at
  ) VALUES (
    v_nominee_id, 'REFERRAL_LINK', p_message, p_device_hash, p_endorser_name, p_endorser_email, now()
  );

  UPDATE public.nominees
     SET renomination_count = COALESCE(renomination_count, 0) + 1,
         updated_at = now()
   WHERE id = v_nominee_id
  RETURNING renomination_count INTO v_count;

  RETURN QUERY SELECT v_nominee_id, v_count, false;
END;
$$;

-- Grants
REVOKE ALL ON FUNCTION public.mint_acceptance_token(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mint_acceptance_token(uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.accept_nomination_by_token(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.record_renomination_via_referral(text, text, text, text, text)
  TO anon, authenticated, service_role;
