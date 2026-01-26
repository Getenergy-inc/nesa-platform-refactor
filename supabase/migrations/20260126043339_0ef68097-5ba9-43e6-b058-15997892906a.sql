-- Create platform_config table for dynamic configuration (FX rate, etc.)
CREATE TABLE public.platform_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Platform config readable by authenticated"
  ON public.platform_config FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage platform config"
  ON public.platform_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Insert default FX rate
INSERT INTO public.platform_config (key, value, description)
VALUES ('agc_exchange_rate', '{"usd_to_agc": 10}', 'Exchange rate: 1 USD = X AGC');