-- Revoke direct column access to PII fields on public.nominees and public.judges
-- Public/anonymous reads should go through masked views (e.g. nominees_public, judges_public).
REVOKE SELECT (email, phone, acceptance_token) ON public.nominees FROM anon;
REVOKE SELECT (email, phone, acceptance_token) ON public.nominees FROM authenticated;
REVOKE SELECT (email, phone) ON public.judges FROM anon;
REVOKE SELECT (email, phone) ON public.judges FROM authenticated;