alter table public.influencer_impact_nominees
  drop constraint influencer_impact_nominees_nominee_region_check;

alter table public.influencer_impact_nominees
  add constraint influencer_impact_nominees_nominee_region_check
  check (nominee_region = any (array[
    'West Africa','East Africa','Southern Africa','Central Africa','North Africa',
    'Horn of Africa','Indian Ocean Islands','African Diaspora','Global'
  ]));