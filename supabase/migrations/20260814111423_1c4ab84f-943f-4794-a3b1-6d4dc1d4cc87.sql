-- Mirror the safe (non-PII) column grants already held by anon onto the
-- authenticated role, then remove blanket table-level SELECT so the
-- public-facing policies can no longer expose contact PII.
DO $$
DECLARE
  tbl text;
  cols text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['judges','rebuild_schools','nominees'] LOOP
    SELECT string_agg(quote_ident(a.attname), ', ')
      INTO cols
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      , LATERAL aclexplode(a.attacl) g
     WHERE n.nspname = 'public'
       AND c.relname = tbl
       AND a.attacl IS NOT NULL
       AND g.grantee::regrole::text = 'anon'
       AND g.privilege_type = 'SELECT';

    IF cols IS NOT NULL THEN
      EXECUTE format('GRANT SELECT (%s) ON public.%I TO authenticated', cols, tbl);
    END IF;

    EXECUTE format('REVOKE SELECT ON public.%I FROM anon, authenticated', tbl);

    IF cols IS NOT NULL THEN
      EXECUTE format('GRANT SELECT (%s) ON public.%I TO anon, authenticated', cols, tbl);
    END IF;

    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl);
  END LOOP;
END $$;