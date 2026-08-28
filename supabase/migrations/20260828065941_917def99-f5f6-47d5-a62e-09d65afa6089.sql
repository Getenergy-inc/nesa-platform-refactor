ALTER TABLE public.influencer_impact_nominees
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS influencer_impact_nominees_featured_idx
  ON public.influencer_impact_nominees (award_category, is_featured);

UPDATE public.influencer_impact_nominees
SET image_url = '/nominees/mark-angel-comedy.jpg', is_featured = true
WHERE slug = 'mark-angel-comedy';

UPDATE public.influencer_impact_nominees
SET image_url = '/nominees/wode-maya.jpg', is_featured = true
WHERE slug = 'wode-maya';