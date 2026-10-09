
-- ============================================================
-- 1) regions_v2: canonical Africa regions + Global Community
-- ============================================================
CREATE TABLE IF NOT EXISTS public.regions_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  region_type text NOT NULL CHECK (region_type IN ('africa_region','global_community')),
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  effective_date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.regions_v2 TO anon, authenticated;
GRANT ALL ON public.regions_v2 TO service_role;

ALTER TABLE public.regions_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regions_v2_public_read"
  ON public.regions_v2 FOR SELECT
  USING (true);

CREATE POLICY "regions_v2_admin_write"
  ON public.regions_v2 FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_regions_v2_updated
  BEFORE UPDATE ON public.regions_v2
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 8 Africa regions + African Diaspora
INSERT INTO public.regions_v2 (code, slug, name, region_type, display_order, description) VALUES
  ('NORTH_AFRICA','north-africa','North Africa','africa_region',1,'Mediterranean-facing nations advancing literacy, university excellence, and cross-border education partnerships.'),
  ('WEST_AFRICA','west-africa','West Africa','africa_region',2,'The most populous African region, home to large education systems, EdTech innovation hubs and youth movements.'),
  ('CENTRAL_AFRICA','central-africa','Central Africa','africa_region',3,'Equatorial nations expanding access to schooling, teacher training and francophone learning networks.'),
  ('EAST_AFRICA','east-africa','East Africa','africa_region',4,'The East African Community and neighbours advancing STEM, digital learning and community-based schooling.'),
  ('HORN_OF_AFRICA','horn-of-africa','Horn of Africa','africa_region',5,'Resilient education systems in the Horn advancing access in crisis, refugee education and higher-learning renewal.'),
  ('SOUTHERN_AFRICA','southern-africa','Southern Africa','africa_region',6,'SADC nations leading on inclusive schooling, TVET reform, higher-education research and public-private partnerships.'),
  ('SAHEL_REGION','sahel-region','Sahel Region','africa_region',7,'Sahelian countries expanding access, girls'' education and community learning amid climate and security challenges.'),
  ('INDIAN_OCEAN_ISLANDS','indian-ocean-islands','Indian Ocean Islands','africa_region',8,'Island nations of the Indian Ocean advancing multilingual education, marine science and inclusive schooling.'),
  ('AFRICAN_DIASPORA','african-diaspora','African Diaspora','global_community',9,'Africans and people of African descent living outside Africa — recognised as a Global Community track, separate from the 8 Africa regions.')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 2) countries: canonical ISO country → region mapping
-- ============================================================
CREATE TABLE IF NOT EXISTS public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iso2 text NOT NULL UNIQUE,
  iso3 text UNIQUE,
  name text NOT NULL,
  region_code text REFERENCES public.regions_v2(code) ON UPDATE CASCADE,
  is_african boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_region_code ON public.countries(region_code);

GRANT SELECT ON public.countries TO anon, authenticated;
GRANT ALL ON public.countries TO service_role;

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "countries_public_read"
  ON public.countries FOR SELECT
  USING (true);

CREATE POLICY "countries_admin_write"
  ON public.countries FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_countries_updated
  BEFORE UPDATE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed African countries per the approved 8-region model.
