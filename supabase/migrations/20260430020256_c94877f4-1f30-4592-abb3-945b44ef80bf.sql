
-- ============================================================
-- 1) Restrict sensitive columns on public.nominees
-- Revoke broad column SELECT from anon/authenticated for sensitive PII
-- and acceptance token fields. Keep table-level SELECT working for the
-- safe columns via existing public RLS policy.
-- ============================================================

-- Ensure base SELECT exists, then revoke sensitive columns from anon/authenticated
REVOKE SELECT (email, phone, acceptance_token, acceptance_token_expires_at, identity_hash, nominator_user_id)
  ON public.nominees FROM anon;

REVOKE SELECT (email, phone, acceptance_token, acceptance_token_expires_at, identity_hash)
  ON public.nominees FROM authenticated;

-- ============================================================
-- 2) Restrict nrc_assignment_rules to NRC members and admins
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view active rules" ON public.nrc_assignment_rules;

CREATE POLICY "NRC and admins view rules"
  ON public.nrc_assignment_rules
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'nrc'::app_role)
  );

-- ============================================================
-- 3) Lock down SECURITY DEFINER functions: revoke EXECUTE from PUBLIC
-- and grant only to roles that actually need to call them.
-- Trigger functions don't need any role grants.
-- ============================================================

-- Trigger / system-only functions: revoke from everyone (triggers run as definer regardless)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_wallet() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_chapter_wallet() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_renomination() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_vote_event() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_unlock_certificates() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_nrc_member_limit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_nrc_member_stats() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prevent_audit_modification() FROM PUBLIC, anon, authenticated;

-- Admin / system orchestration functions: revoke from anon & authenticated; service_role keeps access
REVOKE ALL ON FUNCTION public.assign_nrc_reviewers(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_assign_nrc_nomination(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_nrc_quorum(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.compute_blue_garnet_results(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.compute_gold_results(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.publish_results(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.detect_vote_fraud(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.escalate_overdue_nrc_assignments() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_wallet_transaction(uuid, wallet_tx_type, agc_source, integer, numeric, text, uuid, text, jsonb, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_user_wallet(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_referral_code(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_receipt_number() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_identity_hash(text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_user_roles(uuid) FROM PUBLIC, anon;

-- Keep get_user_roles callable by authenticated (for self role lookup)
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;

-- Functions that legitimately need to be callable by anon/authenticated
-- (RLS-checking helpers, public stage/season info, vote increment, wallet helpers used by client)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role_code(uuid, role_code) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_stage_open(stage_action) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_season() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_certificate_unlock(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_public_votes(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_wallet(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_wallet_balance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_wallet_balance(uuid) TO authenticated;
