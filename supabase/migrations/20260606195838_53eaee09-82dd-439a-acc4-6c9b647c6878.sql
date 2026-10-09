-- Transactional, idempotent batch ingest RPC for nomination_intake.
-- Upserts on record_id (preserves duplicate_of/duplicate_status/ingested_at/ingested_by),
-- then deterministically marks the earliest (ingested_at, id) row per identity_hash
-- as canonical ("Unique") and all later siblings as "Potential Duplicate".

CREATE OR REPLACE FUNCTION public.ingest_nomination_intake_batch(p_rows jsonb)
RETURNS TABLE(record_id text, id uuid, duplicate_of uuid, duplicate_status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record_ids text[];
  v_hashes text[];
BEGIN
  IF p_rows IS NULL OR jsonb_typeof(p_rows) <> 'array' OR jsonb_array_length(p_rows) = 0 THEN
    RETURN;
  END IF;

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
  -- Deduplicate within the incoming batch by record_id (last write wins) to
  -- avoid "cannot affect row a second time" on a single ON CONFLICT.
  deduped AS (
    SELECT DISTINCT ON (record_id) *
    FROM input
    ORDER BY record_id
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
      -- intentionally NOT overwritten on retry: duplicate_of, duplicate_status,
      -- ingested_by, ingested_at — preserves canonical history under retries.
    RETURNING t.record_id, t.id, t.identity_hash
  )
  SELECT
    array_agg(record_id),
    array_remove(array_agg(DISTINCT identity_hash), NULL)
  INTO v_record_ids, v_hashes
  FROM upserted;

  IF v_hashes IS NOT NULL AND array_length(v_hashes, 1) > 0 THEN
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
    )
    UPDATE public.nomination_intake t
    SET
      duplicate_of = CASE WHEN r.canonical_id = t.id THEN NULL ELSE r.canonical_id END,
      duplicate_status = CASE WHEN r.canonical_id = t.id THEN 'Unique' ELSE 'Potential Duplicate' END,
      updated_at = now()
    FROM ranked r
    WHERE t.id = r.id
      AND (
        t.duplicate_of IS DISTINCT FROM (CASE WHEN r.canonical_id = t.id THEN NULL ELSE r.canonical_id END)
        OR t.duplicate_status IS DISTINCT FROM (CASE WHEN r.canonical_id = t.id THEN 'Unique' ELSE 'Potential Duplicate' END)
      );
  END IF;

  RETURN QUERY
  SELECT t.record_id, t.id, t.duplicate_of, t.duplicate_status
  FROM public.nomination_intake t
  WHERE t.record_id = ANY(v_record_ids);
END;
$$;

REVOKE ALL ON FUNCTION public.ingest_nomination_intake_batch(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ingest_nomination_intake_batch(jsonb) TO service_role;