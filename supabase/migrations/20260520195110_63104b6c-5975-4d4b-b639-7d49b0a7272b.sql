-- ============================================================
-- 1. NOMINEES: hide PII columns from anonymous (unauthenticated) readers
-- ============================================================
REVOKE SELECT (email, phone, identity_hash, acceptance_token, acceptance_token_expires_at, acceptance_status)
  ON public.nominees FROM anon;

-- ============================================================
-- 2. REBUILD_SCHOOLS: hide contact PII from non-admin readers
-- ============================================================
REVOKE SELECT (contact_name, contact_email, contact_phone)
  ON public.rebuild_schools FROM anon, authenticated;

-- ============================================================
-- 3. CERTIFICATES: hide internal fields from public verification
-- ============================================================
REVOKE SELECT (revoke_reason, download_url)
  ON public.certificates FROM anon, authenticated;

-- ============================================================
-- 4. CORRESPONDENCE_BRANDING: restrict raw table to admins
--    (public-safe view `correspondence_branding_public` remains available)
-- ============================================================
DROP POLICY IF EXISTS "Branding readable by authenticated" ON public.correspondence_branding;

CREATE POLICY "Branding readable by admin"
  ON public.correspondence_branding FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 5. SCEF_BOARD_MEMBERS: restrict raw table to admins
--    (public-safe view `scef_board_members_public` remains available)
-- ============================================================
DROP POLICY IF EXISTS "Board members readable by authenticated" ON public.scef_board_members;

CREATE POLICY "Board members readable by admin"
  ON public.scef_board_members FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 6. REALTIME MESSAGES: remove permissive non-judge-chat fallback
-- ============================================================
DROP POLICY IF EXISTS "Judge chat realtime - jury and admin only" ON realtime.messages;

CREATE POLICY "Judge chat realtime - jury and admin only"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (
    (realtime.topic() LIKE '%judge_chat%')
    AND (
      public.has_role(auth.uid(), 'jury'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );