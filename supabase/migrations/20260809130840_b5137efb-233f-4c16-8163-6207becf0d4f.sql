CREATE POLICY "Public can read public verified judge profiles"
ON public.judges FOR SELECT TO anon
USING (profile_visibility = 'public'::judge_profile_visibility AND verification_status = 'verified'::judge_verification_status);

GRANT SELECT (
  id, person_id, slug, full_name, photo_url, country_residence, country_origin,
  region, professional_title, organization, bio, expertise_areas, languages,
  social_links, verification_status, judge_status, profile_visibility,
  public_contribution_statement, contribution_score, featured, created_at, updated_at
) ON public.judges TO anon;