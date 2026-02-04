-- Create table for judge chat room messages
CREATE TABLE public.judge_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_edited BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES public.judge_chat_messages(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX idx_judge_chat_messages_created_at ON public.judge_chat_messages(created_at DESC);
CREATE INDEX idx_judge_chat_messages_user_id ON public.judge_chat_messages(user_id);

-- Enable RLS
ALTER TABLE public.judge_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only jury members and admins can access
CREATE POLICY "Judges and admins can view chat messages"
  ON public.judge_chat_messages
  FOR SELECT
  USING (has_role(auth.uid(), 'jury') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Judges can send chat messages"
  ON public.judge_chat_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND (has_role(auth.uid(), 'jury') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Judges can edit own messages"
  ON public.judge_chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id AND (has_role(auth.uid(), 'jury') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Judges can delete own messages"
  ON public.judge_chat_messages
  FOR DELETE
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Enable realtime for the chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.judge_chat_messages;

-- Create updated_at trigger
CREATE TRIGGER update_judge_chat_messages_updated_at
  BEFORE UPDATE ON public.judge_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();