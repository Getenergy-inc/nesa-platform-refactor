
CREATE TABLE public.contributor_entries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  title TEXT,
  country TEXT,
  region TEXT,
  year_start INTEGER NOT NULL,
  year_end INTEGER,
  image_url TEXT,
  highlight TEXT,
  bio TEXT,
  contribution_description TEXT,
  contributions TEXT[] NOT NULL DEFAULT '{}',
  appreciation TEXT,
  recommendation TEXT,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contributor_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contributor entries are publicly readable"
ON public.contributor_entries FOR SELECT USING (true);

CREATE POLICY "Admins can insert contributor entries"
ON public.contributor_entries FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contributor entries"
ON public.contributor_entries FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contributor entries"
ON public.contributor_entries FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_contributor_entries_updated_at
BEFORE UPDATE ON public.contributor_entries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
