
CREATE TABLE IF NOT EXISTS public.pathway_cards (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  headline TEXT NOT NULL,
  award_line TEXT NOT NULL,
  description TEXT NOT NULL,
  cta TEXT NOT NULL,
  href TEXT NOT NULL,
  image_url TEXT,
  accent_label TEXT NOT NULL DEFAULT '',
  visual_gradient TEXT NOT NULL DEFAULT 'from-gold/40 via-emerald-900/40 to-charcoal',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pathway_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pathway cards are public readable"
  ON public.pathway_cards FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert pathway cards"
  ON public.pathway_cards FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pathway cards"
  ON public.pathway_cards FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pathway cards"
  ON public.pathway_cards FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER pathway_cards_set_updated_at
  BEFORE UPDATE ON public.pathway_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
