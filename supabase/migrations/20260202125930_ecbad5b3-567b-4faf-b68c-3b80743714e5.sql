-- Create renominations table for detailed renomination/endorsement submissions
CREATE TABLE public.renominations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Nominee identification
  nominee_id UUID REFERENCES public.nominees(id) ON DELETE CASCADE,
  nominee_slug TEXT NOT NULL,
  nominee_name TEXT NOT NULL,
  
  -- Award context
  award_slug TEXT,
  award_title TEXT,
  subcategory_slug TEXT,
  subcategory_title TEXT,
  group_slug TEXT,
  group_name TEXT,
  
  -- Updated information (optional)
  updated_name TEXT,
  updated_achievement TEXT,
  updated_country TEXT,
  updated_state TEXT,
  contact_email TEXT,
  note TEXT,
  
  -- Submission tracking
  submitter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_session_id TEXT,
  
  -- Review status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- Rate limiting index
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_renominations_nominee_slug ON public.renominations(nominee_slug);
CREATE INDEX idx_renominations_status ON public.renominations(status);
CREATE INDEX idx_renominations_submitter_session ON public.renominations(submitter_session_id);
CREATE INDEX idx_renominations_created_at ON public.renominations(created_at DESC);

-- Enable RLS
ALTER TABLE public.renominations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit renominations"
  ON public.renominations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own renominations"
  ON public.renominations
  FOR SELECT
  USING (
    submitter_id = auth.uid() 
    OR submitter_session_id IS NOT NULL
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'nrc'::app_role)
  );

CREATE POLICY "Admins and NRC can manage renominations"
  ON public.renominations
  FOR ALL
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'nrc'::app_role)
  );

-- Add trigger for updated_at
CREATE TRIGGER update_renominations_updated_at
  BEFORE UPDATE ON public.renominations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();