
ALTER POLICY "Anyone can submit bulk order lead" ON public.bulk_order_leads
WITH CHECK (length(btrim(organization_name)) BETWEEN 1 AND 300 AND length(btrim(contact_name)) BETWEEN 1 AND 200
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(contact_email) <= 320
  AND coalesce(status,'NEW') = 'NEW' AND (estimated_quantity IS NULL OR estimated_quantity BETWEEN 0 AND 1000000));
ALTER POLICY "Anyone can submit partnership lead" ON public.partnership_leads
WITH CHECK (length(btrim(name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320
  AND length(btrim(lead_type)) BETWEEN 1 AND 50 AND status = 'NEW' AND (amount IS NULL OR amount >= 0));
ALTER POLICY "Anyone can submit judge application" ON public.judge_applications
WITH CHECK (length(btrim(full_name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (user_id IS NULL OR user_id = auth.uid()) AND status IN ('submitted','pending')
  AND reviewed_by IS NULL AND approved_at IS NULL AND rejected_at IS NULL AND verified_at IS NULL AND review_notes IS NULL);
ALTER POLICY "Anyone can submit an NRC application" ON public.nrc_applications
WITH CHECK (length(btrim(full_name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(motivation)) BETWEEN 1 AND 10000
  AND (user_id IS NULL OR user_id = auth.uid()) AND status IN ('submitted','pending')
  AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_notes IS NULL AND invitation_id IS NULL);
