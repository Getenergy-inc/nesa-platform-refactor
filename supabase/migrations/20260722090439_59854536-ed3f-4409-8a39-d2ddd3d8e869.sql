
-- ============================================================
-- NRC-Judges Nominee Review Pipeline (2026 Africa Education Icon)
-- Adds: dossier versioning, 9 pathways, NRC→Judges handover,
-- pathway assignments, scorecards, clarifications, deliberation,
-- pathway voting, finalists/reserves, final 27-judge arena.
-- ============================================================

-- Helper: reusable updated_at trigger fn (already exists in project)
-- public.update_updated_at_column()

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE public.pipeline_status AS ENUM (
    'NOMINATION_RECEIVED','AUTOMATED_SCREENING','NRC_REVIEW','DUPLICATE_REVIEW',
    'ELIGIBILITY_REVIEW','AWAITING_ACCEPTANCE','EVIDENCE_COLLECTION',
    'VERIFICATION_IN_PROGRESS','VERIFICATION_COMPLETED','DOSSIER_READY',
    'APPROVED_FOR_JUDGES','PUSHED_TO_PATHWAY','UNDER_JUDGE_REVIEW',
    'CLARIFICATION_REQUIRED','READY_FOR_DELIBERATION','PATHWAY_DELIBERATION',
    'PATHWAY_VOTING','TOP_THREE','RESERVE','FINAL_VOTING',
    'GOVERNANCE_VALIDATION','LAUREATE_APPROVED','ARCHIVED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.dossier_status AS ENUM ('draft','ready','approved','locked','superseded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.push_status AS ENUM ('pending','pushed','failed','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.judge_review_status AS ENUM ('not_started','in_progress','submitted','locked','recused');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.scorecard_status AS ENUM ('not_started','draft','submitted','locked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.clarification_status AS ENUM ('open','answered','acknowledged','escalated','resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.finalist_rank AS ENUM ('first','second','third','reserve');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- 1. JUDGING PATHWAYS (seed 9) ----------
CREATE TABLE IF NOT EXISTS public.judging_pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_number INT NOT NULL UNIQUE CHECK (pathway_number BETWEEN 1 AND 9),
  slug TEXT NOT NULL UNIQUE,
  award_category TEXT NOT NULL,
  classification TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  season_id UUID REFERENCES public.seasons(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.judging_pathways TO anon, authenticated;
GRANT ALL ON public.judging_pathways TO service_role;
ALTER TABLE public.judging_pathways ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pathways are public read" ON public.judging_pathways FOR SELECT USING (true);
CREATE POLICY "Admins manage pathways" ON public.judging_pathways FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_judging_pathways_updated BEFORE UPDATE ON public.judging_pathways
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.judging_pathways (pathway_number, slug, award_category, classification, title) VALUES
  (1,'literary-curriculum-african-africa','Literary and New Curriculum Advocate','Africans in Africa','Literary and New Curriculum Advocate — Africans in Africa'),
  (2,'literary-curriculum-diaspora','Literary and New Curriculum Advocate','Africans in the Diaspora','Literary and New Curriculum Advocate — Africans in the Diaspora'),
  (3,'literary-curriculum-friends','Literary and New Curriculum Advocate','Friends of Africa','Literary and New Curriculum Advocate — Friends of Africa'),
  (4,'technical-educator-african-africa','Africa Technical Educator','Africans in Africa','Africa Technical Educator — Africans in Africa'),
  (5,'technical-educator-diaspora','Africa Technical Educator','Africans in the Diaspora','Africa Technical Educator — Africans in the Diaspora'),
  (6,'technical-educator-friends','Africa Technical Educator','Friends of Africa','Africa Technical Educator — Friends of Africa'),
  (7,'education-philanthropy-african-africa','Africa Education Philanthropy','Africans in Africa','Africa Education Philanthropy — Africans in Africa'),
  (8,'education-philanthropy-diaspora','Africa Education Philanthropy','Africans in the Diaspora','Africa Education Philanthropy — Africans in the Diaspora'),
  (9,'education-philanthropy-friends','Africa Education Philanthropy','Friends of Africa','Africa Education Philanthropy — Friends of Africa')
ON CONFLICT (pathway_number) DO NOTHING;

-- ---------- 2. NOMINEE DOSSIER VERSIONS ----------
CREATE TABLE IF NOT EXISTS public.nominee_dossier_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  nomination_id UUID REFERENCES public.nominations(id) ON DELETE SET NULL,
  version_number INT NOT NULL,
  status public.dossier_status NOT NULL DEFAULT 'draft',
  biography TEXT,
  lifetime_contribution TEXT,
  geographic_reach TEXT,
  main_beneficiaries TEXT,
  verified_achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence_library JSONB NOT NULL DEFAULT '[]'::jsonb,
  impact_summary TEXT,
  source_quality_notes TEXT,
  known_limitations TEXT,
  nrc_recommendation TEXT,
  content_hash TEXT,
  prepared_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES auth.users(id),
  supersedes_version_id UUID REFERENCES public.nominee_dossier_versions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_dossier_versions_nominee ON public.nominee_dossier_versions(nominee_id, version_number DESC);
GRANT SELECT, INSERT, UPDATE ON public.nominee_dossier_versions TO authenticated;
GRANT ALL ON public.nominee_dossier_versions TO service_role;
ALTER TABLE public.nominee_dossier_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC and admins manage dossiers" ON public.nominee_dossier_versions FOR ALL
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Jury read approved/locked dossiers" ON public.nominee_dossier_versions FOR SELECT
  USING (status IN ('approved','locked') AND (public.has_role(auth.uid(),'jury') OR public.has_role(auth.uid(),'admin')));
CREATE TRIGGER trg_dossier_versions_updated BEFORE UPDATE ON public.nominee_dossier_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 3. NRC NOMINEE PUSHES (handover to pathway) ----------
CREATE TABLE IF NOT EXISTS public.nrc_nominee_pushes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  nomination_id UUID REFERENCES public.nominations(id) ON DELETE SET NULL,
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id),
  dossier_version_id UUID NOT NULL REFERENCES public.nominee_dossier_versions(id),
  pushed_by UUID NOT NULL REFERENCES auth.users(id),
  pushed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.push_status NOT NULL DEFAULT 'pushed',
  checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, pathway_id)
);
GRANT SELECT, INSERT, UPDATE ON public.nrc_nominee_pushes TO authenticated;
GRANT ALL ON public.nrc_nominee_pushes TO service_role;
ALTER TABLE public.nrc_nominee_pushes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC/admin manage pushes" ON public.nrc_nominee_pushes FOR ALL
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Jury read pushes" ON public.nrc_nominee_pushes FOR SELECT
  USING (public.has_role(auth.uid(),'jury'));
CREATE TRIGGER trg_pushes_updated BEFORE UPDATE ON public.nrc_nominee_pushes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 4. NOMINEE ↔ PATHWAY ASSIGNMENTS ----------
CREATE TABLE IF NOT EXISTS public.nominee_pathway_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  dossier_version_id UUID NOT NULL REFERENCES public.nominee_dossier_versions(id),
  push_id UUID REFERENCES public.nrc_nominee_pushes(id) ON DELETE SET NULL,
  pipeline_status public.pipeline_status NOT NULL DEFAULT 'PUSHED_TO_PATHWAY',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, pathway_id)
);
CREATE INDEX IF NOT EXISTS idx_npa_pathway ON public.nominee_pathway_assignments(pathway_id);
GRANT SELECT, INSERT, UPDATE ON public.nominee_pathway_assignments TO authenticated;
GRANT ALL ON public.nominee_pathway_assignments TO service_role;
ALTER TABLE public.nominee_pathway_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC/admin manage nominee-pathway" ON public.nominee_pathway_assignments FOR ALL
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Jury read nominee-pathway" ON public.nominee_pathway_assignments FOR SELECT
  USING (public.has_role(auth.uid(),'jury'));
