
-- Add enhanced knowledge base fields to FAQs table
ALTER TABLE public.faqs 
ADD COLUMN IF NOT EXISTS tone text DEFAULT 'human',
ADD COLUMN IF NOT EXISTS cta_hint text,
ADD COLUMN IF NOT EXISTS escalation_flag boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS intent_keywords text[] DEFAULT '{}';

-- Add check constraint for tone values
ALTER TABLE public.faqs 
ADD CONSTRAINT faqs_tone_check CHECK (tone IN ('human', 'reassuring', 'executive'));

-- Create index for faster intent matching
CREATE INDEX IF NOT EXISTS idx_faqs_tags ON public.faqs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_faqs_intent_keywords ON public.faqs USING GIN(intent_keywords);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_escalation ON public.faqs(escalation_flag) WHERE escalation_flag = true;

-- Create escalation_logs table for flagged conversations
CREATE TABLE IF NOT EXISTS public.escalation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  trigger_keywords text[] NOT NULL,
  conversation_history jsonb NOT NULL,
  escalation_reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on escalation_logs
ALTER TABLE public.escalation_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage escalation logs
CREATE POLICY "Admins manage escalation logs"
ON public.escalation_logs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert escalation logs
CREATE POLICY "System can insert escalation logs"
ON public.escalation_logs
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_escalation_logs_updated_at
BEFORE UPDATE ON public.escalation_logs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
