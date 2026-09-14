DO $$
DECLARE
  t record;
  cols text;
BEGIN
  FOR t IN
    SELECT * FROM (VALUES
      ('nominees', ARRAY['email','phone']),
      ('judges', ARRAY['email','phone']),
      ('rebuild_schools', ARRAY['contact_email','contact_phone','contact_name'])
    ) AS v(tbl, sensitive)
  LOOP
    SELECT string_agg(quote_ident(column_name), ', ')
      INTO cols
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = t.tbl
       AND NOT (column_name = ANY (t.sensitive));

    EXECUTE format('REVOKE SELECT ON public.%I FROM anon', t.tbl);
    EXECUTE format('GRANT SELECT (%s) ON public.%I TO anon', cols, t.tbl);
  END LOOP;
END $$;