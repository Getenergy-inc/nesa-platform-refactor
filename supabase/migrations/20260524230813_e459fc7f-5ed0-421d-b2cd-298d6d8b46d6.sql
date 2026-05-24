
-- Preserve legacy table
ALTER TABLE IF EXISTS public.volunteers RENAME TO volunteers_legacy;

-- ============ ENUMS ============
DO $$ BEGIN CREATE TYPE public.volunteer_visibility AS ENUM ('public','hidden','alumni'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.volunteer_verification AS ENUM ('pending','approved','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.volunteer_task_status AS ENUM ('assigned','in_progress','submitted','approved','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.volunteer_referral_status AS ENUM ('invited','signed_up','converted'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.volunteer_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text, icon text, color text,
  lead_user_id uuid,
  member_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.volunteer_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL, label text NOT NULL,
  description text, icon text, tier text NOT NULL DEFAULT 'bronze',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  photo_url text, headline text, bio text,
  country text, region text, city text,
  chapter_id uuid,
  team_slug text REFERENCES public.volunteer_teams(slug) ON DELETE SET NULL,
  role text,
  badges text[] NOT NULL DEFAULT '{}',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  contribution_score integer NOT NULL DEFAULT 0,
  referral_code text UNIQUE NOT NULL,
  referral_count integer NOT NULL DEFAULT 0,
  tasks_completed integer NOT NULL DEFAULT 0,
  events_count integer NOT NULL DEFAULT 0,
  shares_count integer NOT NULL DEFAULT 0,
  profile_views integer NOT NULL DEFAULT 0,
  verification_status public.volunteer_verification NOT NULL DEFAULT 'approved',
  visibility_status public.volunteer_visibility NOT NULL DEFAULT 'public',
  is_featured boolean NOT NULL DEFAULT false,
  joined_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_volunteers_team ON public.volunteers(team_slug);
CREATE INDEX idx_volunteers_country ON public.volunteers(country);
CREATE INDEX idx_volunteers_vis ON public.volunteers(visibility_status, verification_status);
CREATE INDEX idx_volunteers_score ON public.volunteers(contribution_score DESC);

CREATE TABLE public.volunteer_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
  title text NOT NULL, description text,
  status public.volunteer_task_status NOT NULL DEFAULT 'assigned',
  points integer NOT NULL DEFAULT 10,
  proof_url text, proof_notes text,
  assigned_by uuid, approved_by uuid, due_date date,
  submitted_at timestamptz, approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_vtasks_vol ON public.volunteer_tasks(volunteer_id, status);

CREATE TABLE public.volunteer_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
  referred_email text, referred_name text, referred_user_id uuid,
  status public.volunteer_referral_status NOT NULL DEFAULT 'invited',
  channel text, converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_vrefs_vol ON public.volunteer_referrals(volunteer_id, status);

CREATE TABLE public.volunteer_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES public.volunteers(id) ON DELETE CASCADE,
  action text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_valog_vol ON public.volunteer_activity_logs(volunteer_id, created_at DESC);

-- Helpers
CREATE OR REPLACE FUNCTION public.generate_volunteer_referral_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
DECLARE v_code text; v_exists boolean;
BEGIN
  LOOP
    v_code := 'V-' || UPPER(SUBSTRING(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.volunteers WHERE referral_code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END $fn$;

CREATE OR REPLACE FUNCTION public.slugify(p text)
RETURNS text LANGUAGE sql IMMUTABLE AS $fn$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(p,'')), '[^a-z0-9]+', '-', 'g'))
$fn$;

CREATE OR REPLACE FUNCTION public.volunteer_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
DECLARE v_slug text; v_n int := 0;
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_volunteer_referral_code();
  END IF;
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    v_slug := public.slugify(NEW.full_name);
    WHILE EXISTS(SELECT 1 FROM public.volunteers WHERE slug = CASE WHEN v_n=0 THEN v_slug ELSE v_slug||'-'||v_n END) LOOP
      v_n := v_n + 1;
    END LOOP;
    NEW.slug := CASE WHEN v_n=0 THEN v_slug ELSE v_slug||'-'||v_n END;
  END IF;
  RETURN NEW;
END $fn$;

CREATE TRIGGER trg_vol_before_insert BEFORE INSERT ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.volunteer_before_insert();
CREATE TRIGGER trg_vol_updated BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_vteams_updated BEFORE UPDATE ON public.volunteer_teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_vtasks_updated BEFORE UPDATE ON public.volunteer_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.volunteer_task_after_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    UPDATE public.volunteers
      SET contribution_score = contribution_score + COALESCE(NEW.points, 10),
          tasks_completed = tasks_completed + 1
      WHERE id = NEW.volunteer_id;
    INSERT INTO public.volunteer_activity_logs(volunteer_id, action, metadata)
      VALUES (NEW.volunteer_id, 'task_approved',
              jsonb_build_object('task_id', NEW.id, 'title', NEW.title, 'points', NEW.points));
  END IF;
  RETURN NEW;
END $fn$;
CREATE TRIGGER trg_vtask_after_update AFTER UPDATE ON public.volunteer_tasks
  FOR EACH ROW EXECUTE FUNCTION public.volunteer_task_after_update();

CREATE OR REPLACE FUNCTION public.volunteer_referral_after_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
BEGIN
  IF NEW.status = 'converted' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'converted') THEN
    UPDATE public.volunteers
      SET contribution_score = contribution_score + 25,
          referral_count = referral_count + 1
      WHERE id = NEW.volunteer_id;
    INSERT INTO public.volunteer_activity_logs(volunteer_id, action, metadata)
      VALUES (NEW.volunteer_id, 'referral_converted',
              jsonb_build_object('referral_id', NEW.id, 'name', NEW.referred_name));
  END IF;
  RETURN NEW;
END $fn$;
CREATE TRIGGER trg_vref_after AFTER INSERT OR UPDATE ON public.volunteer_referrals
  FOR EACH ROW EXECUTE FUNCTION public.volunteer_referral_after_change();

CREATE OR REPLACE FUNCTION public.volunteer_team_count_sync()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $fn$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.team_slug IS NOT NULL THEN
      UPDATE public.volunteer_teams SET member_count = member_count + 1 WHERE slug = NEW.team_slug;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.team_slug IS NOT NULL THEN
      UPDATE public.volunteer_teams SET member_count = GREATEST(0, member_count - 1) WHERE slug = OLD.team_slug;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.team_slug IS DISTINCT FROM OLD.team_slug THEN
    IF OLD.team_slug IS NOT NULL THEN
      UPDATE public.volunteer_teams SET member_count = GREATEST(0, member_count - 1) WHERE slug = OLD.team_slug;
    END IF;
    IF NEW.team_slug IS NOT NULL THEN
      UPDATE public.volunteer_teams SET member_count = member_count + 1 WHERE slug = NEW.team_slug;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $fn$;
CREATE TRIGGER trg_vol_team_sync AFTER INSERT OR UPDATE OR DELETE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.volunteer_team_count_sync();

CREATE OR REPLACE VIEW public.volunteer_leaderboard WITH (security_invoker=true) AS
SELECT id, slug, full_name, photo_url, country, team_slug, badges,
       contribution_score, referral_count, tasks_completed, joined_at
FROM public.volunteers
WHERE visibility_status = 'public' AND verification_status = 'approved'
ORDER BY contribution_score DESC;

-- RLS
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved public volunteers" ON public.volunteers
  FOR SELECT USING (visibility_status = 'public' AND verification_status = 'approved');
CREATE POLICY "Volunteer sees own profile" ON public.volunteers
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Volunteer updates own profile" ON public.volunteers
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authenticated creates own volunteer" ON public.volunteers
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage volunteers" ON public.volunteers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Public view teams" ON public.volunteer_teams FOR SELECT USING (true);
CREATE POLICY "Admins manage teams" ON public.volunteer_teams FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Public view badges" ON public.volunteer_badges FOR SELECT USING (true);
CREATE POLICY "Admins manage badges" ON public.volunteer_badges FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Volunteer sees own tasks" ON public.volunteer_tasks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_tasks.volunteer_id AND v.user_id = auth.uid()));
CREATE POLICY "Volunteer updates own task" ON public.volunteer_tasks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_tasks.volunteer_id AND v.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_tasks.volunteer_id AND v.user_id = auth.uid()));
CREATE POLICY "Admins manage tasks" ON public.volunteer_tasks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Volunteer sees own referrals" ON public.volunteer_referrals FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_referrals.volunteer_id AND v.user_id = auth.uid()));
CREATE POLICY "Volunteer creates own referrals" ON public.volunteer_referrals FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_referrals.volunteer_id AND v.user_id = auth.uid()));
CREATE POLICY "Admins manage referrals" ON public.volunteer_referrals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Volunteer sees own logs" ON public.volunteer_activity_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_activity_logs.volunteer_id AND v.user_id = auth.uid()));
CREATE POLICY "Admins see all logs" ON public.volunteer_activity_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Public view logs for public volunteers" ON public.volunteer_activity_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.volunteers v WHERE v.id = volunteer_activity_logs.volunteer_id
         AND v.visibility_status='public' AND v.verification_status='approved'));

