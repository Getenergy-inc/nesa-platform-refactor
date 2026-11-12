
-- Public submission forms: validate shape, block admin/review fields, bind any user id to the caller
DROP POLICY IF EXISTS "Anyone can submit bulk order lead" ON public.bulk_order_leads;
CREATE POLICY "Anyone can submit bulk order lead" ON public.bulk_order_leads FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(organization_name)) BETWEEN 1 AND 300 AND length(btrim(contact_name)) BETWEEN 1 AND 200
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(contact_email) <= 320
  AND coalesce(status,'new') = 'new' AND (estimated_quantity IS NULL OR estimated_quantity BETWEEN 0 AND 1000000));

DROP POLICY IF EXISTS "Anyone can submit partnership lead" ON public.partnership_leads;
CREATE POLICY "Anyone can submit partnership lead" ON public.partnership_leads FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320
  AND length(btrim(lead_type)) BETWEEN 1 AND 50 AND status = 'new' AND (amount IS NULL OR amount >= 0));

DROP POLICY IF EXISTS "Anyone can create verification" ON public.certificate_verifications;
CREATE POLICY "Anyone can create verification" ON public.certificate_verifications FOR INSERT TO anon, authenticated
WITH CHECK (length(verification_hash) BETWEEN 8 AND 256 AND length(result) BETWEEN 1 AND 50
  AND EXISTS (SELECT 1 FROM public.certificates c WHERE c.id = certificate_id));

DROP POLICY IF EXISTS "Anyone can create misuse report" ON public.misuse_reports;
CREATE POLICY "Anyone can create misuse report" ON public.misuse_reports FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(reason)) BETWEEN 1 AND 5000
  AND (reporter_user_id IS NULL OR reporter_user_id = auth.uid())
  AND reviewed_by IS NULL AND reviewed_at IS NULL AND admin_notes IS NULL
  AND EXISTS (SELECT 1 FROM public.certificates c WHERE c.id = certificate_id));

DROP POLICY IF EXISTS "Anyone can submit judge application" ON public.judge_applications;
CREATE POLICY "Anyone can submit judge application" ON public.judge_applications FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(full_name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (user_id IS NULL OR user_id = auth.uid()) AND status = 'pending'
  AND reviewed_by IS NULL AND approved_at IS NULL AND rejected_at IS NULL AND verified_at IS NULL AND review_notes IS NULL);

DROP POLICY IF EXISTS "Anyone can submit an NRC application" ON public.nrc_applications;
CREATE POLICY "Anyone can submit an NRC application" ON public.nrc_applications FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(full_name)) BETWEEN 1 AND 200 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(motivation)) BETWEEN 1 AND 10000
  AND (user_id IS NULL OR user_id = auth.uid()) AND status = 'pending'
  AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_notes IS NULL AND invitation_id IS NULL);

DROP POLICY IF EXISTS "Anyone can submit renominations" ON public.renominations;
CREATE POLICY "Anyone can submit renominations" ON public.renominations FOR INSERT TO anon, authenticated
WITH CHECK (length(btrim(nominee_slug)) BETWEEN 1 AND 300 AND length(btrim(nominee_name)) BETWEEN 1 AND 300
  AND (submitter_id IS NULL OR submitter_id = auth.uid()) AND status = 'pending'
  AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_notes IS NULL);

DROP POLICY IF EXISTS "Authenticated users can insert escalation logs" ON public.escalation_logs;
CREATE POLICY "Authenticated users can insert escalation logs" ON public.escalation_logs FOR INSERT TO authenticated
WITH CHECK ((user_id IS NULL OR user_id = auth.uid()) AND length(conversation_id) BETWEEN 1 AND 200
  AND reviewed_by IS NULL AND reviewed_at IS NULL AND admin_notes IS NULL AND coalesce(status,'pending') = 'pending');

DROP POLICY IF EXISTS "Anyone can log clicks" ON public.sponsor_clicks;
CREATE POLICY "Anyone can log clicks" ON public.sponsor_clicks FOR INSERT TO anon, authenticated
WITH CHECK ((user_id IS NULL OR user_id = auth.uid()) AND (campaign_id IS NOT NULL OR link_id IS NOT NULL)
  AND (anon_id IS NULL OR length(anon_id) <= 200));

DROP POLICY IF EXISTS "Anyone can log funnel events" ON public.nomination_funnel_events;
CREATE POLICY "Anyone can log funnel events" ON public.nomination_funnel_events FOR INSERT TO anon, authenticated
WITH CHECK ((user_id IS NULL OR user_id = auth.uid()) AND length(session_id) BETWEEN 1 AND 200 AND length(step) BETWEEN 1 AND 100);

-- Public reference content: only expose well-formed published rows
DROP POLICY IF EXISTS "Public read excel alias" ON public.categories_excel_alias;
CREATE POLICY "Public read excel alias" ON public.categories_excel_alias FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.categories c WHERE c.slug = db_slug));

DROP POLICY IF EXISTS "Public view teams" ON public.volunteer_teams;
CREATE POLICY "Public view teams" ON public.volunteer_teams FOR SELECT TO anon, authenticated
USING (length(btrim(name)) > 0 AND slug IS NOT NULL);

DROP POLICY IF EXISTS "Contributor entries are publicly readable" ON public.contributor_entries;
CREATE POLICY "Contributor entries are publicly readable" ON public.contributor_entries FOR SELECT TO anon, authenticated
USING (length(btrim(name)) > 0);

DROP POLICY IF EXISTS "Contributor photos are publicly readable" ON public.contributor_photos;
CREATE POLICY "Contributor photos are publicly readable" ON public.contributor_photos FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.contributor_entries e WHERE e.id = contributor_id));
