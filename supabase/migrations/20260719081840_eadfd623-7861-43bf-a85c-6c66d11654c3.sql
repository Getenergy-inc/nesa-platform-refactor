
-- ============================================================================
-- 2026 Africa Education Icon Judges Arena — panels, ranked-choice grand jury,
-- governance review. Extends the existing icon_jury schema.
-- ============================================================================

-- ---------- 1. Panels & panel membership --------------------------------------
CREATE TABLE IF NOT EXISTS public.icon_judge_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id uuid NOT NULL REFERENCES public.icon_pathways(id) ON DELETE RESTRICT,
  classification_id uuid NOT NULL REFERENCES public.icon_classifications(id) ON DELETE RESTRICT,
  title text NOT NULL,
  chair_judge_id uuid REFERENCES public.icon_judges(id) ON DELETE SET NULL,
  secretary_judge_id uuid REFERENCES public.icon_judges(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, classification_id)
);
GRANT SELECT ON public.icon_judge_panels TO authenticated;
GRANT ALL ON public.icon_judge_panels TO service_role;
ALTER TABLE public.icon_judge_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY icon_panels_read_all_judges ON public.icon_judge_panels
  FOR SELECT TO authenticated
  USING (public.is_icon_judge(auth.uid()));
CREATE POLICY icon_panels_mod_write ON public.icon_judge_panels
  FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid()))
  WITH CHECK (public.is_icon_moderator(auth.uid()));

CREATE TABLE IF NOT EXISTS public.icon_judge_panel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL REFERENCES public.icon_judge_panels(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'judge'
    CHECK (role IN ('judge','chair','secretary','nrc_rep','governance_observer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (panel_id, judge_id)
);
GRANT SELECT ON public.icon_judge_panel_members TO authenticated;
GRANT ALL ON public.icon_judge_panel_members TO service_role;
ALTER TABLE public.icon_judge_panel_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY icon_panel_members_read ON public.icon_judge_panel_members
  FOR SELECT TO authenticated
  USING (public.is_icon_judge(auth.uid()));
CREATE POLICY icon_panel_members_mod ON public.icon_judge_panel_members
  FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid()))
  WITH CHECK (public.is_icon_moderator(auth.uid()));

-- ---------- 2. Panel shortlist / finalists -----------------------------------
CREATE TABLE IF NOT EXISTS public.icon_panel_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL UNIQUE REFERENCES public.icon_judge_panels(id) ON DELETE CASCADE,
  finalist_1_nominee_id uuid REFERENCES public.nominees(id) ON DELETE SET NULL,
  finalist_2_nominee_id uuid REFERENCES public.nominees(id) ON DELETE SET NULL,
  finalist_3_nominee_id uuid REFERENCES public.nominees(id) ON DELETE SET NULL,
  reserve_nominee_id    uuid REFERENCES public.nominees(id) ON DELETE SET NULL,
  justification text,
  chair_signed_at timestamptz,
  secretary_signed_at timestamptz,
  submitted_at timestamptz,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','pending_signoff','submitted','locked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.icon_panel_shortlists TO authenticated;
GRANT ALL ON public.icon_panel_shortlists TO service_role;
ALTER TABLE public.icon_panel_shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY icon_shortlist_panel_read ON public.icon_panel_shortlists
  FOR SELECT TO authenticated
  USING (
    public.is_icon_moderator(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.icon_judge_panel_members m
      JOIN public.icon_judges j ON j.id = m.judge_id
      WHERE m.panel_id = icon_panel_shortlists.panel_id AND j.user_id = auth.uid()
    )
  );
CREATE POLICY icon_shortlist_chair_write ON public.icon_panel_shortlists
  FOR UPDATE TO authenticated
  USING (
    public.is_icon_moderator(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.icon_judge_panel_members m
      JOIN public.icon_judges j ON j.id = m.judge_id
      WHERE m.panel_id = icon_panel_shortlists.panel_id
        AND j.user_id = auth.uid()
        AND m.role IN ('chair','secretary')
    )
  );

