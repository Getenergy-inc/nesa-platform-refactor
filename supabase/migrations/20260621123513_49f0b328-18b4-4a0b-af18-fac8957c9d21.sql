-- Add tier metadata to categories so the directory can filter and
-- count nominees by the 4 NESA-Africa 2026 award tiers
-- (1 Blue Garnet · 2 Platinum · 3 Africa Education Icon · 4 Influencers).
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS tier smallint;

COMMENT ON COLUMN public.categories.tier IS
  '1=Blue Garnet, 2=Platinum, 3=Africa Education Icon, 4=Influencers Education Impact';

-- Backfill from the 2026 Awards Architecture spreadsheet.
UPDATE public.categories SET tier = 1 WHERE slug IN (
  'best-csr-education-africa',
  'best-csr-education-nigeria',
  'best-edutech-organisation-africa',
  'best-media-educational-advocacy-nigeria',
  'best-ngo-education-nigeria',
  'best-ngo-education-africa',
  'best-stem-education-africa',
  'creative-arts-education-nigeria',
  'best-education-friendly-state-nigeria'
);

UPDATE public.categories SET tier = 2 WHERE slug IN (
  'best-library-tertiary-nigeria',
  'best-research-development-nigeria',
  'christian-education-impact-africa',
  'islamic-education-impact-africa',
  'political-leaders-education-nigeria',
  'international-bilateral-education',
  'diaspora-education-impact'
);

UPDATE public.categories SET tier = 3 WHERE slug = 'africa-education-icon-award';

UPDATE public.categories SET tier = 4 WHERE slug IN (
  'africa-music-influencer-education',
  'africa-sports-influencer-education',
  'africa-social-media-influencer-education'
);

CREATE INDEX IF NOT EXISTS categories_tier_idx ON public.categories(tier);