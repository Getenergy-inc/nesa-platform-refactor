-- Fix: Restrict rebuild_votes public SELECT to prevent voter PII exposure
-- The rebuild_school_vote_counts view already provides aggregate data for public use

DROP POLICY IF EXISTS "Anyone can view rebuild votes" ON public.rebuild_votes;

-- Only allow authenticated users to see their own votes
CREATE POLICY "Users can view their own rebuild votes"
  ON public.rebuild_votes FOR SELECT
  TO authenticated
  USING (voter_id = auth.uid());

-- Allow admins to view all votes
CREATE POLICY "Admins can view all rebuild votes"
  ON public.rebuild_votes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));