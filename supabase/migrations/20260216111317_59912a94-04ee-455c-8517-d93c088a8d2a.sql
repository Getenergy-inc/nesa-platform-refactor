
-- Remove the 5 platform-specific social media subcategories
DELETE FROM public.subcategories 
WHERE slug IN (
  'africa-youtube-education-influencer',
  'africa-tiktok-education-influencer',
  'africa-instagram-education-influencer',
  'africa-x-twitter-education-influencer',
  'africa-facebook-education-influencer'
);

-- Add 2 new social media subcategories: Educational Content and CSR for Education
INSERT INTO public.subcategories (category_id, name, slug)
SELECT id, 'Africa Social Media Educational Content Influencer', 'africa-social-media-educational-content'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education'
UNION ALL
SELECT id, 'Africa Social Media CSR for Education Influencer', 'africa-social-media-csr-education'
FROM public.categories WHERE slug = 'africa-social-media-influencer-education';
