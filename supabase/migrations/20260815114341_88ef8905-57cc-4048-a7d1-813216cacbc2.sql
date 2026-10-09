CREATE TABLE IF NOT EXISTS public.youtube_upload_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('storage','url')),
  source_bucket text,
  source_path text,
  source_url text,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  category_id text NOT NULL DEFAULT '27',
  privacy_status text NOT NULL DEFAULT 'unlisted' CHECK (privacy_status IN ('unlisted','private','public')),
  target_table text,
  target_record_id uuid,
  entry_point text NOT NULL DEFAULT 'api',
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','uploading','succeeded','failed')),
  youtube_video_id text,
  video_url text,
  error text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.youtube_upload_jobs TO authenticated;
GRANT ALL ON public.youtube_upload_jobs TO service_role;

ALTER TABLE public.youtube_upload_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read youtube upload jobs"
  ON public.youtube_upload_jobs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'nrc'));

CREATE INDEX IF NOT EXISTS youtube_upload_jobs_status_idx
  ON public.youtube_upload_jobs (status, created_at DESC);

CREATE TRIGGER youtube_upload_jobs_updated_at
  BEFORE UPDATE ON public.youtube_upload_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();