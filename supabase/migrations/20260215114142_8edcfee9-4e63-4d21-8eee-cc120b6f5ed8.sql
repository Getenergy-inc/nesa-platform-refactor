
-- Fix security definer view by making it security_invoker
DROP VIEW IF EXISTS public.rebuild_school_vote_counts;

CREATE OR REPLACE VIEW public.rebuild_school_vote_counts
WITH (security_invoker = true) AS
SELECT 
  rs.id as school_id, rs.name as school_name, rs.school_type,
  rs.country, rs.region_id, rv.season_id, COUNT(rv.id) as vote_count
FROM public.rebuild_schools rs
LEFT JOIN public.rebuild_votes rv ON rv.school_id = rs.id
WHERE rs.verification_status = 'verified' AND rs.is_active = true
GROUP BY rs.id, rs.name, rs.school_type, rs.country, rs.region_id, rv.season_id;
