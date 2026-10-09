-- ============================================================================
-- NESA-Africa Judge Ecosystem (skips legacy judge_applications table)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.judge_status AS ENUM
    ('applied','under_review','approved','rejected','active','inactive','suspended','alumni');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.judge_verification_status AS ENUM ('unverified','verified','featured');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.judge_profile_visibility AS ENUM ('public','unlisted','private');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.judge_assignment_status AS ENUM
    ('not_started','in_progress','submitted','returned_for_revision','finalized');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.judge_review_status AS ENUM
    ('not_started','in_progress','submitted','returned_for_revision','finalized');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----- judges -----
CREATE TABLE public.judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  application_id UUID REFERENCES public.judge_applications(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  country_residence TEXT,
  country_origin TEXT,
  region TEXT,
  professional_title TEXT,
  organization TEXT,
  bio TEXT,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_status public.judge_verification_status NOT NULL DEFAULT 'unverified',
  judge_status public.judge_status NOT NULL DEFAULT 'applied',
  profile_visibility public.judge_profile_visibility NOT NULL DEFAULT 'private',
  public_contribution_statement TEXT,
  contribution_score INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_judges_slug ON public.judges(slug);
CREATE INDEX idx_judges_status ON public.judges(judge_status);
CREATE INDEX idx_judges_visibility ON public.judges(profile_visibility);
CREATE INDEX idx_judges_user ON public.judges(user_id);
CREATE INDEX idx_judges_region ON public.judges(region);

GRANT SELECT ON public.judges TO anon, authenticated;
GRANT INSERT, UPDATE ON public.judges TO authenticated;
GRANT ALL ON public.judges TO service_role;

ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved public judges"
ON public.judges FOR SELECT
USING (
  profile_visibility = 'public'
  AND judge_status IN ('approved','active','alumni')
);

CREATE POLICY "Judges can read their own row"
ON public.judges FOR SELECT
TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins read all judges"
ON public.judges FOR SELECT
TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own judge profile"
ON public.judges FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND judge_status = 'applied'
  AND profile_visibility IN ('private','unlisted')
);

CREATE POLICY "Judges can update their own profile"
ON public.judges FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage all judges"
ON public.judges FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ----- judges_public view (PII-masked) -----
CREATE OR REPLACE VIEW public.judges_public
WITH (security_invoker=true) AS
SELECT
  id, slug, full_name, photo_url,
  country_residence, country_origin, region,
  professional_title, organization, bio,
  expertise_areas, languages, social_links,
  verification_status, judge_status, featured,
  public_contribution_statement, contribution_score,
  created_at
FROM public.judges
WHERE profile_visibility = 'public'
  AND judge_status IN ('approved','active','alumni');

GRANT SELECT ON public.judges_public TO anon, authenticated;

-- ----- judge_assignments -----
CREATE TABLE public.judge_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  category_id UUID,
  subcategory_id UUID,
  nominee_id UUID,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  status public.judge_assignment_status NOT NULL DEFAULT 'not_started',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_judge_assignments_judge ON public.judge_assignments(judge_id);
CREATE INDEX idx_judge_assignments_nominee ON public.judge_assignments(nominee_id);
CREATE INDEX idx_judge_assignments_status ON public.judge_assignments(status);

GRANT SELECT, UPDATE ON public.judge_assignments TO authenticated;
GRANT ALL ON public.judge_assignments TO service_role;
ALTER TABLE public.judge_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges read own assignments"
ON public.judge_assignments FOR SELECT
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Judges update own assignments status"
ON public.judge_assignments FOR UPDATE
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()))
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Admins manage assignments"
ON public.judge_assignments FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ----- judge_reviews -----
CREATE TABLE public.judge_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.judge_assignments(id) ON DELETE SET NULL,
  nominee_id UUID NOT NULL,
  category_id UUID,
  score NUMERIC(5,2),
  rubric_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  comments TEXT,
  evidence_review JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommendation TEXT,
  status public.judge_review_status NOT NULL DEFAULT 'not_started',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(judge_id, nominee_id, category_id)
);
CREATE INDEX idx_judge_reviews_judge ON public.judge_reviews(judge_id);
CREATE INDEX idx_judge_reviews_nominee ON public.judge_reviews(nominee_id);

