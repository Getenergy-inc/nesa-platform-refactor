drop policy if exists "Public can read verified influencer nominees" on public.influencer_impact_nominees;

create policy "Public can read non-rejected influencer nominees"
on public.influencer_impact_nominees
for select
to anon, authenticated
using (verification_status in ('VERIFIED','PENDING'));