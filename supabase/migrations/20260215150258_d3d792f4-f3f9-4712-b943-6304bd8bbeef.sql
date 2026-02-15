
-- =============================================
-- MISSING TABLES: ambassadors, volunteers, scef_board_members
-- =============================================

-- 1. Ambassadors
CREATE TABLE public.ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  appointed_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ambassadors are viewable by everyone"
  ON public.ambassadors FOR SELECT USING (true);

CREATE POLICY "Admins can manage ambassadors"
  ON public.ambassadors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own ambassador record"
  ON public.ambassadors FOR SELECT
  USING (auth.uid() = user_id);

CREATE TRIGGER update_ambassadors_updated_at
  BEFORE UPDATE ON public.ambassadors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Volunteers
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  joined_date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  responsibilities TEXT,
  volunteer_type TEXT DEFAULT 'general' CHECK (volunteer_type IN ('general', 'bod_monitor', 'field_reporter', 'translator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers are viewable by everyone"
  ON public.volunteers FOR SELECT USING (true);

CREATE POLICY "Admins can manage volunteers"
  ON public.volunteers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own volunteer record"
  ON public.volunteers FOR SELECT
  USING (auth.uid() = user_id);

CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. SCEF Board of Directors
CREATE TABLE public.scef_board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  role_title TEXT NOT NULL DEFAULT 'Board Member',
  bio TEXT,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  appointed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scef_board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board members are viewable by everyone"
  ON public.scef_board_members FOR SELECT USING (true);

CREATE POLICY "Admins can manage board members"
  ON public.scef_board_members FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_scef_board_updated_at
  BEFORE UPDATE ON public.scef_board_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes
CREATE INDEX idx_ambassadors_region ON public.ambassadors(region_id);
CREATE INDEX idx_ambassadors_user ON public.ambassadors(user_id);
CREATE INDEX idx_volunteers_region ON public.volunteers(region_id);
CREATE INDEX idx_volunteers_type ON public.volunteers(volunteer_type);
CREATE INDEX idx_scef_board_region ON public.scef_board_members(region_id);
CREATE INDEX idx_scef_board_active ON public.scef_board_members(is_active);
