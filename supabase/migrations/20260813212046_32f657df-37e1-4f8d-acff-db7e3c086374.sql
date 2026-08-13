-- 1. Quorum-breaking constraint
ALTER TABLE public.nrc_queue DROP CONSTRAINT IF EXISTS nrc_queue_nomination_id_key;
ALTER TABLE public.nrc_queue ADD CONSTRAINT nrc_queue_nomination_assignee_key UNIQUE (nomination_id, assigned_to);

-- 2. final_decision CHECK
ALTER TABLE public.nrc_verification_summaries DROP CONSTRAINT IF EXISTS nrc_verification_summaries_final_decision_check;
ALTER TABLE public.nrc_verification_summaries
  ADD CONSTRAINT nrc_verification_summaries_final_decision_check
  CHECK (final_decision IS NULL OR final_decision IN ('verified','rejected','verified_with_notes','flagged'));

-- judge-facing conclusion note (no evidence, no private reviewer notes)
ALTER TABLE public.nrc_verification_summaries ADD COLUMN IF NOT EXISTS public_summary_note text;

-- 3. Public opt-in fields on nrc_members
ALTER TABLE public.nrc_members
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS nrc_members_slug_key ON public.nrc_members (slug) WHERE slug IS NOT NULL;

CREATE OR REPLACE VIEW public.nrc_public_members
WITH (security_invoker = true) AS
  SELECT id, display_name, slug, bio, photo_url, country, specialization, created_at
  FROM public.nrc_members
  WHERE is_public = true AND status = 'active' AND display_name IS NOT NULL AND slug IS NOT NULL;

GRANT SELECT ON public.nrc_public_members TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read opted-in NRC members" ON public.nrc_members;
CREATE POLICY "Public can read opted-in NRC members"
  ON public.nrc_members FOR SELECT TO anon, authenticated
  USING (is_public = true AND status = 'active');
GRANT SELECT ON public.nrc_members TO anon;

-- 4. Consolidated assignment function
CREATE OR REPLACE FUNCTION public.assign_nrc_reviewers(p_nomination_id uuid, p_num_reviewers integer DEFAULT 2)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_reviewers uuid[];
  v_reviewer_id uuid;
  v_sla_deadline timestamptz;
  v_region text;
  v_cat_slug text;
BEGIN
  SELECT n.award_category_slug, r.name
    INTO v_cat_slug, v_region
  FROM nominations n
  LEFT JOIN LATERAL (SELECT NULL::text AS name) r ON true
  WHERE n.id = p_nomination_id;

  SELECT array_agg(user_id ORDER BY rk)
  INTO v_reviewers
  FROM (
    SELECT m.user_id,
           row_number() OVER (
             ORDER BY
               (CASE WHEN v_cat_slug IS NOT NULL AND m.specialization IS NOT NULL
                       AND v_cat_slug = ANY (m.specialization) THEN 0 ELSE 1 END),
               (CASE WHEN v_region IS NOT NULL AND m.assigned_region = v_region THEN 0 ELSE 1 END),
               COALESCE(q.load, 0) ASC,
               m.approval_rate DESC NULLS LAST,
               random()
           ) AS rk
    FROM nrc_members m
    LEFT JOIN (
      SELECT assigned_to, count(*) AS load
      FROM nrc_queue WHERE status IN ('assigned','in_review')
      GROUP BY assigned_to
    ) q ON q.assigned_to = m.user_id
    WHERE m.status = 'active'
      AND COALESCE(m.is_available, true) = true
      AND COALESCE(q.load, 0) < COALESCE(m.max_queue_size, 10)
      AND NOT EXISTS (
        SELECT 1 FROM nrc_queue eq
        WHERE eq.nomination_id = p_nomination_id AND eq.assigned_to = m.user_id
      )
    LIMIT p_num_reviewers
  ) ranked;

  IF v_reviewers IS NULL OR array_length(v_reviewers, 1) < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'No available NRC reviewers');
  END IF;

  v_sla_deadline := now() + interval '72 hours';

  FOREACH v_reviewer_id IN ARRAY v_reviewers LOOP
    INSERT INTO nrc_queue (nomination_id, assigned_to, due_date, status)
    VALUES (p_nomination_id, v_reviewer_id, v_sla_deadline, 'assigned')
    ON CONFLICT (nomination_id, assigned_to) DO NOTHING;

    UPDATE nrc_members
    SET current_assignments = COALESCE(current_assignments, 0) + 1,
        last_active_at = now()
    WHERE user_id = v_reviewer_id;
  END LOOP;

  UPDATE nominations
  SET workflow_status = 'NRC_ASSIGNED', sla_deadline = v_sla_deadline, updated_at = now()
  WHERE id = p_nomination_id;

  INSERT INTO nrc_verification_summaries (nomination_id, primary_reviewer_id, secondary_reviewer_id)
  VALUES (p_nomination_id, v_reviewers[1],
          CASE WHEN array_length(v_reviewers,1) > 1 THEN v_reviewers[2] END)
  ON CONFLICT (nomination_id) DO UPDATE
  SET primary_reviewer_id = COALESCE(nrc_verification_summaries.primary_reviewer_id, EXCLUDED.primary_reviewer_id),
      secondary_reviewer_id = COALESCE(nrc_verification_summaries.secondary_reviewer_id, EXCLUDED.secondary_reviewer_id),
      updated_at = now();

  RETURN jsonb_build_object('success', true, 'reviewers', v_reviewers, 'sla_deadline', v_sla_deadline);
END;
$function$;

-- Deprecate the rival implementation: now a thin alias.
CREATE OR REPLACE FUNCTION public.auto_assign_nrc_nomination(p_nomination_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v jsonb;
BEGIN
  -- DEPRECATED: retained for backwards compatibility. Delegates to assign_nrc_reviewers.
  v := public.assign_nrc_reviewers(p_nomination_id, 1);
  IF COALESCE((v->>'success')::boolean, false) THEN
    RETURN ((v->'reviewers')->>0)::uuid;
  END IF;
  RETURN NULL;
END;
$function$;

COMMENT ON FUNCTION public.auto_assign_nrc_nomination(uuid) IS 'DEPRECATED - use assign_nrc_reviewers(nomination_id, n).';