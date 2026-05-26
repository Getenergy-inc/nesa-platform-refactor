CREATE OR REPLACE FUNCTION public.slugify(p text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $function$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(p,'')), '[^a-z0-9]+', '-', 'g'))
$function$;

REVOKE SELECT (identity_hash) ON public.nominees FROM anon;
REVOKE SELECT (identity_hash) ON public.nominees FROM authenticated;