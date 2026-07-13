
DROP VIEW IF EXISTS public.rebuild_schools_admin;
CREATE VIEW public.rebuild_schools_admin
WITH (security_invoker = true) AS
SELECT *
FROM public.rebuild_schools
WHERE public.has_role(auth.uid(), 'admin'::app_role);

REVOKE ALL ON public.rebuild_schools_admin FROM PUBLIC, anon;
GRANT SELECT ON public.rebuild_schools_admin TO authenticated;

-- Admins need direct table SELECT to read the sensitive columns through the view (security_invoker uses caller's grants).
GRANT SELECT ON public.rebuild_schools TO authenticated;
-- But we still want to restrict non-admin authenticated to safe columns only.
-- Since GRANT SELECT is table-wide, we must instead rely on column grants.
-- Revert to column grants and use a SECURITY DEFINER function for admin full-row access.
REVOKE SELECT ON public.rebuild_schools FROM authenticated;
GRANT SELECT (
  id, name, school_type, country, region_id, address, student_count,
  description, photo_urls, website, verification_status, verified_at,
  is_active, created_at, updated_at
) ON public.rebuild_schools TO authenticated;

-- Replace the view with a security-definer function for admin full-row reads.
DROP VIEW IF EXISTS public.rebuild_schools_admin;

CREATE OR REPLACE FUNCTION public.get_rebuild_schools_admin()
RETURNS SETOF public.rebuild_schools
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.rebuild_schools
  WHERE public.has_role(auth.uid(), 'admin'::app_role);
$$;

REVOKE ALL ON FUNCTION public.get_rebuild_schools_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_rebuild_schools_admin() TO authenticated;
