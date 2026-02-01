-- Fix the SECURITY DEFINER view warning by using security_invoker instead
-- Drop the existing view and recreate with security_invoker

DROP VIEW IF EXISTS public.public_profiles;

-- Recreate view with security_invoker = true (runs with caller's permissions)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  bio,
  created_at
FROM public.profiles;

-- Grant read access on the view to authenticated and anonymous users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;