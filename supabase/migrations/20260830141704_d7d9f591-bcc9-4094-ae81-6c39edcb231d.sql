
-- ============ NRC APPLICATIONS ============
CREATE TABLE public.nrc_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  organization text,
  professional_title text,
  motivation text NOT NULL,
  expertise_areas text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  linkedin_url text,
  cv_url text,
  weekly_hours integer,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','under_review','approved','rejected','withdrawn')),
  review_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  invitation_id uuid REFERENCES public.nrc_invitations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX nrc_applications_open_email_idx
  ON public.nrc_applications (lower(email))
  WHERE status IN ('submitted','under_review');

GRANT INSERT ON public.nrc_applications TO anon;
GRANT SELECT, INSERT, UPDATE ON public.nrc_applications TO authenticated;
GRANT ALL ON public.nrc_applications TO service_role;

ALTER TABLE public.nrc_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an NRC application"
  ON public.nrc_applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Applicants can view their own application"
  ON public.nrc_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "NRC leadership can view applications"
  ON public.nrc_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

CREATE POLICY "NRC leadership can update applications"
  ON public.nrc_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

CREATE TRIGGER update_nrc_applications_updated_at
  BEFORE UPDATE ON public.nrc_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ NRC ONBOARDING ============
CREATE TABLE public.nrc_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_completed boolean NOT NULL DEFAULT false,
  identity_verified boolean NOT NULL DEFAULT false,
  appointment_accepted boolean NOT NULL DEFAULT false,
  mou_signed boolean NOT NULL DEFAULT false,
  confidentiality_signed boolean NOT NULL DEFAULT false,
  code_of_conduct boolean NOT NULL DEFAULT false,
  conflict_declared boolean NOT NULL DEFAULT false,
  data_protection boolean NOT NULL DEFAULT false,
  evidence_training boolean NOT NULL DEFAULT false,
  category_training boolean NOT NULL DEFAULT false,
  assessment_passed boolean NOT NULL DEFAULT false,
  activated boolean NOT NULL DEFAULT false,
  activated_at timestamptz,
  activated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.nrc_onboarding TO authenticated;
GRANT ALL ON public.nrc_onboarding TO service_role;

ALTER TABLE public.nrc_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own onboarding"
  ON public.nrc_onboarding FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can create their own onboarding"
  ON public.nrc_onboarding FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members can update their own onboarding"
  ON public.nrc_onboarding FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_nrc_onboarding_updated_at
  BEFORE UPDATE ON public.nrc_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Activation is leadership-only; members cannot self-activate.
CREATE OR REPLACE FUNCTION public.nrc_onboarding_guard()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.activated IS DISTINCT FROM OLD.activated
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only NRC leadership can activate a member';
  END IF;

  IF NEW.profile_completed AND NEW.identity_verified AND NEW.appointment_accepted
     AND NEW.mou_signed AND NEW.confidentiality_signed AND NEW.code_of_conduct
     AND NEW.conflict_declared AND NEW.data_protection AND NEW.evidence_training
     AND NEW.category_training AND NEW.assessment_passed THEN
    NEW.completed_at := COALESCE(NEW.completed_at, now());
  ELSE
    NEW.completed_at := NULL;
  END IF;

  IF NEW.activated AND NEW.activated_at IS NULL THEN
    NEW.activated_at := now();
    NEW.activated_by := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER nrc_onboarding_guard_trg
  BEFORE UPDATE ON public.nrc_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.nrc_onboarding_guard();

-- ============ INVITATION CHECK ============
CREATE OR REPLACE FUNCTION public.nrc_check_invitation(p_token text)
RETURNS TABLE (valid boolean, email_hint text, expires_at timestamptz)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.nrc_invitations%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.nrc_invitations WHERE token = p_token;

  IF inv.id IS NULL
     OR inv.status <> 'pending'
     OR inv.accepted_at IS NOT NULL
     OR inv.expires_at < now() THEN
    RETURN QUERY SELECT false, NULL::text, NULL::timestamptz;
    RETURN;
  END IF;

  RETURN QUERY SELECT
    true,
    regexp_replace(inv.email, '^(.).*(.)@', '\1***\2@'),
    inv.expires_at;
END;
$$;

REVOKE ALL ON FUNCTION public.nrc_check_invitation(text) FROM public;
GRANT EXECUTE ON FUNCTION public.nrc_check_invitation(text) TO anon, authenticated;

