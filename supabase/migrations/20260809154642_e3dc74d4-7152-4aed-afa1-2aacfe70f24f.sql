create or replace function public.education_impact_public_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'schools_supported', (
      select count(*) from public.rebuild_winners
    ),
    'learners_reached', (
      select coalesce(sum(s.student_count), 0)
      from public.rebuild_winners w
      join public.rebuild_schools s on s.id = w.school_id
    ),
    'communities_reached', (
      select count(distinct w.school_id) from public.rebuild_winners w
    ),
    'countries', (
      select count(distinct s.country)
      from public.rebuild_winners w
      join public.rebuild_schools s on s.id = w.school_id
      where s.country is not null and btrim(s.country) <> ''
    ),
    'regions', (
      select count(distinct w.region_id) from public.rebuild_winners w where w.region_id is not null
    ),
    'projects_completed', (
      select count(*) from public.rebuild_winners
      where intervention_status = 'completed'
    ),
    'projects_in_progress', (
      select count(*) from public.rebuild_winners
      where intervention_status in ('in_progress','ongoing','started')
    ),
    'schools_nominated', (
      select count(*) from public.rebuild_nominations
    ),
    'friends_of_eduaid', (
      select count(*) from public.donations
      where status in ('completed','succeeded','paid')
    )
  );
$$;

revoke all on function public.education_impact_public_stats() from public;
grant execute on function public.education_impact_public_stats() to anon, authenticated, service_role;