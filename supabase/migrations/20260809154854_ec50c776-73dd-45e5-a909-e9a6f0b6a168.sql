create or replace function public.education_impact_public_schools()
returns table (
  id uuid,
  name text,
  school_type text,
  country text,
  region_id uuid,
  student_count integer,
  description text,
  photo_urls text[],
  intervention_status text,
  intervention_notes text,
  intervention_start_date date,
  intervention_end_date date,
  is_supported boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.name,
    s.school_type::text,
    s.country,
    s.region_id,
    s.student_count,
    s.description,
    s.photo_urls,
    w.intervention_status::text,
    w.intervention_notes,
    w.intervention_start_date,
    w.intervention_end_date,
    (w.id is not null) as is_supported
  from public.rebuild_schools s
  left join public.rebuild_winners w on w.school_id = s.id
  where s.is_active is true
    and s.verification_status = 'verified'
$$;

revoke all on function public.education_impact_public_schools() from public;
grant execute on function public.education_impact_public_schools() to anon, authenticated, service_role;