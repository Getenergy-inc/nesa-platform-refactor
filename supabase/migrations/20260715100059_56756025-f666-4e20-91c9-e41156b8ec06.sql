
-- Nominate-First: draft table + conversion RPCs

CREATE TABLE IF NOT EXISTS public.nomination_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_token text NOT NULL UNIQUE,
  form_type text NOT NULL,
  award_tier text,
  category_slug text,
  subcategory_slug text,
  nominee_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  nominator_email text,
  session_id text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','awaiting_account','converted','expired')),
  converted_to_nomination_id uuid REFERENCES public.nominations(id) ON DELETE SET NULL,
  converted_at timestamptz,
  converted_user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS idx_nomination_drafts_token ON public.nomination_drafts(draft_token);
CREATE INDEX IF NOT EXISTS idx_nomination_drafts_email ON public.nomination_drafts(nominator_email);
CREATE INDEX IF NOT EXISTS idx_nomination_drafts_expires ON public.nomination_drafts(expires_at);

GRANT SELECT, INSERT, UPDATE ON public.nomination_drafts TO authenticated;
GRANT ALL ON public.nomination_drafts TO service_role;

ALTER TABLE public.nomination_drafts ENABLE ROW LEVEL SECURITY;

-- No direct anon/authenticated policies: all access via SECURITY DEFINER RPCs.
-- Authenticated users may see their converted drafts by email:
CREATE POLICY "Users read own converted drafts"
  ON public.nomination_drafts FOR SELECT
  TO authenticated
  USING (
    converted_user_id = auth.uid()
    OR nominator_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE TRIGGER trg_nomination_drafts_updated_at
  BEFORE UPDATE ON public.nomination_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend nominations
ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS source_draft_id uuid REFERENCES public.nomination_drafts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS nomination_reference text UNIQUE,
  ADD COLUMN IF NOT EXISTS email_verification_status text DEFAULT 'pending'
    CHECK (email_verification_status IN ('pending','verified','not_required'));

-- Reference generator
CREATE OR REPLACE FUNCTION public.generate_nomination_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_ref text; v_exists boolean;
BEGIN
  LOOP
    v_ref := 'NESA-2026-' || UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.nominations WHERE nomination_reference = v_ref) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_ref;
END;
$$;

