INSERT INTO public.nominees
  (name, slug, organization, bio, country, region, subcategory_id, season_id,
   status, publication_status, nrc_verified, legacy_source, data_source, profile_status, profile_completion_score)
SELECT v.name, v.slug, v.name, v.bio, v.country, v.region,
       (SELECT s.id FROM public.subcategories s JOIN public.categories c ON c.id = s.category_id
         WHERE c.slug = 'best-ngo-education-africa' AND s.slug = v.sub_slug),
       '37559f3f-c83e-437c-a6fc-a87fb47348b8'::uuid,
       'under_review'::nomination_status, 'unpublished'::nominee_publication_status, false,
       'Research compilation — Aug 2026', 'historical_register_unconfirmed', 'partial'::nominee_profile_status, 40
FROM (VALUES
 ('Plan International Nigeria','ngo-africa-plan-international-nigeria-2026','Nigeria','West Africa','ngo-africa-girlchild-west-africa','Reports 36.9 million people reached across 21 states and 1,729 communities in Nigeria, with a strong focus on girlsّ education and child rights. Evidence grade A/B (research compilation, Aug 2026).'),
 ('ActionAid Nigeria','ngo-africa-actionaid-nigeria-2026','Nigeria','West Africa','ngo-africa-girlchild-west-africa','Education-rights reform and education-system strengthening work in Nigeria, 2017–2025, including girls'' access and retention. Evidence grade A/B (research compilation, Aug 2026).'),
 ('ActionAid Ghana','ngo-africa-actionaid-ghana-2026','Ghana','West Africa','ngo-africa-girlchild-west-africa','Education-rights advocacy, girls'' education and community education programming in Ghana from 2024. Evidence grade A/B (research compilation, Aug 2026).'),
 ('Development Research and Projects Centre (dRPC)','ngo-africa-drpc-nigeria-2026','Nigeria','West Africa','ngo-africa-girlchild-west-africa','Works across northern Nigerian states; supported 40 girls to run early childhood care and development centres, 2013–2025. Evidence grade A/B (research compilation, Aug 2026).'),
 ('The Education Partnership Centre (TEP Centre)','ngo-africa-tep-centre-2026','Nigeria','West Africa','ngo-africa-training-west-africa','Reports 1 million+ children reached and 5,000+ educators supported; LEARNigeria assessed 40,000 children, 2013–2025. Evidence grade A/B (research compilation, Aug 2026).'),
 ('LEAP Africa','ngo-africa-leap-africa-2026','Nigeria','West Africa','ngo-africa-training-west-africa','iLEAD programme reached 2,017 students since 2017, with 18% progressing into higher education. Evidence grade A/B (research compilation, Aug 2026).'),
 ('I Choose Life–Africa','ngo-africa-i-choose-life-africa-2026','Kenya','East Africa','ngo-africa-girlchild-east-africa','Reached 10,170 girls, trained 302 teachers and deployed school-information systems in 60 schools in Kenya. Evidence grade A/B (research compilation, Aug 2026).'),
 ('CAMFED','ngo-africa-camfed-2026','Zimbabwe','East Africa','ngo-africa-girlchild-east-africa','Operates in Ghana, Malawi, Tanzania, Zambia, Zimbabwe and Kenya; 772,844 girls newly benefited in 2025 and 7.8 million historically. Evidence grade A/B (research compilation, Aug 2026).'),
 ('Together We Learn Ethiopia','ngo-africa-together-we-learn-ethiopia-2026','Ethiopia','East Africa','ngo-africa-training-east-africa','Reached 165,000 students through teacher training, built 1,800 new facilities and sponsored 391 students, 2023–2024. Evidence grade A/B (research compilation, Aug 2026).'),
 ('Edukans','ngo-africa-edukans-2026','Ethiopia','East Africa','ngo-africa-training-east-africa','Multi-year teacher development and education-in-emergencies programming across Ethiopia, Kenya, Malawi, Rwanda, Uganda and Ghana. Evidence grade A/B (research compilation, Aug 2026).'),
 ('Educate!','ngo-africa-educate-2026','Uganda','East Africa','ngo-africa-training-east-africa','Secondary-school leadership, entrepreneurship and skills programming in Uganda, Kenya and Rwanda and wider Africa since 2002. Evidence grade A/B (research compilation, Aug 2026).'),
 ('Right To Play','ngo-africa-right-to-play-2026','Kenya','East Africa','ngo-africa-training-east-africa','Active in 15 countries including several in Africa; reported 4.7 million+ children reached and 104,000+ teachers trained in 2024. Evidence grade A/B (research compilation, Aug 2026).')
) AS v(name, slug, country, region, sub_slug, bio)
WHERE NOT EXISTS (SELECT 1 FROM public.nominees n WHERE n.slug = v.slug);