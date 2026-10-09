
-- Public bucket for verified nominee media
INSERT INTO storage.buckets (id, name, public)
VALUES ('nominee-media', 'nominee-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read of verified media
CREATE POLICY "Public can read nominee media"
ON storage.objects FOR SELECT
USING (bucket_id = 'nominee-media');

-- Only admins can write/update/delete (writes happen via edge function with service role)
CREATE POLICY "Admins manage nominee media"
ON storage.objects FOR ALL
USING (bucket_id = 'nominee-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'nominee-media' AND public.has_role(auth.uid(), 'admin'));

-- Media assets registry (server-validated)
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nominee_id UUID,
  kind TEXT NOT NULL CHECK (kind IN ('logo','photo','cover','evidence')),
  bucket TEXT NOT NULL DEFAULT 'nominee-media',
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  aspect_ratio NUMERIC(6,3),
  file_hash TEXT NOT NULL,
  quality_score INTEGER NOT NULL DEFAULT 0,
  media_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (media_status IN ('pending','verified','rejected','duplicate','broken_link')),
  media_verified BOOLEAN NOT NULL DEFAULT false,
  rejection_reason TEXT,
  alt_text TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT media_assets_hash_unique UNIQUE (file_hash)
);

CREATE INDEX idx_media_assets_nominee ON public.media_assets(nominee_id);
CREATE INDEX idx_media_assets_owner ON public.media_assets(owner_user_id);
CREATE INDEX idx_media_assets_status ON public.media_assets(media_status);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Public can view verified assets (used to render nominee visuals)
CREATE POLICY "Public can view verified media"
ON public.media_assets FOR SELECT
USING (media_verified = true AND media_status = 'verified');

-- Owners can view their own uploads (any status)
CREATE POLICY "Owners can view their media"
ON public.media_assets FOR SELECT
TO authenticated
USING (owner_user_id = auth.uid());

-- Admins full access
CREATE POLICY "Admins manage media assets"
ON public.media_assets FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