CREATE TRIGGER trg_npa_updated BEFORE UPDATE ON public.nominee_pathway_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 5. PATHWAY JUDGE ASSIGNMENTS (3 per pathway) ----------
CREATE TABLE IF NOT EXISTS public.pathway_judge_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_chair BOOLEAN NOT NULL DEFAULT false,
  seat_number INT CHECK (seat_number BETWEEN 1 AND 3),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, judge_user_id),
  UNIQUE (pathway_id, seat_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pathway_judge_assignments TO authenticated;
GRANT ALL ON public.pathway_judge_assignments TO service_role;
ALTER TABLE public.pathway_judge_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage judge assignments" ON public.pathway_judge_assignments FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Judges read own pathway seat" ON public.pathway_judge_assignments FOR SELECT
  USING (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'jury') OR public.has_role(auth.uid(),'nrc'));
CREATE TRIGGER trg_pja_updated BEFORE UPDATE ON public.pathway_judge_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 6. JUDGE NOMINEE REVIEWS ----------
CREATE TABLE IF NOT EXISTS public.judge_nominee_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dossier_version_id UUID NOT NULL REFERENCES public.nominee_dossier_versions(id),
  status public.judge_review_status NOT NULL DEFAULT 'not_started',
  private_notes TEXT,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, nominee_id, judge_user_id)
);
CREATE INDEX IF NOT EXISTS idx_jnr_pathway_nominee ON public.judge_nominee_reviews(pathway_id, nominee_id);
GRANT SELECT, INSERT, UPDATE ON public.judge_nominee_reviews TO authenticated;
GRANT ALL ON public.judge_nominee_reviews TO service_role;
ALTER TABLE public.judge_nominee_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judge manages own review" ON public.judge_nominee_reviews FOR ALL
  USING (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "NRC read procedural status only" ON public.judge_nominee_reviews FOR SELECT
  USING (public.has_role(auth.uid(),'nrc'));
CREATE TRIGGER trg_jnr_updated BEFORE UPDATE ON public.judge_nominee_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 7. PATHWAY SCORECARDS ----------
CREATE TABLE IF NOT EXISTS public.pathway_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL UNIQUE REFERENCES public.judge_nominee_reviews(id) ON DELETE CASCADE,
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rubric_version TEXT NOT NULL DEFAULT '2026.1',
  scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score NUMERIC(6,2),
  justification TEXT,
  status public.scorecard_status NOT NULL DEFAULT 'not_started',
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.pathway_scorecards TO authenticated;
GRANT ALL ON public.pathway_scorecards TO service_role;
ALTER TABLE public.pathway_scorecards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judge owns scorecard" ON public.pathway_scorecards FOR ALL
  USING (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
-- NRC sees status only via secure view (below), not full row
CREATE TRIGGER trg_scorecards_updated BEFORE UPDATE ON public.pathway_scorecards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NRC-safe status view (no score values)
CREATE OR REPLACE VIEW public.pathway_scorecards_status
WITH (security_invoker = true) AS
  SELECT id, review_id, pathway_id, nominee_id, judge_user_id, status, submitted_at, locked_at
  FROM public.pathway_scorecards;
GRANT SELECT ON public.pathway_scorecards_status TO authenticated;

-- ---------- 8. CLARIFICATION REQUESTS (shared NRC↔Judge) ----------
CREATE TABLE IF NOT EXISTS public.pathway_clarification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  dossier_section TEXT,
  question TEXT NOT NULL,
  evidence_reference TEXT,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low','normal','high','urgent')),
  review_deadline TIMESTAMPTZ,
  status public.clarification_status NOT NULL DEFAULT 'open',
  response_text TEXT,
  response_dossier_version_id UUID REFERENCES public.nominee_dossier_versions(id),
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clar_pathway ON public.pathway_clarification_requests(pathway_id, status);
GRANT SELECT, INSERT, UPDATE ON public.pathway_clarification_requests TO authenticated;
GRANT ALL ON public.pathway_clarification_requests TO service_role;
ALTER TABLE public.pathway_clarification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC and admins full clarifications" ON public.pathway_clarification_requests FOR ALL
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Judge sees own clarifications" ON public.pathway_clarification_requests FOR SELECT
  USING (requested_by = auth.uid() OR public.has_role(auth.uid(),'jury'));
CREATE POLICY "Judge creates own clarification" ON public.pathway_clarification_requests FOR INSERT
  WITH CHECK (requested_by = auth.uid() AND public.has_role(auth.uid(),'jury'));
CREATE POLICY "Judge acknowledges own" ON public.pathway_clarification_requests FOR UPDATE
  USING (requested_by = auth.uid()) WITH CHECK (requested_by = auth.uid());
CREATE TRIGGER trg_clar_updated BEFORE UPDATE ON public.pathway_clarification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 9. DELIBERATION CHATROOM ----------
CREATE TABLE IF NOT EXISTS public.pathway_deliberation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_delib_pathway_created ON public.pathway_deliberation_messages(pathway_id, created_at DESC);
GRANT SELECT, INSERT ON public.pathway_deliberation_messages TO authenticated;
GRANT ALL ON public.pathway_deliberation_messages TO service_role;
ALTER TABLE public.pathway_deliberation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only assigned judges read pathway chat" ON public.pathway_deliberation_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.pathway_judge_assignments pja
                 WHERE pja.pathway_id = pathway_deliberation_messages.pathway_id
                   AND pja.judge_user_id = auth.uid() AND pja.active)
      OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Assigned judges post pathway chat" ON public.pathway_deliberation_messages FOR INSERT
  WITH CHECK (author_user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.pathway_judge_assignments pja
    WHERE pja.pathway_id = pathway_deliberation_messages.pathway_id
      AND pja.judge_user_id = auth.uid() AND pja.active));

