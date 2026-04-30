
-- ============================================================
-- 1) Carts & cart_items: require authenticated user OR admin
-- Anonymous-cart self-service is removed at the DB layer; if you
-- need anonymous carts later, route them through an edge function
-- that validates a signed cookie/session.
-- ============================================================
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
DROP POLICY IF EXISTS "Users can manage own cart items" ON public.cart_items;

CREATE POLICY "Authenticated users manage own cart"
  ON public.carts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage all carts"
  ON public.carts
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users manage own cart items"
  ON public.cart_items
  FOR ALL
  TO authenticated
  USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
  )
  WITH CHECK (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins manage all cart items"
  ON public.cart_items
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 2) Realtime channel authorization for judge chat
-- Restrict subscriptions to the judge_chat_messages publication so
-- only authenticated jury or admin users receive broadcasts.
-- ============================================================
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Judge chat realtime - jury and admin only" ON realtime.messages;
CREATE POLICY "Judge chat realtime - jury and admin only"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    -- Only allow when the topic relates to judge chat AND the user is jury/admin
    (
      realtime.topic() LIKE '%judge_chat%'
      AND (
        public.has_role(auth.uid(), 'jury'::app_role)
        OR public.has_role(auth.uid(), 'admin'::app_role)
      )
    )
    -- Allow other topics through (so this policy doesn't break unrelated realtime usage)
    OR realtime.topic() NOT LIKE '%judge_chat%'
  );

-- ============================================================
-- 3) Further tighten SECURITY DEFINER function exposure
-- Revoke anon EXECUTE on functions that don't need it.
-- (Keep has_role, is_stage_open, get_current_season, increment_public_votes,
--  check_certificate_unlock available to anon — these power public pages.)
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.get_user_wallet(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_wallet_balance(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_wallet_balance(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role_code(uuid, role_code) FROM anon;