CREATE TABLE IF NOT EXISTS public.icon_grand_jury_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid NOT NULL UNIQUE REFERENCES public.icon_judge_panels(id) ON DELETE CASCADE,
  pathway_id uuid NOT NULL REFERENCES public.icon_pathways(id),
  classification_id uuid NOT NULL REFERENCES public.icon_classifications(id),
  title text NOT NULL,
  voting_status text NOT NULL DEFAULT 'pending'
    CHECK (voting_status IN ('pending','open','closed','governance','approved','held')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icon_grand_jury_groups TO authenticated;
GRANT ALL ON public.icon_grand_jury_groups TO service_role;
ALTER TABLE public.icon_grand_jury_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY icon_gj_groups_read ON public.icon_grand_jury_groups
  FOR SELECT TO authenticated USING (public.is_icon_judge(auth.uid()));
CREATE POLICY icon_gj_groups_mod ON public.icon_grand_jury_groups
  FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid()))
  WITH CHECK (public.is_icon_moderator(auth.uid()));

CREATE TABLE IF NOT EXISTS public.icon_grand_jury_finalists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.icon_grand_jury_groups(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE RESTRICT,
  seed_rank int NOT NULL CHECK (seed_rank BETWEEN 1 AND 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, nominee_id),
  UNIQUE (group_id, seed_rank)
);
GRANT SELECT ON public.icon_grand_jury_finalists TO authenticated;
GRANT ALL ON public.icon_grand_jury_finalists TO service_role;
ALTER TABLE public.icon_grand_jury_finalists ENABLE ROW LEVEL SECURITY;
CREATE POLICY icon_gj_finalists_read ON public.icon_grand_jury_finalists
  FOR SELECT TO authenticated USING (public.is_icon_judge(auth.uid()));
CREATE POLICY icon_gj_finalists_mod ON public.icon_grand_jury_finalists
  FOR ALL TO authenticated
  USING (public.is_icon_moderator(auth.uid()))
  WITH CHECK (public.is_icon_moderator(auth.uid()));

-- ---------- 3. Ranked-choice ballots -----------------------------------------
CREATE TABLE IF NOT EXISTS public.icon_grand_jury_ballots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.icon_grand_jury_groups(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES public.icon_judges(id) ON DELETE CASCADE,
  first_choice_nominee_id  uuid NOT NULL REFERENCES public.nominees(id),
  second_choice_nominee_id uuid NOT NULL REFERENCES public.nominees(id),
  third_choice_nominee_id  uuid NOT NULL REFERENCES public.nominees(id),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz NOT NULL DEFAULT now(),
  receipt_hash text NOT NULL,
  ip_address inet,
  user_agent text,
  UNIQUE (group_id, judge_id),
  CHECK (
    first_choice_nominee_id <> second_choice_nominee_id
    AND second_choice_nominee_id <> third_choice_nominee_id
    AND first_choice_nominee_id <> third_choice_nominee_id
  )
);
GRANT SELECT ON public.icon_grand_jury_ballots TO authenticated;
GRANT ALL ON public.icon_grand_jury_ballots TO service_role;
ALTER TABLE public.icon_grand_jury_ballots ENABLE ROW LEVEL SECURITY;

-- Judges may see only their own ballots; moderators/governance see all.
CREATE POLICY icon_ballots_self_read ON public.icon_grand_jury_ballots
  FOR SELECT TO authenticated
  USING (
    public.is_icon_moderator(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.icon_judges j
      WHERE j.id = icon_grand_jury_ballots.judge_id AND j.user_id = auth.uid()
    )
  );
-- Ballots are written only through the RPC (SECURITY DEFINER); no direct INSERT
-- or UPDATE from client. No UPDATE/DELETE policy = append-only for clients.

