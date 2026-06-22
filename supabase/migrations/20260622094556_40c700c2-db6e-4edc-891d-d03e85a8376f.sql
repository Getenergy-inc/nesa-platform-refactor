
-- =========================================================================
-- NESA-Africa NRC Evidence Refactor — Phase 1: Database Backbone
-- =========================================================================

-- 1. ENUMS -----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.nrc_verification_status AS ENUM (
    'evidence_required','under_review','verified_contribution',
    'needs_category_verification','needs_geography_verification',
    'insufficient_evidence','public_display_ready'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_edi_band AS ENUM (
    'insufficient_evidence','emerging_evidence','verified_contribution',
    'strong_evidence','platinum_level_candidate','pending'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_research_priority AS ENUM ('low','medium','high','urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_research_status AS ENUM (
    'pending','in_review','evidence_found','needs_more_sources',
    'ready_for_review','public_display_ready'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_public_display_status AS ENUM (
    'hidden','under_nrc_review','public_display_ready'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_icon_group AS ENUM (
    'africans_in_africa','africans_in_diaspora','friends_of_africa','needs_verification'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nrc_classification_level AS ENUM (
    'africa_wide','nigeria_specific','diaspora_international_linked','needs_verification'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. EXTEND existing nominees ----------------------------------------------
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS nrc_no INTEGER,
  ADD COLUMN IF NOT EXISTS active_nominee_id TEXT,
  ADD COLUMN IF NOT EXISTS nrc_classification_level public.nrc_classification_level,
  ADD COLUMN IF NOT EXISTS nigeria_classification_group TEXT,
  ADD COLUMN IF NOT EXISTS country_of_impact TEXT,
  ADD COLUMN IF NOT EXISTS nrc_evidence_status public.nrc_verification_status,
  ADD COLUMN IF NOT EXISTS edi_band public.nrc_edi_band,
  ADD COLUMN IF NOT EXISTS public_display_status public.nrc_public_display_status DEFAULT 'hidden',
  ADD COLUMN IF NOT EXISTS research_priority public.nrc_research_priority;

CREATE UNIQUE INDEX IF NOT EXISTS nominees_nrc_no_uidx
  ON public.nominees (nrc_no) WHERE nrc_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS nominees_evidence_status_idx ON public.nominees (nrc_evidence_status);
CREATE INDEX IF NOT EXISTS nominees_public_display_idx ON public.nominees (public_display_status);

-- 3. nrc_evidence_rows  (1:1 with workbook NRC Evidence Matrix) ------------
CREATE TABLE IF NOT EXISTS public.nrc_evidence_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nrc_no INTEGER UNIQUE NOT NULL,
  active_nominee_id TEXT,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE SET NULL,
  nominee_name TEXT NOT NULL,
  nominee_type TEXT,
  country_base TEXT,
  nesa_region TEXT,
  nrc_classification_level public.nrc_classification_level,
  nigeria_classification_group TEXT,
  award_category TEXT,
  award_subcategory TEXT,
  education_contribution_summary TEXT,
  work_description TEXT,
  education_impact_area TEXT,
  impact_beneficiaries TEXT,
  impact_geography TEXT,
  evidence_strength_score NUMERIC(3,1),
  access_score NUMERIC(3,1),
  equity_score NUMERIC(3,1),
  inclusion_safeguarding_score NUMERIC(3,1),
  sustainability_reach_score NUMERIC(3,1),
  total_edi_20 NUMERIC(4,1),
  verification_status public.nrc_verification_status DEFAULT 'evidence_required',
  consent_required TEXT,
  research_priority public.nrc_research_priority DEFAULT 'medium',
  search_query_pack TEXT,
  researcher_note TEXT,
  public_website_wording TEXT,
  original_status TEXT,
  source_type TEXT,
  original_official_category TEXT,
  original_legacy_subcategory TEXT,
  public_display_status public.nrc_public_display_status DEFAULT 'hidden',
  imported_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nrc_evidence_rows TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nrc_evidence_rows TO authenticated;
GRANT ALL ON public.nrc_evidence_rows TO service_role;
ALTER TABLE public.nrc_evidence_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read display-ready NRC rows" ON public.nrc_evidence_rows
  FOR SELECT TO anon, authenticated
  USING (public_display_status = 'public_display_ready');
CREATE POLICY "Admins manage NRC rows" ON public.nrc_evidence_rows
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX nrc_evidence_rows_nominee_idx ON public.nrc_evidence_rows (nominee_id);
CREATE INDEX nrc_evidence_rows_category_idx ON public.nrc_evidence_rows (award_category);
CREATE INDEX nrc_evidence_rows_region_idx ON public.nrc_evidence_rows (nesa_region);

-- 4. nrc_evidence_sources (exploded source register) -----------------------
CREATE TABLE IF NOT EXISTS public.nrc_evidence_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nrc_row_id UUID REFERENCES public.nrc_evidence_rows(id) ON DELETE CASCADE,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE SET NULL,
  reference_no SMALLINT,
  source_title TEXT,
  source_name TEXT,
  source_url TEXT,
  source_year INTEGER,
  evidence_type TEXT,
  reliability_rating SMALLINT CHECK (reliability_rating BETWEEN 0 AND 5),
  researcher TEXT,
  date_checked DATE,
  researcher_note TEXT,
  verification_status public.nrc_verification_status DEFAULT 'evidence_required',
  source_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nrc_evidence_sources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nrc_evidence_sources TO authenticated;
GRANT ALL ON public.nrc_evidence_sources TO service_role;
ALTER TABLE public.nrc_evidence_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sources for display-ready rows" ON public.nrc_evidence_sources
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.nrc_evidence_rows r
                 WHERE r.id = nrc_row_id AND r.public_display_status = 'public_display_ready'));
CREATE POLICY "Admins manage sources" ON public.nrc_evidence_sources
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX nrc_sources_row_idx ON public.nrc_evidence_sources (nrc_row_id);

-- 5. nrc_edi_scores (11-axis Education Development Index Matrix) -----------
CREATE TABLE IF NOT EXISTS public.nrc_edi_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nrc_row_id UUID UNIQUE REFERENCES public.nrc_evidence_rows(id) ON DELETE CASCADE,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE SET NULL,
  evidence_strength NUMERIC(3,1),
  access_to_education NUMERIC(3,1),
  equity_in_education NUMERIC(3,1),
  inclusion_safeguarding NUMERIC(3,1),
  scale_of_impact NUMERIC(3,1),
  sustainability NUMERIC(3,1),
  innovation NUMERIC(3,1),
  community_relevance NUMERIC(3,1),
  education_for_all_alignment NUMERIC(3,1),
  sdg4_alignment NUMERIC(3,1),
  au_agenda_2063_alignment NUMERIC(3,1),
  total_score NUMERIC(5,1),
  average_score NUMERIC(3,2),
  edi_band public.nrc_edi_band DEFAULT 'pending',
  reviewer_note TEXT,
  date_scored TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nrc_edi_scores TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nrc_edi_scores TO authenticated;
GRANT ALL ON public.nrc_edi_scores TO service_role;
ALTER TABLE public.nrc_edi_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read EDI for display-ready rows" ON public.nrc_edi_scores
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.nrc_evidence_rows r
                 WHERE r.id = nrc_row_id AND r.public_display_status = 'public_display_ready'));
CREATE POLICY "Admins manage EDI" ON public.nrc_edi_scores
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. nrc_research_queue ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nrc_research_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nrc_row_id UUID REFERENCES public.nrc_evidence_rows(id) ON DELETE CASCADE,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE SET NULL,
  nominee_name TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  region TEXT,
  evidence_need TEXT,
  search_query_pack TEXT,
  researcher_note TEXT,
  priority public.nrc_research_priority DEFAULT 'medium',
  status public.nrc_research_status DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nrc_research_queue TO authenticated;
GRANT ALL ON public.nrc_research_queue TO service_role;
ALTER TABLE public.nrc_research_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and NRC manage research queue" ON public.nrc_research_queue
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. nrc_icon_classifications (Africa Education Icon Award only) -----------
CREATE TABLE IF NOT EXISTS public.nrc_icon_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE CASCADE,
  nrc_row_id UUID REFERENCES public.nrc_evidence_rows(id) ON DELETE CASCADE,
  award_category TEXT NOT NULL,
  award_subcategory TEXT,
  icon_classification_group public.nrc_icon_group NOT NULL DEFAULT 'needs_verification',
  country_base TEXT,
  country_of_impact TEXT,
  region_of_impact TEXT,
  evidence_status public.nrc_verification_status,
  edi_status public.nrc_edi_band,
  classification_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, award_subcategory)
);
GRANT SELECT ON public.nrc_icon_classifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nrc_icon_classifications TO authenticated;
GRANT ALL ON public.nrc_icon_classifications TO service_role;
ALTER TABLE public.nrc_icon_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read icon classifications" ON public.nrc_icon_classifications
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage icon classifications" ON public.nrc_icon_classifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Dashboard summary tables ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.nrc_regional_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT UNIQUE NOT NULL,
  total_rows INTEGER DEFAULT 0,
  africa_wide_rows INTEGER DEFAULT 0,
  nigeria_classified_rows INTEGER DEFAULT 0,
  diaspora_international_rows INTEGER DEFAULT 0,
  verified_rows INTEGER DEFAULT 0,
  evidence_required_rows INTEGER DEFAULT 0,
  balance_note TEXT,
  refreshed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nrc_regional_summary TO anon, authenticated;
