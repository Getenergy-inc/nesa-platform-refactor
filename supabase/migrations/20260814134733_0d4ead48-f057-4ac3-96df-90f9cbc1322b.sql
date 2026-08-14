CREATE TABLE public.import_review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL,
  source_file text NOT NULL,
  row_number integer,
  raw_row jsonb NOT NULL DEFAULT '{}'::jsonb,
  reason text NOT NULL,
  suggested_name text,
  suggested_region text,
  suggested_country text,
  status text NOT NULL DEFAULT 'pending',
  resolved_by uuid,
  resolved_at timestamp with time zone,
  resolved_nominee_id uuid REFERENCES public.nominees(id) ON DELETE SET NULL,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.import_review_queue TO authenticated;
GRANT ALL ON public.import_review_queue TO service_role;

ALTER TABLE public.import_review_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage import review queue"
ON public.import_review_queue
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_import_review_queue_batch ON public.import_review_queue(batch_id);
CREATE INDEX idx_import_review_queue_status ON public.import_review_queue(status);

CREATE TRIGGER update_import_review_queue_updated_at
BEFORE UPDATE ON public.import_review_queue
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();