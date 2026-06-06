-- 1) Audit table for per-row ingest decisions
CREATE TABLE public.nomination_ingest_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL,
  intake_id UUID NOT NULL REFERENCES public.nomination_intake(id) ON DELETE CASCADE,
  record_id TEXT NOT NULL,
  identity_hash TEXT,
  action TEXT NOT NULL CHECK (action IN (
    'inserted', 'updated', 'unchanged',
    'canonical_promoted', 'canonical_confirmed',
    'duplicate_marked', 'duplicate_confirmed', 'duplicate_cleared'
  )),
  reason TEXT NOT NULL,
  canonical_id UUID,
  previous_duplicate_status TEXT,
  new_duplicate_status TEXT,
  actor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nomination_ingest_audit_batch ON public.nomination_ingest_audit(batch_id);
CREATE INDEX idx_nomination_ingest_audit_intake ON public.nomination_ingest_audit(intake_id);
CREATE INDEX idx_nomination_ingest_audit_record ON public.nomination_ingest_audit(record_id);
CREATE INDEX idx_nomination_ingest_audit_hash ON public.nomination_ingest_audit(identity_hash);

GRANT ALL ON public.nomination_ingest_audit TO service_role;

ALTER TABLE public.nomination_ingest_audit ENABLE ROW LEVEL SECURITY;

-- No client access; service role bypasses RLS. Keep an explicit deny-by-default
-- by simply not creating any FOR ALL / FOR SELECT policies for authenticated/anon.

