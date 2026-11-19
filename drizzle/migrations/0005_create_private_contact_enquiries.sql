CREATE TABLE public.contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 160),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 320),
  organisation text CHECK (organisation IS NULL OR char_length(organisation) <= 200),
  enquiry_type text NOT NULL CHECK (enquiry_type IN ('General enquiry','Nomination help','Nominee acceptance','Evidence submission','Correction or update','Consent or privacy','NRRC or judging','Certificates','Online programme','Media or podcast','Volunteering','Local chapters','Partnership','Sponsorship','Donation','Merchandise','School support','Technical support')),
  country text NOT NULL CHECK (char_length(country) BETWEEN 2 AND 120),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 60),
  preferred_contact text NOT NULL CHECK (preferred_contact IN ('Email','Phone','Either')),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 3 AND 240),
  message text NOT NULL CHECK (char_length(message) BETWEEN 20 AND 5000),
  related_reference text CHECK (related_reference IS NULL OR char_length(related_reference) <= 100),
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','waiting_for_sender','resolved','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE (status, updated_at) ON public.contact_enquiries TO authenticated;
GRANT ALL ON public.contact_enquiries TO service_role;

ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can create consented contact enquiries"
ON public.contact_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (consent = true AND status = 'new');

CREATE POLICY "Administrators can read contact enquiries"
ON public.contact_enquiries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Administrators can update enquiry status"
ON public.contact_enquiries
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));