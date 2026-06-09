DROP POLICY IF EXISTS "Nominators self upsert" ON public.nominators;

CREATE POLICY "Nominators self insert" ON public.nominators
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IS NULL
    OR public.has_role(auth.uid(), 'admin')
  );
