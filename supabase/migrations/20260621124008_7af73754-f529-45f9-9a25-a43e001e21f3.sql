-- Staging area for the NESA-Africa 2026 master nominee spreadsheet.
CREATE TABLE IF NOT EXISTS public.nominee_import_staging (
  record_id text PRIMARY KEY,
  name text NOT NULL,
  country text,
  state_city text,
  achievement text,
  main_category text NOT NULL,
  subcategory_label text,
  status_label text,
  imported_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.nominee_import_staging TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nominee_import_staging TO authenticated;

ALTER TABLE public.nominee_import_staging ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage import staging" ON public.nominee_import_staging
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Lookup: 2024 spreadsheet category label → 2026 DB category slug.
CREATE TABLE IF NOT EXISTS public.categories_excel_alias (
  excel_label text PRIMARY KEY,
  db_slug text NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE
);

GRANT SELECT ON public.categories_excel_alias TO anon, authenticated;
GRANT ALL ON public.categories_excel_alias TO service_role;

ALTER TABLE public.categories_excel_alias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read excel alias" ON public.categories_excel_alias
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write excel alias" ON public.categories_excel_alias
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the alias map with every "Main Category" label observed
-- in NESA_2026_Nominees_FULL_UPDATED_2.xlsx.
INSERT INTO public.categories_excel_alias (excel_label, db_slug) VALUES
  ('Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024', 'best-csr-education-africa'),
  ('Best STEM Education Program or Project (Africa-Regional)', 'best-stem-education-africa'),
  ('Best NGO for Education Advancement (Africa Regional)', 'best-ngo-education-africa'),
  ('The Overall Best CSR for Education in Nigeria Award 2024', 'best-csr-education-nigeria'),
  ('Best EduTech Organization in Nigeria and Africa 2024', 'best-edutech-organisation-africa'),
  ('Excellence in Islamic Education Impact (Africa Regional)', 'islamic-education-impact-africa'),
  ('Excellence in Christian Education Impact (Africa Regional)', 'christian-education-impact-africa'),
  ('Excellence in Diaspora Educational Impact (International)', 'diaspora-education-impact'),
  ('The best library in Nigerian tertiary institutions award 2024', 'best-library-tertiary-nigeria'),
  ('Best NGO Education Support Recognition Award (Africa-Regional)', 'best-ngo-education-nigeria'),
  ('Creative Arts Industry Contribution to Education in Nigeria 2024', 'creative-arts-education-nigeria'),
  ('Political Leaders in Nigeria 2024 Recognition Award for the Best Educational Support Services', 'political-leaders-education-nigeria'),
  ('Overall best educational friendly state in Nigeria 2024', 'best-education-friendly-state-nigeria'),
  ('Overall Best Global Education Excellence Award for Facilitating the Achievement of Education for All in Nigeria (2020-2024)', 'international-bilateral-education'),
  ('Christian faith organization Educational Champion of the Decade Award', 'christian-education-impact-africa'),
  ('Islamic faith organization Educational Champion of the Decade Award in Nigeria (2013-2024)', 'islamic-education-impact-africa'),
  ('The Overall Best Media Organization in Nigeria with Outstanding Education Focus', 'best-media-educational-advocacy-nigeria'),
  ('Diaspora Association Educational Impact in Africa', 'diaspora-education-impact'),
  ('The Overall Best Research and Development Contribution by Research Institutes in Achieving  Education for all.', 'best-research-development-nigeria')
ON CONFLICT (excel_label) DO UPDATE SET db_slug = EXCLUDED.db_slug;