CREATE TABLE IF NOT EXISTS public.icon_grand_jury_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.icon_grand_jury_groups(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL REFERENCES public.nominees(id),
  first_choice_votes int NOT NULL DEFAULT 0,
  second_choice_votes int NOT NULL DEFAULT 0,
  third_choice_votes int NOT NULL DEFAULT 0,
  points int NOT NULL DEFAULT 0,
  avg_rank numeric(4,2),
  ballot_count int NOT NULL DEFAULT 0,
  is_laureate boolean NOT NULL DEFAULT false,
  tie_flag boolean NOT NULL DEFAULT false,
  computed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, nominee_id)
);
GRANT SELECT ON public.icon_grand_jury_results TO authenticated;
GRANT ALL ON public.icon_grand_jury_results TO service_role;
ALTER TABLE public.icon_grand_jury_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY icon_gj_results_read ON public.icon_grand_jury_results
  FOR SELECT TO authenticated USING (public.is_icon_judge(auth.uid()));

CREATE TABLE IF NOT EXISTS public.icon_governance_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.icon_grand_jury_groups(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('approve','hold','reopen')),
  notes text,
  decided_by uuid REFERENCES auth.users(id),
  decided_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icon_governance_reviews TO authenticated;
GRANT ALL ON public.icon_governance_reviews TO service_role;
ALTER TABLE public.icon_governance_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY icon_gov_reviews_read ON public.icon_governance_reviews
  FOR SELECT TO authenticated USING (public.is_icon_moderator(auth.uid()));

-- ---------- 4. RPCs ----------------------------------------------------------

-- Submit a shortlist (chair or secretary of the panel only)
CREATE OR REPLACE FUNCTION public.submit_icon_shortlist(
  p_panel_id uuid,
  p_finalist_1 uuid,
  p_finalist_2 uuid,
  p_finalist_3 uuid,
  p_reserve uuid,
  p_justification text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_role text;
  v_now timestamptz := now();
  v_shortlist_id uuid;
BEGIN
  IF now() > (SELECT (setting)::timestamptz FROM pg_settings WHERE name = 'server_version') THEN
    -- placeholder no-op; real gate below
    NULL;
  END IF;

  IF p_finalist_1 IN (p_finalist_2, p_finalist_3) OR p_finalist_2 = p_finalist_3 THEN
    RAISE EXCEPTION 'Finalists must be three distinct nominees' USING ERRCODE='P0001';
  END IF;

  SELECT m.role INTO v_role
  FROM public.icon_judge_panel_members m
  JOIN public.icon_judges j ON j.id = m.judge_id
  WHERE m.panel_id = p_panel_id AND j.user_id = auth.uid();

  IF v_role NOT IN ('chair','secretary') AND NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Only the panel chair or secretary may submit the shortlist' USING ERRCODE='P0403';
  END IF;

  INSERT INTO public.icon_panel_shortlists(
    panel_id, finalist_1_nominee_id, finalist_2_nominee_id, finalist_3_nominee_id,
    reserve_nominee_id, justification, submitted_at, status,
    chair_signed_at, secretary_signed_at
  ) VALUES (
    p_panel_id, p_finalist_1, p_finalist_2, p_finalist_3, p_reserve,
    p_justification, v_now, 'submitted',
    CASE WHEN v_role='chair' THEN v_now END,
    CASE WHEN v_role='secretary' THEN v_now END
  )
  ON CONFLICT (panel_id) DO UPDATE SET
    finalist_1_nominee_id = EXCLUDED.finalist_1_nominee_id,
    finalist_2_nominee_id = EXCLUDED.finalist_2_nominee_id,
    finalist_3_nominee_id = EXCLUDED.finalist_3_nominee_id,
    reserve_nominee_id    = EXCLUDED.reserve_nominee_id,
    justification         = EXCLUDED.justification,
    submitted_at          = v_now,
    status                = 'submitted',
    updated_at            = v_now
  RETURNING id INTO v_shortlist_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'shortlist_submitted', 'icon_panel_shortlist', v_shortlist_id,
    jsonb_build_object('panel_id', p_panel_id, 'role', v_role));

  RETURN v_shortlist_id;
END $fn$;

