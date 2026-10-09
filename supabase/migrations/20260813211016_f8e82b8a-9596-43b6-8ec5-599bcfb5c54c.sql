CREATE OR REPLACE FUNCTION public.timeline_public_status()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'nominations_total', (SELECT count(*) FROM public.nominations),
    'nrc_queued', (SELECT count(*) FROM public.nrc_queue),
    'nrc_verified', (SELECT count(*) FROM public.nrc_verification_summaries),
    'judge_panels', (SELECT count(*) FROM public.icon_judge_panels),
    'active_judges', (SELECT count(*) FROM public.icon_judges),
    'judge_assignments', (SELECT count(*) FROM public.icon_judge_assignments)
  );
$$;

REVOKE ALL ON FUNCTION public.timeline_public_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.timeline_public_status() TO anon, authenticated, service_role;