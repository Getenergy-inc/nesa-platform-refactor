-- Fix PUBLIC_DATA_EXPOSURE: Restrict profiles table access to prevent email/PII exposure

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create owner-based policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Create admin policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a secure public profiles view for displaying nominee/user public info
-- This excludes sensitive fields like email, phone, and country
CREATE OR REPLACE VIEW public.public_profiles AS
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