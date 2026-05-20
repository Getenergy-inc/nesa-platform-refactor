-- Nominee media library: server-backed image overrides
CREATE TABLE IF NOT EXISTS public.nominee_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_slug TEXT NOT NULL UNIQUE,
  nominee_name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('person', 'organization')),
  image_url TEXT,
  thumbnail_url TEXT,
  banner_url TEXT,
  logo_url TEXT,
  og_image_url TEXT,
  alt_text TEXT,
  caption TEXT,
  license_status TEXT NOT NULL DEFAULT 'pending' CHECK (license_status IN ('pending','licensed','public_domain','press_kit','permission_granted','rejected')),
  license_type TEXT,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('internal_gallery','cms_upload','official_website','verified_social','public_press','wikimedia','licensed_media','manual_upload')),
  attribution TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 100),
  uploaded_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nominee_media_slug ON public.nominee_media(nominee_slug);
CREATE INDEX IF NOT EXISTS idx_nominee_media_verified ON public.nominee_media(verified) WHERE verified = true;

ALTER TABLE public.nominee_media ENABLE ROW LEVEL SECURITY;

-- Public read of verified records
CREATE POLICY "Public can view verified nominee media"
  ON public.nominee_media FOR SELECT
  USING (verified = true);

-- Admin full access
CREATE POLICY "Admins can view all nominee media"
  ON public.nominee_media FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert nominee media"
  ON public.nominee_media FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update nominee media"
  ON public.nominee_media FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete nominee media"
  ON public.nominee_media FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER trg_nominee_media_updated_at
  BEFORE UPDATE ON public.nominee_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage policies: admins write, public reads (bucket is already public)
CREATE POLICY "Admins can upload nominee-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'nominee-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update nominee-media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'nominee-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete nominee-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'nominee-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read nominee-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'nominee-media');