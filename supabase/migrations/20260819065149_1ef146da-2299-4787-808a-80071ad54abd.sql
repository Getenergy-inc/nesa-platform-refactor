-- Nominees: keep public read policy but ensure contact PII columns are ungrantable
REVOKE SELECT ON public.nominees FROM anon, authenticated;
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(format('%I', column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='nominees'
    AND column_name NOT IN ('email','phone','identity_hash','acceptance_token','acceptance_token_expires_at','review_notes','admin_notes');
  EXECUTE format('GRANT SELECT (%s) ON public.nominees TO anon, authenticated', cols);
END $$;
GRANT ALL ON public.nominees TO service_role;

-- Rebuild schools: same column-level restriction for authenticated as for anon
REVOKE SELECT ON public.rebuild_schools FROM anon, authenticated;
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(format('%I', column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='rebuild_schools'
    AND column_name NOT IN ('contact_name','contact_email','contact_phone','gps_coordinates','admin_notes');
  EXECUTE format('GRANT SELECT (%s) ON public.rebuild_schools TO anon, authenticated', cols);
END $$;
GRANT ALL ON public.rebuild_schools TO service_role;

DROP POLICY IF EXISTS "Public can read verified active schools" ON public.rebuild_schools;
CREATE POLICY "Public can read verified active schools (non-sensitive columns)"
ON public.rebuild_schools
FOR SELECT
TO anon, authenticated
USING (verification_status = 'verified' AND is_active = true);

DROP POLICY IF EXISTS "Public can read approved published nominees" ON public.nominees;
CREATE POLICY "Public can read approved published nominees (non-sensitive columns)"
ON public.nominees
FOR SELECT
TO anon, authenticated
USING (
  status = 'approved'::nomination_status
  AND COALESCE(publication_status, 'published'::nominee_publication_status) <> 'unpublished'::nominee_publication_status
);