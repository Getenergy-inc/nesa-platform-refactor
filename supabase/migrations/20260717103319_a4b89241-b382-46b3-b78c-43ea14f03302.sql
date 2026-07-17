
CREATE OR REPLACE FUNCTION public.is_icon_judge(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND role_code IN ('ICON_JUDGE','ICON_MODERATOR','ICON_GOVERNANCE'))
$$;

CREATE OR REPLACE FUNCTION public.is_icon_moderator(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND role_code IN ('ICON_MODERATOR','ICON_GOVERNANCE'))
$$;

CREATE OR REPLACE FUNCTION public.is_icon_governance(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND role_code = 'ICON_GOVERNANCE')
$$;

CREATE TABLE public.icon_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icon_pathways TO authenticated;
GRANT ALL ON public.icon_pathways TO service_role;
ALTER TABLE public.icon_pathways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_pathways_read_judges" ON public.icon_pathways FOR SELECT
  TO authenticated USING (public.is_icon_judge(auth.uid()));

CREATE TABLE public.icon_classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icon_classifications TO authenticated;
GRANT ALL ON public.icon_classifications TO service_role;
ALTER TABLE public.icon_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_class_read_judges" ON public.icon_classifications FOR SELECT
  TO authenticated USING (public.is_icon_judge(auth.uid()));

CREATE TABLE public.icon_scoring_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  weight int NOT NULL,
  max_score int NOT NULL DEFAULT 100,
  sort_order int NOT NULL DEFAULT 0,
  description text,
  active boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.icon_scoring_criteria TO authenticated;
GRANT ALL ON public.icon_scoring_criteria TO service_role;
ALTER TABLE public.icon_scoring_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_criteria_read_judges" ON public.icon_scoring_criteria FOR SELECT
  TO authenticated USING (public.is_icon_judge(auth.uid()));

CREATE TABLE public.icon_judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited','registered','onboarding','training_complete','active','suspended','completed')),
  expertise text[],
  region text,
  country text,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judges TO authenticated;
GRANT ALL ON public.icon_judges TO service_role;
ALTER TABLE public.icon_judges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_judges_self_read" ON public.icon_judges FOR SELECT
  TO authenticated USING (user_id = auth.uid() OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_judges_mod_write" ON public.icon_judges FOR ALL
  TO authenticated USING (public.is_icon_moderator(auth.uid()))
  WITH CHECK (public.is_icon_moderator(auth.uid()));
CREATE TRIGGER icon_judges_updated BEFORE UPDATE ON public.icon_judges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_judge_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid UNIQUE NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  photo_url text, bio text, affiliation text, linkedin_url text, availability text,
  confidentiality_signed_at timestamptz,
  code_of_conduct_signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judge_profiles TO authenticated;
GRANT ALL ON public.icon_judge_profiles TO service_role;
ALTER TABLE public.icon_judge_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_profile_self" ON public.icon_judge_profiles FOR ALL TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));
CREATE TRIGGER icon_profile_updated BEFORE UPDATE ON public.icon_judge_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_judge_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24),'hex'),
  invited_by uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  consumed_at timestamptz,
  consumed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icon_judge_invitations TO authenticated;
GRANT ALL ON public.icon_judge_invitations TO service_role;
ALTER TABLE public.icon_judge_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_inv_mod" ON public.icon_judge_invitations FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid())) WITH CHECK (public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_judge_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid UNIQUE NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  identity_verified boolean NOT NULL DEFAULT false,
  profile_completed boolean NOT NULL DEFAULT false,
  confidentiality_signed boolean NOT NULL DEFAULT false,
  conflict_declared boolean NOT NULL DEFAULT false,
  scoring_orientation boolean NOT NULL DEFAULT false,
  sample_review boolean NOT NULL DEFAULT false,
  code_of_conduct boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judge_onboarding TO authenticated;
GRANT ALL ON public.icon_judge_onboarding TO service_role;
ALTER TABLE public.icon_judge_onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_onb_self" ON public.icon_judge_onboarding FOR ALL TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));
CREATE TRIGGER icon_onb_updated BEFORE UPDATE ON public.icon_judge_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_judge_otp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '8 hours'),
  ip_address text, user_agent text
);
GRANT SELECT, INSERT ON public.icon_judge_otp_sessions TO authenticated;
GRANT ALL ON public.icon_judge_otp_sessions TO service_role;
ALTER TABLE public.icon_judge_otp_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_otp_self" ON public.icon_judge_otp_sessions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE INDEX ON public.icon_judge_otp_sessions(user_id, expires_at DESC);

