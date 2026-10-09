
-- =========================================================================
-- Fix: nominees_public_pii_exposure
-- Restrict the "Public view approved nominees" policy to authenticated users
-- only. Anonymous visitors must read through the public_nominees view.
-- =========================================================================
DROP POLICY IF EXISTS "Public view approved nominees" ON public.nominees;

CREATE POLICY "Authenticated view approved nominees"
ON public.nominees
FOR SELECT
TO authenticated
USING (status IN ('approved', 'platinum'));

-- Ensure anon has no direct SELECT on the nominees table at all.
REVOKE SELECT ON public.nominees FROM anon;

-- =========================================================================
-- Fix: rebuild_schools_contact_info_overexposure
-- Restrict contact/GPS/admin columns to admins only. Authenticated users
-- can read the safe listing columns via a column-limited GRANT plus a
-- dedicated public view.
-- =========================================================================

-- Drop the over-broad policy and replace with an admin-only full-row policy.
DROP POLICY IF EXISTS "Authenticated users can view verified schools" ON public.rebuild_schools;

-- Revoke blanket SELECT and grant only safe columns to authenticated + anon.
REVOKE SELECT ON public.rebuild_schools FROM authenticated;
REVOKE SELECT ON public.rebuild_schools FROM anon;

GRANT SELECT (
  id,
  name,
  school_type,
  country,
  region_id,
  address,
  student_count,
  description,
  photo_urls,
  website,
  verification_status,
  verified_at,
  is_active,
  created_at,
  updated_at
) ON public.rebuild_schools TO authenticated;

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
  verification_status,
  is_active,
  created_at
) ON public.rebuild_schools TO anon;

-- Row-level policy for the safe columns above.
CREATE POLICY "Anyone can view verified school listings"
  ON public.rebuild_schools FOR SELECT
  TO anon, authenticated
  USING (verification_status = 'verified' AND is_active = true);

-- Admin ALL policy already exists ("Admins manage schools"); ensure admin has
-- full column access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rebuild_schools TO authenticated;
-- Re-tighten: the blanket grant above would restore full column read.
-- Instead, keep INSERT/UPDATE/DELETE broad (RLS gates them to admins via the
-- existing "Admins manage schools" policy) and column-restrict SELECT.
REVOKE SELECT ON public.rebuild_schools FROM authenticated;
GRANT SELECT (
  id,
  name,
  school_type,
  country,
  region_id,
  address,
  student_count,
  description,
  photo_urls,
  website,
  verification_status,
  verified_at,
  is_active,
  created_at,
  updated_at
) ON public.rebuild_schools TO authenticated;

GRANT ALL ON public.rebuild_schools TO service_role;

-- Provide a security-definer accessor for admins to read full rows including
-- contact/GPS fields without needing a table-level SELECT grant on those cols.
CREATE OR REPLACE VIEW public.rebuild_schools_admin
WITH (security_invoker = false) AS
SELECT *
FROM public.rebuild_schools
WHERE public.has_role(auth.uid(), 'admin'::app_role);

REVOKE ALL ON public.rebuild_schools_admin FROM PUBLIC, anon;
GRANT SELECT ON public.rebuild_schools_admin TO authenticated;
