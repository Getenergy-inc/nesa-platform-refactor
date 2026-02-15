
-- ============================================================
-- Security Fix: Tighten RLS policies to protect PII
-- ============================================================

-- 1. rebuild_nominations: The authenticated SELECT exposes nominator PII (email, phone)
--    to all authenticated users viewing approved nominations.
--    Fix: restrict to own nominations + admin only (public view handles safe public display)
DROP POLICY IF EXISTS "Authenticated users view approved nominations" ON public.rebuild_nominations;

-- 2. rebuild_schools: Public SELECT exposes contact_name, contact_email, contact_phone
--    Fix: Only allow authenticated users + admins to see full records; anon sees via vote_counts view
DROP POLICY IF EXISTS "Anyone can view verified schools" ON public.rebuild_schools;
CREATE POLICY "Authenticated users can view verified schools"
  ON public.rebuild_schools FOR SELECT
  USING (
    (verification_status = 'verified' AND is_active = true AND auth.uid() IS NOT NULL)
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- 3. donations: INSERT WITH CHECK(true) allows anonymous inserts
--    Fix: require authentication for donations
DROP POLICY IF EXISTS "Users can create donations" ON public.donations;
CREATE POLICY "Authenticated users can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 4. partnership_leads: SELECT should be admin-only (already is, but the scanner flagged it)
--    Verify no public SELECT exists - it's fine, only admin ALL policy

-- 5. Fix handle_updated_at function to set search_path (flagged by linter)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 6. Fix prevent_audit_modification to set search_path
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  RAISE EXCEPTION 'Audit events are immutable and cannot be modified';
  RETURN NULL;
END;
$function$;
