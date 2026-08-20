
INSERT INTO public.influencer_impact_nominees
  (slug, award_family, award_category, recognition_class, nominee_name, nominee_country,
   nominee_region, education_impact_summary, verification_status)
SELECT 'jane-constance-music', 'Influencer Education Impact Award 2026', 'music',
  'African Living in Africa', 'Jane Constance', 'Mauritius', 'Indian Ocean Islands',
  'Singer / performer / advocate', 'PENDING'
WHERE NOT EXISTS (SELECT 1 FROM public.influencer_impact_nominees WHERE slug = 'jane-constance-music');
