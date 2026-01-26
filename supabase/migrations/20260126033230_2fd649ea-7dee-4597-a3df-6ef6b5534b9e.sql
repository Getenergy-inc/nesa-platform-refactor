-- Jury Assignments table
CREATE TABLE public.jury_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_user_id UUID NOT NULL,
  nominee_id UUID NOT NULL REFERENCES nominees(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  category_id UUID REFERENCES categories(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  scored_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'recused')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(judge_user_id, nominee_id, season_id)
);

-- COI Declarations table
CREATE TABLE public.coi_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_user_id UUID NOT NULL,
  nominee_id UUID NOT NULL REFERENCES nominees(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  declared_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(judge_user_id, nominee_id)
);

-- Content Pages table (CMS)
CREATE TABLE public.content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQs table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Results table (for Blue Garnet aggregation)
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_id UUID NOT NULL REFERENCES nominees(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  public_votes INT DEFAULT 0,
  public_score NUMERIC(5,2) DEFAULT 0,
  jury_score NUMERIC(5,2) DEFAULT 0,
  final_score NUMERIC(5,2) DEFAULT 0,
  rank INT,
  tier TEXT CHECK (tier IN ('platinum', 'gold', 'blue_garnet', 'icon')),
  is_winner BOOLEAN DEFAULT false,
  computed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(nominee_id, season_id, category_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.jury_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coi_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jury_assignments
CREATE POLICY "Judges view own assignments" ON public.jury_assignments
  FOR SELECT USING (judge_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'jury'::app_role));

CREATE POLICY "Admin manages assignments" ON public.jury_assignments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Judges can update own assignments" ON public.jury_assignments
  FOR UPDATE USING (judge_user_id = auth.uid() AND has_role(auth.uid(), 'jury'::app_role));

-- RLS Policies for coi_declarations
CREATE POLICY "Judges declare COI" ON public.coi_declarations
  FOR INSERT WITH CHECK (judge_user_id = auth.uid() AND has_role(auth.uid(), 'jury'::app_role));

CREATE POLICY "COI viewable by admin and owner" ON public.coi_declarations
  FOR SELECT USING (judge_user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_pages
CREATE POLICY "Published pages public" ON public.content_pages
  FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin manages content" ON public.content_pages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for faqs
CREATE POLICY "Active FAQs public" ON public.faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manages FAQs" ON public.faqs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for results
CREATE POLICY "Results public when stage open" ON public.results
  FOR SELECT USING (is_stage_open('results'::stage_action) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'jury'::app_role));

CREATE POLICY "Admin manages results" ON public.results
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at triggers for new tables
CREATE TRIGGER update_jury_assignments_updated_at
  BEFORE UPDATE ON public.jury_assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON public.content_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_results_updated_at
  BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();