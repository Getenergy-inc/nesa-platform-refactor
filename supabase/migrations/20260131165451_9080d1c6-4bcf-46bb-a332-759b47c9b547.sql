-- ============================================================================
-- SPONSOR CAMPAIGNS & AGC CLAIMS TABLES
-- ============================================================================

-- 1) Sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'PARTNER',
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  cta_links_json JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Sponsor campaigns
CREATE TABLE public.sponsor_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  landing_slug TEXT UNIQUE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  pool_total_agc NUMERIC NOT NULL DEFAULT 0,
  pool_remaining_agc NUMERIC NOT NULL DEFAULT 0,
  credit_per_claim_agc NUMERIC NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Sponsor links (for tracking)
CREATE TABLE public.sponsor_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.sponsor_campaigns(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Sponsor clicks (analytics)
CREATE TABLE public.sponsor_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.sponsor_campaigns(id) ON DELETE SET NULL,
  link_id UUID REFERENCES public.sponsor_links(id) ON DELETE SET NULL,
  user_id UUID,
  anon_id TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5) Sponsor claims (one per user per campaign)
CREATE TABLE public.sponsor_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.sponsor_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_agc NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- 6) Partnership leads
CREATE TABLE public.partnership_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type TEXT NOT NULL DEFAULT 'partnership',
  name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  interest_area TEXT,
  tier TEXT,
  amount NUMERIC,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_leads ENABLE ROW LEVEL SECURITY;

-- Sponsors: public read, admin manage
CREATE POLICY "Sponsors are publicly viewable" ON public.sponsors
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Admins can manage sponsors" ON public.sponsors
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Campaigns: public read active, admin manage
CREATE POLICY "Active campaigns are publicly viewable" ON public.sponsor_campaigns
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Admins can manage sponsor campaigns" ON public.sponsor_campaigns
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Links: admin only
CREATE POLICY "Admins can manage sponsor links" ON public.sponsor_links
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Clicks: insert allowed, admin read
CREATE POLICY "Anyone can log clicks" ON public.sponsor_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view clicks" ON public.sponsor_clicks
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Claims: users can view own, admin all
CREATE POLICY "Users can view own claims" ON public.sponsor_claims
  FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert claims" ON public.sponsor_claims
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage claims" ON public.sponsor_claims
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Partnership leads: anyone can insert, admin manage
CREATE POLICY "Anyone can submit partnership lead" ON public.partnership_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage partnership leads" ON public.partnership_leads
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_sponsors_slug ON public.sponsors(slug);
CREATE INDEX idx_sponsor_campaigns_sponsor ON public.sponsor_campaigns(sponsor_id);
CREATE INDEX idx_sponsor_campaigns_status ON public.sponsor_campaigns(status);
CREATE INDEX idx_sponsor_claims_campaign ON public.sponsor_claims(campaign_id);
CREATE INDEX idx_sponsor_claims_user ON public.sponsor_claims(user_id);
CREATE INDEX idx_partnership_leads_status ON public.partnership_leads(status);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_sponsor_campaigns_updated_at
  BEFORE UPDATE ON public.sponsor_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_partnership_leads_updated_at
  BEFORE UPDATE ON public.partnership_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();