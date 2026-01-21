-- Add function to increment public votes
CREATE OR REPLACE FUNCTION public.increment_public_votes(nominee_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.nominees
  SET public_votes = public_votes + 1
  WHERE id = nominee_id;
END;
$$;