INSERT INTO public.countries (iso2, iso3, name, region_code, is_african) VALUES
  -- North Africa
  ('DZ','DZA','Algeria','NORTH_AFRICA',true),
  ('EG','EGY','Egypt','NORTH_AFRICA',true),
  ('LY','LBY','Libya','NORTH_AFRICA',true),
  ('MA','MAR','Morocco','NORTH_AFRICA',true),
  ('TN','TUN','Tunisia','NORTH_AFRICA',true),
  -- West Africa
  ('BJ','BEN','Benin','WEST_AFRICA',true),
  ('CV','CPV','Cabo Verde','WEST_AFRICA',true),
  ('CI','CIV','Côte d''Ivoire','WEST_AFRICA',true),
  ('GM','GMB','The Gambia','WEST_AFRICA',true),
  ('GH','GHA','Ghana','WEST_AFRICA',true),
  ('GN','GIN','Guinea','WEST_AFRICA',true),
  ('GW','GNB','Guinea-Bissau','WEST_AFRICA',true),
  ('LR','LBR','Liberia','WEST_AFRICA',true),
  ('NG','NGA','Nigeria','WEST_AFRICA',true),
  ('SN','SEN','Senegal','WEST_AFRICA',true),
  ('SL','SLE','Sierra Leone','WEST_AFRICA',true),
  ('TG','TGO','Togo','WEST_AFRICA',true),
  -- Central Africa
  ('AO','AGO','Angola','CENTRAL_AFRICA',true),
  ('CM','CMR','Cameroon','CENTRAL_AFRICA',true),
  ('CF','CAF','Central African Republic','CENTRAL_AFRICA',true),
  ('TD','TCD','Chad','CENTRAL_AFRICA',true),
  ('CD','COD','Democratic Republic of the Congo','CENTRAL_AFRICA',true),
  ('CG','COG','Republic of the Congo','CENTRAL_AFRICA',true),
  ('GQ','GNQ','Equatorial Guinea','CENTRAL_AFRICA',true),
  ('GA','GAB','Gabon','CENTRAL_AFRICA',true),
  ('ST','STP','São Tomé and Príncipe','CENTRAL_AFRICA',true),
  -- East Africa
  ('BI','BDI','Burundi','EAST_AFRICA',true),
  ('KE','KEN','Kenya','EAST_AFRICA',true),
  ('RW','RWA','Rwanda','EAST_AFRICA',true),
  ('SS','SSD','South Sudan','EAST_AFRICA',true),
  ('TZ','TZA','Tanzania','EAST_AFRICA',true),
  ('UG','UGA','Uganda','EAST_AFRICA',true),
  -- Horn of Africa
  ('DJ','DJI','Djibouti','HORN_OF_AFRICA',true),
  ('ER','ERI','Eritrea','HORN_OF_AFRICA',true),
  ('ET','ETH','Ethiopia','HORN_OF_AFRICA',true),
  ('SO','SOM','Somalia','HORN_OF_AFRICA',true),
  -- Southern Africa
  ('BW','BWA','Botswana','SOUTHERN_AFRICA',true),
  ('SZ','SWZ','Eswatini','SOUTHERN_AFRICA',true),
  ('LS','LSO','Lesotho','SOUTHERN_AFRICA',true),
  ('MW','MWI','Malawi','SOUTHERN_AFRICA',true),
  ('MZ','MOZ','Mozambique','SOUTHERN_AFRICA',true),
  ('NA','NAM','Namibia','SOUTHERN_AFRICA',true),
  ('ZA','ZAF','South Africa','SOUTHERN_AFRICA',true),
  ('ZM','ZMB','Zambia','SOUTHERN_AFRICA',true),
  ('ZW','ZWE','Zimbabwe','SOUTHERN_AFRICA',true),
  -- Sahel Region
  ('BF','BFA','Burkina Faso','SAHEL_REGION',true),
  ('ML','MLI','Mali','SAHEL_REGION',true),
  ('MR','MRT','Mauritania','SAHEL_REGION',true),
  ('NE','NER','Niger','SAHEL_REGION',true),
  ('SD','SDN','Sudan','SAHEL_REGION',true),
  -- Indian Ocean Islands
  ('KM','COM','Comoros','INDIAN_OCEAN_ISLANDS',true),
  ('MG','MDG','Madagascar','INDIAN_OCEAN_ISLANDS',true),
  ('MU','MUS','Mauritius','INDIAN_OCEAN_ISLANDS',true),
  ('SC','SYC','Seychelles','INDIAN_OCEAN_ISLANDS',true)
ON CONFLICT (iso2) DO NOTHING;

-- ============================================================
-- 3) region_migration_log: audit trail for reassignments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.region_migration_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, -- 'nominee' | 'nomination' | 'award_category' | 'chapter'
  entity_id uuid NOT NULL,
  old_region text,
  new_region_code text REFERENCES public.regions_v2(code) ON UPDATE CASCADE,
  reason text,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_region_migration_entity ON public.region_migration_log(entity_type, entity_id);

GRANT SELECT, INSERT ON public.region_migration_log TO authenticated;
GRANT ALL ON public.region_migration_log TO service_role;

ALTER TABLE public.region_migration_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "region_migration_log_admin_all"
  ON public.region_migration_log FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "region_migration_log_owner_read"
  ON public.region_migration_log FOR SELECT
  TO authenticated
  USING (changed_by = auth.uid());

-- ============================================================
-- 4) Extend nominees with canonical region references
-- ============================================================
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS country_iso2 text REFERENCES public.countries(iso2) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS region_code text REFERENCES public.regions_v2(code) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS diaspora_status boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS country_of_residence_iso2 text REFERENCES public.countries(iso2) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS diaspora_continent text;

CREATE INDEX IF NOT EXISTS idx_nominees_region_code ON public.nominees(region_code);
CREATE INDEX IF NOT EXISTS idx_nominees_country_iso2 ON public.nominees(country_iso2);

-- ============================================================
-- 5) Extend nominations with canonical region references
-- ============================================================
ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS country_iso2 text REFERENCES public.countries(iso2) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS auto_assigned_region_code text REFERENCES public.regions_v2(code) ON UPDATE CASCADE,
  ADD COLUMN IF NOT EXISTS region_override_reason text,
  ADD COLUMN IF NOT EXISTS diaspora_status boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_nominations_region_code ON public.nominations(auto_assigned_region_code);

-- ============================================================
-- 6) Extend award_categories with geographic scope metadata
-- ============================================================
ALTER TABLE public.award_categories
  ADD COLUMN IF NOT EXISTS geographic_scope text, -- 'africa_regional' | 'continental' | 'pan_african' | 'national'
  ADD COLUMN IF NOT EXISTS regional_model text,   -- 'one_per_region' | 'filter_only' | 'landing_pages' | 'not_applicable'
  ADD COLUMN IF NOT EXISTS applies_to_all_regions boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS region_version text NOT NULL DEFAULT '2026-v2';
