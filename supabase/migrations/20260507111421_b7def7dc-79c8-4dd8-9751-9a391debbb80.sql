
DROP POLICY IF EXISTS "Board members are viewable by everyone" ON public.scef_board_members;

CREATE POLICY "Board members readable by authenticated"
  ON public.scef_board_members FOR SELECT
  TO authenticated
  USING (true);

CREATE OR REPLACE VIEW public.scef_board_members_public
WITH (security_invoker = true) AS
SELECT id, full_name, role_title, bio, photo_url, region_id, is_active, appointed_date
FROM public.scef_board_members
WHERE is_active = true;

GRANT SELECT ON public.scef_board_members_public TO anon, authenticated;

DROP POLICY IF EXISTS "Branding is public" ON public.correspondence_branding;

CREATE POLICY "Branding readable by authenticated"
  ON public.correspondence_branding FOR SELECT
  TO authenticated
  USING (true);

CREATE OR REPLACE VIEW public.correspondence_branding_public
WITH (security_invoker = true) AS
SELECT id, sender_name, footer_text, logo_url, chapter_id, region_id, is_active
FROM public.correspondence_branding;

GRANT SELECT ON public.correspondence_branding_public TO anon, authenticated;

REVOKE SELECT (identity_hash) ON public.nominations FROM anon, authenticated;

DROP POLICY IF EXISTS "Users can upload evidence" ON storage.objects;

CREATE POLICY "Users can upload evidence to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'nomination-evidence'
    AND auth.uid() IS NOT NULL
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE TABLE IF NOT EXISTS public.judge_otp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  verified_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '12 hours'),
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_judge_otp_user ON public.judge_otp_sessions(user_id, expires_at DESC);

ALTER TABLE public.judge_otp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own otp sessions"
  ON public.judge_otp_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own otp session"
  ON public.judge_otp_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins manage all otp sessions"
  ON public.judge_otp_sessions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
