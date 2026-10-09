DROP POLICY IF EXISTS "Nominators self insert" ON public.nominators;
CREATE POLICY "Nominators self insert"
ON public.nominators
FOR INSERT
TO authenticated
WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));