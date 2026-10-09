DROP POLICY IF EXISTS "Public can read verified active schools" ON public.rebuild_schools;
DROP VIEW IF EXISTS public.rebuild_schools_public;

CREATE VIEW public.rebuild_schools_public
WITH (security_invoker = true) AS
SELECT id, name, school_type, country, region_id, student_count,
       description, photo_urls, website, created_at
FROM public.rebuild_schools
WHERE verification_status = 'verified' AND is_active = true;

CREATE POLICY "Public can read verified active schools (non-sensitive)"
ON public.rebuild_schools
FOR SELECT
TO anon, authenticated
USING (verification_status = 'verified' AND is_active = true);

REVOKE SELECT ON public.rebuild_schools FROM anon, authenticated;
GRANT SELECT (id, name, school_type, country, region_id, student_count, description, photo_urls, website, created_at)
  ON public.rebuild_schools TO anon, authenticated;
GRANT SELECT ON public.rebuild_schools_public TO anon, authenticated;
GRANT ALL ON public.rebuild_schools TO service_role;
GRANT SELECT ON public.rebuild_schools_public TO service_role;