REVOKE EXECUTE ON FUNCTION public.mint_acceptance_token(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.export_nomination_batch(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ingest_nomination_intake_batch(jsonb, uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mint_acceptance_token(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.export_nomination_batch(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.ingest_nomination_intake_batch(jsonb, uuid, uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS app_role[] LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT ARRAY_AGG(ur.role) FROM public.user_roles ur
  WHERE ur.user_id = _user_id
    AND (_user_id = auth.uid() OR auth.role() = 'service_role'
         OR EXISTS (SELECT 1 FROM public.user_roles a WHERE a.user_id = auth.uid() AND a.role = 'admin'))
$$;
REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM PUBLIC, anon;

DROP FUNCTION public.update_nomination_draft(text, jsonb, text, text, text, text);
CREATE FUNCTION public.update_nomination_draft(p_token text, p_nominee_data jsonb, p_nominator_email text DEFAULT NULL, p_award_tier text DEFAULT NULL, p_category_slug text DEFAULT NULL, p_subcategory_slug text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_id uuid;
BEGIN
  UPDATE public.nomination_drafts
  SET nominee_data = COALESCE(p_nominee_data, nominee_data),
      nominator_email = COALESCE(p_nominator_email, nominator_email),
      award_tier = COALESCE(p_award_tier, award_tier),
      category_slug = COALESCE(p_category_slug, category_slug),
      subcategory_slug = COALESCE(p_subcategory_slug, subcategory_slug),
      updated_at = now()
  WHERE draft_token = p_token AND expires_at > now() AND status IN ('draft','awaiting_account')
  RETURNING id INTO v_id;
  IF v_id IS NULL THEN
    RAISE EXCEPTION 'Draft not found or expired' USING ERRCODE = 'P0001';
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.update_nomination_draft(text, jsonb, text, text, text, text) TO anon, authenticated, service_role;