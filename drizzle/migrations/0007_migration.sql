DROP POLICY IF EXISTS "Ambassadors are viewable by everyone" ON public.ambassadors;
DROP POLICY IF EXISTS "Public read nigeria summary" ON public.nrc_nigeria_summary;
DROP POLICY IF EXISTS "Public read regional summary" ON public.nrc_regional_summary;
DROP POLICY IF EXISTS "Legacy mappings are readable" ON public.legacy_category_mappings;
CREATE POLICY "Signed-in users read legacy mappings" ON public.legacy_category_mappings FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);