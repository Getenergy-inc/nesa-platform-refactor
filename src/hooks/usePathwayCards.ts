import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PathwayCardRow = {
  id: string;
  category: string;
  headline: string;
  award_line: string;
  description: string;
  cta: string;
  href: string;
  image_url: string | null;
  accent_label: string;
  visual_gradient: string;
  display_order: number;
  is_active: boolean;
};

export function usePathwayCards() {
  const [cards, setCards] = useState<PathwayCardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pathway_cards")
      .select("*")
      .order("display_order", { ascending: true });
    if (!error && data) setCards(data as PathwayCardRow[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { cards, loading, refresh };
}
