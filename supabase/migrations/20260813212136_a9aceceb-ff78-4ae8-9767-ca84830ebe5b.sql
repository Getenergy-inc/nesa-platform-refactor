-- =========================================================
-- STAGE 3: NRC -> Judges Arena handover
-- =========================================================

CREATE TABLE IF NOT EXISTS public.nrc_judge_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id uuid NOT NULL UNIQUE REFERENCES public.nrc_verification_summaries(id) ON DELETE CASCADE,
  nomination_id uuid NOT NULL REFERENCES public.nominations(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('verified','rejected','verified_with_notes','flagged')),
  public_note text,
  quorum_reviews integer NOT NULL DEFAULT 0,
  decided_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, summary_id)
);

GRANT SELECT ON public.nrc_judge_handovers TO authenticated;
GRANT ALL ON public.nrc_judge_handovers TO service_role;

ALTER TABLE public.nrc_judge_handovers ENABLE ROW LEVEL SECURITY;

-- Judges: read-only, and only for nominees assigned to them or their panel.
CREATE POLICY "Judges read handover for their assigned nominees"
ON public.nrc_judge_handovers FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.icon_judge_assignments a
    WHERE a.nominee_id = nrc_judge_handovers.nominee_id
      AND a.judge_id = public.icon_my_judge_id()
  )
  OR EXISTS (
    SELECT 1
    FROM public.icon_judge_assignments a
    JOIN public.icon_judge_panels p
      ON p.pathway_id = a.pathway_id AND p.classification_id = a.classification_id
    JOIN public.icon_judge_panel_members pm
      ON pm.panel_id = p.id AND pm.judge_id = public.icon_my_judge_id()
    WHERE a.nominee_id = nrc_judge_handovers.nominee_id
  )
);

CREATE POLICY "Moderators governance and admins read all handovers"
ON public.nrc_judge_handovers FOR SELECT TO authenticated
USING (
  public.is_icon_moderator(auth.uid())
  OR public.is_icon_governance(auth.uid())
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- No INSERT/UPDATE/DELETE policies: writes only via SECURITY DEFINER trigger / service_role.

CREATE INDEX IF NOT EXISTS nrc_judge_handovers_nominee_idx ON public.nrc_judge_handovers (nominee_id);

CREATE TRIGGER nrc_judge_handovers_updated_at
BEFORE UPDATE ON public.nrc_judge_handovers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Auto-create handover once decision is final + quorum satisfied
-- =========================================================
CREATE OR REPLACE FUNCTION public.nrc_release_handover()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_nominee_id uuid;
  v_reviews integer;
BEGIN
  IF NEW.final_decision IS NULL
     OR NEW.final_decision NOT IN ('verified','verified_with_notes','flagged','rejected') THEN
    RETURN NEW;
  END IF;

  -- quorum: at least 2 completed reviews on the nomination
  SELECT count(*) INTO v_reviews
  FROM nrc_reviews
  WHERE nomination_id = NEW.nomination_id AND completed_at IS NOT NULL;

  IF v_reviews < 2 THEN
    RETURN NEW;
  END IF;

  -- only verified outcomes are handed to judges
  IF NEW.final_decision NOT IN ('verified','verified_with_notes') THEN
    RETURN NEW;
  END IF;

  v_nominee_id := NEW.nominee_id;
  IF v_nominee_id IS NULL THEN
    SELECT created_nominee_id INTO v_nominee_id FROM nominations WHERE id = NEW.nomination_id;
  END IF;
  IF v_nominee_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO nrc_judge_handovers (
    summary_id, nomination_id, nominee_id, decision, public_note, quorum_reviews, decided_at
  ) VALUES (
    NEW.id, NEW.nomination_id, v_nominee_id, NEW.final_decision,
    NEW.public_summary_note, v_reviews, COALESCE(NEW.decision_at, now())
  )
  ON CONFLICT (summary_id) DO UPDATE
  SET decision = EXCLUDED.decision,
      public_note = EXCLUDED.public_note,
      quorum_reviews = EXCLUDED.quorum_reviews,
      decided_at = EXCLUDED.decided_at,
      updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS nrc_release_handover_trg ON public.nrc_verification_summaries;
CREATE TRIGGER nrc_release_handover_trg
AFTER INSERT OR UPDATE OF final_decision, nominee_id, public_summary_note
ON public.nrc_verification_summaries
FOR EACH ROW EXECUTE FUNCTION public.nrc_release_handover();

-- =========================================================
-- Auto-enqueue nominations into the NRC queue
-- =========================================================
CREATE OR REPLACE FUNCTION public.nrc_autoenqueue_nomination()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF COALESCE(NEW.workflow_status,'') NOT IN ('ACCEPTED_PENDING_NRC','SUBMITTED_PENDING_ACCEPTANCE') THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM nrc_queue WHERE nomination_id = NEW.id) THEN
    RETURN NEW;
  END IF;
  PERFORM public.assign_nrc_reviewers(NEW.id, 2);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS nrc_autoenqueue_trg ON public.nominations;
CREATE TRIGGER nrc_autoenqueue_trg
AFTER INSERT OR UPDATE OF workflow_status ON public.nominations
FOR EACH ROW EXECUTE FUNCTION public.nrc_autoenqueue_nomination();

-- Judge-facing read function: conclusion only
CREATE OR REPLACE FUNCTION public.nrc_handover_for_nominee(p_nominee_id uuid)
RETURNS TABLE (decision text, public_note text, decided_at timestamptz)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT h.decision, h.public_note, h.decided_at
  FROM public.nrc_judge_handovers h
  WHERE h.nominee_id = p_nominee_id
$$;

REVOKE EXECUTE ON FUNCTION public.nrc_handover_for_nominee(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.nrc_handover_for_nominee(uuid) TO authenticated;