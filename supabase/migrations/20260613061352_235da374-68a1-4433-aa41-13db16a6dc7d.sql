
-- audit_events: bind actor_id to caller
DROP POLICY IF EXISTS "Authenticated users can insert audit events" ON public.audit_events;
CREATE POLICY "Authenticated users can insert audit events"
ON public.audit_events FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (actor_id = auth.uid() OR actor_id IS NULL));

-- audit_logs: bind user_id to caller
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- donations
DROP POLICY IF EXISTS "Authenticated users can create donations" ON public.donations;
CREATE POLICY "Authenticated users can create donations"
ON public.donations FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- orders
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR user_id IS NULL));

-- order_items: must belong to caller's order
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON public.order_items;
CREATE POLICY "Authenticated users can insert order items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- sponsor_claims: bind user_id
DROP POLICY IF EXISTS "Authenticated users can insert claims" ON public.sponsor_claims;
CREATE POLICY "Authenticated users can insert claims"
ON public.sponsor_claims FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- vote_rejections
DROP POLICY IF EXISTS "Authenticated users can insert vote rejections" ON public.vote_rejections;
CREATE POLICY "Authenticated users can insert vote rejections"
ON public.vote_rejections FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (voter_id = auth.uid() OR voter_id IS NULL));

-- judges: hide email/phone from anonymous visitors
REVOKE SELECT (email, phone) ON public.judges FROM anon;

-- nomination_ingest_audit: was RLS enabled with no policy
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='nomination_ingest_audit') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view ingest audit" ON public.nomination_ingest_audit';
    EXECUTE 'CREATE POLICY "Admins can view ingest audit" ON public.nomination_ingest_audit FOR SELECT TO authenticated USING (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;