-- Immutability: block UPDATE and DELETE via trigger (reuse existing helper).
CREATE TRIGGER trg_nomination_ingest_audit_immutable_upd
  BEFORE UPDATE ON public.nomination_ingest_audit
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER trg_nomination_ingest_audit_immutable_del
  BEFORE DELETE ON public.nomination_ingest_audit
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- 2) Replace the batch ingest function with audit-aware version
CREATE OR REPLACE FUNCTION public.ingest_nomination_intake_batch(
  p_rows jsonb,
  p_batch_id uuid DEFAULT NULL,
  p_actor_id uuid DEFAULT NULL
)
RETURNS TABLE(
  record_id text,
  id uuid,
  duplicate_of uuid,
  duplicate_status text,
  batch_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_batch_id uuid := COALESCE(p_batch_id, gen_random_uuid());
  v_record_ids text[];
  v_hashes text[];
BEGIN
  IF p_rows IS NULL OR jsonb_typeof(p_rows) <> 'array' OR jsonb_array_length(p_rows) = 0 THEN
    RETURN;
  END IF;

  -- Snapshot existing rows BEFORE upsert so we can classify inserted vs updated.
  CREATE TEMP TABLE _ingest_pre ON COMMIT DROP AS
  SELECT
    ni.record_id,
    ni.id,
    ni.identity_hash,
    ni.duplicate_of,
    ni.duplicate_status,
    ni.nominee_name_clean,
    ni.nominee_country_clean,
    ni.nomination_status,
    ni.evidence_status
  FROM public.nomination_intake ni
  WHERE ni.record_id IN (
    SELECT x.record_id
    FROM jsonb_to_recordset(p_rows) AS x(record_id text)
    WHERE x.record_id IS NOT NULL AND length(x.record_id) > 0
  );

  -- Upsert (idempotent; preserves duplicate_of / duplicate_status / ingested_at).
  WITH input AS (
    SELECT * FROM jsonb_to_recordset(p_rows) AS x(
      record_id text, form_type text, award_group text, award_category text,
      award_subcategory text, nominee_name_clean text, nominee_type_clean text,
      nominee_country_clean text, nominee_region_clean text, nominee_city_clean text,
      impact_summary_clean text, evidence_status text, verification_status text,
      nomination_status text, assigned_reviewer text, reviewer_notes text,
      website_sync_status text, identity_hash text, ingested_by uuid
    )
    WHERE record_id IS NOT NULL AND length(record_id) > 0
  ),
  deduped AS (
    SELECT DISTINCT ON (record_id) * FROM input ORDER BY record_id
  ),
  upserted AS (
    INSERT INTO public.nomination_intake AS t (
      record_id, form_type, award_group, award_category, award_subcategory,
      nominee_name_clean, nominee_type_clean, nominee_country_clean, nominee_region_clean,
      nominee_city_clean, impact_summary_clean, evidence_status, verification_status,
      nomination_status, assigned_reviewer, reviewer_notes, website_sync_status,
      identity_hash, ingested_by
    )
    SELECT record_id, form_type, award_group, award_category, award_subcategory,
      nominee_name_clean, nominee_type_clean, nominee_country_clean, nominee_region_clean,
      nominee_city_clean, impact_summary_clean, evidence_status, verification_status,
      nomination_status, assigned_reviewer, reviewer_notes, website_sync_status,
      identity_hash, ingested_by
    FROM deduped
    ON CONFLICT (record_id) DO UPDATE SET
      form_type            = EXCLUDED.form_type,
      award_group          = EXCLUDED.award_group,
      award_category       = EXCLUDED.award_category,
      award_subcategory    = EXCLUDED.award_subcategory,
      nominee_name_clean   = EXCLUDED.nominee_name_clean,
      nominee_type_clean   = EXCLUDED.nominee_type_clean,
      nominee_country_clean= EXCLUDED.nominee_country_clean,
      nominee_region_clean = EXCLUDED.nominee_region_clean,
      nominee_city_clean   = EXCLUDED.nominee_city_clean,
      impact_summary_clean = EXCLUDED.impact_summary_clean,
      evidence_status      = EXCLUDED.evidence_status,
      verification_status  = EXCLUDED.verification_status,
      nomination_status    = EXCLUDED.nomination_status,
      assigned_reviewer    = EXCLUDED.assigned_reviewer,
      reviewer_notes       = EXCLUDED.reviewer_notes,
      website_sync_status  = EXCLUDED.website_sync_status,
      identity_hash        = EXCLUDED.identity_hash,
      updated_at           = now()
    RETURNING t.record_id, t.id, t.identity_hash
  )
  SELECT
    array_agg(record_id),
    array_remove(array_agg(DISTINCT identity_hash), NULL)
  INTO v_record_ids, v_hashes
  FROM upserted;

  -- Audit: classify inserted vs updated vs unchanged using pre-snapshot.
  INSERT INTO public.nomination_ingest_audit (
    batch_id, intake_id, record_id, identity_hash,
    action, reason, previous_duplicate_status, new_duplicate_status, actor_id
  )
  SELECT
    v_batch_id,
    post.id,
    post.record_id,
    post.identity_hash,
    CASE
      WHEN pre.id IS NULL THEN 'inserted'
      WHEN pre.nominee_name_clean    IS DISTINCT FROM post.nominee_name_clean
        OR pre.nominee_country_clean IS DISTINCT FROM post.nominee_country_clean
        OR pre.nomination_status     IS DISTINCT FROM post.nomination_status
        OR pre.evidence_status       IS DISTINCT FROM post.evidence_status
        OR pre.identity_hash         IS DISTINCT FROM post.identity_hash
        THEN 'updated'
      ELSE 'unchanged'
    END,
    CASE
      WHEN pre.id IS NULL THEN 'new intake row created from cleaned payload'
      WHEN pre.identity_hash IS DISTINCT FROM post.identity_hash
        THEN 'cleaned payload changed identity hash inputs'
      WHEN pre.nominee_name_clean IS DISTINCT FROM post.nominee_name_clean
        OR pre.nominee_country_clean IS DISTINCT FROM post.nominee_country_clean
        THEN 'cleaned payload changed nominee identity fields'
      WHEN pre.nomination_status IS DISTINCT FROM post.nomination_status
        OR pre.evidence_status   IS DISTINCT FROM post.evidence_status
        THEN 'status recomputed from new payload'
      ELSE 'payload re-submitted with no detectable change'
    END,
    pre.duplicate_status,
    pre.duplicate_status, -- duplicate fields not yet recomputed in this step
    p_actor_id
  FROM public.nomination_intake post
  LEFT JOIN _ingest_pre pre ON pre.record_id = post.record_id
  WHERE post.record_id = ANY(v_record_ids);

  -- Duplicate resolution + per-row audit
  IF v_hashes IS NOT NULL AND array_length(v_hashes, 1) > 0 THEN
    -- Snapshot duplicate state across all rows sharing affected hashes
    CREATE TEMP TABLE _dupe_pre ON COMMIT DROP AS
    SELECT id, duplicate_of, duplicate_status
    FROM public.nomination_intake
    WHERE identity_hash = ANY(v_hashes);

    WITH ranked AS (
      SELECT
        ni.id,
        ni.identity_hash,
        FIRST_VALUE(ni.id) OVER (
          PARTITION BY ni.identity_hash
          ORDER BY ni.ingested_at ASC, ni.id ASC
        ) AS canonical_id
      FROM public.nomination_intake ni
      WHERE ni.identity_hash = ANY(v_hashes)
    ),
    updated AS (
      UPDATE public.nomination_intake t
      SET
        duplicate_of = CASE WHEN r.canonical_id = t.id THEN NULL ELSE r.canonical_id END,
        duplicate_status = CASE WHEN r.canonical_id = t.id THEN 'Unique' ELSE 'Potential Duplicate' END,
        updated_at = now()
      FROM ranked r
      WHERE t.id = r.id
      RETURNING t.id, t.record_id, t.identity_hash, t.duplicate_of, t.duplicate_status, r.canonical_id
    )
    INSERT INTO public.nomination_ingest_audit (
      batch_id, intake_id, record_id, identity_hash,
      action, reason, canonical_id,
      previous_duplicate_status, new_duplicate_status, actor_id
    )
    SELECT
      v_batch_id,
      u.id,
      u.record_id,
      u.identity_hash,
      CASE
        WHEN u.id = u.canonical_id AND COALESCE(p.duplicate_status, '') <> 'Unique'
          THEN 'canonical_promoted'
        WHEN u.id = u.canonical_id
          THEN 'canonical_confirmed'
        WHEN u.id <> u.canonical_id AND COALESCE(p.duplicate_status, '') <> 'Potential Duplicate'
          THEN 'duplicate_marked'
        WHEN u.id <> u.canonical_id
          THEN 'duplicate_confirmed'
        ELSE 'unchanged'
      END,
      CASE
        WHEN u.id = u.canonical_id
          THEN 'earliest (ingested_at, id) for identity_hash → canonical'
        ELSE 'later sibling of identity_hash group → resolves to canonical ' || u.canonical_id::text
      END,
      u.canonical_id,
      p.duplicate_status,
      u.duplicate_status,
      p_actor_id
    FROM updated u
    LEFT JOIN _dupe_pre p ON p.id = u.id
    WHERE u.record_id = ANY(v_record_ids); -- audit only rows we just ingested
  END IF;

  RETURN QUERY
  SELECT t.record_id, t.id, t.duplicate_of, t.duplicate_status, v_batch_id
  FROM public.nomination_intake t
  WHERE t.record_id = ANY(v_record_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.ingest_nomination_intake_batch(jsonb, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ingest_nomination_intake_batch(jsonb, uuid, uuid) TO service_role;

-- Drop the old 1-arg signature so callers must use the audited version.
DROP FUNCTION IF EXISTS public.ingest_nomination_intake_batch(jsonb);