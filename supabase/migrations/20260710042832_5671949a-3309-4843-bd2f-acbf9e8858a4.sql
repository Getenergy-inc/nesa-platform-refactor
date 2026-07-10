
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS recognition_pathway TEXT
  CHECK (recognition_pathway IN ('social_media', 'sports', 'music'));

CREATE INDEX IF NOT EXISTS idx_nominees_recognition_pathway
  ON public.nominees(recognition_pathway)
  WHERE recognition_pathway IS NOT NULL;

UPDATE public.nominees n
SET recognition_pathway = CASE
    WHEN sub.slug ILIKE 'africa-social-media%' THEN 'social_media'
    WHEN sub.slug ILIKE 'africa-sports%' THEN 'sports'
    WHEN sub.slug ILIKE 'africa-music%' THEN 'music'
    ELSE NULL
END
FROM public.nominations nom
JOIN public.subcategories sub ON sub.id = nom.subcategory_id
WHERE nom.created_nominee_id = n.id
  AND n.recognition_pathway IS NULL
  AND (
    sub.slug ILIKE 'africa-social-media%'
    OR sub.slug ILIKE 'africa-sports%'
    OR sub.slug ILIKE 'africa-music%'
  );
