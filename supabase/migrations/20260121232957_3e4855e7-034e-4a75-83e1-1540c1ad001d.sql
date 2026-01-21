-- Fix overly permissive audit logs policy
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Only authenticated users can create audit logs (system creates them on their behalf)
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert initial season for 2025
INSERT INTO public.seasons (year, name, is_active)
VALUES (2025, 'NESA Africa 2025', true);

-- Insert stage configs for current season
INSERT INTO public.stage_config (season_id, action, is_open, opens_at, closes_at)
SELECT 
    s.id,
    a.action,
    CASE WHEN a.action = 'nominations' THEN true ELSE false END,
    NULL,
    NULL
FROM public.seasons s
CROSS JOIN (
    VALUES 
        ('nominations'::stage_action),
        ('public_voting'::stage_action),
        ('jury_scoring'::stage_action),
        ('results'::stage_action),
        ('certificates'::stage_action)
) AS a(action)
WHERE s.is_active = true;

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon_name, display_order) VALUES
('Music', 'music', 'Excellence in African Music', 'Music', 1),
('Film & Television', 'film-television', 'Excellence in Film and Television', 'Film', 2),
('Sports', 'sports', 'Excellence in Sports', 'Trophy', 3),
('Business & Entrepreneurship', 'business', 'Excellence in Business Leadership', 'Briefcase', 4),
('Technology & Innovation', 'technology', 'Excellence in Technology and Innovation', 'Cpu', 5),
('Arts & Culture', 'arts-culture', 'Excellence in Arts and Culture', 'Palette', 6),
('Leadership & Governance', 'leadership', 'Excellence in Leadership and Public Service', 'Crown', 7),
('Humanitarian', 'humanitarian', 'Excellence in Humanitarian Work', 'Heart', 8),
('Education', 'education', 'Excellence in Education', 'GraduationCap', 9),
('Health', 'health', 'Excellence in Healthcare', 'Stethoscope', 10);

-- Insert sample chapters
INSERT INTO public.chapters (name, slug, country, region) VALUES
('Nigeria', 'nigeria', 'Nigeria', 'West Africa'),
('South Africa', 'south-africa', 'South Africa', 'Southern Africa'),
('Kenya', 'kenya', 'Kenya', 'East Africa'),
('Ghana', 'ghana', 'Ghana', 'West Africa'),
('Egypt', 'egypt', 'Egypt', 'North Africa');