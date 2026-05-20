-- Gallery Collections
CREATE TABLE public.gallery_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  story TEXT,
  year INTEGER,
  location TEXT,
  cover_image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery Media
CREATE TABLE public.gallery_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  collection_slug TEXT REFERENCES public.gallery_collections(slug) ON DELETE SET NULL,
  region TEXT,
  country TEXT,
  year INTEGER,
  photographer TEXT,
  photographer_credit_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_media_collection ON public.gallery_media(collection_slug);
CREATE INDEX idx_gallery_media_category ON public.gallery_media(category);
CREATE INDEX idx_gallery_media_featured ON public.gallery_media(is_featured) WHERE is_featured = true;
CREATE INDEX idx_gallery_media_published ON public.gallery_media(is_published) WHERE is_published = true;

-- RLS
ALTER TABLE public.gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;

-- Collections: public read for published
CREATE POLICY "Published collections are viewable by everyone"
  ON public.gallery_collections FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage collections"
  ON public.gallery_collections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Media: public read for published
CREATE POLICY "Published media is viewable by everyone"
  ON public.gallery_media FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage media"
  ON public.gallery_media FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER trg_gallery_collections_updated_at
  BEFORE UPDATE ON public.gallery_collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_gallery_media_updated_at
  BEFORE UPDATE ON public.gallery_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Gallery media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-media');

CREATE POLICY "Admins can upload gallery media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery-media' AND public.has_role(auth.uid(), 'admin'));