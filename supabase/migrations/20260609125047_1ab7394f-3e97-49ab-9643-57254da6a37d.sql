
-- Pass G — Nominee publication gate + geo/profile completeness fields

-- Enum: publication_status
DO $$ BEGIN
  CREATE TYPE public.nominee_publication_status AS ENUM ('draft','pending','published','unpublished','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Enum: profile_status
DO $$ BEGIN
  CREATE TYPE public.nominee_profile_status AS ENUM ('incomplete','partial','complete');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS publication_status public.nominee_publication_status NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS profile_status public.nominee_profile_status NOT NULL DEFAULT 'incomplete',
  ADD COLUMN IF NOT EXISTS profile_completion_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS award_family text,
  ADD COLUMN IF NOT EXISTS recognition_class text,
  ADD COLUMN IF NOT EXISTS region_slug text,
  ADD COLUMN IF NOT EXISTS zone_slug text,
  ADD COLUMN IF NOT EXISTS state_slug text,
  ADD COLUMN IF NOT EXISTS category_fit_summary text,
  ADD COLUMN IF NOT EXISTS impact_area text,
  ADD COLUMN IF NOT EXISTS social_profile_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS public_documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS media_gallery jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Score bounds
ALTER TABLE public.nominees
  DROP CONSTRAINT IF EXISTS nominees_profile_completion_score_range;
ALTER TABLE public.nominees
  ADD CONSTRAINT nominees_profile_completion_score_range
  CHECK (profile_completion_score BETWEEN 0 AND 100);

-- Backfill: approved rows are published; computed published_at preserved if set
UPDATE public.nominees
SET publication_status = 'published',
    published_at = COALESCE(published_at, updated_at, now())
WHERE status::text = 'approved' AND publication_status = 'draft';

UPDATE public.nominees
SET publication_status = 'pending'
WHERE status::text = 'pending' AND publication_status = 'draft';

UPDATE public.nominees
SET publication_status = 'unpublished'
WHERE status::text = 'rejected' AND publication_status = 'draft';

-- Backfill region_slug from text region (lower, hyphenated)
UPDATE public.nominees
SET region_slug = public.slugify(region)
WHERE region IS NOT NULL AND region_slug IS NULL;

-- Initial profile_completion_score: 20 per non-null/non-empty field across
-- name, bio/work_done, photo_url|logo_url, country, evidence_urls
UPDATE public.nominees n
SET profile_completion_score = LEAST(100, (
    (CASE WHEN COALESCE(NULLIF(trim(n.name),''), NULL) IS NOT NULL THEN 20 ELSE 0 END) +
    (CASE WHEN COALESCE(NULLIF(trim(n.bio),''), NULLIF(trim(n.work_done),'')) IS NOT NULL THEN 20 ELSE 0 END) +
    (CASE WHEN COALESCE(NULLIF(trim(n.photo_url),''), NULLIF(trim(n.logo_url),'')) IS NOT NULL THEN 20 ELSE 0 END) +
    (CASE WHEN COALESCE(NULLIF(trim(n.country),''), NULLIF(trim(n.region),'')) IS NOT NULL THEN 20 ELSE 0 END) +
    (CASE WHEN n.evidence_urls IS NOT NULL AND array_length(n.evidence_urls,1) > 0 THEN 20 ELSE 0 END)
));

UPDATE public.nominees
SET profile_status = CASE
    WHEN profile_completion_score >= 80 THEN 'complete'::public.nominee_profile_status
    WHEN profile_completion_score >= 40 THEN 'partial'::public.nominee_profile_status
    ELSE 'incomplete'::public.nominee_profile_status
  END;

-- Indexes for filter & gate performance
CREATE INDEX IF NOT EXISTS idx_nominees_publication_status ON public.nominees(publication_status);
CREATE INDEX IF NOT EXISTS idx_nominees_region_slug ON public.nominees(region_slug);
CREATE INDEX IF NOT EXISTS idx_nominees_zone_slug ON public.nominees(zone_slug);
CREATE INDEX IF NOT EXISTS idx_nominees_state_slug ON public.nominees(state_slug);
CREATE INDEX IF NOT EXISTS idx_nominees_award_family ON public.nominees(award_family);
CREATE INDEX IF NOT EXISTS idx_nominees_recognition_class ON public.nominees(recognition_class);
