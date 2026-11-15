CREATE TYPE public.support_fund_status AS ENUM ('expression_of_interest','pledge_received','payment_instruction_issued','transfer_reported','payment_received','payment_reconciled','receipt_issued','intervention_allocated','utilisation_reported');

CREATE TABLE public.support_fund_pledges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('donation','sponsor','partner')),
  region text, category text, scope text,
  amount numeric CHECK (amount IS NULL OR amount >= 0),
  currency text CHECK (currency IS NULL OR currency IN ('USD','NGN','GBP','EUR')),
  frequency text, contributions text[] NOT NULL DEFAULT '{}', projects text[] NOT NULL DEFAULT '{}',
  donor_name text, donor_type text, email text NOT NULL, phone text, country text, preferred_contact text,
  organisation text, organisation_type text, contact_person text, contact_role text, website text,
  in_kind_description text, recognition_name text, anonymous boolean NOT NULL DEFAULT false,
  message text CHECK (message IS NULL OR length(message) <= 2000),
  acknowledged boolean NOT NULL CHECK (acknowledged = true),
  status public.support_fund_status NOT NULL DEFAULT 'pledge_received',
  site text NOT NULL DEFAULT 'nesa' CHECK (site = 'nesa'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.support_fund_pledges TO anon, authenticated;
GRANT SELECT, UPDATE ON public.support_fund_pledges TO authenticated;
GRANT ALL ON public.support_fund_pledges TO service_role;
ALTER TABLE public.support_fund_pledges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit pledges" ON public.support_fund_pledges FOR INSERT TO anon, authenticated WITH CHECK (status = 'pledge_received' AND site = 'nesa');
CREATE POLICY "Admins read pledges" ON public.support_fund_pledges FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update pledges" ON public.support_fund_pledges FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.support_fund_transfer_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL,
  date_paid date NOT NULL,
  amount_sent numeric NOT NULL CHECK (amount_sent > 0),
  currency text,
  sender_name text NOT NULL CHECK (length(sender_name) <= 200),
  bank_transaction_id text CHECK (bank_transaction_id IS NULL OR length(bank_transaction_id) <= 100),
  status public.support_fund_status NOT NULL DEFAULT 'transfer_reported',
  site text NOT NULL DEFAULT 'nesa' CHECK (site = 'nesa'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.support_fund_transfer_reports TO anon, authenticated;
GRANT SELECT, UPDATE ON public.support_fund_transfer_reports TO authenticated;
GRANT ALL ON public.support_fund_transfer_reports TO service_role;
ALTER TABLE public.support_fund_transfer_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can report transfers" ON public.support_fund_transfer_reports FOR INSERT TO anon, authenticated WITH CHECK (status = 'transfer_reported' AND site = 'nesa');
CREATE POLICY "Admins read transfer reports" ON public.support_fund_transfer_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update transfer reports" ON public.support_fund_transfer_reports FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));