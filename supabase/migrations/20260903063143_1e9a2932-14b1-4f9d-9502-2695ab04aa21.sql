CREATE OR REPLACE FUNCTION public.enforce_research_import_review()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.nomination_source IS NOT NULL AND NEW.nomination_source ILIKE '%research compilation%' THEN
    IF NEW.status = 'approved'::nomination_status THEN
      RETURN NEW;
    END IF;
    IF NEW.publication_status = 'published'::nominee_publication_status OR NEW.nrc_verified IS TRUE THEN
      RAISE EXCEPTION 'Research-compilation imports must stay unpublished and unverified until approved (nominee %)', COALESCE(NEW.slug, NEW.id::text);
    END IF;
    IF NEW.status NOT IN ('under_review'::nomination_status, 'rejected'::nomination_status) THEN
      RAISE EXCEPTION 'Research-compilation imports must enter review (status under_review) (nominee %)', COALESCE(NEW.slug, NEW.id::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;