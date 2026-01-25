-- Create donations table for tracking donor information and impact
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  donor_country TEXT,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  program TEXT NOT NULL DEFAULT 'general' CHECK (program IN ('general', 'eduaid', 'rebuild')),
  impact_description TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  payment_provider TEXT,
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create donations"
ON public.donations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all donations"
ON public.donations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update donations"
ON public.donations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();