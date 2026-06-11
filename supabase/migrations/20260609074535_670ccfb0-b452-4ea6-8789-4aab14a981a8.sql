-- ============================================================================
-- NESA-Africa Hybrid Nomination System — Step 1 Schema
-- Extends nominations + nominees; adds nominators, sync_batches, sync_logs,
-- notification_logs. All public tables get explicit GRANTs + RLS.
-- ============================================================================

-- ---------- 1. NOMINATORS (normalized contact registry) -------------------
CREATE TABLE IF NOT EXISTS public.nominators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email_lower TEXT,
  phone_hash TEXT,
  phone_raw TEXT,
  country_residence TEXT,
  country_origin TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'website',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT nominators_identity_present
    CHECK (email_lower IS NOT NULL OR phone_hash IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS nominators_email_uidx
  ON public.nominators (email_lower) WHERE email_lower IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS nominators_phone_uidx
  ON public.nominators (phone_hash) WHERE phone_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS nominators_user_idx ON public.nominators (user_id);

GRANT SELECT, INSERT, UPDATE ON public.nominators TO authenticated;
GRANT ALL ON public.nominators TO service_role;

ALTER TABLE public.nominators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nominators self read" ON public.nominators
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Nominators self upsert" ON public.nominators
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Nominators self update" ON public.nominators
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_nominators_updated_at
  BEFORE UPDATE ON public.nominators
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------- 2. NOMINATIONS extensions -------------------------------------
ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS nominator_id UUID REFERENCES public.nominators(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_channel TEXT NOT NULL DEFAULT 'website'
    CHECK (source_channel IN ('website','google_form','admin_import','migration')),
  ADD COLUMN IF NOT EXISTS submission_kind TEXT NOT NULL DEFAULT 'official_nomination'
    CHECK (submission_kind IN ('pre_nomination_lead','official_nomination','rmsa_school_intervention')),
  ADD COLUMN IF NOT EXISTS award_family TEXT,
  ADD COLUMN IF NOT EXISTS award_category_slug TEXT,
  ADD COLUMN IF NOT EXISTS award_subcategory_slug TEXT,
  ADD COLUMN IF NOT EXISTS region_slug TEXT,
  ADD COLUMN IF NOT EXISTS zone_slug TEXT,
  ADD COLUMN IF NOT EXISTS state_slug TEXT,
  ADD COLUMN IF NOT EXISTS recognition_class TEXT,
  ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'unpublished'
    CHECK (publication_status IN ('unpublished','queued','published','retracted')),
  ADD COLUMN IF NOT EXISTS source_form_id TEXT,
  ADD COLUMN IF NOT EXISTS source_sheet_id TEXT,
  ADD COLUMN IF NOT EXISTS source_row_id TEXT,
  ADD COLUMN IF NOT EXISTS dedupe_match_id UUID,
  ADD COLUMN IF NOT EXISTS dedupe_score NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS verification_tier TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS nominations_source_unique_idx
  ON public.nominations (source_form_id, source_sheet_id, source_row_id)
  WHERE source_form_id IS NOT NULL AND source_row_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS nominations_publication_status_idx
  ON public.nominations (publication_status);
CREATE INDEX IF NOT EXISTS nominations_submission_kind_idx
  ON public.nominations (submission_kind);
CREATE INDEX IF NOT EXISTS nominations_region_zone_idx
  ON public.nominations (region_slug, zone_slug, state_slug);

-- ---------- 3. NOMINEES publication columns -------------------------------
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS source_nomination_id UUID REFERENCES public.nominations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_tier TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS nominees_published_at_idx ON public.nominees (published_at);

-- ---------- 4. SYNC BATCHES -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_kind TEXT NOT NULL CHECK (source_kind IN ('google_sheet','manual_csv','rest_endpoint')),
  source_label TEXT NOT NULL,
  source_form_id TEXT,
  source_sheet_id TEXT,
  triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trigger_kind TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_kind IN ('manual','cron','webhook')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','running','succeeded','failed','partial')),
  rows_seen INT NOT NULL DEFAULT 0,
  rows_inserted INT NOT NULL DEFAULT 0,
  rows_updated INT NOT NULL DEFAULT 0,
  rows_skipped INT NOT NULL DEFAULT 0,
  rows_failed INT NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sync_batches TO authenticated;
GRANT ALL ON public.sync_batches TO service_role;

ALTER TABLE public.sync_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read sync batches" ON public.sync_batches
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_sync_batches_updated_at
  BEFORE UPDATE ON public.sync_batches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------- 5. SYNC LOGS --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.sync_batches(id) ON DELETE CASCADE,
  source_row_id TEXT,
  nomination_id UUID REFERENCES public.nominations(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('inserted','updated','skipped','duplicate','failed')),
  reason TEXT,
  raw_payload JSONB,
  normalized_payload JSONB,
  dedupe_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sync_logs_batch_idx ON public.sync_logs (batch_id);
CREATE INDEX IF NOT EXISTS sync_logs_nomination_idx ON public.sync_logs (nomination_id);

GRANT SELECT ON public.sync_logs TO authenticated;
GRANT ALL ON public.sync_logs TO service_role;

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read sync logs" ON public.sync_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ---------- 6. NOTIFICATION LOGS ------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','in_app','webhook')),
  template TEXT NOT NULL,
  recipient TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  nomination_id UUID REFERENCES public.nominations(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','sent','failed','bounced','suppressed')),
  provider TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notification_logs_nomination_idx ON public.notification_logs (nomination_id);
CREATE INDEX IF NOT EXISTS notification_logs_status_idx ON public.notification_logs (status);

GRANT SELECT ON public.notification_logs TO authenticated;
GRANT ALL ON public.notification_logs TO service_role;

ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read notification logs" ON public.notification_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_notification_logs_updated_at
  BEFORE UPDATE ON public.notification_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
