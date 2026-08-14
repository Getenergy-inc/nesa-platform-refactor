ALTER TABLE public.nominees DISABLE TRIGGER USER;

WITH base(slug, name, sub, title, bio, country, region, klass, photo) AS (
  VALUES
  ('didier-drogba','Didier Drogba','12c12059-f3fc-4364-a14f-e507a9782202','Football Legend & Education Philanthropist','Didier Drogba Foundation invested $8M+ in school construction, scholarships, and healthcare across Cote d''Ivoire.','Côte d''Ivoire','West Africa','African in the Diaspora','didier-drogba.jpg'),
  ('tegla-loroupe','Tegla Loroupe','7be42155-ed3a-45ec-a202-9cd0f80edc0d','Marathon Champion & Peace Education Advocate','Tegla Loroupe Peace Foundation provides education and sports training to 10,000+ refugee children.','Kenya','East Africa','African Living in Africa','tegla-loroupe.jpg'),
  ('siya-kolisi','Siya Kolisi','12c12059-f3fc-4364-a14f-e507a9782202','Rugby Captain & Township Education Champion','Kolisi Foundation has impacted 500,000+ lives through education, feeding, and youth sport in townships.','South Africa','Southern Africa','African Living in Africa','siya-kolisi.jpg'),
  ('burna-boy','Burna Boy','23b7d0f9-3939-4757-b4b0-601e4ed40b7f','Afrobeats Artist & Scholarship Funder','Funded scholarship programmes for 200+ Nigerian students; concert proceeds support school construction.','Nigeria','West Africa','African Living in Africa','burna-boy.jpg'),
  ('angelique-kidjo','Angélique Kidjo','23b7d0f9-3939-4757-b4b0-601e4ed40b7f','Global Artist & Girls Education Advocate','Batonga Foundation delivers secondary education and leadership training to girls across 10 African countries.','Benin','West Africa','African in the Diaspora','angelique-kidjo.jpg'),
  ('tems','Tems','23b7d0f9-3939-4757-b4b0-601e4ed40b7f','Recording Artist & Creative Education Advocate','Advocates for creative-arts education in African schools; supports music and arts scholarships for young Nigerians.','Nigeria','West Africa','African Living in Africa','tems.jpg'),
  ('mark-angel','Mark Angel','a62fe235-e251-4097-aca3-70fbf6e8b990','Content Creator & Education Funder','10M+ YouTube subscribers; funds school supplies and scholarships across Nigeria via content revenue.','Nigeria','West Africa','African Living in Africa','mark-angel.jpg'),
  ('elsa-majimbo','Elsa Majimbo','18e01e45-cdd9-401e-b9e6-6187e0311c28','Creator & Scholarship Access Advocate','Forbes 30U30 — partners with education NGOs to raise awareness for scholarship access across East Africa.','Kenya','East Africa','African in the Diaspora','elsa-majimbo.jpg'),
  ('wode-maya','Wode Maya','a62fe235-e251-4097-aca3-70fbf6e8b990','Storyteller & School Builder','3M+ YouTube subscribers documenting African stories; built schools in rural Ghana via content revenue.','Ghana','West Africa','African Living in Africa','wode-maya.jpg')
)
INSERT INTO public.nominees (
  subcategory_id, season_id, name, slug, title, bio, photo_url, country, region,
  status, publication_status, profile_status, profile_completion_score,
  nrc_verified, nrc_verified_at, published_at, acceptance_status,
  award_family, recognition_class, data_source, consent_confirmed
)
SELECT b.sub::uuid,
       '37559f3f-c83e-437c-a6fc-a87fb47348b8'::uuid,
       b.name, b.slug, b.title, b.bio,
       'https://sjghitoydzpirpqjules.supabase.co/storage/v1/object/public/nominee-media/influencer-2026/' || b.photo,
       b.country, b.region,
       'approved'::nomination_status, 'published'::nominee_publication_status,
       'complete'::nominee_profile_status, 90,
       true, now(), now(), 'ACCEPTED'::acceptance_status,
       'Influencer Education Impact Award 2026', b.klass, 'live_verified', true
FROM base b
WHERE NOT EXISTS (SELECT 1 FROM public.nominees n WHERE n.slug = b.slug);

ALTER TABLE public.nominees ENABLE TRIGGER USER;