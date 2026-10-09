GRANT SELECT ON public.nominees TO anon, authenticated;
GRANT ALL ON public.nominees TO service_role;
GRANT SELECT ON public.public_nominees TO anon, authenticated;
GRANT ALL ON public.public_nominees TO service_role;