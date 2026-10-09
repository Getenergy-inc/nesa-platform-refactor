-- Influencer Education Impact Award 2026: classification-based nominee table.
-- Mirrors the column names declared in src/config/awards/influencerImpact2026.ts.

CREATE TABLE IF NOT EXISTS public.influencer_impact_nominees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,

  -- Common
  award_family text NOT NULL DEFAULT 'Influencer Education Impact Award 2026',
  award_category text NOT NULL CHECK (award_category IN ('social-media','sports','music')),
  recognition_class text NOT NULL CHECK (recognition_class IN ('African Living in Africa','African in the Diaspora')),
  nominee_name text NOT NULL,
  nominee_country text NOT NULL,
  nominee_region text NOT NULL CHECK (nominee_region IN ('West Africa','East Africa','Southern Africa','Central Africa','North Africa')),
  education_impact_summary text NOT NULL DEFAULT '',
  evidence_links text[] NOT NULL DEFAULT ARRAY[]::text[],
  verification_status text NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING','VERIFIED','REJECTED')),
  verified_nominations integer NOT NULL DEFAULT 0,
  image_url text,

  -- Social Media classification
  primary_social_media_platform text,
  other_platforms text[],
  content_impact_area text,
  follower_count_range text,
  platform_profile_link text,

  -- Sports classification
  primary_sport_area text,
  club_team_or_foundation text,
  sports_education_impact_area text,
  athlete_status text,
  sports_profile_link text,

  -- Music classification
  music_genre text,
  other_music_genres text[],
  stage_name text,
  label_or_foundation text,
  music_education_impact_area text,
  artist_profile_link text,

  submitted_by uuid,
  reviewed_by uuid,
  reviewed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_iin_category ON public.influencer_impact_nominees(award_category);
CREATE INDEX IF NOT EXISTS idx_iin_region ON public.influencer_impact_nominees(nominee_region);
CREATE INDEX IF NOT EXISTS idx_iin_class ON public.influencer_impact_nominees(recognition_class);
CREATE INDEX IF NOT EXISTS idx_iin_status ON public.influencer_impact_nominees(verification_status);

-- Grants — public read of VERIFIED rows via policy below
GRANT SELECT ON public.influencer_impact_nominees TO anon;
GRANT SELECT, INSERT, UPDATE ON public.influencer_impact_nominees TO authenticated;
GRANT ALL ON public.influencer_impact_nominees TO service_role;

ALTER TABLE public.influencer_impact_nominees ENABLE ROW LEVEL SECURITY;

-- Anyone (incl. anonymous) can read verified nominees on the public discovery page
CREATE POLICY "Public can read verified influencer nominees"
  ON public.influencer_impact_nominees
  FOR SELECT
  USING (verification_status = 'VERIFIED');

-- Submitters can read their own pending submissions
CREATE POLICY "Submitters can read their own submissions"
  ON public.influencer_impact_nominees
  FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

-- Authenticated users can submit nominations (forced PENDING via column default)
CREATE POLICY "Authenticated users can submit nominations"
  ON public.influencer_impact_nominees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND verification_status = 'PENDING'
  );

-- Admins can read everything
CREATE POLICY "Admins can read all influencer nominees"
  ON public.influencer_impact_nominees
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update verification status / classification
CREATE POLICY "Admins can update influencer nominees"
  ON public.influencer_impact_nominees
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete influencer nominees"
  ON public.influencer_impact_nominees
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER influencer_impact_nominees_updated_at
  BEFORE UPDATE ON public.influencer_impact_nominees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