-- ---------- 10. PATHWAY VOTING BALLOTS (3-judge ranked) ----------
CREATE TABLE IF NOT EXISTS public.pathway_voting_ballots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_nominee_id UUID REFERENCES public.nominees(id),
  second_nominee_id UUID REFERENCES public.nominees(id),
  third_nominee_id UUID REFERENCES public.nominees(id),
  reserve_nominee_id UUID REFERENCES public.nominees(id),
  rationale TEXT,
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  ballot_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, judge_user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.pathway_voting_ballots TO authenticated;
GRANT ALL ON public.pathway_voting_ballots TO service_role;
ALTER TABLE public.pathway_voting_ballots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judge owns ballot" ON public.pathway_voting_ballots FOR ALL
  USING (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_pvb_updated BEFORE UPDATE ON public.pathway_voting_ballots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 11. FINALIST & RESERVE SELECTIONS ----------
CREATE TABLE IF NOT EXISTS public.pathway_finalist_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  rank public.finalist_rank NOT NULL,
  total_points NUMERIC(6,2),
  panel_chair_id UUID REFERENCES auth.users(id),
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  panel_report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, rank),
  UNIQUE (pathway_id, nominee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pathway_finalist_selections TO authenticated;
GRANT ALL ON public.pathway_finalist_selections TO service_role;
ALTER TABLE public.pathway_finalist_selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chairs/admins manage finalists" ON public.pathway_finalist_selections FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (
    SELECT 1 FROM public.pathway_judge_assignments pja
    WHERE pja.pathway_id = pathway_finalist_selections.pathway_id
      AND pja.judge_user_id = auth.uid() AND pja.is_chair))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR EXISTS (
    SELECT 1 FROM public.pathway_judge_assignments pja
    WHERE pja.pathway_id = pathway_finalist_selections.pathway_id
      AND pja.judge_user_id = auth.uid() AND pja.is_chair));
