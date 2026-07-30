-- 1) Nominees: remove PII columns from broad anon/authenticated reads
REVOKE SELECT (email, phone, acceptance_token, acceptance_token_expires_at, review_notes, identity_hash)
  ON public.nominees FROM anon, authenticated;

-- Secure lookup used by the public acceptance link
CREATE OR REPLACE FUNCTION public.get_nominee_by_acceptance_token(p_token text)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  email text,
  acceptance_status public.acceptance_status,
  acceptance_token_expires_at timestamptz,
  renomination_count integer,
  country text,
  region text,
  organization text,
  title text,
  referral_code text,
  recognition_pathway text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT n.id, n.name, n.slug, n.email, n.acceptance_status, n.acceptance_token_expires_at,
         n.renomination_count, n.country, n.region, n.organization, n.title,
         n.referral_code, n.recognition_pathway
  FROM public.nominees n
  WHERE p_token IS NOT NULL
    AND length(p_token) >= 16
    AND n.acceptance_token = p_token
    AND (n.acceptance_token_expires_at IS NULL OR n.acceptance_token_expires_at > now())
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_nominee_by_acceptance_token(text) TO anon, authenticated;

-- 2) Rebuild schools: hide contact + GPS from public listings
REVOKE SELECT (contact_name, contact_email, contact_phone, gps_coordinates, admin_notes)
  ON public.rebuild_schools FROM anon, authenticated;
