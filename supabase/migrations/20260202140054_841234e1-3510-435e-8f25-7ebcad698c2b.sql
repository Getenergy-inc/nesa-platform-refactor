-- Fix overly permissive SELECT policy on renominations table
-- The previous policy allowed anyone to view renominations with a session_id,
-- which exposed contact_email and other sensitive data

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view own renominations" ON public.renominations;

-- Create a properly restricted policy
-- Only authenticated users can view their own submissions, plus admin/NRC can view all
CREATE POLICY "Users can view own renominations"
  ON public.renominations
  FOR SELECT
  USING (
    -- Authenticated users can view their own submissions
    (submitter_id = auth.uid()) 
    OR 
    -- Admins and NRC can view all for review purposes
    has_role(auth.uid(), 'admin'::app_role)
    OR 
    has_role(auth.uid(), 'nrc'::app_role)
  );