CREATE TABLE public.icon_judge_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL,
  pathway_id uuid NOT NULL REFERENCES public.icon_pathways(id),
  classification_id uuid NOT NULL REFERENCES public.icon_classifications(id),
  deadline timestamptz,
  status text NOT NULL DEFAULT 'assigned'
    CHECK (status IN ('assigned','in_progress','submitted','recused','reassigned','excluded')),
  assigned_by uuid,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (judge_id, nominee_id)
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judge_assignments TO authenticated;
GRANT ALL ON public.icon_judge_assignments TO service_role;
ALTER TABLE public.icon_judge_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_asg_read" ON public.icon_judge_assignments FOR SELECT TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_asg_upd" ON public.icon_judge_assignments FOR UPDATE TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_asg_mod_all" ON public.icon_judge_assignments FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid())) WITH CHECK (public.is_icon_moderator(auth.uid()));
CREATE INDEX ON public.icon_judge_assignments(judge_id, status);
CREATE INDEX ON public.icon_judge_assignments(nominee_id);
CREATE TRIGGER icon_asg_updated BEFORE UPDATE ON public.icon_judge_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_judge_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL,
  conflict_type text NOT NULL
    CHECK (conflict_type IN ('personal','professional','financial','political','institutional','family','prior_collaboration','other')),
  severity text NOT NULL DEFAULT 'potential'
    CHECK (severity IN ('none','potential','recusal')),
  description text,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judge_conflicts TO authenticated;
GRANT ALL ON public.icon_judge_conflicts TO service_role;
ALTER TABLE public.icon_judge_conflicts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_coi_self" ON public.icon_judge_conflicts FOR ALL TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_judge_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid UNIQUE NOT NULL REFERENCES public.icon_judge_assignments(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL,
  total_score numeric,
  recommendation text
    CHECK (recommendation IN ('laureate_consideration','final_discussion','strong_not_final','insufficient_evidence','recuse')),
  evidence_quality_flag text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','locked','reopened','excluded')),
  submitted_at timestamptz,
  locked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_judge_reviews TO authenticated;
