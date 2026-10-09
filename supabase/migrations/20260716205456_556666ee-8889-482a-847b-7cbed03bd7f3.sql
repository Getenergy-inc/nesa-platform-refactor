
-- Canonical region indexing for influencer + general nominations
-- 1) influencer_impact_nominees: add region_slug column referencing regions_v2
ALTER TABLE public.influencer_impact_nominees
  ADD COLUMN IF NOT EXISTS region_slug text
    REFERENCES public.regions_v2(slug) ON UPDATE CASCADE;

-- Backfill region_slug from free-text nominee_region where a canonical match exists
UPDATE public.influencer_impact_nominees i
   SET region_slug = r.slug
  FROM public.regions_v2 r
 WHERE i.region_slug IS NULL
   AND (
     lower(trim(i.nominee_region)) = lower(r.slug)
     OR lower(trim(i.nominee_region)) = lower(r.name)
     OR lower(trim(i.nominee_region)) = replace(lower(r.slug), '-', ' ')
   );

CREATE INDEX IF NOT EXISTS idx_influencer_nominees_region_slug
  ON public.influencer_impact_nominees (region_slug);

CREATE INDEX IF NOT EXISTS idx_influencer_nominees_award_family_region
  ON public.influencer_impact_nominees (award_family, region_slug);

-- 2) nominations.region_slug already exists; add supporting indexes for influencer lookups
CREATE INDEX IF NOT EXISTS idx_nominations_region_slug
  ON public.nominations (region_slug);

CREATE INDEX IF NOT EXISTS idx_nominations_family_region
  ON public.nominations (award_family, region_slug);

-- 3) Validation trigger: normalize/validate region_slug on write
CREATE OR REPLACE FUNCTION public.validate_influencer_region_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_ok boolean;
BEGIN
  IF NEW.region_slug IS NULL OR NEW.region_slug = '' THEN
    NEW.region_slug := NULL;
    RETURN NEW;
  END IF;
  NEW.region_slug := lower(trim(NEW.region_slug));
  SELECT EXISTS(SELECT 1 FROM public.regions_v2 WHERE slug = NEW.region_slug) INTO v_ok;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'Invalid region_slug %; must be one of the 8 Africa regions or african-diaspora', NEW.region_slug
      USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_influencer_region ON public.influencer_impact_nominees;
CREATE TRIGGER trg_validate_influencer_region
  BEFORE INSERT OR UPDATE OF region_slug, nominee_region
  ON public.influencer_impact_nominees
  FOR EACH ROW EXECUTE FUNCTION public.validate_influencer_region_slug();

-- 4) Convenience view: influencer counts by region + family
CREATE OR REPLACE VIEW public.influencer_nominees_by_region
WITH (security_invoker = true)
AS
SELECT
  r.slug            AS region_slug,
  r.name            AS region_name,
  i.award_family,
  COUNT(*)          AS nominee_count,
  COUNT(*) FILTER (WHERE i.verification_status = 'verified') AS verified_count
FROM public.influencer_impact_nominees i
JOIN public.regions_v2 r ON r.slug = i.region_slug
GROUP BY r.slug, r.name, i.award_family;

GRANT SELECT ON public.influencer_nominees_by_region TO anon, authenticated;