CREATE POLICY "Jury and NRC read finalists" ON public.pathway_finalist_selections FOR SELECT
  USING (public.has_role(auth.uid(),'jury') OR public.has_role(auth.uid(),'nrc'));
CREATE TRIGGER trg_finalists_updated BEFORE UPDATE ON public.pathway_finalist_selections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 12. FINAL 27-JUDGE ARENA BALLOTS ----------
CREATE TABLE IF NOT EXISTS public.final_arena_ballots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.seasons(id),
  pathway_id UUID NOT NULL REFERENCES public.judging_pathways(id) ON DELETE CASCADE,
  judge_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  laureate_nominee_id UUID NOT NULL REFERENCES public.nominees(id),
  points INT NOT NULL DEFAULT 1 CHECK (points >= 0),
  rationale TEXT,
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  ballot_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pathway_id, judge_user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.final_arena_ballots TO authenticated;
GRANT ALL ON public.final_arena_ballots TO service_role;
ALTER TABLE public.final_arena_ballots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Judge owns final ballot" ON public.final_arena_ballots FOR ALL
  USING (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (judge_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_fab_updated BEFORE UPDATE ON public.final_arena_ballots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 13. PIPELINE STATUS TRACKING (per nominee) ----------
CREATE TABLE IF NOT EXISTS public.nominee_pipeline_status (
  nominee_id UUID PRIMARY KEY REFERENCES public.nominees(id) ON DELETE CASCADE,
  current_status public.pipeline_status NOT NULL DEFAULT 'NOMINATION_RECEIVED',
  current_pathway_id UUID REFERENCES public.judging_pathways(id),
  current_dossier_version_id UUID REFERENCES public.nominee_dossier_versions(id),
  last_transition_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_transition_by UUID REFERENCES auth.users(id),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.nominee_pipeline_status TO authenticated;
GRANT ALL ON public.nominee_pipeline_status TO service_role;
ALTER TABLE public.nominee_pipeline_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC/admin manage pipeline status" ON public.nominee_pipeline_status FOR ALL
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Jury read pipeline status" ON public.nominee_pipeline_status FOR SELECT
  USING (public.has_role(auth.uid(),'jury'));
CREATE TRIGGER trg_pipeline_status_updated BEFORE UPDATE ON public.nominee_pipeline_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- 14. PIPELINE TRANSITION HISTORY (append-only) ----------
CREATE TABLE IF NOT EXISTS public.nominee_pipeline_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  from_status public.pipeline_status,
  to_status public.pipeline_status NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  actor_role TEXT,
  pathway_id UUID REFERENCES public.judging_pathways(id),
  dossier_version_id UUID REFERENCES public.nominee_dossier_versions(id),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transitions_nominee ON public.nominee_pipeline_transitions(nominee_id, created_at DESC);
GRANT SELECT, INSERT ON public.nominee_pipeline_transitions TO authenticated;
GRANT ALL ON public.nominee_pipeline_transitions TO service_role;
ALTER TABLE public.nominee_pipeline_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NRC/jury/admin read transitions" ON public.nominee_pipeline_transitions FOR SELECT
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'jury') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "NRC/admin insert transitions" ON public.nominee_pipeline_transitions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_transitions_immutable BEFORE UPDATE OR DELETE ON public.nominee_pipeline_transitions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- ---------- 15. RPC: push nominee to pathway (atomic handover) ----------
CREATE OR REPLACE FUNCTION public.push_nominee_to_pathway(
  p_nominee_id UUID,
  p_pathway_id UUID,
  p_dossier_version_id UUID,
  p_checklist JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor UUID := auth.uid();
  v_push_id UUID;
  v_dossier public.nominee_dossier_versions;
BEGIN
  IF NOT (public.has_role(v_actor,'nrc') OR public.has_role(v_actor,'admin')) THEN
    RAISE EXCEPTION 'Only NRC or admin may push nominees' USING ERRCODE = 'P0403';
  END IF;

  SELECT * INTO v_dossier FROM public.nominee_dossier_versions WHERE id = p_dossier_version_id;
  IF v_dossier.id IS NULL THEN RAISE EXCEPTION 'Dossier version not found'; END IF;
  IF v_dossier.nominee_id <> p_nominee_id THEN RAISE EXCEPTION 'Dossier does not belong to nominee'; END IF;
  IF v_dossier.status NOT IN ('approved','locked') THEN
    RAISE EXCEPTION 'Dossier must be approved before push (current: %)', v_dossier.status;
  END IF;

  -- Lock dossier
  UPDATE public.nominee_dossier_versions
    SET status='locked', locked_at = COALESCE(locked_at, now()), locked_by = COALESCE(locked_by, v_actor)
    WHERE id = p_dossier_version_id;

  -- Create push record
  INSERT INTO public.nrc_nominee_pushes (nominee_id, pathway_id, dossier_version_id, pushed_by, status, checklist)
  VALUES (p_nominee_id, p_pathway_id, p_dossier_version_id, v_actor, 'pushed', p_checklist)
  ON CONFLICT (nominee_id, pathway_id) DO UPDATE
    SET dossier_version_id = EXCLUDED.dossier_version_id,
        pushed_by = EXCLUDED.pushed_by,
        pushed_at = now(),
        status='pushed',
        checklist = EXCLUDED.checklist,
        updated_at = now()
  RETURNING id INTO v_push_id;

  -- Nominee ↔ pathway assignment
  INSERT INTO public.nominee_pathway_assignments (nominee_id, pathway_id, dossier_version_id, push_id, pipeline_status)
  VALUES (p_nominee_id, p_pathway_id, p_dossier_version_id, v_push_id, 'PUSHED_TO_PATHWAY')
  ON CONFLICT (nominee_id, pathway_id) DO UPDATE
    SET dossier_version_id = EXCLUDED.dossier_version_id,
        push_id = EXCLUDED.push_id,
        pipeline_status = 'PUSHED_TO_PATHWAY',
        updated_at = now();

  -- Create judge review + draft scorecard for each active seat
  INSERT INTO public.judge_nominee_reviews (pathway_id, nominee_id, judge_user_id, dossier_version_id)
  SELECT p_pathway_id, p_nominee_id, pja.judge_user_id, p_dossier_version_id
    FROM public.pathway_judge_assignments pja
   WHERE pja.pathway_id = p_pathway_id AND pja.active
  ON CONFLICT DO NOTHING;

  INSERT INTO public.pathway_scorecards (review_id, pathway_id, nominee_id, judge_user_id)
  SELECT jnr.id, p_pathway_id, p_nominee_id, jnr.judge_user_id
    FROM public.judge_nominee_reviews jnr
   WHERE jnr.pathway_id = p_pathway_id AND jnr.nominee_id = p_nominee_id
  ON CONFLICT (review_id) DO NOTHING;

  -- Pipeline status update + transition
  INSERT INTO public.nominee_pipeline_status (nominee_id, current_status, current_pathway_id, current_dossier_version_id, last_transition_by)
  VALUES (p_nominee_id, 'PUSHED_TO_PATHWAY', p_pathway_id, p_dossier_version_id, v_actor)
  ON CONFLICT (nominee_id) DO UPDATE
    SET current_status='PUSHED_TO_PATHWAY',
        current_pathway_id = EXCLUDED.current_pathway_id,
        current_dossier_version_id = EXCLUDED.current_dossier_version_id,
        last_transition_at = now(),
        last_transition_by = v_actor,
        updated_at = now();

  INSERT INTO public.nominee_pipeline_transitions (nominee_id, from_status, to_status, actor_user_id, actor_role, pathway_id, dossier_version_id, notes)
  VALUES (p_nominee_id, 'APPROVED_FOR_JUDGES', 'PUSHED_TO_PATHWAY', v_actor, 'nrc', p_pathway_id, p_dossier_version_id, 'NRC push to pathway');

  INSERT INTO public.audit_events (action, entity_type, entity_id, actor_id, metadata)
  VALUES ('nrc_pushed_nominee','nominee', p_nominee_id, v_actor,
          jsonb_build_object('pathway_id', p_pathway_id, 'dossier_version_id', p_dossier_version_id, 'push_id', v_push_id));

  RETURN v_push_id;
END $$;

REVOKE ALL ON FUNCTION public.push_nominee_to_pathway(UUID,UUID,UUID,JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.push_nominee_to_pathway(UUID,UUID,UUID,JSONB) TO authenticated;