-- ============ INVITATION REDEMPTION ============
CREATE OR REPLACE FUNCTION public.redeem_nrc_invitation(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.nrc_invitations%ROWTYPE;
  uid uuid := auth.uid();
  user_email text;
  member_id uuid;
  active_count integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to redeem an NRC invitation';
  END IF;

  SELECT email INTO user_email FROM auth.users WHERE id = uid;

  SELECT * INTO inv FROM public.nrc_invitations WHERE token = p_token FOR UPDATE;

  IF inv.id IS NULL THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;
  IF inv.accepted_at IS NOT NULL OR inv.status <> 'pending' THEN
    RAISE EXCEPTION 'This invitation has already been used';
  END IF;
  IF inv.expires_at < now() THEN
    UPDATE public.nrc_invitations SET status = 'expired' WHERE id = inv.id;
    RAISE EXCEPTION 'This invitation has expired';
  END IF;
  IF lower(inv.email) <> lower(user_email) THEN
    RAISE EXCEPTION 'This invitation was issued to a different email address';
  END IF;

  SELECT count(*) INTO active_count
  FROM public.nrc_members WHERE status IN ('pending','active');
  IF active_count >= 30 THEN
    RAISE EXCEPTION 'The NRC has reached its 30-member limit';
  END IF;

  UPDATE public.nrc_invitations
     SET accepted_at = now(), status = 'accepted'
   WHERE id = inv.id;

  SELECT id INTO member_id FROM public.nrc_members WHERE user_id = uid;

  IF member_id IS NULL THEN
    INSERT INTO public.nrc_members (user_id, invited_by, status, display_name)
    VALUES (
      uid,
      inv.invited_by,
      'pending',
      (SELECT full_name FROM public.profiles WHERE id = uid)
    )
    RETURNING id INTO member_id;
  END IF;

  INSERT INTO public.nrc_onboarding (user_id)
  VALUES (uid)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'nrc')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.nrc_applications
     SET status = 'approved', user_id = COALESCE(user_id, uid)
   WHERE invitation_id = inv.id AND status <> 'approved';

  INSERT INTO public.audit_events (actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (uid, 'nrc', 'nrc_invitation_redeemed', 'nrc_member', member_id,
          jsonb_build_object('invitation_id', inv.id));

  RETURN jsonb_build_object('success', true, 'member_id', member_id);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_nrc_invitation(text) FROM public;
GRANT EXECUTE ON FUNCTION public.redeem_nrc_invitation(text) TO authenticated;

-- ============ APPLICATION DECISIONS ============
CREATE OR REPLACE FUNCTION public.approve_nrc_application(p_application_id uuid, p_notes text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app public.nrc_applications%ROWTYPE;
  uid uuid := auth.uid();
  new_token text := replace(gen_random_uuid()::text, '-', '');
  inv_id uuid;
  active_count integer;
BEGIN
  IF NOT (public.has_role(uid, 'admin') OR public.has_role(uid, 'nrc')) THEN
    RAISE EXCEPTION 'NRC leadership access required';
  END IF;

  SELECT * INTO app FROM public.nrc_applications WHERE id = p_application_id FOR UPDATE;
  IF app.id IS NULL THEN
    RAISE EXCEPTION 'Application not found';
  END IF;
  IF app.status = 'approved' THEN
    RAISE EXCEPTION 'This application has already been approved';
  END IF;

  SELECT count(*) INTO active_count
  FROM public.nrc_members WHERE status IN ('pending','active');
  IF active_count >= 30 THEN
    RAISE EXCEPTION 'The NRC has reached its 30-member limit';
  END IF;

  INSERT INTO public.nrc_invitations (email, token, invited_by, expires_at)
  VALUES (lower(trim(app.email)), new_token, uid, now() + interval '14 days')
  RETURNING id INTO inv_id;

  UPDATE public.nrc_applications
     SET status = 'approved',
         review_notes = COALESCE(p_notes, review_notes),
         reviewed_by = uid,
         reviewed_at = now(),
         invitation_id = inv_id
   WHERE id = p_application_id;

  INSERT INTO public.audit_events (actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (uid, 'nrc', 'nrc_application_approved', 'nrc_application', p_application_id,
          jsonb_build_object('invitation_id', inv_id, 'email', app.email));

  RETURN jsonb_build_object(
    'success', true,
    'invitation_id', inv_id,
    'token', new_token,
    'email', lower(trim(app.email)),
    'full_name', app.full_name
  );
END;
$$;

REVOKE ALL ON FUNCTION public.approve_nrc_application(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.approve_nrc_application(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.reject_nrc_application(p_application_id uuid, p_notes text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF NOT (public.has_role(uid, 'admin') OR public.has_role(uid, 'nrc')) THEN
    RAISE EXCEPTION 'NRC leadership access required';
  END IF;

  UPDATE public.nrc_applications
     SET status = 'rejected',
         review_notes = COALESCE(p_notes, review_notes),
         reviewed_by = uid,
         reviewed_at = now()
   WHERE id = p_application_id;

  INSERT INTO public.audit_events (actor_id, actor_role, action, entity_type, entity_id, metadata)
  VALUES (uid, 'nrc', 'nrc_application_rejected', 'nrc_application', p_application_id,
          jsonb_build_object('notes', p_notes));

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.reject_nrc_application(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.reject_nrc_application(uuid, text) TO authenticated;
