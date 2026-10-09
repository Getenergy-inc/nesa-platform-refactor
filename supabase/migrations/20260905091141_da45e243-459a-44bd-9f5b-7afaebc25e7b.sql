
-- Media status model, deliberately separate from nomination/NRC status
DO $$ BEGIN
  CREATE TYPE public.nominee_media_status AS ENUM (
    'missing','candidate_found','verification_required','verified','rejected','manually_approved','fallback'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.nominee_media_kind AS ENUM ('logo','portrait','fallback');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.nominee_media_sourcing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  nominee_slug TEXT,
  nominee_name TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'organization',
  media_kind public.nominee_media_kind NOT NULL DEFAULT 'fallback',
  media_status public.nominee_media_status NOT NULL DEFAULT 'missing',
  candidate_image_url TEXT,
  approved_asset_url TEXT,
  storage_path TEXT,
  source_url TEXT,
  source_domain TEXT,
  source_type TEXT,
  attribution TEXT,
  confidence NUMERIC(4,3),
  date_checked TIMESTAMPTZ,
  verification_note TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  submitted_by_nominee BOOLEAN NOT NULL DEFAULT false,
  usage_confirmed BOOLEAN NOT NULL DEFAULT false,
  approved_for_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id)
);

GRANT SELECT ON public.nominee_media_sourcing TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nominee_media_sourcing TO authenticated;
GRANT ALL ON public.nominee_media_sourcing TO service_role;
ALTER TABLE public.nominee_media_sourcing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved nominee media"
  ON public.nominee_media_sourcing FOR SELECT
  USING (approved_for_public = true AND media_status IN ('verified','manually_approved'));

CREATE POLICY "Staff can read all nominee media"
  ON public.nominee_media_sourcing FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

CREATE POLICY "Staff can write nominee media"
  ON public.nominee_media_sourcing FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

CREATE TRIGGER nominee_media_sourcing_updated_at
  BEFORE UPDATE ON public.nominee_media_sourcing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_nms_status ON public.nominee_media_sourcing (media_status);
CREATE INDEX IF NOT EXISTS idx_nms_nominee ON public.nominee_media_sourcing (nominee_id);

-- Editorial featuring, separate from judging/verification/results
CREATE TABLE IF NOT EXISTS public.nominee_editorial_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  category_slug TEXT,
  subcategory_slug TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  editorial_note TEXT,
  selected_by UUID,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, subcategory_slug)
);

GRANT SELECT ON public.nominee_editorial_features TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nominee_editorial_features TO authenticated;
GRANT ALL ON public.nominee_editorial_features TO service_role;
ALTER TABLE public.nominee_editorial_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read featured picks"
  ON public.nominee_editorial_features FOR SELECT USING (is_featured = true);
CREATE POLICY "Staff manage featured picks"
  ON public.nominee_editorial_features FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER nominee_editorial_features_updated_at
  BEFORE UPDATE ON public.nominee_editorial_features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Website discovery queue (never written straight into nominees)
CREATE TABLE IF NOT EXISTS public.nominee_website_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  nominee_name TEXT NOT NULL,
  candidate_domain TEXT NOT NULL,
  candidate_url TEXT NOT NULL,
  discovery_method TEXT,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  review_status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (nominee_id, candidate_domain)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nominee_website_candidates TO authenticated;
GRANT ALL ON public.nominee_website_candidates TO service_role;
ALTER TABLE public.nominee_website_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read website candidates"
  ON public.nominee_website_candidates FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));
CREATE POLICY "Staff write website candidates"
  ON public.nominee_website_candidates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'nrc'));

CREATE TRIGGER nominee_website_candidates_updated_at
  BEFORE UPDATE ON public.nominee_website_candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
