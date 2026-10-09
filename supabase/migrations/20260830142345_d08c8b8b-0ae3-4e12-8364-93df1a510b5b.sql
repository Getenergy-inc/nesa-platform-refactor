REVOKE EXECUTE ON FUNCTION public.redeem_nrc_invitation(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.approve_nrc_application(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.reject_nrc_application(uuid, text) FROM anon;