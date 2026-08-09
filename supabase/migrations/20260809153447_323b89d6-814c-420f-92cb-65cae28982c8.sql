
-- ============================================================
-- STAGE 1A — structural additions
-- ============================================================

-- Grand jury groups: formal voting window + lock lifecycle
ALTER TABLE public.icon_grand_jury_groups
  ADD COLUMN IF NOT EXISTS voting_opens_at   timestamptz,
  ADD COLUMN IF NOT EXISTS voting_closes_at  timestamptz,
  ADD COLUMN IF NOT EXISTS ballots_locked_at timestamptz,
  ADD COLUMN IF NOT EXISTS results_locked_at timestamptz,
  ADD COLUMN IF NOT EXISTS results_approved_by uuid;

-- Deliberation rooms: room typing + locking + panel scoping
ALTER TABLE public.icon_jury_deliberations
  ADD COLUMN IF NOT EXISTS panel_id  uuid REFERENCES public.icon_judge_panels(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS room_type text NOT NULL DEFAULT 'pathway',
  ADD COLUMN IF NOT EXISTS locked_at timestamptz;

DO $$ BEGIN
  ALTER TABLE public.icon_jury_deliberations
    ADD CONSTRAINT icon_delib_room_type_chk
    CHECK (room_type IN ('pathway','result','final_review'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Message edit-history preservation
ALTER TABLE public.icon_jury_deliberation_messages
  ADD COLUMN IF NOT EXISTS edited_at    timestamptz,
  ADD COLUMN IF NOT EXISTS edit_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deleted_at   timestamptz;

CREATE OR REPLACE FUNCTION public.icon_preserve_message_history()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.body IS DISTINCT FROM OLD.body THEN
    NEW.edit_history := OLD.edit_history || jsonb_build_object(
      'body', OLD.body, 'replaced_at', now(), 'by', auth.uid());
    NEW.edited_at := now();
  END IF;
  NEW.created_at := OLD.created_at;
  NEW.author_user_id := OLD.author_user_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_icon_msg_history ON public.icon_jury_deliberation_messages;
CREATE TRIGGER trg_icon_msg_history BEFORE UPDATE ON public.icon_jury_deliberation_messages
FOR EACH ROW EXECUTE FUNCTION public.icon_preserve_message_history();

-- Invitation tokens stored as SHA-256 hash only
ALTER TABLE public.icon_judge_invitations
  ADD COLUMN IF NOT EXISTS token_hash text,
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz;
UPDATE public.icon_judge_invitations
   SET token_hash = encode(sha256(token::bytea),'hex')
 WHERE token_hash IS NULL AND token IS NOT NULL;
ALTER TABLE public.icon_judge_invitations DROP COLUMN IF EXISTS token;
CREATE UNIQUE INDEX IF NOT EXISTS icon_invitations_token_hash_key
  ON public.icon_judge_invitations(token_hash);

-- Onboarding: extra compliance steps required by governance
ALTER TABLE public.icon_judge_onboarding
  ADD COLUMN IF NOT EXISTS appointment_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS mou_signed_at           timestamptz,
  ADD COLUMN IF NOT EXISTS training_completed_at   timestamptz,
  ADD COLUMN IF NOT EXISTS mfa_enrolled_at         timestamptz,
  ADD COLUMN IF NOT EXISTS activated_at            timestamptz,
  ADD COLUMN IF NOT EXISTS activated_by            uuid;

ALTER TABLE public.icon_judge_profiles
  ADD COLUMN IF NOT EXISTS title       text,
  ADD COLUMN IF NOT EXISTS institution text;

-- Lock state on scorecards / shortlists is enforced below via policies
ALTER TABLE public.icon_panel_shortlists
  ADD COLUMN IF NOT EXISTS locked_at timestamptz;

-- ------------------------------------------------------------
-- Formal reopen requests (never a silent overwrite)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.icon_reopen_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type       text NOT NULL CHECK (entity_type IN ('scorecard','panel_decision','grand_jury_ballot','result')),
  entity_id         uuid NOT NULL,
  requested_by      uuid NOT NULL,
  reason            text NOT NULL CHECK (char_length(reason) >= 20),
  original_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  decided_by        uuid,
  decided_at        timestamptz,
  decision_notes    text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.icon_reopen_requests TO authenticated;
GRANT ALL ON public.icon_reopen_requests TO service_role;
ALTER TABLE public.icon_reopen_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "icon_reopen_read" ON public.icon_reopen_requests
FOR SELECT TO authenticated
USING (requested_by = auth.uid() OR public.is_icon_moderator(auth.uid()));

CREATE POLICY "icon_reopen_request" ON public.icon_reopen_requests
FOR INSERT TO authenticated
WITH CHECK (requested_by = auth.uid() AND public.is_icon_judge(auth.uid()) AND status = 'pending');

CREATE TRIGGER trg_icon_reopen_updated BEFORE UPDATE ON public.icon_reopen_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- STAGE 1B — seed the real 9 pathways (3 categories x 3 communities)
-- ============================================================
INSERT INTO public.icon_judge_panels (pathway_id, classification_id, title, status)
SELECT p.id, c.id, p.name || ' — ' || c.name, 'active'
FROM public.icon_pathways p
CROSS JOIN public.icon_classifications c
WHERE NOT EXISTS (
  SELECT 1 FROM public.icon_judge_panels x
   WHERE x.pathway_id = p.id AND x.classification_id = c.id
);

INSERT INTO public.icon_grand_jury_groups
  (panel_id, pathway_id, classification_id, title, voting_status, voting_opens_at, voting_closes_at)
SELECT pl.id, pl.pathway_id, pl.classification_id, pl.title, 'pending',
       timestamptz '2026-10-01 00:00:00Z', timestamptz '2026-10-07 23:59:59Z'
FROM public.icon_judge_panels pl
WHERE NOT EXISTS (SELECT 1 FROM public.icon_grand_jury_groups g WHERE g.panel_id = pl.id);

-- One deliberation room per panel + one result room per panel + final review room
INSERT INTO public.icon_jury_deliberations (panel_id, pathway_id, classification_id, title, status, room_type)
SELECT pl.id, pl.pathway_id, pl.classification_id, pl.title || ' — Deliberation Room', 'open', 'pathway'
FROM public.icon_judge_panels pl
WHERE NOT EXISTS (
  SELECT 1 FROM public.icon_jury_deliberations d WHERE d.panel_id = pl.id AND d.room_type = 'pathway');

INSERT INTO public.icon_jury_deliberations (panel_id, pathway_id, classification_id, title, status, room_type)
SELECT pl.id, pl.pathway_id, pl.classification_id, pl.title || ' — Result Room', 'open', 'result'
FROM public.icon_judge_panels pl
WHERE NOT EXISTS (
  SELECT 1 FROM public.icon_jury_deliberations d WHERE d.panel_id = pl.id AND d.room_type = 'result');

INSERT INTO public.icon_jury_deliberations (title, status, room_type)
SELECT 'Final 27-Judge Results Review Room', 'open', 'final_review'
WHERE NOT EXISTS (SELECT 1 FROM public.icon_jury_deliberations WHERE room_type = 'final_review');

-- ============================================================
-- STAGE 1C — helper predicates
-- ============================================================
CREATE OR REPLACE FUNCTION public.icon_my_judge_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.icon_judges WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.icon_is_panel_member(_panel_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.icon_judge_panel_members m
    JOIN public.icon_judges j ON j.id = m.judge_id
    WHERE m.panel_id = _panel_id AND j.user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.icon_is_recused(_judge_id uuid, _panel_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.icon_judge_conflicts c
    JOIN public.icon_judge_assignments a
      ON a.nominee_id = c.nominee_id AND a.judge_id = c.judge_id
    JOIN public.icon_judge_panels pl
      ON pl.pathway_id = a.pathway_id AND pl.classification_id = a.classification_id
    WHERE c.judge_id = _judge_id
      AND pl.id = _panel_id
      AND c.resolved_at IS NULL
  )
$$;

-- ============================================================
-- STAGE 1D — RLS hardening
-- ============================================================

-- 1. Results are invisible until the vote is formally locked
DROP POLICY IF EXISTS icon_gj_results_read ON public.icon_grand_jury_results;
CREATE POLICY "icon_gj_results_read_locked_only" ON public.icon_grand_jury_results
FOR SELECT TO authenticated
USING (
  public.is_icon_moderator(auth.uid())
  OR (
    public.is_icon_judge(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.icon_grand_jury_groups g
      WHERE g.id = icon_grand_jury_results.group_id
        AND g.results_locked_at IS NOT NULL
    )
  )
);

-- 2. Deliberations + messages scoped to panel membership
DROP POLICY IF EXISTS icon_delib_read ON public.icon_jury_deliberations;
CREATE POLICY "icon_delib_read_scoped" ON public.icon_jury_deliberations
FOR SELECT TO authenticated
USING (
  public.is_icon_moderator(auth.uid())
  OR (
    public.is_icon_judge(auth.uid())
    AND (room_type = 'final_review' OR panel_id IS NULL OR public.icon_is_panel_member(panel_id))
  )
);

DROP POLICY IF EXISTS icon_delib_msg_read ON public.icon_jury_deliberation_messages;
CREATE POLICY "icon_delib_msg_read_scoped" ON public.icon_jury_deliberation_messages
FOR SELECT TO authenticated
USING (
  public.is_icon_moderator(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.icon_jury_deliberations d
    WHERE d.id = icon_jury_deliberation_messages.deliberation_id
      AND public.is_icon_judge(auth.uid())
      AND (d.room_type = 'final_review' OR d.panel_id IS NULL OR public.icon_is_panel_member(d.panel_id))
  )
);

DROP POLICY IF EXISTS icon_delib_msg_write ON public.icon_jury_deliberation_messages;
CREATE POLICY "icon_delib_msg_write_scoped" ON public.icon_jury_deliberation_messages
FOR INSERT TO authenticated
WITH CHECK (
  author_user_id = auth.uid()
  AND public.is_icon_judge(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.icon_jury_deliberations d
    WHERE d.id = deliberation_id
      AND d.locked_at IS NULL
      AND (d.room_type = 'final_review' OR d.panel_id IS NULL OR public.icon_is_panel_member(d.panel_id))
  )
);

CREATE POLICY "icon_delib_msg_edit_own" ON public.icon_jury_deliberation_messages
FOR UPDATE TO authenticated
USING (author_user_id = auth.uid() AND deleted_at IS NULL
  AND EXISTS (SELECT 1 FROM public.icon_jury_deliberations d
              WHERE d.id = deliberation_id AND d.locked_at IS NULL))
WITH CHECK (author_user_id = auth.uid());

-- 3. Locked scorecards / notes / shortlists become read-only at the policy level
DROP POLICY IF EXISTS icon_rev_self ON public.icon_judge_reviews;
CREATE POLICY "icon_rev_read_self" ON public.icon_judge_reviews
FOR SELECT TO authenticated
USING (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_rev_insert_self" ON public.icon_judge_reviews
FOR INSERT TO authenticated
WITH CHECK (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_rev_update_unlocked" ON public.icon_judge_reviews
FOR UPDATE TO authenticated
USING (locked_at IS NULL AND (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid())))
WITH CHECK (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));

DROP POLICY IF EXISTS icon_scores_self ON public.icon_judge_scores;
CREATE POLICY "icon_scores_read_self" ON public.icon_judge_scores
FOR SELECT TO authenticated
USING (public.is_icon_moderator(auth.uid()) OR EXISTS (
  SELECT 1 FROM public.icon_judge_reviews r
  WHERE r.id = icon_judge_scores.review_id AND r.judge_id = public.icon_my_judge_id()));
CREATE POLICY "icon_scores_write_unlocked" ON public.icon_judge_scores
FOR ALL TO authenticated
USING (public.is_icon_moderator(auth.uid()) OR EXISTS (
  SELECT 1 FROM public.icon_judge_reviews r
  WHERE r.id = icon_judge_scores.review_id
    AND r.judge_id = public.icon_my_judge_id() AND r.locked_at IS NULL))
WITH CHECK (public.is_icon_moderator(auth.uid()) OR EXISTS (
  SELECT 1 FROM public.icon_judge_reviews r
  WHERE r.id = review_id
    AND r.judge_id = public.icon_my_judge_id() AND r.locked_at IS NULL));

DROP POLICY IF EXISTS icon_shortlist_chair_write ON public.icon_panel_shortlists;
CREATE POLICY "icon_shortlist_update_unlocked" ON public.icon_panel_shortlists
FOR UPDATE TO authenticated
USING (
  locked_at IS NULL AND (
    public.is_icon_moderator(auth.uid())
    OR EXISTS (SELECT 1 FROM public.icon_judge_panel_members m
               JOIN public.icon_judges j ON j.id = m.judge_id
               WHERE m.panel_id = icon_panel_shortlists.panel_id
                 AND j.user_id = auth.uid() AND m.role IN ('chair','secretary')))
)
WITH CHECK (locked_at IS NULL);

-- 4. Assignments: a judge may only progress their OWN assignment
DROP POLICY IF EXISTS icon_asg_upd ON public.icon_judge_assignments;
CREATE POLICY "icon_asg_upd_own" ON public.icon_judge_assignments
FOR UPDATE TO authenticated
USING (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()))
WITH CHECK (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));

-- 5. A judge may declare a conflict but never delete/alter it
DROP POLICY IF EXISTS icon_coi_self ON public.icon_judge_conflicts;
CREATE POLICY "icon_coi_read" ON public.icon_judge_conflicts
FOR SELECT TO authenticated
USING (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_coi_declare" ON public.icon_judge_conflicts
FOR INSERT TO authenticated
WITH CHECK (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_coi_resolve_moderator" ON public.icon_judge_conflicts
FOR UPDATE TO authenticated
USING (public.is_icon_moderator(auth.uid())) WITH CHECK (public.is_icon_moderator(auth.uid()));
CREATE POLICY "icon_coi_delete_moderator" ON public.icon_judge_conflicts
FOR DELETE TO authenticated USING (public.is_icon_moderator(auth.uid()));

-- 6. Judge directory: fellow judges are visible to authenticated judges only
CREATE POLICY "icon_judges_directory_read" ON public.icon_judges
FOR SELECT TO authenticated
USING (public.is_icon_judge(auth.uid()));
CREATE POLICY "icon_profiles_directory_read" ON public.icon_judge_profiles
FOR SELECT TO authenticated
USING (public.is_icon_judge(auth.uid()));

-- 7. Notes stay strictly private and immutable once their review is locked
DROP POLICY IF EXISTS icon_notes_self ON public.icon_judge_notes;
CREATE POLICY "icon_notes_read_self" ON public.icon_judge_notes
FOR SELECT TO authenticated USING (judge_id = public.icon_my_judge_id());
CREATE POLICY "icon_notes_write_self" ON public.icon_judge_notes
FOR INSERT TO authenticated WITH CHECK (judge_id = public.icon_my_judge_id());
CREATE POLICY "icon_notes_update_self" ON public.icon_judge_notes
FOR UPDATE TO authenticated
USING (judge_id = public.icon_my_judge_id()
  AND NOT EXISTS (SELECT 1 FROM public.icon_judge_reviews r
                  WHERE r.id = icon_judge_notes.review_id AND r.locked_at IS NOT NULL))
WITH CHECK (judge_id = public.icon_my_judge_id());
CREATE POLICY "icon_notes_delete_self" ON public.icon_judge_notes
FOR DELETE TO authenticated USING (judge_id = public.icon_my_judge_id());

-- 8. Ballots: no direct client writes at all (RPC-only)
DROP POLICY IF EXISTS icon_ballots_self_read ON public.icon_grand_jury_ballots;
CREATE POLICY "icon_ballots_read_own" ON public.icon_grand_jury_ballots
FOR SELECT TO authenticated
USING (judge_id = public.icon_my_judge_id() OR public.is_icon_moderator(auth.uid()));

-- 9. Audit log is append-only
DROP TRIGGER IF EXISTS trg_icon_audit_immutable ON public.icon_jury_audit_logs;
CREATE TRIGGER trg_icon_audit_immutable
BEFORE UPDATE OR DELETE ON public.icon_jury_audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- ============================================================
-- STAGE 1E — corrected + hardened server-side operations
-- ============================================================

-- Ranked-choice: 1st = 1pt, 2nd = 2pts, 3rd = 3pts, LOWEST total wins.
CREATE OR REPLACE FUNCTION public.compute_icon_grand_jury_results(p_group_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_best_points int;
  v_tie_count int;
  v_ballots int;
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Moderator role required' USING ERRCODE='P0403';
  END IF;

  IF EXISTS (SELECT 1 FROM public.icon_grand_jury_groups
             WHERE id = p_group_id AND results_locked_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Results for this pathway are locked; a governance reopen request is required'
      USING ERRCODE='P0409';
  END IF;

  SELECT COUNT(*) INTO v_ballots
    FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id;
  IF v_ballots = 0 THEN
    RAISE EXCEPTION 'No ballots cast for this pathway' USING ERRCODE='P0001';
  END IF;

  DELETE FROM public.icon_grand_jury_results WHERE group_id = p_group_id;

  INSERT INTO public.icon_grand_jury_results(
    group_id, nominee_id, first_choice_votes, second_choice_votes,
    third_choice_votes, points, avg_rank, ballot_count)
  SELECT
    p_group_id,
    f.nominee_id,
    COUNT(*) FILTER (WHERE r.rank = 1)::int,
    COUNT(*) FILTER (WHERE r.rank = 2)::int,
    COUNT(*) FILTER (WHERE r.rank = 3)::int,
    -- 1st=1, 2nd=2, 3rd=3; an unranked finalist takes a 4-point penalty
    (COUNT(*) FILTER (WHERE r.rank = 1) * 1
     + COUNT(*) FILTER (WHERE r.rank = 2) * 2
     + COUNT(*) FILTER (WHERE r.rank = 3) * 3
     + (v_ballots - COUNT(r.rank)) * 4)::int,
    ROUND(AVG(COALESCE(r.rank, 4))::numeric, 2),
    v_ballots
  FROM public.icon_grand_jury_finalists f
  LEFT JOIN (
    SELECT judge_id, first_choice_nominee_id AS nominee_id, 1 AS rank
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
    UNION ALL
    SELECT judge_id, second_choice_nominee_id, 2
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
    UNION ALL
    SELECT judge_id, third_choice_nominee_id, 3
      FROM public.icon_grand_jury_ballots WHERE group_id = p_group_id
  ) r ON r.nominee_id = f.nominee_id
  WHERE f.group_id = p_group_id
  GROUP BY f.nominee_id;

  SELECT MIN(points) INTO v_best_points
    FROM public.icon_grand_jury_results WHERE group_id = p_group_id;
  SELECT COUNT(*) INTO v_tie_count
    FROM public.icon_grand_jury_results
   WHERE group_id = p_group_id AND points = v_best_points;

  UPDATE public.icon_grand_jury_results
     SET is_laureate = (points = v_best_points AND v_tie_count = 1),
         tie_flag    = (points = v_best_points AND v_tie_count > 1)
   WHERE group_id = p_group_id;

  UPDATE public.icon_grand_jury_groups
     SET voting_status = 'tallied', updated_at = now()
   WHERE id = p_group_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'results_computed', 'icon_grand_jury_group', p_group_id,
    jsonb_build_object('winning_points', v_best_points, 'tie_count', v_tie_count,
                       'ballots', v_ballots, 'rule', 'lowest_total_wins'));
END $$;

-- Publish/lock results — the ONLY way results become visible to judges
CREATE OR REPLACE FUNCTION public.lock_icon_grand_jury_results(p_group_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_icon_governance(auth.uid()) THEN
    RAISE EXCEPTION 'Governance role required to lock results' USING ERRCODE='P0403';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.icon_grand_jury_results WHERE group_id = p_group_id) THEN
    RAISE EXCEPTION 'Results have not been computed for this pathway' USING ERRCODE='P0001';
  END IF;

  UPDATE public.icon_grand_jury_groups
     SET results_locked_at = COALESCE(results_locked_at, now()),
         ballots_locked_at = COALESCE(ballots_locked_at, now()),
         results_approved_by = auth.uid(),
         voting_status = 'locked',
         updated_at = now()
   WHERE id = p_group_id;

  UPDATE public.icon_grand_jury_ballots
     SET locked_at = COALESCE(locked_at, now())
   WHERE group_id = p_group_id;

  UPDATE public.icon_jury_deliberations
     SET locked_at = COALESCE(locked_at, now()), status = 'locked'
   WHERE room_type = 'result'
     AND panel_id = (SELECT panel_id FROM public.icon_grand_jury_groups WHERE id = p_group_id);

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'results_locked', 'icon_grand_jury_group', p_group_id, '{}'::jsonb);
END $$;

-- Materialise Grand Jury finalists once a panel decision is locked
CREATE OR REPLACE FUNCTION public.prepare_icon_grand_jury_ballots(p_group_id uuid)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_panel_id uuid;
  v_sl record;
  v_count int := 0;
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Moderator role required' USING ERRCODE='P0403';
  END IF;

  SELECT panel_id INTO v_panel_id FROM public.icon_grand_jury_groups WHERE id = p_group_id;
  IF v_panel_id IS NULL THEN
    RAISE EXCEPTION 'Unknown grand jury group' USING ERRCODE='P0001';
  END IF;

  SELECT * INTO v_sl FROM public.icon_panel_shortlists WHERE panel_id = v_panel_id;
  IF v_sl IS NULL OR v_sl.locked_at IS NULL THEN
    RAISE EXCEPTION 'The panel decision for this pathway is not locked yet' USING ERRCODE='P0001';
  END IF;

  DELETE FROM public.icon_grand_jury_finalists WHERE group_id = p_group_id;
  INSERT INTO public.icon_grand_jury_finalists(group_id, nominee_id, seed_rank)
  VALUES (p_group_id, v_sl.finalist_1_nominee_id, 1),
         (p_group_id, v_sl.finalist_2_nominee_id, 2),
         (p_group_id, v_sl.finalist_3_nominee_id, 3);
  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.icon_grand_jury_groups
     SET voting_status = 'open', updated_at = now()
   WHERE id = p_group_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'grand_jury_prepared', 'icon_grand_jury_group', p_group_id,
    jsonb_build_object('finalists', v_count));

  RETURN v_count;
END $$;

-- Lock a panel decision (finalists + reserve)
CREATE OR REPLACE FUNCTION public.lock_icon_shortlist(p_panel_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Moderator role required' USING ERRCODE='P0403';
  END IF;
  UPDATE public.icon_panel_shortlists
     SET locked_at = COALESCE(locked_at, now()), status = 'locked', updated_at = now()
   WHERE panel_id = p_panel_id;
  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'panel_decision_locked', 'icon_judge_panel', p_panel_id, '{}'::jsonb);
END $$;

-- Shortlist submission: reject writes once locked, drop the dead placeholder block
CREATE OR REPLACE FUNCTION public.submit_icon_shortlist(
  p_panel_id uuid, p_finalist_1 uuid, p_finalist_2 uuid, p_finalist_3 uuid,
  p_reserve uuid, p_justification text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role text;
  v_now timestamptz := now();
  v_shortlist_id uuid;
BEGIN
  IF p_finalist_1 IN (p_finalist_2, p_finalist_3) OR p_finalist_2 = p_finalist_3 THEN
    RAISE EXCEPTION 'Finalists must be three distinct nominees' USING ERRCODE='P0001';
  END IF;
  IF p_reserve IN (p_finalist_1, p_finalist_2, p_finalist_3) THEN
    RAISE EXCEPTION 'The reserve nominee must differ from the three finalists' USING ERRCODE='P0001';
  END IF;

  IF EXISTS (SELECT 1 FROM public.icon_panel_shortlists
             WHERE panel_id = p_panel_id AND locked_at IS NOT NULL) THEN
    RAISE EXCEPTION 'This panel decision is locked; a governance reopen request is required'
      USING ERRCODE='P0409';
  END IF;

  SELECT m.role INTO v_role
  FROM public.icon_judge_panel_members m
  JOIN public.icon_judges j ON j.id = m.judge_id
  WHERE m.panel_id = p_panel_id AND j.user_id = auth.uid();

  IF COALESCE(v_role,'') NOT IN ('chair','secretary') AND NOT public.is_icon_moderator(auth.uid()) THEN
    RAISE EXCEPTION 'Only the panel chair or secretary may submit the shortlist' USING ERRCODE='P0403';
  END IF;

  INSERT INTO public.icon_panel_shortlists(
    panel_id, finalist_1_nominee_id, finalist_2_nominee_id, finalist_3_nominee_id,
    reserve_nominee_id, justification, submitted_at, status,
    chair_signed_at, secretary_signed_at)
  VALUES (p_panel_id, p_finalist_1, p_finalist_2, p_finalist_3, p_reserve,
    p_justification, v_now, 'submitted',
    CASE WHEN v_role='chair' THEN v_now END,
    CASE WHEN v_role='secretary' THEN v_now END)
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
END $$;

-- Grand jury ballot: revisable until close, then locked; recusal enforced
CREATE OR REPLACE FUNCTION public.submit_icon_grand_jury_ballot(
  p_group_id uuid, p_first uuid, p_second uuid, p_third uuid)
RETURNS TABLE(ballot_id uuid, receipt text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_judge_id uuid;
  v_group record;
  v_valid_count int;
  v_receipt text;
  v_id uuid;
BEGIN
  SELECT * INTO v_group FROM public.icon_grand_jury_groups WHERE id = p_group_id;
  IF v_group IS NULL THEN
    RAISE EXCEPTION 'Unknown grand jury group' USING ERRCODE='P0001';
  END IF;

  IF v_group.ballots_locked_at IS NOT NULL OR v_group.results_locked_at IS NOT NULL THEN
    RAISE EXCEPTION 'Voting for this pathway is locked' USING ERRCODE='P0403';
  END IF;

  IF v_group.voting_status <> 'open'
     OR NOT (now() BETWEEN COALESCE(v_group.voting_opens_at, now())
                       AND COALESCE(v_group.voting_closes_at, now())) THEN
    IF NOT public.is_icon_governance(auth.uid()) THEN
      RAISE EXCEPTION 'Grand jury voting is not open for this pathway' USING ERRCODE='P0403';
    END IF;
  END IF;

  IF p_first IS NULL OR p_second IS NULL OR p_third IS NULL THEN
    RAISE EXCEPTION 'All three ranks must be filled' USING ERRCODE='P0001';
  END IF;
  IF p_first IN (p_second, p_third) OR p_second = p_third THEN
    RAISE EXCEPTION 'You must rank three distinct finalists' USING ERRCODE='P0001';
  END IF;

  v_judge_id := public.icon_my_judge_id();
  IF v_judge_id IS NULL OR NOT public.is_icon_judge(auth.uid()) THEN
    RAISE EXCEPTION 'Not an Icon judge' USING ERRCODE='P0403';
  END IF;

  IF public.icon_is_recused(v_judge_id, v_group.panel_id) THEN
    RAISE EXCEPTION 'You have declared a conflict of interest on this pathway and cannot vote'
      USING ERRCODE='P0403';
  END IF;

  SELECT COUNT(*) INTO v_valid_count
  FROM public.icon_grand_jury_finalists
  WHERE group_id = p_group_id AND nominee_id IN (p_first, p_second, p_third);
  IF v_valid_count <> 3 THEN
    RAISE EXCEPTION 'Ballot contains a nominee that is not a finalist in this pathway'
      USING ERRCODE='P0001';
  END IF;

  v_receipt := encode(sha256((v_judge_id::text || p_group_id::text || p_first::text ||
    p_second::text || p_third::text || now()::text)::bytea), 'hex');

  INSERT INTO public.icon_grand_jury_ballots(
    group_id, judge_id, first_choice_nominee_id, second_choice_nominee_id,
    third_choice_nominee_id, receipt_hash)
  VALUES (p_group_id, v_judge_id, p_first, p_second, p_third, v_receipt)
  ON CONFLICT (group_id, judge_id) DO UPDATE SET
    first_choice_nominee_id  = EXCLUDED.first_choice_nominee_id,
    second_choice_nominee_id = EXCLUDED.second_choice_nominee_id,
    third_choice_nominee_id  = EXCLUDED.third_choice_nominee_id,
    receipt_hash             = EXCLUDED.receipt_hash,
    submitted_at             = now()
  RETURNING id INTO v_id;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'ballot_submitted', 'icon_grand_jury_ballot', v_id,
    jsonb_build_object('group_id', p_group_id, 'receipt', v_receipt));

  RETURN QUERY SELECT v_id, v_receipt;
END $$;

-- Governance decision on a reopen request (preserves the original record)
CREATE OR REPLACE FUNCTION public.decide_icon_reopen_request(
  p_request_id uuid, p_approve boolean, p_notes text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF NOT public.is_icon_governance(auth.uid()) THEN
    RAISE EXCEPTION 'Governance role required' USING ERRCODE='P0403';
  END IF;
  SELECT * INTO r FROM public.icon_reopen_requests WHERE id = p_request_id AND status = 'pending';
  IF r IS NULL THEN
    RAISE EXCEPTION 'No pending reopen request with that id' USING ERRCODE='P0001';
  END IF;

  UPDATE public.icon_reopen_requests
     SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
         decided_by = auth.uid(), decided_at = now(), decision_notes = p_notes
   WHERE id = p_request_id;

  IF p_approve THEN
    IF r.entity_type = 'scorecard' THEN
      UPDATE public.icon_judge_reviews SET locked_at = NULL, status = 'reopened'
       WHERE id = r.entity_id;
    ELSIF r.entity_type = 'panel_decision' THEN
      UPDATE public.icon_panel_shortlists SET locked_at = NULL, status = 'reopened'
       WHERE id = r.entity_id;
    ELSIF r.entity_type = 'result' THEN
      UPDATE public.icon_grand_jury_groups
         SET results_locked_at = NULL, ballots_locked_at = NULL, voting_status = 'reopened'
       WHERE id = r.entity_id;
    END IF;
  END IF;

  INSERT INTO public.icon_jury_audit_logs(actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), CASE WHEN p_approve THEN 'reopen_approved' ELSE 'reopen_rejected' END,
    r.entity_type, r.entity_id,
    jsonb_build_object('request_id', p_request_id, 'original', r.original_snapshot, 'notes', p_notes));
END $$;

REVOKE ALL ON FUNCTION public.lock_icon_grand_jury_results(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.prepare_icon_grand_jury_ballots(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.lock_icon_shortlist(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.decide_icon_reopen_request(uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lock_icon_grand_jury_results(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_icon_grand_jury_ballots(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.lock_icon_shortlist(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decide_icon_reopen_request(uuid, boolean, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.icon_my_judge_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.icon_is_panel_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.icon_is_recused(uuid, uuid) TO authenticated;