REVOKE ALL ON FUNCTION public.submit_icon_shortlist(uuid,uuid,uuid,uuid,uuid,text) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_icon_shortlist(uuid,uuid,uuid,uuid,uuid,text) TO authenticated;

-- Submit a grand jury ballot (any Icon judge, one per group, during voting window)
CREATE OR REPLACE FUNCTION public.submit_icon_grand_jury_ballot(
  p_group_id uuid,
  p_first uuid,
  p_second uuid,
  p_third uuid
) RETURNS TABLE(ballot_id uuid, receipt text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_judge_id uuid;
  v_open_from  timestamptz := timestamptz '2026-10-01 00:00:00Z';
  v_open_until timestamptz := timestamptz '2026-10-07 23:59:59Z';
  v_valid_count int;
  v_receipt text;
  v_id uuid;
BEGIN
  IF NOT (now() BETWEEN v_open_from AND v_open_until)
     AND NOT public.is_icon_governance(auth.uid()) THEN
    RAISE EXCEPTION 'Grand jury voting is closed' USING ERRCODE='P0403';
  END IF;

  IF p_first IN (p_second, p_third) OR p_second = p_third THEN
    RAISE EXCEPTION 'You must rank three distinct finalists' USING ERRCODE='P0001';
  END IF;

  SELECT id INTO v_judge_id FROM public.icon_judges WHERE user_id = auth.uid();
  IF v_judge_id IS NULL THEN
    RAISE EXCEPTION 'Not an Icon judge' USING ERRCODE='P0403';
  END IF;

  -- All three nominees must actually be finalists for this group
  SELECT COUNT(*) INTO v_valid_count
  FROM public.icon_grand_jury_finalists
  WHERE group_id = p_group_id
    AND nominee_id IN (p_first, p_second, p_third);
  IF v_valid_count <> 3 THEN
    RAISE EXCEPTION 'Ballot contains a nominee that is not a finalist in this group' USING ERRCODE='P0001';
  END IF;

  IF EXISTS (SELECT 1 FROM public.icon_grand_jury_ballots
             WHERE group_id = p_group_id AND judge_id = v_judge_id) THEN
    RAISE EXCEPTION 'Your ballot for this group has already been submitted and locked' USING ERRCODE='P0409';
  END IF;

  v_receipt := encode(
    sha256((v_judge_id::text || p_group_id::text || p_first::text ||
            p_second::text || p_third::text || now()::text)::bytea),
    'hex');

  INSERT INTO public.icon_grand_jury_ballots(
    group_id, judge_id, first_choice_nominee_id, second_choice_nominee_id,
    third_choice_nominee_id, receipt_hash
  ) VALUES (
    p_group_id, v_judge_id, p_first, p_second, p_third, v_receipt
  ) RETURNING id INTO v_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'ballot_submitted', 'icon_grand_jury_ballot', v_id,
    jsonb_build_object('group_id', p_group_id, 'receipt', v_receipt));

  RETURN QUERY SELECT v_id, v_receipt;
END $fn$;

