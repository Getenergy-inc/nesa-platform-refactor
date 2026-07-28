CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton BOOLEAN NOT NULL DEFAULT true,
  tiers INTEGER NOT NULL DEFAULT 4,
  total_categories INTEGER NOT NULL DEFAULT 22,
  total_forms INTEGER NOT NULL DEFAULT 18,
  icon_subcategories INTEGER NOT NULL DEFAULT 9,
  influencer_subcategories INTEGER NOT NULL DEFAULT 3,
  platinum_subcategories INTEGER NOT NULL DEFAULT 27,
  gold_blue_garnet_subcategories INTEGER NOT NULL DEFAULT 63,
  total_regions INTEGER NOT NULL DEFAULT 8,
  global_communities INTEGER NOT NULL DEFAULT 2,
  registered_chapters INTEGER NOT NULL DEFAULT 30,
  active_volunteer_chapters INTEGER NOT NULL DEFAULT 10,
  icon_laureates INTEGER NOT NULL DEFAULT 9,
  directory_nominees INTEGER NOT NULL DEFAULT 0,
  volunteers INTEGER NOT NULL DEFAULT 0,
  volunteer_countries INTEGER NOT NULL DEFAULT 0,
  impact_stories INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_stats_singleton_unique UNIQUE (singleton),
  CONSTRAINT site_stats_singleton_true CHECK (singleton = true)
);

GRANT SELECT ON public.site_stats TO anon, authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_stats_public_read"
  ON public.site_stats
  FOR SELECT
  USING (true);

CREATE POLICY "site_stats_admin_update"
  ON public.site_stats
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_stats_admin_insert"
  ON public.site_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_stats_set_updated_at
  BEFORE UPDATE ON public.site_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_stats (singleton) VALUES (true)
ON CONFLICT (singleton) DO NOTHING;