
-- Add all missing subcategories that CSV nominees need

-- NGO Nigeria
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('ngo-ng-training', 'Teacher Training & Capacity Building', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-nigeria'), 6, true),
  ('ngo-ng-girlchild', 'Girl-Child Education', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-nigeria'), 7, true),
  ('ngo-ng-special-needs', 'Special Needs Education', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-nigeria'), 8, true),
  ('ngo-ng-community', 'Community Development', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-nigeria'), 9, true)
ON CONFLICT (slug) DO NOTHING;

-- R&D Nigeria
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('rd-ng-engineering', 'Engineering & Technology Research', (SELECT id FROM public.categories WHERE slug = 'best-research-development-nigeria'), 4, true),
  ('rd-ng-social', 'Social Sciences & Humanities Research', (SELECT id FROM public.categories WHERE slug = 'best-research-development-nigeria'), 5, true),
  ('rd-ng-environmental', 'Environmental & Sustainability Research', (SELECT id FROM public.categories WHERE slug = 'best-research-development-nigeria'), 6, true),
  ('rd-ng-medical', 'Medical & Health Research', (SELECT id FROM public.categories WHERE slug = 'best-research-development-nigeria'), 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Political Nigeria
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('political-ng-reps', 'House of Representatives', (SELECT id FROM public.categories WHERE slug = 'political-leaders-education-nigeria'), 4, true),
  ('political-ng-senators', 'Senators', (SELECT id FROM public.categories WHERE slug = 'political-leaders-education-nigeria'), 5, true),
  ('political-ng-state-leg', 'State Legislators', (SELECT id FROM public.categories WHERE slug = 'political-leaders-education-nigeria'), 6, true),
  ('political-ng-lga', 'Local Government Chairmen', (SELECT id FROM public.categories WHERE slug = 'political-leaders-education-nigeria'), 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Media Nigeria
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES ('media-ng-broadcast', 'Broadcast Media Educational Advocacy', (SELECT id FROM public.categories WHERE slug = 'best-media-educational-advocacy-nigeria'), 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Icon Award
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('icon-pioneer', 'Africa Education Pioneer Icon of the Decade', (SELECT id FROM public.categories WHERE slug = 'africa-education-icon-award'), 4, true),
  ('icon-stem', 'Africa STEM Innovator Icon of the Decade', (SELECT id FROM public.categories WHERE slug = 'africa-education-icon-award'), 5, true),
  ('icon-policy', 'Africa Education Policy Champion of the Decade', (SELECT id FROM public.categories WHERE slug = 'africa-education-icon-award'), 6, true)
ON CONFLICT (slug) DO NOTHING;

-- International
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('intl-mnc', 'Multinational Corporations', (SELECT id FROM public.categories WHERE slug = 'international-bilateral-education'), 5, true),
  ('intl-un', 'UN Agencies', (SELECT id FROM public.categories WHERE slug = 'international-bilateral-education'), 6, true),
  ('intl-ngo', 'International NGOs', (SELECT id FROM public.categories WHERE slug = 'international-bilateral-education'), 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Islamic Education
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('islamic-foundations', 'Islamic Foundations & Waqf', (SELECT id FROM public.categories WHERE slug = 'islamic-education-impact-africa'), 4, true),
  ('islamic-schools', 'Madrasah & Islamic Schools', (SELECT id FROM public.categories WHERE slug = 'islamic-education-impact-africa'), 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Library Nigeria aliases
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('library-ng-federal', 'Federal Universities', (SELECT id FROM public.categories WHERE slug = 'best-library-tertiary-nigeria'), 9, true),
  ('library-ng-state', 'State Universities', (SELECT id FROM public.categories WHERE slug = 'best-library-tertiary-nigeria'), 10, true),
  ('library-ng-private', 'Private Universities', (SELECT id FROM public.categories WHERE slug = 'best-library-tertiary-nigeria'), 11, true),
  ('library-ng-poly', 'Polytechnics & Monotechnics', (SELECT id FROM public.categories WHERE slug = 'best-library-tertiary-nigeria'), 12, true)
ON CONFLICT (slug) DO NOTHING;

-- State Nigeria long-form aliases
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('state-ng-north-central', 'North Central', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 7, true),
  ('state-ng-north-east', 'North East', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 8, true),
  ('state-ng-north-west', 'North West', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 9, true),
  ('state-ng-south-east', 'South East', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 10, true),
  ('state-ng-south-south', 'South South', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 11, true),
  ('state-ng-south-west', 'South West', (SELECT id FROM public.categories WHERE slug = 'best-education-friendly-state-nigeria'), 12, true)
ON CONFLICT (slug) DO NOTHING;

-- Diaspora
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('diaspora-infrastructure', 'Diaspora Educational Infrastructure', (SELECT id FROM public.categories WHERE slug = 'diaspora-education-impact'), 4, true),
  ('diaspora-scholarship', 'Diaspora Scholarship Programmes', (SELECT id FROM public.categories WHERE slug = 'diaspora-education-impact'), 5, true),
  ('diaspora-mentorship', 'Diaspora Mentorship & Exchange', (SELECT id FROM public.categories WHERE slug = 'diaspora-education-impact'), 6, true)
ON CONFLICT (slug) DO NOTHING;

-- STEM regional (women, youth, institutional)
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('stem-women-north-africa', 'Women in STEM (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 21, true),
  ('stem-women-east-africa', 'Women in STEM (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 22, true),
  ('stem-women-west-africa', 'Women in STEM (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 23, true),
  ('stem-women-central-africa', 'Women in STEM (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 24, true),
  ('stem-women-southern-africa', 'Women in STEM (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 25, true),
  ('stem-youth-north-africa', 'Youth STEM (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 26, true),
  ('stem-youth-east-africa', 'Youth STEM (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 27, true),
  ('stem-youth-west-africa', 'Youth STEM (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 28, true),
  ('stem-youth-central-africa', 'Youth STEM (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 29, true),
  ('stem-youth-southern-africa', 'Youth STEM (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 30, true),
  ('stem-institutional-north-africa', 'Institutional STEM (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 31, true),
  ('stem-institutional-east-africa', 'Institutional STEM (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 32, true),
  ('stem-institutional-west-africa', 'Institutional STEM (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 33, true),
  ('stem-institutional-central-africa', 'Institutional STEM (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 34, true),
  ('stem-institutional-southern-africa', 'Institutional STEM (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-stem-education-africa'), 35, true)
ON CONFLICT (slug) DO NOTHING;

-- EduTech impact aliases
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('edutech-impact-north-africa', 'EduTech Social Impact (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-edutech-organisation-africa'), 16, true),
  ('edutech-impact-east-africa', 'EduTech Social Impact (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-edutech-organisation-africa'), 17, true),
  ('edutech-impact-west-africa', 'EduTech Social Impact (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-edutech-organisation-africa'), 18, true),
  ('edutech-impact-central-africa', 'EduTech Social Impact (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-edutech-organisation-africa'), 19, true),
  ('edutech-impact-southern-africa', 'EduTech Social Impact (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-edutech-organisation-africa'), 20, true)
ON CONFLICT (slug) DO NOTHING;

-- NGO Africa regional (training, girlchild, special-needs, community × 5 regions)
INSERT INTO public.subcategories (slug, name, category_id, display_order, is_active)
VALUES 
  ('ngo-africa-training-north-africa', 'Teacher Training (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 26, true),
  ('ngo-africa-training-east-africa', 'Teacher Training (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 27, true),
  ('ngo-africa-training-west-africa', 'Teacher Training (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 28, true),
  ('ngo-africa-training-central-africa', 'Teacher Training (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 29, true),
  ('ngo-africa-training-southern-africa', 'Teacher Training (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 30, true),
  ('ngo-africa-girlchild-north-africa', 'Girl-Child Education (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 31, true),
  ('ngo-africa-girlchild-east-africa', 'Girl-Child Education (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 32, true),
  ('ngo-africa-girlchild-west-africa', 'Girl-Child Education (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 33, true),
  ('ngo-africa-girlchild-central-africa', 'Girl-Child Education (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 34, true),
  ('ngo-africa-girlchild-southern-africa', 'Girl-Child Education (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 35, true),
  ('ngo-africa-special-needs-north-africa', 'Special Needs Education (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 36, true),
  ('ngo-africa-special-needs-east-africa', 'Special Needs Education (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 37, true),
  ('ngo-africa-special-needs-west-africa', 'Special Needs Education (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 38, true),
  ('ngo-africa-special-needs-central-africa', 'Special Needs Education (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 39, true),
  ('ngo-africa-special-needs-southern-africa', 'Special Needs Education (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 40, true),
  ('ngo-africa-community-north-africa', 'Community Development (North Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 41, true),
  ('ngo-africa-community-east-africa', 'Community Development (East Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 42, true),
  ('ngo-africa-community-west-africa', 'Community Development (West Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 43, true),
  ('ngo-africa-community-central-africa', 'Community Development (Central Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 44, true),
  ('ngo-africa-community-southern-africa', 'Community Development (Southern Africa)', (SELECT id FROM public.categories WHERE slug = 'best-ngo-education-africa'), 45, true)
ON CONFLICT (slug) DO NOTHING;
