
-- Special Recognition Categories (NOT part of the 17 main award categories)
-- Scope = 'SPECIAL_RECOGNITION' to clearly separate them

INSERT INTO public.categories (name, slug, description, is_active, display_order)
VALUES 
  ('Africa Music Influencer Education Support Blue Garnet Recognition Award', 'africa-music-influencer-education', 'Special recognition for music influencers supporting education across Africa', true, 100),
  ('Africa Sports Influencer Education Support Blue Garnet Recognition Award', 'africa-sports-influencer-education', 'Special recognition for sports influencers supporting education across Africa', true, 101),
  ('Africa Social Media Influencer Education Support Blue Garnet Recognition Award', 'africa-social-media-influencer-education', 'Special recognition for social media influencers supporting education across Africa', true, 102);

-- Subcategories for Music Influencer
INSERT INTO public.subcategories (category_id, name, slug)
SELECT id, 'Africa Music Artist Education Advocate', 'africa-music-artist-education-advocate'
FROM public.categories WHERE slug = 'africa-music-influencer-education';

-- Subcategories for Sports Influencer
INSERT INTO public.subcategories (category_id, name, slug)
SELECT id, 'Africa Sportsman Education Advocate', 'africa-sportsman-education-advocate'
FROM public.categories WHERE slug = 'africa-sports-influencer-education'
UNION ALL
SELECT id, 'Africa Sportswoman Education Advocate', 'africa-sportswoman-education-advocate'
FROM public.categories WHERE slug = 'africa-sports-influencer-education';

-- Subcategories for Social Media Influencer (by platform)
INSERT INTO public.subcategories (category_id, name, slug)
SELECT id, 'YouTube Education Influencer', 'africa-youtube-education-influencer'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education'
UNION ALL
SELECT id, 'TikTok Education Influencer', 'africa-tiktok-education-influencer'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education'
UNION ALL
SELECT id, 'Instagram Education Influencer', 'africa-instagram-education-influencer'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education'
UNION ALL
SELECT id, 'X/Twitter Education Influencer', 'africa-x-twitter-education-influencer'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education'
UNION ALL
SELECT id, 'Facebook Education Influencer', 'africa-facebook-education-influencer'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education';
