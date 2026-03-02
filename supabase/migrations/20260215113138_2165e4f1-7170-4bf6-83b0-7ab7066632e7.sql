
-- Task C: Legacy category mapping table
CREATE TABLE public.legacy_category_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_category text NOT NULL,
  legacy_subcategory text NOT NULL,
  new_subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'mapped',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(legacy_category, legacy_subcategory)
);

ALTER TABLE public.legacy_category_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage legacy mappings" ON public.legacy_category_mappings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Legacy mappings are readable" ON public.legacy_category_mappings
  FOR SELECT USING (true);

-- Unmapped nominee queue
CREATE TABLE public.unmapped_nominee_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_data jsonb NOT NULL,
  legacy_nominee_id text,
  legacy_category text,
  legacy_subcategory text,
  nominee_name text NOT NULL,
  organization text,
  country text,
  resolution_status text NOT NULL DEFAULT 'pending',
  resolved_subcategory_id uuid REFERENCES public.subcategories(id),
  resolved_by uuid,
  resolved_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.unmapped_nominee_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage unmapped queue" ON public.unmapped_nominee_queue
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Batch email job tracking
CREATE TABLE public.migration_email_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id uuid REFERENCES public.nominees(id),
  email text NOT NULL,
  nominee_name text NOT NULL,
  template_key text NOT NULL DEFAULT 'migration_portal_link',
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  batch_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.migration_email_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage email jobs" ON public.migration_email_jobs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add legacy traceability columns to nominees
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS legacy_ids jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS legacy_source text,
  ADD COLUMN IF NOT EXISTS work_done text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;

-- Indexes
CREATE INDEX idx_unmapped_queue_status ON public.unmapped_nominee_queue(resolution_status);
CREATE INDEX idx_email_jobs_status ON public.migration_email_jobs(status);
CREATE INDEX idx_email_jobs_batch ON public.migration_email_jobs(batch_id);
CREATE INDEX idx_legacy_mappings_lookup ON public.legacy_category_mappings(legacy_category, legacy_subcategory);
CREATE INDEX idx_nominees_legacy_source ON public.nominees(legacy_source) WHERE legacy_source IS NOT NULL;
