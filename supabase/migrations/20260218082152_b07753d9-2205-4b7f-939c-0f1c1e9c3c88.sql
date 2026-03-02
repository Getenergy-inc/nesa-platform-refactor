-- Fix: Restrict NRC access to nominees so they only see nominees assigned to them
-- Drop existing overly-permissive policies
DROP POLICY IF EXISTS "NRC can manage nominees" ON public.nominees;
DROP POLICY IF EXISTS "NRC can view all nominees" ON public.nominees;

-- Admins have full access
CREATE POLICY "Admins manage all nominees"
ON public.nominees
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- NRC members can SELECT nominees assigned to them via nrc_queue
CREATE POLICY "NRC view assigned nominees"
ON public.nominees
FOR SELECT
USING (
  has_role(auth.uid(), 'nrc'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.nrc_queue nq
    JOIN public.nominations n ON n.id = nq.nomination_id
    WHERE n.created_nominee_id = nominees.id
    AND nq.assigned_to = auth.uid()
  )
);

-- NRC members can UPDATE nominees assigned to them
CREATE POLICY "NRC update assigned nominees"
ON public.nominees
FOR UPDATE
USING (
  has_role(auth.uid(), 'nrc'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.nrc_queue nq
    JOIN public.nominations n ON n.id = nq.nomination_id
    WHERE n.created_nominee_id = nominees.id
    AND nq.assigned_to = auth.uid()
  )
);

-- Nominators can view nominees they nominated
CREATE POLICY "Nominators view own nominees"
ON public.nominees
FOR SELECT
USING (nominator_user_id = auth.uid());

-- Authenticated users can view approved/platinum nominees (for voting pages etc.)
CREATE POLICY "Public view approved nominees"
ON public.nominees
FOR SELECT
USING (status IN ('approved', 'platinum'));