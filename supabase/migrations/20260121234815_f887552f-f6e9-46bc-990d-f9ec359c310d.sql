-- Create storage bucket for nomination evidence
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nomination-evidence',
  'nomination-evidence',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4']
);

-- RLS policies for nomination evidence bucket
CREATE POLICY "Users can upload evidence"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'nomination-evidence' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view own evidence"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'nomination-evidence' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own evidence"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'nomination-evidence' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Also create subcategories for each category to enable nominations
INSERT INTO public.subcategories (category_id, name, slug, description, display_order)
SELECT 
  c.id,
  c.name || ' - General',
  c.slug || '-general',
  'General ' || c.name || ' excellence',
  1
FROM public.categories c
WHERE NOT EXISTS (
  SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id
);