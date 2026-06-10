-- Refresh public_nominees view to gate strictly on publication_status='published'
-- and exclude incomplete profiles. Adds new fields needed for the profile gate.

DROP VIEW IF EXISTS public.public_nominees;

CREATE VIEW public.public_nominees
WITH (security_invoker = true)
AS
SELECT
  id, subcategory_id, season_id, name, slug, title, organization,
  bio, photo_url, logo_url, status, is_platinum, public_votes,
  jury_score, final_score, renomination_count, region, country,
  acceptance_status, nrc_verified, created_at, updated_at,
  publication_status, profile_status, profile_completion_score,
  award_family, recognition_class,
  region_slug, zone_slug, state_slug,
  category_fit_summary, impact_area,
  social_profile_links, public_documents, media_gallery,
  published_at
FROM public.nominees
WHERE publication_status = 'published'
  AND profile_status IN ('partial', 'complete');

GRANT SELECT ON public.public_nominees TO authenticated, anon;