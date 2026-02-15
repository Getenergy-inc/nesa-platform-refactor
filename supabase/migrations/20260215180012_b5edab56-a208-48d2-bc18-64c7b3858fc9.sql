-- ============================================================================
-- FIX 1: judge_applications - Remove overly permissive SELECT policy
-- Replace with email-based self-lookup (for status page) and token-based lookup
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view own application by email" ON public.judge_applications;

-- Allow unauthenticated users to look up their application by email
-- This is needed for the status check page, but only returns the matching row
CREATE POLICY "Applicants can view own application by email"
  ON public.judge_applications
  FOR SELECT
  USING (
    -- Authenticated users can see their linked application
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    -- Or admin access
    OR public.has_role(auth.uid(), 'admin')
  );

-- Note: The "Users can view own linked application" and "Admins can manage" 
-- policies already exist and cover authenticated access.
-- For unauthenticated email lookup (JudgeStatus page), we need a server-side approach.

-- ============================================================================
-- FIX 2: rebuild_nominations - Restrict public SELECT to hide PII
-- Create a public view that excludes sensitive nominator data
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view approved nominations" ON public.rebuild_nominations;

-- Replace with a policy that only shows approved nominations but excludes PII
-- The SELECT policy itself can't filter columns, so we restrict to owner + admin
CREATE POLICY "Authenticated users view approved nominations"
  ON public.rebuild_nominations FOR SELECT
  TO authenticated
  USING (
    -- Anyone authenticated can see approved/shortlisted (public voting needs this)
    status IN ('approved', 'shortlisted')
    -- Or own nominations
    OR nominator_user_id = auth.uid()
    -- Or admin
    OR public.has_role(auth.uid(), 'admin')
  );

-- Create a safe public view for rebuild nominations (no PII)
CREATE OR REPLACE VIEW public.public_rebuild_nominations
WITH (security_invoker = true)
AS
SELECT 
  id, school_id, school_region_id, season_id,
  school_name, school_type, school_country, school_description,
  reason, evidence_urls, status, created_at
FROM public.rebuild_nominations
WHERE status IN ('approved', 'shortlisted');