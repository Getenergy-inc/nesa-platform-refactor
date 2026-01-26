-- =============================================================
-- NESA-AFRICA NOMINATION SYSTEM REFACTOR: COMPREHENSIVE SCHEMA
-- =============================================================

-- 1. Create nomination_source enum for three channels
CREATE TYPE public.nomination_source AS ENUM ('START_MEMBER', 'NRC', 'PUBLIC');

-- 2. Create acceptance_status enum for nominee consent flow
CREATE TYPE public.acceptance_status AS ENUM ('PENDING', 'SENT', 'ACCEPTED', 'DECLINED');

-- 3. Create certificate_status enum for certificate lifecycle
CREATE TYPE public.certificate_status AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'RENEWED');

-- 4. Create misuse_report_status enum
CREATE TYPE public.misuse_report_status AS ENUM ('PENDING', 'REVIEWING', 'FLAGGED', 'DISMISSED', 'REVOKED');

-- 5. Create notification_status enum
CREATE TYPE public.notification_status AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- 6. Add columns to nominations table for source channel
ALTER TABLE public.nominations 
ADD COLUMN IF NOT EXISTS source public.nomination_source DEFAULT 'PUBLIC',
ADD COLUMN IF NOT EXISTS identity_hash TEXT;

-- 7. Add columns to nominees table for consent + acceptance logic
ALTER TABLE public.nominees
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS identity_hash TEXT,
ADD COLUMN IF NOT EXISTS first_letter_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS acceptance_status public.acceptance_status DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS acceptance_token TEXT,
ADD COLUMN IF NOT EXISTS acceptance_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS nrc_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS nrc_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 8. Add columns to certificates table for download lock + security
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS verification_hash TEXT,
ADD COLUMN IF NOT EXISTS qr_url TEXT,
ADD COLUMN IF NOT EXISTS status public.certificate_status DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS download_locked BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS revoke_reason TEXT,
ADD COLUMN IF NOT EXISTS renewed_from_id UUID REFERENCES public.certificates(id);

-- 9. Create acceptance_letters table (idempotent, one per nominee ever)
CREATE TABLE IF NOT EXISTS public.acceptance_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  token_expires_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivery_status TEXT DEFAULT 'pending',
  delivery_channel TEXT DEFAULT 'email',
  opened_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  response public.acceptance_status,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(nominee_id)
);

-- 10. Create evidence_bundles table for structured evidence
CREATE TABLE IF NOT EXISTS public.evidence_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id UUID REFERENCES public.nominations(id) ON DELETE CASCADE,
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE CASCADE,
  file_urls TEXT[] DEFAULT '{}',
  file_types TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Create certificate_verifications table for QR lookups
CREATE TABLE IF NOT EXISTS public.certificate_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  verification_hash TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT now(),
  verifier_ip TEXT,
  verifier_user_agent TEXT,
  result TEXT NOT NULL, -- 'VALID', 'EXPIRED', 'REVOKED'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Create misuse_reports table for certificate misuse reporting
CREATE TABLE IF NOT EXISTS public.misuse_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  verification_hash TEXT,
  reporter_name TEXT,
  reporter_email TEXT,
  reporter_user_id UUID,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status public.misuse_report_status DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Create notifications table for automated notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID,
  recipient_email TEXT,
  recipient_phone TEXT,
  template TEXT NOT NULL,
  subject TEXT,
  payload JSONB DEFAULT '{}',
  channels TEXT[] DEFAULT ARRAY['email'],
  status public.notification_status DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Create audit_events table (append-only, more structured than audit_logs)
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prevent updates/deletes on audit_events (append-only)
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit events are immutable and cannot be modified';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_audit_update ON public.audit_events;
CREATE TRIGGER prevent_audit_update
  BEFORE UPDATE OR DELETE ON public.audit_events
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- 15. Create identity hash function for deduplication
CREATE OR REPLACE FUNCTION public.generate_identity_hash(
  p_name TEXT,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized TEXT;
BEGIN
  v_normalized := LOWER(TRIM(COALESCE(p_name, ''))) || 
                  '|' || LOWER(TRIM(COALESCE(p_email, ''))) || 
                  '|' || REGEXP_REPLACE(COALESCE(p_phone, ''), '[^0-9]', '', 'g') ||
                  '|' || LOWER(TRIM(COALESCE(p_country, '')));
  RETURN encode(sha256(v_normalized::bytea), 'hex');
END;
$$;

-- 16. Create function to check certificate unlock eligibility
CREATE OR REPLACE FUNCTION public.check_certificate_unlock(p_nominee_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nominee RECORD;
BEGIN
  SELECT acceptance_status, renomination_count INTO v_nominee
  FROM public.nominees WHERE id = p_nominee_id;
  
  RETURN v_nominee.acceptance_status = 'ACCEPTED' AND v_nominee.renomination_count >= 200;
END;
$$;

-- 17. Create trigger to auto-unlock certificates when threshold reached
CREATE OR REPLACE FUNCTION public.auto_unlock_certificates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.renomination_count >= 200 AND NEW.acceptance_status = 'ACCEPTED' THEN
    UPDATE public.certificates
    SET download_locked = false, unlocked_at = now()
    WHERE nominee_id = NEW.id AND download_locked = true;
    
    -- Log the unlock event
    INSERT INTO public.audit_events (action, entity_type, entity_id, metadata)
    VALUES ('certificate_unlocked', 'nominee', NEW.id, 
            jsonb_build_object('renomination_count', NEW.renomination_count));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS auto_unlock_certificates_trigger ON public.nominees;
CREATE TRIGGER auto_unlock_certificates_trigger
  AFTER UPDATE OF renomination_count, acceptance_status ON public.nominees
  FOR EACH ROW EXECUTE FUNCTION public.auto_unlock_certificates();

-- 18. Enable RLS on new tables
ALTER TABLE public.acceptance_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- 19. RLS Policies for acceptance_letters
CREATE POLICY "Admins manage acceptance letters"
  ON public.acceptance_letters FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can view acceptance letters"
  ON public.acceptance_letters FOR SELECT
  USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

-- 20. RLS Policies for evidence_bundles
CREATE POLICY "Admins manage evidence bundles"
  ON public.evidence_bundles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can view evidence bundles"
  ON public.evidence_bundles FOR SELECT
  USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own evidence"
  ON public.evidence_bundles FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- 21. RLS Policies for certificate_verifications
CREATE POLICY "Anyone can create verification"
  ON public.certificate_verifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view verifications"
  ON public.certificate_verifications FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- 22. RLS Policies for misuse_reports
CREATE POLICY "Anyone can create misuse report"
  ON public.misuse_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins manage misuse reports"
  ON public.misuse_reports FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 23. RLS Policies for notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage notifications"
  ON public.notifications FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 24. RLS Policies for audit_events
CREATE POLICY "Admins view audit events"
  ON public.audit_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit events"
  ON public.audit_events FOR INSERT
  WITH CHECK (true);

-- 25. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nominees_identity_hash ON public.nominees(identity_hash);
CREATE INDEX IF NOT EXISTS idx_nominees_acceptance_status ON public.nominees(acceptance_status);
CREATE INDEX IF NOT EXISTS idx_nominations_source ON public.nominations(source);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_hash ON public.certificates(verification_hash);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON public.audit_events(action);