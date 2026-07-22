
ALTER TABLE public.nominations
  ADD COLUMN IF NOT EXISTS edi_ratings JSONB,
  ADD COLUMN IF NOT EXISTS edi_matrix_key TEXT,
  ADD COLUMN IF NOT EXISTS edi_matrix_version TEXT;

CREATE INDEX IF NOT EXISTS idx_nominations_edi_matrix_key
  ON public.nominations (edi_matrix_key);

COMMENT ON COLUMN public.nominations.edi_ratings IS
  'Category-specific EDI ratings, keyed by canonical slot IDs (edi_lifetime_impact, ...). Server-validated against the resolved matrix at submission time.';
COMMENT ON COLUMN public.nominations.edi_matrix_key IS
  'Resolved EDI matrix key: "<tier>/<category>[#<pathway>]". Matches src/config/nominate2026/ediMatrix.ts registry.';
COMMENT ON COLUMN public.nominations.edi_matrix_version IS
  'EDI matrix version used at submission time (e.g. v2.0-category-specific-2026).';
