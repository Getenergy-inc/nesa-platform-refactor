
-- Add scope column to categories
ALTER TABLE public.categories 
ADD COLUMN scope text NOT NULL DEFAULT 'AFRICA_REGIONAL';

-- Populate scope based on category names
UPDATE public.categories SET scope = 'NIGERIA' WHERE name ILIKE '%(Nigeria)%';
UPDATE public.categories SET scope = 'AFRICA_REGIONAL' WHERE name ILIKE '%(Africa Regional)%';
UPDATE public.categories SET scope = 'INTERNATIONAL' WHERE slug = 'international-bilateral-education';
UPDATE public.categories SET scope = 'DIASPORA' WHERE slug = 'diaspora-education-impact';
UPDATE public.categories SET scope = 'CONTINENTAL' WHERE slug = 'africa-education-icon-award';
UPDATE public.categories SET scope = 'AFRICA_REGIONAL' WHERE slug IN ('africa-music-influencer-education', 'africa-sports-influencer-education', 'africa-social-media-influencer-education');
