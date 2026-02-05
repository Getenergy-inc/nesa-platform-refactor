-- ============================================================
-- VOTING GOVERNANCE SCHEMA - NESA-AFRICA 2025
-- Part 1: Enums and new tables (contests, fraud_flags, etc.)
-- ============================================================

-- 1. Create contest types enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contest_type') THEN
    CREATE TYPE public.contest_type AS ENUM (
      'GOLD_PUBLIC',
      'BLUE_PUBLIC', 
      'BLUE_JUDGES',
      'ICON_LIFETIME_JUDGES'
    );
  END IF;
END $$;

-- 2. Create vote rejection reason enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_rejection_reason') THEN
    CREATE TYPE public.vote_rejection_reason AS ENUM (
      'DUPLICATE_VOTE',
      'STAGE_CLOSED',
      'NOT_VERIFIED',
      'NOT_ELIGIBLE',
      'INSUFFICIENT_BALANCE',
      'COI_CONFLICT',
      'RATE_LIMITED'
    );
  END IF;
END $$;

-- 3. Add contest tracking table 
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.seasons(id) NOT NULL,
  contest_type contest_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  opens_at TIMESTAMPTZ,
  closes_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT contests_unique_per_scope UNIQUE(season_id, contest_type, category_id, subcategory_id)
);

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contests are publicly readable" ON public.contests;
CREATE POLICY "Contests are publicly readable"
  ON public.contests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage contests" ON public.contests;
CREATE POLICY "Admins can manage contests"
  ON public.contests FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. Update votes table with new columns
ALTER TABLE public.votes 
  ADD COLUMN IF NOT EXISTS device_hash TEXT,
  ADD COLUMN IF NOT EXISTS ip_hash TEXT,
  ADD COLUMN IF NOT EXISTS contest_id UUID REFERENCES public.contests(id),
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id);

-- 5. Create unique constraints for vote-once rules
DROP INDEX IF EXISTS votes_gold_unique_per_subcategory;
CREATE UNIQUE INDEX votes_gold_unique_per_subcategory
  ON public.votes (voter_id, subcategory_id, season_id)
  WHERE vote_type = 'public' AND subcategory_id IS NOT NULL;

DROP INDEX IF EXISTS votes_blue_unique_per_category;
CREATE UNIQUE INDEX votes_blue_unique_per_category
  ON public.votes (voter_id, category_id, season_id)
  WHERE vote_type = 'public' AND category_id IS NOT NULL AND subcategory_id IS NULL;

-- 6. Fraud flags table
CREATE TABLE IF NOT EXISTS public.fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.seasons(id) NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  voter_id UUID,
  nominee_id UUID REFERENCES public.nominees(id),
  device_hash TEXT,
  ip_hash TEXT,
  vote_count INTEGER,
  time_window_seconds INTEGER,
  description TEXT,
  evidence JSONB DEFAULT '{}',
  flag_status TEXT DEFAULT 'pending',
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fraud_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view fraud flags" ON public.fraud_flags;
CREATE POLICY "Admins can view fraud flags"
  ON public.fraud_flags FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage fraud flags" ON public.fraud_flags;
CREATE POLICY "Admins can manage fraud flags"
  ON public.fraud_flags FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. Vote rejection logs
CREATE TABLE IF NOT EXISTS public.vote_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID,
  nominee_id UUID,
  season_id UUID REFERENCES public.seasons(id),
  contest_id UUID REFERENCES public.contests(id),
  rejection_reason vote_rejection_reason NOT NULL,
  device_hash TEXT,
  ip_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vote_rejections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view vote rejections" ON public.vote_rejections;
CREATE POLICY "Admins can view vote rejections"
  ON public.vote_rejections FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert vote rejections" ON public.vote_rejections;
CREATE POLICY "System can insert vote rejections"
  ON public.vote_rejections FOR INSERT WITH CHECK (true);

-- 8. Update existing results table with new columns
ALTER TABLE public.results
  ADD COLUMN IF NOT EXISTS contest_id UUID REFERENCES public.contests(id),
  ADD COLUMN IF NOT EXISTS computation_id TEXT,
  ADD COLUMN IF NOT EXISTS computation_inputs JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS computation_log TEXT,
  ADD COLUMN IF NOT EXISTS result_status TEXT DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by UUID;

-- 9. Judge submission lock tracking
CREATE TABLE IF NOT EXISTS public.jury_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_user_id UUID NOT NULL,
  contest_id UUID REFERENCES public.contests(id),
  season_id UUID REFERENCES public.seasons(id) NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  is_locked BOOLEAN DEFAULT true,
  total_assignments INTEGER DEFAULT 0,
  completed_assignments INTEGER DEFAULT 0,
  recused_assignments INTEGER DEFAULT 0,
  confirmation_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT jury_submissions_unique UNIQUE(judge_user_id, contest_id, season_id)
);

ALTER TABLE public.jury_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Judges can view own submissions" ON public.jury_submissions;
CREATE POLICY "Judges can view own submissions"
  ON public.jury_submissions FOR SELECT
  USING (auth.uid() = judge_user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Judges can insert own submissions" ON public.jury_submissions;
CREATE POLICY "Judges can insert own submissions"
  ON public.jury_submissions FOR INSERT WITH CHECK (auth.uid() = judge_user_id);

DROP POLICY IF EXISTS "Admins can manage submissions" ON public.jury_submissions;
CREATE POLICY "Admins can manage submissions"
  ON public.jury_submissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 10. Add indexes
CREATE INDEX IF NOT EXISTS idx_votes_voter_season ON public.votes(voter_id, season_id);
CREATE INDEX IF NOT EXISTS idx_votes_nominee_season ON public.votes(nominee_id, season_id);
CREATE INDEX IF NOT EXISTS idx_votes_device_hash ON public.votes(device_hash) WHERE device_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_fraud_flags_season ON public.fraud_flags(season_id, flag_status);
CREATE INDEX IF NOT EXISTS idx_results_season_status ON public.results(season_id, result_status);
CREATE INDEX IF NOT EXISTS idx_contests_season ON public.contests(season_id, is_active);

-- 11. Update RLS on results for public visibility of published results
DROP POLICY IF EXISTS "Public can view published results" ON public.results;
CREATE POLICY "Public can view published results"
  ON public.results FOR SELECT USING (result_status = 'PUBLISHED');

DROP POLICY IF EXISTS "Admins can view all results" ON public.results;
CREATE POLICY "Admins can view all results"
  ON public.results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage results" ON public.results;
CREATE POLICY "Admins can manage results"
  ON public.results FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 12. Vote event logging trigger
CREATE OR REPLACE FUNCTION public.log_vote_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_events (
    action, entity_type, entity_id, actor_id, metadata
  ) VALUES (
    'vote_cast', 'vote', NEW.id, NEW.voter_id,
    jsonb_build_object(
      'nominee_id', NEW.nominee_id,
      'vote_type', NEW.vote_type,
      'score', NEW.score,
      'device_hash', NEW.device_hash
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_vote_event_trigger ON public.votes;
CREATE TRIGGER log_vote_event_trigger
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.log_vote_event();

-- 13. Add triggers for updated_at
DROP TRIGGER IF EXISTS update_contests_updated_at ON public.contests;
CREATE TRIGGER update_contests_updated_at
  BEFORE UPDATE ON public.contests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_fraud_flags_updated_at ON public.fraud_flags;
CREATE TRIGGER update_fraud_flags_updated_at
  BEFORE UPDATE ON public.fraud_flags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();