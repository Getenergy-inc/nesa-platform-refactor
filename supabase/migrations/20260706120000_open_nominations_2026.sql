-- Phase 0 — Open the nominations stage for the ACTIVE season.
--
-- Root cause fixed here: every existing stage_config row pointed at the
-- 2025 season (is_active = false), while is_stage_open() only joins the
-- ACTIVE season. The join found no row for 2026, so COALESCE(..., false)
-- reported nominations as CLOSED even though a "nominations / is_open=true"
-- row existed (under the wrong season).
--
-- This migration seeds a stage_config row for the currently active season
-- so is_stage_open('nominations') returns true. Idempotent: safe to re-run.

INSERT INTO public.stage_config (season_id, action, is_open, opens_at)
SELECT s.id, 'nominations'::public.stage_action, true, now()
FROM public.seasons s
WHERE s.is_active = true
ON CONFLICT (season_id, action)
DO UPDATE SET is_open = EXCLUDED.is_open,
              opens_at = COALESCE(public.stage_config.opens_at, EXCLUDED.opens_at),
              updated_at = now();
