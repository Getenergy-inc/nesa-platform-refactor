-- 1. Remove public voting backend entirely
DROP FUNCTION IF EXISTS public.increment_public_votes(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.increment_public_votes CASCADE;
DROP FUNCTION IF EXISTS public.detect_vote_fraud CASCADE;
DROP FUNCTION IF EXISTS public.log_vote_event CASCADE;
DROP FUNCTION IF EXISTS public.compute_gold_results CASCADE;
DROP FUNCTION IF EXISTS public.compute_blue_garnet_results CASCADE;

DROP TABLE IF EXISTS public.vote_rejections CASCADE;
DROP TABLE IF EXISTS public.fraud_flags CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;

-- 2. Drop public vote tallies from nominee + result records
DROP VIEW IF EXISTS public.public_nominees;
ALTER TABLE public.nominees DROP COLUMN IF EXISTS public_votes;
ALTER TABLE public.results DROP COLUMN IF EXISTS public_votes;

-- 3. Seed/unconfirmed data separation (P0-2)
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS data_source text NOT NULL DEFAULT 'live_verified',
  ADD COLUMN IF NOT EXISTS consent_confirmed boolean NOT NULL DEFAULT false;

ALTER TABLE public.nominees
  DROP CONSTRAINT IF EXISTS nominees_data_source_check;
ALTER TABLE public.nominees
  ADD CONSTRAINT nominees_data_source_check
  CHECK (data_source IN ('live_verified', 'historical_register_unconfirmed', 'seed_unconfirmed'));

COMMENT ON COLUMN public.nominees.data_source IS
  'live_verified = submitted through the 2026 pipeline; historical_register_unconfirmed / seed_unconfirmed = imported reference data, not a consented nomination.';

-- Existing imported/staged records that were never NRC-verified are marked unconfirmed
UPDATE public.nominees
SET data_source = 'historical_register_unconfirmed'
WHERE COALESCE(nrc_verified, false) = false
  AND acceptance_status IS DISTINCT FROM 'ACCEPTED';

UPDATE public.nominees
SET consent_confirmed = true
WHERE acceptance_status = 'ACCEPTED';

-- 4. Rebuild the public nominee view without vote tallies, exposing the new flags
CREATE VIEW public.public_nominees
WITH (security_invoker = true) AS
SELECT id, subcategory_id, season_id, name, slug, title, organization, bio,
       photo_url, logo_url, status, is_platinum, jury_score, final_score,
       renomination_count, region, country, acceptance_status, nrc_verified,
       created_at, updated_at, publication_status, profile_status,
       profile_completion_score, award_family, recognition_class, region_slug,
       zone_slug, state_slug, category_fit_summary, impact_area,
       social_profile_links, public_documents, media_gallery, published_at,
       data_source, consent_confirmed
FROM public.nominees
WHERE status = 'approved'::nomination_status
  AND COALESCE(publication_status, 'published'::nominee_publication_status) <> 'unpublished'::nominee_publication_status;

GRANT SELECT ON public.public_nominees TO anon, authenticated;
GRANT ALL ON public.public_nominees TO service_role;