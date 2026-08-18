-- Tighten public access to judge and school PII using column-level grants plus safe public views.

-- =============================================================================
-- JUDGES
-- =============================================================================

DROP VIEW IF EXISTS public.judges_public CASCADE;

CREATE VIEW public.judges_public
WITH (security_invoker = true)
AS
SELECT
    id,
    person_id,
    slug,
    full_name,
    photo_url,
    country_residence,
    country_origin,
    region,
    professional_title,
    organization,
    bio,
    expertise_areas,
    languages,
    social_links,
    verification_status,
    judge_status,
    profile_visibility,
    featured,
    public_contribution_statement,
    contribution_score,
    created_at
FROM public.judges
WHERE profile_visibility = 'public'::judge_profile_visibility
  AND verification_status = 'verified'::judge_verification_status
  AND judge_status = ANY (
        ARRAY[
            'approved'::judge_status,
            'active'::judge_status,
            'alumni'::judge_status
        ]
    );

GRANT SELECT ON public.judges_public TO anon;
GRANT SELECT ON public.judges_public TO authenticated;
GRANT ALL ON public.judges_public TO service_role;

-- Remove any direct table-level SELECT anon may have, then grant only safe columns.
REVOKE SELECT ON public.judges FROM anon;
GRANT SELECT (
    id,
    person_id,
    slug,
    full_name,
    photo_url,
    country_residence,
    country_origin,
    region,
    professional_title,
    organization,
    bio,
    expertise_areas,
    languages,
    social_links,
    verification_status,
    judge_status,
    profile_visibility,
    featured,
    public_contribution_statement,
    contribution_score,
    created_at
) ON public.judges TO anon;

-- Authenticated users (judge owners and admins) need the full row.
GRANT SELECT ON public.judges TO authenticated;

-- =============================================================================
-- REBUILD SCHOOLS
-- =============================================================================

DROP VIEW IF EXISTS public.rebuild_schools_public CASCADE;

CREATE VIEW public.rebuild_schools_public
WITH (security_invoker = true)
AS
SELECT
    id,
    name,
    school_type,
    country,
    region_id,
    student_count,
    description,
    photo_urls,
    website,
    created_at
FROM public.rebuild_schools
WHERE verification_status = 'verified'::text
  AND is_active = true;

GRANT SELECT ON public.rebuild_schools_public TO anon;
GRANT SELECT ON public.rebuild_schools_public TO authenticated;
GRANT ALL ON public.rebuild_schools_public TO service_role;

-- The old public policy covered anon + authenticated. Recreate it for anon only,
-- and restrict anon to the non-sensitive columns.
DROP POLICY IF EXISTS "Public can read verified active schools (non-sensitive)" ON public.rebuild_schools;

CREATE POLICY "Public can read verified active schools"
ON public.rebuild_schools
FOR SELECT
TO anon
USING (verification_status = 'verified'::text AND is_active = true);

REVOKE SELECT ON public.rebuild_schools FROM anon;
GRANT SELECT (
    id,
    name,
    school_type,
    country,
    region_id,
    student_count,
    description,
    photo_urls,
    website,
    created_at
) ON public.rebuild_schools TO anon;

-- Authenticated users (admins) need the full row for the admin dashboard.
GRANT SELECT ON public.rebuild_schools TO authenticated;
