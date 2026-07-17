import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function IconJuryProfile() {
  const { user } = useAuth();
  const [judge, setJudge] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: j } = await supabase.from("icon_judges").select("*").eq("user_id", user.id).maybeSingle();
      setJudge(j);
      if (j?.id) {
        const { data: o } = await supabase.from("icon_judge_onboarding").select("*").eq("judge_id", j.id).maybeSingle();
        setOnboarding(o);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="p-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gold" /></div>;

  const steps = [
    ["identity_verified", "Identity verified"],
    ["profile_completed", "Profile completed"],
    ["confidentiality_signed", "Confidentiality agreement signed"],
    ["conflict_declared", "Conflicts declared"],
    ["scoring_orientation", "Scoring orientation completed"],
    ["sample_review", "Sample review completed"],
    ["code_of_conduct", "Code of conduct accepted"],
  ] as const;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Icon Jury</p>
        <h1 className="text-2xl font-semibold">Judge Profile</h1>
      </div>
      <div className="rounded-xl border border-gold/20 bg-black/40 p-5 space-y-2 text-sm">
        <p><span className="text-white/50">Name:</span> {judge?.full_name ?? "—"}</p>
        <p><span className="text-white/50">Email:</span> {judge?.email ?? user?.email}</p>
        <p><span className="text-white/50">Region:</span> {judge?.region ?? "—"}</p>
        <p><span className="text-white/50">Country:</span> {judge?.country ?? "—"}</p>
        <p><span className="text-white/50">Status:</span> <span className="text-gold">{judge?.status ?? "—"}</span></p>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-5">
        <h2 className="text-sm font-semibold mb-3">Onboarding checklist</h2>
        <ul className="space-y-2 text-sm">
          {steps.map(([k, label]) => (
            <li key={k} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${onboarding?.[k] ? "bg-gold" : "bg-white/20"}`} />
              <span className={onboarding?.[k] ? "text-white" : "text-white/50"}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
