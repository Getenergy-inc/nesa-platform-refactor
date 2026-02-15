
-- Certificate download audit log
CREATE TABLE public.certificate_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

ALTER TABLE public.certificate_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON public.certificate_downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can log downloads"
  ON public.certificate_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all downloads"
  ON public.certificate_downloads FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_cert_downloads_user ON public.certificate_downloads(user_id);
CREATE INDEX idx_cert_downloads_cert ON public.certificate_downloads(certificate_id);
CREATE INDEX idx_cert_downloads_time ON public.certificate_downloads(downloaded_at DESC);
