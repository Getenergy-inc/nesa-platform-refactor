
-- Update compute_gold_results to mark top 3 per subcategory as winners (instead of just #1)
CREATE OR REPLACE FUNCTION public.compute_gold_results(p_season_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Insert/update computed results per subcategory — TOP 3 are winners
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
    result_rank,
    result_rank <= 3,  -- Top 3 per subcategory are Gold Certificate winners
    v_computation_id,
    jsonb_build_object('computation_time', now(), 'winners_per_subcategory', 3),
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
      'results_count', v_count,
      'winners_per_subcategory', 3
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'computation_id', v_computation_id,
    'results_count', v_count
  );
END;
$function$;