GRANT SELECT, INSERT, UPDATE ON public.judge_reviews TO authenticated;
GRANT ALL ON public.judge_reviews TO service_role;
ALTER TABLE public.judge_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges read own reviews"
ON public.judge_reviews FOR SELECT
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Judges create own reviews"
ON public.judge_reviews FOR INSERT
TO authenticated
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Judges update own reviews"
ON public.judge_reviews FOR UPDATE
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()))
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Admins read all reviews"
ON public.judge_reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ----- judge_conflicts -----
CREATE TABLE public.judge_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  nominee_id UUID,
  category_id UUID,
  conflict_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'declared',
  declared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_judge_conflicts_judge ON public.judge_conflicts(judge_id);

GRANT SELECT, INSERT, UPDATE ON public.judge_conflicts TO authenticated;
GRANT ALL ON public.judge_conflicts TO service_role;
ALTER TABLE public.judge_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges read own conflicts"
ON public.judge_conflicts FOR SELECT
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Judges declare own conflicts"
ON public.judge_conflicts FOR INSERT
TO authenticated
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Judges update own pending conflicts"
ON public.judge_conflicts FOR UPDATE
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()) AND status = 'declared')
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Admins manage conflicts"
ON public.judge_conflicts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ----- judge_activity_logs -----
CREATE TABLE public.judge_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_judge_activity_judge ON public.judge_activity_logs(judge_id);
CREATE INDEX idx_judge_activity_created ON public.judge_activity_logs(created_at DESC);

GRANT SELECT, INSERT ON public.judge_activity_logs TO authenticated;
GRANT ALL ON public.judge_activity_logs TO service_role;
ALTER TABLE public.judge_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges read own activity"
ON public.judge_activity_logs FOR SELECT
TO authenticated
USING (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "System inserts activity"
ON public.judge_activity_logs FOR INSERT
TO authenticated
WITH CHECK (judge_id IN (SELECT id FROM public.judges WHERE user_id = auth.uid()));

CREATE POLICY "Admins read all activity"
ON public.judge_activity_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ----- TRIGGERS -----
CREATE TRIGGER trg_judges_updated_at BEFORE UPDATE ON public.judges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_judge_assignments_updated_at BEFORE UPDATE ON public.judge_assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_judge_reviews_updated_at BEFORE UPDATE ON public.judge_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_judge_conflicts_updated_at BEFORE UPDATE ON public.judge_conflicts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.judges_before_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_slug TEXT; v_n INT := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    v_slug := public.slugify(NEW.full_name);
    IF v_slug = '' THEN v_slug := 'judge'; END IF;
    WHILE EXISTS (
      SELECT 1 FROM public.judges
      WHERE slug = CASE WHEN v_n = 0 THEN v_slug ELSE v_slug || '-' || v_n END
    ) LOOP v_n := v_n + 1; END LOOP;
    NEW.slug := CASE WHEN v_n = 0 THEN v_slug ELSE v_slug || '-' || v_n END;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_judges_before_insert BEFORE INSERT ON public.judges
FOR EACH ROW EXECUTE FUNCTION public.judges_before_insert();

CREATE OR REPLACE FUNCTION public.judges_grant_role_on_approval()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NOT NULL
     AND NEW.judge_status IN ('approved','active')
     AND (OLD.judge_status IS DISTINCT FROM NEW.judge_status) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'jury'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_judges_grant_role_on_approval AFTER UPDATE ON public.judges
FOR EACH ROW EXECUTE FUNCTION public.judges_grant_role_on_approval();

CREATE OR REPLACE FUNCTION public.judges_log_review_submit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS DISTINCT FROM 'submitted') THEN
    INSERT INTO public.judge_activity_logs (judge_id, action, metadata)
    VALUES (NEW.judge_id, 'review_submitted',
      jsonb_build_object('review_id', NEW.id, 'nominee_id', NEW.nominee_id, 'score', NEW.score));
    NEW.submitted_at := COALESCE(NEW.submitted_at, now());
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_judges_log_review_submit BEFORE UPDATE ON public.judge_reviews
FOR EACH ROW EXECUTE FUNCTION public.judges_log_review_submit();