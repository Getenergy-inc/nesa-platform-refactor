-- Activate NESA Africa 2026 as the current season
UPDATE public.seasons SET is_active = false WHERE year != 2026;

INSERT INTO public.seasons (year, name, is_active)
VALUES (2026, 'NESA Africa 2026', true)
ON CONFLICT (year) DO UPDATE SET name = EXCLUDED.name, is_active = true;