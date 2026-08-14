
ALTER TABLE public.nominees
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS youtube_video_id text,
  ADD COLUMN IF NOT EXISTS youtube_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS youtube_publish_state text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS award_slug text,
  ADD COLUMN IF NOT EXISTS category_slug text,
  ADD COLUMN IF NOT EXISTS classification_slug text,
  ADD COLUMN IF NOT EXISTS claimed_by_user_id uuid,
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz;

CREATE INDEX IF NOT EXISTS nominees_claimed_by_idx ON public.nominees (claimed_by_user_id);
CREATE INDEX IF NOT EXISTS nominees_path_idx ON public.nominees (award_slug, category_slug, classification_slug, slug);

CREATE TABLE IF NOT EXISTS public.nominee_profile_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  video_storage_path text,
  video_title text,
  video_description text,
  review_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT nominee_profile_revisions_status_chk
    CHECK (status IN ('pending','approved','rejected','withdrawn'))
);

GRANT SELECT, INSERT, UPDATE ON public.nominee_profile_revisions TO authenticated;
GRANT ALL ON public.nominee_profile_revisions TO service_role;
ALTER TABLE public.nominee_profile_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read own revisions"
  ON public.nominee_profile_revisions FOR SELECT TO authenticated
  USING (submitted_by = auth.uid()
     OR public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Owners create revisions for claimed profile"
  ON public.nominee_profile_revisions FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND status = 'pending'
    AND EXISTS (SELECT 1 FROM public.nominees n
                WHERE n.id = nominee_id AND n.claimed_by_user_id = auth.uid())
  );

CREATE POLICY "Staff review revisions"
  ON public.nominee_profile_revisions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER nominee_profile_revisions_updated_at
  BEFORE UPDATE ON public.nominee_profile_revisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS nominee_profile_revisions_pending_idx
  ON public.nominee_profile_revisions (status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.nominee_support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text,
  author_organization text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT nominee_support_messages_status_chk CHECK (status IN ('pending','approved','rejected')),
  CONSTRAINT nominee_support_messages_len_chk CHECK (char_length(message) BETWEEN 10 AND 1200)
);

GRANT SELECT, INSERT, UPDATE ON public.nominee_support_messages TO authenticated;
GRANT INSERT ON public.nominee_support_messages TO anon;
GRANT ALL ON public.nominee_support_messages TO service_role;
ALTER TABLE public.nominee_support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a support message"
  ON public.nominee_support_messages FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Staff read all support messages"
  ON public.nominee_support_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Staff moderate support messages"
  ON public.nominee_support_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER nominee_support_messages_updated_at
  BEFORE UPDATE ON public.nominee_support_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE VIEW public.nominee_support_messages_public
WITH (security_invoker = true) AS
  SELECT id, nominee_id, author_name, author_organization, message, created_at
  FROM public.nominee_support_messages
  WHERE status = 'approved';

CREATE POLICY "Approved support messages are public"
  ON public.nominee_support_messages FOR SELECT TO anon, authenticated
  USING (status = 'approved');

GRANT SELECT ON public.nominee_support_messages_public TO anon, authenticated;

CREATE OR REPLACE VIEW public.public_nominees
WITH (security_invoker = true) AS
 SELECT id, subcategory_id, season_id, name, slug, title, organization, bio,
    photo_url, logo_url, status, is_platinum, jury_score, final_score,
    renomination_count, region, country, acceptance_status, nrc_verified,
    created_at, updated_at, publication_status, profile_status,
    profile_completion_score, award_family, recognition_class, region_slug,
    zone_slug, state_slug, category_fit_summary, impact_area,
    social_profile_links, public_documents, media_gallery, published_at,
    data_source, consent_confirmed,
    evidence_urls, work_done, website, linkedin_url,
    video_url, youtube_video_id, award_slug, category_slug, classification_slug
   FROM public.nominees
  WHERE status = 'approved'::nomination_status
    AND COALESCE(publication_status, 'published'::nominee_publication_status)
        <> 'unpublished'::nominee_publication_status;

