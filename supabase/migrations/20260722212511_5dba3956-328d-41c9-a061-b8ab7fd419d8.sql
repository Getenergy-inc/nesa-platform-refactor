CREATE TABLE public.webinar_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id TEXT NOT NULL,
  webinar_title TEXT NOT NULL,
  webinar_date TEXT,
  webinar_time TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  country TEXT,
  role TEXT,
  notes TEXT,
  source TEXT DEFAULT 'webinars_page',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (webinar_id, email)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.webinar_registrations TO authenticated;
GRANT ALL ON public.webinar_registrations TO service_role;

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Authenticated users can see only their own registrations
CREATE POLICY "Users view own webinar registrations"
  ON public.webinar_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage everything
CREATE POLICY "Admins manage webinar registrations"
  ON public.webinar_registrations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_webinar_registrations_webinar ON public.webinar_registrations(webinar_id);
CREATE INDEX idx_webinar_registrations_email ON public.webinar_registrations(email);