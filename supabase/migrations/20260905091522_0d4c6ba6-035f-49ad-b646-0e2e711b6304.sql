
CREATE OR REPLACE VIEW public.v_nominee_media_review
WITH (security_invoker = true) AS
SELECT
  n.id                AS nominee_id,
  n.name              AS nominee_name,
  n.slug              AS nominee_slug,
  n.organization,
  n.country,
  n.region,
  n.website,
  n.publication_status::text AS publication_status,
  n.status::text      AS nomination_status,
  n.nrc_verified,
  n.photo_url,
  n.logo_url,
  c.slug              AS category_slug,
  c.name              AS category_name,
  s.slug              AS subcategory_slug,
  s.name              AS subcategory_name,
  m.entity_type,
  m.media_kind::text  AS media_kind,
  COALESCE(m.media_status, 'missing')::text AS media_status,
  m.candidate_image_url,
  m.approved_asset_url,
  m.source_url,
  m.source_domain,
  m.source_type,
  m.confidence,
  m.date_checked,
  m.verification_note,
  m.submitted_by_nominee,
  m.approved_for_public
FROM public.nominees n
LEFT JOIN public.subcategories s ON s.id = n.subcategory_id
LEFT JOIN public.categories   c ON c.id = s.category_id
LEFT JOIN public.nominee_media_sourcing m ON m.nominee_id = n.id;

GRANT SELECT ON public.v_nominee_media_review TO authenticated;
GRANT SELECT ON public.v_nominee_media_review TO service_role;

-- Nominee self-service media submission via the existing acceptance token.
CREATE OR REPLACE FUNCTION public.submit_nominee_media(
  p_token TEXT,
  p_website TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_usage_confirmed BOOLEAN DEFAULT false,
  p_corrected_name TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nominee public.nominees%ROWTYPE;
BEGIN
  SELECT * INTO v_nominee FROM public.nominees WHERE acceptance_token = p_token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_token');
  END IF;

  IF p_image_url IS NULL AND p_website IS NULL AND p_corrected_name IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'nothing_submitted');
  END IF;

  INSERT INTO public.nominee_media_sourcing AS t (
    nominee_id, nominee_slug, nominee_name, entity_type, media_kind, media_status,
    candidate_image_url, source_url, source_type, verification_note,
    submitted_by_nominee, usage_confirmed, approved_for_public, date_checked
  ) VALUES (
    v_nominee.id, v_nominee.slug, v_nominee.name,
    CASE WHEN v_nominee.organization IS NOT NULL THEN 'organization' ELSE 'unknown' END,
    'fallback', 'verification_required',
    p_image_url, p_website, 'nominee_submission',
    COALESCE('Nominee submission. Corrected name: ' || p_corrected_name, 'Nominee submission'),
    true, COALESCE(p_usage_confirmed, false), false, now()
  )
  ON CONFLICT (nominee_id) DO UPDATE SET
    candidate_image_url = COALESCE(EXCLUDED.candidate_image_url, t.candidate_image_url),
    source_url          = COALESCE(EXCLUDED.source_url, t.source_url),
    source_type         = 'nominee_submission',
    media_status        = 'verification_required',
    submitted_by_nominee = true,
    usage_confirmed     = COALESCE(EXCLUDED.usage_confirmed, t.usage_confirmed),
    approved_for_public = false,
    verification_note   = EXCLUDED.verification_note,
    date_checked        = now();

  RETURN jsonb_build_object('ok', true, 'status', 'verification_required');
END;
$$;

REVOKE ALL ON FUNCTION public.submit_nominee_media(TEXT, TEXT, TEXT, BOOLEAN, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_nominee_media(TEXT, TEXT, TEXT, BOOLEAN, TEXT) TO anon, authenticated, service_role;