REVOKE ALL ON FUNCTION public.submit_icon_grand_jury_ballot(uuid,uuid,uuid,uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_icon_grand_jury_ballot(uuid,uuid,uuid,uuid) TO authenticated;

-- Compute grand jury results for a group (moderator/governance only)
CREATE OR REPLACE FUNCTION public.compute_icon_grand_jury_results(p_group_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_top_points int;
  v_tie_count int;
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Moderator role required' USING ERRCODE='P0403';
  END IF;

  DELETE FROM public.icon_grand_jury_results WHERE group_id = p_group_id;

  INSERT INTO public.icon_grand_jury_results(
    group_id, nominee_id, first_choice_votes, second_choice_votes,
    third_choice_votes, points, avg_rank, ballot_count
  )
  SELECT
    p_group_id,
    n.nominee_id,
    COUNT(*) FILTER (WHERE n.rank = 1)::int,
    COUNT(*) FILTER (WHERE n.rank = 2)::int,
    COUNT(*) FILTER (WHERE n.rank = 3)::int,
    (COUNT(*) FILTER (WHERE n.rank = 1) * 3
     + COUNT(*) FILTER (WHERE n.rank = 2) * 2
     + COUNT(*) FILTER (WHERE n.rank = 3) * 1)::int,
    ROUND(AVG(n.rank)::numeric, 2),
    COUNT(DISTINCT n.judge_id)::int
  FROM (
    SELECT judge_id, first_choice_nominee_id AS nominee_id, 1 AS rank
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
    UNION ALL
    SELECT judge_id, second_choice_nominee_id, 2
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
    UNION ALL
    SELECT judge_id, third_choice_nominee_id, 3
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
  ) n
  GROUP BY n.nominee_id;

  SELECT MAX(points) INTO v_top_points
    FROM public.icon_grand_jury_results WHERE group_id = p_group_id;

  SELECT COUNT(*) INTO v_tie_count
    FROM public.icon_grand_jury_results
   WHERE group_id = p_group_id AND points = v_top_points;

  UPDATE public.icon_grand_jury_results
     SET is_laureate = (points = v_top_points AND v_tie_count = 1),
         tie_flag    = (points = v_top_points AND v_tie_count > 1)
   WHERE group_id = p_group_id;

  UPDATE public.icon_grand_jury_groups
     SET voting_status = 'closed', updated_at = now()
   WHERE id = p_group_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'results_computed', 'icon_grand_jury_group', p_group_id,
    jsonb_build_object('top_points', v_top_points, 'tie_count', v_tie_count));
END $fn$;

REVOKE ALL ON FUNCTION public.compute_icon_grand_jury_results(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.compute_icon_grand_jury_results(uuid) TO authenticated;

-- Governance decision on a group (approve/hold/reopen)
CREATE OR REPLACE FUNCTION public.icon_governance_decide(
  p_group_id uuid, p_decision text, p_notes text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE v_id uuid; v_new_status text;
BEGIN
  IF NOT public.is_icon_governance(auth.uid()) THEN
    RAISE EXCEPTION 'Governance role required' USING ERRCODE='P0403';
  END IF;
  IF p_decision NOT IN ('approve','hold','reopen') THEN
    RAISE EXCEPTION 'Invalid decision' USING ERRCODE='P0001';
  END IF;

  INSERT INTO public.icon_governance_reviews(group_id, decision, notes, decided_by)
  VALUES (p_group_id, p_decision, p_notes, auth.uid())
  RETURNING id INTO v_id;

  v_new_status := CASE p_decision
    WHEN 'approve' THEN 'approved'
    WHEN 'hold'    THEN 'held'
    WHEN 'reopen'  THEN 'open'
  END;
  UPDATE public.icon_grand_jury_groups
     SET voting_status = v_new_status, updated_at = now()
   WHERE id = p_group_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'governance_' || p_decision, 'icon_grand_jury_group', p_group_id,
    jsonb_build_object('notes', p_notes));

  RETURN v_id;
END $fn$;

REVOKE ALL ON FUNCTION public.icon_governance_decide(uuid,text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.icon_governance_decide(uuid,text,text) TO authenticated;

-- Timestamps
CREATE TRIGGER trg_icon_panels_updated_at BEFORE UPDATE ON public.icon_judge_panels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_icon_shortlists_updated_at BEFORE UPDATE ON public.icon_panel_shortlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_icon_gj_groups_updated_at BEFORE UPDATE ON public.icon_grand_jury_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_icon_panel_members_judge ON public.icon_judge_panel_members(judge_id);
CREATE INDEX IF NOT EXISTS idx_icon_gj_ballots_group    ON public.icon_grand_jury_ballots(group_id);
CREATE INDEX IF NOT EXISTS idx_icon_gj_ballots_judge    ON public.icon_grand_jury_ballots(judge_id);
CREATE INDEX IF NOT EXISTS idx_icon_gj_finalists_group  ON public.icon_grand_jury_finalists(group_id);
CREATE INDEX IF NOT EXISTS idx_icon_gj_results_group    ON public.icon_grand_jury_results(group_id);
