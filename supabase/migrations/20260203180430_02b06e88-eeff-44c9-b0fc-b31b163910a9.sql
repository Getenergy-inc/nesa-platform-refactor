-- Create nominee_enrichments table for storing enriched profile data
CREATE TABLE public.nominee_enrichments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nominee_slug TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('person', 'organization')),
  kind_override BOOLEAN DEFAULT false,
  as_of_date DATE NOT NULL DEFAULT '2025-12-31',
  summary_2025 TEXT,
  education_for_all_contributions TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  image_url TEXT,
  image_type TEXT CHECK (image_type IN ('photo', 'logo')),
  image_source_url TEXT,
  image_license TEXT,
  image_approved BOOLEAN DEFAULT false,
  image_candidates JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nominee_enrichments ENABLE ROW LEVEL SECURITY;

-- Public can read approved enrichments only
CREATE POLICY "Anyone can view approved enrichments"
ON public.nominee_enrichments
FOR SELECT
USING (status = 'approved');

-- Admins can do everything
CREATE POLICY "Admins can manage all enrichments"
ON public.nominee_enrichments
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index for performance
CREATE INDEX idx_nominee_enrichments_slug ON public.nominee_enrichments(nominee_slug);
CREATE INDEX idx_nominee_enrichments_status ON public.nominee_enrichments(status);

-- Add updated_at trigger
CREATE TRIGGER update_nominee_enrichments_updated_at
BEFORE UPDATE ON public.nominee_enrichments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.nominee_enrichments IS 'Enriched nominee profiles with AI-generated summaries, sources, and images';