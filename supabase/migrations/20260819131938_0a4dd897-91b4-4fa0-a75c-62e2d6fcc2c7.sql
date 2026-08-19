CREATE TYPE public.recruitment_pipeline_stage AS ENUM ('under_review','awaiting_info','draft_pending_approval','contacted_needs_verification','no_response_required','withdrawn_closed');
CREATE TYPE public.recruitment_vacancy_status AS ENUM ('active','expiring_soon','needs_correction','expired','under_review');

CREATE TABLE public.recruitment_vacancy_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  status public.recruitment_vacancy_status NOT NULL DEFAULT 'active',
  notes TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recruitment_vacancy_categories TO authenticated;
GRANT ALL ON public.recruitment_vacancy_categories TO service_role;
ALTER TABLE public.recruitment_vacancy_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage recruitment vacancy categories"
  ON public.recruitment_vacancy_categories FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.recruitment_applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.recruitment_vacancy_categories(id) ON DELETE CASCADE,
  current_status TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT '',
  pipeline_stage public.recruitment_pipeline_stage NOT NULL DEFAULT 'under_review',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recruitment_applicants TO authenticated;
GRANT ALL ON public.recruitment_applicants TO service_role;
ALTER TABLE public.recruitment_applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage recruitment applicants"
  ON public.recruitment_applicants FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_recruitment_applicants_category ON public.recruitment_applicants(category_id);
CREATE INDEX idx_recruitment_applicants_stage ON public.recruitment_applicants(pipeline_stage);

CREATE TRIGGER update_recruitment_vacancy_categories_updated_at
  BEFORE UPDATE ON public.recruitment_vacancy_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recruitment_applicants_updated_at
  BEFORE UPDATE ON public.recruitment_applicants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();