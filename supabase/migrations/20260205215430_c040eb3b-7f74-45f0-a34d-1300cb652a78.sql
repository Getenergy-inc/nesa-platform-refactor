-- ============================================================
-- VOTING GOVERNANCE SCHEMA - NESA-AFRICA 2025
-- Part 2: Computation functions for results
-- ============================================================

-- 1. Function to compute Gold results (100% public)
CREATE OR REPLACE FUNCTION public.compute_gold_results(p_season_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_computation_id TEXT;
  v_count INTEGER := 0;
BEGIN
  v_computation_id := 'GOLD_' || p_season_id::text || '_' || extract(epoch from now())::text;
  
  -- Delete pending results for recomputation
  DELETE FROM public.results 
  WHERE season_id = p_season_id 
    AND result_status = 'PENDING'
    AND contest_id IN (SELECT id FROM public.contests WHERE contest_type = 'GOLD_PUBLIC');
  
  -- Insert/update computed results per subcategory
  WITH ranked_nominees AS (
    SELECT 
      n.season_id,
      c.id as contest_id,
      n.subcategory_id,
      sub.category_id,
      n.id as nominee_id,
      n.public_votes,
      CASE 
        WHEN MAX(n.public_votes) OVER (PARTITION BY n.subcategory_id) > 0 
        THEN ROUND((n.public_votes::numeric / MAX(n.public_votes) OVER (PARTITION BY n.subcategory_id)) * 100, 2)
        ELSE 0 
      END as public_score,
      RANK() OVER (PARTITION BY n.subcategory_id ORDER BY n.public_votes DESC) as result_rank
    FROM public.nominees n
    JOIN public.subcategories sub ON n.subcategory_id = sub.id
    LEFT JOIN public.contests c ON c.season_id = n.season_id 
      AND c.contest_type = 'GOLD_PUBLIC' 
      AND c.subcategory_id = n.subcategory_id
    WHERE n.season_id = p_season_id
      AND n.status = 'approved'
      AND n.public_votes > 0
  )
  INSERT INTO public.results (
    season_id, contest_id, subcategory_id, category_id, nominee_id,
    public_votes, public_score, final_score, rank, is_winner,
    computation_id, computation_inputs, result_status, computed_at
  )
  SELECT 
    season_id, contest_id, subcategory_id, category_id, nominee_id,
    public_votes, public_score, public_score as final_score,
    result_rank, result_rank = 1,
    v_computation_id,
    jsonb_build_object('computation_time', now()),
    'COMPUTED', now()
  FROM ranked_nominees
  ON CONFLICT (season_id, nominee_id) 
  DO UPDATE SET
    public_votes = EXCLUDED.public_votes,
    public_score = EXCLUDED.public_score,
    final_score = EXCLUDED.final_score,
    rank = EXCLUDED.rank,
    is_winner = EXCLUDED.is_winner,
    computation_id = EXCLUDED.computation_id,
    result_status = 'COMPUTED',
    computed_at = now(),
    updated_at = now();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- Log computation event
  INSERT INTO public.audit_events (action, entity_type, actor_role, metadata)
  VALUES (
    'results_computed', 'results', 'system',
    jsonb_build_object(
      'season_id', p_season_id,
      'contest_type', 'GOLD_PUBLIC',
      'computation_id', v_computation_id,
      'results_count', v_count
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'computation_id', v_computation_id,
    'results_count', v_count
  );
END;
$$;

-- 2. Function to compute Blue Garnet results (40% public + 60% jury)
CREATE OR REPLACE FUNCTION public.compute_blue_garnet_results(p_season_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_computation_id TEXT;
  v_count INTEGER := 0;
BEGIN
  v_computation_id := 'BLUE_' || p_season_id::text || '_' || extract(epoch from now())::text;
  
  -- Delete pending results for recomputation
  DELETE FROM public.results 
  WHERE season_id = p_season_id 
    AND result_status = 'PENDING'
    AND contest_id IN (SELECT id FROM public.contests WHERE contest_type IN ('BLUE_PUBLIC', 'BLUE_JUDGES'));
  
  -- Compute with weighted scoring
  WITH nominee_scores AS (
    SELECT 
      n.season_id,
      c.id as contest_id,
      sub.category_id,
      n.id as nominee_id,
      n.public_votes,
      -- Public score normalized within category
      CASE 
        WHEN MAX(n.public_votes) OVER (PARTITION BY sub.category_id) > 0 
        THEN ROUND((n.public_votes::numeric / MAX(n.public_votes) OVER (PARTITION BY sub.category_id)) * 100, 2)
        ELSE 0 
      END as public_score,
      -- Jury score from assignments
      COALESCE((
        SELECT ROUND(AVG(ja.score)::numeric, 2)
        FROM public.jury_assignments ja
        WHERE ja.nominee_id = n.id 
          AND ja.status = 'completed'
          AND ja.score IS NOT NULL
      ), 0) as jury_score
    FROM public.nominees n
    JOIN public.subcategories sub ON n.subcategory_id = sub.id
    LEFT JOIN public.contests c ON c.season_id = n.season_id 
      AND c.contest_type = 'BLUE_PUBLIC' 
      AND c.category_id = sub.category_id
    WHERE n.season_id = p_season_id
      AND n.status = 'approved'
  ),
  ranked_nominees AS (
    SELECT 
      *,
      -- Final score: 40% public + 60% jury
      ROUND((0.40 * public_score) + (0.60 * jury_score), 2) as final_score,
      RANK() OVER (PARTITION BY category_id ORDER BY (0.40 * public_score) + (0.60 * jury_score) DESC) as result_rank
    FROM nominee_scores
  )
  INSERT INTO public.results (
    season_id, contest_id, category_id, nominee_id,
    public_votes, public_score, jury_score, final_score, rank, is_winner,
    computation_id, computation_inputs, result_status, computed_at
  )
  SELECT 
    season_id, contest_id, category_id, nominee_id,
    public_votes, public_score, jury_score, final_score,
    result_rank, result_rank = 1,
    v_computation_id,
    jsonb_build_object('public_weight', 0.40, 'jury_weight', 0.60, 'computation_time', now()),
    'COMPUTED', now()
  FROM ranked_nominees
  ON CONFLICT (season_id, nominee_id) 
  DO UPDATE SET
    public_votes = EXCLUDED.public_votes,
    public_score = EXCLUDED.public_score,
    jury_score = EXCLUDED.jury_score,
    final_score = EXCLUDED.final_score,
    rank = EXCLUDED.rank,
    is_winner = EXCLUDED.is_winner,
    computation_id = EXCLUDED.computation_id,
    result_status = 'COMPUTED',
    computed_at = now(),
    updated_at = now();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- Log computation event
  INSERT INTO public.audit_events (action, entity_type, actor_role, metadata)
  VALUES (
    'results_computed', 'results', 'system',
    jsonb_build_object(
      'season_id', p_season_id,
      'contest_type', 'BLUE_GARNET',
      'computation_id', v_computation_id,
      'results_count', v_count
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'computation_id', v_computation_id,
    'results_count', v_count
  );
END;
$$;

-- 3. Function to publish results
CREATE OR REPLACE FUNCTION public.publish_results(p_season_id UUID, p_contest_type TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_user_id UUID := auth.uid();
BEGIN
  -- Verify admin role
  IF NOT public.has_role(v_user_id, 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Admin role required');
  END IF;
  
  UPDATE public.results
  SET 
    result_status = 'PUBLISHED',
    published_at = now(),
    published_by = v_user_id,
    updated_at = now()
  WHERE season_id = p_season_id
    AND result_status = 'COMPUTED'
    AND contest_id IN (
      SELECT id FROM public.contests 
      WHERE contest_type::text = p_contest_type
    );
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- Log publish event
  INSERT INTO public.audit_events (action, entity_type, actor_id, metadata)
  VALUES (
    'results_published', 'results', v_user_id,
    jsonb_build_object(
      'season_id', p_season_id,
      'contest_type', p_contest_type,
      'results_count', v_count
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'published_count', v_count
  );
END;
$$;

-- 4. Function to detect fraud patterns
CREATE OR REPLACE FUNCTION public.detect_vote_fraud(p_season_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_flags_created INTEGER := 0;
BEGIN
  -- Detect burst voting (>10 votes in 60 seconds from same device)
  INSERT INTO public.fraud_flags (
    season_id, flag_type, severity, device_hash, vote_count, time_window_seconds, description, evidence
  )
  SELECT 
    p_season_id,
    'BURST',
    CASE WHEN COUNT(*) > 20 THEN 'high' ELSE 'medium' END,
    v.device_hash,
    COUNT(*)::integer,
    60,
    'Unusual voting burst detected',
    jsonb_build_object('vote_ids', array_agg(v.id))
  FROM public.votes v
  WHERE v.season_id = p_season_id
    AND v.device_hash IS NOT NULL
    AND v.created_at > now() - interval '1 hour'
  GROUP BY v.device_hash
  HAVING COUNT(*) > 10;
  
  GET DIAGNOSTICS v_flags_created = ROW_COUNT;
  
  -- Detect device reuse across voters
  INSERT INTO public.fraud_flags (
    season_id, flag_type, severity, device_hash, vote_count, description, evidence
  )
  SELECT 
    p_season_id,
    'DEVICE_REUSE',
    'high',
    v.device_hash,
    COUNT(DISTINCT v.voter_id)::integer,
    'Same device used by multiple voters',
    jsonb_build_object('voter_ids', array_agg(DISTINCT v.voter_id))
  FROM public.votes v
  WHERE v.season_id = p_season_id
    AND v.device_hash IS NOT NULL
  GROUP BY v.device_hash
  HAVING COUNT(DISTINCT v.voter_id) > 3;
  
  RETURN jsonb_build_object(
    'success', true,
    'flags_created', v_flags_created
  );
END;
$$;