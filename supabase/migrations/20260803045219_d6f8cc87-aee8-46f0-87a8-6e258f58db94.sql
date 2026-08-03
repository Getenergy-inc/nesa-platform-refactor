
-- 1. public_nominees: convert to security_invoker with column-level grants
GRANT SELECT (
  id, subcategory_id, season_id, name, slug, title, organization, bio, photo_url, logo_url,
  status, is_platinum, public_votes, jury_score, final_score, renomination_count, region, country,
  acceptance_status, nrc_verified, created_at, updated_at, publication_status, profile_status,
  profile_completion_score, award_family, recognition_class, region_slug, zone_slug, state_slug,
  category_fit_summary, impact_area, social_profile_links, public_documents, media_gallery, published_at
) ON public.nominees TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read approved published nominees" ON public.nominees;
CREATE POLICY "Public can read approved published nominees"
  ON public.nominees FOR SELECT
  TO anon, authenticated
  USING (status = 'approved'::nomination_status
         AND COALESCE(publication_status, 'published'::nominee_publication_status) <> 'unpublished'::nominee_publication_status);

ALTER VIEW public.public_nominees SET (security_invoker = true);
GRANT SELECT ON public.public_nominees TO anon, authenticated;

-- 2. rebuild_schools_public: convert to security_invoker with column-level grants
GRANT SELECT (
  id, name, school_type, description, country, region_id, student_count, photo_urls,
  website, verification_status, is_active, created_at, updated_at
) ON public.rebuild_schools TO anon, authenticated;

DROP POLICY IF EXISTS "Public can read verified active schools" ON public.rebuild_schools;
CREATE POLICY "Public can read verified active schools"
  ON public.rebuild_schools FOR SELECT
  TO anon, authenticated
  USING (verification_status = 'verified' AND is_active = true);

ALTER VIEW public.rebuild_schools_public SET (security_invoker = true);
GRANT SELECT ON public.rebuild_schools_public TO anon, authenticated;

-- 3. Hide internal user identifier columns from public roles
REVOKE SELECT (author_id) ON public.content_pages FROM anon, authenticated;
REVOKE SELECT (uploaded_by) ON public.gallery_media FROM anon;
REVOKE SELECT (created_by) ON public.gallery_collections FROM anon;
