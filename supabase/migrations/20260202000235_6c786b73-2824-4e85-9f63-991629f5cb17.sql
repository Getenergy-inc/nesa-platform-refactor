-- =====================================================
-- NRC MEMBER MANAGEMENT SYSTEM
-- Max 30 members with individual workspaces
-- =====================================================

-- NRC Members table with 30-member cap enforcement
CREATE TABLE public.nrc_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'removed')),
  specialization TEXT[] DEFAULT '{}', -- Category expertise
  assigned_region TEXT, -- Regional focus
  max_queue_size INTEGER DEFAULT 10,
  review_count INTEGER DEFAULT 0,
  approval_rate NUMERIC(5,2) DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- NRC Queue assignments - individual workspaces
CREATE TABLE public.nrc_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id UUID NOT NULL REFERENCES public.nominations(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  priority INTEGER DEFAULT 0, -- Higher = more urgent
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_review', 'completed', 'reassigned')),
  due_date TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(nomination_id) -- One reviewer per nomination at a time
);

-- NRC Invitations for member onboarding
CREATE TABLE public.nrc_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to check NRC member count (30 max)
CREATE OR REPLACE FUNCTION public.check_nrc_member_limit()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count 
  FROM public.nrc_members 
  WHERE status IN ('pending', 'active');
  
  IF member_count >= 30 THEN
    RAISE EXCEPTION 'NRC member limit (30) reached. Remove inactive members first.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to enforce 30-member cap
CREATE TRIGGER enforce_nrc_member_limit
  BEFORE INSERT ON public.nrc_members
  FOR EACH ROW
  EXECUTE FUNCTION public.check_nrc_member_limit();

-- Function to auto-assign nominations to NRC members
CREATE OR REPLACE FUNCTION public.auto_assign_nrc_nomination(p_nomination_id UUID)
RETURNS UUID AS $$
DECLARE
  v_assigned_to UUID;
  v_subcategory_id UUID;
BEGIN
  -- Get the nomination's subcategory
  SELECT subcategory_id INTO v_subcategory_id
  FROM public.nominations WHERE id = p_nomination_id;
  
  -- Find the best available NRC member
  -- Priority: 1) Specialization match, 2) Lowest queue size, 3) Highest approval rate
  SELECT m.user_id INTO v_assigned_to
  FROM public.nrc_members m
  LEFT JOIN (
    SELECT assigned_to, COUNT(*) as queue_count
    FROM public.nrc_queue
    WHERE status IN ('assigned', 'in_review')
    GROUP BY assigned_to
  ) q ON m.user_id = q.assigned_to
  WHERE m.status = 'active'
    AND COALESCE(q.queue_count, 0) < m.max_queue_size
  ORDER BY 
    COALESCE(q.queue_count, 0) ASC,
    m.approval_rate DESC
  LIMIT 1;
  
  IF v_assigned_to IS NOT NULL THEN
    INSERT INTO public.nrc_queue (nomination_id, assigned_to, due_date)
    VALUES (p_nomination_id, v_assigned_to, now() + interval '7 days')
    ON CONFLICT (nomination_id) DO NOTHING;
  END IF;
  
  RETURN v_assigned_to;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update NRC member stats
CREATE OR REPLACE FUNCTION public.update_nrc_member_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.nrc_members
    SET 
      review_count = review_count + 1,
      last_active_at = now(),
      updated_at = now()
    WHERE user_id = NEW.assigned_to;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_nrc_stats_on_completion
  AFTER UPDATE ON public.nrc_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_nrc_member_stats();

-- Enable RLS
ALTER TABLE public.nrc_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nrc_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nrc_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nrc_members
CREATE POLICY "NRC members viewable by NRC/Admin"
  ON public.nrc_members FOR SELECT
  USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage NRC members"
  ON public.nrc_members FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can update own profile"
  ON public.nrc_members FOR UPDATE
  USING (auth.uid() = user_id AND has_role(auth.uid(), 'nrc'));

-- RLS Policies for nrc_queue
CREATE POLICY "NRC sees own queue"
  ON public.nrc_queue FOR SELECT
  USING (assigned_to = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage all queues"
  ON public.nrc_queue FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can update own assignments"
  ON public.nrc_queue FOR UPDATE
  USING (assigned_to = auth.uid() AND has_role(auth.uid(), 'nrc'));

CREATE POLICY "System can insert queue items"
  ON public.nrc_queue FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

-- RLS Policies for nrc_invitations
CREATE POLICY "Admins manage invitations"
  ON public.nrc_invitations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Invited users can view their invitation"
  ON public.nrc_invitations FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Add indexes for performance
CREATE INDEX idx_nrc_members_status ON public.nrc_members(status);
CREATE INDEX idx_nrc_queue_assigned_to ON public.nrc_queue(assigned_to);
CREATE INDEX idx_nrc_queue_status ON public.nrc_queue(status);
CREATE INDEX idx_nrc_queue_nomination ON public.nrc_queue(nomination_id);
CREATE INDEX idx_nrc_invitations_token ON public.nrc_invitations(token);
CREATE INDEX idx_nrc_invitations_email ON public.nrc_invitations(email);

-- Update updated_at triggers
CREATE TRIGGER handle_nrc_members_updated_at
  BEFORE UPDATE ON public.nrc_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_nrc_queue_updated_at
  BEFORE UPDATE ON public.nrc_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();