GRANT ALL ON public.icon_judge_reviews TO service_role;
ALTER TABLE public.icon_judge_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_rev_self" ON public.icon_judge_reviews FOR ALL TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));
CREATE INDEX ON public.icon_judge_reviews(nominee_id, status);
CREATE TRIGGER icon_rev_updated BEFORE UPDATE ON public.icon_judge_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_judge_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.icon_judge_reviews(id) ON DELETE CASCADE,
  criterion_id uuid NOT NULL REFERENCES public.icon_scoring_criteria(id),
  score int NOT NULL CHECK (score >= 0 AND score <= 100),
  justification text,
  evidence_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (review_id, criterion_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.icon_judge_scores TO authenticated;
GRANT ALL ON public.icon_judge_scores TO service_role;
ALTER TABLE public.icon_judge_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_scores_self" ON public.icon_judge_scores FOR ALL TO authenticated
  USING (review_id IN (
      SELECT r.id FROM public.icon_judge_reviews r
      JOIN public.icon_judges j ON j.id = r.judge_id WHERE j.user_id = auth.uid())
    OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (review_id IN (
      SELECT r.id FROM public.icon_judge_reviews r
      JOIN public.icon_judges j ON j.id = r.judge_id WHERE j.user_id = auth.uid())
    OR public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_judge_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL REFERENCES public.icon_judge_reviews(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL,
  note_type text NOT NULL DEFAULT 'general'
    CHECK (note_type IN ('strengths','concerns','evidence_gaps','comparison','deliberation','recommendation','general')),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.icon_judge_notes TO authenticated;
GRANT ALL ON public.icon_judge_notes TO service_role;
ALTER TABLE public.icon_judge_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_notes_self" ON public.icon_judge_notes FOR ALL TO authenticated
  USING (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_jury_deliberations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id uuid REFERENCES public.icon_pathways(id),
  classification_id uuid REFERENCES public.icon_classifications(id),
  nominee_id uuid,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','decided','closed')),
  decision_summary text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_jury_deliberations TO authenticated;
GRANT ALL ON public.icon_jury_deliberations TO service_role;
ALTER TABLE public.icon_jury_deliberations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_delib_read" ON public.icon_jury_deliberations FOR SELECT TO authenticated
  USING (public.is_icon_judge(auth.uid()));
CREATE POLICY "icon_delib_write" ON public.icon_jury_deliberations FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid())) WITH CHECK (public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_jury_deliberation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deliberation_id uuid NOT NULL REFERENCES public.icon_jury_deliberations(id) ON DELETE CASCADE,
  author_user_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.icon_jury_deliberation_messages TO authenticated;
GRANT ALL ON public.icon_jury_deliberation_messages TO service_role;
ALTER TABLE public.icon_jury_deliberation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_delib_msg_read" ON public.icon_jury_deliberation_messages FOR SELECT TO authenticated
  USING (public.is_icon_judge(auth.uid()));
CREATE POLICY "icon_delib_msg_write" ON public.icon_jury_deliberation_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_icon_judge(auth.uid()) AND author_user_id = auth.uid());

CREATE TABLE public.icon_jury_result_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  computed_by uuid,
  computed_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
GRANT SELECT ON public.icon_jury_result_snapshots TO authenticated;
GRANT ALL ON public.icon_jury_result_snapshots TO service_role;
ALTER TABLE public.icon_jury_result_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_snap_mod" ON public.icon_jury_result_snapshots FOR SELECT TO authenticated
  USING (public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_jury_result_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.icon_jury_result_snapshots(id) ON DELETE CASCADE,
  pathway_id uuid NOT NULL REFERENCES public.icon_pathways(id),
  classification_id uuid NOT NULL REFERENCES public.icon_classifications(id),
  nominee_id uuid,
  average_score numeric, median_score numeric, highest_score numeric, lowest_score numeric,
  score_variance numeric,
  valid_review_count int NOT NULL DEFAULT 0,
  recommendation_summary jsonb,
  status text NOT NULL DEFAULT 'confidential'
    CHECK (status IN ('scoring_open','scoring_closed','under_moderation','awaiting_deliberation','recommended','awaiting_governance','approved_laureate','held_for_clarification','not_selected','confidential')),
  governance_approved_by uuid,
  governance_approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snapshot_id, pathway_id, classification_id, nominee_id)
);
GRANT SELECT ON public.icon_jury_result_positions TO authenticated;
GRANT ALL ON public.icon_jury_result_positions TO service_role;
ALTER TABLE public.icon_jury_result_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_pos_mod" ON public.icon_jury_result_positions FOR SELECT TO authenticated
  USING (public.is_icon_moderator(auth.uid()));
CREATE TRIGGER icon_pos_updated BEFORE UPDATE ON public.icon_jury_result_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.icon_jury_moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.icon_jury_moderation_actions TO authenticated;
GRANT ALL ON public.icon_jury_moderation_actions TO service_role;
ALTER TABLE public.icon_jury_moderation_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_mod_read" ON public.icon_jury_moderation_actions FOR SELECT TO authenticated
  USING (public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_mod_write" ON public.icon_jury_moderation_actions FOR INSERT TO authenticated
  WITH CHECK (public.is_icon_moderator(auth.uid()) AND actor_user_id = auth.uid());

CREATE TABLE public.icon_jury_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  user_id uuid,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.icon_jury_notifications TO authenticated;
GRANT ALL ON public.icon_jury_notifications TO service_role;
ALTER TABLE public.icon_jury_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_notif_self" ON public.icon_jury_notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()
         OR judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()))
  WITH CHECK (user_id = auth.uid()
         OR judge_id IN (SELECT id FROM public.icon_judges WHERE user_id = auth.uid())
         OR public.is_icon_moderator(auth.uid()));

CREATE TABLE public.icon_jury_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text, user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.icon_jury_audit_logs TO authenticated;
GRANT ALL ON public.icon_jury_audit_logs TO service_role;
ALTER TABLE public.icon_jury_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icon_audit_read_mod" ON public.icon_jury_audit_logs FOR SELECT TO authenticated
  USING (public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_audit_write_self" ON public.icon_jury_audit_logs FOR INSERT TO authenticated
  WITH CHECK (actor_user_id = auth.uid() OR public.is_icon_judge(auth.uid()));
CREATE TRIGGER icon_audit_immutable
  BEFORE UPDATE OR DELETE ON public.icon_jury_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

INSERT INTO public.icon_pathways (slug, name, description, sort_order) VALUES
  ('literary-curriculum','Literary & New Curriculum Advocate Icon','Lifetime literary, curriculum and knowledge-systems advocacy for African education.',1),
  ('technical-educator','Africa Technical Educator Icon','Lifetime technical, vocational, scientific and applied education contribution.',2),
  ('education-philanthropy','Africa Education Philanthropy Icon','Lifetime philanthropic investment in African education.',3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.icon_classifications (slug, name, description, sort_order) VALUES
  ('african-in-africa','African in Africa','African national resident and working on the continent.',1),
  ('african-in-diaspora','African in the Diaspora','African national contributing from the diaspora.',2),
  ('friend-of-africa','Friend of Africa','Non-African with outstanding lifetime contribution to African education.',3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.icon_scoring_criteria (slug, name, weight, sort_order, description) VALUES
  ('lifetime-impact','Lifetime Education Impact',25,1,'Depth of lifetime contribution to education.'),
  ('scale-reach','Scale and Reach',15,2,'Breadth and geographic scale of impact.'),
  ('sustainability-legacy','Sustainability and Legacy',15,3,'Durability, institutional legacy, succession.'),
  ('innovation','Innovation or Knowledge Contribution',10,4,'Novel programmes, models or scholarship.'),
  ('inclusion-equity','Inclusion and Equity',10,5,'Reach across gender, disability, geography and income.'),
  ('leadership-integrity','Leadership and Integrity',10,6,'Ethical leadership and personal integrity.'),
  ('evidence-quality','Evidence Quality',10,7,'Independence, verifiability and depth of evidence.'),
  ('continental-relevance','Continental Relevance',5,8,'Alignment with pan-African education priorities.')
ON CONFLICT (slug) DO NOTHING;

CREATE OR REPLACE FUNCTION public.icon_ensure_review(p_assignment_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_review_id uuid; v_a public.icon_judge_assignments;
BEGIN
  SELECT * INTO v_a FROM public.icon_judge_assignments WHERE id = p_assignment_id;
  IF v_a.id IS NULL THEN RAISE EXCEPTION 'Assignment not found'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.icon_judges j WHERE j.id = v_a.judge_id AND j.user_id = auth.uid())
     AND NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorised for this assignment';
  END IF;
  SELECT id INTO v_review_id FROM public.icon_judge_reviews WHERE assignment_id = p_assignment_id;
  IF v_review_id IS NULL THEN
    INSERT INTO public.icon_judge_reviews(assignment_id, judge_id, nominee_id)
    VALUES (v_a.id, v_a.judge_id, v_a.nominee_id) RETURNING id INTO v_review_id;
  END IF;
  RETURN v_review_id;
END $$;

CREATE OR REPLACE FUNCTION public.submit_icon_score(
  p_review_id uuid, p_recommendation text, p_evidence_flag text DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_review public.icon_judge_reviews; v_missing int; v_total numeric;
BEGIN
  SELECT * INTO v_review FROM public.icon_judge_reviews WHERE id = p_review_id;
  IF v_review.id IS NULL THEN RAISE EXCEPTION 'Review not found'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.icon_judges j WHERE j.id = v_review.judge_id AND j.user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  IF v_review.status = 'locked' THEN RAISE EXCEPTION 'Review is locked'; END IF;
  SELECT COUNT(*) INTO v_missing FROM public.icon_scoring_criteria c
    WHERE c.active = true
      AND NOT EXISTS (SELECT 1 FROM public.icon_judge_scores s
                      WHERE s.review_id = p_review_id AND s.criterion_id = c.id);
  IF v_missing > 0 THEN RAISE EXCEPTION 'Missing scores for % criteria', v_missing; END IF;
  SELECT ROUND(SUM(s.score * c.weight)::numeric / 100.0, 2)
    INTO v_total FROM public.icon_judge_scores s
    JOIN public.icon_scoring_criteria c ON c.id = s.criterion_id
   WHERE s.review_id = p_review_id;
  UPDATE public.icon_judge_reviews
     SET status='submitted', total_score=v_total, recommendation=p_recommendation,
         evidence_quality_flag=p_evidence_flag, submitted_at=now(), locked_at=now(), updated_at=now()
   WHERE id = p_review_id;
  UPDATE public.icon_judge_assignments
     SET status='submitted', updated_at=now() WHERE id = v_review.assignment_id;
  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(),'review_submitted','icon_judge_review',p_review_id,
    jsonb_build_object('total_score',v_total,'recommendation',p_recommendation));
END $$;

CREATE OR REPLACE FUNCTION public.declare_icon_conflict(
  p_nominee_id uuid, p_conflict_type text, p_severity text, p_description text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_judge_id uuid; v_id uuid;
BEGIN
  SELECT id INTO v_judge_id FROM public.icon_judges WHERE user_id = auth.uid();
  IF v_judge_id IS NULL THEN RAISE EXCEPTION 'Not an Icon judge'; END IF;
  INSERT INTO public.icon_judge_conflicts(judge_id, nominee_id, conflict_type, severity, description)
  VALUES (v_judge_id, p_nominee_id, p_conflict_type, p_severity, p_description) RETURNING id INTO v_id;
  IF p_severity = 'recusal' THEN
    UPDATE public.icon_judge_assignments SET status='recused', updated_at=now()
     WHERE judge_id = v_judge_id AND nominee_id = p_nominee_id;
  END IF;
  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(),'conflict_declared','icon_judge_conflict',v_id,
    jsonb_build_object('nominee_id',p_nominee_id,'severity',p_severity,'type',p_conflict_type));
  RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION public.reopen_icon_review(p_review_id uuid, p_reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_snapshot jsonb;
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN RAISE EXCEPTION 'Moderator role required'; END IF;
  SELECT to_jsonb(r) INTO v_snapshot FROM public.icon_judge_reviews r WHERE r.id = p_review_id;
  IF v_snapshot IS NULL THEN RAISE EXCEPTION 'Review not found'; END IF;
  UPDATE public.icon_judge_reviews SET status='reopened', locked_at=NULL, updated_at=now()
   WHERE id = p_review_id;
  INSERT INTO public.icon_jury_moderation_actions(actor_user_id, action, target_type, target_id, reason, metadata)
  VALUES (auth.uid(),'review_reopened','icon_judge_review',p_review_id,p_reason,
    jsonb_build_object('original',v_snapshot));
  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(),'review_reopened','icon_judge_review',p_review_id,
    jsonb_build_object('reason',p_reason));
END $$;

CREATE OR REPLACE FUNCTION public.compute_icon_results(p_label text, p_min_reviewers int DEFAULT 3)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_snap uuid;
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN RAISE EXCEPTION 'Moderator role required'; END IF;
  INSERT INTO public.icon_jury_result_snapshots(label, computed_by, metadata)
  VALUES (p_label, auth.uid(), jsonb_build_object('min_reviewers',p_min_reviewers))
  RETURNING id INTO v_snap;

  WITH valid_reviews AS (
    SELECT a.pathway_id, a.classification_id, r.nominee_id, r.total_score, r.recommendation
    FROM public.icon_judge_reviews r
    JOIN public.icon_judge_assignments a ON a.id = r.assignment_id
    WHERE r.status IN ('submitted','locked') AND r.total_score IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.icon_judge_conflicts c
        WHERE c.judge_id = r.judge_id AND c.nominee_id = r.nominee_id AND c.severity = 'recusal')
  ),
  rec_counts AS (
    SELECT pathway_id, classification_id, nominee_id,
      jsonb_object_agg(COALESCE(recommendation,'none'), c) AS rec_summary
    FROM (
      SELECT pathway_id, classification_id, nominee_id, recommendation, COUNT(*)::int AS c
      FROM valid_reviews GROUP BY pathway_id, classification_id, nominee_id, recommendation
    ) t GROUP BY pathway_id, classification_id, nominee_id
  ),
  agg AS (
    SELECT v.pathway_id, v.classification_id, v.nominee_id,
      COUNT(*)::int AS n,
      ROUND(AVG(total_score)::numeric,2) AS avg_s,
      ROUND(percentile_cont(0.5) WITHIN GROUP (ORDER BY total_score)::numeric,2) AS med_s,
      MAX(total_score) AS hi_s, MIN(total_score) AS lo_s,
      ROUND(COALESCE(variance(total_score),0)::numeric,3) AS var_s
    FROM valid_reviews v
    GROUP BY v.pathway_id, v.classification_id, v.nominee_id
    HAVING COUNT(*) >= p_min_reviewers
  )
  INSERT INTO public.icon_jury_result_positions(
    snapshot_id, pathway_id, classification_id, nominee_id,
    average_score, median_score, highest_score, lowest_score, score_variance,
    valid_review_count, recommendation_summary, status
  )
  SELECT v_snap, a.pathway_id, a.classification_id, a.nominee_id,
    a.avg_s, a.med_s, a.hi_s, a.lo_s, a.var_s, a.n, r.rec_summary, 'awaiting_deliberation'
  FROM agg a
  LEFT JOIN rec_counts r
    ON r.pathway_id=a.pathway_id AND r.classification_id=a.classification_id AND r.nominee_id=a.nominee_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(),'results_computed','icon_jury_result_snapshot',v_snap,
    jsonb_build_object('label',p_label,'min_reviewers',p_min_reviewers));
  RETURN v_snap;
END $$;

CREATE OR REPLACE FUNCTION public.approve_icon_laureate(p_position_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NOT public.is_icon_governance(auth.uid()) THEN RAISE EXCEPTION 'Governance role required'; END IF;
  UPDATE public.icon_jury_result_positions
     SET status='approved_laureate', governance_approved_by=auth.uid(),
         governance_approved_at=now(), updated_at=now()
   WHERE id = p_position_id;
  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(),'laureate_approved','icon_jury_result_position',p_position_id,'{}'::jsonb);
END $$;
