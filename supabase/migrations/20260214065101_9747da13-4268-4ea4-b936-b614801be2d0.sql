
-- =============================================
-- PART 1: Regions Table (canonical region list)
-- =============================================
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Regions are public" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Admins manage regions" ON public.regions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed merged region list (existing 7 + new sub-regions)
INSERT INTO public.regions (name, slug, display_order) VALUES
  ('West Africa', 'west-africa', 1),
  ('East Africa', 'east-africa', 2),
  ('Central Africa', 'central-africa', 3),
  ('Southern Africa', 'southern-africa', 4),
  ('North Africa', 'north-africa', 5),
  ('Sahel Region', 'sahel-region', 6),
  ('Horn of Africa', 'horn-of-africa', 7),
  ('Indian Ocean Islands', 'indian-ocean-islands', 8),
  ('Diaspora / Global Africa', 'diaspora', 9),
  ('Friends of Africa', 'friends-of-africa', 10);

-- =============================================
-- PART 2: Link chapters to regions table
-- =============================================
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES public.regions(id);

-- Update existing chapters to link to their region
UPDATE public.chapters c
SET region_id = r.id
FROM public.regions r
WHERE c.region = r.name;

-- =============================================
-- PART 3: Add region + chapter to profiles
-- =============================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES public.regions(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chapter_id UUID REFERENCES public.chapters(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS membership_level TEXT NOT NULL DEFAULT 'basic';

-- =============================================
-- PART 4: User Chapters junction (multi-chapter)
-- =============================================
CREATE TABLE public.user_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  membership_level TEXT NOT NULL DEFAULT 'basic',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE public.user_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own chapters" ON public.user_chapters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users join chapters" ON public.user_chapters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own membership" ON public.user_chapters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage user chapters" ON public.user_chapters FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PART 5: Correspondence branding table
-- =============================================
CREATE TABLE public.correspondence_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id),
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  footer_text TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.correspondence_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branding is public" ON public.correspondence_branding FOR SELECT USING (true);
CREATE POLICY "Admins manage branding" ON public.correspondence_branding FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PART 6: Country-to-region mapping table
-- =============================================
CREATE TABLE public.country_region_map (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL UNIQUE,
  region_id UUID NOT NULL REFERENCES public.regions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.country_region_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Country map is public" ON public.country_region_map FOR SELECT USING (true);
CREATE POLICY "Admins manage country map" ON public.country_region_map FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed key country mappings
INSERT INTO public.country_region_map (country, region_id) VALUES
  ('Nigeria', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Ghana', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Senegal', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Sierra Leone', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Liberia', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Gambia', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Guinea', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Togo', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Benin', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Ivory Coast', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Cape Verde', (SELECT id FROM public.regions WHERE slug='west-africa')),
  ('Kenya', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('Tanzania', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('Uganda', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('Rwanda', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('Burundi', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('South Sudan', (SELECT id FROM public.regions WHERE slug='east-africa')),
  ('Cameroon', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Democratic Republic of Congo', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Republic of Congo', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Gabon', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Central African Republic', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Chad', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('Equatorial Guinea', (SELECT id FROM public.regions WHERE slug='central-africa')),
  ('South Africa', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Zimbabwe', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Zambia', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Mozambique', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Malawi', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Botswana', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Namibia', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Lesotho', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Eswatini', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Angola', (SELECT id FROM public.regions WHERE slug='southern-africa')),
  ('Egypt', (SELECT id FROM public.regions WHERE slug='north-africa')),
  ('Morocco', (SELECT id FROM public.regions WHERE slug='north-africa')),
  ('Tunisia', (SELECT id FROM public.regions WHERE slug='north-africa')),
  ('Algeria', (SELECT id FROM public.regions WHERE slug='north-africa')),
  ('Libya', (SELECT id FROM public.regions WHERE slug='north-africa')),
  ('Mali', (SELECT id FROM public.regions WHERE slug='sahel-region')),
  ('Burkina Faso', (SELECT id FROM public.regions WHERE slug='sahel-region')),
  ('Niger', (SELECT id FROM public.regions WHERE slug='sahel-region')),
  ('Mauritania', (SELECT id FROM public.regions WHERE slug='sahel-region')),
  ('Ethiopia', (SELECT id FROM public.regions WHERE slug='horn-of-africa')),
  ('Somalia', (SELECT id FROM public.regions WHERE slug='horn-of-africa')),
  ('Eritrea', (SELECT id FROM public.regions WHERE slug='horn-of-africa')),
  ('Djibouti', (SELECT id FROM public.regions WHERE slug='horn-of-africa')),
  ('Madagascar', (SELECT id FROM public.regions WHERE slug='indian-ocean-islands')),
  ('Mauritius', (SELECT id FROM public.regions WHERE slug='indian-ocean-islands')),
  ('Seychelles', (SELECT id FROM public.regions WHERE slug='indian-ocean-islands')),
  ('Comoros', (SELECT id FROM public.regions WHERE slug='indian-ocean-islands'));
