ALTER TABLE public.nominees ADD COLUMN IF NOT EXISTS nomination_source text;

COMMENT ON COLUMN public.nominees.nomination_source IS 'Attribution for where this nomination originated (e.g. "Research compilation — Aug 2026"). Distinct from legacy_source, which records legacy dataset provenance.';

UPDATE public.nominees
SET nomination_source = legacy_source,
    legacy_source = NULL
WHERE legacy_source ILIKE 'Research compilation%';

CREATE OR REPLACE FUNCTION public.enforce_research_import_review()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.nomination_source IS NOT NULL AND NEW.nomination_source ILIKE '%research compilation%' THEN
    IF NEW.publication_status = 'published'::nominee_publication_status
       OR NEW.nrc_verified IS TRUE THEN
      RAISE EXCEPTION 'Research-compilation imports must remain unpublished and unverified until reviewed (nominee %)', COALESCE(NEW.slug, NEW.id::text);
    END IF;
    IF NEW.status <> 'under_review'::nomination_status AND NEW.status <> 'approved'::nomination_status AND NEW.status <> 'rejected'::nomination_status THEN
      RAISE EXCEPTION 'Research-compilation imports must enter review (status under_review) (nominee %)', COALESCE(NEW.slug, NEW.id::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_research_import_review ON public.nominees;
CREATE TRIGGER trg_enforce_research_import_review
BEFORE INSERT OR UPDATE ON public.nominees
FOR EACH ROW EXECUTE FUNCTION public.enforce_research_import_review();