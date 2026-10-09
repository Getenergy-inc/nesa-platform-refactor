
CREATE OR REPLACE FUNCTION public.icon_check_invitation(p_token text)
RETURNS TABLE(valid boolean, full_name text, email_hint text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v record;
BEGIN
  SELECT * INTO v FROM public.icon_judge_invitations
   WHERE token_hash = encode(sha256(p_token::bytea), 'hex');

  IF v IS NULL OR v.consumed_at IS NOT NULL OR v.revoked_at IS NOT NULL
     OR (v.expires_at IS NOT NULL AND v.expires_at < now()) THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text;
  ELSE
    RETURN QUERY SELECT true, v.full_name,
      regexp_replace(v.email, '^(.).*(.)@', '\1'||repeat('*',5)||'\2@');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.redeem_icon_invitation(p_token text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v record;
  v_email text;
  v_judge_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to redeem an invitation' USING ERRCODE='P0403';
  END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id = auth.uid();

  SELECT * INTO v FROM public.icon_judge_invitations
   WHERE token_hash = encode(sha256(p_token::bytea), 'hex')
   FOR UPDATE;

  IF v IS NULL THEN
    RAISE EXCEPTION 'That invitation code is not recognised' USING ERRCODE='P0001';
  END IF;
  IF v.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'That invitation has been revoked' USING ERRCODE='P0403';
  END IF;
  IF v.consumed_at IS NOT NULL THEN
    RAISE EXCEPTION 'That invitation has already been used' USING ERRCODE='P0409';
  END IF;
  IF v.expires_at IS NOT NULL AND v.expires_at < now() THEN
    RAISE EXCEPTION 'That invitation has expired' USING ERRCODE='P0403';
  END IF;
  IF lower(v.email) <> v_email THEN
    RAISE EXCEPTION 'This invitation was issued to a different email address' USING ERRCODE='P0403';
  END IF;

  INSERT INTO public.icon_judges (user_id, full_name, email, status, active)
  VALUES (auth.uid(), COALESCE(v.full_name, v_email), v_email, 'onboarding', false)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
  RETURNING id INTO v_judge_id;

  IF v_judge_id IS NULL THEN
    SELECT id INTO v_judge_id FROM public.icon_judges WHERE user_id = auth.uid();
  END IF;

  INSERT INTO public.user_roles (user_id, role_code, role)
  VALUES (auth.uid(), 'ICON_JUDGE', 'jury')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.icon_judge_onboarding (judge_id) VALUES (v_judge_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.icon_judge_profiles (judge_id) VALUES (v_judge_id)
  ON CONFLICT DO NOTHING;

  UPDATE public.icon_judge_invitations
     SET consumed_at = now(), consumed_by = auth.uid()
   WHERE id = v.id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'invitation_redeemed', 'icon_judge', v_judge_id,
    jsonb_build_object('invitation_id', v.id));

  RETURN v_judge_id;
END $$;

CREATE OR REPLACE FUNCTION public.activate_icon_judge(p_judge_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE o record;
BEGIN
  IF NOT public.is_icon_governance(auth.uid()) THEN
    RAISE EXCEPTION 'Governance role required to activate an appointment' USING ERRCODE='P0403';
  END IF;

  SELECT * INTO o FROM public.icon_judge_onboarding WHERE judge_id = p_judge_id;
  IF o IS NULL
     OR NOT o.profile_completed OR NOT o.confidentiality_signed
     OR NOT o.code_of_conduct OR NOT o.conflict_declared
     OR o.appointment_accepted_at IS NULL OR o.mou_signed_at IS NULL
     OR o.training_completed_at IS NULL OR o.mfa_enrolled_at IS NULL THEN
    RAISE EXCEPTION 'Onboarding and compliance steps are not complete' USING ERRCODE='P0001';
  END IF;

  UPDATE public.icon_judge_onboarding
     SET activated_at = now(), activated_by = auth.uid(), completed_at = COALESCE(completed_at, now())
   WHERE judge_id = p_judge_id;

  UPDATE public.icon_judges SET status = 'active', active = true, updated_at = now()
   WHERE id = p_judge_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'judge_activated', 'icon_judge', p_judge_id, '{}'::jsonb);
END $$;

REVOKE ALL ON FUNCTION public.icon_check_invitation(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_icon_invitation(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.activate_icon_judge(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.icon_check_invitation(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_icon_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.activate_icon_judge(uuid) TO authenticated;
