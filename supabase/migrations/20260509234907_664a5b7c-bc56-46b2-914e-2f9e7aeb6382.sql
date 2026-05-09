
-- Public bucket for contributor photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('contributor-photos', 'contributor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "Contributor photos are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'contributor-photos');

CREATE POLICY "Admins can upload contributor photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'contributor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contributor photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'contributor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contributor photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'contributor-photos' AND public.has_role(auth.uid(), 'admin'));

-- Overrides table keyed by the static contributor id
CREATE TABLE public.contributor_photos (
  contributor_id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contributor_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributor photos are publicly readable"
ON public.contributor_photos FOR SELECT
USING (true);

CREATE POLICY "Admins can insert contributor photos"
ON public.contributor_photos FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contributor photos"
ON public.contributor_photos FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contributor photos"
ON public.contributor_photos FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_contributor_photos_updated_at
BEFORE UPDATE ON public.contributor_photos
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
