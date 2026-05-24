import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Trophy, Share2, BadgeCheck, Target, Award, ArrowRight,
  User, ListChecks, BarChart3, Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { VolunteerReferralBlock } from "@/components/volunteers/VolunteerReferralBlock";
import { tierFor, TIER_LABEL, TEAM_LABELS, type TeamSlug } from "@/lib/volunteersData";

interface MyVol {
  id: string;
  slug: string;
  full_name: string;
  team_slug: string | null;
  contribution_score: number;
  referral_code: string;
  referral_count: number;
  tasks_completed: number;
  badges: string[] | null;
  photo_url: string | null;
}

function Inner() {
  const { user } = useAuth();
  const [me, setMe] = useState<MyVol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("volunteers")
        .select("id,slug,full_name,team_slug,contribution_score,referral_code,referral_count,tasks_completed,badges,photo_url")
        .eq("user_id", user.id)
        .maybeSingle();
      setMe(data as MyVol | null);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-charcoal flex items-center justify-center text-white/60">Loading…</div>;

  if (!me) {
    return (
      <div className="min-h-screen bg-charcoal pb-24">
        <div className="container mx-auto px-4 pt-16 max-w-2xl">
          <Card className="border-gold/30 bg-gradient-to-br from-charcoal to-black p-8 text-center">
            <Award className="h-10 w-10 text-gold mx-auto mb-3" />
            <h1 className="font-playfair text-3xl text-gold mb-2">Activate your volunteer profile</h1>
            <p className="text-white/70 mb-6">You don't have a public volunteer profile yet. Apply to join the movement and your dashboard will activate immediately.</p>
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link to="/volunteer">Become a Volunteer</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const tier = tierFor(me.contribution_score);

  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet><title>My Volunteer Dashboard — NESA-Africa</title></Helmet>
      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-gold/20 overflow-hidden">
            {me.photo_url ? <img src={me.photo_url} alt="" className="h-full w-full object-cover" /> :
              <div className="h-full w-full flex items-center justify-center text-gold text-lg">{me.full_name.charAt(0)}</div>}
          </div>
          <div>
            <h1 className="font-playfair text-2xl md:text-3xl text-gold">Welcome, {me.full_name.split(" ")[0]}</h1>
            <p className="text-white/60 text-sm">{TIER_LABEL[tier]} · {me.team_slug ? TEAM_LABELS[me.team_slug as TeamSlug] : "Unassigned team"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Score", value: me.contribution_score, icon: Trophy },
            { label: "Referrals", value: me.referral_count, icon: Share2 },
            { label: "Tasks", value: me.tasks_completed, icon: BadgeCheck },
            { label: "Badges", value: (me.badges ?? []).length, icon: Award },
          ].map((s) => (
            <Card key={s.label} className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-4 text-center">
              <s.icon className="h-5 w-5 text-gold mx-auto mb-1" />
              <div className="font-bold text-gold text-2xl">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">{s.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: "/volunteer/profile", label: "My Profile", icon: User, desc: "Edit bio, photo, socials" },
              { to: "/volunteer/tasks", label: "My Tasks", icon: ListChecks, desc: "Assigned tasks & proofs" },
              { to: "/volunteer/referrals", label: "My Referrals", icon: Share2, desc: "Track conversions" },
              { to: "/volunteer/analytics", label: "Analytics", icon: BarChart3, desc: "Views, clicks, shares" },
              { to: `/volunteers/${me.slug}`, label: "Public Profile", icon: Target, desc: "View as visitors do" },
              { to: "/volunteer/settings", label: "Settings", icon: Settings, desc: "Privacy & notifications" },
            ].map((a) => (
              <Link key={a.to} to={a.to}>
                <Card className="border-gold/20 bg-gradient-to-br from-charcoal to-black p-5 hover:border-gold/60 transition h-full">
                  <a.icon className="h-5 w-5 text-gold mb-2" />
                  <div className="font-medium text-white flex items-center justify-between">
                    {a.label} <ArrowRight className="h-4 w-4 text-gold/60" />
                  </div>
                  <div className="text-xs text-white/50 mt-1">{a.desc}</div>
                </Card>
              </Link>
            ))}
          </div>
          <VolunteerReferralBlock referralCode={me.referral_code} volunteerName={me.full_name} />
        </div>
      </section>
    </div>
  );
}

export default function VolunteerDashboard() {
  return <ProtectedRoute><Inner /></ProtectedRoute>;
}
