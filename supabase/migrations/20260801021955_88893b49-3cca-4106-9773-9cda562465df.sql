
ALTER TABLE public.nomination_intake
  ADD COLUMN IF NOT EXISTS nominator_email text,
  ADD COLUMN IF NOT EXISTS submitted_by uuid,
  ADD COLUMN IF NOT EXISTS draft_token text;

CREATE UNIQUE INDEX IF NOT EXISTS nomination_intake_draft_token_key
  ON public.nomination_intake(draft_token) WHERE draft_token IS NOT NULL;

CREATE OR REPLACE FUNCTION public.submit_public_nomination(
  p_form_type text,
  p_award_tier text,
  p_category_slug text,
  p_payload jsonb,
  p_nominee_name text,
  p_nominee_country text DEFAULT NULL,
  p_impact_summary text DEFAULT NULL,
  p_nominator_email text DEFAULT NULL,
  p_draft_token text DEFAULT NULL,
  p_subcategory text DEFAULT NULL
)
RETURNS TABLE(reference text, intake_id uuid, is_duplicate boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref text;
  v_id uuid;
  v_exists boolean;
BEGIN
  IF p_nominee_name IS NULL OR btrim(p_nominee_name) = '' THEN
    RAISE EXCEPTION 'Nominee name is required' USING ERRCODE = 'P0001';
  END IF;

  -- Idempotency: the same draft may only ever produce one nomination.
  IF p_draft_token IS NOT NULL THEN
    SELECT ni.record_id, ni.id INTO v_ref, v_id
      FROM public.nomination_intake ni
     WHERE ni.draft_token = p_draft_token;
    IF v_ref IS NOT NULL THEN
      RETURN QUERY SELECT v_ref, v_id, true;
      RETURN;
    END IF;
  END IF;

  LOOP
    v_ref := 'NESA-2026-' || upper(substring(md5(random()::text || clock_timestamp()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.nomination_intake WHERE record_id = v_ref) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;

  INSERT INTO public.nomination_intake(
    record_id, form_type, award_group, award_category, award_subcategory,
    nominee_name_clean, nominee_country_clean, impact_summary_clean,
    raw_payload, nominator_email, submitted_by, draft_token,
    nomination_status, verification_status
  ) VALUES (
    v_ref, p_form_type, p_award_tier, p_category_slug, p_subcategory,
    btrim(p_nominee_name), p_nominee_country, p_impact_summary,
    COALESCE(p_payload, '{}'::jsonb), lower(nullif(btrim(p_nominator_email), '')),
    auth.uid(), p_draft_token,
    'Submitted', 'Verification Pending'
  ) RETURNING id INTO v_id;

  IF p_draft_token IS NOT NULL THEN
    UPDATE public.nomination_drafts
       SET status = 'converted', converted_at = now(), updated_at = now()
     WHERE draft_token = p_draft_token;
  END IF;

  RETURN QUERY SELECT v_ref, v_id, false;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_public_nomination(text,text,text,jsonb,text,text,text,text,text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_public_nomination(text,text,text,jsonb,text,text,text,text,text,text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.link_nomination_to_account(p_reference text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0401';
  END IF;
  UPDATE public.nomination_intake
     SET submitted_by = v_uid, updated_at = now()
   WHERE record_id = p_reference
     AND submitted_by IS NULL;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.link_nomination_to_account(text) FROM public;
GRANT EXECUTE ON FUNCTION public.link_nomination_to_account(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_my_nomination_status(p_reference text)
RETURNS TABLE(reference text, nominee_name text, award_category text, nomination_status text, verification_status text, submitted_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ni.record_id, ni.nominee_name_clean, ni.award_category,
         ni.nomination_status, ni.verification_status, ni.ingested_at
    FROM public.nomination_intake ni
   WHERE ni.record_id = p_reference
     AND auth.uid() IS NOT NULL
     AND ni.submitted_by = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_my_nomination_status(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_nomination_status(text) TO authenticated, service_role;
