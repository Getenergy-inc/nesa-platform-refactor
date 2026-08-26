
ALTER TABLE public.nomination_intake
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS referral_code text;

ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS referral_code text;

CREATE TABLE IF NOT EXISTS public.nomination_funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step text NOT NULL,
  form_type text,
  award_tier text,
  category_slug text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referral_code text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.nomination_funnel_events TO anon, authenticated;
GRANT SELECT ON public.nomination_funnel_events TO authenticated;
GRANT ALL ON public.nomination_funnel_events TO service_role;

ALTER TABLE public.nomination_funnel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log funnel events" ON public.nomination_funnel_events;
CREATE POLICY "Anyone can log funnel events"
  ON public.nomination_funnel_events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view funnel events" ON public.nomination_funnel_events;
CREATE POLICY "Admins can view funnel events"
  ON public.nomination_funnel_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_nomination_funnel_events_created_at
  ON public.nomination_funnel_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nomination_funnel_events_session
  ON public.nomination_funnel_events (session_id);

DROP FUNCTION IF EXISTS public.submit_public_nomination(text,text,text,jsonb,text,text,text,text,text,text);

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
  p_subcategory text DEFAULT NULL,
  p_utm jsonb DEFAULT NULL,
  p_referral_code text DEFAULT NULL
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
  v_utm jsonb := COALESCE(p_utm, '{}'::jsonb);
  v_code text := nullif(btrim(COALESCE(p_referral_code, '')), '');
  v_referral record;
BEGIN
  IF p_nominee_name IS NULL OR btrim(p_nominee_name) = '' THEN
    RAISE EXCEPTION 'Nominee name is required' USING ERRCODE = 'P0001';
  END IF;

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
    nomination_status, verification_status,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term, referral_code
  ) VALUES (
    v_ref, p_form_type, p_award_tier, p_category_slug, p_subcategory,
    btrim(p_nominee_name), p_nominee_country, p_impact_summary,
    COALESCE(p_payload, '{}'::jsonb), lower(nullif(btrim(p_nominator_email), '')),
    auth.uid(), p_draft_token,
    'Submitted', 'Verification Pending',
    nullif(v_utm->>'utm_source',''), nullif(v_utm->>'utm_medium',''),
    nullif(v_utm->>'utm_campaign',''), nullif(v_utm->>'utm_content',''),
    nullif(v_utm->>'utm_term',''), v_code
  ) RETURNING id INTO v_id;

  IF p_draft_token IS NOT NULL THEN
    UPDATE public.nomination_drafts
       SET status = 'converted', converted_at = now(), updated_at = now()
     WHERE draft_token = p_draft_token;
  END IF;

  -- Referral attribution: only possible for signed-in nominators.
  IF v_code IS NOT NULL AND auth.uid() IS NOT NULL THEN
    SELECT r.owner_type, r.owner_id INTO v_referral
      FROM public.referrals r
     WHERE upper(r.referral_code) = upper(v_code)
       AND COALESCE(r.is_active, true)
     LIMIT 1;

    IF FOUND AND v_referral.owner_id IS DISTINCT FROM auth.uid() THEN
      INSERT INTO public.referral_events(
        referrer_type, referrer_id, referred_user_id, event_type, value_usd, reward_agc, is_paid
      ) VALUES (
        v_referral.owner_type, v_referral.owner_id, auth.uid(),
        'NOMINATION_PAID'::referral_event_type, 0, 0, false
      );
    END IF;
  END IF;

  RETURN QUERY SELECT v_ref, v_id, false;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_public_nomination(text,text,text,jsonb,text,text,text,text,text,text,jsonb,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_public_nomination(text,text,text,jsonb,text,text,text,text,text,text,jsonb,text) TO anon, authenticated, service_role;