-- Draft token generator
CREATE OR REPLACE FUNCTION public.generate_draft_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_tok text; v_exists boolean;
BEGIN
  LOOP
    v_tok := 'NOM-DRAFT-2026-' || UPPER(SUBSTRING(md5(random()::text || clock_timestamp()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.nomination_drafts WHERE draft_token = v_tok) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_tok;
END;
$$;

-- Create draft (anon or authenticated)
CREATE OR REPLACE FUNCTION public.create_nomination_draft(
  p_form_type text,
  p_award_tier text DEFAULT NULL,
  p_category_slug text DEFAULT NULL,
  p_subcategory_slug text DEFAULT NULL,
  p_nominee_data jsonb DEFAULT '{}'::jsonb,
  p_nominator_email text DEFAULT NULL,
  p_session_id text DEFAULT NULL
) RETURNS TABLE(draft_token text, id uuid, expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_tok text; v_id uuid; v_exp timestamptz;
BEGIN
  v_tok := public.generate_draft_token();
  INSERT INTO public.nomination_drafts(
    draft_token, form_type, award_tier, category_slug, subcategory_slug,
    nominee_data, nominator_email, session_id
  ) VALUES (
    v_tok, p_form_type, p_award_tier, p_category_slug, p_subcategory_slug,
    COALESCE(p_nominee_data, '{}'::jsonb), p_nominator_email, p_session_id
  ) RETURNING nomination_drafts.id, nomination_drafts.expires_at INTO v_id, v_exp;

  INSERT INTO public.audit_events(action, entity_type, entity_id, metadata)
  VALUES ('nomination_draft_created','nomination_draft', v_id,
    jsonb_build_object('form_type', p_form_type, 'category', p_category_slug));

  RETURN QUERY SELECT v_tok, v_id, v_exp;
END;
$$;

-- Load draft by token
CREATE OR REPLACE FUNCTION public.get_nomination_draft(p_token text)
RETURNS public.nomination_drafts
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.nomination_drafts
  WHERE draft_token = p_token AND expires_at > now();
$$;

-- Update draft by token
CREATE OR REPLACE FUNCTION public.update_nomination_draft(
  p_token text,
  p_nominee_data jsonb,
  p_nominator_email text DEFAULT NULL,
  p_award_tier text DEFAULT NULL,
  p_category_slug text DEFAULT NULL,
  p_subcategory_slug text DEFAULT NULL
) RETURNS public.nomination_drafts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_row public.nomination_drafts;
BEGIN
  UPDATE public.nomination_drafts
  SET nominee_data = COALESCE(p_nominee_data, nominee_data),
      nominator_email = COALESCE(p_nominator_email, nominator_email),
      award_tier = COALESCE(p_award_tier, award_tier),
      category_slug = COALESCE(p_category_slug, category_slug),
      subcategory_slug = COALESCE(p_subcategory_slug, subcategory_slug),
      updated_at = now()
  WHERE draft_token = p_token AND expires_at > now() AND status IN ('draft','awaiting_account')
  RETURNING * INTO v_row;

  IF v_row.id IS NULL THEN
    RAISE EXCEPTION 'Draft not found or expired' USING ERRCODE = 'P0001';
  END IF;

  RETURN v_row;
END;
$$;

-- Convert draft to nomination (authenticated only)
CREATE OR REPLACE FUNCTION public.convert_nomination_draft(
  p_token text,
  p_season_id uuid DEFAULT NULL,
  p_subcategory_id uuid DEFAULT NULL
) RETURNS TABLE(nomination_id uuid, nomination_reference text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_draft public.nomination_drafts;
  v_user uuid := auth.uid();
  v_season uuid;
  v_subcat uuid;
  v_nom_id uuid;
  v_ref text;
  v_data jsonb;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'P0401';
  END IF;

  SELECT * INTO v_draft FROM public.nomination_drafts
   WHERE draft_token = p_token AND expires_at > now();

  IF v_draft.id IS NULL THEN
    RAISE EXCEPTION 'Draft not found or expired' USING ERRCODE = 'P0001';
  END IF;

  IF v_draft.status = 'converted' AND v_draft.converted_to_nomination_id IS NOT NULL THEN
    SELECT n.id, n.nomination_reference INTO v_nom_id, v_ref
      FROM public.nominations n WHERE n.id = v_draft.converted_to_nomination_id;
    RETURN QUERY SELECT v_nom_id, v_ref;
    RETURN;
  END IF;

  v_season := COALESCE(p_season_id, public.get_current_season());
  v_subcat := p_subcategory_id;
  v_data := v_draft.nominee_data;
  v_ref := public.generate_nomination_reference();

  INSERT INTO public.nominations(
    season_id, subcategory_id, nominee_name, nominee_title, nominee_organization,
    nominee_bio, nominee_photo_url, evidence_urls, justification, nominator_id,
    source_channel, submission_kind, award_family, award_category_slug, award_subcategory_slug,
    source_draft_id, nomination_reference, email_verification_status, publication_status
  ) VALUES (
    v_season,
    COALESCE(v_subcat, (v_data->>'subcategory_id')::uuid),
    COALESCE(v_data->>'nominee_name', 'Unnamed'),
    v_data->>'nominee_title',
    v_data->>'nominee_organization',
    v_data->>'nominee_bio',
    v_data->>'nominee_photo_url',
    CASE WHEN v_data ? 'evidence_urls'
         THEN ARRAY(SELECT jsonb_array_elements_text(v_data->'evidence_urls'))
         ELSE NULL END,
    v_data->>'justification',
    v_user,
    'web_nominate_first',
    COALESCE(v_draft.form_type, 'native'),
    v_draft.award_tier,
    v_draft.category_slug,
    v_draft.subcategory_slug,
    v_draft.id,
    v_ref,
    CASE WHEN (SELECT email_confirmed_at FROM auth.users WHERE id = v_user) IS NOT NULL
         THEN 'verified' ELSE 'pending' END,
    'draft'
  ) RETURNING id INTO v_nom_id;

  UPDATE public.nomination_drafts
     SET status = 'converted',
         converted_to_nomination_id = v_nom_id,
         converted_user_id = v_user,
         converted_at = now(),
         updated_at = now()
   WHERE id = v_draft.id;

  INSERT INTO public.audit_events(action, entity_type, entity_id, actor_id, metadata)
  VALUES ('nomination_draft_converted','nomination', v_nom_id, v_user,
    jsonb_build_object('draft_id', v_draft.id, 'reference', v_ref, 'form_type', v_draft.form_type));

  RETURN QUERY SELECT v_nom_id, v_ref;
END;
$$;

-- Check if email already has an account (no PII beyond boolean)
CREATE OR REPLACE FUNCTION public.check_email_exists(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE lower(email) = lower(p_email));
$$;

-- Allow anon + authenticated to call these RPCs
GRANT EXECUTE ON FUNCTION public.create_nomination_draft(text,text,text,text,jsonb,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_nomination_draft(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_nomination_draft(text,jsonb,text,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.convert_nomination_draft(text,uuid,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_exists(text) TO anon, authenticated;
