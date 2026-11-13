DROP POLICY IF EXISTS "Authenticated users can insert shipping addresses" ON public.shipping_addresses;
CREATE POLICY "Users can insert shipping addresses for own orders" ON public.shipping_addresses
FOR INSERT TO authenticated
WITH CHECK (order_id IN (SELECT o.id FROM public.orders o WHERE o.user_id = auth.uid()));