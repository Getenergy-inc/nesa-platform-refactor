
CREATE TYPE public.communication_status AS ENUM ('replied','sent_pending_reply','draft_not_sent','not_yet_contacted','delivery_failed_permanent','delivery_delayed_temporary','email_missing');
CREATE TYPE public.communication_contact_type AS ENUM ('organisation','individual');

CREATE TABLE public.nominee_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id uuid REFERENCES public.nominees(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  contact_type public.communication_contact_type NOT NULL DEFAULT 'organisation',
  primary_email text,
  communication_status public.communication_status NOT NULL DEFAULT 'not_yet_contacted',
  last_outbound_date date,
  last_outbound_subject text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX nominee_communications_nominee_uidx ON public.nominee_communications (nominee_id) WHERE nominee_id IS NOT NULL;
CREATE INDEX nominee_communications_status_idx ON public.nominee_communications (communication_status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.nominee_communications TO authenticated;
GRANT ALL ON public.nominee_communications TO service_role;

ALTER TABLE public.nominee_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage nominee communications"
ON public.nominee_communications FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER nominee_communications_updated_at
BEFORE UPDATE ON public.nominee_communications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.v_master_taxonomy_register
WITH (security_invoker = true) AS
SELECT
  c.id AS category_id,
  c.slug AS category_slug,
  c.name AS category_name,
  c.tier,
  c.scope,
  c.country,
  s.id AS subcategory_id,
  s.slug AS subcategory_slug,
  s.name AS subcategory_name,
  s.is_active,
  COUNT(n.id) AS nominee_count,
  COUNT(n.id) FILTER (WHERE n.status = 'under_review') AS under_review_count,
  COUNT(n.id) FILTER (WHERE n.publication_status = 'published') AS published_count
FROM public.categories c
JOIN public.subcategories s ON s.category_id = c.id
LEFT JOIN public.nominees n ON n.subcategory_id = s.id
GROUP BY c.id, c.slug, c.name, c.tier, c.scope, c.country, s.id, s.slug, s.name, s.is_active;

GRANT SELECT ON public.v_master_taxonomy_register TO anon, authenticated, service_role;

CREATE VIEW public.v_nominee_contact_directory
WITH (security_invoker = true) AS
SELECT
  n.id AS nominee_id,
  n.name,
  n.slug,
  n.organization,
  n.country,
  n.region,
  n.status,
  n.publication_status,
  s.slug AS subcategory_slug,
  c.slug AS category_slug,
  COALESCE(nc.primary_email, n.email) AS primary_email,
  n.phone,
  COALESCE(nc.communication_status, 'not_yet_contacted'::public.communication_status) AS communication_status,
  nc.contact_type,
  nc.last_outbound_date,
  nc.last_outbound_subject,
  nc.notes
FROM public.nominees n
LEFT JOIN public.subcategories s ON s.id = n.subcategory_id
LEFT JOIN public.categories c ON c.id = s.category_id
LEFT JOIN public.nominee_communications nc ON nc.nominee_id = n.id;

GRANT SELECT ON public.v_nominee_contact_directory TO authenticated, service_role;
