GRANT SELECT (
  id, subcategory_id, season_id, name, slug, title, organization, bio, photo_url, logo_url,
  status, is_platinum, jury_score, final_score, renomination_count, region, country,
  acceptance_status, nrc_verified, created_at, updated_at, publication_status, profile_status,
  profile_completion_score, award_family, recognition_class, region_slug, zone_slug, state_slug,
  category_fit_summary, impact_area, social_profile_links, public_documents, media_gallery,
  published_at, data_source, consent_confirmed, evidence_urls, work_done, website, linkedin_url,
  video_url, youtube_video_id, award_slug, category_slug, classification_slug
) ON public.nominees TO anon, authenticated;