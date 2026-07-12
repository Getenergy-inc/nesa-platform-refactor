
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.recognition_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  starts_on DATE,
  ends_on DATE,
  gala_date DATE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recognition_cycles TO anon, authenticated;
GRANT ALL ON public.recognition_cycles TO service_role;
ALTER TABLE public.recognition_cycles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recognition_cycles public read" ON public.recognition_cycles;
CREATE POLICY "recognition_cycles public read" ON public.recognition_cycles FOR SELECT USING (true);
DROP POLICY IF EXISTS "recognition_cycles admin write" ON public.recognition_cycles;
CREATE POLICY "recognition_cycles admin write" ON public.recognition_cycles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.recognition_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES public.recognition_cycles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cycle_id, slug)
);
GRANT SELECT ON public.recognition_tiers TO anon, authenticated;
GRANT ALL ON public.recognition_tiers TO service_role;
ALTER TABLE public.recognition_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recognition_tiers public read" ON public.recognition_tiers;
CREATE POLICY "recognition_tiers public read" ON public.recognition_tiers FOR SELECT USING (true);
DROP POLICY IF EXISTS "recognition_tiers admin write" ON public.recognition_tiers;
CREATE POLICY "recognition_tiers admin write" ON public.recognition_tiers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.recognition_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID NOT NULL REFERENCES public.recognition_tiers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tier_id, slug)
);
GRANT SELECT ON public.recognition_categories TO anon, authenticated;
GRANT ALL ON public.recognition_categories TO service_role;
ALTER TABLE public.recognition_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recognition_categories public read" ON public.recognition_categories;
CREATE POLICY "recognition_categories public read" ON public.recognition_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "recognition_categories admin write" ON public.recognition_categories;
CREATE POLICY "recognition_categories admin write" ON public.recognition_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.recognition_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.recognition_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
GRANT SELECT ON public.recognition_subcategories TO anon, authenticated;
GRANT ALL ON public.recognition_subcategories TO service_role;
ALTER TABLE public.recognition_subcategories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recognition_subcategories public read" ON public.recognition_subcategories;
CREATE POLICY "recognition_subcategories public read" ON public.recognition_subcategories FOR SELECT USING (true);
DROP POLICY IF EXISTS "recognition_subcategories admin write" ON public.recognition_subcategories;
CREATE POLICY "recognition_subcategories admin write" ON public.recognition_subcategories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.recognition_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.recognition_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
GRANT SELECT ON public.recognition_classifications TO anon, authenticated;
GRANT ALL ON public.recognition_classifications TO service_role;
ALTER TABLE public.recognition_classifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recognition_classifications public read" ON public.recognition_classifications;
CREATE POLICY "recognition_classifications public read" ON public.recognition_classifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "recognition_classifications admin write" ON public.recognition_classifications;
CREATE POLICY "recognition_classifications admin write" ON public.recognition_classifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS recognition_cycle_id UUID REFERENCES public.recognition_cycles(id),
  ADD COLUMN IF NOT EXISTS recognition_tier_id UUID REFERENCES public.recognition_tiers(id),
  ADD COLUMN IF NOT EXISTS recognition_category_id UUID REFERENCES public.recognition_categories(id),
  ADD COLUMN IF NOT EXISTS recognition_subcategory_id UUID REFERENCES public.recognition_subcategories(id),
  ADD COLUMN IF NOT EXISTS recognition_classification_id UUID REFERENCES public.recognition_classifications(id);

CREATE INDEX IF NOT EXISTS nominations_recognition_category_idx ON public.nominations(recognition_category_id);
CREATE INDEX IF NOT EXISTS nominations_recognition_subcategory_idx ON public.nominations(recognition_subcategory_id);

DROP TRIGGER IF EXISTS trg_recognition_cycles_updated ON public.recognition_cycles;
CREATE TRIGGER trg_recognition_cycles_updated BEFORE UPDATE ON public.recognition_cycles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_recognition_tiers_updated ON public.recognition_tiers;
CREATE TRIGGER trg_recognition_tiers_updated BEFORE UPDATE ON public.recognition_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_recognition_categories_updated ON public.recognition_categories;
CREATE TRIGGER trg_recognition_categories_updated BEFORE UPDATE ON public.recognition_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_recognition_subcategories_updated ON public.recognition_subcategories;
CREATE TRIGGER trg_recognition_subcategories_updated BEFORE UPDATE ON public.recognition_subcategories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.recognition_cycles (slug, name, year, status, gala_date, metadata)
VALUES ('nesa-africa-2026', 'NESA-Africa 2026', 2026, 'active', '2026-10-22',
  jsonb_build_object('tagline', 'Enablers of Education for All Across Africa'))
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, year = EXCLUDED.year, status = EXCLUDED.status,
  gala_date = EXCLUDED.gala_date, metadata = EXCLUDED.metadata;

WITH c AS (SELECT id FROM public.recognition_cycles WHERE slug = 'nesa-africa-2026')
INSERT INTO public.recognition_tiers (cycle_id, slug, name, rank, description)
SELECT c.id, t.slug, t.name, t.rank, t.description
FROM c, (VALUES
  ('platinum', 'Platinum Recognition', 1, 'Institutional and diplomatic Enablers of Education for All Across Africa.'),
  ('gold-blue-garnet', 'Gold-Blue Garnet', 2, 'Competitive continental categories culminating at the Gala.'),
  ('africa-education-icon', 'Africa Education Icon (2006-2026)', 3, 'Twenty-year Hall of Fame honouring Literary, Technical and Philanthropy pillars.'),
  ('influencer-impact', 'Influencer Education Impact', 4, 'Social media, sports and music voices driving education for all.')
) AS t(slug, name, rank, description)
ON CONFLICT (cycle_id, slug) DO UPDATE SET
  name = EXCLUDED.name, rank = EXCLUDED.rank, description = EXCLUDED.description;
