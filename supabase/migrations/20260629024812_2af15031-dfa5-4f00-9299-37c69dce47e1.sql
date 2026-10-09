
-- 1. Certificates: restrict public SELECT to active certs only
DROP POLICY IF EXISTS "Certificates are public for verification" ON public.certificates;
CREATE POLICY "Active certificates are public for verification"
  ON public.certificates
  FOR SELECT
  TO public
  USING (status = 'ACTIVE' AND (revoked_at IS NULL));

-- 2. NRC research queue: allow NRC members to read/update their assigned items
CREATE POLICY "NRC members can view assigned research items"
  ON public.nrc_research_queue
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'nrc'::app_role) AND assigned_to = auth.uid());

CREATE POLICY "NRC members can update assigned research items"
  ON public.nrc_research_queue
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'nrc'::app_role) AND assigned_to = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'nrc'::app_role) AND assigned_to = auth.uid());

-- 3. SCEF board members: confirm RLS enabled and lock down (no change needed beyond ensuring no public read)
-- Existing policy already restricts to admin; add explicit revoke of any inherited grants just in case.
REVOKE SELECT ON public.scef_board_members FROM anon;

-- 4. Volunteers legacy: drop blanket public read
DROP POLICY IF EXISTS "Volunteers are viewable by everyone" ON public.volunteers_legacy;
REVOKE SELECT ON public.volunteers_legacy FROM anon;
