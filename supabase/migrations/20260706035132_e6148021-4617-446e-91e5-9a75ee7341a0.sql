REVOKE SELECT (referred_email) ON public.volunteer_referrals FROM authenticated;
REVOKE SELECT (referred_email) ON public.volunteer_referrals FROM anon;
GRANT SELECT (referred_email) ON public.volunteer_referrals TO service_role;