GRANT SELECT ON public.public_nominees TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_nominee_profile(_slug text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _email text; _id uuid;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = _uid;
  SELECT id INTO _id FROM public.nominees
   WHERE slug = _slug AND lower(coalesce(email,'')) = coalesce(_email,'~')
   LIMIT 1;
  IF _id IS NULL THEN RAISE EXCEPTION 'No nominee profile matches your account email'; END IF;
  UPDATE public.nominees
     SET claimed_by_user_id = _uid, claimed_at = now()
   WHERE id = _id AND (claimed_by_user_id IS NULL OR claimed_by_user_id = _uid);
  RETURN _id;
END; $$;

REVOKE ALL ON FUNCTION public.claim_nominee_profile(text) FROM public;
GRANT EXECUTE ON FUNCTION public.claim_nominee_profile(text) TO authenticated;

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
    evidence_urls = CASE WHEN r.payload ? 'evidence_urls'
      THEN ARRAY(SELECT jsonb_array_elements_text(r.payload->'evidence_urls'))
      ELSE n.evidence_urls END,
    youtube_publish_state = CASE
      WHEN COALESCE(r.video_storage_path, r.payload->>'video_url') IS NOT NULL THEN 'queued'
      ELSE n.youtube_publish_state END,
    updated_at = now()
  WHERE n.id = r.nominee_id;

  UPDATE public.nominee_profile_revisions
     SET status='approved', reviewed_by=auth.uid(), reviewed_at=now(),
         review_notes=COALESCE(_notes, review_notes)
   WHERE id = _revision_id;
END; $$;

REVOKE ALL ON FUNCTION public.approve_nominee_revision(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.approve_nominee_revision(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.reject_nominee_revision(_revision_id uuid, _notes text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  UPDATE public.nominee_profile_revisions
     SET status='rejected', reviewed_by=auth.uid(), reviewed_at=now(), review_notes=_notes
   WHERE id=_revision_id AND status='pending';
END; $$;

REVOKE ALL ON FUNCTION public.reject_nominee_revision(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.reject_nominee_revision(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.nominee_revision_to_nrc_queue()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE n record;
BEGIN
  SELECT name, award_family, recognition_class, region INTO n
    FROM public.nominees WHERE id = NEW.nominee_id;

  IF EXISTS (SELECT 1 FROM public.nrc_research_queue
              WHERE nominee_id = NEW.nominee_id AND status <> 'public_display_ready') THEN
    UPDATE public.nrc_research_queue
       SET status = 'pending',
           evidence_need = 'Nominee-submitted profile revision awaiting NRC approval',
           researcher_note = 'Revision ' || NEW.id::text,
           updated_at = now()
     WHERE nominee_id = NEW.nominee_id;
  ELSE
    INSERT INTO public.nrc_research_queue
      (nominee_id, nominee_name, category, subcategory, region,
       evidence_need, researcher_note, priority, status)
    VALUES (NEW.nominee_id, COALESCE(n.name,'Unknown'), n.award_family, n.recognition_class,
            n.region, 'Nominee-submitted profile revision awaiting NRC approval',
            'Revision ' || NEW.id::text, 'medium', 'pending');
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS nominee_revision_queue_trg ON public.nominee_profile_revisions;
CREATE TRIGGER nominee_revision_queue_trg
  AFTER INSERT ON public.nominee_profile_revisions
  FOR EACH ROW EXECUTE FUNCTION public.nominee_revision_to_nrc_queue();

CREATE POLICY "Nominees upload own media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'nominee-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Nominees update own media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'nominee-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Nominees upload own videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'nominee-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Nominees read own videos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'nominee-videos'
     AND ((storage.foldername(name))[1] = auth.uid()::text
       OR public.has_role(auth.uid(),'nrc') OR public.has_role(auth.uid(),'admin')));
