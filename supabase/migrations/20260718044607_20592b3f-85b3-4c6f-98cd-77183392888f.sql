
-- Fix nomination_drafts: remove email-match leak risk, restrict to converted_user_id only
DROP POLICY IF EXISTS "Users read own converted drafts" ON public.nomination_drafts;
CREATE POLICY "Users read own converted drafts"
  ON public.nomination_drafts
  FOR SELECT
  TO authenticated
  USING (converted_user_id = auth.uid());

-- Allow chapter coordinators/leads to read branding for their chapter
CREATE POLICY "Chapter coordinators read their chapter branding"
  ON public.correspondence_branding
  FOR SELECT
  TO authenticated
  USING (
    chapter_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.user_chapters uc
      WHERE uc.user_id = auth.uid()
        AND uc.chapter_id = correspondence_branding.chapter_id
        AND uc.membership_level IN ('lead','coordinator','admin','owner')
    )
  );
