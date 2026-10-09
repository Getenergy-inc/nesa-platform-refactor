
ALTER TABLE public.pathway_cards
  ADD COLUMN IF NOT EXISTS story text,
  ADD COLUMN IF NOT EXISTS preview_summary text,
  ADD COLUMN IF NOT EXISTS video_title text,
  ADD COLUMN IF NOT EXISTS video_id text,
  ADD COLUMN IF NOT EXISTS poster_alt text,
  ADD COLUMN IF NOT EXISTS action_words text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS animated_phrases text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS secondary_cta_label text,
  ADD COLUMN IF NOT EXISTS secondary_cta_href text,
  ADD COLUMN IF NOT EXISTS engagement_cta_label text;
