-- Judge Applications table for tracking the onboarding flow
CREATE TABLE public.judge_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT,
  
  -- Professional details
  organization TEXT,
  title TEXT,
  bio TEXT,
  linkedin_url TEXT,
  cv_url TEXT,
  
  -- Qualifications
  years_experience INTEGER,
  expertise_areas TEXT[],
  
  -- Application status flow
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted',      -- Initial submission
    'email_verified', -- Email verified via link
    'under_review',   -- Being reviewed by admin
    'approved',       -- Approved, can create account
    'account_created',-- Account created
    'onboarded',      -- Fully onboarded judge
    'rejected'        -- Application rejected
  )),
  
  -- Verification token
  verification_token TEXT,
  verification_token_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  
  -- Linked user (after account creation)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Review tracking
  reviewed_by UUID,
  review_notes TEXT
);

-- Enable RLS
ALTER TABLE public.judge_applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can submit an application (public)
CREATE POLICY "Anyone can submit judge application"
  ON public.judge_applications
  FOR INSERT
  WITH CHECK (true);

-- Public can check their own application by email (for status page)
CREATE POLICY "Anyone can view own application by email"
  ON public.judge_applications
  FOR SELECT
  USING (true);

-- Admins can manage all applications
CREATE POLICY "Admins can manage judge applications"
  ON public.judge_applications
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their linked application
CREATE POLICY "Users can view own linked application"
  ON public.judge_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_judge_applications_updated_at
  BEFORE UPDATE ON public.judge_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for email lookups and status filtering
CREATE INDEX idx_judge_applications_email ON public.judge_applications(email);
CREATE INDEX idx_judge_applications_status ON public.judge_applications(status);
CREATE INDEX idx_judge_applications_user_id ON public.judge_applications(user_id);