
-- Add rebuild stage actions to enum
ALTER TYPE public.stage_action ADD VALUE IF NOT EXISTS 'rebuild_nominations';
ALTER TYPE public.stage_action ADD VALUE IF NOT EXISTS 'rebuild_voting';