-- Seeds
INSERT INTO public.volunteer_teams (slug, name, description, icon, color) VALUES
  ('technology','Technology Team','Engineers building the platform','Code','#3b82f6'),
  ('design','Design & Creative Team','Visual identity, UI, and brand','Palette','#ec4899'),
  ('media','Media & Content Team','Storytelling, video, social','Video','#f59e0b'),
  ('data','Data & Research Team','Research, analytics, evidence','BarChart3','#10b981'),
  ('content','Editorial & Writing Team','Articles, copy, translations','FileText','#8b5cf6'),
  ('gala','Gala & Events Team','Awards Gala production','Sparkles','#d4af37'),
  ('ambassadors','Ambassador Team','Country & campus ambassadors','Globe2','#ef4444'),
  ('chapters','Chapter Coordinators','Local chapter leadership','Users','#06b6d4'),
  ('partnerships','Partnerships Team','Sponsors and institutional partners','Handshake','#84cc16'),
  ('support','Community Support','Helpdesk & moderation','HeartHandshake','#f97316');

INSERT INTO public.volunteer_badges (code, label, description, icon, tier) VALUES
  ('verified','Verified Contributor','Identity confirmed','BadgeCheck','silver'),
  ('founding','Founding Volunteer','Joined before launch','Star','gold'),
  ('lead','Team Lead','Leads a functional team','Crown','gold'),
  ('ambassador','Ambassador','Country or campus ambassador','Globe2','gold'),
  ('chapter_coordinator','Chapter Coordinator','Leads a local chapter','Users','gold'),
  ('bronze','Bronze Contributor','100+ contribution points','Award','bronze'),
  ('silver','Silver Contributor','500+ contribution points','Award','silver'),
  ('gold','Gold Contributor','1500+ contribution points','Award','gold'),
  ('continental','Continental Builder','Cross-regional impact','Trophy','platinum');
