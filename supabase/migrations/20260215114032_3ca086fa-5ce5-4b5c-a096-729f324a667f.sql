
-- =============================================
-- PHASE 5: Rebuild My School Africa — Tables, RLS, Indexes
-- =============================================

-- 1. Schools table
CREATE TABLE public.rebuild_schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  school_type text NOT NULL CHECK (school_type IN (
    'deaf', 'blind', 'vocational', 'physically_challenged', 'intellectually_challenged',
    'autism', 'albinism', 'speech_therapy', 'multi_disability', 'gifted_special',
    'informal_community', 'informal_religious', 'informal_mobile', 'informal_refugee', 'informal_street', 'informal_home'
  )),
  country text NOT NULL,
  region_id uuid REFERENCES public.regions(id),
  address text,
  gps_coordinates text,
  contact_name text,
  contact_email text,
  contact_phone text,
  student_count integer,
  description text,
  photo_urls text[] DEFAULT '{}',
  website text,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by uuid,
  verified_at timestamptz,
  admin_notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.rebuild_schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified schools"
  ON public.rebuild_schools FOR SELECT
  USING (verification_status = 'verified' AND is_active = true);

CREATE POLICY "Admins manage schools"
  ON public.rebuild_schools FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. School nominations
CREATE TABLE public.rebuild_nominations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.rebuild_schools(id),
  school_name text NOT NULL,
  school_type text NOT NULL,
  school_country text NOT NULL,
  school_region_id uuid REFERENCES public.regions(id),
  school_description text,
  school_contact text,
  nominator_name text NOT NULL,
  nominator_email text NOT NULL,
  nominator_phone text,
  nominator_user_id uuid,
  reason text NOT NULL,
  evidence_urls text[] DEFAULT '{}',
  season_id uuid REFERENCES public.seasons(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'shortlisted')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.rebuild_nominations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit rebuild nominations"
  ON public.rebuild_nominations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND nominator_user_id = auth.uid());

CREATE POLICY "Anyone can view approved nominations"
  ON public.rebuild_nominations FOR SELECT
  USING (status IN ('approved', 'shortlisted'));

CREATE POLICY "Admins manage rebuild nominations"
  ON public.rebuild_nominations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own nominations"
  ON public.rebuild_nominations FOR SELECT
  USING (nominator_user_id = auth.uid());

-- 3. School voting
CREATE TABLE public.rebuild_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.rebuild_schools(id) NOT NULL,
  season_id uuid REFERENCES public.seasons(id) NOT NULL,
  voter_id uuid NOT NULL,
  device_hash text,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.rebuild_votes ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX rebuild_votes_unique_per_voter
  ON public.rebuild_votes (season_id, school_id, voter_id);

CREATE POLICY "Authenticated users can vote"
  ON public.rebuild_votes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND voter_id = auth.uid());

CREATE POLICY "Anyone can view rebuild votes"
  ON public.rebuild_votes FOR SELECT
  USING (true);

CREATE POLICY "Admins manage rebuild votes"
  ON public.rebuild_votes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Winners per region
CREATE TABLE public.rebuild_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.rebuild_schools(id) NOT NULL,
  season_id uuid REFERENCES public.seasons(id) NOT NULL,
  region_id uuid REFERENCES public.regions(id) NOT NULL,
  vote_count integer DEFAULT 0,
  published_at timestamptz,
  published_by uuid,
  intervention_status text NOT NULL DEFAULT 'pending' CHECK (intervention_status IN (
    'pending', 'planning', 'in_progress', 'completed', 'paused'
  )),
  intervention_notes text,
  intervention_start_date date,
  intervention_end_date date,
  intervention_budget_usd numeric(12,2),
  intervention_photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (season_id, region_id)
);

ALTER TABLE public.rebuild_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published winners"
  ON public.rebuild_winners FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Admins manage rebuild winners"
  ON public.rebuild_winners FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Stage config entries for rebuild campaign
INSERT INTO public.stage_config (season_id, action, is_open, opens_at, closes_at)
SELECT s.id, 'rebuild_nominations'::stage_action, false, NULL, NULL
FROM public.seasons s WHERE s.is_active = true
ON CONFLICT DO NOTHING;

INSERT INTO public.stage_config (season_id, action, is_open, opens_at, closes_at)
SELECT s.id, 'rebuild_voting'::stage_action, false, NULL, NULL
FROM public.seasons s WHERE s.is_active = true
ON CONFLICT DO NOTHING;

-- 6. Indexes
CREATE INDEX idx_rebuild_schools_region ON public.rebuild_schools(region_id);
CREATE INDEX idx_rebuild_schools_type ON public.rebuild_schools(school_type);
CREATE INDEX idx_rebuild_nominations_season ON public.rebuild_nominations(season_id);
CREATE INDEX idx_rebuild_nominations_status ON public.rebuild_nominations(status);
CREATE INDEX idx_rebuild_votes_school ON public.rebuild_votes(school_id);
CREATE INDEX idx_rebuild_votes_season ON public.rebuild_votes(season_id);

-- 7. Vote count view
CREATE OR REPLACE VIEW public.rebuild_school_vote_counts AS
SELECT 
  rs.id as school_id, rs.name as school_name, rs.school_type,
  rs.country, rs.region_id, rv.season_id, COUNT(rv.id) as vote_count
FROM public.rebuild_schools rs
LEFT JOIN public.rebuild_votes rv ON rv.school_id = rs.id
WHERE rs.verification_status = 'verified' AND rs.is_active = true
GROUP BY rs.id, rs.name, rs.school_type, rs.country, rs.region_id, rv.season_id;

-- 8. Updated_at triggers
CREATE TRIGGER update_rebuild_schools_updated_at
  BEFORE UPDATE ON public.rebuild_schools
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_rebuild_nominations_updated_at
  BEFORE UPDATE ON public.rebuild_nominations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_rebuild_winners_updated_at
  BEFORE UPDATE ON public.rebuild_winners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
