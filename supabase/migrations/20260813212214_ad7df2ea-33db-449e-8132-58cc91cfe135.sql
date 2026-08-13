CREATE TABLE IF NOT EXISTS public._nrc_stage4_results (
  id bigserial PRIMARY KEY,
  check_name text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public._nrc_stage4_results TO service_role;
GRANT SELECT, INSERT ON public._nrc_stage4_results TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public._nrc_stage4_results_id_seq TO authenticated;
ALTER TABLE public._nrc_stage4_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "internal scratch" ON public._nrc_stage4_results FOR ALL TO authenticated USING (true) WITH CHECK (true);