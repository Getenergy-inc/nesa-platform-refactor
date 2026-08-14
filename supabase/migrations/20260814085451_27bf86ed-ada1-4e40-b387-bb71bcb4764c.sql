ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS video_storage_path text,
  ADD COLUMN IF NOT EXISTS youtube_publish_error text;

CREATE INDEX IF NOT EXISTS nominees_youtube_publish_state_idx
  ON public.nominees (youtube_publish_state);

CREATE OR REPLACE FUNCTION public.approve_nominee_revision(_revision_id uuid, _notes text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r record;
BEGIN
  IF NOT (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  SELECT * INTO r FROM public.nominee_profile_revisions WHERE id = _revision_id AND status = 'pending';
  IF r IS NULL THEN RAISE EXCEPTION 'Revision not found or already reviewed'; END IF;

  UPDATE public.nominees n SET
    bio          = COALESCE(r.payload->>'bio', n.bio),
    title        = COALESCE(r.payload->>'title', n.title),
    organization = COALESCE(r.payload->>'organization', n.organization),
    photo_url    = COALESCE(r.payload->>'photo_url', n.photo_url),
    website      = COALESCE(r.payload->>'website', n.website),
    linkedin_url = COALESCE(r.payload->>'linkedin_url', n.linkedin_url),
    work_done    = COALESCE(r.payload->>'work_done', n.work_done),
    video_url    = COALESCE(r.payload->>'video_url', n.video_url),
    video_storage_path = COALESCE(r.video_storage_path, n.video_storage_path),
    evidence_urls = CASE WHEN r.payload ? 'evidence_urls'
      THEN ARRAY(SELECT jsonb_array_elements_text(r.payload->'evidence_urls'))
      ELSE n.evidence_urls END,
    youtube_publish_state = CASE
      WHEN r.video_storage_path IS NOT NULL THEN 'queued'
      ELSE n.youtube_publish_state END,
    youtube_publish_error = CASE
      WHEN r.video_storage_path IS NOT NULL THEN NULL
      ELSE n.youtube_publish_error END,
    updated_at = now()
  WHERE n.id = r.nominee_id;

  UPDATE public.nominee_profile_revisions
     SET status='approved', reviewed_by=auth.uid(), reviewed_at=now(),
         review_notes=COALESCE(_notes, review_notes)
   WHERE id = _revision_id;
END; $$;

REVOKE ALL ON FUNCTION public.approve_nominee_revision(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.approve_nominee_revision(uuid, text) TO authenticated;