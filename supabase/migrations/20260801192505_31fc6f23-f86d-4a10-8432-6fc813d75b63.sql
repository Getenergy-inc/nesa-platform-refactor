-- 1. Public nominee directory: expose the non-PII view without RLS recursion
ALTER VIEW public.public_nominees SET (security_invoker = false);

CREATE OR REPLACE VIEW public.public_nominees
WITH (security_invoker = false) AS
SELECT
  id, subcategory_id, season_id, name, slug, title, organization, bio,
  photo_url, logo_url, status, is_platinum, public_votes, jury_score,
  final_score, renomination_count, region, country, acceptance_status,
  nrc_verified, created_at, updated_at, publication_status, profile_status,
  profile_completion_score, award_family, recognition_class, region_slug,
  zone_slug, state_slug, category_fit_summary, impact_area,
  social_profile_links, public_documents, media_gallery, published_at
FROM public.nominees
WHERE status = 'approved'
  AND coalesce(publication_status, 'published') <> 'unpublished';

GRANT SELECT ON public.public_nominees TO anon, authenticated;
GRANT ALL ON public.public_nominees TO service_role;

-- 2. rebuild_schools: remove anon/authenticated access to contact PII
DROP POLICY IF EXISTS "Anyone can view verified school listings" ON public.rebuild_schools;

CREATE OR REPLACE VIEW public.rebuild_schools_public
WITH (security_invoker = false) AS
SELECT
  id, name, school_type, description, country, region_id,
  student_count, photo_urls, website, verification_status,
  is_active, created_at, updated_at
FROM public.rebuild_schools
WHERE verification_status = 'verified' AND is_active = true;

GRANT SELECT ON public.rebuild_schools_public TO anon, authenticated;
GRANT ALL ON public.rebuild_schools_public TO service_role;