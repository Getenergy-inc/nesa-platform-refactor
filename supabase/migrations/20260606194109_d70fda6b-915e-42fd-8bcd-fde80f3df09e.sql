-- Cleaned nomination intake table for Google Forms data pipeline
CREATE TABLE public.nomination_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id TEXT NOT NULL UNIQUE,
  form_type TEXT NOT NULL,
  award_group TEXT,
  award_category TEXT,
  award_subcategory TEXT,
  nominee_name_clean TEXT,
  nominee_type_clean TEXT,
  nominee_country_clean TEXT,
  nominee_region_clean TEXT,
  nominee_city_clean TEXT,
  impact_summary_clean TEXT,
  evidence_status TEXT,
  duplicate_status TEXT DEFAULT 'Not Checked',
  duplicate_of UUID REFERENCES public.nomination_intake(id) ON DELETE SET NULL,
  verification_status TEXT DEFAULT 'Verification Pending',
  nomination_status TEXT,
  assigned_reviewer TEXT,
  reviewer_notes TEXT,
  website_sync_status TEXT DEFAULT 'Not Published',
  identity_hash TEXT,
  raw_payload JSONB,
  ingested_by UUID,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nomination_intake_identity_hash ON public.nomination_intake(identity_hash);
CREATE INDEX idx_nomination_intake_category ON public.nomination_intake(award_category, award_subcategory);
CREATE INDEX idx_nomination_intake_status ON public.nomination_intake(nomination_status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nomination_intake TO authenticated;
GRANT ALL ON public.nomination_intake TO service_role;

ALTER TABLE public.nomination_intake ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage nomination intake"
  ON public.nomination_intake FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_nomination_intake_updated_at
  BEFORE UPDATE ON public.nomination_intake
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();