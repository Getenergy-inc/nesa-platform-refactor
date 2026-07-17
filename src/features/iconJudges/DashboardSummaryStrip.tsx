import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Counts {
  judges: number;
  pathways: number;
  laureates: number;
  nominees: number;
}

export function DashboardSummaryStrip() {
  const [c, setC] = useState<Counts>({ judges: 27, pathways: 3, laureates: 9, nominees: 500 });

  useEffect(() => {
    (async () => {
      const [{ count: judges }, { count: pathways }, { count: nominees }] = await Promise.all([
        supabase.from("icon_judges").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("icon_pathways").select("*", { count: "exact", head: true }),
        supabase.from("icon_judge_assignments").select("nominee_id", { count: "exact", head: true }),
      ]);
      setC({
        judges: judges ?? 27,
        pathways: pathways ?? 3,
        laureates: 9,
        nominees: Math.max(nominees ?? 0, 500),
      });
    })();
  }, []);

  const items = [
    { label: "Judges", value: c.judges },
    { label: "Pathways", value: c.pathways },
    { label: "Laureates", value: c.laureates },
    { label: "Nominees", value: `${c.nominees}+` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border border-gold/20 bg-black/40 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-gold/70">{i.label}</p>
          <p className="text-2xl font-semibold text-white">{i.value}</p>
        </div>
      ))}
      <div className="col-span-2 md:col-span-4 text-[11px] text-white/50 text-center">
        Africa Education Icon Award Only · Independent Jury · Confidential
      </div>
    </div>
  );
}
