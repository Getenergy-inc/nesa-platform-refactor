
-- Fix overly permissive INSERT policies that should require authentication
-- These "system" policies allow anonymous inserts which is a security risk

-- 1. ai_nrc_assessments - should only be insertable by service role (edge functions)
DROP POLICY IF EXISTS "System can insert AI assessments" ON public.ai_nrc_assessments;
CREATE POLICY "Service role can insert AI assessments"
  ON public.ai_nrc_assessments FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

-- 2. audit_events - should only be insertable by authenticated users
DROP POLICY IF EXISTS "System can insert audit events" ON public.audit_events;
CREATE POLICY "Authenticated users can insert audit events"
  ON public.audit_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. escalation_logs - should only be insertable by authenticated users
DROP POLICY IF EXISTS "System can insert escalation logs" ON public.escalation_logs;
CREATE POLICY "Authenticated users can insert escalation logs"
  ON public.escalation_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. order_items - should require authentication
DROP POLICY IF EXISTS "System can insert order items" ON public.order_items;
CREATE POLICY "Authenticated users can insert order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. orders - should require authentication  
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 6. shipping_addresses - should require authentication
DROP POLICY IF EXISTS "System can insert shipping addresses" ON public.shipping_addresses;
CREATE POLICY "Authenticated users can insert shipping addresses"
  ON public.shipping_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 7. sponsor_claims - should require authentication
DROP POLICY IF EXISTS "System can insert claims" ON public.sponsor_claims;
CREATE POLICY "Authenticated users can insert claims"
  ON public.sponsor_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. vote_rejections - should require authentication
DROP POLICY IF EXISTS "System can insert vote rejections" ON public.vote_rejections;
CREATE POLICY "Authenticated users can insert vote rejections"
  ON public.vote_rejections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 9. wallet_transactions - should only be insertable by system/admin
DROP POLICY IF EXISTS "System inserts transactions" ON public.wallet_transactions;
CREATE POLICY "Admin can insert transactions"
  ON public.wallet_transactions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