GRANT ALL ON public.nrc_regional_summary TO service_role;
ALTER TABLE public.nrc_regional_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read regional summary" ON public.nrc_regional_summary
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage regional summary" ON public.nrc_regional_summary
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.nrc_nigeria_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nigeria_classification_group TEXT NOT NULL,
  state TEXT,
  geopolitical_zone TEXT,
  total_rows INTEGER DEFAULT 0,
  verified_rows INTEGER DEFAULT 0,
  evidence_required_rows INTEGER DEFAULT 0,
  category_coverage_note TEXT,
  refreshed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nigeria_classification_group, state, geopolitical_zone)
);
GRANT SELECT ON public.nrc_nigeria_summary TO anon, authenticated;
GRANT ALL ON public.nrc_nigeria_summary TO service_role;
ALTER TABLE public.nrc_nigeria_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read nigeria summary" ON public.nrc_nigeria_summary
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage nigeria summary" ON public.nrc_nigeria_summary
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 9. updated_at triggers ---------------------------------------------------
CREATE TRIGGER nrc_evidence_rows_updated BEFORE UPDATE ON public.nrc_evidence_rows
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_evidence_sources_updated BEFORE UPDATE ON public.nrc_evidence_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_edi_scores_updated BEFORE UPDATE ON public.nrc_edi_scores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_research_queue_updated BEFORE UPDATE ON public.nrc_research_queue
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_icon_classifications_updated BEFORE UPDATE ON public.nrc_icon_classifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_regional_summary_updated BEFORE UPDATE ON public.nrc_regional_summary
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER nrc_nigeria_summary_updated BEFORE UPDATE ON public.nrc_nigeria_summary
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- SECURITY FIXES — PII column protection on nominees + judges
-- =========================================================================
REVOKE SELECT (email, phone) ON public.nominees FROM anon, authenticated;
REVOKE SELECT (email, phone) ON public.judges  FROM anon, authenticated;
-- service_role and admins continue to read via admin-scoped policies + role grants.
