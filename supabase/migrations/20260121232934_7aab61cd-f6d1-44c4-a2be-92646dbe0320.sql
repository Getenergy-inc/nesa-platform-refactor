-- NESA.Africa Platform Database Schema
-- ==========================================

-- 1. ENUMS
-- ==========================================
CREATE TYPE public.app_role AS ENUM ('user', 'nrc', 'jury', 'chapter', 'sponsor', 'admin');
CREATE TYPE public.nomination_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'platinum');
CREATE TYPE public.vote_type AS ENUM ('public', 'jury');
CREATE TYPE public.certificate_tier AS ENUM ('gold', 'platinum', 'blue_garnet', 'icon');
CREATE TYPE public.stage_action AS ENUM ('nominations', 'public_voting', 'jury_scoring', 'results', 'certificates');
CREATE TYPE public.transaction_type AS ENUM ('donation', 'sponsorship', 'ticket');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'confirmed', 'failed', 'refunded');

-- 2. SEASON & STAGE CONFIGURATION
-- ==========================================
CREATE TABLE public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.stage_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    action stage_action NOT NULL,
    is_open BOOLEAN DEFAULT false,
    opens_at TIMESTAMPTZ,
    closes_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(season_id, action)
);

-- 3. USER PROFILES & ROLES
-- ==========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    country TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- 4. CHAPTERS (Regional)
-- ==========================================
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    region TEXT,
    description TEXT,
    logo_url TEXT,
    lead_user_id UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CATEGORIES & SUBCATEGORIES (CMS-driven)
-- ==========================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, slug)
);

-- 6. NOMINEES
-- ==========================================
CREATE TABLE public.nominees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    title TEXT,
    organization TEXT,
    bio TEXT,
    photo_url TEXT,
    evidence_urls TEXT[],
    status nomination_status DEFAULT 'pending',
    nominator_user_id UUID REFERENCES auth.users(id),
    nrc_reviewer_id UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    is_platinum BOOLEAN DEFAULT false,
    public_votes INTEGER DEFAULT 0,
    jury_score DECIMAL(5,2) DEFAULT 0,
    final_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(subcategory_id, season_id, slug)
);

-- 7. NOMINATIONS (User submissions)
-- ==========================================
CREATE TABLE public.nominations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE CASCADE NOT NULL,
    nominee_name TEXT NOT NULL,
    nominee_title TEXT,
    nominee_organization TEXT,
    nominee_bio TEXT,
    nominee_photo_url TEXT,
    evidence_urls TEXT[],
    justification TEXT,
    nominator_id UUID REFERENCES auth.users(id) NOT NULL,
    status nomination_status DEFAULT 'pending',
    nrc_reviewer_id UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_nominee_id UUID REFERENCES public.nominees(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. VOTES
-- ==========================================
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nominee_id UUID REFERENCES public.nominees(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    voter_id UUID REFERENCES auth.users(id) NOT NULL,
    vote_type vote_type NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(nominee_id, voter_id, vote_type)
);

-- 9. CERTIFICATES
-- ==========================================
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nominee_id UUID REFERENCES public.nominees(id) ON DELETE CASCADE NOT NULL,
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
    tier certificate_tier NOT NULL,
    verification_code TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_lifetime BOOLEAN DEFAULT false,
    download_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. WALLET & TRANSACTIONS (Non-custodial)
-- ==========================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'NGN',
    status transaction_status DEFAULT 'pending',
    provider TEXT,
    provider_reference TEXT,
    metadata JSONB,
    split_breakdown JSONB,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. MEDIA HUB
-- ==========================================
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    media_type TEXT NOT NULL,
    thumbnail_url TEXT,
    video_url TEXT,
    embed_code TEXT,
    duration_seconds INTEGER,
    is_live BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    season_id UUID REFERENCES public.seasons(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. AUDIT LOGS
-- ==========================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- SECURITY DEFINER FUNCTIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS app_role[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.get_current_season()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.seasons WHERE is_active = true LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_stage_open(_action stage_action)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_open 
     FROM public.stage_config sc
     JOIN public.seasons s ON sc.season_id = s.id
     WHERE s.is_active = true AND sc.action = _action),
    false
  )
$$;

-- ==========================================
-- TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON public.seasons
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_nominees_updated_at BEFORE UPDATE ON public.nominees
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_nominations_updated_at BEFORE UPDATE ON public.nominations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User Roles (admin only write, users can read own)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Seasons (public read, admin write)
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seasons are public"
ON public.seasons FOR SELECT USING (true);

CREATE POLICY "Admins can manage seasons"
ON public.seasons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Stage Config (public read, admin write)
ALTER TABLE public.stage_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stage config is public"
ON public.stage_config FOR SELECT USING (true);

CREATE POLICY "Admins can manage stages"
ON public.stage_config FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories (public read, admin write)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subcategories (public read, admin write)
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategories are public"
ON public.subcategories FOR SELECT USING (true);

CREATE POLICY "Admins can manage subcategories"
ON public.subcategories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Chapters (public read, admin/chapter write)
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapters are public"
ON public.chapters FOR SELECT USING (true);

CREATE POLICY "Admins can manage chapters"
ON public.chapters FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Chapter leads can update own chapter"
ON public.chapters FOR UPDATE USING (lead_user_id = auth.uid());

-- Nominees (public read approved, admin/nrc write)
ALTER TABLE public.nominees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved nominees are public"
ON public.nominees FOR SELECT USING (status IN ('approved', 'platinum'));

CREATE POLICY "NRC can view all nominees"
ON public.nominees FOR SELECT USING (public.has_role(auth.uid(), 'nrc') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can manage nominees"
ON public.nominees FOR ALL USING (public.has_role(auth.uid(), 'nrc') OR public.has_role(auth.uid(), 'admin'));

-- Nominations (users can create, view own; NRC can view/manage)
ALTER TABLE public.nominations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create nominations"
ON public.nominations FOR INSERT WITH CHECK (auth.uid() = nominator_id AND public.is_stage_open('nominations'));

CREATE POLICY "Users can view own nominations"
ON public.nominations FOR SELECT USING (auth.uid() = nominator_id);

CREATE POLICY "NRC can view all nominations"
ON public.nominations FOR SELECT USING (public.has_role(auth.uid(), 'nrc') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can update nominations"
ON public.nominations FOR UPDATE USING (public.has_role(auth.uid(), 'nrc') OR public.has_role(auth.uid(), 'admin'));

-- Votes (users can create when stage open, view own)
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can vote when stage open"
ON public.votes FOR INSERT WITH CHECK (
  auth.uid() = voter_id AND 
  (
    (vote_type = 'public' AND public.is_stage_open('public_voting')) OR
    (vote_type = 'jury' AND public.has_role(auth.uid(), 'jury') AND public.is_stage_open('jury_scoring'))
  )
);

CREATE POLICY "Users can view own votes"
ON public.votes FOR SELECT USING (auth.uid() = voter_id);

CREATE POLICY "Admins can view all votes"
ON public.votes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Certificates (public verification, user download own)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certificates are public for verification"
ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Admins can manage certificates"
ON public.certificates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Transactions (users see own, admins see all)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
ON public.transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Media (public read, admin write)
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published media is public"
ON public.media FOR SELECT USING (published_at IS NOT NULL OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage media"
ON public.media FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Audit Logs (admin only)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT WITH CHECK (true);