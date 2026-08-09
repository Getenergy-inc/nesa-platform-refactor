ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS person_id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.judges ADD COLUMN IF NOT EXISTS person_id uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.nrc_members ADD COLUMN IF NOT EXISTS person_id uuid NOT NULL DEFAULT gen_random_uuid();

-- Safe additive backfill: rows that already point at the same platform account
-- are the same human, so they share one person_id. Everything else keeps its
-- freshly generated unique id (never merge on name).
WITH keyed AS (
  SELECT user_id, gen_random_uuid() AS pid
  FROM (
    SELECT user_id FROM public.volunteers WHERE user_id IS NOT NULL
    UNION
    SELECT user_id FROM public.judges WHERE user_id IS NOT NULL
    UNION
    SELECT user_id FROM public.nrc_members WHERE user_id IS NOT NULL
  ) u
)
UPDATE public.volunteers v SET person_id = k.pid FROM keyed k WHERE v.user_id = k.user_id;

UPDATE public.judges j SET person_id = v.person_id FROM public.volunteers v WHERE j.user_id IS NOT NULL AND j.user_id = v.user_id;
UPDATE public.nrc_members n SET person_id = v.person_id FROM public.volunteers v WHERE n.user_id IS NOT NULL AND n.user_id = v.user_id;
UPDATE public.nrc_members n SET person_id = j.person_id FROM public.judges j WHERE n.user_id IS NOT NULL AND n.user_id = j.user_id;

CREATE INDEX IF NOT EXISTS volunteers_person_id_idx ON public.volunteers (person_id);
CREATE INDEX IF NOT EXISTS judges_person_id_idx ON public.judges (person_id);
CREATE INDEX IF NOT EXISTS nrc_members_person_id_idx ON public.nrc_members (person_id);

-- Keep multi-role rows in sync automatically for future inserts sharing an account.
CREATE OR REPLACE FUNCTION public.link_person_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE existing uuid;
BEGIN
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT person_id INTO existing FROM public.volunteers WHERE user_id = NEW.user_id LIMIT 1;
  IF existing IS NULL THEN
    SELECT person_id INTO existing FROM public.judges WHERE user_id = NEW.user_id LIMIT 1;
  END IF;
  IF existing IS NULL THEN
    SELECT person_id INTO existing FROM public.nrc_members WHERE user_id = NEW.user_id LIMIT 1;
  END IF;
  IF existing IS NOT NULL THEN
    NEW.person_id := existing;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS volunteers_link_person_id ON public.volunteers;
CREATE TRIGGER volunteers_link_person_id BEFORE INSERT ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.link_person_id();
DROP TRIGGER IF EXISTS judges_link_person_id ON public.judges;
CREATE TRIGGER judges_link_person_id BEFORE INSERT ON public.judges FOR EACH ROW EXECUTE FUNCTION public.link_person_id();
DROP TRIGGER IF EXISTS nrc_members_link_person_id ON public.nrc_members;
CREATE TRIGGER nrc_members_link_person_id BEFORE INSERT ON public.nrc_members FOR EACH ROW EXECUTE FUNCTION public.link_person_id();